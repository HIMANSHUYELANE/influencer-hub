# Implementation Prompt: Fiverr-Like Package Pipeline (Dual-Pipeline Escrow System)

---

## CONTEXT & CURRENT SYSTEM

You are working on an influencer/creator marketplace platform. The existing system works as a **job portal**:
- Brands post **Campaigns** with a brief and budget
- Creators **apply** to campaigns with proposals
- Brand selects a creator → a **Deal** is created → payment goes into **Escrow (Razorpay)** → creator delivers → brand approves → escrow releases

The entire `Deal` model currently **requires** a `campaignId`. Every notification, dashboard query, Razorpay order, and dispute flow assumes a deal was born from a campaign.

You must now add a **second pipeline** (Package Route) without breaking the existing Campaign Route.

---

## FEATURE OVERVIEW: PACKAGE PIPELINE

Creators define **3 fixed service packages** on their profile:
- **Basic** — lowest tier
- **Standard** — mid tier
- **Premium** — top tier

Each package has: title, description, price, deliverables list, delivery days, and number of revisions allowed.

Brands can visit any creator's profile, view their packages, and **instantly purchase** a package — no campaign needed, no application, no waiting for approval. Payment flows directly into the same Escrow system. The resulting Deal follows the identical lifecycle as a campaign deal.

---

## REQUIRED IMPLEMENTATION

### STEP 1 — Database: New `CreatorPackage` Table

Create a new table called `CreatorPackage` (or `creator_packages`):

```
CreatorPackage {
  id            UUID PRIMARY KEY
  creatorId     UUID NOT NULL FK → users(id)  [index this]
  tier          ENUM('basic', 'standard', 'premium') NOT NULL
  title         VARCHAR(100) NOT NULL
  description   TEXT NOT NULL
  price         DECIMAL(10,2) NOT NULL CHECK (price > 0)
  deliverables  TEXT[] or JSON  -- list of deliverable strings
  deliveryDays  INTEGER NOT NULL CHECK (deliveryDays > 0)
  revisions     INTEGER NOT NULL DEFAULT 1 CHECK (revisions >= 0)
  isActive      BOOLEAN NOT NULL DEFAULT true
  createdAt     TIMESTAMP DEFAULT NOW()
  updatedAt     TIMESTAMP DEFAULT NOW()

  UNIQUE(creatorId, tier)  -- one row per tier per creator
}
```

**Critical constraint:** Enforce `UNIQUE(creatorId, tier)` at the database level so a creator cannot have two "basic" packages. Use upsert logic (INSERT ... ON CONFLICT DO UPDATE) in the API — never a plain INSERT.

---

### STEP 2 — Database: Modify `Deal` Table

The `Deal` table must be decoupled from requiring a campaign. Apply this migration:

```sql
-- Make campaignId nullable (it was previously required)
ALTER TABLE deals ALTER COLUMN campaign_id DROP NOT NULL;

-- Add new columns
ALTER TABLE deals ADD COLUMN origin_type VARCHAR(20) NOT NULL DEFAULT 'campaign'
  CHECK (origin_type IN ('campaign', 'package'));

ALTER TABLE deals ADD COLUMN package_tier VARCHAR(20)
  CHECK (package_tier IN ('basic', 'standard', 'premium'));

ALTER TABLE deals ADD COLUMN package_id UUID REFERENCES creator_packages(id);

-- Snapshot of package at time of purchase (critical for disputes)
ALTER TABLE deals ADD COLUMN package_snapshot JSONB;

-- Backfill: all existing deals are campaign-origin
UPDATE deals SET origin_type = 'campaign' WHERE origin_type IS NULL;
```

**Add this CHECK constraint:**
```sql
ALTER TABLE deals ADD CONSTRAINT deal_origin_valid CHECK (
  (origin_type = 'campaign' AND campaign_id IS NOT NULL AND package_id IS NULL) OR
  (origin_type = 'package'  AND package_id IS NOT NULL  AND campaign_id IS NULL)
);
```

