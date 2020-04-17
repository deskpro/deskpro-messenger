import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import {
  Group,
  Heading,
  Icon,
  Input,
  ListElement,
  Radio,
  Section,
  Select,
  Subheading,
  Toggle,
  TranslateButton,
  Modal,
  Button,
} from '@deskpro/react-components';
import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons';
import classNames from "classnames";
import PhraseModal from './PhraseModal';
import TranslationButton from './TranslationButton';

const phrasesTitles = {
  'blocks_ticket_button':      'Button',
  'blocks_ticket_title':       'Title',
  'blocks_ticket_description': 'Desciprion',
};

class TicketSettings extends React.PureComponent {
  static propTypes = {
    config: PropTypes.object,
    handleChange: PropTypes.func.isRequired,
    ticketDepartments: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      modalPhrase: ''
    }
  }

  static defaultProps = {
    config: Immutable.fromJS({})
  };

  handleSelectChange = (option, name) => {
    const value = typeof option === 'object' ? option.value : option;
    this.props.handleChange(value, name);
  };

  handleTicketsToggleChange = (value, name)  => {
    if(!value && this.props.config.getIn(['chat', 'noAnswerBehavior']) === 'create_ticket') {
      this.props.handleChange('save_ticket', 'chat.noAnswerBehavior');
    }
    this.props.handleChange(value, name);
  };

  handleRadioChange = (checked, value, name) => {
    this.props.handleChange(value, name)
  };

  calculatePercent = (modalPhrase) => {
    const translations = this.props.config.getIn(['translations', modalPhrase]);
    if(!translations || translations.size < 1) {
      return 0;
    }
    const done = translations.reduce((sum, i) => sum += i.get('text')?1:0);
    return Math.ceil((done / translations.size) * 100)
  }

  calculateText = (modalPhrase) => {
    const translations = this.props.config.getIn(['translations', modalPhrase]);
    if(!translations || translations.size < 1) {
      return '0/0';
    }
    return `${translations.reduce((sum, i) => sum += i.get('text')?1:0, 0)}/${translations.size}`;
  }

  render() {
    const {
      config,
      handleChange,
      ticketDepartments,
      opened,
      onClick
    } = this.props;

    const { modal, modalPhrase } = this.state;

    const drawerProps = {
      'data-dp-toggle-id': this.props['data-dp-toggle-id'],
      className: 'dp-column-drawer'
    };
    return (
      <Fragment>
        {modal && <PhraseModal
          phrase={modalPhrase}
          translations={config.get('translations')}
          handleChange={handleChange}
          closeModal={() => this.setState({modal: false})}
        />}
        <ListElement {...drawerProps}>
          <Heading onClick={onClick} className="dp-ms-section-header">
            Ticket Settings
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
                checked={config.getIn(['tickets', 'enabled'])}
                name="tickets.enabled"
                onChange={this.handleTicketsToggleChange}
              >
                Enable new tickets
              </Toggle>
              <Section hidden={!config.getIn(['tickets', 'enabled'])}>
                <Group
                  label="Department"
                  htmlFor="ms-tickets-default-department"
                >
                  <Radio
                    checked={config.getIn(['tickets', 'departmentOption']) === 'choose'}
                    name="tickets.departmentOption"
                    onChange={this.handleRadioChange}
                    value="choose"
                  >
                    Selected by the user in the ticket form
                  </Radio>
                  <Radio
                    checked={config.getIn(['tickets', 'departmentOption']) === 'hidden'}
                    name="tickets.departmentOption"
                    onChange={this.handleRadioChange}
                    value="hidden"
                  >
                    Set Department (removes from the ticket form)
                  </Radio>
                  <Select
                    options={ticketDepartments.filter(d => d.get('children').size < 1).toArray().map(dep => (
                      {
                        value:      dep.get('id'),
                        label:      dep.get('title'),
                        isDisabled: dep.get('children').size > 0
                      }
                    ))}
                    value={config.getIn(['tickets', 'department'])}
                    onChange={this.handleSelectChange}
                    name="tickets.department"
                    id="ms-tickets-default-department"
                  />
                  {
                    config.getIn(['tickets', 'departmentOption']) === 'choose' &&
                    <span className="dp-ms-hint">
                      Will be used as default selected department for a user, who can change it
                    </span>
                  }
                </Group>
                <Group
                  label="Subject"
                  htmlFor="ms-tickets-default-subject"
                >
                  <Radio
                    checked={config.getIn(['tickets', 'subjectOption']) === 'user'}
                    name="tickets.subjectOption"
                    onChange={this.handleRadioChange}
                    value="user"
                  >
                    Selected by the user in the ticket form
                  </Radio>
                  <Radio
                    checked={config.getIn(['tickets', 'subjectOption']) === 'preset'}
                    name="tickets.subjectOption"
                    onChange={this.handleRadioChange}
                    value="preset"
                  >
                    Preset by admin (removes from the ticket form)
                  </Radio>
                  {config.getIn(['tickets', 'subjectOption']) === 'preset' && <Input
                    type="text"
                    value={config.getIn(['tickets', 'subject'])}
                    placeholder="Ticket from {name}"
                    onChange={handleChange}
                    name="tickets.subject"
                    id="ms-tickets-default-subject"
                  />}
                </Group>
              </Section>
              <Subheading
                size={4}
                className={classNames({hidden: !config.getIn(['tickets', 'enabled'])})}
              >
                Tickets options
              </Subheading>
              <Section
                className='dp-ms-section'
                hidden={!config.getIn(['tickets', 'enabled'])}
              >
                <Group
                  label="Title"
                  htmlFor="ms-tickets-options-title"
                >
                  <TranslationButton
                    translations={config.get('translations')}
                    id="ms-tickets-options-title"
                    phrase={'blocks_ticket_title'}
                    onClick={() => this.setState({modal: true, modalPhrase: 'blocks_ticket_title'})}
                  />
                </Group>
                <Group
                  label="Description"
                  htmlFor="ms-tickets-options-description"
                >
                  <Input
                    id="ms-tickets-options-description"
                    type="text"
                    value={config.getIn(['translations', 'blocks_ticket_description'])
                      ? config.getIn(['translations', 'blocks_ticket_description']).first().get('text')
                      : ''
                    }
                    disabled={true}
                  />
                  <TranslateButton
                    percent={this.calculatePercent('blocks_ticket_description')}
                    size="medium"
                    onClick={() => this.setState({modal: true, modalPhrase: 'blocks_ticket_description'})}
                  >
                    {this.calculateText('blocks_ticket_description')}
                  </TranslateButton>
                </Group>
                <Group
                  label="Button text"
                  htmlFor="ms-tickets-options-button-text"
                >
                  <Input
                    id="ms-tickets-options-button-text"
                    type="text"
                    value={config.getIn(['translations', 'blocks_ticket_button'])
                      ? config.getIn(['translations', 'blocks_ticket_button']).first().get('text')
                      : ''
                    }
                    disabled={true}
                  />
                  <TranslateButton
                    percent={this.calculatePercent('blocks_ticket_button')}
                    size="medium"
                    onClick={() => this.setState({modal: true, modalPhrase: 'blocks_ticket_button'})}
                  >
                    {this.calculateText('blocks_ticket_button')}
                  </TranslateButton>
                </Group>
              </Section>
            </Section>
          </Section>
        </ListElement>
      </Fragment>
    );
  }
}
export default TicketSettings;
