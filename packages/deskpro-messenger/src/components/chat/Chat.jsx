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
import SaveTicketBlock from './SaveTicketBlock';
import CreateTicketBlock from './CreateTicketBlock';
import { withScreenContentSize } from '../core/ScreenContent';

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
    typing: PropTypes.object,
    agent: PropTypes.object,
    user: PropTypes.object,
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
    if (this.props.messages.length && this.scrollArea.current) {
      this.scrollToBottom(true);
    }
  }

  componentDidUpdate(prevProps) {
    const changedSize =
      prevProps.contentSize.height !== this.props.contentSize.height;
    if (
      prevProps.messages.length !== this.props.messages.length ||
      changedSize
    ) {
      this.scrollToBottom(changedSize);
    }
  }

  scrollToBottom(refresh) {
    if (refresh && this.scrollArea.current) {
      this.scrollArea.current.setSizesToState();
    }
    setTimeout(() => {
      if (this.scrollArea.current) {
        this.scrollArea.current.scrollBottom();
      }
    }, 100);
  }

  render() {
    const {
      typing,
      messages,
      onSendMessage,
      onEndChat,
      intl,
      agent,
      user,
      chat,
      chatConfig,
      contentSize: { height, maxHeight }
    } = this.props;

    return (
      <div
        className="dpmsg-ChatMessagesWrapper"
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: height >= maxHeight ? maxHeight - 87 : undefined
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
        >
          {!!chatConfig.prompt && (
            <MessageBubble
              origin="system"
              message={intl.formatMessage({
                id: chatConfig.prompt,
                defaultMessage: chatConfig.prompt
              })}
            />
          )}
          {messages.map((message, index) => {
            const key = message.uuid || `${message.type}-${index}`;
            switch (message.type) {
              case 'chat.message':
                return <MessageBubble key={key} {...message} />;
              case 'chat.agentAssigned':
              case 'chat.agentUnassigned':
                return (
                  <SystemMessage
                    key={key}
                    {...message}
                    message={intl.formatMessage(
                      ...createTrans(message, message.type === 'chat.agentAssigned' ? 'agentAssigned' : 'agentUnassigned')
                    )}
                  />
                );
              case 'chat.ended':
                return (
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
                  <div>
                    <SystemMessage
                      {...message}
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
                        ticketParams={chatConfig.ticketDefaults}
                        formConfig={chatConfig.ticketFormConfig}
                        onSend={onSendMessage}
                      />
                    )}
                    {chatConfig.noAnswerBehavior === 'create_ticket' && (
                      <CreateTicketBlock />
                    )}
                  </div>
                );

              default: {
                if (
                  message.origin === 'system' &&
                  message.message &&
                  message.message.phrase_id
                ) {
                  return (
                    <SystemMessage
                      key={key}
                      {...message}
                      message={intl.formatMessage(...createTrans(message))}
                    />
                  );
                }
                return null;
              }
            }
          })}
          {!!typing && <TypingMessage value={typing} />}
        </ScrollArea>
        {!!chat && chat.status !== 'ended' && (
          <MessageForm onSend={onSendMessage} onEnd={onEndChat} style={{ flex: '0 0 auto' }} />
        )}
      </div>
    );
  }
}

export default injectIntl(withScreenContentSize(Chat));
