<p align="center">
	<h1 align="center"><b>easyo</b></h1>
<p align="center">
    SEO Analyzer - chrome extension
    <br />
    <br />
    <a href="/">Website</a>
    ·
    <a href="https://github.com/Sellucas/easyo/issues">Issues</a>
  </p>
</p>

## About

Easyo is a Chrome extension built with Vite and TypeScript that provides a detailed analysis of a webpage's SEO structure, including metadata, internal/external links, Open Graph, Twitter cards, and more. This tool helps developers quickly assess how well a page is optimized for search engines and offers suggestions for improvement.

## Features

**SEO Analysis**: Analyze the page's title, description, keywords, and robots meta tag for SEO best practices.

**Internal & External Links**: Identify and list all internal and external links on the page.

**Metadata**: View Open Graph, Twitter Card, and general metadata for the page.

**Indexability Check**: Check if the page can be indexed by search engines.
Progress Indicators: Visual feedback on whether key SEO elements meet recommended guidelines.

**Tooltips with Recommendations**: Provides suggestions and guidelines for optimal SEO performance.

## Technologies

- React
- Typescript
- Vite
- Tailwindcss
- Shadcn/ui

## Installation

To install and run this extension locally:

1. Clone the repository:

```bash
git clone https://github.com/Sellucas/easyo.git
```

2. Install dependencies:

```bash
cd easyo
npm i
```

3. Build the project:

```bash
npm run build
```

4. Load the extension into Chrome:

- Open Chrome and navigate to chrome://extensions/.
- Enable "Developer mode".
- Click "Load unpacked" and select the dist folder from the project directory.

## License

Distributed under the MIT License. See `LICENSE` for more information.
