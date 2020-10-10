import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import classNames from 'classnames';
import avatarButton from '../../images/avatar-button.png';
import avatarTextButton from '../../images/avatar-text-button.png';
import avatarTextInput from '../../images/avatar-text-input.png';
import avatarWidgetButton from '../../images/avatar-widget-button.png';
import textButton from '../../images/text-button.png';
import textInput from '../../images/text-input.png';
import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons';
import {
  Group,
  Heading,
  Icon,
  Input,
  Label,
  ListElement,
  Section,
  Subheading,
  Toggle
} from '@deskpro/react-components';
import TranslationButton from './TranslationButton';
import PhraseModal from './PhraseModal';

class ProactiveSettings extends React.Component {
  static propTypes = {
    config: PropTypes.object,
    handleChange: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired

  };

  static defaultProps = {
    config: Immutable.fromJS({})
  };

  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      modalPhrase: ''
    }
  }

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
    const { config, handleChange, handleSubmit, opened, onClick, languageId } = this.props;

    const autoStartStyle = config.getIn(['proactive', 'autoStartStyle']);
    const drawerProps = {
      'data-dp-toggle-id': this.props['data-dp-toggle-id'],
      className: 'dp-column-drawer'
    };

    const { modal, modalPhrase } = this.state;

    return (
      <Fragment>
        {modal && <PhraseModal
          phrase={modalPhrase}
          translations={config.get('translations')}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          closeModal={() => this.setState({modal: false})}
        />}
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
              checked={config.getIn(['proactive', 'autoStart'])}
              name="proactive.autoStart"
              onChange={handleChange}
            >
              Automatically open the messenger on page load
            </Toggle>
            {
              config.getIn(['proactive', 'autoStart']) &&
              <Label>
                Delay proactive chat by
                <Input
                  className="small"
                  type="number"
                  min={0}
                  max={9999}
                  value={config.getIn(['proactive', 'autoStartTimeout'])}
                  onChange={this.ensureTimeoutIsPositive}
                  name="proactive.autoStartTimeout"
                  id="ms-proactive-autoStartTimeout"
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
              name="proactive.autoStartStyle"
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
              name="proactive.autoStartStyle"
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
              name="proactive.autoStartStyle"
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
              name="proactive.autoStartStyle"
              value="text-button"
              checked={config.getIn(['proactive', 'autoStartStyle']) === 'text-button'}
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
              name="proactive.autoStartStyle"
              value="text-input"
              disabled={config.getIn(['chat', 'preChatForm', 'enabled'])}
              checked={autoStartStyle === 'text-input'}
              onChange={this.handleRadioChange}
            />
            <label className='dp-ms-widget-style' htmlFor='widget-style-text-input'>
              Text & input
              <img src={textInput} alt="Text Input style preview"/>
            </label>
            <input
              type="radio"
              id="widget-style-avatar-widget"
              name="proactive.autoStartStyle"
              value="avatar-widget"
              checked={autoStartStyle === 'avatar-widget'}
              onChange={this.handleRadioChange}
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
              htmlFor="ms-proactive-options-greeting-title"
            >
              <TranslationButton
                languageId={languageId}
                translations={config.get('translations')}
                id="ms-proactive-options-greeting-title"
                phrase={'helpcenter_messenger_proactive_greeting'}
                onClick={() => this.setState({ modal: true, modalPhrase: 'helpcenter_messenger_proactive_greeting' })}
              />
            </Group>
          </Section>
          <Subheading size={4}>Options</Subheading>
          <Section className='dp-ms-section'>
            <Group
              label="Title"
              htmlFor="ms-proactive-options-title"
            >
              <TranslationButton
                languageId={languageId}
                translations={config.get('translations')}
                id="ms-proactive-options-title"
                phrase={'helpcenter_messenger_proactive_title'}
                onClick={() => this.setState({ modal: true, modalPhrase: 'helpcenter_messenger_proactive_title' })}
              />
            </Group>
            <Group
              label="Description"
              htmlFor="ms-proactive-options-description"
              className={classNames({hidden: !autoStartStyle || ['avatar-widget', 'avatar-button'].includes(autoStartStyle)})}
            >
              <TranslationButton
                languageId={languageId}
                translations={config.get('translations')}
                id="ms-proactive-options-description"
                phrase={'helpcenter_messenger_proactive_description'}
                onClick={() => this.setState({ modal: true, modalPhrase: 'helpcenter_messenger_proactive_description' })}
              />
            </Group>
            <Group
              label="Button text"
              htmlFor="ms-proactive-options-button-text"
              className={classNames({hidden: !autoStartStyle || autoStartStyle.indexOf('button') === -1})}
            >
              <TranslationButton
                languageId={languageId}
                translations={config.get('translations')}
                id="ms-proactive-options-button-text"
                phrase={'helpcenter_messenger_proactive_button'}
                onClick={() => this.setState({ modal: true, modalPhrase: 'helpcenter_messenger_proactive_button' })}
              />
            </Group>
            <Group
              label="Input placeholder"
              htmlFor="ms-proactive-options-input-placeholder"
              className={classNames({hidden: !autoStartStyle || autoStartStyle.indexOf('input') === -1})}
            >
              <TranslationButton
                languageId={languageId}
                translations={config.get('translations')}
                id="ms-proactive-options-input-placeholder"
                phrase={'helpcenter_messenger_proactive_placeholder'}
                onClick={() => this.setState({ modal: true, modalPhrase: 'helpcenter_messenger_proactive_placeholder' })}
              />
            </Group>
          </Section>
        </Section>
      </ListElement>
      </Fragment>
    );
  }
}
export default ProactiveSettings;
