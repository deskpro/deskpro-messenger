import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { injectIntl } from 'react-intl';

import Block from '../components/core/Block';
import QuickSearchBlock from '../components/search/QuickSearchBlock';
import Button from '../components/form/Button';
import { connect } from 'react-redux';
import { hasAgentsAvailable } from '../modules/info';
import { getActiveChat } from '../modules/chat';

const transMessages = {
  startChatTitle: {
    id: 'blocks.start_chat.title',
    defaultMessage: 'Conversations'
  },
  startChatLink: {
    id: 'blocks.start_chat.link',
    defaultMessage: 'Start Chat'
  },
  continueChatTitle: {
    id: 'blocks.continue_chat.title',
    defaultMessage: 'Continue existing chat'
  },
  continueChatLink: {
    id: 'blocks.continue_chat.link',
    defaultMessage: 'Continue'
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
  StartChatBlock: injectIntl(({ to, intl, linkText, activeChat, ...props }) => {
    let title = '';
    let link = '';
    let description = '';
    if(activeChat) {
      link = intl.formatMessage(transMessages.continueChatLink, props);
      title = description = intl.formatMessage(transMessages.continueChatTitle, props);
    } else {
      link = intl.formatMessage(linkText ? { id: linkText, defaultMessage: linkText } : transMessages.startChatLink, props);
      title = props.title || intl.formatMessage(transMessages.startChatTitle);
      description = props.description || intl.formatMessage(transMessages.startChatTitle);
    }
    return (
      <Block title={title}>
        <Button title={description} to={`/screens/${to}`} width="full" color="primary">
          {link}
        </Button>
      </Block>
    )
  }),
  QuickSearchBlock: injectIntl(({ intl }) => (
    <QuickSearchBlock title='Quick Search' />
  )),
  TicketsBlock: injectIntl(({ intl, ...props }) => (
    <Block title={intl.formatMessage(transMessages.ticketsTitle)}>
      <Link title='Browse your tickets' to="/screens/tickets">
        {intl.formatMessage(transMessages.ticketsViewAllLink)}
      </Link>
    </Block>
  )),
  ScreenLink: injectIntl(({ to, intl, label, blockTitle, ...props }) => (
    <Block
      title={intl.formatMessage({ id: blockTitle, defaultMessage: blockTitle })}
    >
      <Link title={props.description || ''} to={`/screens/${to}`}>
        {intl.formatMessage({ id: label, defaultMessage: label })}
      </Link>
    </Block>
  ))
};

const Blocks = ({ blocks, agentsAvailable, activeChat }) => (
  <Fragment>
    {blocks.map(({ blockType, ...props }, index) => {
      if(blockType === 'StartChatBlock' && !agentsAvailable) {
        return null;
      }
      if(blockType === 'StartChatBlock' && activeChat) {
        props.to = `active-chat/${activeChat}`;
        props.activeChat = activeChat;
      }
      const Component = blocksMapping[blockType];
      return Component ? (
        <Component key={blockType + index} {...props} />
      ) : null;
    })}
  </Fragment>
);

export default connect((state) => ({ agentsAvailable: hasAgentsAvailable(state), activeChat: getActiveChat(state) }))(Blocks);