This constraint enforces at the DB level that a deal can never have both a `campaignId` and a `packageId`, and can never have neither.

---

### STEP 3 — Backend: Creator Package APIs

#### 3a. Upsert Package (Creator only)
```
PUT /api/creator/packages/:tier
Authorization: Bearer <creatorToken>
Body: { title, description, price, deliverables[], deliveryDays, revisions, isActive }
```

- Validate `tier` is one of: `basic`, `standard`, `premium`
- Validate `price > 0`
- Validate `deliveryDays > 0`
- Validate `deliverables` is a non-empty array with at least 1 item
- Use upsert — do NOT use plain INSERT (unique constraint will throw)
- Return the saved package object

**Error conditions to handle:**
- `tier` not in allowed enum → 400 Bad Request
- `price <= 0` → 400 Bad Request
- Non-creator token hits this endpoint → 403 Forbidden
- `deliverables` is empty array → 400 Bad Request

#### 3b. Get Creator's Packages (Public — anyone can call)
```
GET /api/creators/:creatorId/packages
```

- Return all active packages for the creator (`isActive = true`)
- If the creator has no packages, return empty array `[]` — do NOT return 404
- Sort by tier order: basic → standard → premium

#### 3c. Get Own Packages (Creator only, includes inactive)
```
GET /api/creator/packages
Authorization: Bearer <creatorToken>
```

