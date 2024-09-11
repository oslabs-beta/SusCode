import * as React from 'react';
import PatternSearchResults from './searchResultComponents/patternSearchResults';
import TelemetrySearchResults from './searchResultComponents/telemetrySearchResults';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';

export default function Results(props: any) {
  const { patternMatchPanelResults, telemetryMatchPanelResults } = props;
  return (
    <div>
      <Divider sx={{ marginTop: '8px', marginBottom: '8px' }}>
        <Chip label='PATTERNS FOUND' variant='outlined' color='primary' />
      </Divider>
      <Paper
        style={{
          maxHeight: 300,
          overflow: 'auto',
          background: 'inherit',
        }}
        elevation={4}
      >
        <PatternSearchResults results={patternMatchPanelResults} />
      </Paper>
      <Divider sx={{ marginTop: '8px', marginBottom: '8px' }}>
        <Chip
          label='POTENTIAL TELEMETRY INTERACTIONS'
          variant='outlined'
          color='primary'
        />
      </Divider>
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
