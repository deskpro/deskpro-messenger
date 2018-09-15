import React, { PureComponent } from 'react';
import { FormattedMessage } from 'react-intl';
import {
  LayoutConfig,
  FieldLayout,
  Form,
  withFormik
} from '@deskpro/portal-components';
// import Field from '../form/InputField';
import Button from '../form/Button';

class ChatEnterForm extends PureComponent {
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
  mapPropsToValues: ({ category, layouts }) => {
    const layout = layouts.getMatchingLayout({ category });
    if (layout) {
      return { category, ...layout.getDefaultValues() };
    }
    return { category };
  },
  handleSubmit: (values, { props, setSubmitting }) => {
    // setSubmitting(true);
    props.onSubmit(values);
  }
});

const mapProps = (WrappedComponent) => ({ formConfig, ...props }) => (
  <WrappedComponent {...props} layouts={new LayoutConfig(formConfig)} />
);

export default mapProps(formEnhancer(ChatEnterForm));
