import React from 'react';
import asset from '../../utils/asset';

export const Footer = () => (<div className="dpmsg-ScreenFooter">
  <span className="dpmsg-ScreenLine" />
  <span className="dpmsg-ScreenFooterText">Powered by</span>
  <span className="dpmsg-VertLine" />
  <a href="https://deskpro.com" target="_blank" rel="noreferrer noopener" title="Deskpro">
    <img
      className="dpmsg-ScreenFooterLogo"
      src={asset('img/deskpro-logo.svg')}
      alt="Deskpro"
    />
  </a>
  <span className="dpmsg-ScreenLine" />
</div>);
