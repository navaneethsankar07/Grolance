let isGooglePromptActive = false;

export const triggerGoogleSignup = (callback) => {
  if (!window.google) {
    console.error("Google SDK not loaded");
    return;
  }

  if (isGooglePromptActive) return;

  isGooglePromptActive = true;

  window.google.accounts.id.initialize({
    client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
    callback: (response) => {
      isGooglePromptActive = false;
      callback(response);
    },
    use_fedcm_for_prompt: true
  });

  window.google.accounts.id.prompt((notification) => {
    if (
      notification.isNotDisplayed() ||
      notification.isSkippedMoment()
    ) {
      isGooglePromptActive = false;
    }
  });
};