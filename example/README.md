# Example app for the tesseract-ui monorepo

This folder contains a minimal implementation for the components of the  tesseract-ui monorepo. It's intended to help with the development of the associated react components.

## Usage

As [`pnpm`](https://pnpm.io/) is the recommended package manager to use in this monorepo, installing the dependencies of any package will install them for every package in the monorepo, including this example app.

```bash
[./tesseract-ui] $ pnpm install
[./tesseract-ui] $ pnpm run example
```

Alternatively, you can use the start script (`pnpm start`) from the `package.json` file in this folder.

## OLAP server proxy

To prevent CORS issues during development, this example app setups a proxy to the OLAP server during startup. To define the target of the proxy, set the environment variable `OLAPPROXY_TARGET` to the full URL where the OLAP server is available.

```bash
export OLAPPROXY_TARGET="https://target.server/api/tesseract/"
```

If the environment variable is not set, the configuration file assumes there's a tesseract-olap server in the local system, running with default settings, so setups the target of the proxy to `http://localhost:7777`.

If the target server needs [Basic Authentication](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication#basic_authentication_scheme) keys, you can set them using the `OLAPPROXY_AUTH` environment variable. The value of this variable must be the username, a colon `:`, and the password:

```bash
export OLAPPROXY_AUTH="username:password"
```
