# Shopsense Ads (Embeds) Repository

This repository contains the code for generating and managing Shopsense Ads (Embeds). These embeds are designed to be used on various platforms and websites to display advertisements.

## Technologies Used

The Ads repository utilizes the following technologies:

- HTML: The markup language used for structuring the embeds.
- CSS: The styling language used for customizing the appearance of the embeds.
- JavaScript: The programming language used for adding interactivity and dynamic behavior to the embeds.

## Embed Generation

The embeds in this repository are generated using a combination of HTML, CSS, and JavaScript. They are designed to adhere to the specifications set by the Interactive Advertising Bureau (IAB), ensuring compatibility and consistency across different platforms.

The `config.json` file plays a crucial role in dynamically generating ads in this repository. It contains the configuration settings and data that are used to populate the ads with relevant content.

Here's how the `config.json` file is used:

1. Customize Ad Content: Within each ad template, you can specify placeholders or variables that will be replaced with actual content when the ad is generated. These placeholders can include text, images, links, or any other HTML elements.

2. Populate Data: The `config.json` file also contains a section where you can provide the data that will be used to populate the ad templates. This data can be static or dynamic, depending on your requirements. For example, you can include a list of products, their descriptions, and images to be displayed in the ads.

3. Generate Ads: Using the ad templates and data from the `config.json` file, the code in this repository dynamically generates ads by replacing the placeholders in the templates with the corresponding content from the data. This ensures that each ad is unique and tailored to the specific advertising needs.

By leveraging the `config.json` file, you can easily create and manage a wide variety of ads without modifying the underlying code. This allows for greater flexibility and scalability in your advertising campaigns.

## Layouts

The repository provides different layouts for the embeds, allowing for flexibility and customization based on specific advertising requirements. These layouts are optimized for different screen sizes and devices, ensuring a seamless user experience.

- ~~SmartphoneBanner: 320 x 50~~
- ~~Leaderboard: 728 x 90~~
- ~~Pushdown: 970 x 90~~
- Portrait: 300 x 1050
- Skyscraper: 160 x 600
- ~~MediumRectangle: 300 x 250~~
- ~~20x60: 20 x 60~~
- MobilePhoneInterstitial: 640 x 1136
- ~~FeaturePhoneSmallBanner: 120 x 20~~
- ~~FeaturePhoneMediumBanner: 168 x 28~~
- ~~FeaturePhoneLargeBanner: 216 x 36~~

## Getting Started

To get started with using the embeds from this repository, follow these steps:

1. Clone the repository to your local machine.
2. Choose the desired layout from the available options.
3. Customize the embed code as per your advertising needs.
4. Integrate the embed code into your platform or website.

For detailed instructions on how to use the embeds, please refer to the documentation provided in each layout folder.

## Contributing

Contributions to the Shopsense Ads (Embeds) repository are welcome! If you have any suggestions, bug reports, or feature requests, please open an issue or submit a pull request.
