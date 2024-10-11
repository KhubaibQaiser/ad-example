(function () {
  // Ensure the namespace exists
  window.ShopsenseEmbeds = window.ShopsenseEmbeds || {};

  const init = () => {
    console.log('INITIALIZING LAZY LOAD');
    var videos = document.querySelectorAll('.event-module-video');
    videos.forEach(function (video) {
      window.ShopsenseEmbeds.getObserverInstance(
        video,
        () => {
          var source = video.getAttribute('data-src');
          if (source) {
            video.setAttribute('src', source);
            // The loadeddata event is fired when the frame at the current playback position of the media has finished loading; often the first frame.
            video.addEventListener('loadeddata', function () {
              video.classList.remove('hidden');
            });
          }
        },
        {
          threshold: 0.5,
        }
      );
    });
  };

  document.addEventListener('DOMContentLoaded', init);
  document.addEventListener('ShopsenseEmbedInjected', init);
})();
