import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

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
  width: '60px',
  height: '60px'
};

class WidgetToggler extends PureComponent {
  static propTypes = {
    opened: PropTypes.bool,
    onToggle: PropTypes.func.isRequired,
    location: PropTypes.shape({
      pathname: PropTypes.string.isRequired
    }).isRequired,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired
    }).isRequired
  };

  handleTogglerClick = e => {
    e.preventDefault();
    if (
      !this.props.opened &&
      !this.props.location.pathname.startsWith('/screens')
    ) {
      this.props.history.push(`/screens/index`);
    }
    this.props.onToggle(e);
  };

  render() {
    const { opened } = this.props;
    return (
      <Frame style={iframeStyle}>
        <button
          className={classNames(`dpmsg-TriggerBtn is-blue`)}
          onClick={this.handleTogglerClick}
        >
          {opened ? (
            <i className="dpmsg-Icon dpmsg-IconClose" />
          ) : (
            <i className="dpmsg-Icon dpmsg-IconChat" />
          )}
        </button>
      </Frame>
    );
  }
}

export default WidgetToggler;
