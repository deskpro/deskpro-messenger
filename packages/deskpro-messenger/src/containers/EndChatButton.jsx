import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { toggleChatEndBlock} from '../modules/chat'

const transMessages = {
  endChat: {
    id: 'chat.end_chat',
    defaultMessage: 'End chat'
  }
}

class EndChatButton extends PureComponent
{

  static propTypes = {
    toggleChatEndBlock: PropTypes.func.isRequired
  };

  render() {
    return (
      <div className="dpmsg-endChatButton">
        <span onClick={() => this.props.toggleChatEndBlock(true)}>
          <FormattedMessage {...transMessages.endChat} />
        </span>
      </div>
    );
  }
}



export default connect(null, { toggleChatEndBlock })(EndChatButton);
