import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Frame from './Frame';

/*const buttonStyle = {
  width: '150px',
  alignSelf: 'flex-end',
  border: '1px solid',
  borderRadius: '2px',
  padding: '5px',
  fontSize: '14px',
  outline: 'none',
  backgroundColor: '#ddd'
};*/

const iframeStyle = {
  position: 'fixed',
  right: '14px',
  bottom: '14px',
  width: '160px',
  height: '40px'
};

class WidgetToggler extends PureComponent {
  static propTypes = {
    state: PropTypes.bool,
    onClick: PropTypes.func.isRequired
  };

  static defaultProps = {
    state: false
  };

  render() {
    const { state, onClick } = this.props;
    const buttonClassName = state
      ? 'widget-toggler--button__opened'
      : 'widget-toggler--button__collapsed';

    return (
      <Frame style={iframeStyle}>
        <button
          className={`widget-toggler--button ${buttonClassName}`}
          onClick={onClick}
        >
          {state ? 'Close' : 'Click Me!'}
        </button>
      </Frame>
    );
  }
}

export default WidgetToggler;
