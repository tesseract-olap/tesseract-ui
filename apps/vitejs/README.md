# ViteJS demo for the tesseract-ui monorepo

This folder contains a minimal implementation for the components of the  tesseract-ui monorepo. It's intended to help with the development of the associated react components.

## Usage

Installing the dependencies of this monorepo should also install the dependencies for this app.

```bash
[./tesseract-ui] $ npm install
```

You can run the `dev` script at the root of the monorepo to run all demo apps at the same time, while it also monitors and recompiles upon changes in the dependencies.

```bash
[./tesseract-ui] $ npm run dev
```

Alternatively, if you just want to run this demo app, you can use the `dev` script on this folder

```bash
[./tesseract-ui/apps/vitejs/] $ npm run dev
```

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
