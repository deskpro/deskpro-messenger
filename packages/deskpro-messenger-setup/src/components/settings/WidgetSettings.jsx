import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import {
  Colorpicker,
  Heading,
  Icon,
  Label,
  ListElement,
  Section,
  Subheading,
  Radio,
  Group
} from '@deskpro/react-components';
import { faCaretUp, faCaretDown } from '@fortawesome/free-solid-svg-icons';
import PhraseModal from './PhraseModal';
import TranslationButton from './TranslationButton';
import AJAXSubmit from '../../utils/AJAXSubmit';

class WidgetSettings extends React.PureComponent {
  static propTypes = {
    config: PropTypes.object,
    handleChange: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    opened: PropTypes.bool,
    apiBaseUrl: PropTypes.string
  };

  static defaultProps = {
    config: Immutable.fromJS({}),
    opened: true
  };

  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      modalPhrase: ''
    }
  }

  handleFileSend = (file) => {
    AJAXSubmit({
      url: `${this.props.apiBaseUrl}/v2/blobs/temp`,
      files: [file],
      name: 'file',
      transferComplete: this.handleTransferComplete,
      transferFailed: this.handleTransferFailed,
      transferCanceled: this.handleTransferFailed,
    });
  };

  handleTransferComplete = (e) => {
    if (e.target.response && e.target.response.data) {
      this.props.handleChange(e.target.response.data, 'widget.icon');
    }
  };

  handleTransferFailed = (e) => {

  };

  handleFileUploadClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const input = document.createElement('input');
    input.type = 'file';
    input.style.display = 'none';

    input.onchange = e => {
      const file = e.target.files[0];
      this.handleFileSend(file);
    };

    window.document.body.appendChild(input);

    input.click();
  }

  handleRadioChange = (checked, value, name) => {
    this.props.handleChange(value, name)
  };

  render() {
    const { config, handleChange, handleSubmit, opened, onClick } = this.props;
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
        <Heading onClick={onClick} className={'dp-ms-section-header'}>
          Widget Settings
          &nbsp;
          <Icon
            key="icon"
            aria-hidden
            onClick={onClick}
            className="dp-column-drawer__arrow dp-ms-section-header"
            name={opened ? faCaretUp : faCaretDown}
          />
        </Heading>
        <Section hidden={!opened}>
          <Section className='dp-ms-section'>
            <Label>Primary color</Label>
            <Colorpicker
              value={config.getIn(['widget', 'primaryColor'])}
              name="widget.primaryColor"
              onChange={handleChange}
              format="hex"
            />

            <Label>Secondary (background) color</Label>
            <Colorpicker
              value={config.getIn(['widget', 'backgroundColor'])}
              name="widget.backgroundColor"
              onChange={handleChange}
              format="hex"
            />

            <Label>Text & Icon color</Label>
            <Colorpicker
              value={config.getIn(['widget', 'textColor'])}
              name="widget.textColor"
              onChange={handleChange}
              format="hex"
            />

            <Label>Icon</Label>
            <span className='dp-ms-widget-logo' onClick={this.handleFileUploadClick}>
              {
                config.hasIn(['widget', 'icon', 'download_url'])
                  ? <Fragment>
                    <img src={config.getIn(['widget', 'icon', 'download_url'])} />
                    <span>{config.getIn(['widget', 'icon', 'filename'])} ({config.getIn(['widget', 'icon', 'filesize_readable'])})</span>
                  </Fragment>
                  : <span>click here to upload a custom logo</span>
              }

            </span>
            <br />

            <Group
              label="Greeting Title"
              htmlFor="ms-messenger-title"
            >
              <TranslationButton
                translations={config.get('translations')}
                id="ms-messenger-title"
                phrase={'helpcenter_messenger_greeting'}
                onClick={() => this.setState({modal: true, modalPhrase: 'helpcenter_messenger_greeting'})}
              />
            </Group>
          </Section>
          <Subheading size={4}>Widget position</Subheading>
          <Section className='dp-ms-section'>
            <Radio
              checked={config.getIn(['widget', 'position']) === 'right'}
              name="widget.position"
              onChange={this.handleRadioChange}
              value="right"
              style={{ display: 'inline-block' }}
            >
              Right
            </Radio>
            <span className="dp-ms-position-separator">- or -</span>
            <Radio
              checked={config.getIn(['widget', 'position']) === 'left'}
              name="widget.position"
              onChange={this.handleRadioChange}
              value="left"
              style={{ display: 'inline-block' }}
            >
              Left
            </Radio>
          </Section>
        </Section>
      </ListElement>
      </Fragment>
    );
  }
}
export default WidgetSettings;
