// googleSignupHelper.js
export const initGoogleButton = (elementId, callback) => {
  if (!window.google) {
    return;
  }

  window.google.accounts.id.initialize({
    client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
    callback,
  });

  window.google.accounts.id.renderButton(
    document.getElementById(elementId),
    {
      theme: "outline",
      size: "large",
      width: 360,       
      text: "continue_with",
    }
  );
};
