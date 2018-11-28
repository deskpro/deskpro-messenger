import React from 'react';
import renderer from 'react-test-renderer';
import { render, fireEvent } from 'react-testing-library';

import { RatingBlock } from '../RatingBlock';

describe('<RatingBlock />', () => {
  const intl = {
    formatMessage: jest.fn(({ id }) => id)
  };

  it('should render correctly', () => {
    const onSend = jest.fn();
    const tree = renderer
      .create(<RatingBlock intl={intl} onSend={onSend} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should send message and update state on rating selection', () => {
    const onSend = jest.fn();
    const { getByText } = render(<RatingBlock intl={intl} onSend={onSend} />);
    expect(getByText('chat.rating_block.question_header')).toBeInTheDocument();
    fireEvent.click(getByText('chat.rating_block.buttons.helpful'));
    expect(onSend).toBeCalledWith({
      type: 'chat.rating',
      origin: 'user',
      rate: true
    });
    expect(getByText('chat.rating_block.thank_you_header')).toBeInTheDocument();
  });
});
