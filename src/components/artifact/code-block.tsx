"use client";

import { Highlight, themes } from "prism-react-renderer";

import type { ArtifactLanguage } from "@/lib/artifact";

/** 只读、带行号的 prism 代码块。html 代码视图与流式视图共用。 */
export function CodeBlock({
  code,
  language,
}: {
  code: string;
  language: ArtifactLanguage;
}) {
  return (
    <Highlight code={code} language={language} theme={themes.github}>
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre
          className={`${className} h-full overflow-auto bg-white p-4 font-mono text-xs leading-5`}
          style={style}
        >
          {tokens.map((line, lineIndex) => {
            const lineProps = getLineProps({ line });
            return (
              <div key={lineIndex} {...lineProps}>
                <span className="mr-4 inline-block w-6 select-none text-right text-zinc-300">
                  {lineIndex + 1}
                </span>
                {line.map((token, tokenIndex) => (
                  <span key={tokenIndex} {...getTokenProps({ token })} />
                ))}
              </div>
            );
          })}
        </pre>
      )}
    </Highlight>
  );
}
