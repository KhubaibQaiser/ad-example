const getData = (element, attr) => {
  const data = element.getAttribute(`data-${attr}`);
  return data ? JSON.parse(data) : {};
};

// Define the callback function to be executed when the element is in the viewport
const elementWithinViewport = (element) => {
  window.analytics.logEvent('Slide Rendered', getData(element, 'item'));
};

document.addEventListener('DOMContentLoaded', () => {
  window.analytics.logEvent('Page Loaded');

  const slides = document.querySelectorAll('.product-section');

  slides.forEach((slide) => {
    window.getObserverInstance(slide, elementWithinViewport);
    // Track user impressions
    slide.addEventListener('mouseenter', () => {
      window.analytics.logEvent('Mouse over slide', getData(slide, 'item'));
    });

    // Track user mouseenter and mouseclick events on elements inside each slide
    slide.querySelectorAll('.suggestion-item').forEach((element) => {
      element.addEventListener('mouseenter', () => {
        window.analytics.logEvent('Suggestion Hover', getData(element, 'item'));
      });

      element.addEventListener('click', () => {
        window.analytics.logEvent('Suggestion Clicked', getData(element, 'item'));
      });
    });
  });
});
