import * as React from 'react';

interface ClickableLinkProps {
  file: string;
  line: number;
  column: number;
  text: string;
}

const ClickableLink: React.FC<ClickableLinkProps> = ({ file, line, column, text }) => {
  const href = encodeURI(`vscode://file/${file}:${line}:${column}`);
  return <a href={href}>{text}</a>;
};

export default function TelemetrySearchResults(props: any) {
  const { results } = props;
  // function getRandom() {
  //   return Math.random() * 100;
  // }

  console.log('inside the tele tsx file!', results)
  if (!results.length) {
    return (
      //'No potential network requests found.'
      <div>
        {results[0]}
      </div>
    )
  }

  return (
    <div>
      {results.map((result: any, index: any) => (
        <div key={index} style={{ marginBottom: '20px' }}>
          <div>File: {result.file}</div>
          {result.originalFile && (
            <div>
              Original:{' '}
              <ClickableLink
                file={result.originalFile}
                line={result.originalLine!}
                column={result.originalColumn!}
                text="Original Source"
              />
            </div>
          )}
          <div>
            Minified:{' '}
            <ClickableLink
              file={result.file}
              line={result.line}
              column={result.column}
              text="Minified Source"
            />
          </div>
          <div>URL: {result.url}</div>
        </div>
      ))}
    </div>
  );
}
