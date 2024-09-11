import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

interface ClickableLinkProps {
  file: string;
  line: number;
  column: number;
  text: string;
}

const ClickableLink: React.FC<ClickableLinkProps> = ({
  file,
  line,
  column,
  text,
}) => {
  const href = encodeURI(`vscode://file/${file}:${line}:${column}`);
  return <a href={href}>{text}</a>;
};

export default function TelemetrySearchResults(props: any) {
  const { results } = props;
  function getRandom() {
    return Math.random() * 100;
  }

  // console.log('inside the tele tsx file!', results)
  if (!results.length) {
    return (
      <Typography
        key={getRandom()}
        variant='subtitle1'
        sx={{ marginLeft: '8px', color: '#b3b3b5' }}
      >
        No potential network requests found.
      </Typography>
    );
  }

  return (
    <Box sx={{ color: 'rgb(191 182 182 / 60%)', padding: '4px 2px' }}>
      {results.map((result: any, index: any) => (
        <Box key={index} style={{ marginBottom: '20px', padding: '4px 4px' }}>
          <div>File: {result.file}</div>
          {result.originalFile && (
            <div>
              Original:{' '}
              <ClickableLink
                file={result.originalFile}
                line={result.originalLine!}
                column={result.originalColumn!}
                text='Original Source'
              />
            </div>
          )}
          <div>
            Minified:{' '}
            <ClickableLink
              file={result.file}
              line={result.line}
              column={result.column}
              text='Minified Source'
            />
          </div>
          <div>URL: {result.url}</div>
          <div>Line Number: {result.line}</div>
          <div>Column: {result.column}</div>
        </Box>
      ))}
    </Box>
  );
}
