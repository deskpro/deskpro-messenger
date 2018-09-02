import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class Block extends PureComponent {
  static propTypes = {
    title: PropTypes.string,
    children: PropTypes.any
  };

  render() {
    const { title, children } = this.props;

    return (
      <div className="dpmsg-Block">
        <div className="dpmsg-BlockWrapper">
          {!!title && <div className="dpmsg-BlockHeader">{title}</div>}
          {children}
        </div>
      </div>
    );
  }
}

export default Block;
