import { PureComponent } from 'react';
import PropTypes from 'prop-types';

window.parent.DeskProMessenger = window.parent.DeskProMessenger || {};
window.parent.DeskProMessenger.send = function(action, payload) {
  window.postMessage({ action, payload }, '*');
};

class MessengerAPI extends PureComponent {
  static propTypes = {
    history: PropTypes.shape({
      push: PropTypes.func.isRequired
    }).isRequired
  };

  handleMessage = event => {
    const { action, payload } = event.data;

    switch (action) {
      case 'open':
        let path;
        if ('screen' in payload) {
          path = `/screens/${payload.screen}`;
        } else if ('greeting' in payload) {
          path = `/greetings/${payload.greeting}`;
        }
        !!path && this.props.history.push(path, { api: true, ...payload });
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

export default MessengerAPI;
