# Bunpro Jisho Buttons

A lightweight Tampermonkey userscript that adds two Jisho search buttons to Bunpro's top bar during reviews.

[Install the userscript](https://github.com/Armaniac/bunpro-jisho/blob/main/bunpro-jisho.user.js)

## What it does

- **単 — answer search:** opens the revealed answer in Jisho with the `#kanji` filter. For example, `糸` is searched as `糸 #kanji`.
- **文 — sentence search:** opens the complete Japanese question sentence in Jisho, including the revealed answer and excluding furigana readings.
- Both searches remain unavailable until Bunpro has revealed the answer, preventing incomplete or incorrect searches.

## Installation

1. Install [Tampermonkey](https://www.tampermonkey.net/) in your browser.
2. Click **[Install the userscript](https://raw.githubusercontent.com/Armaniac/bunpro-jisho/main/bunpro-jisho.user.js)**.
3. Review the script in Tampermonkey and select **Install**.
4. Open or reload a [Bunpro](https://bunpro.jp/) review page.

If the install page displays the source as plain text, open the script file on GitHub and select **Raw**, or check that Tampermonkey is enabled and permitted to run userscripts.

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
