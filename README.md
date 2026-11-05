# DOMA STORE

A mobile-first static storefront for listing PUBG MOBILE accounts. It uses only HTML, CSS and vanilla JavaScript. There is no backend, build step, npm dependency or connected payment gateway.

## 1. Edit store settings

Open `js/config.js` and update the values for your store:

- `WHATSAPP`: international digits only, with no `+` or spaces.
- `TELEGRAM`: Telegram username without `@`.
- `CASH_NUMBER`: the cash/contact number shown in the footer.
- `TIKTOK_URL` and `INSTAGRAM_URL`: leave empty to hide these icons.
- `USD_RATE`: manually maintained EGP-to-USD conversion rate.
- `DEFAULT_CURRENCY` and `DEFAULT_LANG`: the first-visit defaults.
- `WARRANTY_DAYS`: confirm the actual warranty period before publishing.
- `SHOW_SAMPLE_BADGE`: keep `true` while sample listings or placeholder reviews remain.

The checkout page is DEMO ONLY. It does not accept or collect payment details, and it does not redirect customers to a payment provider. The WhatsApp button only prepares an order inquiry for the store.

## 2. Add or edit an account

Open `data/accounts.js`. Add a new object inside the `window.ACCOUNTS` array, using the same fields as the existing examples. Give each account a unique ID, for example `DS-013`.

Important fields:

- `status`: use `available`, `reserved` or `sold`.
- `sample`: set `true` for placeholder/demo listings; set `false` only for a real listing you have checked.
- `title` and `description`: provide both `ar` and `en` strings.
- `priceEGP`: the price in Egyptian pounds. The site converts it to USD using `USD_RATE`.
- `tags`: use relevant values such as `xsuit`, `mythic`, `labweapons`, `vehicles`, `highrank` and `og`.
- `video`: set the video type and source as described below.

Do not publish fabricated account specifications, stock, prices, warranty claims or customer reviews. Replace all seed data with accurate owner-verified information before launch.

## 3. Add account videos

For a YouTube video, upload it as **Unlisted** if you do not want it publicly searchable, then put only its video ID in the account object:

```js
video: { type: "youtube", src: "YOUTUBE_VIDEO_ID" }
```

For an MP4 video, place the file in a project folder such as `assets/videos/` and use a relative path:

```js
video: { type: "mp4", src: "assets/videos/DS-013.mp4" }
```

For a listing without a video yet:

```js
video: { type: "none", src: "" }
```

Keep video files reasonably compressed for visitors on mobile data. The card preview and account detail page use the supplied video source.

## 4. Update customer reviews

Open `data/reviews.js`. Replace the six placeholder records with real reviews only after you have permission to publish them. Each record uses `name`, `city`, `rating` (0–5), `text`, `date` (`YYYY-MM-DD`) and `placeholder`. Set `placeholder: false` only for a genuine review. The `SHOW_SAMPLE_BADGE` setting controls the sample badge display.

## 5. Test locally

Because this project is static, you can open `index.html` directly for a quick check. For more reliable relative paths and browser behavior, run it through any simple static file server or use the GitHub Pages preview after deployment. No build command is required.

Before launch, test Arabic RTL and English LTR, mobile widths (especially 360px), the cart and compare persistence, WhatsApp links, account video links, and all forms. The checkout intentionally remains demo-only until a separately designed and reviewed payment implementation exists.

## 6. Deploy on GitHub Pages

1. Create a GitHub repository and upload the **contents** of this folder (including `index.html`, `css/`, `js/`, `data/` and `assets/`) to the repository root, or to the folder you intend to publish.
2. Open the repository's **Settings → Pages**.
3. Under **Build and deployment**, select **Deploy from a branch**.
4. Select the branch containing the site (usually `main`) and the publishing folder (`/(root)` if `index.html` is at the repository root). Save.
5. Wait for GitHub Pages to publish the site, then open the Pages URL shown in the settings.

All internal asset and page paths in this project are relative so the site can be hosted from a GitHub Pages project subpath.

## 7. Final owner checklist

- Replace the sample account listings and sample reviews with accurate information, or keep the sample badges visible.
- Confirm the warranty days and replacement conditions in `js/config.js` and `faq.html`.
- Confirm the store's real contact numbers and social links in `js/config.js`.
- Check current game/platform rules independently. DOMA STORE is an independent third-party storefront and is not affiliated with or endorsed by Krafton or PUBG MOBILE.
