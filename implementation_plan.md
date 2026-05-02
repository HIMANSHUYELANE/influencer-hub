# Implementation Plan: Unified Razorpay Flow for Campaign and Package Deals

This plan replaces the old mock escrow path with one shared Razorpay payment flow for both:

- campaign-based deals created from accepted applications
- package-based deals created directly from a creator profile

The goal is to make `campaign` and `package` differ only in how the deal is created and priced, not in how payment is collected, verified, and released.

## Summary

We will move both deal types onto the same secure payment lifecycle:

1. Create a deal in `pending_payment`
2. Create a Razorpay order from the backend
3. Open Razorpay Checkout on the frontend
4. Verify the Razorpay signature on the backend
5. Mark payment as escrow held and move the deal to `in_progress`
6. Allow content delivery and review
7. Mark payout as pending manual release after approval

This removes the current split where package checkout immediately simulates payment and campaign deals rely on the mock `/pay` route.

---

## Current Problems To Fix

### 1. Mock Payment Path Is Shared By Both Flows

Right now:

- `frontend/src/components/DealManager.jsx` uses `POST /deals/:id/pay`
- `frontend/src/pages/CreatorProfile.jsx` creates a package deal and immediately calls `POST /deals/:id/pay`

This means both campaign and package deals still depend on the mock server-side payment shortcut instead of a real Razorpay order and signature verification flow.

### 2. Package Deals Use a Fake `applicationId`

Package deals currently assign:

```js
applicationId: new mongoose.Types.ObjectId()
```

This is only being used to avoid the unique sparse index behavior. It hides the true data shape and can break assumptions in downstream code. Package deals should not have an `applicationId` at all.

### 3. Missing Ownership Checks

The backend currently checks role on routes but not deal ownership in the controller. That means any authenticated brand or creator could potentially act on a deal they do not own if they know the deal ID.

### 4. Payment and Payout States Are Mixed Together

The deal workflow status and the money movement status are currently too tightly coupled. Approving content immediately marks payment as `released`, even though no real payout integration exists yet.

### 5. Package Pricing Still Falls Back to Mock Values

Package checkout currently invents prices if a creator has not set valid pricing. That is useful in testing, but unsafe for a real Razorpay flow because it can charge the wrong amount.

---

## Target Architecture

### A. Deal Creation

Both flows must create a `Deal` first and stop there.

#### Campaign Deal

- creator confirms the application
- backend creates a campaign deal with:
  - `originType: 'campaign'`
  - real `applicationId`
  - `status: 'pending_payment'`
  - `paymentDetails.status: 'pending'`

#### Package Deal

- brand selects a creator package
- backend creates a package deal with:
  - `originType: 'package'`
  - no `applicationId`
  - `brandId`
  - `creatorId`
  - `packageTier`
  - `packageSnapshot`
  - `budget` from creator pricing
  - `status: 'pending_payment'`
  - `paymentDetails.status: 'pending'`

After deal creation, both deal types must use the exact same payment flow.

### B. Payment Order Creation

Add a new backend endpoint:

```http
POST /api/deals/:id/payment-order
```

Responsibilities:

- verify the authenticated user is the owning brand of the deal
- verify the deal exists
- verify the deal is still in `pending_payment`
- verify the amount using server-side deal data only
- create a Razorpay order with the backend SDK
- store Razorpay order metadata in the deal
- return only checkout-safe data to the frontend

Suggested stored fields:

- `paymentDetails.amount`
- `paymentDetails.currency`
- `paymentDetails.razorpayOrderId`
- `paymentDetails.status = 'order_created'`

### C. Payment Verification

Add a second backend endpoint:

```http
POST /api/deals/:id/payment-verify
```

Responsibilities:

- verify the authenticated user is the owning brand
- verify the deal exists
- verify the stored Razorpay order ID matches the received order ID
- verify the Razorpay signature using `crypto` and `RAZORPAY_KEY_SECRET`
- store payment confirmation fields
- move the workflow into active execution only after verification succeeds

On success:

- `deal.status = 'in_progress'`
- `paymentDetails.status = 'escrow_held'`
- `paymentDetails.razorpayPaymentId = ...`
- `paymentDetails.razorpaySignature = ...`
- `paymentDetails.verifiedAt = ...`

Only after successful verification should the system create the conversation/chat for that deal.

### D. Content Review and Payout

For V1, use manual payout handling.

When a brand approves content:

- `deal.status = 'completed'`
- `paymentDetails.status = 'release_pending'`

