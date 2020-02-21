import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import FrameComponent, { FrameContextConsumer } from 'react-frame-component';

import { ConfigConsumer } from './ConfigContext';
import asset from '../../utils/asset';
import { darker } from '../../utils/color';
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

    let extra;

    // in development mode styles are injected on the fly with HMR, so we need to
    // extract them on component rendering.
    if (process.env.NODE_ENV === 'development') {
      // pull css from all style tags because we might not know which one is
      // generated and inserted by webpack HMR.
      const style = Array.from(document.head.querySelectorAll('style'))
        .map((el) => el.innerText)
        .join('\n');
      extra = <style type="text/css">{style}</style>;
    }

    this.el = window.parent.document.createElement('span');
    const assetsPath = asset(`styles.css`);
    // TODO: replace with right styles inclusion.
    baseHead = <link rel="stylesheet" href={assetsPath} />;

    this.state ={
      extra
    };
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
        if(['--color-primary', '--color-secondary', '--brand-primary', '--brand-secondary'].indexOf(name) !== -1) {
          const darkName = name.replace('color', 'color-dark').replace('brand', 'brand-dark');
          html.style.setProperty(darkName, darker(value, 20));
        }
      });
      const style = Array.from(document.head.querySelectorAll('style'))
        .map((el) => el.innerText)
        .join('\n');
      setTimeout(() => {
        const extra = <style type="text/css">{style}</style>;
        if (extra !== this.state.extra) {
          this.setState({
            extra
          });
        }
      }, 100);
    }
  };

  render() {
    const { children, style = {}, head, themeVars, ...props } = this.props;
    const { extra } = this.state;
    style[themeVars.position === 'left' ? 'left' : 'right'] = '14px';

    return ReactDOM.createPortal(
      <FrameComponent
        head={
          <Fragment>
            <link
              href="https://fonts.googleapis.com/css?family=Rubik:400,400i,700,700i"
              rel="stylesheet"
            />
            {head}
            {baseHead}
            {extra}
          </Fragment>
        }
        frameBorder="0"
        scrolling="no"
        style={{ ...defaultIframeStyle, ...style }}
        initialContent={`<!DOCTYPE html><html><head></head><body><div class="dpmsg-ScreenFrame frame-root"></div></body></html>`}
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
