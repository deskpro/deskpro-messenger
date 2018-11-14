import React, { createContext } from 'react';

export const ConfigContext = createContext({ screens: {} });
export const {
  Consumer: ConfigConsumer,
  Provider: ConfigProvider
} = ConfigContext;

export const withConfig = (WrappedComponent) => (props) => (
  <ConfigConsumer>
    {(context) => <WrappedComponent {...props} {...context} />}
  </ConfigConsumer>
);
