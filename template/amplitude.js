const getData = (element, attr) => {
  const data = element.getAttribute(`data-${attr}`);
  return data ? JSON.parse(data) : {};
};

// Define the callback function to be executed when the element is in the viewport
const elementWithinViewport = (element) => {
  window.analytics.logEvent('Slide Rendered', getData(element, 'item'));
};

// Create a function to handle the intersection logic
const handleIntersection = (callback) => {
  return (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        callback(entry.target);
        observer.unobserve(entry.target); // Stop observing if you only need to detect once
      }
    });
  };
};

// Create an Intersection Observer instance with the custom callback
const observer = new IntersectionObserver(handleIntersection(elementWithinViewport), {
  root: null, // Use the viewport as the root
  rootMargin: '0px',
  threshold: 1, // Trigger when 10% of the element is visible
});

document.addEventListener('DOMContentLoaded', () => {
  window.analytics.logEvent('Page Loaded');

  const slides = document.querySelectorAll('.product-section');

  slides.forEach((slide) => {
    observer.observe(slide);
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
