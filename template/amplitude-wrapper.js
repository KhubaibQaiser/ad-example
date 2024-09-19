amplitude.getInstance().init('YOUR_API_KEY');

console.log('Amplitude initialized');

const logEvent = (eventName, eventProperties) => {
  console.log(`Event: ${eventName}`, eventProperties);
  amplitude.getInstance().logEvent(eventName, eventProperties);
};

window.analytics = {
  logEvent,
};
