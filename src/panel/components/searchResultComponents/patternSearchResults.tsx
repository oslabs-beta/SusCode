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
        {/* Add a button to do VirusTotal scan here -
          button will either run the scan or spawn a popup box with prompt enter api key with option to how to get with final step being enter key with input take to functionally store the key in the settings.json */}
      </Typography>
    );
  });

  return <div>{resultPhrases}</div>;
}
