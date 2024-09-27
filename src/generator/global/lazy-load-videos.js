document.addEventListener('DOMContentLoaded', function () {
  var videos = document.querySelectorAll('.module-video');
  videos.forEach(function (video) {
    window.getObserverInstance(
      video,
      () => {
        var source = video.getAttribute('data-src');
        video.setAttribute('src', source);
      },
      {
        threshold: 0.5,
      }
    );
  });
});
