# tesseract-ui app for $TEMPLATE_TITLE

This is an instance of the tesseract-ui project, built for the $TEMPLATE_NAME project.

## Rebuilding

This boilerplate runs on the [poi](https://poi.js.org/) framework. If you need to, you can modify the [options file](./poi.config.js). Just make sure to [follow the docs](https://poi.js.org/config.html).

To rebuild the app, just run

```bash
npm run build
```

## Updating

The core of this app is the `@datawheel/tesseract-explorer` package. To update it just run

```bash
npm install @datawheel/tesseract-explorer
```

## Upgrading

If you need to update all the involved packages to their latest version, just delete the entire folder and rerun the `npm init @datawheel/tesseract-ui $TEMPLATE_NAME` command.
