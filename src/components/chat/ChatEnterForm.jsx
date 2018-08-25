import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Form, withFormik } from 'formik';
// import { Submit } from 'portal-components/src/Components';
import { LayoutConfig, FieldLayout } from '@deskpro/portal-components';
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
  static propTypes = {
    history: PropTypes.object.isRequired,
    createChat: PropTypes.func.isRequired,
    baseUrl: PropTypes.string.isRequired
  };

  state = { name: '', email: '' };

  handleInputChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { name, email } = this.state;
    if (name && email) {
      this.props.createChat({ name, email });
      this.props.history.push(`${this.props.baseUrl}/new-message`);
    }
  };

  render() {
    const { category } = this.props;
    return (
      <Form>
        {!!category && <FieldLayout layouts={layouts} {...this.props} />}
        <Button width="full" size="medium" type="submit">
          Start Conversation
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
})(ChatEnterForm);
