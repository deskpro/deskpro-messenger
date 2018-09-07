import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { injectIntl } from 'react-intl';

import Block from '../components/core/Block';
import Button from '../components/form/Button';

const transMessages = {
  startChatTitle: {
    id: 'blocks.start_chat.title',
    defaultMessage: 'Conversations'
  },
  startChatLink: {
    id: 'blocks.start_chat.link',
    defaultMessage: 'Start Chat'
  },
  ticketsTitle: {
    id: 'blocks.tickets.title',
    defaultMessage: 'Your Tickets'
  },
  ticketsViewAllLink: {
    id: 'blocks.tickets.view_all_link',
    defaultMessage: 'view all'
  }
};

const blocksMapping = {
  StartChatBlock: injectIntl(({ to, intl, linkText, ...props }) => (
    <Block title={intl.formatMessage(transMessages.startChatTitle)}>
      <Button to={`/screens/${to}`} width="full" color="primary">
        {linkText || intl.formatMessage(transMessages.startChatLink, props)}
      </Button>
    </Block>
  )),
  TicketsBlock: injectIntl(({ intl }) => (
    <Block title={intl.formatMessage(transMessages.ticketsTitle)}>
      <Link to="/screens/tickets">
        {intl.formatMessage(transMessages.ticketsViewAllLink)}
      </Link>
    </Block>
  )),
  ScreenLink: ({ to, label, blockTitle }) => (
    <Block title={blockTitle}>
      <Link to={`/screens/${to}`}>{label}</Link>
    </Block>
  )
};

const Blocks = ({ blocks }) => (
  <Fragment>
    {blocks.map(({ blockType, ...props }, index) => {
      const Component = blocksMapping[blockType];
      return Component ? (
        <Component key={blockType + index} {...props} />
      ) : null;
    })}
  </Fragment>
);

export default Blocks;
