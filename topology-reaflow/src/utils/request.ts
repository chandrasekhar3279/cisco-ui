/**
 * Parses the JSON returned by a network request
 *
 * @param  {object} response A response from a network request
 *
 * @return {object}          The parsed JSON from the request
 */

function parseJSON(response: { status: number; json: () => any;text: () => any; },noResponse:boolean) {
    if (response.status === 204 || response.status === 205) {
        return null;
    }
   return noResponse  ? response.text():  response.json();

  
}

const addParamToUrl = (relativeUrl: string, queryParam: any = {}) => {
    const kvp = relativeUrl.split('?');
    let existing: any[] = [];
    if (kvp.length > 1) {
        existing = kvp[1].split('&');
    }
    const queryParamArr =
        Object.keys(queryParam).map(
            key => `${key}=${encodeURI(queryParam[key])}`
        ) || [];
    existing = existing.concat(queryParamArr);
    return `${kvp[0]}${existing.length ? '?' : ''}${existing.join('&')}`;
};

/**
 * Checks if a network request came back fine, and throws an error if not
 *
 * @param  {object} response   A response from a network request
 *
 * @return {object|undefined} Returns either the response, or throws an error
 */
async function checkStatus(response: { status: number; json: () => PromiseLike<{ error?: { message: any; } | undefined; }> | { error?: { message: any; } | undefined; }; statusText: any; url: any; }) {
    if (response.status >= 200 && response.status < 300) {
        return response;
    }
    if (response.status === 401) {
        // doLogin();
    }
    const { error: { message } = {} } = await response.json();
    let error: any;
    error = new Error(message || response.statusText);
    error.response = response;
    error.message = message || `${response.url} | ${response.status}`;
    error.status = response.status;
    throw error;
}

function checkNetworkStatus() {
    if (!navigator.onLine) {
        const error = new Error('No Network Available');
        throw error;
    }
}

/**
 * Requests a URL, returning a promise
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 *
 * @return {object}           The response data
 */
export default async function request(
    url: any,
    options: any = {},
    deleteContentType = false,
    noResponse=false
) {
    checkNetworkStatus();
    const defaults = {
        method: 'GET',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
        },
    };

    const { query = {} } = options;
    let dataHeaders: any = {};

    dataHeaders = {
        ...dataHeaders,
        ...defaults.headers,
        ...options.headers,
    };

    if (deleteContentType) {
        delete dataHeaders['Content-Type'];
    }
    const data: any = {
        ...defaults,
        method: options.method || defaults.method,
        credentials: 'same-origin',
        body: options.body,
    };

    data.headers = dataHeaders;
    // console.log(process.env.REACT_APP_ENV);
    const augmentedURL = addParamToUrl(`${process.env.REACT_APP_ENV === "dev" ? "http://127.0.0.1:4010" : ""}${process.env.REACT_APP_API}${url}`, query);
    return fetch(augmentedURL, data)
        .then(checkStatus)
        .then((res:any)=>parseJSON(res,noResponse))
        .catch(async err => {
            throw new Error(err);
        });
}
