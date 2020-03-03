import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { toggleChatEndBlock} from '../modules/chat'

class EndChatButton extends PureComponent
{
  render() {
    return <span onClick={() => this.props.toggleChatEndBlock(true)}>End chat</span>
  }
}

export default connect(null, { toggleChatEndBlock})(EndChatButton);
