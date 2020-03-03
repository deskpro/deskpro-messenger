import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { toggleChatEndBlock} from '../modules/chat'

class EndChatButton extends PureComponent
{

  static propTypes = {
    toggleChatEndBlock: PropTypes.func.isRequired
  };

  render() {
    return (
      <div className="dpmsg-endChatButton">
        <span onClick={() => this.props.toggleChatEndBlock(true)}>End chat</span>
      </div>
    );
  }
}



export default connect(null, { toggleChatEndBlock })(EndChatButton);
