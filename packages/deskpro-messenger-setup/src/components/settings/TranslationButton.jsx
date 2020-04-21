import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Input, Textarea, TranslateButton } from '@deskpro/react-components';
import { objectKeyFilter } from '@deskpro/js-utils/dist/objects';
import Immutable from 'immutable';
import classNames from 'classnames';


class TranslationButton extends React.Component {

  static propTypes = {
    translations: PropTypes.object,
    id:           PropTypes.string.isRequired,
    onClick:      PropTypes.func.isRequired,
    phrase:       PropTypes.string.isRequired,
    useTextarea:  PropTypes.bool,
    className:    PropTypes.string,
  };

  static defaultProps = {
    useTextarea: false,
    className: '',
    translations: Immutable.fromJS({})
  }

  calculatePercent() {
    const { phrase, translations } = this.props;
    if (translations.size < 1) {
      return 0;
    }
    const translationStack = translations.get(phrase);
    const done             = translationStack.reduce((sum, i) => sum += i.get('text') ? 1 : 0);
    return Math.ceil((done / translationStack.size) * 100)
  }

  calculateText() {
    const { phrase, translations } = this.props;
    if (translations.size < 1) {
      return '0/0';
    }
    const translationStack = translations.get(phrase);
    return `${translationStack.reduce((sum, i) => sum += i.get('text') ? 1 : 0, 0)}/${translationStack.size}`;
  }

  render() {

    const { onClick, useTextarea, translations, id, phrase, className } = this.props;

    const Field = useTextarea ? Textarea : Input

    return (
      <Fragment>
        <Field
          id={id}
          type="text"
          value={translations.has(phrase) ? translations.get(phrase).first().get('text') : ''}
          disabled={true}
          className={classNames(className)}
          { ...objectKeyFilter(this.props, TranslateButton.propTypes)}
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
