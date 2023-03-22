import { configure } from '@storybook/react';

window.parent.DESKPRO_MESSENGER_OPTIONS = {
  bundleUrl: {
    baseUrl:
      process.env.NODE_ENV === 'development'
        ? 'http://localhost:9009/assets/'
        : 'https://deskpro.github.io/deskpro-messenger/assets/'
  },
  language: {
    locale: 'en'
  }
};

function loadStories() {
  require('../src/stories');
}

configure(loadStories, module);
