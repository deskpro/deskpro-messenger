import React, { PureComponent, forwardRef } from 'react';
import ReactResizeDetector from 'react-resize-detector';
import { FrameContextConsumer } from 'react-frame-component';
import ScrollArea from 'react-scrollbar/dist/no-css';

/* Height of the toggle button, its margins, and margins of the widget shell */
const OUTER_ELEMENTS_HEIGHT = 102;
/* Height of the widget header, footer and margins  */
const INNER_ELEMENTS_HEIGHT = 240;

const getWidgetContentMaxHeight = () =>
  window.parent.innerHeight - OUTER_ELEMENTS_HEIGHT - INNER_ELEMENTS_HEIGHT;

export const ScreenContentContext = React.createContext();

class ScreenContent extends PureComponent {
  static defaultProps = {
    onResize: () => {},
    frameContext: {}
  };

  render() {
    const { children, frameContext, forwardedRef } = this.props;
    const maxHeight = getWidgetContentMaxHeight();

    return (
      <div className="dpmsg-ScreenContent">
        <ScrollArea
          horizontal={false}
          style={{
          }}
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

export default forwardRef((props, ref) => (
  <FrameContextConsumer>
    {(context) => (
      <ScreenContent
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
