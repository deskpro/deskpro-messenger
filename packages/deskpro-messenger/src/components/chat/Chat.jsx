import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

import MessageBubble from './MessageBubble';
import SystemMessage from './SystemMessage';
import TypingMessage from './TypingMessage';
import TranscriptBlock from './TranscriptBlock';
import RatingBlock from './RatingBlock';
import ChatEndBlock from './ChatEndBlock';
import SaveTicketBlock from './SaveTicketBlock';
import CreateTicketBlock from './CreateTicketBlock';
import { withScreenContentSize } from '../core/ScreenContent';
import { withFrameContext } from '../core/Frame';
import BotBubble from './BotBubble';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { isMessageFormFocused } from '../../modules/app';
import { endBlockShown } from '../../modules/chat';

const transMessages = {
  agentAssigned: {
    id: 'helpcenter.messenger.chat_agent_assigned_message',
    defaultMessage: `{name} joined the conversation.`
  },
  userLeft: {
    id: 'helpcenter.messenger.message_user_left',
    defaultMessage: `{name} left the conversation.`
  },
  noAgentOnline: {
    id: 'helpcenter.messenger.chat_no_agent_online',
    defaultMessage: 'Sorry, no one is online to accept your chat.'
  },
  chatEnded: {
    id: 'helpcenter.messenger.chat_ended',
    defaultMessage: 'Chat ended'
  }
};

const createTrans = ({ message, ...data }, type) => {
  if (typeof message === 'object' && message.phrase_id) {
    switch (message.phrase_id) {
      case 'message_user-left':
        return [{ id: `helpcenter.messenger.message_user_left` }, message]
      case 'message_user-joined':
        return [{ id: `helpcenter.messenger.message_user_joined` }, message]
      case 'message_ended-by':
        return [{ id: `helpcenter.messenger.message_ended_by` }, message]
      case 'message_ended-by-user':
        return [{ id: `helpcenter.messenger.message_ended_by_user` }, message]
      case 'message_assigned':
        return [{ id: `helpcenter.messenger.message_assigned` }, message]
      case 'message_unassigned':
        return [{ id: `helpcenter.messenger.message_unassigned` }, message]
      default:
        return [{ id: `helpcenter.messenger.${message.phrase_id}` }, message];
    }

  } else if (type in transMessages) {
    return [transMessages[type], data];
  }
  return [];
};

class Chat extends React.Component {
  static propTypes = {
    messages: PropTypes.array,
    onSendMessage: PropTypes.func.isRequired,
    onEndChat: PropTypes.func.isRequired,
    onCancelEndChat: PropTypes.func.isRequired,
    typing: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
    agent: PropTypes.object,
    user: PropTypes.object,
    endChatBlock: PropTypes.bool.isRequired,
    chat: PropTypes.shape({
      id: PropTypes.number.isRequired,
      status: PropTypes.string.isRequired
    }),
    contentSize: PropTypes.shape({
      animating: PropTypes.bool,
      height: PropTypes.number,
      maxHeight: PropTypes.number
    }),
  };

  static defaultProps = {
    messages: [],
    agent: {},
    user: {},
    contentSize: {animating: false, height: undefined, maxHeight: undefined}
  };

  scrollArea = React.createRef();

  componentDidMount() {
    if (this.props.messages.length > 0 && this.props.contentSize.scrollArea.current) {
      this.scrollToBottom();
    }
  }

  componentDidUpdate(prevProps) {
    const changedSize =
            prevProps.contentSize.height < this.props.contentSize.height;
    const lastPrevChat = prevProps.messages[prevProps.messages.length - 1];
    const lastCurrentChat = this.props.messages[this.props.messages.length - 1];

    if (
      !this.props.contentSize.animating && (
        prevProps.contentSize.animating ||
        prevProps.messages.length !== this.props.messages.length ||
        (lastPrevChat && lastPrevChat.id !== lastCurrentChat.id) ||
        changedSize || prevProps.endChatBlock !== this.props.endChatBlock
      )
    ) {
      this.scrollToBottom();
    }
  }

