import React from 'react';
import PropTypes from 'prop-types';
import { Button, Input, Modal, } from '@deskpro/react-components';

const phrasesTitles = {
  'blocks_ticket_button':          'Ticket block. Button',
  'blocks_ticket_title':           'Ticket block. Title',
  'blocks_ticket_description':     'Ticket block. Description',
  'blocks_start-chat_description': 'Start chat block. Description',
  'blocks_start-chat_title':       'Start chat block. Title',
  'blocks_start-chat_button':      'Start chat block. Button',
  'blocks_start-chat_placeholder': 'Start chat block. Placeholder',
  'blocks_start-chat_greeting':    'Start chat block. Greeting',
  'proactive_greeting':            'Proactive chat. Greeting',
  'proactive_title':               'Proactive chat. Title',
  'proactive_description':         'Proactive chat. Description',
  'proactive_button':              'Proactive chat. Button',
};

class PhraseModal extends React.Component {

  static propTypes = {
    translations: PropTypes.object,
    handleChange: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    phrase:       PropTypes.string.isRequired,
    closeModal:   PropTypes.func.isRequired
  };

  render() {

    const { phrase, closeModal, handleSubmit, handleChange, translations } = this.props;

    return (
      <Modal
        title={`${phrasesTitles[phrase]} translation.`}
        closeModal={closeModal}
        buttons={
          <div>
            <Button
              onClick={handleSubmit}
              className="dp-button--l dp-button--cta right">
              Save
            </Button>
          </div>
        }
      >
        {translations.get(phrase).map((l) => {
          const lang = l.get('language');
          return (
            <Input
              value={l.get('text')}
              name={`translations.${phrase}.${lang.get('id')}.text`}
              onChange={handleChange}
              suffix={<img src={lang.get('flag_image')} title={lang.get('title')} alt={lang.get('lang_code')}/>}
              prefix={lang.get('title')}
            />
          );
        }).toArray()}
      </Modal>
    )
  }
}

export default PhraseModal;
