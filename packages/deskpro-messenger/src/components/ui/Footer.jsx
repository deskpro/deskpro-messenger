import React, { Fragment, PureComponent } from 'react';
import asset from '../../utils/asset';
import Isvg from 'react-inlinesvg';
import { FormattedMessage } from "react-intl";
import { ConfigConsumer } from '../core/ConfigContext';
import PropTypes from 'prop-types';

const transMessages = {
  poweredBy: {
    id:             'helpcenter.messenger.powered_by',
    defaultMessage: 'Powered by'
  }
}

class Footer extends PureComponent {
  static propTypes = {
    copyfree:    PropTypes.bool,
    helpdeskURL: PropTypes.string
  }

  static defaultProps = {
    copyfree: false,
    helpdeskURL: ''
  }
  render() {
    let poweredBy = `https://www.deskpro.com/powered-by-deskpro/messenger`;
    return (
      <div className="dpmsg-ScreenFooter">
        { this.props.copyfree ? null : (
          <Fragment>
            <span className="dpmsg-ScreenLine" />
            <span className="dpmsg-ScreenFooterText">
              <FormattedMessage {...transMessages.poweredBy} />
            </span>
            <span className="dpmsg-VertLine"/>
            <a 
              href={poweredBy}
              target="_blank" 
              rel="noreferrer noopener" 
              title="Deskpro"
            >
              <Isvg
                className="dpmsg-ScreenFooterLogo"
                src={asset('img/deskpro-logo.svg')}
                alt="Deskpro"
              />
            </a>
            <span className="dpmsg-ScreenLine"/>
          </Fragment>
        )}
      </div>
    )
  }
}

export default (props) => (
  <ConfigConsumer>
    {({ themeVars, helpdeskURL }) => <Footer copyfree={themeVars.copyfree} helpdeskURL={helpdeskURL} {...props} />}
  </ConfigConsumer>
);
