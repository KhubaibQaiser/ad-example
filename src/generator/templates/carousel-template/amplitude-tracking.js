(function () {
  // Ensure the namespace exists
  window.ShopsenseEmbeds = window.ShopsenseEmbeds || {};

  window.ShopsenseEmbeds.getData = (element, attr) => {
    const data = element.getAttribute(`data-${attr}`);
    return data ? JSON.parse(data) : {};
  };

  // Define the callback function to be executed when the element is in the viewport
  const elementWithinViewport = (element) => {
    window.ShopsenseEmbeds.analytics.logEvent('Tile: Rendered', window.ShopsenseEmbeds.getData(element, 'item'));
  };

  const init = (e) => {
    const container = e?.detail?.container || document;

    window.ShopsenseEmbeds.analytics.logEvent('Embed Loaded');

    const slides = container.querySelectorAll('.product-section');

    slides.forEach((slide) => {
      window.ShopsenseEmbeds.getObserverInstance(container, slide, elementWithinViewport);
      // Track user impressions
      slide.addEventListener('mouseenter', () => {
        window.ShopsenseEmbeds.analytics.logEvent('Tile: Mouse Over', window.ShopsenseEmbeds.getData(slide, 'item'));
      });

      // Track user mouseenter and mouseclick events on elements inside each slide
      slide.querySelectorAll('.suggestion-item').forEach((element) => {
        element.addEventListener('mouseenter', () => {
          window.ShopsenseEmbeds.analytics.logEvent('Product: Mouse Hover', window.ShopsenseEmbeds.getData(element, 'item'));
        });

        element.addEventListener('click', () => {
          window.ShopsenseEmbeds.analytics.logEvent('Product: Clicked', window.ShopsenseEmbeds.getData(element, 'item'));
        });
      });
    });
  };

  document.addEventListener('DOMContentLoaded', init);
  document.addEventListener('ShopsenseEmbedInjected', init);
})();
