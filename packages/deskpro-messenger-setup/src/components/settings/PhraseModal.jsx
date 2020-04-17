import React from 'react';
import PropTypes from 'prop-types';
import { Button, Input, Modal, } from '@deskpro/react-components';

const phrasesTitles = {
  'blocks_ticket_button':      'Button',
  'blocks_ticket_title':       'Title',
  'blocks_ticket_description': 'Desciprion',
};

class PhraseModal extends React.Component {

  static propTypes = {
    translations: PropTypes.object,
    handleChange: PropTypes.func.isRequired,
    phrase:       PropTypes.string.isRequired,
    closeModal:   PropTypes.func.isRequired
  };

  render() {

    const { phrase, closeModal, handleChange, translations } = this.props;

    return (
      <Modal
        title={`Ticket block. ${phrasesTitles[phrase]} translation.`}
        closeModal={closeModal}
        buttons={
          <div>
            <Button
              onClick={this.props.handleSubmit}
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
