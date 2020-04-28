import React from 'react';
import { render } from '@testing-library/react';
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
export * from '@testing-library/react';

// override render method
export { customRender as render };
