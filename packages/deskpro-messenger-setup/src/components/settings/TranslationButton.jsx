import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Input, TranslateButton } from '@deskpro/react-components';


class TranslationButton extends React.Component {

  static propTypes = {
    translations: PropTypes.object,
    id:           PropTypes.string.isRequired,
    onClick:      PropTypes.func.isRequired,
    phrase:       PropTypes.string.isRequired,
  };

  calculatePercent() {
    const { phrase, translations } = this.props;
    if (!translations || translations.size < 1) {
      return 0;
    }
    const translationStack = translations.get(phrase);
    const done             = translationStack.reduce((sum, i) => sum += i.get('text') ? 1 : 0);
    return Math.ceil((done / translationStack.size) * 100)
  }

  calculateText() {
    const { phrase, translations } = this.props;
    if (!translations || translations.size < 1) {
      return '0/0';
    }
    const translationStack = translations.get(phrase);
    return `${translationStack.reduce((sum, i) => sum += i.get('text') ? 1 : 0, 0)}/${translationStack.size}`;
  }

  render() {

    const { onClick, translations, id, phrase } = this.props;

    return (
      <Fragment>
        <Input
          id={id}
          type="text"
          value={translations ? translations.get(phrase).first().get('text') : ''}
          disabled={true}
        />
        <TranslateButton
          percent={this.calculatePercent()}
          size="medium"
          onClick={onClick}
        >
          {this.calculateText()}
        </TranslateButton>
      </Fragment>

    )
  }
}

export default TranslationButton;
