import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import copy from 'copy-to-clipboard';
import { faCaretUp, faCaretDown, faCopy, faCheck, faPaste, faLaptop } from '@fortawesome/free-solid-svg-icons';
import { faDrupal, faJoomla, faMagento, faShopify, faWordpress } from '@fortawesome/free-brands-svg-icons';
import {
  Button,
  Group,
  Heading,
  Icon,
  Input,
  List,
  ListElement,
  Section,
  Subheading,
  Tabs,
  TabLink,
  Textarea,
  Toggle,
} from '@deskpro/react-components';

class EmbedWidget extends React.PureComponent {
  static propTypes = {
    config:       PropTypes.object,
    code:         PropTypes.string,
    handleChange: PropTypes.func.isRequired
  };

  static defaultProps = {
    config: Immutable.fromJS({})
  };

  constructor(props) {
    super(props);
    this.state = {
      copied:    false,
      activeTab: 'manually',
    };
  }

  copyCode = () => {
    copy(this.props.code);
    this.setState({
      copied: true
    }, () => {
      setTimeout(() => {
        this.setState({
          copied: false
        });
      }, 2000);
    })
  };

  render() {
    const { config, handleChange, opened, onClick, code } = this.props;
    const { copied, activeTab }                           = this.state;
    const drawerProps                                     = {
      'data-dp-toggle-id': this.props['data-dp-toggle-id'],
      className:           'dp-column-drawer'
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
            Embed code<br/>
            <Textarea cols={80} rows={6} readonly value={code}/><br/>
            <Button onClick={this.copyCode} type="secondary" size="medium">
              {copied ? <Icon name={faCheck}/> : <Icon name={faCopy}/>}
              Copy
            </Button>
          </Section>
          <Section className='dp-ms-section'>
            <Toggle
              checked={config.getIn(['embed', 'showOnPortal'])}
              name="embed.showOnPortal"
              onChange={handleChange}
            > Show the widget on the portal.
            </Toggle>
            When disabled, the widget won't show on
            the helpdesk itself (i.e. it only shows on your own website).
          </Section>
          <Tabs active={activeTab} onChange={(t) => {
            this.setState({ activeTab: t })
          }}>
            <TabLink name="manually">
              Manually install
            </TabLink>
            <TabLink name="cms">
              Install in a CMS
            </TabLink>
          </Tabs>
          <Section className='dp-ms-section' hidden={activeTab !== 'manually'}>
            <div className="dp-card">
              <List>
                <ListElement>
                  <h3><Icon name={faCopy}/> Copy the code<br/></h3>
                  Set up your widget then copy the embed code above.
                </ListElement>
              </List>
            </div>
            <div className="dp-card">
              <List>
                <ListElement>
                  <h3><Icon name={faPaste}/> Paste on your site<br/></h3>
                  Place the embed code in the &gt;head&lt; section of your website.
                </ListElement>
              </List>
            </div>
            <div className="dp-card">
              <List>
                <ListElement>
                  <h3><Icon name={faLaptop}/> Get started.<br/></h3>
                  Save the changes and users can start using the widget!
                </ListElement>
              </List>
            </div>
          </Section>
          <Section className='dp-ms-section' hidden={activeTab !== 'cms'}>
            <table>
              <tr>
                <td>
                  <Button type="secondary">
                    <a
                      href="http://support.deskpro.com/kb/articles/541"
                      target="_blank"
                    >
                      <Icon name={faWordpress}/>
                      Wordpress
                    </a>
                  </Button>
                </td>
                <td>
                  <Button type="secondary">
                    <a
                      href="http://support.deskpro.com/kb/articles/545"
                      target="_blank"
                    >
                      <Icon name={faMagento}/>
                      Magento
                    </a>
                  </Button>
                </td>
              </tr>
              <tr>
                <td>
                  <Button type="secondary">
                    <a
                      href="http://support.deskpro.com/kb/articles/542"
                      target="_blank"
                    >
                      <Icon name={faShopify}/>
                      Shopify
                    </a>
                  </Button>
                </td>
                <td>
                  <Button type="secondary">
                    <a
                      href="http://support.deskpro.com/kb/articles/544"
                      target="_blank"
                    >
                      <Icon name={faJoomla}/>
                      Joomla
                    </a>
                  </Button>
                </td>
              </tr>
              <tr>
                <td>
                  <Button type="secondary">
                    <a
                      href="http://support.deskpro.com/kb/articles/543"
                      target="_blank"
                    >
                      <Icon name={faDrupal}/>
                      Drupal
                    </a>
                  </Button>
                </td>
              </tr>
            </table>
          </Section>
          <Section className='dp-ms-section'>
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
              <span className="dp-ms-hint">A comma separated list of domain names with schema. (https://example.com,http://example.com)</span>
            </Group>
          </Section>
        </Section>
      </ListElement>
    );
  }
}

export default EmbedWidget;
