// ==UserScript==
// @name         Bunpro - Jisho Buttons in Top Bar
// @namespace    https://tampermonkey.net/
// @version      0.5.1
// @description  Adds Jisho Word / Sentence buttons to Bunpro's top-left icon bar.
// @author       Arman
// @match        https://bunpro.jp/*
// @match        https://www.bunpro.jp/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const CONTAINER_ID = 'arman-jisho-topbar-buttons';

    function log(...args) {
        console.log('[Bunpro Jisho]', ...args);
    }

    function cleanText(text) {
        return (text || '')
            .replace(/\s+/g, ' ')
            .replace(/\s+([。、！？])/g, '$1')
            .trim();
    }

    function isJapanese(text) {
        return /[一-龯ぁ-んァ-ン々ー]/.test(text || '');
    }

    function openJisho(text, { kanji = false } = {}) {
        const q = cleanText(text);
        if (!q) {
            alert('No text found to search.');
            return;
        }

        const base = 'https://jisho.org/search/';
        const url = kanji
            ? `${base}%23kanji${encodeURIComponent(q)}`
            : `${base}${encodeURIComponent(q)}`;

        window.open(url, '_blank', 'noopener,noreferrer');
    }

    function rubyToText(rubyEl) {
        if (!rubyEl) return '';

        let out = '';

        rubyEl.childNodes.forEach((node) => {
            if (node.nodeType === Node.TEXT_NODE) {
                out += node.textContent || '';
                return;
            }

            if (node.nodeType !== Node.ELEMENT_NODE) return;

            const tag = node.tagName.toLowerCase();
            if (tag === 'rt' || tag === 'rp') return;

            out += node.textContent || '';
        });

        return cleanText(out);
    }

    function nodeToJapaneseText(node) {
        if (!node) return '';

        if (node.nodeType === Node.TEXT_NODE) {
            return node.textContent || '';
        }

        if (node.nodeType !== Node.ELEMENT_NODE) {
            return '';
        }

        const el = node;
        const tag = el.tagName.toLowerCase();

        if (tag === 'rt' || tag === 'rp') {
            return '';
        }

        if (tag === 'ruby') {
            return rubyToText(el);
        }

        let out = '';
        el.childNodes.forEach((child) => {
            out += nodeToJapaneseText(child);
        });

        return out;
    }

    function stripInlineFuriganaParens(text) {
        let out = text || '';

        out = out.replace(/([一-龯々〆ヵヶぁ-んァ-ンー]+)\(([ぁ-んァ-ンー]+)\)/g, '$1');
        out = out.replace(/\(\s*\)/g, '');
        out = out.replace(/\s+([。、！？])/g, '$1');

        return cleanText(out);
    }

    function getQuestionSection() {
        return document.querySelector('#js-tour-quiz-question');
    }

    function getVisibleAnswerWord() {
        const correctRoot =
            document.querySelector('.text-correct') ||
            document.querySelector('span.inline-block.text-correct');

        if (correctRoot) {
            const fullText = stripInlineFuriganaParens(nodeToJapaneseText(correctRoot));
            if (isJapanese(fullText)) {
                return fullText;
            }
        }

        const rubyInCorrect =
            document.querySelector('.text-correct ruby') ||
            document.querySelector('span.inline-block.text-correct ruby') ||
            document.querySelector('.text-correct [data-force-furigana] ruby');

        if (rubyInCorrect) {
            const rubyText = rubyToText(rubyInCorrect);
            if (isJapanese(rubyText)) return rubyText;
        }

        return '';
    }

    function findQuestionLineElement() {
        const section = getQuestionSection();
        if (!section) return null;

        const candidates = [
            section.querySelector('.bp-quiz-question'),
            section.querySelector('[class*="QuestionSentenceQuestionCloze"]'),
            section.querySelector('[class*="QuestionSentence"]'),
            section.querySelector('[class*="question"]')
        ].filter(Boolean);

        for (const el of candidates) {
            const text = stripInlineFuriganaParens(nodeToJapaneseText(el));
            if (isJapanese(text)) return el;
        }

        let bestEl = null;
        let bestLen = 0;

        section.querySelectorAll('div, span, p').forEach((el) => {
            const text = stripInlineFuriganaParens(nodeToJapaneseText(el));
            if (!isJapanese(text)) return;
            if (text.length > bestLen) {
                bestLen = text.length;
                bestEl = el;
            }
        });

        return bestEl;
    }

    function getQuestionTextWithBlankMarker() {
        const root = findQuestionLineElement();
        if (!root) return '';

        function walk(node) {
            if (!node) return '';

            if (node.nodeType === Node.TEXT_NODE) {
                return node.textContent || '';
            }

            if (node.nodeType !== Node.ELEMENT_NODE) {
                return '';
            }

            const el = node;
            const tag = el.tagName.toLowerCase();
            const className = typeof el.className === 'string' ? el.className : '';

            if (tag === 'rt' || tag === 'rp') {
                return '';
            }

            if (tag === 'ruby') {
                return rubyToText(el);
            }

            if (
                className.includes('text-correct') ||
                className.includes('text-wrong') ||
                className.includes('bp-quiz-input') ||
                className.includes('study-area-input') ||
                className.includes('inline-block text-correct') ||
                el.hasAttribute('data-answer') ||
                el.hasAttribute('data-cloze')
            ) {
                const text = stripInlineFuriganaParens(nodeToJapaneseText(el));
                if (isJapanese(text)) return text;
            }

            const text = cleanText(el.textContent || '');

            if (/^[_＿]+$/.test(text) || /^[—―ー]+$/.test(text)) {
                return '[[ANSWER]]';
            }

            let out = '';
            el.childNodes.forEach((child) => {
                out += walk(child);
            });

            return out;
        }

        let result = walk(root);

        result = result.replace(/[_＿]{2,}/g, '[[ANSWER]]');
        result = result.replace(/[—―]{2,}/g, '[[ANSWER]]');

        return cleanText(stripInlineFuriganaParens(result));
    }

    function getSentenceForJisho() {
        const raw = getQuestionTextWithBlankMarker();
        const answer = getVisibleAnswerWord();

        if (!raw && answer) return answer;
        if (!raw) return '';

        let sentence = raw;

        if (answer) {
            sentence = sentence.replace(/\[\[ANSWER\]\]/g, answer);
        }

        sentence = sentence.replace(/\[\[ANSWER\]\]/g, '');
        sentence = stripInlineFuriganaParens(sentence);
        sentence = cleanText(sentence);

        return sentence;
    }

    function getTopLeftBar() {
        const candidates = [
            document.querySelector('header .flex'),
            document.querySelector('header nav'),
            document.querySelector('header'),
            document.querySelector('[class*="top"]'),
            document.querySelector('[class*="header"]')
        ].filter(Boolean);

        for (const el of candidates) {
            const buttons = el.querySelectorAll('button, a, svg');
            if (buttons.length >= 3) return el;
        }

        return null;
    }

    function createIconButton({ title, label, onClick }) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.title = title;
        btn.setAttribute('aria-label', title);

        btn.style.display = 'inline-flex';
        btn.style.alignItems = 'center';
        btn.style.justifyContent = 'center';
        btn.style.width = '40px';
        btn.style.height = '40px';
        btn.style.border = 'none';
        btn.style.background = 'transparent';
        btn.style.color = 'inherit';
        btn.style.cursor = 'pointer';
        btn.style.borderRadius = '8px';
        btn.style.fontSize = '18px';
        btn.style.lineHeight = '1';
        btn.style.opacity = '0.9';

        btn.addEventListener('mouseenter', () => {
            btn.style.background = 'rgba(0,0,0,0.06)';
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.background = 'transparent';
        });

        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            onClick();
        });

        btn.textContent = label;
        return btn;
    }

    function createButtonGroup() {
        const wrap = document.createElement('div');
        wrap.id = CONTAINER_ID;
        wrap.style.display = 'inline-flex';
        wrap.style.alignItems = 'center';
        wrap.style.gap = '4px';
        wrap.style.marginLeft = '8px';

        const wordBtn = createIconButton({
            title: 'Search revealed answer in Jisho',
            label: '単',
            onClick: () => {
                const answer = getVisibleAnswerWord();
                if (!answer) {
                    alert('Could not find the revealed Japanese answer yet. Try after showing the correct answer.');
                    return;
                }
                log('word:', answer);
                openJisho(answer, { kanji: true });
            }
        });

        const sentenceBtn = createIconButton({
            title: 'Search full sentence in Jisho',
            label: '文',
            onClick: () => {
                const sentence = getSentenceForJisho();
                if (!sentence) {
                    alert('Could not find the Japanese sentence.');
                    return;
                }
                log('sentence:', sentence);
                openJisho(sentence);
            }
        });

        wrap.appendChild(wordBtn);
        wrap.appendChild(sentenceBtn);
        return wrap;
    }

    function injectIntoTopBar() {
        if (document.getElementById(CONTAINER_ID)) return;

        const topBar = getTopLeftBar();
        if (!topBar) return;

        let leftCluster = null;

        const flexChildren = Array.from(topBar.children || []);
        if (flexChildren.length >= 2) {
            leftCluster = flexChildren[0];
        }

        const target = leftCluster || topBar;
        target.appendChild(createButtonGroup());
    }

    function init() {
        injectIntoTopBar();

        const observer = new MutationObserver(() => {
            if (!document.getElementById(CONTAINER_ID)) {
                injectIntoTopBar();
            }
        });

        observer.observe(document.documentElement, {
            childList: true,
            subtree: true
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();