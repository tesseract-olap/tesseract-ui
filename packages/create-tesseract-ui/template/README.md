# tesseract-ui app for $TEMPLATE_NAME

This is an instance of the tesseract-ui project, built for the $TEMPLATE_NAME project.

## Rebuilding

This boilerplate uses the vite framework. If you need to change the way it behaves, you can modify the [options file](./vite.config.js). Just make sure to [follow the docs](https://vitejs.dev/config/).

To rebuild the app, just run

```bash
npm run build
```

## Updating

The core of this app is the `@datawheel/tesseract-explorer` package; most updates come through it and its dependencies.  
You can update using the `npm update` command, or modifying the `package.json` file and applying `npm install`. You can also use the `npm run update` command to run an abbreviated command to update and rebuild.

## Upgrading

Whenever a big upgrade is released for the `@datawheel/tesseract-explorer` package, it is suggested to remake this script instead of just updating the dependency versions. This way you don't have to worry about changes on the dependencies or the way some elements are imported or loaded. To do this, just delete the entire folder, and rerun the `npm init @datawheel/tesseract-ui $TEMPLATE_NAME` command.
