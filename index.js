const http = require('http');
const https = require('https');
const { URL, URLSearchParams } = require('url');
const { pipeline } = require('stream');
const responstTypes = {
    'json': JSON.parse
}

const get = async (endpoint, opts) => {
    const url = new URL(endpoint);

    if (!['https:', 'http:'].includes(url.protocol.toLowerCase())) throw Error('Courier is only for http or https calls');

    const { params, responseType, ...options } = opts || {};
    const protocol = url.protocol === 'http:' ? http : https;
    const defaults = {
        method: 'GET'
    }

    if (options) options.method = 'GET';
    if (params) {
        url.search = new URLSearchParams(params).toString();
    }

    const finalOptions = { ...defaults, ...options }

    return new Promise((resolve, reject) => {
        const request = protocol.request(url, finalOptions, response => {
            let buffer;

            response.on('data', data => buffer = buffer ? Buffer.concat([buffer, data]) : Buffer.from(data));
            response.on('error', reject);
            response.on('end', () => transformData(buffer.toString()));
        });

        const transformData = data => {
            const transform = responstTypes[responseType];
            if (transform) return resolve(transform(data));

            return resolve(responstTypes['json'](data));
        }

        request.on('error', reject);
        request.end();
    })
}

(async function () {
    const response = await get('https://jsonplaceholder.typicode.com/users');
})()

