(function () {
  // Ensure the namespace exists
  window.ShopsenseEmbeds = window.ShopsenseEmbeds || {};

  const getUtmParams = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return {
      utm_source: urlParams.get('utm_source'),
      utm_medium: urlParams.get('utm_medium'),
      utm_campaign: urlParams.get('utm_campaign'),
      utm_term: urlParams.get('utm_term'),
      utm_content: urlParams.get('utm_content'),
    };
  };

  window.ShopsenseEmbeds.getUtmParams = getUtmParams;

  const iframe = document.querySelector('#adIframe');

  if (iframe) {
    const utmParams = getUtmParams();
    // Send UTM parameters to the iframe
    iframe.onload = () => {
      iframe.contentWindow.postMessage(utmParams, '*');
    };
  }
})();
