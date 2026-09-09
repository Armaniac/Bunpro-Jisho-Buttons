# Changelog

All notable changes to this project will be documented in this file.

## 0.5.5 - 2026-09-09

- Prepared the userscript for direct installation and automatic updates from GitHub.
- Renamed the installable script to `bunpro-jisho.user.js`.
- Retained the original filename as a compatibility path for early installations.
- Added project, support, update, license, and load-timing metadata.
- Added public documentation, an MIT license, and automated syntax validation.

## 0.5.4 - 2026-09-09

- Changed the answer button to search the revealed answer as `answer #kanji`.
- Prevented full-sentence searches until Bunpro reveals the answer.
- Added a clearer message when a search is attempted too early.

## 0.5.3 - 2026-09-09

- Improved detection of Bunpro's current review-question markup.
- Scoped answer extraction to the active Japanese question.
- Preferred the corrected answer and ignored incorrect-answer text.
