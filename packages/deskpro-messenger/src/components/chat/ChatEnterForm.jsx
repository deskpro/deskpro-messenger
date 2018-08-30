import React, { PureComponent } from 'react';
// import { Formik } from 'formik';
// import { Submit } from 'portal-components/src/Components';
import {
  LayoutConfig,
  FieldLayout,
  Form,
  Formik
} from '@deskpro/portal-components';
// import Field from '../form/InputField';
import Button from '../form/Button';

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
  render() {
    return (
      <Form>
        <FieldLayout layouts={layouts} {...this.props} />
        <Button width="full" size="medium" color="primary" type="submit">
          Start Conversation
        </Button>
      </Form>
    );
  }
}

export default (props) => {
  const initialValues = {
    category: props.category,
    ...layouts
      .getMatchingLayout({ category: props.category })
      .getDefaultValues()
  };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initialValues}
      handleSubmit={(values, { props, setSubmitting }) => {
        setSubmitting(true);
        props.createChat(values);
        props.history.push(`${props.baseUrl}/new-message`);
      }}
      component={ChatEnterForm}
      {...props}
    />
  );
};
