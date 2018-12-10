import React from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import {
  Drawer,
  Button,
  Heading,
  Textarea,
  Toggle
} from '@deskpro/react-components';

class EmbedWidget extends React.PureComponent {
  static propTypes = {
    config: PropTypes.object,
    handleChange: PropTypes.func.isRequired
  };

  static defaultProps = {
    config: Immutable.fromJS({})
  };

  render() {
    const { config, handleChange } = this.props;
    return (
      <Drawer>
        <Heading>Embed the messenger widget on your site</Heading>
        <Toggle
          checked={config.getIn(['embed', 'showOnPortal'])}
          name="embed.showOnPortal"
          onChange={handleChange}
        >
          Show the widget on the portal. When disabled, the widget won't show on
          the helpdesk itself (i.e. it only shows on your own website).
        </Toggle>

        <h4>Publish on your website</h4>
        <div>
          Add the messenger to your website by copy and pasting a line of HTML
          code.
        </div>
        <Button size="medium">View instructions</Button>
        <br />
        <div>
          For security reasons, you must specify the domains you will use the
          messenger on:
          <br />
          <Textarea
            name="embed.authorizeDomains"
            id="authorizeDomains"
            cols="40"
            rows="10"
            value={config.getIn(['embed', 'authorizeDomains'])}
            autosize
            onChange={handleChange}
          />
        </div>
      </Drawer>
    );
  }
}
export default EmbedWidget;
