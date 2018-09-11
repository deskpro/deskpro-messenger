import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import {
  LayoutConfig,
  FieldLayout,
  Form,
  withFormik
} from '@deskpro/portal-components';
// import Field from '../form/InputField';
import Button from '../form/Button';
import translateFieldLayout from '../../utils/translateFieldLayout';

const layoutsConfig = [
  {
    rules: [{ field: 'category', value: 'sales', op: 'eq' }],
    fields: [
      {
        name: 'name',
        label: 'Full Name',
        type: 'text',
        validation: ['required'],
        placeholder: 'John Doe'
      },
      {
        name: 'email',
        label: 'Email',
        type: 'text',
        validation: ['required'],
        placeholder: 'john.doe@company.com'
      },
      { name: 'budget', label: 'Budget', type: 'text' }
    ]
  },
  {
    rules: [{ field: 'category', value: 'support', op: 'eq' }],
    fields: [
      {
        name: 'name',
        label: 'Full Name',
        type: 'text',
        validation: ['required'],
        placeholder: 'John Doe'
      },
      {
        name: 'email',
        label: 'Email',
        type: 'text',
        validation: ['required'],
        placeholder: 'john.doe@company.com'
      },
      {
        name: 'cloud_premise',
        label: 'Cloud or On-Premise',
        type: 'choice',
        dataSource: {
          getOptions: [
            { value: 'cloud', label: 'Cloud' },
            { value: 'on-premise', label: 'On-Premise' }
          ]
        }
      }
    ]
  }
];

const layouts = new LayoutConfig(layoutsConfig);

class ChatEnterForm extends PureComponent {
  static propTypes = {
    intl: PropTypes.object.isRequired
  };

  render() {
    const { intl, ...props } = this.props;
    const layouts = new LayoutConfig(
      translateFieldLayout(layoutsConfig, intl.formatMessage)
    );

    return (
      <Form>
        <FieldLayout layouts={layouts} {...props} />
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

export default withFormik({
  enableReinitialize: true,
  mapPropsToValues: ({ category }) => {
    const layout = layouts.getMatchingLayout({ category });
    if (layout) {
      return { category, ...layout.getDefaultValues() };
    }
    return { category };
  },
  handleSubmit: (values, { props, setSubmitting }) => {
    setSubmitting(true);
    props.createChat(values);
    props.history.push(`${props.baseUrl}/new-message`);
  }
})(injectIntl(ChatEnterForm));
