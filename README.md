# Knit & Knot — Premium Bespoke Fashion Atelier

A material-first, bespoke fashion e-commerce experience built with Next.js 16,
React 19, Tailwind CSS, Framer Motion, Lenis (smooth scroll), and React Three
Fiber. Backed by Supabase (Postgres + Auth + Storage).

**Core model:** Category → Material (informational, never sold) → Products
(finished garments, purchasable). Every product page offers three paths: buy
it as shown, customize it, or submit a fully bespoke request using the same
material.

## What changed in this rework

This project began as a simpler "Luna Atelier" affordable-daily-wear store.
It has been restructured (not rebuilt from scratch) around the new Knit &
Knot business model:

- **New `materials` entity** sits between categories and products. Materials
  have no price, stock, or cart/checkout path — they are purely editorial
  (description, composition, colour, texture, characteristics, care, image
  gallery split into gallery/texture/lifestyle).
- **Products now link to a material** and carry a `garment_type` (shirt,
  dress, kurta, trousers, other) that drives which measurement fields appear
  during customization.
- **Customization system**: admin-configurable options (e.g. Fit, Sleeve,
  Collar) each with values that carry an optional additional price. Prices
  update live as a customer builds their design at `/customize/[slug]`.
- **Custom request pipeline**: `/custom-request` lets a customer describe a
  fully bespoke garment (material, garment type, description, measurements,
  reference/sketch/inspiration image uploads, preferred fit, colour, delivery
  date, budget). Submitting generates a request number
  (`KNK-REQ-XXXXX`) trackable at `/requests/[number]` via a two-factor lookup
  (request number + the email used to submit — no login required, and this
  lookup runs through a locked-down database function rather than an open
  table read, so one customer can never see another's request by guessing a
  number).
- **Admin quotation builder**: for a given request, admin adds line items
  (Tailoring, Customization, Embroidery, etc.), the total is computed
  automatically, and saving marks the request "Quotation Ready." The
  customer can then Accept & Pay (stub — no real payment yet, matches your
  original checkout) or Request Changes from the tracking page.
- **Customer accounts** (`/account`, separate from `/admin`) let a customer
  save multiple measurement profiles (e.g. "Standard," "Relaxed Fit"), reuse
  them anywhere measurements are asked for, and see their order and custom
  request history.
- **Admin panel** gained Categories (full CRUD, previously only editable via
  SQL), Materials (full CRUD with the three image types), a rebuilt Products
  form (material link, garment type, customization option/value builder
  nested in the same form), Custom Requests (review, status pipeline,
  quotation builder), and a Dashboard with live counts.
- **Security fix while I was in the data model anyway:** previously *any*
  signed-in user was treated as an admin. Since the new model needs regular
  customer accounts (for measurements and order history), that would have
  let any customer sign-up their way into the admin panel. Admin access is
  now gated by a real `admin_profiles` table — only accounts an existing
  admin explicitly adds count as admin. Your existing login
  (kvnkiron@gmail.com) was grandfathered in automatically. There is no
  public "sign up" on `/admin/login` anymore; see "Adding another admin"
  below.
- Your two real products (Butter Toast Co-Ord Set, Onam Davani) were left
  untouched — they just don't have a material linked yet. Edit them from
  `/admin/products` to assign one, or leave them without a material (the
  product page simply won't show the "Made with..." link).
- Sample data added alongside your products: category "Linen," three
  materials (Premium Beige Linen, Midnight Linen, Soft Rose Linen), and four
  garments made from Premium Beige Linen (Relaxed Linen Shirt, Linen Summer
  Dress, Linen Kurta, Wide-Leg Linen Trousers) — with customization options
  pre-configured on three of them, so all three customer flows are testable
  immediately.

## What's intentionally simplified for this pass

Given the scope of the rework, a few nice-to-haves from the brief were left
for a follow-up rather than half-built:

- **Reviews and a Media Library admin section** are not built. Product/
  material reviews aren't collected yet; images are managed per-entity
  (product, material, request) rather than in a shared library.
- **Admin "Customers" and "Settings" screens** aren't built — you can see
  customer info attached to orders/requests, and change store details/RLS
  in the Supabase dashboard directly for now.
- **Payments remain a stub**, matching your original setup — orders and
  accepted quotations are saved to the database but no card is charged. Real
  payment integration (Razorpay/Stripe) is the natural next step once you
  register a business.
- **"Sale Price"** is implemented as the existing "Compare-at Price" pattern
  (struck-through original price shown above the current price) rather than
  a literal second field — same customer-facing effect, opposite field name
  to the brief. Easy to rename later if you want the literal field split.

## Run it locally

```bash
npm install
npm run dev
```

A working `.env.local` with your live Supabase project is already included.

## Test the three core flows

1. **Buy As Shown**: Home → Explore Materials → Premium Beige Linen →
   Relaxed Linen Shirt → pick size/colour → Buy As Shown → Cart → Checkout.
2. **Customize an existing design**: same product page → Customize This
   Design → pick fit/sleeve/collar/embroidery → enter measurements → Add to
   Bag → Checkout (bag shows "Customized Design" with the price breakdown).
3. **Fully bespoke**: Home → Have Your Own Idea? → Create Something Custom →
   fill in material, garment type, description, measurements, upload
   reference images → Submit → note the `KNK-REQ-...` number → as admin, go
   to `/admin/custom-requests`, open it, update status, build a quotation →
   as the customer, revisit `/requests/[number]` with your email → Accept &
   Pay.

## Admin access

Sign in at `/admin/login` with your existing email/password
(kvnkiron@gmail.com). There's no public sign-up anymore.

### Adding another admin

Run this in the Supabase SQL editor (Dashboard → SQL Editor), after that
person has created a normal account by signing up at `/account/login`:

```sql
insert into admin_profiles (id, full_name)
select id, 'Their Name' from auth.users where email = 'their-email@example.com';
```

## Deploying

Same as before — push to GitHub, import into Vercel (free tier), add the two
environment variables from `.env.local`
(`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`), deploy.

## Tech stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v3 ·
Framer Motion · Lenis · Three.js + React Three Fiber · Zustand ·
Supabase (Postgres, Auth, Storage) · Lucide icons.

This build was verified with `tsc --noEmit` and `eslint` (both clean). As
before, a full `next build` couldn't be completed inside this working
sandbox due to a native-compiler crash unrelated to this code (a bare,
unmodified Next.js scaffold hits the same crash in this environment) —
Vercel's build servers don't have this issue, so `npm run build` should be
verified there or on your own machine before considering this final.
