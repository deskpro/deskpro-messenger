import React, { PureComponent } from 'react';
import ReactResizeDetector from 'react-resize-detector';

/* Heigh of the toggle button, its margins, and margins of the widget shell */
const OUTER_ELEMENTS_HEIGHT = 102;
/* Height of the widget header, footer and margins  */
const INNER_ELEMENTS_HEIGHT = 185;

const getWidgetContentMaxHeight = () =>
  window.parent.innerHeight - OUTER_ELEMENTS_HEIGHT - INNER_ELEMENTS_HEIGHT;

export const ScreenContentContext = React.createContext();

class ScreenContent extends PureComponent {
  render() {
    const { children } = this.props;
    const maxHeight = getWidgetContentMaxHeight();

    return (
      <div
        className="dpmsg-ScreenContent"
        style={{ maxHeight: `${maxHeight}px` }}
      >
        <ReactResizeDetector handleHeight>
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

export default ScreenContent;

export const withScreenContentSize = (WrappedComponent) => (props) => (
  <ScreenContentContext.Consumer>
    {(context) => <WrappedComponent {...props} contentSize={context} />}
  </ScreenContentContext.Consumer>
);
