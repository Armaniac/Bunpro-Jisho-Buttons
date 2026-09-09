# Bunpro Jisho Buttons

A lightweight Tampermonkey userscript that adds two Jisho search buttons to Bunpro's top bar during reviews.

[Open `bunpro-jisho.user.js` on GitHub](https://github.com/Armaniac/bunpro-jisho/blob/main/bunpro-jisho.user.js)

## What it does

- **単 — answer search:** opens the revealed answer in Jisho with the `#kanji` filter. For example, `糸` is searched as `糸 #kanji`.
- **文 — sentence search:** opens the complete Japanese question sentence in Jisho, including the revealed answer and excluding furigana readings.
- Both searches remain unavailable until Bunpro has revealed the answer, preventing incomplete or incorrect searches.

## Installation

### Method 1: Copy and paste — recommended for beginners

1. Install [Tampermonkey](https://www.tampermonkey.net/) in your browser.
2. Open **[bunpro-jisho.user.js on GitHub](https://github.com/Armaniac/bunpro-jisho/blob/main/bunpro-jisho.user.js)**.
3. Select the **Raw** button above the script.
4. On the page containing only the script text, press `Ctrl+A` and then `Ctrl+C`. On a Mac, press `Command+A` and then `Command+C`.
5. Select the Tampermonkey icon in your browser and open **Dashboard**.
6. Select the **+** tab or **Create a new script**.
7. In the editor, press `Ctrl+A` and delete the example code already there. On a Mac, press `Command+A`.
8. Paste the copied script with `Ctrl+V`, or `Command+V` on a Mac.
9. Select **File → Save**, or press `Ctrl+S`/`Command+S`.
10. Confirm that **Bunpro - Jisho Buttons in Top Bar** is enabled in the Tampermonkey dashboard.
11. Open or reload a [Bunpro](https://bunpro.jp/) review page.

### Method 2: Install from the script URL

1. Install Tampermonkey and open its **Dashboard**.
2. Open the **Utilities** tab. If it is hidden, change Tampermonkey's **Config mode** to **Beginner** or **Advanced** first.
3. Find **Install from URL** and paste this address:

   ```text
   https://raw.githubusercontent.com/Armaniac/bunpro-jisho/main/bunpro-jisho.user.js
   ```

4. Select **Install**, review the script, and confirm the installation.
5. Reload the Bunpro review page.

### Method 3: Install a downloaded file in Chrome

1. Open **[bunpro-jisho.user.js on GitHub](https://github.com/Armaniac/bunpro-jisho/blob/main/bunpro-jisho.user.js)** and select **Download raw file**.
2. Open `chrome://extensions` in Chrome.
3. Open Tampermonkey's **Details** and enable **Allow access to file URLs**.
4. Drag the downloaded `bunpro-jisho.user.js` file into a Chrome window.
5. Review and confirm Tampermonkey's installation prompt, then reload Bunpro.

> **Note:** Tampermonkey's **Import from file** area is intended for Tampermonkey backup files in JSON or ZIP format. It may reject an individual `.user.js` file, so use one of the methods above instead.

## Usage

After answering a Bunpro review question:

1. Select **単** to look up only the revealed answer using Jisho's `#kanji` filter.
2. Select **文** to search the complete Japanese sentence.

Before the answer is revealed, either button displays a message instead of opening an incomplete Jisho search.

## Updates

Tampermonkey can update the script automatically from this repository. Every published script change must include a higher `@version` value so installed copies can detect it.

To check manually, open Tampermonkey's dashboard and use its userscript update command.

## Privacy and permissions

- The script does not collect, store, or transmit browsing data.
- It requests no privileged Tampermonkey APIs (`@grant none`).
- When you select a search button, the relevant Japanese text is placed in the Jisho search URL and opened in a new tab.

## Compatibility

This is an unofficial community project and is not affiliated with Bunpro, Jisho, or Tampermonkey. Bunpro interface changes may occasionally require an update to the script.

If something stops working, [open an issue](https://github.com/Armaniac/bunpro-jisho/issues) and include:

- What you expected to happen
- What happened instead
- Whether the answer was correct or incorrect
- A screenshot of the Bunpro question, with personal browser information cropped out
- Your browser and script version

## Development

The project has no runtime dependencies. To validate the script locally:

```sh
node --check bunpro-jisho.user.js
```

Pull requests are welcome. Keep the install filename and the raw `main` URLs stable, and increase `@version` for every published change.

The original `Bunpro - Jisho Buttons in Top Bar.js` file is retained only as a migration path for early installations. Make code changes in `bunpro-jisho.user.js`. Do not change the userscript's `@name` or `@namespace` without planning a migration, because they identify existing installations.

## License

Released under the [MIT License](LICENSE).
