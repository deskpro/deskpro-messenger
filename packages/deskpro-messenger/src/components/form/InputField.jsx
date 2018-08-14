import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const InputField = ({ className, label, id, ...props }) => {
  return (
    <div className="form-control">
      {!!label && <label htmlFor={id}>{label}</label>}
      <input
        className={classNames('dpmsg-Input', classNames)}
        id={id}
        {...props}
      />
    </div>
  );
};

InputField.propTypes = {
  className: PropTypes.string,
  label: PropTypes.string,
  id: PropTypes.string
};

export default InputField;
