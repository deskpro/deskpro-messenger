import React from 'react';
import { render, fireEvent, wait } from '../../../utils/tests';
import TicketForm from '../TicketForm';

// commented out since we're using another form, need to update this test
// const ticketFormConfig = [
//   {
//     fields: [
//       {
//         name: 'subject',
//         label: 'Subject',
//         type: 'text',
//         validation: ['required'],
//         placeholder: 'Subject'
//       },
//       {
//         name: 'name',
//         label: 'Full Name',
//         type: 'text',
//         validation: ['required'],
//         placeholder: 'John Doe'
//       },
//       {
//         name: 'email',
//         label: 'Email',
//         type: 'text',
//         validation: ['required'],
//         placeholder: 'john.doe@company.com'
//       },
//       {
//         name: 'message',
//         label: 'Message',
//         type: 'textarea',
//         validation: ['required'],
//         placeholder: 'Enter you message here...'
//       }
//     ]
//   }
// ];
//
// describe('<TicketForm />', () => {
//   it('should render correctly', () => {
//     const { asFragment } = render(
//       <TicketForm formConfig={ticketFormConfig} onSubmit={jest.fn()} />
//     );
//     expect(asFragment()).toMatchSnapshot();
//   });
//
//   it('should submit values according the form config fields', async () => {
//     const onSubmit = jest.fn();
//     const { getByPlaceholderText, getByText } = render(
//       <TicketForm formConfig={ticketFormConfig} onSubmit={onSubmit} />
//     );
//     const button = getByText('Save Ticket');
//     expect(button).toBeInTheDocument();
//
//     fireEvent.change(getByPlaceholderText('Subject'), {
//       target: { value: 'Ticket from John Doe' }
//     });
//     fireEvent.change(getByPlaceholderText('John Doe'), {
//       target: { value: 'John Doe' }
//     });
//     fireEvent.change(getByPlaceholderText('john.doe@company.com'), {
//       target: { value: 'john.doe@deskpro.com' }
//     });
//     fireEvent.change(getByPlaceholderText('Enter you message here...'), {
//       target: { value: 'Lorem ipsum dolar sit amet.' }
//     });
//     fireEvent.click(button.parentElement);
//     await wait(() => {}, { timeout: 1000 });
//     expect(onSubmit).toBeCalledWith({
//       subject: 'Ticket from John Doe',
//       name: 'John Doe',
//       email: 'john.doe@deskpro.com',
//       message: 'Lorem ipsum dolar sit amet.'
//     });
//   });
// });
