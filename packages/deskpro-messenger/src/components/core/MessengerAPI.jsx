import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { isWindowOpened, toggleWindow, updateJwtToken } from '../../modules/app';
import { hasAgentsAvailable, canUseChat, canUseTickets } from '../../modules/info';
import { logout } from '../../modules/guest';

window.parent.DeskProMessenger = window.parent.DeskProMessenger || {};
window.parent.DeskProMessenger.send = function(action, payload) {
  window.postMessage({ action, payload }, '*');
};

window.parent.DeskProMessenger.toggle = function() {
  window.parent.DeskProMessenger.send('toggle')
};

window.parent.DeskProMessenger.open = function() {
  window.parent.DeskProMessenger.send('open', {screen: 'index'})
};

window.parent.DeskProMessenger.openChat = function() {
  if (window.parent.DeskProMessenger.canUseChat() && window.parent.DeskProMessenger.isOnline()) {
    window.parent.DeskProMessenger.send('open', {screen: 'startChat'});
  } else if (window.parent.DeskProMessenger.canUseTickets()) {
    window.parent.DeskProMessenger.send('open', {screen: 'newTicket'}); // failover
  } else {
    console.error('Neither chat nor ticket form is available!'); // something really went wrong
  }
};

window.parent.DeskProMessenger.openNewTicket = function() {
  if (window.parent.DeskProMessenger.canUseTickets()) {
    window.parent.DeskProMessenger.send('open', {screen: 'newTicket'});
  } else {
    console.error('The ticket form is not available!');
  }
};

window.parent.DeskProMessenger.updateJwtToken = function(token) {
  window.parent.DeskProMessenger.send('updateJwtToken', { token })
};

window.parent.DeskProMessenger.logout = function() {
  window.parent.DeskProMessenger.send('logout')
};

window.parent.addEventListener('DeskProMessenger.loaded', () => {
  const openElements = window.parent.document.getElementsByClassName('dpwidget-open');
  for(let i =0; i < openElements.length; i++) {
    openElements[i].onclick = () => {
      window.parent.DeskProMessenger.open();
    };
  }

  const openChatElements = window.parent.document.getElementsByClassName('dp-chat-trigger');
  for(let i =0; i < openChatElements.length; i++) {
    openChatElements[i].onclick = () => {
      window.parent.DeskProMessenger.openChat();
    };
  }
});
window.parent.DeskproMessenger = window.parent.DeskProMessenger;

class MessengerAPI extends PureComponent {
  static propTypes = {
    history: PropTypes.shape({
      push: PropTypes.func.isRequired
    }).isRequired,
    location: PropTypes.shape({
      pathname: PropTypes.string.isRequired
    }).isRequired,
    opened: PropTypes.bool.isRequired,
    isChatOnline: PropTypes.bool.isRequired,
    canUseChat: PropTypes.bool.isRequired,
    canUseTickets: PropTypes.bool.isRequired,
    toggleWindow: PropTypes.func.isRequired,
    updateJwtToken: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired
  };

  handleMessage = (event) => {
    const { action, payload } = event.data;

    switch (action) {
      case 'open': {
        let path;
        if ('screen' in payload) {
          path = `/screens/${payload.screen}`;
        }
        if (path) {
          this.props.history.push(path, { api: true, ...payload });
          !this.props.opened && this.props.toggleWindow();
        }
        break;
      }
      case 'to':
        this.props.history.push(payload, { api: true });
        !this.props.opened && this.props.toggleWindow();
        break;

      case 'toggle':
        this.props.toggleWindow();
        break;

      case 'updateJwtToken':
        this.props.updateJwtToken(payload.token);
        break;

      case 'logout':
        this.props.updateJwtToken('');
        this.props.logout();
        break;

      default:
        break;
    }
  };

  isChatOnline = () => {
    return this.props.isChatOnline;
  }

  canUseChat = () => {
    return this.props.canUseChat;
  }

  canUseTickets = () => {
    return this.props.canUseTickets;
  }

  componentDidMount() {
    window.addEventListener('message', this.handleMessage);
    // online status can change over time
    window.parent.DeskProMessenger.isOnline = this.isChatOnline;
    // it's better to use getters instead of giving direct access to the properties
    window.parent.DeskProMessenger.canUseChat = this.canUseChat;
    window.parent.DeskProMessenger.canUseTickets = this.canUseTickets;
  }

  componentWillUnmount() {
    window.removeEventListener('message', this.handleMessage);
  }

  render() {
    return null;
  }
}

export default connect(
  (state) => ({
    opened: isWindowOpened(state),
    isChatOnline: hasAgentsAvailable(state),
    canUseChat: canUseChat(state),
    canUseTickets: canUseTickets(state)
  }),
  { toggleWindow, updateJwtToken, logout }
)(MessengerAPI);
