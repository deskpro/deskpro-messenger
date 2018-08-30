import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

const Group = ({ title, children }) => {
  return (
    <Fragment>
      {!!title && (
        <h2 style={{ fontSize: '32px', marginTop: '40px' }}>{title}</h2>
      )}
      <div
        style={{
          padding: '20px',
          border: '1px solid #f0f0f0',
          marginBottom: '20px'
        }}
      >
        {children}
      </div>
    </Fragment>
  );
};

export default Group;
