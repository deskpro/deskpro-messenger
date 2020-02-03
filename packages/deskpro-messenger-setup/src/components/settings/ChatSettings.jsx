import React from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import classNames from 'classnames';
import { faCaretUp, faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { Group, Heading, Icon, Input, Label, ListElement, Section, Select, Textarea, Toggle, Checkbox, Subheading } from '@deskpro/react-components';
import arrayMove from 'array-move';
import { SortableElement, SortableContainer } from 'react-sortable-hoc';

class CustomFieldCheckBox extends React.Component
{
  static propTypes = {
    field: PropTypes.object.isRequired,
    config: PropTypes.object.isRequired,
    handleChange: PropTypes.func.isRequired,
    handleCheckboxChange: PropTypes.func.isRequired,
  };

  render() {
    const { field, config, handleChange, handleCheckboxChange } = this.props;
    return (
      <div className="dp-ms-chat_field_wrapper">
        <div className="dp-ms-chat_field_enabled_wrapper">
          <Checkbox
            key={`chat_custom_field_${field.get('id')}_enabled`}
            onChange={handleCheckboxChange}
            checked={config.getIn(['chat', 'preChatForm', 'fields', `${field.get('id')}`, 'enabled'])}
            name={`chat.preChatForm.fields.${field.get('id')}`}
            value={field.get('id')}
          >
            {field.get('title')}
            <i className={'fas fa-bars'} />
          </Checkbox>
        </div>
        <div className="dp-ms-chat_field_required_wrapper">
          <Checkbox
            key={`chat_custom_field_${field.get('id')}_required`}
            onChange={(checked, value, name) => handleChange(checked, name)}
            checked={config.getIn(['chat', 'preChatForm', 'fields', `${field.get('id')}`, 'required'])}
            name={`chat.preChatForm.fields.${field.get('id')}.required`}>
            Required? (<a href={`#/chat/fields/${field.get('id')}`}>change</a>)
          </Checkbox>
        </div>
      </div>
    );
  }
}

const SortableItem = SortableElement(CustomFieldCheckBox);

const SortableList = SortableContainer((props) => {
  const {items, config, handleChange, handleCheckboxChange} = props;
  return (
    <div>
      {items.map((value, index) => (
        <SortableItem key={`item-${value}`} index={index} field={value} config={config} handleChange={handleChange} handleCheckboxChange={handleCheckboxChange} />
      ))}
    </div>
  );
});

class SortableComponent extends React.Component {

  state = {
    items: [],
  };

  static getDerivedStateFromProps(props) {
    const { fields, config } = props;
    return {
      items: fields.sort((a, b) => config.getIn(['chat', 'preChatForm', 'fields', `${a.get('id')}`, 'displayOrder']) - config.getIn(['chat', 'preChatForm', 'fields', `${b.get('id')}`, 'displayOrder']))
    };
  }

  onSortEnd = ({newIndex, oldIndex}) => {
    const newItems = arrayMove(this.state.items, oldIndex, newIndex).map((f, i) => f.set('displayOrder', i*10));
    newItems.forEach((f, i) => this.props.handleChange({displayOrder: i*10}, `chat.preChatForm.fields.${f.get('id')}`));
  };

  render() {
    const { handleChange, handleCheckboxChange, config } = this.props;

    return <SortableList
      items={this.state.items}
      onSortEnd={this.onSortEnd}
      config={config}
      handleChange={handleChange}
      pressDelay={100}
      handleCheckboxChange={handleCheckboxChange}
    />;
  }
}


class ChatSettings extends React.PureComponent {
  static propTypes = {
    config: PropTypes.object,
    handleChange: PropTypes.func.isRequired,
    chatDepartments: PropTypes.object,
    ticketDepartments: PropTypes.object,
    chatCustomFields: PropTypes.object,
    usergroups: PropTypes.object
  };

  static defaultProps = {
    config: Immutable.fromJS({}),
    chatCustomFields: Immutable.fromJS({}),
  };

  noAnswerOptions = [
    { value: '', label: 'Just show busy message' },
    { value: 'save_ticket', label: 'Save missed chat as ticket' },
    { value: 'create_ticket', label: 'Direct the user to new ticket' }
  ];



  handleSelectChange = (option, name) => {
    const value = typeof option === 'object' ? option.value : option;
    this.props.handleChange(value, name);
  };

  handleCheckboxChange = (checked, value, name) => {
    this.props.handleChange({id: value, enabled: checked}, name)
  };

  isUserGroupChecked = (usergroup) => {
    const { config } = this.props;
    return config.getIn(['chat', 'usergroups'], new Immutable.List()).indexOf(usergroup.get('id')) !== -1
  };

  handleUsergroupChange = (checked, name) => {
    const id = parseInt(name.split('.').slice(-1)[0], 10);
    const { config, handleChange, usergroups } = this.props;
    let groups = config.getIn(['chat', 'usergroups'], new Immutable.List());
    const everyone = usergroups.find(u => u.get('sys_name') === 'everyone');
    const registered = usergroups.find(u => u.get('sys_name') === 'registered');

    if(checked) {
      if (id === everyone.get('id')) {
        groups = new Immutable.List(usergroups
          .map(u => u.get('id'))
          .toArray()
        )
      } else if (id === registered.get('id')) {

        groups = new Immutable.List(usergroups
          .filter(u => groups.indexOf(everyone.get('id')) === -1 ? u.get('id') !== everyone.get('id') : true)
          .map(u => u.get('id'))
          .toArray()
        )
      } else if (groups.indexOf(id) === -1) {
        groups = groups.push(id)
      }
    } else {
      groups = groups.filter(i => i !== id);
    }

    handleChange(groups, 'chat.usergroups');
  };

  ensureTimeoutIsPositive = (value, name) => {
    if (value < 0) {
      value = 0;
    }
    this.props.handleChange(value, name);
  };

  renderPreChatForm() {
    const {
      config,
      handleChange,
      chatCustomFields,
    } = this.props;

    return (<div className="dp-ms-pre_chat-form">
      <div className={'dp-ms-hint'}>
        Require users to provide their name and email address as well as adding custom fields or require departments.
      </div>
      <Toggle
        checked={config.getIn(['chat', 'preChatForm', 'formMessageEnabled'])}
        name="chat.preChatForm.formMessageEnabled"
        onChange={handleChange}
      >
        Form message
      </Toggle>
      <Textarea
        name="chat.preChatForm.formMessage"
        style={{ display: config.getIn(['chat', 'preChatForm', 'formMessageEnabled']) ? 'block' : 'none' }}
        value={config.getIn(['chat', 'preChatForm', 'formMessage'])}
        className="dp-ms-chat_form_message"
          onChange={handleChange}
      />
      <Subheading size={5} className="dp-ms-subheading_inner">Chat fields:</Subheading>
      <div className="dp-ms-chat_field_wrapper">
        <div className="dp-ms-chat_field_enabled_wrapper">
          <Checkbox onChange={(checked, value, name) => handleChange(checked, name)} disabled={true} checked={config.getIn(['chat', 'preChatForm', 'isNameEnabled'])} name="chat.preChatForm.isNameEnabled">Name</Checkbox>
        </div>
        <div className="dp-ms-chat_field_required_wrapper">
          <Checkbox onChange={(checked, value, name) => handleChange(checked, name)} checked={config.getIn(['chat', 'preChatForm', 'isNameRequired'])} name="chat.preChatForm.isNameRequired" >Required?</Checkbox>
        </div>
      </div>
      <div className="dp-ms-chat_field_wrapper">
        <div className="dp-ms-chat_field_enabled_wrapper">
          <Checkbox onChange={(checked, value, name) => handleChange(checked, name)} disabled={true} checked={config.getIn(['chat', 'preChatForm', 'isEmailEnabled'])} name="chat.preChatForm.isEmailEnabled">Email</Checkbox>
        </div>
        <div className="dp-ms-chat_field_required_wrapper">
          <Checkbox onChange={(checked, value, name) => handleChange(checked, name)} checked={config.getIn(['chat', 'preChatForm', 'isEmailRequired'])} name="chat.preChatForm.isEmailRequired">Required?</Checkbox>
        </div>
      </div>
      <div className="dp-ms-chat_field_wrapper">
        <div className="dp-ms-chat_field_enabled_wrapper">
          <Checkbox onChange={(checked, value, name) => handleChange(checked, name)} checked={config.getIn(['chat', 'preChatForm', 'isDepartmentSelectable'])} name="chat.preChatForm.isDepartmentSelectable">Department</Checkbox>
        </div>
        <div style={{ display: config.getIn(['chat', 'preChatForm', 'isDepartmentSelectable']) ? 'none' : 'block' }} className="dp-ms-chat_field_required_wrapper">
          Default department will be applied automatically
        </div>
      </div>
      <SortableComponent
        fields={chatCustomFields.toArray()}
        config={config}
        handleChange={handleChange}
        handleCheckboxChange={this.handleCheckboxChange}
      />
    </div>)
  }

  render() {
    const {
      config,
      handleChange,
      chatDepartments,
      ticketDepartments,
      opened,
      onClick,
      usergroups
    } = this.props;
    const drawerProps = {
      'data-dp-toggle-id': this.props['data-dp-toggle-id'],
      className: 'dp-column-drawer'
    };

    this.noAnswerOptions[2].isDisabled = !config.getIn(['tickets', 'enabled']);

    return (
      <ListElement {...drawerProps}>
        <Heading onClick={onClick} className="dp-ms-section-header">
          Chat settings
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
          <Toggle
            checked={config.getIn(['chat', 'enabled'])}
            name="chat.enabled"
            onChange={handleChange}
          >
            Enable chat
          </Toggle>
          <Section className="dp-ms-np-section" hidden={!config.getIn(['chat', 'enabled'])}>
            <Section className="dp-ms-section">
              <Group
                label="Default chat department"
                htmlFor="ms-default-chat-department">
                <Select
                  options={chatDepartments.toArray().map(dep => (
                    {
                      value: dep.get('id'),
                      label: dep.get('title')
                    }
                  ))}
                  id="ms-default-chat-department"
                  value={config.getIn(['chat', 'department'])}
                  onChange={this.handleSelectChange}
                  name="chat.department"
                />
              </Group>
              <Group
                label="Prompt the user to describe their problem before the chat starts:"
                htmlFor="ms-chat-prompt">
                <Input
                  id="ms-chat-prompt"
                  type="text"
                  value={config.getIn(['chat', 'prompt'])}
                  name="chat.prompt"
                  onChange={handleChange}
                />
              </Group>
            </Section>
            <Subheading size={4}>Provide the widget with usergroups can use the chat</Subheading>
            <Section
              className={classNames(
                "dp-ms-section",
              )}
            >
              {(usergroups.filter(u => u.get('is_enabled')).toArray() || []).map(u =>
                <Toggle
                  checked={this.isUserGroupChecked(u)}
                  key={`usergroup_${u.get('title')}`}
                  name={`chat.usergroups.${u.get('id')}`}
                  onChange={this.handleUsergroupChange}
                >
                  {u.get('title')}
                </Toggle>
              )}
            </Section>
            <Subheading size={4}>Chat module settings</Subheading>
            <Section className='dp-ms-section'>
              <Group
                label="Greeting title"
                htmlFor="ms-messenger-title"
              >
                <Input
                  id="ms-messenger-title"
                  type="text"
                  value={config.getIn(['messenger', 'title'])}
                  name="messenger.title"
                  onChange={handleChange}
                />
              </Group>
              <Toggle
                name="messenger.chat.showAgentPhotos"
                checked={config.getIn(['messenger', 'chat', 'showAgentPhotos'])}
                onChange={handleChange}
              >
                Show agent profiles photos
              </Toggle>
              <Group
                label="Description"
                htmlFor="ms-messenger-chat-description"
              >
                <Input
                  id="ms-messenger-chat-description"
                  type="text"
                  value={config.getIn(['messenger', 'chat', 'description'])}
                  name="messenger.chat.description"
                  onChange={handleChange}
                />
              </Group>
              <Group
                label="Button text"
                htmlFor="ms-messenger-chat-button-text"
              >
                <Input
                  id="ms-messenger-chat-button-text"
                  type="text"
                  value={config.getIn(['messenger', 'chat', 'buttonText'])}
                  name="messenger.chat.buttonText"
                  onChange={handleChange}
                />
              </Group>
            </Section>
            <Subheading size={4}>Pre-chat form</Subheading>
            <Section
              className={classNames(
                    "dp-ms-section",
                    { 'dp-ms-no-bottom-margin': config.getIn(['chat', 'preChatForm', 'enabled']) }
              )}
            >
              <Toggle
                checked={config.getIn(['chat', 'preChatForm', 'enabled'])}
                name="chat.preChatForm.enabled"
                onChange={handleChange}
              >
                Ask information before chat commences
              </Toggle>
            </Section>
            <Section
              className="dp-ms-section dp-ms-no-top-margin"
              hidden={!config.getIn(['chat', 'preChatForm', 'enabled'])}
            >
              {this.renderPreChatForm()}
            </Section>
            <Subheading size={4}>Unanswered chat</Subheading>
            <Section className="dp-ms-section">
              <Label>
                If no agents are online to accept a chat, or when the user has waited for{' '}
                <Input
                  className="small"
                  type="number"
                  min={0}
                  max={9999}
                  value={config.getIn(['chat', 'timeout'])}
                  onChange={this.ensureTimeoutIsPositive}
                  name="chat.timeout"
                />{' '}
                seconds
              </Label>
              <Group
                htmlFor="ms-chat-no-answer-behavior"
              >
                <Select
                  options={this.noAnswerOptions}
                  value={config.getIn(['chat', 'noAnswerBehavior'], '')}
                  onChange={this.handleSelectChange}
                  name="chat.noAnswerBehavior"
                  id="ms-chat-no-answer-behavior"
                />
              </Group>
              {
                config.getIn(['chat', 'noAnswerBehavior']) === ''  &&
                <Group
                  label="Busy message"
                  htmlFor="ms-chat-busyMessage"
                >
                  <Textarea
                    name="chat.busyMessage"
                    id="ms-chat-busyMessage"
                    cols="40"
                    rows="6"
                    value={config.getIn(['chat', 'busyMessage'])}
                    onChange={handleChange}
                  />
                </Group>
              }
              {config.getIn(['chat', 'noAnswerBehavior']) === 'save_ticket' ?
                [
                  <Subheading size={4}>Missed chat ticket properties</Subheading>,
                  <Group
                    label="Department"
                    htmlFor="ms-chat-ticketDefaults-department"
                  >
                    <Select
                      options={ticketDepartments.toArray().map(dep => (
                        {
                          value: dep.get('id'),
                          label: dep.get('title')
                        }
                      ))}
                      value={config.getIn(['chat', 'ticketDefaults', 'department'])}
                      onChange={this.handleSelectChange}
                      name="chat.ticketDefaults.department"
                      id="ms-chat-ticketDefaults-department"
                    />
                  </Group>,
                  <Group
                    label="Subject"
                    htmlFor="ms-chat-ticketDefaults-subject"
                  >
                    <Select
                      options={[
                        {value: 'setSubject', label: 'Text set by admin'},
                        {value: 'autoSubject', label: 'Use first 5 words of message'}
                      ]}
                      value={config.getIn(['chat', 'ticketDefaults', 'subjectType'])}
                      onChange={this.handleSelectChange}
                      name="chat.ticketDefaults.subjectType"
                      id="ms-chat-ticketDefaults-subject"
                    />
                  </Group>,
                  config.getIn(['chat', 'ticketDefaults', 'subjectType']) === 'setSubject' &&
                  <Group
                    htmlFor="ms-chat-ticket-defaults-subject"
                  >
                    <Input
                      type="text"
                      value={config.getIn(['chat', 'ticketDefaults', 'subject'])}
                      placeholder="Missed chat from {name}"
                      onChange={handleChange}
                      name="chat.ticketDefaults.subject"
                      id="ms-chat-ticket-defaults-subject"
                    />
                  </Group>
                ]: null}
            </Section>
          </Section>
        </Section>
      </ListElement>
    );
  }
}
export default ChatSettings;
