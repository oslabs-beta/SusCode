declare function acquireVsCodeApi(): {
  postMessage: (msg: any) => void;
  setState: <T>(newState: T) => void;
  getState: <T>() => T | undefined;
};
