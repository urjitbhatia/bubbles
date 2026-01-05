# Bubbles - Product Specification

> **Version:** 0.1 (MVP)
> **Last Updated:** December 2024

## Vision

Reduce redundant ownership by enabling trusted groups to share infrequently-used items through lightweight lending circles.

## Problem

Everyone on the block owns a lawnmower used 10x/year. Everyone owns a drill used twice. Books read once sit on shelves. The friction of lending (who has it? is it available? did I get it back?) prevents organic sharing among people who'd happily lend to each other.

## Solution

**Bubbles** - a lending library app where users create trusted circles (bubbles) of friends, family, or groups. Members catalog items they're willing to lend, browse what's available, request items, and track lending history. Coordination happens offline; the app provides visibility and lightweight accountability.

---

## Core Concepts

| Concept | Description |
|---------|-------------|
| **User** | Authenticated person with a profile and personal inventory |
| **Inventory** | Items a user owns and is willing to lend (with quantity) |
| **Bubble** | A trusted group; users can belong to multiple bubbles |
| **Share** | Exposing an inventory item to one or more bubbles |
| **Loan** | Temporary transfer of item to another user; tracked with dates |
| **Request** | In-app ask for an available item; triggers coordination |

---

## MVP (v0.1) - Steel Thread

### Auth & Profile
- Google OAuth (primary) + Magic Link email (fallback) via Supabase Auth
- Profile: display name (required), username (globally unique, optional)
- Zero cost authentication

### Bubbles
- Create bubble (name, optional description)
- Generate shareable invite link (unique code)
- Join via invite link (WhatsApp-style, no approval needed)
- View bubble members
- Leave bubble
- **Admin system**: Creator is admin by default; admins can promote other members to admin
- Bubble deletion: Admin-only with warning; hard delete allowed

### Inventory
- Add item (name, optional description, quantity)
- Edit/delete item (warning shown if active loans; owner can proceed)
- View own inventory
- No photos in MVP (avoid NSFW moderation complexity)

### Sharing
- Share item to one or more bubbles
- Unshare item from bubble
- Same physical item (with quantity) can appear in multiple bubbles

### Browsing
- View all items in a bubble
- See availability status (available / unavailable - not which bubble has it)
- See item owner
- Basic text search/filter

### Requesting & Lending
- Request an available item (creates request record)
- Item owner sees incoming requests (in-app notification)
- Either party can mark item as "lent" (records date)
- Either party can mark item as "returned" (records date)
- Request can be cancelled/declined
- Coordinate actual handoff outside the app

### History
- View lending history for an item (who borrowed, when)
- View personal borrowing history (items I've borrowed)

### Notifications (In-App Only)
- New request received
- Request accepted/declined
- Item marked lent/returned

### Platform
- **PWA** (Progressive Web App) with manifest
- Installable on iOS and Android via browser
- Mobile-first responsive design
- No native app stores for MVP

### Security & Abuse Prevention
- Rate limiting on bubble creation, invites, requests
- Leverage Cloudflare's built-in DDoS and bot protection
- Supabase RLS (Row Level Security) for data access control

---

## Roadmap

### v1.0 - Polish & Retention
- Email notifications (opt-in)
- Item categories/tags
- "Wishlist" - mark items you'd like to borrow when available
- Bubble admin controls (remove members, transfer ownership)
- Improved search/filter
- Onboarding flow improvements
- Profile photos (pulled from Google OAuth)

### v2.0 - Growth
- Push notifications (if iOS support matures)
- Public profile / item visibility (opt-in discovery)
- Suggested items based on bubble activity
- Item condition tracking
- Lending duration suggestions/reminders
- "Looking for" posts in bubbles
- Activity feed per bubble
- Multiple bubble admins management UI

---

## Data Model

```
users
├── id (uuid, from supabase auth)
├── display_name (required)
├── username (unique, optional)
├── avatar_url (optional)
└── created_at

bubbles
├── id (uuid)
├── name
├── description (optional)
├── invite_code (unique, for invite links)
├── created_by → users.id
└── created_at

bubble_members
├── bubble_id → bubbles.id
├── user_id → users.id
├── role (admin | member)
└── joined_at

items
├── id (uuid)
├── owner_id → users.id
├── name
├── description (optional)
├── quantity (default 1)
└── created_at

item_shares
├── item_id → items.id
├── bubble_id → bubbles.id
└── shared_at

loans
├── id (uuid)
├── item_id → items.id
├── borrower_id → users.id
├── bubble_id → bubbles.id (where request originated)
├── status (requested | active | returned | cancelled)
├── requested_at
├── lent_at (nullable)
├── returned_at (nullable)
└── notes (optional)
```

### Availability Calculation
```sql
available_qty = item.quantity - COUNT(loans WHERE item_id = X AND status = 'active')
```

---

## Key User Flows

### 1. First-time user joins via invite
```
Click invite link
  → Landing page with bubble preview
  → Sign in (Google OAuth or Magic Link)
  → Create profile (display name required)
  → Auto-join bubble
  → See bubble items
```

### 2. Add item and share to bubbles
```
My Inventory
  → "Add Item"
  → Enter name, description, quantity
  → Select bubbles to share with
  → Item appears in selected bubbles
```

### 3. Borrow an item
```
Browse bubble
  → Find available item
  → Tap "Request"
  → Owner receives in-app notification
  → Owner and requester coordinate offline (text, call, etc.)
  → Either party marks "Lent" in app
  → Item shows as unavailable across all bubbles
  → Later: Either party marks "Returned"
  → Item becomes available again
```

### 4. Create a new bubble
```
Bubbles tab
  → "Create Bubble"
  → Enter name, optional description
  → Get invite link
  → Share link via text/email/WhatsApp
  → Friends join via link
```

---

## Technical Architecture

| Layer | Technology |
|-------|------------|
| Frontend | React + Vite + TailwindCSS |
| PWA | vite-plugin-pwa |
| Hosting (Frontend) | Cloudflare Pages |
| Backend | FastAPI (Python) |
| Hosting (Backend) | Cloudflare Workers |
| Database | Supabase PostgreSQL |
| Auth | Supabase Auth (Google OAuth + Magic Link) |
| Storage | Cloudflare R2 (available, not used in MVP) |
| Rate Limiting | Cloudflare built-in + custom middleware |

### RLS (Row Level Security) Strategy
- Users can only see bubbles they're members of
- Users can only see items shared to their bubbles
- Users can only modify their own items/profile
- Admins can modify bubble settings and remove members

---

## Success Metrics (MVP)

| Metric | Target |
|--------|--------|
| Core flow completion | Users can: join → add item → share → request → lend → return |
| PWA installable | Works on iOS Safari + Android Chrome |
| Performance | Page loads < 2s on 3G |
| Cost | $0/month (within free tiers) |

---

## Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Auth method | Google OAuth + Magic Link | Free, secure, no password management |
| No phone OTP | Deferred | SMS costs money, complexity |
| No photos | MVP only | Avoid NSFW moderation |
| Single-party confirmation | Lend/return | Low friction, trust-based |
| In-app notifications only | MVP | Email/push adds complexity |
| PWA over native | MVP | Faster to ship, no app store |
| Hard delete bubbles | With warning | Keep it simple, admins are responsible |
| Allow item delete with loans | With warning | Owner deals with offline |

---

## Future Considerations (Not in Scope)

- Native mobile apps (iOS/Android)
- Payment/rental fees between users
- Insurance or liability features
- Integration with other platforms
- Commercial/business lending
- Shipping/delivery coordination
