import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

class Block extends PureComponent {
  static propTypes = {
    title: PropTypes.string,
    children: PropTypes.any,
    className: PropTypes.string,
    style: PropTypes.object
  };

  render() {
    const { title, children, className } = this.props;

    return (
      <div className={classNames('dpmsg-Block', className)}>
        <div className="dpmsg-BlockWrapper">
          {!!title && <div className="dpmsg-BlockHeader">{title}</div>}
          {children}
        </div>
      </div>
    );
  }
}

export default Block;
