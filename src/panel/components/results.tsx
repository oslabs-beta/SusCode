import * as React from 'react';
import PatternSearchResults from './searchResultComponents/patternSearchResults';
import TelemetrySearchResults from './searchResultComponents/telemetrySearchResults';

export default function Results(props: any) {
  const { patternMatchPanelResults, telemetryMatchPanelResults } = props;
  return (
    <div>
      <PatternSearchResults results={patternMatchPanelResults} />
      <TelemetrySearchResults results={telemetryMatchPanelResults} />
    </div>
  );
}
