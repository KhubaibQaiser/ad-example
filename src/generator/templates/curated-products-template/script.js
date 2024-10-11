(function () {
  const updateControls = (container) => (scrollLeft, maxScrollLeft) => {
    const leftButton = container.querySelector('.control-button.left');
    const rightButton = container.querySelector('.control-button.right');

    if (scrollLeft === 0) {
      leftButton.style.opacity = '0';
    } else {
      leftButton.style.opacity = '1';
    }

    if (scrollLeft === maxScrollLeft) {
      rightButton.style.opacity = '0';
    } else {
      rightButton.style.opacity = '1';
    }
  };

  const init = (e) => {
    const container = e?.detail?.container || document;

    const collectionContainer = container.querySelector('.collection-container');
    const controlButtons = container.querySelectorAll('.control-button');

    updateControls(container)(0, collectionContainer.scrollWidth - collectionContainer.clientWidth);

    collectionContainer.addEventListener('scroll', function () {
      const scrollLeft = collectionContainer.scrollLeft;
      const maxScrollLeft = collectionContainer.scrollWidth - collectionContainer.clientWidth;
      updateControls(container)(scrollLeft, maxScrollLeft);
    });

    controlButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        const product = container.querySelector('.product');
        const itemWidth = product.offsetWidth;
        const scrollLeft = collectionContainer.scrollLeft;

        if (button.classList.contains('left')) {
          collectionContainer.scrollTo({
            left: scrollLeft - itemWidth,
            behavior: 'smooth',
          });
        } else if (button.classList.contains('right')) {
          collectionContainer.scrollTo({
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
