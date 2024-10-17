(function () {
  const updateControls = (container) => (scrollLeft, maxScrollLeft) => {
    const leftButton = container.querySelector('.control-button.left');
    const rightButton = container.querySelector('.control-button.right');

    if (scrollLeft === 0) {
      leftButton.setAttribute('disabled', true);
    } else {
      leftButton.removeAttribute('disabled');
    }

    if (Math.abs(maxScrollLeft - scrollLeft) <= 2) {
      rightButton.setAttribute('disabled', true);
    } else {
      rightButton.removeAttribute('disabled');
    }
  };

  const init = (e) => {
    const container = e?.detail?.container || document;

    const productsContainer = container.querySelector('.products-container');
    const controlButtons = container.querySelectorAll('.control-button');

    updateControls(container)(0, productsContainer.scrollWidth - productsContainer.clientWidth);

    productsContainer.addEventListener('scroll', function () {
      const scrollLeft = productsContainer.scrollLeft;
      const maxScrollLeft = productsContainer.scrollWidth - productsContainer.clientWidth;
      updateControls(container)(scrollLeft, maxScrollLeft);
    });

    controlButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        const product = container.querySelector('.product-card');
        const itemWidth = product.offsetWidth;
        const scrollLeft = productsContainer.scrollLeft;

        if (button.classList.contains('left')) {
          productsContainer.scrollTo({
            left: scrollLeft - itemWidth,
            behavior: 'smooth',
          });
        } else if (button.classList.contains('right')) {
          productsContainer.scrollTo({
            left: scrollLeft + itemWidth,
            behavior: 'smooth',
          });
        }
      });
    });
  };

  document.addEventListener('DOMContentLoaded', init);
  document.addEventListener('ShopsenseEmbedInjected', init);
})();
