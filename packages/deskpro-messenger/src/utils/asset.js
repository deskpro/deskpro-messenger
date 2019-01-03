window.parent.DESKPRO_MESSENGER_OPTIONS =
  window.parent.DESKPRO_MESSENGER_OPTIONS || {};

export default (path) =>
  `${
    process.env.NODE_ENV === 'development'
      ? '/assets/'
      : window.parent.DESKPRO_MESSENGER_OPTIONS.baseUrl || ''
  }${path}`;
