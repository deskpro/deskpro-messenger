import React from 'react';
import asset from '../../utils/asset';
import Isvg from 'react-inlinesvg';
import { FormattedMessage } from "react-intl";

const transMessages = {
  poweredBy: {
    id: 'powered_by',
    defaultMessage: 'Powered by'
  }
}

export const Footer = () => (<div className="dpmsg-ScreenFooter">
  <span className="dpmsg-ScreenLine" />
  <span className="dpmsg-ScreenFooterText">
    <FormattedMessage {...transMessages.poweredBy} />
  </span>
  <span className="dpmsg-VertLine" />
  <a href="https://deskpro.com" target="_blank" rel="noreferrer noopener" title="Deskpro">
    <Isvg
      className="dpmsg-ScreenFooterLogo"
      src={asset('img/deskpro-logo.svg')}
      alt="Deskpro"
    />
  </a>
  <span className="dpmsg-ScreenLine" />
</div>);
