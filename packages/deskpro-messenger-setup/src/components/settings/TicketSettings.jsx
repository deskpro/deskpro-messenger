import React from 'react';
import PropTypes from "prop-types";
import Immutable from "immutable";
import { Drawer, Heading, Toggle } from '@deskpro/react-components';

class TicketSettings extends React.PureComponent {
  static propTypes = {
    config: PropTypes.object,
  };

  static defaultProps = {
    config: Immutable.fromJS({})
  };

  render() {
    const { config } = this.props;
    return (
      <Drawer>
        <Heading>Ticket settings</Heading>
        <Toggle
          checked={config.get('enable_tickets')}
        >
          Enable new tickets
        </Toggle>
        <br />
        Department<br />
        Subject<br />
      </Drawer>
    );
  }
}
export default TicketSettings;