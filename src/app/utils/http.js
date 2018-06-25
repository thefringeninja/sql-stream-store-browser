const contentTypes = {
    hal: 'application/hal+json',
    json: 'application/json'
};

const tryParseJson = body => {
    try {
        return JSON.parse(body);
    }
    catch(e) {
        return body;
    }
};

const mapResponse = response => response
    .text()
    .then(body => {
        const { ok, status, statusText, url } = response;
        return {
            body: tryParseJson(body),
            ok,
            status,
            statusText,
            url
        };
    });

const get = url => fetch(url, {
    headers: new Headers({
        accept: contentTypes.hal
    })
}).then(mapResponse);

const post = ({ url, body, headers = {} }) => fetch(url, {
    headers: new Headers({
        'content-type': contentTypes.json,
        accept: contentTypes.hal,
        ...headers
    }),
    method: 'post',
    body: JSON.stringify(body)
}).then(mapResponse);

export default {
    get,
    post
};