window.parent.DESKPRO_MESSENGER_OPTIONS =
  window.parent.DESKPRO_MESSENGER_OPTIONS || {};

export default (path) => {
  const edited = window.parent.DESKPRO_MESSENGER_OPTIONS.baseUrl.replace(/\/$/, "");
  return `${edited}/assets/${path}`;
};
