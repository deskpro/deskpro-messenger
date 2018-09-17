import React from 'react';
import { compose } from 'redux';
import { FieldLayout, Form, withFormik } from '@deskpro/portal-components';
import { FormattedMessage } from 'react-intl';

import Button from '../form/Button';
import withTranslatedLayout from '../core/TranslatedLayoutHOC';

const TicketForm = (props) => (
  <Form>
    <FieldLayout {...props} />
    <Button width="full" size="medium" color="primary" type="submit">
      <FormattedMessage
        id="tickets.create_form.button"
        defaultMessage="Save Ticket"
      />
    </Button>
  </Form>
);

const formEnhancer = withFormik({
  enableReinitialize: true,
  mapPropsToValues: ({ layouts }) => {
    const layout = layouts.getMatchingLayout({});
    if (layout) {
      return layout.getDefaultValues();
    }
    return {};
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
