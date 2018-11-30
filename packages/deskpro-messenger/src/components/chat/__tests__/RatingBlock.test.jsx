import React from 'react';
import { render, fireEvent } from '../../../utils/tests';

import RatingBlock from '../RatingBlock';

describe('<RatingBlock />', () => {
  it('should render correctly', () => {
    const onSend = jest.fn();
    const { asFragment } = render(<RatingBlock onSend={onSend} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('should send message and update state on rating selection', () => {
    const onSend = jest.fn();
    const agent = { name: 'Jon Snow' };
    const { getByText, asFragment } = render(
      <RatingBlock onSend={onSend} agent={agent} />
    );
    expect(
      getByText('Rate your conversation with Jon Snow')
    ).toBeInTheDocument();
    fireEvent.click(getByText('Helpful'));
    expect(onSend).toBeCalledWith({
      type: 'chat.rating',
      origin: 'user',
      rate: true
    });
    expect(getByText('Thank you for your feedback')).toBeInTheDocument();
    expect(asFragment()).toMatchSnapshot();
  });
});
