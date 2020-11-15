let toalRequests = 0;
let lostRequests = 0;

const ping = async (url, aborted, append) => {
    toalRequests += 1;
    const preRequestTime = new Date().getTime();
    let postRequestTime = 0;
    try {
        await fetch(url);
        postRequestTime = new Date().getTime();
        debugger
        append(`reply from ${url}: seq=${toalRequests} time=${postRequestTime - preRequestTime} ms`);
    } catch (err) {
        append(`connection lost to ${url}: seq=${toalRequests}`);
        lostRequests += 1;
    }
    if (aborted) {
        append(`${toalRequests} requests sent, ${toalRequests - lostRequests} responses received, ${(lostRequests / toalRequests) * 100} lost`);
    } else {
        setTimeout(() => {
            ping(url, aborted, append);
        }, postRequestTime - preRequestTime > 1000 ? 0 : 1000 - (postRequestTime - preRequestTime));
    }
};

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

export { ping, noCacheFetch };