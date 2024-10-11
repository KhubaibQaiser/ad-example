(function () {
  // Ensure the namespace exists
  window.ShopsenseEmbeds = window.ShopsenseEmbeds || {};

  // Create a function to handle the intersection logic
  const handleIntersection = (callback) => {
    return (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          console.log('ELEMENT IN VIEWPORT');
          callback(entry.target);
          observer.unobserve(entry.target); // Stop observing if you only need to detect once
        }
      });
    };
  };

  // Create an Intersection Observer instance with the custom callback
  window.ShopsenseEmbeds.getObserverInstance = (element, cb, options = {}) => {
    const observer = new IntersectionObserver(handleIntersection(cb), {
      root: null, // Use the viewport as the root
      rootMargin: '0px',
      threshold: 1, // Trigger when 10% of the element is visible
      ...options,
    });
    observer.observe(element);
  };
})();
