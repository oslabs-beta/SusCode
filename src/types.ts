//=========== Types interfaces for state management in the panel ===========//

export interface resultsObj {
  [key: string]: number;
}
export interface scanResult {
  filepath: string[];
  results: resultsObj[];
}

export interface panelCache {
  [displayName: string]: scanResult;
}

export interface FileUploadResponse {
  data: {
    type: string;
    id: string;
    links: {
      self: string;
    };
  };
}

export interface AnalysisResponse {
  data: {
    id: string;
    type: string;
    links: {
      self: string;
      item: string;
    };
    attributes: {
      date: number;
      stats: Record<string, any>; 
      results: Record<string, {
        method: string;
        engine_name: string;
        engine_version: string;
        engine_update: string;
        category: string;
        result: any; 
      }>;
      status: string;
    };
  };
  meta: {
    file_info: {
      sha256: string;
      md5: string;
      sha1: string;
      size: number;
    };
  };
}

