
# Portman-Sugar

Extend the capabilities of Portman with `portman-sugar`, a module designed to streamline the management and execution of API tests using the Portman framework. `portman-sugar` simplifies test configurations, supports modular test files, and enhances test maintenance and readability.

## Features

- **Modular Test Configuration**: Manage your tests in separate files with the ability to declare API operations once per file.
- **Automated Test Discovery**: Automatically finds test files in a specified directory.
- **Predefined Configurations**: Comes with a set of predefined configurations which you can easily override according to your testing needs.
- **Integration with Portman**: Fully compatible with Portman; you can use `portman-sugar` alongside other Portman tools without any conflict.

## Installation

Install `portman-sugar` via npm:

```bash
npm install --save-dev portman-sugar
```

## Usage

1. **Prepare your test files** in a specified directory. Each test file should declare an API operation and may include variations and assigned variables.

2. **Run the tool** using the command-line interface. Here are some options you can configure:

```bash
npx portman-sugar --testFolder ./path/to/tests --collectionName "Your Collection Name"
```

### Command-Line Options

- `--testFolder`: Path to the folder containing test files.
- `--collectionName`: Name of the generated Postman collection.
- `--openApi`: Path to your OpenAPI specification file (default: `./openapi.yaml`).
- `--output`: Path for the output Postman collection JSON file (default: `./postman.collection.json`).

Additional options include setting paths for various configurations like `--authConfig`, handling different types of tests (`--contractTests`, `--fuzzingTests`), and excluding default configurations with `--excludeDefault`.

## Example

Below is an example command to run `portman-sugar`:

```bash
node dist/index.js --testFolder ./api-tests --collectionName "API Collection" --output ./output/postman.collection.json
```

## Contributing

Contributions are welcome! Please open an issue to discuss your ideas or submit a pull request.

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.
