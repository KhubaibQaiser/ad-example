(function (global) {
  // Ensure the namespace exists
  global.ShopsenseEmbeds = global.ShopsenseEmbeds || {};

  global.ShopsenseEmbeds.EmbedInjector = (function () {
    const SupportedTemplates = {
      CuratedProducts: 'curated-products-template',
      Carousel: 'carousel-template',
      Banner: 'banner-template',
    };

    const SupportedVariations = {
      Skyscraper: 'Skyscraper',
      Banner: 'Banner',
      Leaderboard: 'Leaderboard',
      // Add more IAB standard variations as needed
    };

    const AdVariations = {
      Skyscraper: { width: '160px', height: '600px' },
      Banner: { width: '912px', height: '384px' }, // 912x384 || 468x60
      Leaderboard: { width: '728px', height: '90px' },
      // Add more IAB standard variations as needed
    };

    const embedLoaderContainerId = 'shopsense-embed-loader';
    const embedContainerId = 'shopsense-embed-ad';
    let scriptsLoaded = 0;

    const onScriptLoaded =
      (adContainer, scriptsCount = 0) =>
      () => {
        scriptsLoaded++;
        if (scriptsLoaded === scriptsCount) {
          console.log('All scripts loaded successfully');
          const event = new CustomEvent('ShopsenseEmbedInjected', { detail: { container: adContainer } });
          document.dispatchEvent(event);
        }
      };

    const applyStyles = (element, styles, forceOverride = false) => {
      if (forceOverride) {
        // Clear existing styles
        element.style.cssText = '';
      }
      Object.assign(element.style, styles);
    };

    // const injectLoaderContainer = (container, id, width, height) => {
    //   const loaderContainer = document.createElement('div');
    //   loaderContainer.id = id;
    //   applyStyles(loaderContainer, {
    //     width,
    //     height,
    //     backgroundColor: 'rgba(0,0,0,1)',
    //     position: 'absolute',
    //     left: 0,
    //     top: 0,
    //     opacity: 1,
    //     transition: 'opacity 0.5s ease',
    //     zIndex: 10,
    //   });
    //   container.appendChild(loaderContainer);

    //   const hideLoader = () => {
    //     loaderContainer.style.opacity = 0;
    //     setTimeout(() => {
    //       loaderContainer.remove();
    //     }, 500);
    //   };

    //   return hideLoader;
    // };

    const injectAdContainer = (container, id, width, height) => {
      const adContainer = document.createElement('div');
      adContainer.id = id;
      applyStyles(adContainer, {
        // width,
        // height,
        zIndex: 1,
      });
      container.appendChild(adContainer);
      return adContainer;
    };

    // const injectScript = (url) => {
    //   return fetch(url)
    //     .then((response) => {
    //       if (!response.ok) throw new Error('Network response was not ok');
    //       return response.text();
    //     })
    //     .then((scriptContent) => {
    //       const script = document.createElement('script');
    //       script.textContent = scriptContent;
    //       document.body.appendChild(script);
    //       console.log('Script loaded successfully');
    //     })
    //     .catch((error) => console.error('Error loading script:', error));
    // };

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
      const width = dimensions.width;
      const height = dimensions.height;
      const BASE_URL = `https://ad-example.vercel.app/ads/${config.embedId}/${config.template}/ad`;
      const indexUrl = `${BASE_URL}/index.html`;
      const assetsUrl = `${BASE_URL}/assets`;

      try {
        const adParentContainer = document.getElementById(config.containerId);
        if (!adParentContainer) {
          throw new Error(`Element with id="${config.containerId}" not found.`);
        }

        applyStyles(adParentContainer, {
          position: 'relative',
          // width,
          height: 0, // Initially hidden
          overflow: 'hidden',
          opacity: 0,
          transition: 'all 0.5s ease', // Added transition on height and opacity
        });

        // const hideLoader = injectLoaderContainer(adParentContainer, embedLoaderContainerId, width, height);
        const adContainer = injectAdContainer(adParentContainer, embedContainerId, width, height);

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
        });

        // Update the src of original images
        images.forEach((img) => {
          const assetName = img.src.split('/').pop();
          img.src = `${assetsUrl}/${assetName}`;
        });

        // Update the src or data-src of original videos
        videos.forEach((video) => {
          const assetName = (video.getAttribute('data-src') || video.src).split('/').pop();
          const videoSrc = `${assetsUrl}/${assetName}`;
          if (video.hasAttribute('data-src')) {
            video.setAttribute('data-src', videoSrc);
          } else {
            video.src = videoSrc;
          }
          video.controls = false; // Set video controls
          video.setAttribute('src', videoSrc);
          video.classList.remove('hidden');
        });

        const adContentContainer = tempDiv.getElementsByTagName('main')[0];
        if (!adContentContainer) {
          throw new Error('Main content not found in the ad.');
        }
        adContentContainer.classList.add('shopsense-ad');
        adContainer.innerHTML = adContentContainer.outerHTML;
        setTimeout(() => {
          applyStyles(adParentContainer, { height: adContainer.clientHeight + 'px', opacity: 1 });
          setTimeout(() => {
            applyStyles(adParentContainer, { height: 'auto' });
          }, 500);
        }, 1000);

        // Append JS files to the body
        let filteredScripts = [];
        scripts.forEach((script) => {
          if (script.src && script.src.includes('.js')) {
            filteredScripts.push(script);
          }
        });
        filteredScripts.forEach((script) => {
          let scriptUrl = script.src;
          scriptUrl = scriptUrl.split('/').pop();
          scriptUrl = `${BASE_URL}/${scriptUrl}`;
          const newScript = document.createElement('script');
          newScript.src = scriptUrl;
          newScript.type = 'text/javascript';
          newScript.onload = onScriptLoaded(adParentContainer, filteredScripts.length);
          /* Generate the HASH by: openssl dgst -sha256 -binary your-script.js | openssl base64 -A */
          // newScript.integrity = 'sha256-abcdef'; // Add Proper SRI hash
          // newScript.crossOrigin = 'anonymous';
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
})(window);
