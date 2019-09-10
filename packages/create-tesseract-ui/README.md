# create-tesseract-ui

A script to build an instance of tesseract-ui for your server, quickly.

## Usage

```bash
npm init @datawheel/tesseract-ui <target-folder>
```

This command will ask you some information about the server instance you're running, copy the necessary files to `<target-folder>`, and build the project. When it finishes, you just have to point your nginx (or any static file server) to serve the content of the `<target-folder>/dist` folder in the intended URL.

In case on problems using this script, or if it doesn't cover your use case, please [file an issue](https://github.com/tesseract-olap/tesseract-ui/issues/).

## License

MIT © 2019 [Datawheel](https://datawheel.us/)
