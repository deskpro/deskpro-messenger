require('jest-extended');
// add some helpful assertions
require('jest-dom/extend-expect');

// this is basically: afterEach(cleanup)
require('react-testing-library/cleanup-after-each');

// skip missing translation strings warnings.
const consoleError = console.error.bind(console);
console.error = (message, ...args) => {
  if (
    typeof message === 'string' &&
    message.startsWith('[React Intl] Missing message:')
  ) {
    return;
  }
  consoleError(message, ...args);
};

jest.setTimeout(30000);
