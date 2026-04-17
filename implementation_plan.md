# Implementation Plan: Razorpay Escrow Integration

Replacing the "Mock Escrow" with a production-ready Razorpay integration introduces actual monetary transfers.

## Proposed Architecture

Integrating a gateway changes our "instant click" mock flow into a multi-step verification process.

### Phase 1: Creating the Order (Inbound Payment)
When a Brand clicks "Pay", the funds must enter your Platform's Razorpay Account.
1. **[MODIFY] `backend/controllers/dealController.js`**: Update the `initiatePayment` route to call `razorpay.orders.create(...)` generating a unique Order ID to track the transaction.
2. **[MODIFY] `frontend/src/components/DealManager.jsx`**: Integrate the `Razorpay Checkout SDK`. When clicking "Pay", a Razorpay popup will appear allowing the Brand to use UPI/Card.

### Phase 2: Webhook / Signature Verification
Never trust the frontend to say a payment succeeded.
3. **[NEW] `backend/controllers/dealController.js` -> `verifyPayment`**: After the UI popup closes, the frontend sends the Razorpay Signature to the backend. We use `crypto` to mathematically verify the payment against your secret key before marking the Deal as `in_progress` / `escrow_held`.

### Phase 3: Releasing Funds (Outbound Payout) 
> [!WARNING]
> **The "Catch" in our current codebase:** We currently do *not* have any fields in `CreatorProfile.js` to store Bank Account Numbers, IFSC codes, or UPI IDs for creators.

When a brand clicks "Approve & Release Funds", the platform needs to dispatch the money to the Creator. There are two ways to build this:

**Option A (Recommended for V1): Manual Admin Payouts**
- When the brand clicks "Approve", the backend sets the Deal to `completed`.
- The system flags it for the Platform Owner (You).
- You log into your actual Razorpay Dashboard and transfer the funds to the creator.
- *Pros:* Extremely safe, no complex RazorpayX API compliance needed, no storing sensitive creator bank data on your servers.

**Option B: Fully Automated Razorpay Route/X APIs**
- Requires modifying `CreatorProfile` to securely collect and store banking details.
- Requires your Razorpay account to be upgraded to "RazorpayX" or "Route Marketplace".
- When the Brand clicks "Approve", the Node.js backend automatically fires an API call to transfer the money via NEFT/UPI to the Creator's bank.

---
## Requirements Before We Begin

1. **Razorpay Account Keys:** You must have a `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` added to your `.env` file. You can use Razorpay's "Test Mode" keys so real money isn't charged.
2. **Install SDKs:** I will need to ensure `razorpay` is running in your backend (which you manually installed earlier), and optionally add `react-razorpay` to the frontend.

## User Action Required
Please let me know:
1. Do you prefer **Option A (Manual admin transfers)** or **Option B (Fully automated API transfers)** for the payout side? 
2. Do you have your test Razorpay API keys ready to place in the `.env` file?
