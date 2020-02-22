import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { injectIntl } from 'react-intl';

import Block from '../components/core/Block';
import QuickSearchBlock from '../components/search/QuickSearchBlock';
import Button from '../components/form/Button';
import { connect } from 'react-redux';
import { getAgentsAvailable, canUseChat } from '../modules/info';
import { getActiveChat } from '../modules/chat';
import AvatarHeads from '../components/ui/AvatarHeads';
import ScrollArea from 'react-scrollbar/dist/no-css';
import { Footer } from '../components/core/Footer';

const transMessages = {
  startChatTitle: {
    id: 'blocks.start_chat.title',
    defaultMessage: 'Chat with us'
  },
  startChatDescription: {
    id: 'blocks.start_chat.description',
    defaultMessage: 'Need help? Just reply to start a live conversation with one of our team'
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
      description = props.description || intl.formatMessage(transMessages.startChatDescription);
    }
    return (
      <Block title={title}>
        {props.showAgentPhotos && !activeChat ? <AvatarHeads agentsAvailable={props.agentsAvailable} /> : null}
        {!activeChat &&
          <div className="dpmsg-BlockText">
            {description}
          </div>
        }
        <Button to={`/screens/${to}`} width="full" color="primary">
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
      <Link title={props.description || ''} to={`/screens/${to}`} className="dpmsg-Button Button-FullWidth Button--primary">
        {intl.formatMessage({ id: label, defaultMessage: label })}
      </Link>
    </Block>
  )),
  ButtonLink: injectIntl(({ to, intl, label, blockTitle, description, ...props }) => (
    <Block title={intl.formatMessage({ id: blockTitle, defaultMessage: blockTitle })}>
      {description &&
        <div className="dpmsg-BlockText">
          {description}
        </div>
      }
      <Button  title={props.description || ''} to={`/screens/${to}`} width="full" color="primary">
        {intl.formatMessage({ id: label, defaultMessage: label })}
      </Button>
    </Block>
  ))
};

const Blocks = ({ blocks, agentsAvailable, activeChat, chatAvailable }) => (
  <ScrollArea
    stopScrollPropagation={true}
    horizontal={false}
    style={{ height: '100%' }}
  >
    {blocks.sort((blockA, blockB) => blockA.order - blockB.order).map(({ blockType, ...props }, index) => {
      if(blockType === 'StartChatBlock') {
        if (!Object.keys(agentsAvailable).length || !chatAvailable) {
          return null;
        }
        if (activeChat) {
          props.to = `active-chat/${activeChat}`;
          props.activeChat = activeChat;
        }
        props.agentsAvailable = agentsAvailable;
      }
      const Component = blocksMapping[blockType];
      return Component ? (
        <Component key={blockType + index} {...props} />
      ) : null;
    })}
    <Footer />
  </ScrollArea>
);

const mapStateToProps = (state) => ({
  agentsAvailable: getAgentsAvailable(state),
  activeChat:      getActiveChat(state),
  chatAvailable:   canUseChat(state)
});

export default connect(mapStateToProps)(Blocks);
