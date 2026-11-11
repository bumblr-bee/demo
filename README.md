# Katha Chitra Bill Generator v0.1

A local-first Next.js / TypeScript bill studio for one business owner. Create a bill, preview it on A4 pages, generate a PDF, and download or share the saved original. No account, API key, or backend database is required.

## Run locally

Use Node.js 22.18+ (Node.js 24 LTS recommended) and npm.

```sh
npm install
npm run dev
```

Open http://127.0.0.1:3000. For a production server:

```sh
npm run typecheck
npm test
npm run build
npm start
```

A dependency lockfile is included. Use `npm ci` for reproducible installs. All invoice fonts are packaged through Fontsource and served locally, without Google Fonts requests at runtime.

## Use the studio

1. Open **Business profile**, replace the fictional sample contact and bank details, and save. Business name, From name/address, heading, prefix, and a positive starting number are required. Payment and contact fields are optional.
2. In **New bill**, choose Wedding, Puja, Party, or Other. Enter the invoice date, recipient, and address/location. Add between one and six services with their own event dates, descriptions, and positive INR prices (up to two decimal places). The add button disables at six; validation also rejects bills with more than six services.
3. Category changes fill blank/untouched presets and preserve text you have edited. Other has no occasion preset. Invoice dates and event dates are separate.
4. Select **Generate PDF**. Successful generation saves the bill and advances the sequence atomically. Download/share actions reuse that exact saved PDF and never advance numbering.
5. Find prior bills in **Saved bills**. Profile edits do not change their saved details or PDF files. Editing a generated bill's form creates a new bill on the next generation.

Default numbering is prefix `KC-` plus starting number `2`, formatted `KC-02`. It grows to `KC-100` naturally. Changing the configured starting number or prefix changes future allocation; existing numbers are always skipped. Concurrent generation checks the sequence again at commit and retries if necessary.

## Reference and PDF behavior

`Updated_Bill.pdf` is the primary design source; `KC02_draft.png` is the sample comparison. The textured image and original decorative signature outlines were extracted locally into `public/art`. To regenerate those static assets, run:

```sh
node scripts/extract-reference.mjs
```

The shared invoice component preserves the A4 portrait layout, burgundy/charcoal corner accent, Bill To and From sections, payment footer, and DATE | OCCASION | PRICE table with a burgundy header, thin red dividers, and dark total bar. Montserrat, PT Serif, and Noto Sans Bengali are bundled as full fonts through npm packages rather than using the reference's incomplete PDF font subsets.

The preview uses the same fixed-size document used for export. Pages are measured after fonts load; long tables repeat their headers, long individual descriptions continue across pages, and the total and payment information stay together on the final page. Very large profile text that cannot fit on A4 reports a layout error rather than silently cropping.

PDF pages are browser-rendered images at approximately 300 DPI, assembled using jsPDF. This preserves Bengali shaping and preview fidelity. Text in the exported PDF is not selectable or searchable. Multipage PDFs can be relatively large.

## Sharing

**Share PDF** opens a dialog with an editable message. If the browser supports file sharing, a separate user click opens the device share sheet with the actual PDF. Native sharing requires a supported browser and a secure context (HTTPS or localhost). Cancelling the sheet does not count as an error.

The same dialog always offers **Download PDF**, **WhatsApp**, and **Email draft**. WhatsApp/email links prefill the message; they cannot attach a browser-local file. Download the PDF and attach it manually. The owner chooses the recipient and sends the message. No bill files or business details are uploaded by this app.

## Storage

Versioned IndexedDB stores the profile, sequence, generated bill snapshots, and original PDF Blobs. Data belongs to the current browser and site origin; it does not synchronize between devices, browsers, ports, or Vercel preview URLs. Clearing site data or using an ephemeral/private session can remove it. Download important bills for safekeeping. Storage failures do not report a successful save or advance the number.

## Sample and checks

Choose **Load sample Puja bill**. On a fresh browser origin, verify:

| Field | Expected |
| --- | --- |
| Invoice number | KC-02 |
| Invoice date | 7 Nov 2026 |
| Event date | 8 Nov 2026 |
| Occasion | কালী পূজা |
| Total | ₹2,000.00 |

The sample action changes the draft only; it never overwrites a saved business profile or resets the sequence. To verify KC-02 after other bills have been generated, use a clean browser context.

```sh
npm test
npx playwright install chromium
npm run test:e2e
```

Unit checks cover the sample, required fields, invalid calendar dates/prices, integer-paise calculations, multiple rows, category preservation, profile validation, and numbering. Playwright scenarios cover desktop/mobile layouts, actual A4 PDF export and page count, durable profile snapshots, next numbering, long Bengali tables, editable share fallbacks, and mocked native file sharing. Browser tests save preview screenshots and PDFs under `test-results/` for visual inspection. Compare the generated sample with both supplied references; inspect every continuation page for clipping and footer placement. Actual OS share sheets and recipient apps require a supported device for a manual check.

### Verification in the authoring environment

- **Passed:** all 9 unit tests, including the exact Puja fixture and the six-service boundary.
- **Passed:** TypeScript checks and the optimized production build.
- **Passed:** all 14 desktop/mobile browser scenarios using the installed Microsoft Edge browser, including real PDF downloads, saved profile snapshots, sharing mocks/fallbacks, the six-service limit, and mobile widths of 320, 390, and 650 pixels without horizontal page scrolling.
- Generated sample and continuation-page PDFs were rendered to images for visual inspection. Native OS share sheets still need a supported device for a manual check.

To run browser checks using an existing Microsoft Edge installation in PowerShell:

```powershell
$env:PLAYWRIGHT_CHANNEL = 'msedge'
npm.cmd run test:e2e
```

On mobile, fields use readable text and larger touch targets, services are stacked, quick links jump between form and preview, and saved bills appear as cards. The invoice retains its A4 layout for PDF export.

## Vercel setup (later milestone)

1. Install dependencies, run all checks, visually inspect PDF output, and commit the resulting lockfile along with the app source.
2. Push the repository to your Git provider and import it as a new Vercel project.
3. Select the **Next.js** framework preset. Use the repository root, `npm run build` as the build command, and the default Next.js output setting. Choose a compatible Node.js version. No environment variables are needed.
4. Deploy when you are ready, then check profile saving, the sample export, mobile layout, and sharing on the HTTPS URL.
5. Existing localhost data will not appear on the deployment: enter the profile on the new origin. Use a stable production domain for continued browser storage.

No deployment has been performed for this milestone.
