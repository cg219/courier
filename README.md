# Courier

**Lightweight http/https request library**

---

## Installation

```bash
npm install courier.mente
```

## Quick Usage

### GET request

```jsx
const { get } = require('courier.mente');
const response = await get('https://jsonplaceholder.typicode.com/users');
```

### POST request

```jsx
const { post } = require('courier.mente');
const response = await post('https://jsonplaceholder.typicode.com/users', {
    body: {
        email: 'dev@imkreative.com',
        pass: 'password',
        message: 'Testing to see if this is working'
    }
});
```

### OPTION request

```jsx
const { option } = require('courier.mente');
const response = await option('https://jsonplaceholder.typicode.com/users/1', {
    method: 'PUT',
    body: {
        email: 'username@domain.com',
        pass: 'password',
        message: 'Hello World'
    }
});
```

## Usage

### Structure

```jsx
const { get, post, option } = require('courier.mente');
const customopts = {
    method: 'DELETE', // Any RESTful method type
    body: { // Body payload
        email: 'some@email.com',
        message: 'Hello World'
    },
    params: { // Query string parameters
        id: '3',
        show: true
    },
    headers: {
        'Content-Type': 'application/json'
    }
}

option('url', customopts);
```

## License

```
MIT License

Copyright (c) 2020 Clemente Gomez

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
