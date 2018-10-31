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
    }).isRequired,
    location: PropTypes.shape({
      pathname: PropTypes.string.isRequired
    }).isRequired,
    opened: PropTypes.bool,
    onToggle: PropTypes.func.isRequired
  };

  handleMessage = (event) => {
    const { action, payload } = event.data;

    switch (action) {
      case 'open':
        let path;
        if ('screen' in payload) {
          path = `/screens/${payload.screen}`;
        } else if ('greeting' in payload) {
          path = `/greetings/${payload.greeting}`;
        }
        if (path) {
          this.props.history.push(path, { api: true, ...payload });
          !this.props.opened && this.props.onToggle();
        }
        break;

      case 'to':
        this.props.history.push(payload, { api: true });
        !this.props.opened && this.props.onToggle();
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
