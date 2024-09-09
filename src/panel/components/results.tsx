import * as React from 'react';

export default function Results(props: any) {
  const { results } = props;

  const resultPhrases = results.map((funcObj: any) => {
    return (
      <div>
        <strong>{funcObj.name}</strong> was found {funcObj.count} times.
      </div>
    );
  });

  return <div>{resultPhrases}</div>;
}
