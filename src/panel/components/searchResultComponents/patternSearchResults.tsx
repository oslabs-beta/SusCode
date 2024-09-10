import * as React from 'react';

export default function PatternSearchResults(props: any) {
  const { results } = props;
  function getRandom() {
    return Math.random() * 100;
  }
  const resultPhrases = results.map((funcObj: any) => {
    return (
      <div key={getRandom()}>
        <strong>{funcObj.name}</strong> was found {funcObj.count} times.
      </div>
    );
  });

  return <div>{resultPhrases}</div>;
}
