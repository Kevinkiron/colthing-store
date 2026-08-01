# Luna Atelier — Premium Daily-Wear E-commerce for Women

A cinematic, scroll-driven e-commerce storefront built with Next.js 16, React 19,
Tailwind CSS, Framer Motion, Lenis (smooth scroll), and React Three Fiber
(rotating 3D product viewer). Backed by Supabase (Postgres + Auth + Storage)
with a full admin panel for managing products and variants.

## What's included

- Cinematic homepage: hero, brand story, new collection showcase, shop-by-edit
  editorial grid, 3D rotating featured product with colour/size selector,
  testimonials + brand values + stats.
- Shop page with search, category filters, and sorting.
- Product detail page with gallery, colour/size variant selection, size guide,
  add to bag, wishlist.
- Cart drawer + dedicated cart page.
- Stub checkout (collects customer + shipping details, saves the order to
  Supabase — no payment is processed yet).
- Wishlist (persisted in the browser).
- Admin panel at `/admin`:
  - Sign up / sign in (Supabase Auth).
  - Product list, create, edit, delete.
  - Variant management (size, colour, swatch, SKU, price override, stock).
  - Image upload straight to Supabase Storage, or paste an image URL.
  - Orders list with status updates.
- Fully mobile responsive.

## 1. Run it locally

You need Node.js 18.18+ installed.

```bash
npm install
npm run dev
```

Open http://localhost:3000. A `.env.local` file is already included with a
live Supabase project's URL and public (anon) key, so the site works out of
the box — no product data will exist yet until you add some from the admin.

## 2. Create your admin account

1. Go to `/admin/login`.
2. Click "First time? Create the admin account" and sign up with your email
   and a password.
3. Sign back in — you'll land on the Products dashboard.
4. **Important:** once your account is created, go to your Supabase project
   dashboard → Authentication → Providers → Email, and turn OFF "Allow new
   users to sign up" so nobody else can create an admin account.

## 3. Add your products

From `/admin/products` → "Add Product":
- Fill in name, description, category, price.
- Add one or more variants (size + colour + stock + optional price override).
- Upload images (stored in the `product-images` Supabase Storage bucket) or
  paste image URLs.
- Set status to "Active" so it shows on the public site, and toggle
  Featured/Bestseller/New as needed.

The homepage's "New Arrivals" section automatically shows your Featured
products.

## 4. Supabase project details

This project already has a Supabase backend provisioned for you (free tier):

- Project URL and anon key: see `.env.local`.
- Tables: `categories`, `products`, `product_images`, `product_variants`,
  `orders`, `order_items`, `admin_profiles`.
- Row Level Security is enabled: anyone can read active products; only signed-in
  users (your admin account) can create/edit/delete products, categories, and
  variants, or view orders. Anyone can place an order (checkout).
- Storage bucket `product-images` is public for reading, write-protected to
  signed-in admins.

⚠️ Supabase free-tier projects pause automatically after 7 days with no
activity. Visiting your Supabase dashboard or making a request wakes it back
up within a minute. If you outgrow the free tier, upgrade from the Supabase
dashboard.

## 5. Deploy for free — Vercel (recommended)

1. Push this project to a GitHub repository (create one on github.com, then:
   `git init && git add . && git commit -m "Luna Atelier" && git remote add origin <your-repo-url> && git push -u origin main`).
2. Go to https://vercel.com, sign up free, click "Add New… → Project", and
   import your GitHub repo.
3. Vercel auto-detects Next.js. Before deploying, add these Environment
   Variables (from your `.env.local`):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Click Deploy. You'll get a free `your-project.vercel.app` URL, with HTTPS
   included. You can attach a custom domain later, also free on Vercel's
   Hobby plan (you just pay your domain registrar).

### Alternative: Netlify

Netlify's free tier also supports Next.js. Import the GitHub repo at
https://app.netlify.com, add the same two environment variables in Site
Settings → Environment Variables, and deploy. Netlify auto-detects the
Next.js runtime.

## 6. Known limitations / next steps

- **Payments are a stub.** Checkout saves the order to Supabase but does not
  charge a card. When you're ready, integrate Razorpay (popular in India) or
  Stripe — both have generous free tiers to start and only charge a
  transaction fee once you're taking payments.
- **Placeholder photography.** The homepage currently uses royalty-free
  Unsplash photography as placeholders. Replace with real product photography
  before launch — swap the URLs in `src/components/home/*` and upload your own
  product images via the admin panel.
- **First admin sign-up is public** until you disable it in Supabase (see
  step 2). Do this before sharing the site publicly.
- This project was built and type-checked (`tsc --noEmit`) and linted
  (`eslint`) successfully. If you want to double check the production build
  yourself, run `npm run build` locally or just deploy to Vercel — Vercel's
  build servers will run it for you automatically as part of every deploy.

## Tech stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v3 ·
Framer Motion · Lenis · Three.js + React Three Fiber · Zustand ·
Supabase (Postgres, Auth, Storage) · Lucide icons.
