# Ad Generator

This project is a templating engine that generates HTML, CSS, and JavaScript files for ads using data from a JSON file. It also processes images, resizing, compressing, and converting them to WebP format.

## Features

- **Template Rendering**: Uses EJS to render HTML templates with data from a JSON file.
- **Minification**: Minifies HTML, CSS, and JavaScript files.
- **Image Processing**: Resizes, compresses, and converts images to WebP format, maintaining directory structure.
- **Modular Code**: Organized into separate functions for better maintainability.

## Prerequisites

- Node.js
- npm (Node Package Manager)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/shopsense-ai/embeds.git
   cd embeds
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

## Usage

1. Place your data file (`data.json`) and assets (images) in the `data` directory. The assets can be in nested folders.
2. Run the script to generate the output:
   ```bash
   node generateHtml.js
   ```

### Note

The template files (`index.html`, `style.css`, `script.js`) in the `template` directory are static and should not be changed.

## Example

Here is an example of how to structure your `data.json` file:

```json
{
  "slug": "sports-ad",
  "products": [
    {
      "name": "Adidas",
      "img": "assets/product-1/product.png",
      "bgColor": "#f38e02",
      "suggestions": [
        {
          "name": "Adidas",
          "img": "assets/product-1/suggestion-1.png",
          "url": "https://paramount.us-west-2.citadel.test.shopsense.ai/shop/products/2167765914421169176"
        },
        {
          "name": "Nike",
          "img": "assets/product-1/suggestion-2.png",
          "url": "https://paramount.us-west-2.citadel.test.shopsense.ai/shop/products/7169382077361275352"
        },
        {
          "name": "Puma",
          "img": "assets/product-1/suggestion-3.png",
          "url": "https://paramount.us-west-2.citadel.test.shopsense.ai/shop/products/494399754107632726"
        }
      ]
    }
  ]
}
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

Feel free to customize this further if needed. Let me know if there's anything else I can help with!
