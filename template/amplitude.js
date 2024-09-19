document.addEventListener('DOMContentLoaded', () => {
  window.analytics.logEvent('Page Loaded');

  const slides = document.querySelectorAll('.product-section');
  console.log('SLIDES', slides);
  slides.forEach((slide, index) => {
    // Track slide rendered
    window.analytics.logEvent('Slide Rendered', { slideIndex: index });

    // Track user impressions
    slide.addEventListener('mouseenter', () => {
      window.analytics.logEvent('User Impression', { slideIndex: index });
    });
  });
});
