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
import currentUser from './services/CurrentUser';

addLocaleData(enLocale);

class App extends PureComponent {
  static propTypes = {
    config: PropTypes.object
  };

  static defaultProps = {
    config: {}
  };

  state = {
    randomGreeting: this.getRandomGreeting(),
    windowVisible: !!this.getRandomGreeting() || !!currentUser.getActiveChat()
  };

  getRandomGreeting() {
    return Array.isArray(this.props.config.enabledGreetings)
      ? _sample(this.props.config.enabledGreetings)
      : undefined;
  }

  componentDidMount() {
    this.setState({ randomGreeting: undefined });
    this.loadLocale();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.config.locale !== this.props.config.locale) {
      this.loadLocale(true);
    }
  }

  loadLocale = (force = false) => {
    const { locale } = this.props.config;

    if (force && locale.startsWith('en')) {
      this.setState({ translations: enTranslations });
    } else if (locale && !locale.startsWith('en')) {
      const lang = locale.substring(0, 2);
      Promise.all([
        import(`react-intl/locale-data/${lang}`),
        import(`./translations/${lang}.json`)
      ])
        .then(([localeData, translations]) => {
          addLocaleData(localeData);
          this.setState({ translations });
        })
        .catch((err) => console.log(err.message));
    }
  };

  toggleWindow = () => {
    this.setState({ windowVisible: !this.state.windowVisible });
  };

  render() {
    const { config } = this.props;
    const { windowVisible, randomGreeting, translations } = this.state;
    let redirect;
    const activeChat = currentUser.getActiveChat();
    if (activeChat) {
      redirect = `/screens/active-chat/${activeChat.id}`;
    } else if (!!randomGreeting) {
      redirect = randomGreeting;
    }

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
                {!!redirect && <Redirect to={redirect} />}
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
