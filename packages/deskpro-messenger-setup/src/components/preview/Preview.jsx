import React from 'react';
import PropTypes from 'prop-types';

class Preview extends React.PureComponent {
  static propTypes = {
    config: PropTypes.object
  };

  render() {
    return (
      <div className="dp-ms-preview-container">
        <div className="dp-ms-preview">
          The place where messenger preview will be shown
        </div>
      </div>
    );
  }
}

export default Preview;
