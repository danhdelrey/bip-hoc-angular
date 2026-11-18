import type { HighlighterCore } from 'shiki/core';
import type { CodeLang } from '../../../content/lesson.model';

export interface Tok {
  content: string;
  style: Record<string, string>;
}

let ready: Promise<HighlighterCore> | null = null;

/** Shiki fine-grained: chỉ nạp đúng grammar + 2 theme cần dùng, engine JS (không WASM). Lazy-load. */
function load(): Promise<HighlighterCore> {
  ready ??= (async () => {
    const [{ createHighlighterCore }, { createJavaScriptRegexEngine }] = await Promise.all([
      import('shiki/core'),
      import('shiki/engine/javascript'),
    ]);
    return createHighlighterCore({
      themes: [import('@shikijs/themes/github-light-default'), import('@shikijs/themes/github-dark-default')],
      langs: [
        import('@shikijs/langs/angular-ts'),
        import('@shikijs/langs/angular-html'),
        import('@shikijs/langs/typescript'),
        import('@shikijs/langs/css'),
        import('@shikijs/langs/tsx'),
      ],
      engine: createJavaScriptRegexEngine(),
    });
  })();
  return ready;
}

/** Tách code thành dòng -> token, mỗi token mang biến màu cho cả theme sáng và tối. */
export async function tokenize(code: string, lang: CodeLang): Promise<Tok[][]> {
  const hl = await load();
  const { tokens } = hl.codeToTokens(code, {
    lang,
    themes: { light: 'github-light-default', dark: 'github-dark-default' },
    defaultColor: false,
  });
  return tokens.map((line) =>
    line.map((t) => ({ content: t.content, style: (t.htmlStyle as Record<string, string>) ?? {} })),
  );
}

export function plain(code: string): Tok[][] {
  return code.split('\n').map((l) => [{ content: l, style: {} }]);
}
