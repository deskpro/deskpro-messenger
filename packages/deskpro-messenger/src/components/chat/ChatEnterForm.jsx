import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import {
  LayoutConfig,
  FieldLayout,
  Form,
  withFormik
} from '@deskpro/portal-components';
import _omitBy from 'lodash/omitBy';
import _isEmpty from 'lodash/isEmpty';
// import Field from '../form/InputField';
import Button from '../form/Button';
import translateFieldLayout from '../../utils/translateFieldLayout';

class ChatEnterForm extends PureComponent {
  static propTypes = {
    intl: PropTypes.object.isRequired
  };

  render() {
    return (
      <Form>
        <FieldLayout {...this.props} />
        <Button width="full" size="medium" color="primary" type="submit">
          <FormattedMessage
            id="chat.enter_form.button"
            defaultMessage="Start Conversation"
          />
        </Button>
      </Form>
    );
  }
}

const formEnhancer = withFormik({
  enableReinitialize: true,
  mapPropsToValues: ({ category, layouts, user }) => {
    const layout = layouts.getMatchingLayout({ category });
    const userData = _omitBy(user, _isEmpty);
    if (layout) {
      return { category, ...layout.getDefaultValues(), ...userData };
    }
    return { category, ...userData };
  },
  handleSubmit: (values, { props, setSubmitting }) => {
    // setSubmitting(true);
    props.onSubmit(values);
  }
});

const mapProps = (WrappedComponent) => ({ formConfig, ...props }) => (
  <WrappedComponent
    {...props}
    layouts={
      new LayoutConfig(
        translateFieldLayout(formConfig, props.intl.formatMessage)
      )
    }
  />
);

export default compose(
  injectIntl,
  mapProps,
  formEnhancer
)(ChatEnterForm);
