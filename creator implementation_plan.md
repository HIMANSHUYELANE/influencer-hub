# Final Implementation Plan: Replace Mock Escrow with Razorpay

This version is updated against the current codebase on April 15, 2026.

## Current Codebase Review

The project already has the core deal lifecycle in place:

- `backend/controllers/dealController.js` creates deals and currently uses `initiateMockPayment` to simulate escrow.
- `backend/routes/dealRoutes.js` exposes `POST /api/deals/:id/pay`, `POST /submit-content`, and `POST /review`.
- `backend/models/Deal.js` already stores `budget`, `status`, `paymentDetails.status`, `razorpayOrderId`, and `razorpayPaymentId`.
- `frontend/src/components/DealManager.jsx` already drives the brand and creator deal actions in the UI.
- `backend/package.json` already includes the `razorpay` SDK.

The main gaps are:

- No real Razorpay client initialization in the backend yet.
- No frontend Razorpay Checkout flow yet.
- No payment verification endpoint yet.
- No webhook handling yet.
- No creator payout details in `CreatorProfile`.
- The current `"Approve & Release Funds"` UI is inaccurate for a manual-payout flow because approval currently marks funds as fully released.

## Decision For V1

Use **Option A: Manual Admin Payouts** for the first production version.

Why this is the best fit for the current codebase:

- The app already supports deal approval and completion.
- `CreatorProfile` does not store payout details yet.
- RazorpayX / Route automation would add more backend complexity, compliance work, and sensitive data handling.
- Manual payout is the safest way to replace mock escrow with real inbound payment collection first.

## Final Scope

### Phase 1: Replace Mock Payment with Razorpay Order Creation

**Backend**

- **[MODIFY] `backend/controllers/dealController.js`**
  - Replace `initiateMockPayment` with a real order-creation controller.
  - Validate the deal exists and is still in `pending_payment`.
  - Initialize Razorpay using `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`.
  - Create an order for `deal.budget` in paise.
  - Save `paymentDetails.razorpayOrderId`.
  - Return order payload needed by the frontend checkout flow.

- **[MODIFY] `backend/routes/dealRoutes.js`**
  - Keep the existing `POST /:id/pay` route name if we want minimal frontend change, but repurpose it to create a real Razorpay order instead of simulating success.

### Phase 2: Add Checkout + Signature Verification

**Frontend**

- **[MODIFY] `frontend/src/components/DealManager.jsx`**
  - Change the brand payment action from "Pay with Escrow (Mock)" to "Pay Securely with Razorpay".
  - Call `POST /api/deals/:id/pay` to create an order.
  - Open Razorpay Checkout using the returned order data.
  - After successful payment, send `razorpay_order_id`, `razorpay_payment_id`, and `razorpay_signature` to the backend for verification.
  - Refresh deal data only after backend verification succeeds.

**Backend**

- **[MODIFY] `backend/controllers/dealController.js`**
  - Add `verifyPayment`.
  - Verify the signature using Node `crypto` and the Razorpay secret.
  - On success:
    - set `deal.status = 'in_progress'`
    - set `paymentDetails.status = 'escrow_held'`
    - save `paymentDetails.razorpayPaymentId`
  - Reject invalid or duplicate verification attempts safely.

- **[MODIFY] `backend/routes/dealRoutes.js`**
  - Add `POST /:id/verify-payment`.

### Phase 3: Add Webhook Reconciliation

This should be part of V1 even if frontend verification already exists.

- **[MODIFY] `backend/server.js`**
  - Ensure webhook route can access the raw request body if Razorpay signature validation requires it.

- **[NEW] webhook handler**
  - Either add this to `dealController.js` or introduce a dedicated payment controller.
  - Handle Razorpay payment events for reconciliation and audit safety.
  - Log or persist webhook outcomes so payments can be recovered if the frontend closes early after payment.

- **[MODIFY] routes**
  - Add a webhook endpoint such as `POST /api/deals/webhook/razorpay` or a dedicated `/api/payments/webhook/razorpay`.

### Phase 4: Fix Payout Semantics for Manual Release

This is the most important correction to the old plan.

Right now, brand approval sets:

- `deal.status = 'completed'`
- `paymentDetails.status = 'released'`

That is only correct if money is truly auto-transferred to the creator, which the current codebase cannot do.

For V1 manual payouts:

