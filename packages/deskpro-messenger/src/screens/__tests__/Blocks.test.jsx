import React from 'react';
import { render } from '../../utils/tests';

import Blocks from '../Blocks';

const blocks = [
  {
    blockType: 'StartChatBlock',
    linkText: 'Start new chat',
    to: 'startChat'
  },
  {
    blockType: 'TicketsBlock'
  },
  {
    blockType: 'ScreenLink',
    blockTitle: 'tickets.create_form_block.header',
    label: 'tickets.create_form_block.link_label',
    to: 'newTicket'
  }
];

describe('<Blocks />', () => {
  it('should render correctly', () => {
    const { getByText, asFragment } = render(<Blocks blocks={blocks} />);
    expect(asFragment()).toMatchSnapshot();
    expect(getByText('Conversations')).toBeInTheDocument();
    expect(getByText('Start new chat')).toBeInTheDocument();
    expect(getByText('Your Tickets')).toBeInTheDocument();
    expect(getByText('tickets.create_form_block.header')).toBeInTheDocument();
    expect(
      getByText('tickets.create_form_block.link_label')
    ).toBeInTheDocument();
  });
});
