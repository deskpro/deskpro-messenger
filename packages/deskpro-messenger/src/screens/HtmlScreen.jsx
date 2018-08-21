import React from 'react';
import PropTypes from 'prop-types';

const HtmlScreen = ({ html }) => (
  <div dangerouslySetInnerHTML={{ __html: html }} />
);

HtmlScreen.propTypes = {
  html: PropTypes.string.isRequired
};

export default HtmlScreen;
