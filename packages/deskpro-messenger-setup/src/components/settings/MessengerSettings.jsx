import React from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import classNames from 'classnames';
import avatarButton from '../../images/avatar-button.png';
import avatarTextButton from '../../images/avatar-text-button.png';
import avatarTextInput from '../../images/avatar-text-input.png';
import avatarWidgetButton from '../../images/avatar-widget-button.png';
import textButton from '../../images/text-button.png';
import textInput from '../../images/text-input.png';
import { faCaretUp, faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { Group, Heading, Icon, Input, Label, ListElement, Radio, Section, Toggle, Subheading } from '@deskpro/react-components';

class MessengerSettings extends React.Component {
  static propTypes = {
    config: PropTypes.object,
    handleChange: PropTypes.func.isRequired
  };

  static defaultProps = {
    config: Immutable.fromJS({})
  };

  ensureTimeoutIsPositive = (value, name) => {
    if (value < 0) {
      value = 0;
    }
    this.props.handleChange(value, name);
  };

  handleRadioChange = (e) => {
     this.props.handleChange(e.target.value, e.target.name)
  };

  render() {
    const { config, handleChange, opened, onClick } = this.props;

    const autoStartStyle = config.getIn(['messenger', 'autoStartStyle']);
    const drawerProps = {
      'data-dp-toggle-id': this.props['data-dp-toggle-id'],
      className: 'dp-column-drawer'
    };
    return (
      <ListElement {...drawerProps}>
        <Heading onClick={onClick} className="dp-ms-section-header">
          Proactive chat settings
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
              checked={config.getIn(['messenger', 'autoStart'])}
              name="messenger.autoStart"
              onChange={handleChange}
            >
              Automatically open the messenger on page load
            </Toggle>
            {
              config.getIn(['messenger', 'autoStart']) &&
              <Label>
                Delay proactive chat by
                <Input
                  className="small"
                  type="number"
                  min={0}
                  max={9999}
                  value={config.getIn(['messenger', 'autoStartTimeout'])}
                  onChange={this.ensureTimeoutIsPositive}
                  name="messenger.autoStartTimeout"
                  id="ms-messenger-autoStartTimeout"
                />
                seconds
              </Label>
            }
          </Section>

          <Subheading size={4}>Proactive Widget Style</Subheading>
          <Section className='dp-ms-section dp-ms-widget-styles'>
            <input
              type="radio"
              id="widget-style-avatar-text-button"
              name="messenger.autoStartStyle"
              value="avatar-text-button"
              checked={autoStartStyle === 'avatar-text-button'}
              onChange={this.handleRadioChange}
            />
            <label className='dp-ms-widget-style' htmlFor='widget-style-avatar-text-button'>
              Agent avatar with text & button
              <img src={avatarTextButton} alt="Avatar Text Button style preview"/>
            </label>
            <input
              type="radio"
              id="widget-style-avatar-text-input"
              name="messenger.autoStartStyle"
              value="avatar-text-input"
              disabled={config.getIn(['chat', 'preChatForm', 'enabled'])}
              checked={autoStartStyle === 'avatar-text-input'}
              onChange={this.handleRadioChange}
            />
            <label className='dp-ms-widget-style' htmlFor='widget-style-avatar-text-input'>
              Agent avatar with text & input
              <img src={avatarTextInput} alt="Avatar Text Input style preview"/>
            </label>
            <input
              type="radio"
              id="widget-style-avatar-button"
              name="messenger.autoStartStyle"
              value="avatar-button"
              checked={autoStartStyle === 'avatar-button'}
              onChange={this.handleRadioChange}
              // style={{ display: 'none' }}
            />
            <label className='dp-ms-widget-style' htmlFor='widget-style-avatar-button'>
              Agent avatar with button
              <img src={avatarButton} alt="Avatar Button style preview"/>
            </label>
            <input
              type="radio"
              id="widget-style-text-button"
              name="messenger.autoStartStyle"
              value="text-button"
              checked={config.getIn(['messenger', 'autoStartStyle']) === 'text-button'}
              onChange={this.handleRadioChange}
              // style={{ display: 'none' }}
            />
            <label className='dp-ms-widget-style' htmlFor='widget-style-text-button'>
              Text & button
              <img src={textButton} alt="Text Button style preview"/>
            </label>
            <input
              type="radio"
              id="widget-style-text-input"
              name="messenger.autoStartStyle"
              value="text-input"
              disabled={config.getIn(['chat', 'preChatForm', 'enabled'])}
              checked={autoStartStyle === 'text-input'}
              onChange={this.handleRadioChange}
              // style={{ display: 'none' }}
            />
            <label className='dp-ms-widget-style' htmlFor='widget-style-text-input'>
              Text & input
              <img src={textInput} alt="Text Input style preview"/>
            </label>
            <input
              type="radio"
              id="widget-style-avatar-widget"
              name="messenger.autoStartStyle"
              value="avatar-widget"
              checked={autoStartStyle === 'avatar-widget'}
              onChange={this.handleRadioChange}
              // style={{ display: 'none' }}
            />
            <label className='dp-ms-widget-style' htmlFor='widget-style-avatar-widget'>
              Agent with widget button
              <img src={avatarWidgetButton} alt="Avatar Widget Button style preview"/>
            </label>
          </Section>

          <Subheading size={4} className={classNames({hidden: !autoStartStyle || autoStartStyle === 'avatar-widget'})}>
            Greeting options
          </Subheading>
          <Section className='dp-ms-section' hidden={!autoStartStyle || autoStartStyle === 'avatar-widget'}>
            <Group
              label="Greeting title"
              htmlFor="ms-messenger-proactive-greeting-title"
            >
              <Input
                id="ms-messenger-proactive-greeting-title"
                type="text"
                value={config.getIn(['messenger', 'proactive','greetingTitle'])}
                name="messenger.proactive.greetingTitle"
                onChange={handleChange}
              />
            </Group>
          </Section>
          <Subheading size={4}>Options</Subheading>
          <Section className='dp-ms-section'>
            <Group
              label="Title"
              htmlFor="ms-messenger-proactive-title"
            >
              <Input
                id="ms-messenger-proactive-title"
                type="text"
                value={config.getIn(['messenger', 'proactive', 'title'])}
                name="messenger.proactive.title"
                onChange={handleChange}
              />
            </Group>
            <Group
              label="Description"
              htmlFor="ms-messenger-proactive-description"
              className={classNames({hidden: !autoStartStyle || ['avatar-widget', 'avatar-button'].includes(autoStartStyle)})}
            >
              <Input
                id="ms-messenger-proactive-description"
                type="text"
                value={config.getIn(['messenger', 'proactive', 'description'])}
                name="messenger.proactive.description"
                onChange={handleChange}
              />
            </Group>
            <Group
              label="Button text"
              htmlFor="ms-messenger-proactive-button-text"
              className={classNames({hidden: !autoStartStyle || autoStartStyle.indexOf('button') === -1})}
            >
              <Input
                id="ms-messenger-proactive-button-text"
                type="text"
                value={config.getIn(['messenger', 'proactive', 'buttonText'])}
                name="messenger.proactive.buttonText"
                onChange={handleChange}
              />
            </Group>
            <Group
              label="Input placeholder"
              htmlFor="ms-messenger-proactive-input-placeholder"
              className={classNames({hidden: !autoStartStyle || autoStartStyle.indexOf('input') === -1})}
            >
              <Input
                id="ms-messenger-proactive-input-placeholder"
                type="text"
                value={config.getIn(['messenger', 'proactive', 'inputPlaceholder'])}
                name="messenger.proactive.inputPlaceholder"
                onChange={handleChange}
              />
            </Group>
          </Section>
        </Section>
      </ListElement>
    );
  }
}
export default MessengerSettings;