- **[MODIFY] `backend/models/Deal.js`**
  - Expand `paymentDetails.status` to reflect the real state more accurately.
  - Recommended statuses:
    - `pending`
    - `escrow_held`
    - `payout_pending`
    - `released`
    - `refunded`

- **[MODIFY] `backend/controllers/dealController.js`**
  - In `reviewContent`, when brand approves content:
    - set `deal.status = 'completed'`
    - set `paymentDetails.status = 'payout_pending'`
  - Do **not** mark funds as `released` automatically.

- **[MODIFY] `frontend/src/components/DealManager.jsx`**
  - Update brand success text to say the job is approved and payout is queued for admin release.
  - Update creator success text to avoid saying funds were already transferred.

### Phase 5: Add Admin Payout Completion Step

To make manual payout operational instead of just conceptual:

- **[MODIFY] backend deal flow**
  - Add an admin-only action to mark a deal payout as completed after you transfer the money from Razorpay Dashboard manually.

- **Suggested endpoint**
  - `POST /api/deals/:id/mark-paid`

- **Behavior**
  - Allowed only for admin/platform owner users.
  - Sets `paymentDetails.status = 'released'`.
  - Optionally stores `releasedAt`, `releasedBy`, or an admin note/reference ID.

Note: the current codebase does not appear to have an admin role yet, so this sub-phase may require either:

- a temporary protected owner-only route, or
- postponing this step until an admin system exists.

## Data Model Updates

### `backend/models/Deal.js`

Recommended additions:

- `paymentDetails.verifiedAt`
- `paymentDetails.releasedAt`
- `paymentDetails.webhookEventId` or a small audit field if needed

These are optional for launch but useful for support and reconciliation.

### `backend/models/CreatorProfile.js`

No payout fields are required for V1 manual payout.

For future automation only, we would later add fields such as:

- `payoutMethod`
- `upiId`
- `bankAccountHolderName`
- `bankAccountNumber`
- `ifscCode`

That work should stay out of the current production scope.

## Environment and Config Requirements

Before implementation:

- Add `RAZORPAY_KEY_ID` to backend environment.
- Add `RAZORPAY_KEY_SECRET` to backend environment.
- Add `VITE_RAZORPAY_KEY_ID` to frontend environment if the checkout config reads from Vite env.

Also recommended:

- Validate Razorpay env vars at startup in `backend/server.js`, similar to the existing `JWT_SECRET` and `MONGODB_URI` checks.

## File-by-File Plan

1. **`backend/controllers/dealController.js`**
   - Replace mock pay logic with real order creation.
   - Add signature verification.
   - Update approval flow to `payout_pending` for manual payout.

2. **`backend/routes/dealRoutes.js`**
   - Keep `/:id/pay` for order creation.
   - Add `/:id/verify-payment`.
   - Add webhook route or connect to a dedicated payment route.

3. **`backend/models/Deal.js`**
   - Expand `paymentDetails.status`.
   - Add optional audit timestamps/fields.

4. **`backend/server.js`**
   - Add Razorpay env validation.
   - Support webhook body verification if needed.

5. **`frontend/src/components/DealManager.jsx`**
   - Launch Razorpay Checkout.
   - Verify payment after checkout success.
   - Update labels/messages to match manual payout reality.

## Out of Scope for This Final Plan

- RazorpayX / Route automated creator transfers
- storing creator bank account details
- refund automation
- dispute workflow redesign
- full finance ledger or payout reporting

## Acceptance Criteria

The V1 implementation is complete when:

- Brands can pay a deal through Razorpay Checkout.
- The backend verifies the payment signature before moving the deal to `in_progress`.
- The creator can only submit content after verified payment.
- Brand approval marks the deal complete but payout as `payout_pending`, not `released`.
- Manual payout can later be marked complete by the platform owner.
- UI text no longer claims that funds were auto-transferred when they were not.

## Recommended Build Order

1. Update `Deal` payment statuses.
2. Replace mock order creation in the backend.

3. add frontend Razorpay Checkout.
4. add backend payment verification.
5. add webhook reconciliation.
6. correct approval/payout messaging.
7. add optional admin payout completion endpoint.

## Summary

The old plan was directionally right, but it did not fully match the current implementation.

The key corrections are:

- the code already has the deal lifecycle and the Razorpay package installed
- V1 should use **manual admin payout**, not pretend funds are auto-released
- payment verification and webhook reconciliation should both be included
- `Deal` payment statuses need to be made more accurate before launch
