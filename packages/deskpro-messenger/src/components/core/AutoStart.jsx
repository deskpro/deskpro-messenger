import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import { injectIntl } from 'react-intl';

import AutoStartShell from "./AutoStartShell";
import Block from "./Block";
import AvatarHeads from "../ui/AvatarHeads";
import { getAgentsAvailable } from "../../modules/info";
import Button from "../form/Button";
import TextAvatar from '../chat/TextAvatar';

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
    icon:            PropTypes.string,
  };

  static defaultProps = {
    icon: ''
  }

  constructor(props) {
    super(props);
    this.state = {
      message: ''
    };
  }

  componentDidMount() {
    // eslint-disable-next-line no-unused-expressions
    import('../../screens/ChatScreen');
    // eslint-disable-next-line no-unused-expressions
    import('../../screens/StartChatScreen');
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
    const { agentsAvailable, startChat, intl } = this.props;

    const agent = Object.values(agentsAvailable).pop();
    return (
      <button className='dpmsg-AutoStart-widget' onClick={() => startChat()}>
        <div className='dpmsg-AutoStart-widget-text'>
          {intl.formatMessage({ id: 'helpcenter.messenger.proactive_title' })}
        </div>

          {agent.avatar
            ? (
              <div className="dpmsg-AutoStart-widget-avatar" key={agent.id}>
                <img src={agent.avatar} alt={agent.name} />
              </div>
            )
            : <TextAvatar className="dpmsg-AvatarHeadText" height={47} width={47} name={agent.name} />
          }

      </button>
    )
  };

  render() {
    const { autoStartStyle, startChat, intl, icon } = this.props;


    if (autoStartStyle === 'avatar-widget') {
      return this.renderAvatarWidget();
    }
    return (
      <AutoStartShell
        icon={icon}
        controls={this.renderToolbar()}
        title={intl.formatMessage({ id: 'helpcenter.messenger.proactive_greeting' })}
      >
        <Block title={intl.formatMessage({ id: 'helpcenter.messenger.proactive_title' })}>
          {autoStartStyle.indexOf('avatar') !== -1 ? <AvatarHeads agentsAvailable={this.props.agentsAvailable}/> : null}
          {autoStartStyle.indexOf('text') !== -1 ?
            <div className="dpmsg-BlockText">
              {intl.formatMessage({ id: 'helpcenter.messenger.proactive_description' })}
            </div> : null}
          {autoStartStyle.indexOf('input') !== -1 ?
            <Input
              onClick={() => startChat(this.state.message)}
              width="full"
              color="primary"
              placeholder={intl.formatMessage({ id: 'helpcenter.messenger.proactive_placeholder' })}
              value={this.state.message}
              onChange={this.onInputChange}
            /> :
            <Button onClick={() => startChat(this.state.message)} width="full" color="primary">
              {intl.formatMessage({ id: 'helpcenter.messenger.proactive_button' })}
            </Button>
          }
        </Block>
      </AutoStartShell>
    );
  }
}

export default injectIntl(
  connect((state) => ({ agentsAvailable: getAgentsAvailable(state) }))(AutoStart)
);
