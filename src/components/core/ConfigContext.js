import React, { createContext } from 'react';

export const {
  Consumer: ConfigConsumer,
  Provider: ConfigProvider
} = createContext({ screens: {} });

export const withConfig = WrappedComponent => props => (
  <ConfigConsumer>
    {context => <WrappedComponent {...props} {...context} />}
  </ConfigConsumer>
);
