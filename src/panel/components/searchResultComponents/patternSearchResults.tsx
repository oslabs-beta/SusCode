import Typography from '@mui/material/Typography';
import * as React from 'react';

export default function PatternSearchResults(props: any) {
  const { results } = props;
  function getRandom() {
    return Math.random() * 100;
  }
  const resultPhrases = results.map((funcObj: any) => {
    if (!funcObj.name) {
      return <Typography
        key={getRandom()}
        variant='subtitle1'
        sx={{ marginLeft: '8px', color: '#b3b3b5' }}
      >
        No pattern matches found
      </Typography>;
    }
    return (
      <Typography
        key={getRandom()}
        variant='subtitle1'
        sx={{ marginLeft: '8px', color: '#b3b3b5' }}
      >
        <strong>{funcObj.name}</strong> was found {funcObj.count} times.
      </Typography>
    );
  });

  return <div>{resultPhrases}</div>;
}
