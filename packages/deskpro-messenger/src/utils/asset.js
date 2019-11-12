window.parent.DESKPRO_MESSENGER_OPTIONS =
  window.parent.DESKPRO_MESSENGER_OPTIONS || {};

export default (path) => {
  return `${window.parent.DESKPRO_MESSENGER_OPTIONS.baseUrl}/assets/${path}`;
};
