# Ad Generator

This project is a templating engine that generates HTML, CSS, and JavaScript files for ads using data from a JSON file. It also processes images, resizing, compressing, and converting them to JPEG format.

## Features

- **Template Rendering**: Uses EJS to render HTML templates with data from a JSON file.

  - **Supported Templates**:
    - Carousel
    - Curated Products

- **Minification**: Minifies HTML, CSS, and JavaScript files.
- **Image Processing**: Resizes, compresses, and converts images to JPEG format, maintaining directory structure.
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
 npm i
```

3. Run the web app

```bash
 npm run dev
```

## Usage

1. Select the "Publisher" to get all feature look modules in that publisher's stores.
2. Select feature look modules from the dropdown. You can select multiple values.
3. Select the template type to use for the ad. You can select multiple values.
4. Select the ad variation. For now, we only support the Skyscraper (160x600).
5. Press the Generate Ads button.
