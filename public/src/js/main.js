if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js')
  .then(function(registration) {
    console.log('Registration successful, scope is:', registration.scope);
  })
  .catch(function(error) {
    console.log('Service worker registration failed, error:', error);
  });
}

// prompt add to homescreen
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
  console.log('show prompt')
  e.preventDefault();
  // // Stash the event so it can be triggered later.
  deferredPrompt = e;
  // // Update UI notify the user they can add to home screen
  e.prompt()
});