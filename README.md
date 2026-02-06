# n.mtvnk-crawler

A TypeScript web scraper that collects French language tutor profiles from [buki.com.ua](https://buki.com.ua/) (Ukrainian tutoring marketplace) and exports the data to formatted Excel files.

Created for my girlfriend to automate collecting tutor data for her job 💌

## Tech Stack

- **Puppeteer** — headless browser automation
- **ExcelJS** — Excel export with formatting
- **Zod** — runtime config validation
- **Pino** — structured logging
- **p-retry** — retry with exponential backoff

## Usage

```bash
npm install
npm run crawl    # build + run
```

For development:

```bash
npm run dev      # run with ts-node
npm run format   # format with prettier
```

## Configuration

Edit `src/index.ts` to adjust:

- `delayBetweenRequests` — delay between page loads (ms)
- `maxProfiles` — limit number of profiles (0 = unlimited)
- `headless` — set to `false` to see the browser

## Environment Variables

| Variable    | Values                          | Default |
| ----------- | ------------------------------- | ------- |
| `LOG_LEVEL` | trace, debug, info, warn, error | info    |
| `NODE_ENV`  | development, production         | —       |

## Output

Scraped data is saved to `output/tutors-TIMESTAMP.xlsx`.

## License

[MIT](LICENSE)
