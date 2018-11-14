import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import FrameComponent, { FrameContextConsumer } from 'react-frame-component';

import { ConfigConsumer } from './ConfigContext';
import asset from '../../utils/asset';
let baseHead;

// in production env this the styles could be extracted only once when the app
// is starting and then this styles could be loaded inside each frame.
if (process.env.NODE_ENV === 'production') {
  const loaderIframe = window.parent.document.getElementById(
    'deskpro-messenger-loader'
  );
  if (loaderIframe) {
    const styleLink = loaderIframe.contentDocument.head.querySelector(
      'link[rel="stylesheet"]'
    ).href;
    baseHead = <link rel="stylesheet" href={styleLink} />;
  }
}

const defaultIframeStyle = {
  position: 'fixed',
  right: '14px',
  bottom: '14px',
  width: '50px',
  height: '50px'
};

const iFrameContainer =
  document.getElementById('deskpro-container') ||
  window.parent.document.getElementById('deskpro-container') ||
  // this is needed for storybooks.
  document.getElementById('root');

class Frame extends PureComponent {
  static propTypes = {
    themeVars: PropTypes.object,
    style: PropTypes.object,
    head: PropTypes.node
  };

  static defaultProps = {
    themeVars: {},
    style: {},
    head: null
  };

  constructor(...args) {
    super(...args);

    // in development mode styles are injected on the fly with HMR, so we need to
    // extract them on component rendering.
    if (process.env.NODE_ENV === 'development') {
      // pull css from all style tags because we might not know which one is
      // generated and inserted by webpack HMR.
      const style = Array.from(document.head.querySelectorAll('style'))
        .map((el) => el.innerText)
        .join('\\n');
      baseHead = <style type="text/css">{style}</style>;
    }

    this.el = window.parent.document.createElement('span');

    // TODO: replace with right styles inclusion.
    baseHead = <link rel="stylesheet" href={asset(`styles.css`)} />;
  }

  frame = React.createRef();

  componentDidMount() {
    iFrameContainer.appendChild(this.el);
    this.updateStyles();
  }

  componentDidUpdate() {
    this.updateStyles();
  }

  componentWillUnmount() {
    iFrameContainer.removeChild(this.el);
  }

  updateStyles = () => {
    if (this.frame.current.node) {
      const html = this.frame.current.getDoc().getElementsByTagName('html')[0];
      Object.entries(this.props.themeVars).forEach(([name, value]) => {
        html.style.setProperty(name, value);
      });
    }
  };

  render() {
    const { children, style = {}, head, themeVars, ...props } = this.props;

    return ReactDOM.createPortal(
      <FrameComponent
        head={
          <Fragment>
            {head}
            {baseHead}
          </Fragment>
        }
        frameBorder="0"
        scrolling="no"
        style={{ ...defaultIframeStyle, ...style }}
        {...props}
        ref={this.frame}
      >
        {children}
      </FrameComponent>,
      this.el
    );
  }
}

export default (props) => (
  <ConfigConsumer>
    {({ themeVars }) => <Frame themeVars={themeVars} {...props} />}
  </ConfigConsumer>
);

export const withFrameContext = (WrappedComponent) => (props) => (
  <FrameContextConsumer>
    {(context) => <WrappedComponent {...props} frameContext={context} />}
  </FrameContextConsumer>
);
