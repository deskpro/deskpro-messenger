import React, { PureComponent, forwardRef, createRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import ReactResizeDetector from 'react-resize-detector';
import { FrameContextConsumer } from 'react-frame-component';
import ScrollArea from 'react-scrollbar/dist/no-css';
import { withRouter } from 'react-router-dom';
import { Footer } from '../ui/Footer';

export const ScreenContentContext = React.createContext();

class ScreenContent extends PureComponent {

  static propTypes = {
    frameContext: PropTypes.object,
    iframeHeight: PropTypes.number.isRequired
  };

  static defaultProps = {
    frameContext: {}
  };

  scrollArea = createRef();

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      this.scrollArea.current.scrollTop();
    }
  }

  render() {
    const { children, contentHeight, iframeHeight, maxHeight, frameContext, forwardedRef } = this.props;
    const fullHeight = iframeHeight > parseInt(contentHeight, 10) && this.scrollArea.current && this.scrollArea.current.state.realHeight < iframeHeight;
    const height = iframeHeight >= contentHeight ? iframeHeight - 33 : contentHeight + 33;
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
                <ScreenContentContext.Provider value={{ width, height, maxHeight: parseInt(maxHeight, 10) - 34 }}>
                  {children}
                </ScreenContentContext.Provider>
              )}
            </ReactResizeDetector>
          </div>
          <Footer/>
        </ScrollArea>
      </div>
    );
  }
}

const ScreenContentWithRouter = withRouter(ScreenContent);

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
