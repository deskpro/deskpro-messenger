import React, { createRef, forwardRef, PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import ReactResizeDetector from 'react-resize-detector';
import { FrameContextConsumer } from 'react-frame-component';
import ScrollArea from 'react-scrollbar/dist/no-css';
import { withRouter } from 'react-router-dom';
import { Footer } from '../ui/Footer';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { isMessageFormFocused } from '../../modules/app';
import isMobile from 'is-mobile';

const mobile = isMobile();
export const ScreenContentContext = React.createContext();

class ScreenContent extends PureComponent {

  static propTypes = {
    frameContext: PropTypes.object,
    iframeHeight: PropTypes.number.isRequired,
    mobile:       PropTypes.bool.isRequired,
    formFocused:  PropTypes.bool
  };

  static defaultProps = {
    frameContext: {},
    formFocused: false
  };

  scrollArea = createRef();

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      this.scrollArea.current.scrollTop();
    }
  }

  render() {
    const { children, contentHeight, iframeHeight, maxHeight, frameContext, forwardedRef, formFocused } = this.props;

    const fullHeight = iframeHeight > parseInt(contentHeight, 10) && this.scrollArea.current && this.scrollArea.current.state.realHeight < iframeHeight;
    const height = iframeHeight >= contentHeight ? iframeHeight - 34 : contentHeight + (mobile && formFocused ? 0 : 33);

    return (
      <div className="dpmsg-ScreenContent">
        <ScrollArea
          horizontal={false}
          ref={this.scrollArea}
          className={classNames({ fullHeight })}
          contentStyle={{height, display: 'flex', flexDirection: 'column'}}
          stopScrollPropagation={true}
          contentWindow={frameContext.window}
          ownerDocument={frameContext.document}
        >
          <div ref={forwardedRef} className="dpmsg-ScreenContentWrapper">
            <ReactResizeDetector handleHeight>
              {(width, height) => (
                <ScreenContentContext.Provider value={{ width, height, maxHeight: parseInt(maxHeight, 10) }}>
                  {children}
                </ScreenContentContext.Provider>
              )}
            </ReactResizeDetector>
          </div>
          {formFocused && mobile ? null : <Footer />}
        </ScrollArea>
      </div>
    );
  }
}

const ScreenContentWithRouter = compose(
  connect(
    (state) => ({
      formFocused: isMessageFormFocused(state)
    })
  ),
  withRouter
)(ScreenContent);

export default forwardRef((props, ref) => (
  <FrameContextConsumer>
    {(context) => (
      <ScreenContentWithRouter
        {...props}
        forwardedRef={ref}
        frameContext={context}
      />
    )}
  </FrameContextConsumer>
));

export const withScreenContentSize = (WrappedComponent) => (props) => (
  <ScreenContentContext.Consumer>
    {(context) => <WrappedComponent {...props} contentSize={context} />}
  </ScreenContentContext.Consumer>
);
