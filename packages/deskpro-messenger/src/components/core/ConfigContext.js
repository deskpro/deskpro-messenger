import { createContext } from 'react';

export const {
  Consumer: ConfigConsumer,
  Provider: ConfigProvider
} = createContext({ features: [] });
