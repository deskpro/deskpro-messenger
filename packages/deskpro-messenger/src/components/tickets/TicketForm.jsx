import React from 'react';
import { compose } from 'redux';
import { FieldLayout, Form, withFormik, TicketForm } from '@deskpro/portal-components';
import { FormattedMessage } from 'react-intl';

import Button from '../form/Button';
import withTranslatedLayout from '../core/TranslatedLayoutHOC';

const TicketForm = (props) => (
  <Form>
    <FieldLayout {...props} />
    <Button width="full" size="medium" color="primary" type="submit">
      <FormattedMessage
        id="tickets.form.submit_button"
        defaultMessage="Save Ticket"
      />
    </Button>
  </Form>
);

const formEnhancer = withFormik({
  enableReinitialize: true,
  mapPropsToValues: ({ layouts, initialValues = {} }) => {
    const layout = layouts.getMatchingLayout(initialValues);
    if (layout) {
      return { ...initialValues, ...layout.getDefaultValues() };
    }
    return { ...initialValues };
  },
  handleSubmit: (values, { props, setSubmitting }) => {
    // setSubmitting(true);
    props.onSubmit(values);
  }
});

export default compose(
  withTranslatedLayout,
  formEnhancer
)(TicketForm);