Do not mark payment as `released` until real payout is actually completed by admin or later Razorpay Route/X integration.

---

## Data Model Changes

Update `backend/models/Deal.js`.

### Remove Fake Package Requirement

- keep `applicationId` only for campaign deals
- do not assign any fake ObjectId for package deals

### Expand `paymentDetails`

Suggested shape:

```js
paymentDetails: {
  status: {
    type: String,
    enum: [
      'pending',
      'order_created',
      'escrow_held',
      'release_pending',
      'released',
      'refunded',
      'failed'
    ],
    default: 'pending'
  },
  amount: Number,
  currency: {
    type: String,
    default: 'INR'
  },
  razorpayOrderId: String,
  razorpayPaymentId: String,
  razorpaySignature: String,
  verifiedAt: Date
}
```

This keeps:

- `deal.status` for collaboration workflow
- `paymentDetails.status` for payment lifecycle

---

## Backend Changes

## 1. `backend/controllers/dealController.js`

### Keep

- `createDeal`
- `createPackageCheckout`
- `getUserDeals`
- `submitContent`
- `reviewContent`

### Replace

Replace `initiateMockPayment` with:

- `createPaymentOrder`
- `verifyPayment`

### Add Ownership Checks

For all deal actions:

- brand actions must confirm the current user owns the related `brandId`
- creator actions must confirm the current user owns the related `creatorId`

This applies to:

- payment order creation
- payment verification
- content submission
- content review

### Remove Mock Price Fallback For Live Checkout

In `createPackageCheckout`:

- require valid creator pricing for the selected tier
- if the package is missing or price is `<= 0`, return `400`
- do not invent fallback amounts in the live Razorpay path

### Create Chat Only After Verified Payment

Move conversation/message creation logic out of mock payment assumptions and trigger it only after successful payment verification.

## 2. `backend/routes/dealRoutes.js`

Replace:

```http
POST /:id/pay
```

With:

```http
POST /:id/payment-order
POST /:id/payment-verify
```

Role restrictions:

- both should remain brand-only routes
- submission remains creator-only
- review remains brand-only

## 3. Razorpay Setup

In backend:

- require `razorpay`
- initialize a shared Razorpay client using:
  - `RAZORPAY_KEY_ID`
  - `RAZORPAY_KEY_SECRET`

The server must fail fast if Razorpay keys are missing in production or integration mode.

---

## Frontend Changes

## 1. Shared Checkout Helper

Create one shared helper for Razorpay checkout behavior, used by both:

- `frontend/src/components/DealManager.jsx`
- `frontend/src/pages/CreatorProfile.jsx`

The helper should:

1. call `POST /api/deals/:id/payment-order`
2. open Razorpay Checkout using returned order data
3. on successful callback, call `POST /api/deals/:id/payment-verify`
4. refresh data and update UI after success

## 2. `frontend/src/components/DealManager.jsx`

Update the pay button flow:

- remove direct dependency on mock `/pay`
- start Razorpay checkout for any deal in `pending_payment`
- keep the button only for the owning brand

## 3. `frontend/src/pages/CreatorProfile.jsx`

Update package purchase flow:

Current behavior:

1. create package deal
2. immediately call `/pay`
3. redirect

New behavior:

1. create package deal
2. start the exact same Razorpay checkout helper used by campaign deals
3. verify payment
4. redirect only after verification succeeds

## 4. UI Messaging

Update labels so they reflect real states:

- `pending` or `order_created`: waiting for brand payment
- `escrow_held`: payment secured
- `release_pending`: approved, awaiting manual payout
- `released`: funds actually transferred

This is especially important for dashboard trust and support clarity.

---

## Security Rules

These rules are mandatory for the live flow:

1. Never trust the frontend for payment success
- only the backend signature verification can mark escrow as secured

2. Never trust the frontend for payment amount
- amount must always come from the deal stored on the server

3. Never allow duplicate payment state transitions
- a paid or verified deal must not create a fresh order silently

4. Never allow cross-account deal actions
- all deal mutations must validate ownership

5. Never create conversations before verified payment
- chat must unlock only after escrow is truly held

---

## Test Plan

### Campaign Flow

- creator confirms application
- deal is created in `pending_payment`
- brand creates Razorpay order
- payment verifies successfully
- deal moves to `in_progress`
- chat is created

### Package Flow

- brand selects creator package
- package deal is created in `pending_payment`
- brand creates Razorpay order
- payment verifies successfully
- deal moves to `in_progress`
- chat is created

