import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import ScrollArea from 'react-scrollbar/dist/no-css';

import MessageBubble from './MessageBubble';
import SystemMessage from './SystemMessage';
import MessageForm from './MessageForm';
import TypingMessage from './TypingMessage';
import TranscriptBlock from './TranscriptBlock';
import RatingBlock from './RatingBlock';
import ChatEndBlock from './ChatEndBlock';
import SaveTicketBlock from './SaveTicketBlock';
import CreateTicketBlock from './CreateTicketBlock';
import { withScreenContentSize } from '../core/ScreenContent';
import { withFrameContext } from '../core/Frame';
import BotBubble from './BotBubble';

const transMessages = {
  agentAssigned: {
    id: 'chat.agent_assigned.message',
    defaultMessage: `{name} joined the conversation.`
  },
  agentUnassigned: {
    id: 'chat.agent_unassigned.message',
    defaultMessage: `{name} left the conversation.`
  },
  noAgentOnline: {
    id: 'chat.no_agent_online',
    defaultMessage: 'Sorry, no one is online to accept your chat.'
  },
  chatEnded: {
    id: 'chat.ended',
    defaultMessage: 'Chat ended'
  }
};

const createTrans = ({ message, ...data }, type) => {
  if (typeof message === 'object' && message.phrase_id) {
    return [{ id: message.phrase_id }, message];
  } else if (type in transMessages) {
    return [transMessages[type], data];
  }
  return [];
};

class Chat extends PureComponent {
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
      height: PropTypes.number,
      maxHeight: PropTypes.number
    })
  };

  scrollArea = React.createRef();

  componentDidMount() {
    if (this.props.messages.length > 0 && this.scrollArea.current) {
      this.scrollToBottom();
    }
  }

  componentDidUpdate(prevProps) {
    const changedSize =
      prevProps.contentSize.height < this.props.contentSize.height;
    const lastPrevChat = prevProps.messages[prevProps.messages.length-1];
    const lastCurrentChat = this.props.messages[this.props.messages.length-1];
    if (
      prevProps.messages.length !== this.props.messages.length ||
      (lastPrevChat && lastPrevChat.id !== lastCurrentChat.id) ||
      changedSize || prevProps.endChatBlock !== this.props.endChatBlock
    ) {
      this.scrollToBottom();
    }
  }

  scrollToBottom() {
    this.scrollArea.current.setSizesToState();
    setTimeout(() => {
      if (this.scrollArea.current) {
        this.scrollArea.current.scrollBottom();
      }
    }, 10);
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
      contentSize: { height, maxHeight },
      frameContext
    } = this.props;

    return (
      <div
        className="dpmsg-ChatMessagesWrapper"
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: height >= maxHeight ? maxHeight - 110 : undefined
        }}
      >
        <ScrollArea
          horizontal={false}
          style={{
            flexBasis: 0,
            flexGrow: 1,
            overflow: height >= maxHeight ? 'hidden' : undefined,
            minHeight: height >= maxHeight ? '1px' : undefined
          }}
          ref={this.scrollArea}
          stopScrollPropagation={true}
          contentWindow={frameContext.window}
          ownerDocument={frameContext.document}
        >
          {!!chatConfig.prompt && (
            <BotBubble message={chatConfig.prompt} />
          )}
          {messages
            .filter(m => m.id || m.type !== 'chat.typing.start')
            .map((message, index) => {
              const key = message.uuid || `${message.type}-${index}`;
              switch (message.type) {
                case 'chat.message':
                  return <MessageBubble key={key} {...message} prev={messages[index-1]}/>;
                case 'chat.agentAssigned':
                case 'chat.agentUnassigned':
                  return null;
                case 'chat.ended':
                case 'chat.userTimeout':
                case 'chat.waitTimeout':
                  return chat.assigned && (
                    <Fragment key={key}>
                      <SystemMessage
                        {...message}
                        message={intl.formatMessage(
                          ...createTrans(message, 'chatEnded')
                        )}
                      />
                      <TranscriptBlock onSend={onSendMessage} user={user} />
                      <RatingBlock
                        onSend={onSendMessage}
                        user={user}
                        agent={agent}
                      />
                    </Fragment>
                  );
                case 'chat.noAgents':
                  return (
                    <div key={`no_agents_${message.uuid}`}>
                      <BotBubble
                        message={
                          chatConfig.busyMessage ||
                          intl.formatMessage(
                            ...createTrans(message, 'noAgentOnline')
                          )
                        }
                      />
                      {chatConfig.noAnswerBehavior === 'save_ticket' && (
                        <SaveTicketBlock
                          user={user}
                          uploadTo={chatConfig.uploadTo}
                          ticketParams={chatConfig.ticketDefaults}
                          formConfig={chatConfig.ticketFormConfig}
                          onSend={onSendMessage}
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
        </ScrollArea>
        {!!chat && chat.status !== 'ended' && (
          <MessageForm onSend={onSendMessage} style={{ flex: '0 0 auto' }} />
        )}
      </div>
    );
  }
}

export default injectIntl(withFrameContext(withScreenContentSize(Chat)));
