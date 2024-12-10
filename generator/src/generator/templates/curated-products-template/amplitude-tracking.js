(function () {
  // Ensure the namespace exists
  window.ShopsenseEmbeds = window.ShopsenseEmbeds || {};

  /* eslint-disable @typescript-eslint/no-unused-vars */
  window.ShopsenseEmbeds.getData = (element, attr) => {
    const data = element.getAttribute(`data-${attr}`);
    return data ? JSON.parse(data) : {};
  };

  // Define the callback function to be executed when the element is in the viewport
  const elementWithinViewport = (element) => {
    window.ShopsenseEmbeds.analytics.logEvent('Curated: Rendered', window.ShopsenseEmbeds.getData(element, 'item'));
  };

  const init = (e) => {
    const container = e?.detail?.container || document;

    window.ShopsenseEmbeds.analytics.logEvent('Embed Loaded');

    const videoElement = container.querySelector('.product-main');

    if (videoElement) {
      window.ShopsenseEmbeds.analytics.logEvent('Video Loaded');
    }

    const products = container.querySelectorAll('.product');
    products.forEach((element) => {
      element.addEventListener('mouseenter', () => {
        window.ShopsenseEmbeds.analytics.logEvent('Product: Mouse Hover', window.ShopsenseEmbeds.getData(element, 'item'));
      });

      element.addEventListener('click', () => {
        window.ShopsenseEmbeds.analytics.logEvent('Product: Clicked', window.ShopsenseEmbeds.getData(element, 'item'));
      });
    });

    var shopNowCtaButton = container.querySelector('.collection-cta-button');
    shopNowCtaButton.addEventListener('click', () => {
      window.ShopsenseEmbeds.analytics.logEvent('CTA: Shop Now Clicked', window.ShopsenseEmbeds.getData(shopNowCtaButton, 'item'));
    });
  };

  document.addEventListener('DOMContentLoaded', init);
  document.addEventListener('ShopsenseEmbedInjected', init);
})();
