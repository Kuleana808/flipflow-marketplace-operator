# FlipFlow Seller Assistant

FlipFlow is now being rebuilt as a real Chrome extension artifact instead of a fake public-facing landing-page business.

Current artifact:
- `extension/` — loadable Manifest V3 Chrome extension

What it does right now:
- rewrites rough marketplace listings into cleaner seller copy
- generates buyer replies for common scenarios
- saves reusable snippets locally in the browser
- injects a quick helper panel on Facebook Marketplace / Craigslist / OfferUp-style pages

How to load it:
1. Open Chrome → `chrome://extensions`
2. Enable Developer Mode
3. Click `Load unpacked`
4. Select the `extension/` folder in this repo

Packaging:
- zip the `extension/` folder for manual install/testing
- do not treat the old HTML pages as the product

Status:
- internal product artifact in progress
- utility first, public polish later
