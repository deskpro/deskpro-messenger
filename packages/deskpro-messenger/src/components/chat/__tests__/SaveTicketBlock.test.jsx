import React from 'react';
import { render, fireEvent, waitForElement } from '../../../utils/tests';

import SaveTicketBlock from '../SaveTicketBlock';

const formConfig = [
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
      }
    ]
  }
];

const ticketParams = {
  department: 1,
  subject: 'Unanswered chat from {name}'
};

describe('<SaveTicketBlock />', () => {
  it('should render correctly', () => {
    const onSend = jest.fn();
    const { getByText, asFragment } = render(
      <SaveTicketBlock
        formConfig={formConfig}
        ticketParams={ticketParams}
        onSend={onSend}
      />
    );

    expect(getByText('Do you want to save a new ticket?')).toBeInTheDocument();
    expect(asFragment()).toMatchSnapshot();
  });

  it('should show form for anon visitor', async () => {
    const onSend = jest.fn();
    const { getByText, getByPlaceholderText, asFragment } = render(
      <SaveTicketBlock
        formConfig={formConfig}
        ticketParams={ticketParams}
        onSend={onSend}
      />
    );
    fireEvent.change(getByPlaceholderText('John Doe'), {
      target: { value: 'John Doe' }
    });
    fireEvent.change(getByPlaceholderText('john.doe@company.com'), {
      target: { value: 'john.doe@deskpro.com' }
    });
    fireEvent.click(getByText('Save Ticket').parentElement);
    const el = await waitForElement(() =>
      getByText('An agent will get back to you as soon as possible')
    );
    expect(el).not.toBeNull();
    expect(onSend).toBeCalled();
    expect(onSend.mock.calls[0][0]).toBeObject();
    expect(onSend.mock.calls[0][0].type).toBe('chat.ticket.save');
    expect(onSend.mock.calls[0][0].department_id).toBe(1);
    expect(onSend.mock.calls[0][0].subject).toBe(
      'Unanswered chat from John Doe'
    );
    expect(onSend.mock.calls[0][0].email).toBe('john.doe@deskpro.com');
    expect(onSend.mock.calls[0][0].name).toBe('John Doe');
    expect(asFragment()).toMatchSnapshot();
  });

  it('should prefill form with user data', async () => {
    const onSend = jest.fn();
    const user = { name: 'John Doe', email: 'john.doe@deskpro.com' };
    const { getByText } = render(
      <SaveTicketBlock
        formConfig={formConfig}
        ticketParams={ticketParams}
        onSend={onSend}
        user={user}
      />
    );
    fireEvent.click(getByText('Yes'));
    const el = await waitForElement(() =>
      getByText('An agent will get back to you as soon as possible')
    );
    expect(el).not.toBeNull();
    expect(onSend).toBeCalled();
    expect(onSend.mock.calls[0][0]).toBeObject();
    expect(onSend.mock.calls[0][0].type).toBe('chat.ticket.save');
    expect(onSend.mock.calls[0][0].department_id).toBe(1);
    expect(onSend.mock.calls[0][0].subject).toBe(
      'Unanswered chat from John Doe'
    );
    expect(onSend.mock.calls[0][0].email).toBe('john.doe@deskpro.com');
    expect(onSend.mock.calls[0][0].name).toBe('John Doe');
  });
});
