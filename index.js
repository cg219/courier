const http = require('http');
const https = require('https');
const { URL, URLSearchParams } = require('url');
const responseTypes = {
    'json': JSON.parse
}

function transformData(resolve, type, data) {
    const transform = responseTypes[type];
    if (transform) return resolve(transform(data));

    return resolve(data);
}

function getRequestCallback(opts, type, resolve, reject) {
    return function callback(response) {
        let buffer;

        if (response.statusCode != 301 && response.statusCode != 302) {
            response.on('data', data => buffer = buffer ? Buffer.concat([buffer, data]) : Buffer.from(data));
            response.on('error', reject);
            response.on('end', () => transformData(resolve, type, buffer.toString()));
        }
    }
}

function makeRequest(endpoint, opts, type, bodyData, resolve, reject) {
    const url = new URL(endpoint);

    if (!['https:', 'http:'].includes(url.protocol.toLowerCase())) reject(Error('Courier is only for http or https calls'));

    const protocol = url.protocol === 'http:' ? http : https;
    const request = protocol.request(url, opts, getRequestCallback(opts, type, resolve, reject));

    request.on('error', reject);
    request.on('response', (response) => {
        if (response.statusCode == 301 || response.statusCode == 302) {
            request.destroy();
            makeRequest(response.headers.location, opts, type, bodyData, resolve, reject);
        }
    })

    if (bodyData) request.write(bodyData);
    request.end();
}

const get = async (endpoint, opts) => {
    const url = new URL(endpoint);
    const { params, responseType, ...options } = opts || {};
    const defaults = {
        method: 'GET',
        responseType: 'json'
    }

    if (options) options.method = 'GET';
    if (params) url.search = new URLSearchParams(params).toString();

    const finalOptions = { ...defaults, ...options }

    return new Promise((resolve, reject) => {
        makeRequest(url, finalOptions, responseType, null, resolve, reject);
    })
}

const post = async (endpoint, opts) => {
    let bodyData;
    const url = new URL(endpoint);
    const { body, params, responseType, ...options } = opts || {};
    const defaults = {
        method: 'POST',
        responseType: 'json',
        headers: {
            'Content-Type': 'application/json'
        }
    }

    if (options) options.method = 'POST';
    if (params) {
        url.search = new URLSearchParams(params).toString();
    }
    if (body) {
        bodyData = JSON.stringify(body);
        defaults.headers['Content-Length'] = Buffer.byteLength(bodyData);
    }

    const finalOptions = { ...defaults, ...options }

    return new Promise((resolve, reject) => {
        makeRequest(url, finalOptions, responseType, bodyData, resolve, reject);
    })
}

const option = async (endpoint, opts) => {
    let bodyData;
    const url = new URL(endpoint);
    const { body, params, responseType, ...options } = opts || {};
    const defaults = {
        method: 'PUT',
        responseType: 'json',
        headers: {
            'Content-Type': 'application/json'
        }
    }

    if (params) {
        url.search = new URLSearchParams(params).toString();
    }
    if (body) {
        bodyData = JSON.stringify(body);
        defaults.headers['Content-Length'] = Buffer.byteLength(bodyData);
    }

    const finalOptions = { ...defaults, ...options }

    return new Promise((resolve, reject) => {
        makeRequest(url, finalOptions, responseType, bodyData, resolve, reject);
    })
}

module.exports = {
    get,
    post,
    option
}

