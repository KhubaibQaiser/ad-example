(function () {
  const init = (e) => {
    const container = e?.detail?.container || document;

    const slides = container.querySelectorAll('.product-section');
    const numSlides = slides.length;
    let interval;
    const delay = 3; // seconds
    let currentIndex = 0;

    function showSlide(index) {
      if (slides.length === 1) {
        slides[0].classList.add('active');
        return;
      }

      slides.forEach((slide, i) => {
        slide.classList.remove('active', 'prev');
        if (i === index) {
          slide.classList.add('active');
        } else if (i === (index - 1 + numSlides) % numSlides) {
          slide.classList.add('prev');
        }
      });
    }

    function nextSlide() {
      currentIndex = (currentIndex + 1) % numSlides;
      showSlide(currentIndex);
    }

    function stopCarousel() {
      cancelAnimationFrame(interval);
    }

    function startCarousel() {
      let then = performance.now();
      function animate(now) {
        const delta = now - then;
        if (delta >= delay * 1000) {
          then = now;
          nextSlide();
        }
        interval = requestAnimationFrame(animate);
      }
      interval = requestAnimationFrame(animate);
    }

    if (slides.length > 1) {
      container.addEventListener('mouseenter', stopCarousel);
      container.addEventListener('mouseleave', startCarousel);
    }

    showSlide(currentIndex);
    startCarousel();
  };

  document.addEventListener('DOMContentLoaded', init);
  document.addEventListener('ShopsenseEmbedInjected', init);
})();
