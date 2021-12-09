import React from 'react';
import PropTypes from 'prop-types';
import TextAvatar from '../chat/TextAvatar';

class AvatarHeads extends React.PureComponent {
  static propTypes = {
    agentsAvailable: PropTypes.object
  };

  static defaultProps = {
    agentsAvailable: {}
  };

  render() {
    const { agentsAvailable } = this.props;
    if (!Object.keys(agentsAvailable).length) {
      return null;
    }
    return (
      <div className="dpmsg-AvatarHeadsList">
        {Object.values(agentsAvailable).map(agent => (
          agent.avatar
            ? (<div className="dpmsg-AvatarHeadsIcon" key={agent.id}>
                <img src={agent.avatar} alt={agent.name} />
              </div>)
            : <TextAvatar className="dpmsg-AvatarHeadText" height={44} width={44} name={agent.name} />
        ))}
      </div>
    );
  }
}

export default AvatarHeads;
