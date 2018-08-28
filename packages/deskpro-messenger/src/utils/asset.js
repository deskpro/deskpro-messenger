export default (path) =>
  `${
    process.env.NODE_ENV === 'development'
      ? ''
      : window.parent.DESKPRO_MESSENGER_OPTIONS.baseUrl
  }/assets/${path}`;
