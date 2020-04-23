import React, { lazy, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { injectIntl } from 'react-intl';
import { fromJSGreedy } from '../../utils/common';
import { getUser } from '../../modules/guest';
import { withConfig } from '../core/ConfigContext';

const TicketForm = lazy(() => import('../tickets/LazyTicketForm'));

const transMessages = {
  name: {
    id: 'helpcenter.messenger.tickets_form_name',
    defaultMessage: 'Name',
  },
  email: {
    id: 'helpcenter.messenger.tickets_form_email',
    defaultMessage: 'Email',
  },
  department: {
    id: 'helpcenter.general.department',
    defaultMessage: 'Department',
  },
  message: {
    id: 'helpcenter.messenger.tickets_form_message',
    defaultMessage: 'Message',
  },
  product: {
    id: 'helpcenter.messenger.tickets_form_product',
    defaultMessage: 'Product',
  },
  priority: {
    id: 'helpcenter.messenger.tickets_form_priority',
    defaultMessage: 'Priority',
  },
  category: {
    id: 'helpcenter.general.category',
    defaultMessage: 'Category',
  },
  submit: {
    id: 'helpcenter.messenger.tickets_form_submit',
    defaultMessage: 'Submit',
  },
  addAttachment: {
    id: 'helpcenter.messenger.tickets_form_add_attachment',
    defaultMessage: 'Add attachment',
  },
  dragNDrop: {
    id: 'helpcenter.general.drag_and_drop',
    defaultMessage: 'Drag and drop',
  },
  or: {
    id: 'helpcenter.messenger.tickets_form_or',
    defaultMessage: 'or',
  },
  chooseAFile: {
    id: 'helpcenter.general.form_choose_file',
    defaultMessage: 'Choose a file',
  },
  chooseFiles: {
    id: 'helpcenter.general.form_choose_files',
    defaultMessage: 'Choose files',
  },
  select: {
    id: 'helpcenter.messenger.tickets_form_select',
    defaultMessage: 'Select',
  },
  back: {
    id: 'helpcenter.messenger.tickets_form_back',
    defaultMessage: 'Back',
  },
  required: {
    id: 'helpcenter.messenger.tickets_form_required',
    defaultMessage: 'Back',
  },
};

class SaveTicketForm extends PureComponent {

  static propTypes = {
    user: PropTypes.object,
    language: PropTypes.object,
    formConfig: PropTypes.array,
    department: PropTypes.number.isRequired,
    onSubmit: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
  };

  static defaultProps = {
    user: {},
    language: {},
    formConfig: [],
  };

  render() {
    const { department, formConfig, user, uploadTo, onSubmit, intl } = this.props;
    const immutableLayout = fromJSGreedy(formConfig);

    return (<TicketForm
      initialValues={{ person: user }}
      deskproLayout={immutableLayout}
      departments={fromJSGreedy([])}
      fileUploadUrl={uploadTo}
      csrfToken="not_used"
      departmentPropName="department"
      department={department}
      onSubmit={onSubmit}
      languageId={parseInt(this.props.language.id, 10)}
      i18n={{
        name:          intl.formatMessage(transMessages.name),
        email:         intl.formatMessage(transMessages.email),
        department:    intl.formatMessage(transMessages.department),
        message:       intl.formatMessage(transMessages.message),
        product:       intl.formatMessage(transMessages.product),
        priority:      intl.formatMessage(transMessages.priority),
        category:      intl.formatMessage(transMessages.category),
        submit:        intl.formatMessage(transMessages.submit),
        addAttachment: intl.formatMessage(transMessages.addAttachment),
        dragNDrop:     intl.formatMessage(transMessages.dragNDrop),
        or:            intl.formatMessage(transMessages.or),
        chooseAFile:   intl.formatMessage(transMessages.chooseAFile),
        chooseFiles:   intl.formatMessage(transMessages.chooseFiles),
        select:        intl.formatMessage(transMessages.select),
        back:          intl.formatMessage(transMessages.back),
        required:      intl.formatMessage(transMessages.required),
      }}
    />);
  }
}

const mapStateToProps = (state) => ({
  user: getUser(state),
});


export default compose(
  withConfig,
  connect(
    mapStateToProps
  ),
  injectIntl
)(SaveTicketForm);
