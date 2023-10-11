import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import FrameComponent, { FrameContextConsumer } from 'react-frame-component';
import classNames from 'classnames';

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
    disableGoogleFont: PropTypes.bool,
    extraScripts: PropTypes.array,
    className: PropTypes.string,
    style: PropTypes.object,
    head: PropTypes.node,
    mobile: PropTypes.bool,
  };

  static defaultProps = {
    themeVars: {},
    disableGoogleFont: false,
    extraScripts: [],
    style: {},
    head: null,
    mobile: false,
  };

  constructor(...args) {
    super(...args);

    let style;
    // in development mode styles are injected on the fly with HMR, so we need to
    // extract them on component rendering.
    if (process.env.NODE_ENV === 'development') {
      // pull css from all style tags because we might not know which one is
      // generated and inserted by webpack HMR.
      style = Array.from(document.head.querySelectorAll('style'))
        .map((el) => el.innerText)
        .join('\n');
    }

    this.el = window.parent.document.createElement('span');
    const assetsPath = asset(`styles.css`);
    // TODO: replace with right styles inclusion.
    baseHead = <link rel="stylesheet" href={assetsPath} />;

    this.state ={
      extra: style
    };
  }


  frame = React.createRef();

  componentDidMount() {
    iFrameContainer.appendChild(this.el);
    this.loadExtraScripts();
    this.updateStyles();
  }

  componentDidUpdate() {
    this.updateStyles();
  }

  componentWillUnmount() {
    iFrameContainer.removeChild(this.el);
  }

  loadExtraScripts = () => {
    const { extraScripts } = this.props;
    if (extraScripts && extraScripts.length > 0) {
      extraScripts.forEach((script) => {
        const element = document.createElement("script");
        element.src = "/static/libs/your_script.js";
        element.async = script.async || false;
        element.defer = script.defer || false;
        element.type = script.type || 'text/javascript';
        element.id = script.id || '';

        iFrameContainer.appendChild(script);
      });
    }
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
      if (style !== this.state.extra) {
        this.setState({
          extra: style
        });
      }
    } else {
      setTimeout(() => {
        this.updateStyles()
      }, 100);
    }
  };

  render() {
    const {
      children,
      style = {},
      head,
      themeVars,
      className,
      mobile,
      disableGoogleFont,
      ...props
    } = this.props;
    const { extra } = this.state;
    let offset = '14px';
    if(mobile) {
      offset = '0';
    } else if (className === 'dpmsg-MessengerFrame') {
      offset = themeVars.position === 'left' ? '5px' : '0'
    }
    style[themeVars.position === 'left' ? 'left' : 'right'] = offset;
    const frameClasses = classNames({
        'dpmsg-MessengerFrame--right': themeVars.position === 'right',
        'dpmsg-MessengerFrame--left':  themeVars.position === 'left',
        'dpmsg-ScreenMobile': mobile
      },
      className,
      'dpmsg-ScreenFrame frame-root'
    );

    const font = disableGoogleFont ? null : (
      <link
              href="https://fonts.googleapis.com/css?family=Rubik:400,400i,700,700i"
              rel="stylesheet"
      />
    );

    return ReactDOM.createPortal(
      <FrameComponent
        head={
          <Fragment>
            {font}
            {head}
            {baseHead}
            <style type="text/css" key="extra-style">{extra}</style>

          </Fragment>
        }
        frameBorder="0"
        scrolling="no"
        style={{ ...defaultIframeStyle, ...style }}
        initialContent={`<!DOCTYPE html><html><head></head><body><div class="${frameClasses}"></div></body></html>`}
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
    {({ themeVars, disableGoogleFont, extraScripts }) => (
      <Frame
        themeVars={themeVars}
        disableGoogleFont={disableGoogleFont}
        extraScripts={extraScripts}
        {...props}
      />
    )}
  </ConfigConsumer>
);



export const withFrameContext = (WrappedComponent) => (props) => (
  <FrameContextConsumer>
    {(context) => <WrappedComponent {...props} frameContext={context} />}
  </FrameContextConsumer>
);
