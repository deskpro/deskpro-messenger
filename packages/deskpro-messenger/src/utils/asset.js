window.parent.DESKPRO_MESSENGER_OPTIONS =
  window.parent.DESKPRO_MESSENGER_OPTIONS || {};

export default (path) => {
  let edited = '';
  if (window.parent.DESKPRO_MESSENGER_OPTIONS.baseUrl) {
    edited = window.parent.DESKPRO_MESSENGER_OPTIONS.baseUrl.replace(/\/$/, "");
  }
  return `${edited}/assets/${path}`;
};
