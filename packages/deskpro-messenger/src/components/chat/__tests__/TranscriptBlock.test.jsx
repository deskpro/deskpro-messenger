import React from 'react';
import { render, fireEvent } from '../../../utils/tests';

import TranscriptBlock from '../TranscriptBlock';

describe('<TranscriptBlock />', () => {
  it('should render correctly', () => {
    const onSend = jest.fn();
    const { asFragment } = render(<TranscriptBlock onSend={onSend} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('should show form for anon visitor', async () => {
    const onSend = jest.fn();
    const { getByText, getByPlaceholderText, asFragment } = render(
      <TranscriptBlock onSend={onSend} />
    );
    expect(getByText('Yes')).toBeInTheDocument();

    fireEvent.click(getByText('Yes').parentElement);
    expect(getByText('Send Message')).toBeInTheDocument();
    expect(asFragment()).toMatchSnapshot();

    fireEvent.change(getByPlaceholderText('name'), {
      target: { value: 'John Doe' }
    });
    fireEvent.change(getByPlaceholderText('email'), {
      target: { value: 'john.doe@deskpro.com' }
    });
    fireEvent.click(getByText('Send Message').parentElement);
    expect(onSend).toBeCalledWith({
      type: 'chat.transcript',
      origin: 'user',
      name: 'John Doe',
      email: 'john.doe@deskpro.com'
    });
    expect(getByText('Your transcript is on it’s way to:')).toBeInTheDocument();
  });

  it('should send user data without form submittion', () => {
    const onSend = jest.fn();
    const user = {
      name: 'John Doe',
      email: 'john.doe@deskpro.com'
    };
    const { getByText, asFragment } = render(
      <TranscriptBlock onSend={onSend} user={user} />
    );
    expect(getByText('Yes')).toBeInTheDocument();
    fireEvent.click(getByText('Yes').parentElement);
    expect(onSend).toBeCalledWith({
      type: 'chat.transcript',
      origin: 'user',
      name: 'John Doe',
      email: 'john.doe@deskpro.com'
    });
    expect(getByText('Your transcript is on it’s way to:')).toBeInTheDocument();
    expect(asFragment()).toMatchSnapshot();
  });

  it('should not send message for no button', () => {
    const onSend = jest.fn();
    const { getByText, queryByText, container } = render(
      <TranscriptBlock onSend={onSend} />
    );
    expect(getByText('No')).toBeInTheDocument();
    fireEvent.click(getByText('No').parentElement);
    expect(container.firstChild).toBeNull();
    expect(onSend).not.toBeCalled();
    expect(queryByText('Send Message')).toBeNull();
    expect(queryByText('Your transcript is on it’s way to:')).toBeNull();
  });
});