### Authorization

- wrong brand cannot pay another brand's deal
- wrong brand cannot approve another brand's deal
- wrong creator cannot submit content for another creator's deal

### Payment Integrity

- verification fails if signature is invalid
- verification fails if order ID does not match stored order
- payment order fails if deal is not in `pending_payment`
- re-payment fails cleanly for already funded deals

### Package Pricing

- package checkout fails if creator package price is missing or zero
- package snapshot stores exact checkout details for future audit

### Approval and Release

- approving content moves payment to `release_pending`
- no screen says funds are released until actual payout is done

---

## Environment Requirements

Add these environment variables:

```env
RAZORPAY_KEY_ID=...
RAZORPAY_KEY_SECRET=...
```

Frontend will also need access to the public Razorpay key for checkout initialization, either via:

```env
VITE_RAZORPAY_KEY_ID=...
```

or by returning the public key from the backend order endpoint.

---

## Files Expected To Change

Primary files:

- `backend/controllers/dealController.js`
- `backend/models/Deal.js`
- `backend/routes/dealRoutes.js`
- `frontend/src/components/DealManager.jsx`
- `frontend/src/pages/CreatorProfile.jsx`

Possible supporting additions:

- shared Razorpay client utility in backend
- shared checkout helper in frontend

---

## Creator Payout Plan

For V1, payout will be manual even after Razorpay payment collection is live.

That means:

- brand pays into the platform Razorpay account
- backend verifies payment and marks escrow as held
- creator completes the work
- brand approves the work
- system marks payout as waiting for admin release
- admin manually transfers the creator payment
- admin then updates the payout state to released

### V1 Manual Payout Mode

Use manual payout first because it avoids blocking the launch on:

- Razorpay Route/X onboarding
- automated payout API setup
- creator KYC payout workflow
- complex payout failure handling

For V1, creators can provide either:

- bank details
- UPI ID

The platform owner can then use those details to manually send payout after approval.

### Creator Payout Data To Collect

Add a payout section for creators with a selectable payout method.

Suggested fields:

```js
payoutDetails: {
  method: {
    type: String,
    enum: ['bank', 'upi'],
    default: 'upi'
  },
  accountHolderName: {
    type: String,
    default: ''
  },
  bankAccountNumber: {
    type: String,
    default: ''
  },
  ifscCode: {
    type: String,
    default: ''
  },
  upiId: {
    type: String,
    default: ''
  },
  isComplete: {
    type: Boolean,
    default: false
  }
}
```

### Validation Rules

#### If payout method is `bank`

Require:

- `accountHolderName`
- `bankAccountNumber`
- `ifscCode`

Ignore or clear:

- `upiId`

#### If payout method is `upi`

Require:

- `upiId`

Optional:

- `accountHolderName`

Ignore or clear:

- `bankAccountNumber`
- `ifscCode`

### V1 Approval Flow With Manual Payout

After brand approval:

- `deal.status = 'completed'`
- `paymentDetails.status = 'release_pending'`

Do not mark the payment as `released` automatically.

Admin payout steps:

1. open the approved deal in admin view or database-backed operations panel
2. check creator payout method
3. if method is `bank`, use stored bank account details
4. if method is `upi`, use stored UPI ID
5. manually transfer funds
6. update deal payment status to `released`

### Admin Visibility Requirements

For manual payout to be workable, the system should eventually provide an admin-facing payout queue showing:

- creator name
- deal ID
- brand name
- approved amount
- payout method
- masked payout details
- current payout state

Even if there is no full admin dashboard yet, the data model should support this workflow from day one.

### Privacy and Safety Notes

Because payout data is sensitive:

- never send full bank details to public or non-admin APIs
- only expose payout details to the creator for self-edit and admin for payout operations
- mask bank account numbers in UI
- validate UPI and IFSC formats on input
- avoid logging raw payout data in server errors

### Future V2 Upgrade Path

Later, this same payout section can support automated payouts by adding:

- `razorpayContactId`
- `razorpayFundAccountId`
- `payoutReferenceId`
- `kycStatus`

That allows a clean migration from manual payout to Razorpay Route/X without redesigning the creator payout model.

---

## Recommended V1 Decision

Use this scope for V1:

- Razorpay for inbound payment collection only
- backend signature verification before activating any deal
- manual admin payout after approval
- creator payout setup supporting either bank details or UPI ID
- unified payment flow for both campaign and package deals

This gives a safe production-ready collection flow without blocking on Razorpay Route/X or creator bank onboarding.
