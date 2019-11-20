import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { injectIntl } from 'react-intl';

import Block from '../components/core/Block';
import Button from '../components/form/Button';
import { connect } from 'react-redux';
import { hasAgentsAvailable } from '../modules/info';

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
    <Block title={props.title || intl.formatMessage(transMessages.startChatTitle)}>
      <Button to={`/screens/${to}`} width="full" color="primary">
        {intl.formatMessage(
          linkText
            ? { id: linkText, defaultMessage: linkText }
            : transMessages.startChatLink,
          props
        )}
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
  ScreenLink: injectIntl(({ to, intl, label, blockTitle }) => (
    <Block
      title={intl.formatMessage({ id: blockTitle, defaultMessage: blockTitle })}
    >
      <Link to={`/screens/${to}`}>
        {intl.formatMessage({ id: label, defaultMessage: label })}
      </Link>
    </Block>
  ))
};

const Blocks = ({ blocks, agentsAvailable }) => (
  <Fragment>
    {blocks.map(({ blockType, ...props }, index) => {
      if(blockType === 'StartChatBlock' && !agentsAvailable) {
        return null;
      }
      const Component = blocksMapping[blockType];
      return Component ? (
        <Component key={blockType + index} {...props} />
      ) : null;
    })}
  </Fragment>
);

export default connect((state) => ({ agentsAvailable: hasAgentsAvailable(state) }))(Blocks);
