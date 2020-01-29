import React from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import { faCaretUp, faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { Group, Subheading, Heading, Icon, ListElement, Section, Textarea, Toggle, Input } from '@deskpro/react-components';

class EmbedWidget extends React.PureComponent {
  static propTypes = {
    config: PropTypes.object,
    handleChange: PropTypes.func.isRequired
  };

  static defaultProps = {
    config: Immutable.fromJS({})
  };

  render() {
    const { config, handleChange, opened, onClick } = this.props;
    const drawerProps = {
      'data-dp-toggle-id': this.props['data-dp-toggle-id'],
      className: 'dp-column-drawer'
    };
    return (
      <ListElement {...drawerProps}>
        <Heading onClick={onClick} className="dp-ms-section-header">
          Add Widget & Chat to your Site
          &nbsp;
          <Icon
            key="icon"
            aria-hidden
            onClick={onClick}
            className="dp-column-drawer__arrow"
            name={opened ? faCaretUp : faCaretDown}
          />
        </Heading>
        <Section hidden={!opened}>
          <Section className='dp-ms-section'>
            <Toggle
              checked={config.getIn(['embed', 'showOnPortal'])}
              name="embed.showOnPortal"
              onChange={handleChange}
            >
              Show the widget on the portal. When disabled, the widget won't show on
              the helpdesk itself (i.e. it only shows on your own website).
            </Toggle>
            <Group
              label="JWT secret:"
              htmlFor="ms-embed-jwt"
            >
              <Input
                name="embed.jwtSecret"
                id="ms-embed-jwt"
                type="text"
                value={config.getIn(['embed', 'jwtSecret'])}
                onChange={handleChange}
              />
            </Group>
          </Section>
          <Subheading size={4}>Domain whitelist</Subheading>
          <Section className='dp-ms-section'>
            <Group
              label="For security reasons, you must specify the domains you will use the
              messenger on:"
              htmlFor="ms-embed-domain-whitelist"
            >
              <Textarea
                name="embed.authorizeDomains"
                id="ms-embed-domain-whitelist"
                cols="40"
                rows="10"
                value={config.getIn(['embed', 'authorizeDomains'])}
                autosize
                onChange={handleChange}
              />
            </Group>
          </Section>
        </Section>
      </ListElement>
    );
  }
}
export default EmbedWidget;
