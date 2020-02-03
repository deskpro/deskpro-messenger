import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import { injectIntl } from 'react-intl';

import MessengerShell from "./MessengerShell";
import Block from "./Block";
import AvatarHeads from "../ui/AvatarHeads";
import { getAgentsAvailable } from "../../modules/info";
import Button from "../form/Button";

const transMessages = {
  title:                     {
    id:             'app.title',
    defaultMessage: 'Get in Touch'
  },
  startChatTitle:            {
    id:             'blocks.start_chat.title',
    defaultMessage: 'Chat with us'
  },
  startChatDescription:      {
    id:             'blocks.start_chat.description',
    defaultMessage: 'Need help? Just reply to start a live conversation with one of our team'
  },
  startChatLink:             {
    id:             'blocks.start_chat.link_text',
    defaultMessage: 'Start Chat'
  },
  startChatInputPlaceholder: {
    id:             'blocks.start_chat.input_placeholder',
    defaultMessage: 'Type your message here'
  },
};

class Input extends PureComponent {
  render() {
    const { placeholder, onClick } = this.props;
    return (
      <div className='dpmsg-AutoStart-input'>
        <input type='text' placeholder={placeholder}/>
        <button onClick={onClick}/>
      </div>
    )
  }
}

class AutoStart extends PureComponent {

  static propTypes = {
    onClose:         PropTypes.func.isRequired,
    agentsAvailable: PropTypes.object.isRequired,
    startChat:       PropTypes.func.isRequired,
    autoStartStyle:  PropTypes.string.isRequired,
  };

  renderToolbar = () => {
    return (
      <button className='dpmsg-AutoStart-close' onClick={this.props.onClose}/>
    )
  };

  renderAvatarWidget() {
    const { intl, agentsAvailable, startChat } = this.props;

    const agent = Object.values(agentsAvailable).pop();
    const title = intl.formatMessage(transMessages.startChatTitle);
    return (
      <button className='dpmsg-AutoStart-widget' onClick={startChat}>
        <div className='dpmsg-AutoStart-widget-text'>
          {title}
        </div>
        <div className="dpmsg-AutoStart-widget-avatar" key={agent.id}>
          <img src={agent.avatar} alt=""/>
        </div>
      </button>
    )
  };

  render() {
    const { intl, autoStartStyle, startChat, screens } = this.props;

    const proactiveSettings = screens.proactive;
    if (autoStartStyle === 'avatar-widget') {
      return this.renderAvatarWidget();
    }
    return (
      <MessengerShell
        controls={this.renderToolbar()}
        title={proactiveSettings.greetingTitle}
      >
        <Block title={proactiveSettings.title}>
          {autoStartStyle.indexOf('avatar') !== -1 ? <AvatarHeads agentsAvailable={this.props.agentsAvailable}/> : null}
          <div className="dpmsg-BlockText">
            {proactiveSettings.description}
          </div>
          {autoStartStyle.indexOf('input') !== -1 ?
            <Input onClick={startChat} width="full" color="primary" placeholder={proactiveSettings.inputPlaceholder}/> :
            <Button onClick={startChat} width="full" color="primary">
              {proactiveSettings.buttonText}
            </Button>
          }
        </Block>
      </MessengerShell>
    );
  }
}

export default injectIntl(
  connect((state) => ({ agentsAvailable: getAgentsAvailable(state) }))(AutoStart)
);
