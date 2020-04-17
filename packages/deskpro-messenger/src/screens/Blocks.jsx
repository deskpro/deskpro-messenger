import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { injectIntl } from 'react-intl';

import Block from '../components/core/Block';
import QuickSearchBlock from '../components/search/QuickSearchBlock';
import Button from '../components/form/Button';
import { connect } from 'react-redux';
import { canUseChat, getAgentsAvailable } from '../modules/info';
import { getActiveChat, getChatData } from '../modules/chat';
import AvatarHeads from '../components/ui/AvatarHeads';
import Header from '../components/ui/Header';

const transMessages = {
  startChatTitle: {
    id: 'blocks.start-chat.title',
    defaultMessage: 'Start a conversation'
  },
  startChatDescription: {
    id: 'blocks.start-chat.description',
    defaultMessage: 'Start a chat with one of our agents'
  },
  startChatButton: {
    id: 'blocks.start-chat.button',
    defaultMessage: 'Start a new conversation'
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
      link = intl.formatMessage(transMessages.startChatButton, props);
      title = intl.formatMessage(transMessages.startChatTitle);
      description = intl.formatMessage(transMessages.startChatDescription);
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
    <QuickSearchBlock title='Knowledgebase' />
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
      title={blockTitle}
    >
      <Link title={props.description || ''} to={`/screens/${to}`} className="dpmsg-Button Button-FullWidth Button--primary">
        {label}
      </Link>
    </Block>
  )),
  ButtonLink: injectIntl(({ to, intl, label, blockTitle, description, ...props }) => (
    <Block title={intl.formatMessage({id: blockTitle})}>
      {description &&
        <div className="dpmsg-BlockText">
          {intl.formatMessage({id: description})}
        </div>
      }
      <Button  title={intl.formatMessage({id: description}) || ''} to={`/screens/${to}`} width="full" color="primary">
        {intl.formatMessage({id: label})}
      </Button>
    </Block>
  ))
};

class Blocks extends React.PureComponent {
  render() {
    const { blocks, agentsAvailable, activeChat, chatData, chatAvailable } = this.props;

    return (<Fragment>
      <Header />
      {blocks.sort((blockA, blockB) => blockA.order - blockB.order).map(({ blockType, ...props }, index) => {
        if(blockType === 'StartChatBlock') {
          if (!Object.keys(agentsAvailable).length || !chatAvailable) {
            return null;
          }
          if (activeChat && chatData && chatData.status !== 'ended') {
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
    </Fragment>);
  }
}

const mapStateToProps = (state) => ({
  agentsAvailable: getAgentsAvailable(state),
  activeChat:      getActiveChat(state),
  chatData:        getChatData(state),
  chatAvailable:   canUseChat(state)
});

export default connect(mapStateToProps)(Blocks);
