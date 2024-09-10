import * as React from 'react';
import PatternSearchResults from './searchResultComponents/patternSearchResults';
import TelemetrySearchResults from './searchResultComponents/telemetrySearchResults';
import Paper from '@mui/material/Paper';

export default function Results(props: any) {
  const { patternMatchPanelResults, telemetryMatchPanelResults } = props;
  return (
    <div>
      <PatternSearchResults results={patternMatchPanelResults} />
      <Paper
        style={{
          maxHeight: 300,
          overflow: 'auto',
          background: 'inherit',
        }}
        elevation={4}
      >
        <TelemetrySearchResults results={telemetryMatchPanelResults} />
      </Paper>
    </div>
  );
}
