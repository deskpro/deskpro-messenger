import React, { PureComponent, forwardRef } from 'react';
import ReactResizeDetector from 'react-resize-detector';

/* Height of the toggle button, its margins, and margins of the widget shell */
const OUTER_ELEMENTS_HEIGHT = 102;
/* Height of the widget header, footer and margins  */
const INNER_ELEMENTS_HEIGHT = 200;

const getWidgetContentMaxHeight = () =>
  window.parent.innerHeight - OUTER_ELEMENTS_HEIGHT - INNER_ELEMENTS_HEIGHT;

export const ScreenContentContext = React.createContext();

class ScreenContent extends PureComponent {
  static defaultProps = {
    onResize: () => {}
  };

  render() {
    const { children, onResize, forwardedRef } = this.props;
    const maxHeight = getWidgetContentMaxHeight();

    return (
      <div ref={forwardedRef} className="dpmsg-ScreenContent">
        <ReactResizeDetector handleHeight onResize={onResize}>
        {(width, height) => (
          <ScreenContentContext.Provider value={{ width, height, maxHeight }}>
            {children}
          </ScreenContentContext.Provider>
        )}
        </ReactResizeDetector>
      </div>
    );
  }
}

export default forwardRef((props, ref) => (
    <ScreenContent
      {...props}
      forwardedRef={ref}
    />
));

export const withScreenContentSize = (WrappedComponent) => (props) => (
  <ScreenContentContext.Consumer>
    {(context) => <WrappedComponent {...props} contentSize={context} />}
  </ScreenContentContext.Consumer>
);
