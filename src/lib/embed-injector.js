(function (global) {
  const ShopsenseEmbeds = (function () {
    const SupportedTemplates = {
      CuratedProducts: 'curated-products-template',
      Carousel: 'carousel-template',
      // Add more ad templates as needed
    };

    const SupportedVariations = {
      Skyscraper: 'Skyscraper',
      Banner: 'Banner',
      Leaderboard: 'Leaderboard',
      // Add more IAB standard variations as needed
    };

    const AdVariations = {
      Skyscraper: { width: '160px', height: '600px' },
      Banner: { width: '468px', height: '60px' },
      Leaderboard: { width: '728px', height: '90px' },
      // Add more IAB standard variations as needed
    };

    /**
     * Load an Embed into the specified container.
     * @param {Object} config - Configuration object for loading the embed. (required)
     * @param {string} config.containerId - The ID of the HTML element where the embed will be injected. (required)
     * @param {string} config.embedId - The ID of the embed embed to load. (required)
     * @param {string} config.template - The embed template to use. Must be one of ShopsenseEmbeds.SupportedTemplates. (required)
     * @param {Object} [config.variation] - The embed variation to use. Must be one of ShopsenseEmbeds.SupportedVariations. (optional)
     */
    async function loadAd(config) {
      if (!config.containerId) {
        throw new Error('containerId must be provided.');
      }

      if (!config.embedId) {
        throw new Error('embedId must be provided.');
      }

      if (!config.template) {
        throw new Error('template must be provided.');
      }

      config.variation = config.variation || SupportedVariations.Skyscraper;

      const dimensions = config.variation ? AdVariations[config.variation] || AdVariations.Skyscraper : AdVariations.Skyscraper;
      const width = dimensions.width || 'auto';
      const height = dimensions.height || 'auto';
      const BASE_URL = `https://ad-example.vercel.app/ads/${config.embedId}/${config.template}/ad`;
      const indexUrl = `${BASE_URL}/index.html`;
      const assetsUrl = `${BASE_URL}/assets`;

      try {
        const container = document.getElementById(config.containerId);
        if (!container) {
          throw new Error(`Element with id="${config.containerId}" not found.`);
        }

        const response = await fetch(indexUrl);
        if (!response.ok) {
          throw new Error('Unable to fetch the ad content.');
        }

        const adContent = await response.text();

        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = adContent;

        const scripts = tempDiv.querySelectorAll('script');
        const links = tempDiv.querySelectorAll('link');
        const images = tempDiv.querySelectorAll('img');
        const videos = tempDiv.querySelectorAll('video');

        console.log('FOUND', { scripts, links, images, videos });

        links.forEach((link) => {
          const newLink = document.createElement('link');
          const assetName = link.href.split('/').pop();
          newLink.href = `${BASE_URL}/${assetName}`;
          document.head.appendChild(newLink);
          link.remove();
        });

        // Update the src of original images
        images.forEach((img) => {
          const assetName = img.src.split('/').pop();
          img.src = `${assetsUrl}/${assetName}`;
        });

        // Update the src or data-src of original videos
        videos.forEach((video) => {
          const assetName = video.getAttribute('data-src') || video.src.split('/').pop();
          if (video.hasAttribute('data-src')) {
            video.setAttribute('data-src', `${assetsUrl}/${assetName}`);
          } else {
            video.src = `${assetsUrl}/${assetName}`;
          }
          video.controls = true; // Enable video controls
        });

        container.innerHTML = tempDiv.innerHTML;
        container.style.width = width;
        container.style.height = height;
        // container.style.backgroundColor = '#fff';
        container.style.overflow = 'hidden';

        // Append JS files to the body
        scripts.forEach((script) => {
          const assetName = script.src.split('/').pop();
          const newScript = document.createElement('script');
          newScript.src = `${BASE_URL}/${assetName}`;
          /* Generate the HASH by: openssl dgst -sha256 -binary your-script.js | openssl base64 -A */
          // newScript.integrity = 'sha256-abcdef'; // Add Proper SRI hash
          newScript.crossOrigin = 'anonymous';
          document.body.appendChild(newScript);
          scripts.remove();
        });
      } catch (error) {
        console.error('Error loading ad:', error);
      }
    }

    return {
      loadAd: loadAd,
      SupportedTemplates: SupportedTemplates,
      SupportedVariations: SupportedVariations,
    };
  })();

  global.ShopsenseEmbeds = ShopsenseEmbeds;
})(window);
