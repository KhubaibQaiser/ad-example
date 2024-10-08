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
      const adUrl = `https://ad-example.vercel.app/ads/${config.embedId}/${config.template}/index.html`;

      try {
        const container = document.getElementById(config.containerId);
        if (!container) {
          throw new Error(`Element with id="${config.containerId}" not found.`);
        }

        const response = await fetch(adUrl);
        if (!response.ok) {
          throw new Error('Unable to fetch the ad content.');
        }

        const adContent = await response.text();

        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = adContent;

        const scripts = tempDiv.querySelectorAll('script');
        const links = tempDiv.querySelectorAll('link[rel="stylesheet"]');
        const images = tempDiv.querySelectorAll('img');
        const videos = tempDiv.querySelectorAll('video');

        links.forEach((link) => {
          document.head.appendChild(link);
        });

        // Append images to the container
        images.forEach((img) => {
          const newImg = document.createElement('img');
          newImg.src = img.src;
          container.appendChild(newImg);
        });

        // Append videos to the container
        videos.forEach((video) => {
          const newVideo = document.createElement('video');
          newVideo.src = video.src;
          newVideo.controls = true; // Enable video controls
          container.appendChild(newVideo);
        });

        container.innerHTML = tempDiv.innerHTML;
        container.style.width = width;
        container.style.height = height;

        // Append JS files to the body
        scripts.forEach((script) => {
          const newScript = document.createElement('script');
          newScript.src = script.src;
          document.body.appendChild(newScript);
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
