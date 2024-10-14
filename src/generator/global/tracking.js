(function () {
  // Ensure the namespace exists
  window.ShopsenseEmbeds = window.ShopsenseEmbeds || {};

  const iframe = document.querySelector('#adIframe');

  if (iframe) {
    const utmParams = window.ShopsenseEmbeds.getUtmParams();
    // Send UTM parameters to the iframe
    iframe.onload = () => {
      iframe.contentWindow.postMessage(utmParams, '*');
    };
  }
})();
