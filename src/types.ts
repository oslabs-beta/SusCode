//=========== Types interfaces for state management in the panel ===========//

export interface resultsObj {
  [key: string]: number;
}
export interface scanResult {
  filepath?: string;
  results: resultsObj[];
}

export interface panelCache {
  [displayName: string]: scanResult;
}
