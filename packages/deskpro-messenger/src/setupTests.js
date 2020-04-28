// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/extend-expect';

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
