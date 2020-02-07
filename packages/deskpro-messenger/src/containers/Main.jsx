import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Route, Switch, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { addLocaleData, IntlProvider } from 'react-intl';
import enLocale from 'react-intl/locale-data/en';

import enTranslations from '../translations/en.json';
import WithData from './WithData';
import Window from '../components/core/Window';
import MessengerToggler from '../components/core/MessengerToggler';
import { ConfigProvider } from '../components/core/ConfigContext';
import MessengerAPI from '../components/core/MessengerAPI';
import { appInit, appShutdown } from '../modules/app';

addLocaleData(enLocale);

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
      Promise.all([
        import(`react-intl/locale-data/${lang}`),
        import(`../translations/${lang}.json`)
      ])
        .then(([localeData, translations]) => {
          addLocaleData(localeData);
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
