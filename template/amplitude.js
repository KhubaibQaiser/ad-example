const getData = (element, attr) => {
  const data = element.getAttribute(`data-${attr}`);
  return data ? JSON.parse(data) : {};
};

document.addEventListener('DOMContentLoaded', () => {
  window.analytics.logEvent('Page Loaded');

  const slides = document.querySelectorAll('.product-section');

  slides.forEach((slide, index) => {
    slides.onload = () => {
      // Track slide rendered
      window.analytics.logEvent('Slide Rendered', { slideIndex: index, ...getData(slide, 'item') });
    };
    // Track user impressions
    slide.addEventListener('mouseenter', () => {
      window.analytics.logEvent('Mouse over slide', { slideIndex: index, ...getData(slide, 'item') });
    });

    // Track user mouseenter and mouseclick events on elements inside each slide
    slide.querySelectorAll('.suggestion-item').forEach((element) => {
      element.addEventListener('mouseenter', () => {
        window.analytics.logEvent('Suggestion Hover', {
          slideIndex: index,
          ...getData(element, 'item'),
        });
      });

      element.addEventListener('click', () => {
        window.analytics.logEvent('Suggestion Clicked', {
          slideIndex: index,
          ...getData(element, 'item'),
        });
      });
    });
  });
});
