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
    window.ShopsenseEmbeds.analytics.logEvent('Curated: Rendered', getData(element, 'item'));
  };

  document.addEventListener('DOMContentLoaded', () => {
    window.ShopsenseEmbeds.analytics.logEvent('Page Loaded');

    const videoElement = document.querySelector('.product-main');

    if (videoElement) {
      window.ShopsenseEmbeds.analytics.logEvent('Video Loaded');
    }

    const products = document.querySelectorAll('.product');
    products.forEach((element) => {
      element.addEventListener('mouseenter', () => {
        window.ShopsenseEmbeds.analytics.logEvent('Product: Mouse Hover', getData(element, 'item'));
      });

      element.addEventListener('click', () => {
        window.ShopsenseEmbeds.analytics.logEvent('Product: Clicked', getData(element, 'item'));
      });
    });

    var shopNowCtaButton = document.querySelector('.collection-cta-button');
    shopNowCtaButton.addEventListener('click', () => {
      window.ShopsenseEmbeds.analytics.logEvent('CTA: Shop Now Clicked', getData(shopNowCtaButton, 'item'));
    });
  });
})();
