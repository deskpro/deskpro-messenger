import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Route, Switch, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { IntlProvider } from 'react-intl';

import enTranslations from '../translations/en.json';
import WithData from './WithData';
import Window from '../components/core/Window';
import MessengerToggler from '../components/core/MessengerToggler';
import { ConfigProvider } from '../components/core/ConfigContext';
import MessengerAPI from '../components/core/MessengerAPI';
import { appInit, appShutdown } from '../modules/app';

if (!Intl.PluralRules) {
  require('@formatjs/intl-pluralrules/polyfill');
  require('@formatjs/intl-pluralrules/dist/locale-data/en'); // Add locale data for en
}

if (!Intl.RelativeTimeFormat) {
  require('@formatjs/intl-relativetimeformat/polyfill');
  require('@formatjs/intl-relativetimeformat/dist/locale-data/en'); // Add locale data for en
}

class Main extends PureComponent {
  static propTypes = {
    config: PropTypes.object,
    appInit: PropTypes.func.isRequired,
    appShutdown: PropTypes.func.isRequired
  };

  static defaultProps = {
    config: {}
  };

  state = {};

  componentDidMount() {
    this.loadLocale();
    this.props.appInit();
  }

  componentDidUpdate(prevProps) {
    this.props.cache.setValue('app.lastLocation', this.props.location.pathname);
    if (prevProps.config.locale !== this.props.config.locale) {
      this.loadLocale(true);
    }
  }

  componentWillUnmount() {
    this.props.appShutdown();
  }

  loadLocale = (force = false) => {
    const { locale } = this.props.config;

    if (force && locale.startsWith('en')) {
      this.setState({ translations: enTranslations });
    } else if (locale && !locale.startsWith('en')) {
      const lang = locale.substring(0, 2);
      const promises = [import(`../translations/${lang}.json`)];
      if (!Intl.PluralRules || !Intl.RelativeTimeFormat) {
        promises.push(import(`@formatjs/intl-pluralrules/dist/locale-data/${lang}`));
        promises.push(import(`@formatjs/intl-relativetimeformat/dist/locale-data/${lang}`));
      }
      Promise.all(promises)
        .then(([translations]) => {
          this.setState({ translations });
        })
        .catch((err) => console.log(err.message));
    }
  };

  render() {
    const { config } = this.props;
    const { translations } = this.state;

    return (
      <ConfigProvider value={config}>
        <IntlProvider
          locale={config.locale || 'en-US'}
          messages={translations || enTranslations}
        >
          <WithData>
            <Switch>
              <Route path="/screens" component={Window} />
            </Switch>
            <Route component={MessengerToggler} />
            <Route component={MessengerAPI} />
          </WithData>
        </IntlProvider>
      </ConfigProvider>
    );
  }
}

const enhancer = compose(
  withRouter,
  connect(
    null,
    { appInit, appShutdown }
  )
);

export default enhancer(Main);
