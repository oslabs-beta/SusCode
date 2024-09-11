//=========== Types interfaces for state management in the panel ===========//

export interface resultsObj {
  [key: string]: number;
}

export interface telemResults {
  column: number;
  file: string;
  line: number;
  url: string;
}

export interface scanResult {
  filepath: string[];
  results: resultsObj[];
  telemResultsObj?: telemResults[];
  depVulns?: any; //[[{}, {}],[{}, {}]] //push to panelState.displayName.depResults
}

export interface panelCache {
  [displayName: string]: scanResult;
}

export interface infoObj {
  pattern: string;
  heading: string;
  info: string;
  regex: any;
}
