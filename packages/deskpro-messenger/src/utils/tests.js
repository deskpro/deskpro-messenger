import React from 'react';
import { render } from 'react-testing-library';
import { IntlProvider } from 'react-intl';

const customRender = (node, options) => {
  return render(<IntlProvider locale="en-US">{node}</IntlProvider>, options);
};

// re-export everything
export * from 'react-testing-library';

// override render method
export { customRender as render };
