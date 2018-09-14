import React from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import { Drawer, Button, Heading, Textarea, Toggle } from '@deskpro/react-components';

class EmbedWidget extends React.PureComponent {
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
        <Heading>Embed the messenger widget on your site</Heading>
        <Toggle
          checked={config.get('show_on_portal')}
        >
          Show the widget on the portal.
          When disabled, the widget won't show on the helpdesk itself (i.e. it only shows on your own website).
        </Toggle>

        <h4>Publish on your website</h4>
        <p>
          Add the messenger to your website by copy and pasting a line of HTML code.
        </p>
        <Button
          size="medium"
        >
          View instructions
        </Button><br />
        <p>
          For security reasons, you must specify the domains you will use the messenger on:<br />
          <Textarea
            name="authorize_domains"
            id="authorize_domains"
            cols="40"
            rows="10"
            value={config.get('authorize_domains')}
            autosize
            onChange={this.handleChange}
          />
        </p>
      </Drawer>
    );
  }
}
export default EmbedWidget;