  scrollToBottom() {

    const { contentSize: { scrollArea, height }} = this.props;

    setTimeout(() => {
      if (scrollArea.current) {
        scrollArea.current.setState(
          {
            containerHeight: scrollArea.current.wrapper.offsetHeight,
            realHeight: height
          },
          () => {
            setTimeout(() => scrollArea.current.scrollBottom(), 50);

          }
        );
      }
    }, 50);
  }

  render() {
    const {
      typing,
      messages,
      onSendMessage,
      onEndChat,
      onCancelEndChat,
      intl,
      agent,
      user,
      chat,
      chatConfig,
      endChatBlock,
      history
    } = this.props;

    return (
        <Fragment>
          <BotBubble message={intl.formatMessage({id: 'helpcenter.messenger.chat_prompt'})} />
          {messages
            .filter(m => m.id || m.type !== 'chat.typing.start')
            .map((message, index) => {
              const key = message.uuid || `${message.type}-${index}`;
              switch (message.type) {
                case 'chat.message':
                  return <MessageBubble key={key} {...message} prev={messages[index-1]}/>;
                case 'chat.agentAssigned':
                case 'chat.agentUnassigned':
                  return <SystemMessage
                    key={key}
                    {...message}
                    message={intl.formatMessage(...createTrans(message, 'agentAssigned'))}
                  />;
                case 'chat.ended':
                case 'chat.userTimeout':
                case 'chat.waitTimeout':
                  return (
                    <Fragment key={key}>
                      <SystemMessage
                        {...message}
                        message={intl.formatMessage(...createTrans(message, 'chatEnded'))}
                      />
                      {chat.assigned &&
                      <Fragment key={`${key}_end`}>
                        <TranscriptBlock onSend={onSendMessage} user={user} />
                        <RatingBlock
                          onSend={onSendMessage}
                          user={user}
                          agent={agent}
                        />
                      </Fragment>
                      }
                    </Fragment>
                  );
                case 'chat.noAgents':
                  return (
                    <div key={`no_agents_${message.uuid}`}>
                      <BotBubble
                        message={intl.formatMessage(...createTrans(message, 'noAgentOnline'))}
                      />
                      {chatConfig.noAnswerBehavior === 'save_ticket' && (
                        <SaveTicketBlock
                          user={user}
                          uploadTo={chatConfig.uploadTo}
                          ticketParams={chatConfig.ticketDefaults}
                          formConfig={chatConfig.ticketFormConfig}
                          onSend={onSendMessage}
                          endChat={onEndChat}
                          history={history}
                        />
                      )}
                      {chatConfig.noAnswerBehavior === 'create_ticket' && (
                        <CreateTicketBlock chat={chat}/>
                      )}
                    </div>
                  );
                case 'chat.userJoined':
                case 'chat.userLeft':
                  return (
                    <SystemMessage
                      key={key}
                      {...message}
                      message={intl.formatMessage(...createTrans(message))}
                    />
                  );
                default: {
                  if (
                    message.origin === 'system' &&
                    message.message &&
                    message.message.phrase_id
                  ) {
                    return (
                      <BotBubble
                        key={key}
                        message={intl.formatMessage(...createTrans(message))}
                      />
                    );
                  }
                  return null;
                }
              }
          })}
          {!!typing && <TypingMessage value={typing} />}
          {!!chat && chat.status !== 'ended' && endChatBlock && (
            <ChatEndBlock onCancelEnd={onCancelEndChat} onEnd={onEndChat} />
          )}
      </Fragment>
    );
  }
}

export default compose(
  injectIntl,
  withFrameContext,
  withScreenContentSize,
  connect(
    (state) => ({ formFocused: isMessageFormFocused(state), endChatBlock: endBlockShown(state) })
  )
)(Chat);



