(function () {
  console.log('LOAD CURATED PRODUCTS TEMPLATE SCRIPTS.JS');
  const updateControls = (scrollLeft, maxScrollLeft) => {
    console.log('LOAD CURATED PRODUCTS TEMPLATE CONTROLS');
    const leftButton = document.querySelector('.control-button.left');
    const rightButton = document.querySelector('.control-button.right');

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

  document.addEventListener('DOMContentLoaded', function () {
    const collectionContainer = document.querySelector('.collection-container');
    const controlButtons = document.querySelectorAll('.control-button');

    updateControls(0, collectionContainer.scrollWidth - collectionContainer.clientWidth);

    collectionContainer.addEventListener('scroll', function () {
      const scrollLeft = collectionContainer.scrollLeft;
      const maxScrollLeft = collectionContainer.scrollWidth - collectionContainer.clientWidth;
      updateControls(scrollLeft, maxScrollLeft);
    });

    controlButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        const product = document.querySelector('.product');
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
  });
})();
