(function (global) {
  // Ensure the namespace exists
  global.ShopsenseEmbeds = global.ShopsenseEmbeds || {};

  global.ShopsenseEmbeds.EmbedInjector = (function () {
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

    const embedLoaderContainerId = 'shopsense-embed-loader';
    const embedContainerId = 'shopsense-embed-ad';

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
        const adParentContainer = document.getElementById(config.containerId);
        if (!adParentContainer) {
          throw new Error(`Element with id="${config.containerId}" not found.`);
        }

        adParentContainer.style.position = 'relative';
        adParentContainer.style.width = width;
        adParentContainer.style.height = height;
        adParentContainer.style.overflow = 'hidden';

        const { loaderContainer, hideLoader } = createLoaderContainer(width, height);
        adParentContainer.appendChild(loaderContainer);
        const adContainer = createAdContainer(width, height);
        adParentContainer.appendChild(adContainer);

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
          const newLink = link.cloneNode(true);
          const assetName = newLink.href.split('/').pop();
          newLink.href = `${BASE_URL}/${assetName}`;
          document.head.appendChild(newLink);
          // link.remove();
        });

        // Update the src of original images
        images.forEach((img) => {
          const assetName = img.src.split('/').pop();
          img.src = `${assetsUrl}/${assetName}`;
        });

        // Update the src or data-src of original videos
        videos.forEach((video) => {
          const assetName = (video.getAttribute('data-src') || video.src).split('/').pop();
          if (video.hasAttribute('data-src')) {
            video.setAttribute('data-src', `${assetsUrl}/${assetName}`);
          } else {
            video.src = `${assetsUrl}/${assetName}`;
          }
          video.controls = true; // Enable video controls
        });

        const adContentContainer = tempDiv.getElementsByTagName('main')[0];
        if (!adContentContainer) {
          throw new Error('Main content not found in the ad.');
        }
        adContentContainer.classList.add('shopsense-ad');
        adContainer.innerHTML = adContentContainer.outerHTML;
        setTimeout(hideLoader, 250);

        // Append JS files to the body
        scripts.forEach((script) => {
          let scriptUrl = script.src;
          scriptUrl = scriptUrl.split('/').pop();
          scriptUrl = `${BASE_URL}/${scriptUrl}`;
          if (scriptUrl.includes('.js')) {
            const newScript = document.createElement('script');
            newScript.src = scriptUrl;
            newScript.type = 'text/javascript';
            newScript.onload = onScriptLoaded(adParentContainer)(scripts.length);
            /* Generate the HASH by: openssl dgst -sha256 -binary your-script.js | openssl base64 -A */
            // newScript.integrity = 'sha256-abcdef'; // Add Proper SRI hash
            // newScript.crossOrigin = 'anonymous';
            document.body.appendChild(newScript);
          }
        });
      } catch (error) {
        console.error('Error loading ad:', error);
      }
    }

    let scriptsLoaded = 0;
    const onScriptLoaded =
      (adContainer, scriptsCount = 0) =>
      () => {
        console.log('SCRIPT LOADED', { scriptsCount, scriptsLoaded });
        scriptsLoaded++;
        if (scriptsLoaded === scriptsCount) {
          console.log('All scripts loaded successfully');
          const event = new CustomEvent('ShopsenseEmbedInjected', { detail: { container: adContainer } });
          document.dispatchEvent(event);
        }
      };

    const createLoaderContainer = (width, height) => {
      const loaderContainer = document.createElement('div');
      loaderContainer.id = embedLoaderContainerId;
      loaderContainer.style.width = width;
      loaderContainer.style.height = height;
      loaderContainer.style.backgroundColor = 'rgba(0,0,0,1)';
      loaderContainer.style.position = 'absolute';
      loaderContainer.style.left = 0;
      loaderContainer.style.top = 0;
      loaderContainer.style.opacity = 1;
      loaderContainer.style.transition = 'opacity 0.5s ease';
      loaderContainer.style.zIndex = 10;

      const hideLoader = () => {
        loaderContainer.style.opacity = 0;
        setTimeout(() => {
          loaderContainer.remove();
        }, 500);
      };

      return { loaderContainer, hideLoader };
    };

    const createAdContainer = (width, height) => {
      const adContainer = document.createElement('div');
      adContainer.id = embedContainerId;
      adContainer.style.width = width;
      adContainer.style.height = height;
      adContainer.style.zIndex = 1;
      return adContainer;
    };

    const injectScript = (url) => {
      return fetch(url)
        .then((response) => {
          if (!response.ok) throw new Error('Network response was not ok');
          return response.text();
        })
        .then((scriptContent) => {
          const script = document.createElement('script');
          script.textContent = scriptContent;
          document.body.appendChild(script);
          console.log('Script loaded successfully');
        })
        .catch((error) => console.error('Error loading script:', error));
    };

    return {
      loadAd: loadAd,
      SupportedTemplates: SupportedTemplates,
      SupportedVariations: SupportedVariations,
    };
  })();
})(window);