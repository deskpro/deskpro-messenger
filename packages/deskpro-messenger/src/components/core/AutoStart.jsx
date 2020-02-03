import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import { injectIntl } from 'react-intl';

import MessengerShell from "./MessengerShell";
import Block from "./Block";
import AvatarHeads from "../ui/AvatarHeads";
import { getAgentsAvailable } from "../../modules/info";
import Button from "../form/Button";

class Input extends PureComponent {

  static propTypes = {
    placeholder: PropTypes.string.isRequired,
    value:       PropTypes.string.isRequired,
    onClick:     PropTypes.func.isRequired,
    onChange:    PropTypes.func.isRequired
  };

  handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      this.props.onClick();
    }
  };

  render() {
    const { placeholder, value, onClick, onChange } = this.props;
    return (
      <div className='dpmsg-AutoStart-input'>
        <input type='text' placeholder={placeholder} onKeyDown={this.handleKeyDown} onChange={onChange} value={value}/>
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

  constructor(props) {
    super(props);
    this.state = {
      message: ''
    };
  }


  onInputChange = (e) => {
    this.setState({ message: e.target.value });
  };

  renderToolbar = () => {
    return (
      <button className='dpmsg-AutoStart-close' onClick={this.props.onClose}/>
    )
  };

  renderAvatarWidget() {
    const { agentsAvailable, startChat, screens } = this.props;

    const agent = Object.values(agentsAvailable).pop();
    const proactiveSettings = screens.proactive;
    return (
      <button className='dpmsg-AutoStart-widget' onClick={startChat}>
        <div className='dpmsg-AutoStart-widget-text'>
          {proactiveSettings.title}
        </div>
        <div className="dpmsg-AutoStart-widget-avatar" key={agent.id}>
          <img src={agent.avatar} alt=""/>
        </div>
      </button>
    )
  };

  render() {
    const { autoStartStyle, startChat, screens } = this.props;

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
            <Input
              onClick={() => startChat(this.state.message)}
              width="full"
              color="primary"
              placeholder={proactiveSettings.inputPlaceholder}
              value={this.state.message}
              onChange={this.onInputChange}
            /> :
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
