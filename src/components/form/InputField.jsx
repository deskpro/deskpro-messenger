import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const InputField = ({ className, label, id, ...props }) => {
  return (
    <div className="dpmsg-WrapInput">
      <label>
        {!!label && <span className="dpmsg-LabelInputText">{label}</span>}
        <input
          className={classNames('dpmsg-Input', classNames)}
          id={id}
          {...props}
        />
      </label>
    </div>
  );
};

InputField.propTypes = {
  className: PropTypes.string,
  label: PropTypes.string,
  id: PropTypes.string
};

export default InputField;
