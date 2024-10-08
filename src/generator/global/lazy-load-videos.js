(function () {
  // Ensure the namespace exists
  window.ShopsenseEmbeds = window.ShopsenseEmbeds || {};

  document.addEventListener('DOMContentLoaded', function () {
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
  });
})();
