import React, { useEffect, useState } from 'react';
import Terminal, { ColorMode, LineType } from 'react-terminal-ui';
import * as _ from 'lodash';

let toalRequests = 0;
let lostRequests = 0;
let preRequestTime = 0;
let postRequestTime = 0;

const App = (props = {}) => {
  const [aborted, setAborted] = useState(false);
  const [lastPrinted, setLastPrinted] = useState(false);
  const [terminalLineData, setTerminalLineData] = useState([
    { type: LineType.Output, value: 'Welcome cantconnect.online!' },
    { type: LineType.Output, value: 'We will start record your network connectivity in few seconds.' }
  ]);

  useEffect(() => {
    if (!aborted) {
      setTimeout(() => {
        ping('/sample.txt', aborted);
      }, postRequestTime - preRequestTime > 1000 ? 0 : 1000 - (postRequestTime - preRequestTime));
    } else {
      if (!lastPrinted) {
        setLastPrinted(true);
      }
    }
  }, [terminalLineData]);

  useEffect(() => {
    if (aborted && lastPrinted) {
      handleInput(`${toalRequests} requests sent, ${toalRequests - lostRequests} responses received, ${(lostRequests / toalRequests) * 100} lost`);
    }
  }, [aborted, lastPrinted]);

  const noCacheFetch = async (url) => {
    const myHeaders = new Headers();
    myHeaders.append('pragma', 'no-cache');
    myHeaders.append('cache-control', 'no-cache');

    const myInit = {
      method: 'GET',
      headers: myHeaders,
    };
    await fetch(url, myInit);
  };

  const ping = async (url, aborted) => {
    toalRequests += 1;
    preRequestTime = new Date().getTime();
    postRequestTime = 0;
    try {
      await noCacheFetch(url);
      postRequestTime = new Date().getTime();
      handleInput(`reply from ${url}: seq=${toalRequests} time=${postRequestTime - preRequestTime} ms`);
    } catch (err) {
      handleInput(`connection lost to ${url}: seq=${toalRequests}`);
      lostRequests += 1;
    }
    if (aborted) {
      handleInput(`${toalRequests} requests sent, ${toalRequests - lostRequests} responses received, ${(lostRequests / toalRequests) * 100} lost`);
    }
  };

  const handleInput = async input => {
    setTerminalLineData([...terminalLineData, { type: LineType.Input, value: _.clone(input) }]);
  };

  const handleUserInput = async input => {
    //TODO: somthing
  };

  const handleKeyDown = event => {
    let charCode = String.fromCharCode(event.which).toLowerCase();
    if (event.ctrlKey && charCode === 'c') {
      setAborted(true);
    }
    if (event.metaKey && charCode === 'c') {
      setAborted(true);
    }
  };

  return (
    <div className="container" onKeyDown={handleKeyDown}>
      <Terminal name='cantconnect.online' colorMode={ColorMode.Dark} lineData={terminalLineData} onInput={handleUserInput} />
    </div>
  )
};

export default App;