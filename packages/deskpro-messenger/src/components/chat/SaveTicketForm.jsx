import React, { lazy, PureComponent } from 'react';
import { compose } from 'redux';
import { injectIntl } from 'react-intl';
import { fromJSGreedy } from '../../utils/common';
import { connect } from 'react-redux';
import { getUser } from '../../modules/guest';
import PropTypes from 'prop-types';

const TicketForm = lazy(() => import('../tickets/LazyTicketForm'));

const transMessages = {
  name: {
    id: 'tickets.form.name',
    defaultMessage: 'Name',
  },
  email: {
    id: 'tickets.form.email',
    defaultMessage: 'Email',
  },
  department: {
    id: 'tickets.form.department',
    defaultMessage: 'Department',
  },
  message: {
    id: 'tickets.form.message',
    defaultMessage: 'Message',
  },
  product: {
    id: 'tickets.form.product',
    defaultMessage: 'Product',
  },
  priority: {
    id: 'tickets.form.priority',
    defaultMessage: 'Priority',
  },
  category: {
    id: 'tickets.form.category',
    defaultMessage: 'Category',
  },
  submit: {
    id: 'tickets.form.submit',
    defaultMessage: 'Submit',
  },
  dragNDrop: {
    id: 'tickets.form.dragNDrop',
    defaultMessage: 'Drag and drop',
  },
  or: {
    id: 'tickets.form.or',
    defaultMessage: 'or',
  },
  chooseAFile: {
    id: 'tickets.form.chooseAFile',
    defaultMessage: 'Choose a file',
  },
  chooseFiles: {
    id: 'tickets.form.chooseFiles',
    defaultMessage: 'Choose files',
  },
  select: {
    id: 'tickets.form.select',
    defaultMessage: 'Select',
  },
  back: {
    id: 'tickets.form.back',
    defaultMessage: 'Back',
  },
};

class SaveTicketForm extends PureComponent {

  static propTypes = {
    user: PropTypes.object,
    formConfig: PropTypes.array,
    department: PropTypes.number.isRequired,
    onSubmit: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
  };

  static defaultProps = {
    user: {},
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
      i18n={{
        name:        intl.formatMessage(transMessages.name),
        email:       intl.formatMessage(transMessages.email),
        department:  intl.formatMessage(transMessages.department),
        message:     intl.formatMessage(transMessages.message),
        product:     intl.formatMessage(transMessages.product),
        priority:    intl.formatMessage(transMessages.priority),
        category:    intl.formatMessage(transMessages.category),
        submit:      intl.formatMessage(transMessages.submit),
        dragNDrop:   intl.formatMessage(transMessages.dragNDrop),
        or:          intl.formatMessage(transMessages.or),
        chooseAFile: intl.formatMessage(transMessages.chooseAFile),
        chooseFiles: intl.formatMessage(transMessages.chooseFiles),
        select:      intl.formatMessage(transMessages.select),
        back:        intl.formatMessage(transMessages.back),
      }}
    />);
  }
}

const mapStateToProps = (state) => ({
  user: getUser(state),
});


export default compose(
  connect(
    mapStateToProps
  ),
  injectIntl
)(SaveTicketForm);
