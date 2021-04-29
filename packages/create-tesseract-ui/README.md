# create-tesseract-ui

A script to build an instance of tesseract-ui for your server, quickly.

## Usage

```bash
npm init @datawheel/tesseract-ui [directory]
```

This command will ask you some information about the server instance you're running, copy the necessary files to `directory`, and build the project. When it finishes, you just have to point your nginx (or any static file server) to serve the content of the `directory/dist` folder in the intended URL.

The `directory` parameter is optional, if not set it will use the current directory instead. Use the `-h` or `--help` flag to get more information about usage.

In case on problems using this script, or if it doesn't cover your use case, please [file an issue](https://github.com/tesseract-olap/tesseract-ui/issues/).

## License

© 2019-2021 [Datawheel, LLC](https://datawheel.us/)  
This project is made available under the [MIT License](./LICENSE).
