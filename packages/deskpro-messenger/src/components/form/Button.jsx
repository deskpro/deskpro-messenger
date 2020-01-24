import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

const Button = ({
  children,
  to,
  className,
  width = '',
  size,
  color = '',
  textOnly = false,
  rounded = false,
  input = false,
  ...props
}) =>
  React.createElement(
    to ? Link : 'button',
    {
      className: classNames('dpmsg-Button', {
        'Button-FullWidth': width === 'full',
        'Button-LimitedWidth': width === 'limited',
        'Button-HalfWidth': width === 'half',
        'Button--text': textOnly,
        [`Button--${size}`]: !!size,
        [`Button--${color}`]: !!color,
        'Button--rounded': !!rounded,
        'Button--input' : !!input,
      }),
      to,
      ...props
    },
    children
  );

Button.propTypes = {
  to: PropTypes.string,
  width: PropTypes.oneOf(['full', 'limited', 'half']),
  size: PropTypes.oneOf(['medium']),
  color: PropTypes.oneOf([
    'primary',
    'secondary',
    'success',
    'info',
    'warning',
    'danger',
    'transparent',
    'white',
    'black'
  ]),
  textOnly: PropTypes.bool,
  children: PropTypes.any.isRequired
};

export default Button;
