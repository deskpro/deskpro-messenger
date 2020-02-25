import React, { PureComponent, forwardRef, createRef } from 'react';
import PropTypes from 'prop-types';
import ReactResizeDetector from 'react-resize-detector';
import { FrameContextConsumer } from 'react-frame-component';
import ScrollArea from 'react-scrollbar/dist/no-css';
import { withRouter } from 'react-router-dom';

/* Height of the toggle button, its margins, and margins of the widget shell */
const OUTER_ELEMENTS_HEIGHT = 102;
/* Height of the widget header, footer and margins  */
const INNER_ELEMENTS_HEIGHT = 240;

const getWidgetContentMaxHeight = () =>
  window.parent.innerHeight - OUTER_ELEMENTS_HEIGHT - INNER_ELEMENTS_HEIGHT;

export const ScreenContentContext = React.createContext();

class ScreenContent extends PureComponent {

  static propTypes = {
    frameContext: PropTypes.object
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
    const { children, frameContext, forwardedRef } = this.props;
    const maxHeight = getWidgetContentMaxHeight();

    return (
      <div className="dpmsg-ScreenContent">
        <ScrollArea
          horizontal={false}
          ref={this.scrollArea}
          stopScrollPropagation={true}
          contentWindow={frameContext.window}
          ownerDocument={frameContext.document}
        >
          <div ref={forwardedRef}>
            <ReactResizeDetector handleHeight>
              {(width, height) => (
                <ScreenContentContext.Provider value={{ width, height, maxHeight }}>
                  {children}
                </ScreenContentContext.Provider>
              )}
            </ReactResizeDetector>
          </div>
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
