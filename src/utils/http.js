const contentTypes = {
    hal: 'application/hal+json',
    json: 'application/json',
};

const tryParseJson = body => {
    try {
        return JSON.parse(body);
    } catch (e) {
        return {};
    }
};

const getHeaders = headers =>
    [...headers.entries()].reduce(
        (acc, [key, value]) => ({
            ...acc,
            [key]: value,
        }),
        {},
    );

const mapResponse = async response => {
    const { ok, status, statusText, url, headers } = response;

    return {
        body: tryParseJson(await response.text()),
        headers: getHeaders(headers),
        ok,
        status,
        statusText,
        url,
    };
};

const get = ({ url, headers = {} }) =>
    fetch(url, {
        headers: new Headers({
            accept: contentTypes.hal,
            ...headers,
        }),
    }).then(mapResponse);

const post = ({ url, body, headers = {} }) =>
    fetch(url, {
        headers: new Headers({
            'content-type': contentTypes.json,
            accept: contentTypes.hal,
            ...headers,
        }),
        method: 'post',
        body: JSON.stringify(body),
    }).then(mapResponse);

const _delete = ({ url, headers = {} }) =>
    fetch(url, {
        headers: new Headers({
            accept: contentTypes.hal,
            ...headers,
        }),
        method: 'delete',
    }).then(mapResponse);

export default {
    get,
    post,
    delete: _delete,
};
