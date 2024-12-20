(function () {
  // Ensure the namespace exists
  window.ShopsenseEmbeds = window.ShopsenseEmbeds || {};

  /* eslint-disable @typescript-eslint/no-unused-vars */
  window.ShopsenseEmbeds.getData = (element, attr) => {
    const data = element.getAttribute(`data-${attr}`);
    return data ? JSON.parse(data) : {};
  };

  const init = (e) => {
    const container = e?.detail?.container || document;

    window.ShopsenseEmbeds.analytics.logEvent('Embed Loaded');

    const products = container.querySelectorAll('.product-card');
    products.forEach((element) => {
      element.addEventListener('mouseenter', () => {
        window.ShopsenseEmbeds.analytics.logEvent('Product: Mouse Hover', window.ShopsenseEmbeds.getData(element, 'item'));
      });

      element.addEventListener('click', () => {
        window.ShopsenseEmbeds.analytics.logEvent('Product: Clicked', window.ShopsenseEmbeds.getData(element, 'item'));
      });
    });
  };

  document.addEventListener('DOMContentLoaded', init);
  document.addEventListener('ShopsenseEmbedInjected', init);
})();
