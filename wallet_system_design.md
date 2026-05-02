# 💳 Wallet & Money Management System: Technical Design

This document outlines the architecture and implementation path for the **User-Centric Wallet System** on Influencer's Hub.

## 1. Core Architecture
The system moves away from direct deal payments and introduces a virtual accounting layer.

### Data Models

#### A. Wallet Model (`Wallet.js`)
Linked 1:1 with a User.
- `userId`: Reference to User.
- `balance`: (Number) Withdrawable funds (completed deals).
- `escrow`: (Number) Funds locked in active deals.
- `currency`: Default "INR".

#### B. Transaction Model (`Transaction.js`)
The "Source of Truth" for all balance changes.
- `userId`: Reference to User.
- `amount`: (Number).
- `type`: `credit`, `debit`, `escrow_hold`, `escrow_release`.
- `status`: `pending`, `completed`, `failed`.
- `description`: e.g., "Payment for Deal #123".
- `relatedDealId`: Reference to Deal.

---

## 2. Financial Flow (State Machine)

### Phase 1: Brand Payment (Escrow Hold)
1. Brand pays for a Deal (Campaign or Package).
2. Backend creates a `Transaction` (type: `escrow_hold`, status: `completed`).
3. **Wallet Update**: Increment `wallet.escrow` by the deal amount.
4. **Deal Update**: `deal.paymentStatus = "escrow_held"`.

### Phase 2: Completion (Escrow Release)
1. Brand approves the work.
2. Backend creates two `Transaction` entries:
   - `escrow_release` (deducts from `wallet.escrow`).
   - `credit` (adds to `wallet.balance`).
3. **Wallet Update**: Move funds from `escrow` to `balance`.
4. **Deal Update**: `deal.paymentStatus = "released"`.

### Phase 3: Payout (Withdrawal)
1. Creator requests a withdrawal.
2. Backend creates a `Transaction` (type: `debit`, status: `pending`).
3. **Admin Panel**: Admin verifies and triggers Razorpay Payout.
4. On success: Transaction status becomes `completed`.

---

## 3. API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/wallet/my-wallet` | Get balance, escrow, and profile. |
| `GET` | `/api/wallet/transactions` | Get history with pagination. |
| `POST` | `/api/wallet/withdraw` | Creator triggers a payout request. |
| `GET` | `/api/admin/withdrawals` | (Admin) View all pending payouts. |

---

## 4. UI/UX Design (Digital Brutalist)

### Wallet Dashboard Components:
- **Total Balance Hero**: Massive Neon Green typography for available balance.
- **Escrow Widget**: Smaller purple card showing "Funds in Flight."
- **Transaction Ledger**: High-contrast list with "Status Badges" (Green for Success, Yellow for Escrow).
- **Withdrawal Modal**: Simple, bold form for UPI ID / Bank Details.

---

## 5. Security Protocols
- **Atomic Transactions**: Balance updates must use Mongoose transactions (if supported) or sequential checks to prevent double-spending.
- **Role Validation**: Brands cannot request withdrawals. Creators cannot manually update their balance.
- **Server-Side Verification**: Every balance change must be triggered by a system event (Deal completion), never by a frontend request.
