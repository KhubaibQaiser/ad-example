(function () {
  const init = (e) => {
    const container = e?.detail?.container || document;

    const productsContainer = container.querySelector('.collection-container');
    productsContainer.style.overflowX = 'auto';
    productsContainer.style.scrollSnapType = 'x mandatory'; // Enable snap scrolling
    productsContainer.style.scrollBehavior = 'smooth';
    productsContainer.style.scrollSnapAlign = 'center';
    const products = productsContainer.querySelectorAll('.product-card'); // Get all product elements

    let currentIndex = 0; // Track the current product index
    let isScrolling = false;
    let scrollTimeout = null;

    const scrollToProduct = (index) => {
      const productWidth = products[index].offsetWidth;
      const containerWidth = productsContainer.offsetWidth;
      const scrollPosition = products[index].offsetLeft - containerWidth / 2 + productWidth / 2;

      productsContainer.scrollTo({
        left: scrollPosition,
        behavior: 'smooth',
      });
      // Apply active class
      products.forEach((product, i) => {
        product.classList.remove('active');
        if (i === index) {
          product.classList.add('active');
        }
      });
    };

    const scroll = () => {
      currentIndex = (currentIndex + 1) % products.length; // Move to the next product
      scrollToProduct(currentIndex);
      scrollTimeout = setTimeout(() => {
        if (isScrolling) {
          scroll(); // Continue scrolling
        }
      }, 2000); // Wait for 2 seconds before scrolling to the next product
    };

    const startScrolling = () => {
      isScrolling = true;
      scroll(); // Start the scrolling process
    };

    const stopScrolling = () => {
      isScrolling = false;
      clearTimeout(scrollTimeout);
    };

    // const handleScroll = () => {
    //   stopScrolling(); // Stop automatic scrolling
    //   const scrollLeft = productsContainer.scrollLeft; // Get current scroll position
    //   // Calculate the closest product index based on scroll position
    //   currentIndex = Array.from(products).findIndex((product) => {
    //     const productLeft = product.offsetLeft;
    //     const productRight = productLeft + product.offsetWidth;
    //     return scrollLeft >= productLeft && scrollLeft < productRight;
    //   });
    // };

    productsContainer.addEventListener('mouseenter', stopScrolling);
    productsContainer.addEventListener('mouseleave', startScrolling);

    // Start scrolling on initialization
    startScrolling();
  };

  document.addEventListener('DOMContentLoaded', init);
  document.addEventListener('ShopsenseEmbedInjected', init);
})();
