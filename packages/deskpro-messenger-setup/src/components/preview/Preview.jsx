import React from 'react';
import PropTypes from 'prop-types';

class Preview extends React.PureComponent {
  static propTypes = {
    config: PropTypes.object
  };

  render() {
    const { config } = this.props;
    return (
      <div className="messenger-preview">
        Preview
        <div />
      </div>
    );
  }
}

export default Preview;
