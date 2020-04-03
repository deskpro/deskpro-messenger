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
    if(this.props.location.pathname.startsWith('/screens')) {
      this.props.cache.setValue('app.lastLocation', this.props.location.pathname);
    }
    if (prevProps.config.language.locale !== this.props.config.language.locale) {
      this.loadLocale();
    }
  }

  componentWillUnmount() {
    this.props.appShutdown();
  }

  loadLocale = () => {
    const { language: { id, locale } } = this.props.config;
    const { cache, api } = this.props;
    if (locale) {
      const lang = locale.substring(0, 2);
      let localePromise;
      const cacheKey  = `app.translation.${locale}_${id}`;
      if(cache.getValue(cacheKey)) {
        localePromise = new Promise((resolve) => { resolve({data: cache.getValue(cacheKey)}); });
      } else {
        localePromise = api.getTranslation(id ? id : locale)
      }
      const promises = [localePromise];
      if (!Intl.PluralRules || !Intl.RelativeTimeFormat) {
        promises.push(import(`@formatjs/intl-pluralrules/dist/locale-data/${lang}`));
        promises.push(import(`@formatjs/intl-relativetimeformat/dist/locale-data/${lang}`));
      }
      Promise.all(promises)
        .then(([translations]) => {
          this.setState({ translations: translations.data }, () => { cache.setValue(cacheKey, translations.data)});
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
