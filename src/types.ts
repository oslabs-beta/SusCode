//=========== Types interfaces for state management in the panel ===========//

export interface resultsObj {
  [key: string]: number;
}
export interface scanResult {
  filepath: string[];
  results: resultsObj[];
  depVulns?: any; //[[{}, {}],[{}, {}]] //push to panelState.displayName.depResults
}

export interface panelCache {
  [displayName: string]: scanResult;
}
