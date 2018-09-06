import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { MemoryRouter, Switch, Route, Redirect } from 'react-router-dom';
import _sample from 'lodash/sample';
import { IntlProvider, addLocaleData } from 'react-intl';
import enLocale from 'react-intl/locale-data/en';

import enTranslations from './translations/en.json';
import Window from './components/core/Window';
import MessengerToggler from './components/core/MessengerToggler';
import Greetings from './components/core/Greetings';
import { ConfigProvider } from './components/core/ConfigContext';
import MessengerAPI from './components/core/MessengerAPI';

class App extends PureComponent {
  static propTypes = {
    config: PropTypes.object
  };

  static defaultProps = {
    config: {}
  };

  state = {
    randomGreeting: Array.isArray(this.props.config.enabledGreetings)
      ? _sample(this.props.config.enabledGreetings)
      : undefined,
    windowVisible: false
  };

  componentDidMount() {
    const { locale } = this.props.config;

    this.setState({ randomGreeting: undefined });

    addLocaleData(enLocale);
    if (locale && !locale.startsWith('en')) {
      const lang = locale.substring(0, 2);
      Promise.all([
        import(`react-intl/locale-data/${lang}`),
        import(`./translations/${lang}.json`)
      ])
        .then(([locale, translations]) => {
          addLocaleData(locale);
          this.setState({ translations });
        })
        .catch((err) => console.log(err.message));
    }
  }

  toggleWindow = () => {
    this.setState({ windowVisible: !this.state.windowVisible });
  };

  render() {
    const { config } = this.props;
    const { windowVisible, randomGreeting, translations } = this.state;

    return (
      <ConfigProvider value={config}>
        <IntlProvider
          locale={config.locale || 'en-US'}
          messages={translations || enTranslations}
        >
          <MemoryRouter>
            <Fragment>
              <Switch>
                <Route
                  path="/screens"
                  render={(props) => (
                    <Window {...props} opened={windowVisible} />
                  )}
                />
                <Route path="/greetings" component={Greetings} />
                {!!randomGreeting && <Redirect to={randomGreeting} />}
              </Switch>
              <Route
                render={(props) => (
                  <MessengerToggler
                    opened={windowVisible}
                    onToggle={this.toggleWindow}
                    {...props}
                  />
                )}
              />
              <Route
                render={(props) => (
                  <MessengerAPI
                    opened={windowVisible}
                    onToggle={this.toggleWindow}
                    {...props}
                  />
                )}
              />
            </Fragment>
          </MemoryRouter>
        </IntlProvider>
      </ConfigProvider>
    );
  }
}

export default App;
