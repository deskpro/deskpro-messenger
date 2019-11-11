import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';

import Frame from './Frame';
import { isWindowOpened, toggleWindow } from '../../modules/app';
import { ConfigConsumer } from './ConfigContext';
import { darker } from '../../utils/color';

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
    toggleWindow: PropTypes.func.isRequired,
    location: PropTypes.shape({
      pathname: PropTypes.string.isRequired
    }).isRequired,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired
    }).isRequired
  };

  handleTogglerClick = (e) => {
    e.preventDefault();
    if (
      !this.props.opened &&
      !this.props.location.pathname.startsWith('/screens')
    ) {
      this.props.history.push(`/screens/index`);
    }
    this.props.toggleWindow();
  };

  render() {
    const { opened } = this.props;
    return (
      <Frame style={iframeStyle}>
        <button
          style={{
            background: this.props.themeVars['--color-primary'],
            border: `1px solid ${this.props.themeVars['--color-primary']}`
          }}
          className={classNames(`dpmsg-TriggerBtn color--primary`)}
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

const WidgetTogglerWithStyles = (props) => (
  <ConfigConsumer>
    {({ themeVars }) => <WidgetToggler themeVars={themeVars} {...props} />}
  </ConfigConsumer>
);

export default connect(
  (state) => ({ opened: isWindowOpened(state) }),
  { toggleWindow }
)(WidgetTogglerWithStyles);