Returns all 3 tiers including inactive ones (for the creator's own settings page).

---

### STEP 4 — Backend: Package Checkout API

```
POST /api/deals/package-checkout
Authorization: Bearer <brandToken>
Body: { creatorId, packageTier }
```

**Strict validation sequence (fail fast, in this order):**

1. Confirm the requester is a Brand (not a creator) → 403 if creator tries to buy
2. Confirm `creatorId` exists and is an active creator → 404 if not found
3. Brand cannot purchase their own creator profile (if brand also has creator account) → 400
4. Fetch the `CreatorPackage` where `creatorId = body.creatorId AND tier = body.packageTier AND isActive = true`
5. If package not found or `isActive = false` → 404 with message: "This package is not currently available"
6. Check for an existing open deal between this brand and creator for the same package tier (prevent duplicate active deals) → 409 Conflict
7. Create a Razorpay order: `amount = package.price * 100` (paise), `currency = 'INR'`, `receipt = "pkg_${packageId}_${Date.now()}"`, `notes = { originType: 'package', packageId, packageTier, brandId, creatorId }`
8. Create the `Deal` record with: `originType = 'package'`, `packageId`, `packageTier`, `brandId`, `creatorId`, `amount = package.price`, `packageSnapshot = JSON.stringify(package)`, `status = 'payment_pending'`, `campaignId = null`
9. Return: `{ dealId, razorpayOrderId, amount, packageDetails }`

**The `packageSnapshot` field is non-negotiable.** Store a full copy of the package object (price, deliverables, deliveryDays, revisions) at the moment of purchase. If the creator later edits or deletes their package, the deal must still know what was originally agreed upon.

---

### STEP 5 — Razorpay Webhook: Handle Both Origins

Your existing webhook handler likely does something like:

```js
const deal = await Deal.findOne({ razorpayOrderId: payload.orderId });
await notifyUser(`Your campaign deal is confirmed`);  // ← THIS WILL BREAK
```

Update the webhook to branch on `deal.originType`:

```js
if (deal.originType === 'campaign') {
  // existing campaign logic
  await notify(deal.brandId, `Payment confirmed for campaign: ${campaign.title}`);
  await notify(deal.creatorId, `You have a new campaign deal`);
} else if (deal.originType === 'package') {
  // new package logic
  await notify(deal.brandId, `Payment confirmed for ${deal.packageTier} package`);
  await notify(deal.creatorId, `New package order: ${deal.packageTier} tier from a brand`);
}
```

**Every place in the codebase where you reference `deal.campaignId` or `deal.campaign` must be guarded with a null check or an `originType` branch.** Do a codebase search for `deal.campaignId`, `deal.campaign_id`, and `populate('campaign')` — each of these is a potential crash point when the deal is package-origin.

---

### STEP 6 — Existing API Updates

#### Update `GET /api/deals` (brand dashboard)
Currently this likely does:
```js
Deal.find({ brandId }).populate('campaign')
```
If `campaign` is null (package deal), `.populate('campaign')` returns null and any code doing `deal.campaign.title` will throw.

Fix: Always guard with `if (deal.campaign)` before accessing campaign fields. Add `originType` and `packageTier` to the response so the frontend can render the right badge.

#### Update `GET /api/deals` (creator dashboard)
Same issue — populate guard needed. Return `packageSnapshot` in the response so the creator knows what deliverables they committed to.

#### Update `GET /api/deals/:dealId`
Return the full `packageSnapshot` in the detail view for package deals. This is what the creator references during delivery and what's shown during a dispute.

---

### STEP 7 — Notification Templates

Every notification in the system needs to handle both origins. Audit every notification and fix:

| Notification | Campaign version | Package version |
|---|---|---|
| Deal created | "Your application for [Campaign] was accepted" | "New order: [packageTier] package purchased by a brand" |
| Payment confirmed | "Payment secured for [Campaign]" | "Payment secured for your [packageTier] package" |
| Submission received | "Creator submitted for [Campaign]" | "Creator submitted for your [packageTier] package order" |
| Deal approved | "Brand approved [Campaign] delivery" | "Brand approved your [packageTier] delivery" |
| Dispute opened | "Dispute opened on [Campaign] deal" | "Dispute opened on [packageTier] package order" |

**Any notification that does `campaign.title` without checking `deal.originType` first will throw a null reference error in production.**

---

### STEP 8 — Frontend: Creator Package Settings Page

Add a "My Packages" section to the creator's profile/settings area.

**Layout:** Three cards side by side — Basic, Standard, Premium.

Each card contains a form with:
- Title (text input, max 100 chars)
- Description (textarea, max 500 chars)
- Price (number input, min 1)
- Deliverables (dynamic list — add/remove items, min 1 item required)
- Delivery days (number input, min 1)
- Revisions (number input, min 0)
- Active toggle (show/hide this package from brands)

**Validation rules (enforce on frontend before API call):**
- Price must be a positive number
- At least 1 deliverable must be listed
- Delivery days must be at least 1
- Title and description must not be blank

**UX requirement:** The save button calls `PUT /api/creator/packages/:tier`. Show a success toast. If the creator hasn't filled a tier yet, show a placeholder state with a "Set up this package" CTA — do not show an empty broken card.

---

### STEP 9 — Frontend: Creator Profile Page (Brand View)

Below the creator's bio/stats section, add a "Hire Me" / "Packages" section.

**Rendering logic:**
```
if (packages.length === 0) {
  show: "This creator hasn't set up packages yet"
  do NOT show a broken empty section
}

if (packages.length > 0) {
  show: package cards with "Buy Now" button on each
}
```

Each package card shows: tier name, title, price, deliverables list, delivery days, revisions count, and a "Buy Now" button.

Clicking "Buy Now":
1. Calls `POST /api/deals/package-checkout` with `{ creatorId, packageTier }`
2. On success, receives `razorpayOrderId` and opens the Razorpay checkout modal
3. On Razorpay payment success, redirect to `/dashboard/deals/:dealId`
4. On Razorpay payment failure, show an error toast — do NOT create a deal (the deal was already created server-side; handle this by checking deal status on return)

**Edge case to handle:** If the brand already has an active open deal with this creator for this tier, the API returns 409. Show: "You already have an active order for this package."

---

### STEP 10 — Frontend: Deal Cards on Both Dashboards

Every deal card on the brand dashboard and creator dashboard must now show an origin badge:

```
if deal.originType === 'campaign' → show badge: "Campaign Deal"
if deal.originType === 'package'  → show badge: "Package Order · [tier]"
```

The deal detail page must show:
- For campaign deals: link to the original campaign
- For package deals: the package snapshot (what was agreed — deliverables, days, revisions) — read from `deal.packageSnapshot`, NOT from the live package (which may have changed)

---

## CRITICAL ERROR CONDITIONS CHECKLIST

Before considering this feature complete, verify every item below:

### Database level
- [ ] `UNIQUE(creatorId, tier)` constraint exists — duplicate package insert throws, not silently overwrites
- [ ] `CHECK` constraint on `Deal` prevents `originType='campaign'` with null `campaignId`
- [ ] `CHECK` constraint on `Deal` prevents `originType='package'` with null `packageId`
- [ ] All existing deals have `originType = 'campaign'` after migration (backfill ran)
- [ ] `packageSnapshot` column is JSONB and accepts null (for campaign deals)

### Backend level
- [ ] Creator cannot call the package checkout endpoint (role guard)
- [ ] Brand cannot buy a package from themselves
- [ ] Buying a non-existent or inactive package returns 404, not 500
- [ ] Duplicate active deal for same brand+creator+tier returns 409, not creates a second deal
- [ ] Razorpay webhook handles `deal.campaign = null` without throwing
- [ ] Every `deal.campaignId` access in codebase is null-guarded
- [ ] Every `deal.campaign.title` access is null-guarded
- [ ] `packageSnapshot` is written at deal creation time — never fetched live from CreatorPackage during dispute resolution
- [ ] Package price is locked at checkout — `deal.amount` copies `package.price` at creation, not referenced live

### Frontend level
- [ ] Creator profile with zero packages shows graceful empty state, not broken UI
- [ ] Brand dashboard deal cards don't crash when `deal.campaign` is null
- [ ] Creator dashboard deal cards don't crash when `deal.campaign` is null
- [ ] Deal detail page reads deliverables from `packageSnapshot`, not live package data
- [ ] Razorpay payment failure after deal creation is handled (deal stays in `payment_pending`, not duplicated on retry)
- [ ] "Buy Now" button is disabled/hidden if brand is viewing their own creator profile

### Notification level
- [ ] Zero notifications reference `campaign.title` without an `originType` guard
- [ ] Package deal notifications use `packageTier` and `packageSnapshot.title` instead

---

## WHAT NOT TO DO

- Do NOT delete the campaign pipeline. Both pipelines must coexist.
- Do NOT make `campaignId` required anywhere in new code.
- Do NOT fetch live package data during deal delivery or dispute — always use `packageSnapshot`.
- Do NOT allow price to be modified after a package deal is created — the amount is fixed at checkout.
- Do NOT show the "Buy Now" button if the creator has no active packages for that tier.
- Do NOT create a new Razorpay integration — route package payments through the exact same Razorpay escrow flow that campaigns use.
- Do NOT use a plain `INSERT` for packages — always upsert on `(creatorId, tier)`.

---

## IMPLEMENTATION ORDER (follow strictly)

1. Run DB migration — make `campaignId` nullable, add `originType`, add `packageId`, add `packageSnapshot`, add CHECK constraints, backfill existing deals
2. Create `CreatorPackage` table with unique constraint
3. Build and test Creator Package CRUD APIs (`PUT`, `GET`)
4. Update all existing deal queries and notifications with null guards for `campaign`
5. Build `POST /api/deals/package-checkout` and test end-to-end with Razorpay sandbox
6. Update Razorpay webhook to handle both `originType` values
7. Build creator "My Packages" settings UI
8. Build brand-facing package cards on creator profile with "Buy Now" flow
9. Update both dashboards — add `originType` badges, fix null `campaign` crashes
10. Update deal detail page — show `packageSnapshot` for package deals
11. Full regression test of the existing campaign pipeline — it must be completely unaffected
