import React from 'react';
import { render } from 'react-testing-library';
import { IntlProvider } from 'react-intl';
import { MemoryRouter } from 'react-router-dom';

const customRender = (node, { translations = {}, ...options } = {}) => {
  return render(
    <MemoryRouter>
      <IntlProvider locale="en-US" messages={translations}>
        {node}
      </IntlProvider>
    </MemoryRouter>,
    options
  );
};

// re-export everything
export * from 'react-testing-library';

// override render method
export { customRender as render };
