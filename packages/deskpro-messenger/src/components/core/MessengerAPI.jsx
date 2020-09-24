import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { isWindowOpened, toggleWindow } from '../../modules/app';

window.parent.DeskProMessenger = window.parent.DeskProMessenger || {};
window.parent.DeskProMessenger.send = function(action, payload) {
  window.postMessage({ action, payload }, '*');
};

window.parent.DeskProMessenger.open = function(action, payload) {
  window.parent.DeskProMessenger.send('open', {screen: 'index'})
};

window.parent.DeskProMessenger.openChat = function(action, payload) {
  window.parent.DeskProMessenger.send('open', {screen: 'startChat'})
};

window.parent.DeskProMessenger.openNewTicket = function(action, payload) {
  window.parent.DeskProMessenger.send('open', {screen: 'newTicket'})
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

class MessengerAPI extends PureComponent {
  static propTypes = {
    history: PropTypes.shape({
      push: PropTypes.func.isRequired
    }).isRequired,
    location: PropTypes.shape({
      pathname: PropTypes.string.isRequired
    }).isRequired,
    opened: PropTypes.bool,
    toggleWindow: PropTypes.func.isRequired
  };

  handleMessage = (event) => {
    const { action, payload } = event.data;

    switch (action) {
      case 'open':
        let path;
        if ('screen' in payload) {
          path = `/screens/${payload.screen}`;
        }
        if (path) {
          this.props.history.push(path, { api: true, ...payload });
          !this.props.opened && this.props.toggleWindow();
        }
        break;

      case 'to':
        this.props.history.push(payload, { api: true });
        !this.props.opened && this.props.toggleWindow();
        break;

      default:
        break;
    }
  };

  componentDidMount() {
    window.addEventListener('message', this.handleMessage);
  }

  componentWillUnmount() {
    window.removeEventListener('message', this.handleMessage);
  }

  render() {
    return null;
  }
}

export default connect(
  (state) => ({ opened: isWindowOpened(state) }),
  { toggleWindow }
)(MessengerAPI);
