import React from 'react';
import { render, fireEvent, wait } from '../../../utils/tests';

import ChatEnterForm from '../ChatEnterForm';

const preChatFormLayout = [
  {
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
            {
              value: 'cloud',
              label: 'Cloud'
            },
            {
              value: 'on-premise',
              label: 'On-Premise'
            }
          ]
        }
      }
    ]
  }
];

const values = {
  name: 'John Doe',
  email: 'john.doe@deskpro.com',
  cloud_premise: 'cloud'
};

describe('<ChatEnterForm />', () => {
  it('should render correctly', () => {
    const { asFragment } = render(
      <ChatEnterForm
        formConfig={preChatFormLayout}
        user={values}
        department={4}
        onSubmit={jest.fn()}
      />
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('should submit values', async () => {
    const onSubmit = jest.fn();
    const { getByText, debug } = render(
      <ChatEnterForm
        formConfig={preChatFormLayout}
        user={values}
        department={4}
        onSubmit={onSubmit}
      />
    );
    const button = getByText('Start Conversation');
    expect(button).toBeInTheDocument();
    fireEvent.click(button.parentElement);
    await wait(() => {}, { timeout: 1000 });
    expect(onSubmit).toBeCalledWith({ ...values, department: 4 });
  });
});
