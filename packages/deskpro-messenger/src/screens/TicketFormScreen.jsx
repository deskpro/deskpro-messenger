import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from "redux";
import { FormattedMessage, injectIntl } from 'react-intl';
import { fromJSGreedy } from '../utils/common';
import _cloneDeep from 'lodash/cloneDeep';
import Block from '../components/core/Block';
import { TicketForm } from '@deskpro/portal-components';
import {
  getErrors,
  getTicketSavedState,
  getTicketSavingState,
  getTicketFormCache,
  newTicket,
  saveTicket,
  cacheForm,
  getTicket
} from '../modules/tickets';
import { getTicketDepartments, getTicketPriorities } from '../modules/info';
import { getUser, isUserSet, isOrgSet } from '../modules/guest';
import Header from '../components/ui/Header';
import { withConfig } from '../components/core/ConfigContext';
import { withScreenContentSize } from '../components/core/ScreenContent';

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
  subject: {
    id: 'helpcenter.widget.tickets_form_label_subject',
    defaultMessage: 'Subject',
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
  ccDisabledRegistration: {
    id: 'helpcenter.messenger.tickets_form_cc_disabled_registration',
    defaultMessage: 'One or more CCs were not added because user registration is disabled.',
  },
};

const mapStateToProps = (state) => ({
    departments:  getTicketDepartments(state),
    priorities:   getTicketPriorities(state),
    ticketSaved:  getTicketSavedState(state),
    ticketSaving: getTicketSavingState(state),
    formCache:    getTicketFormCache(state),
    user:         getUser(state),
    isUserSet:    isUserSet(state),
    isOrgSet:     isOrgSet(state),
    errors:       getErrors(state),
    ticket:       getTicket(state),
});

class TicketFormScreen extends React.Component {
  static propTypes = {
    formConfig:   PropTypes.array.isRequired,
    uploadTo:     PropTypes.string.isRequired,
    saveTicket:   PropTypes.func.isRequired,
    newTicket:    PropTypes.func.isRequired,
    cacheForm:    PropTypes.func.isRequired,
    departments:  PropTypes.object.isRequired,
    intl:         PropTypes.object.isRequired,
    user:         PropTypes.object,
    language:     PropTypes.object,
    userId:       PropTypes.bool,
    ticketSaved:  PropTypes.bool,
    ticketSaving: PropTypes.bool,
    isUserSet:    PropTypes.bool,
    isOrgSet:     PropTypes.bool,
    formCache:    PropTypes.object,
    widget:       PropTypes.object,
  };

  static defaultProps = {
    ticketSaved: false,
    ticketSaving: false,
    formCache: {},
    user: {name: '', email: ''},
    language: {},
  };

  onSubmit = (values) => {
    this.props.cacheForm({values: {}});
    return this.props.saveTicket(values);
  };

  cacheForm = (form) => {
    this.props.cacheForm(form);
  };

  componentDidMount() {
    this.props.newTicket();
  }

  componentDidUpdate() {
    if(this.props.ticketSaving === true) {
      setTimeout(() => this.props.contentSize.scrollArea.current.scrollTop(), 50);
    }
  }

  render() {
    const {
      intl,
      formConfig,
      widget,
      uploadTo,
      departments,
      priorities,
      department,
      ticketSaved,
      ticketSaving,
      errors,
      ticket,
      user,
      formCache,
      isUserSet,
      isOrgSet
    } = this.props;
    const converted = formConfig.map((d) => {
      if(d.fields) {
        d.fields.forEach((f, i) => {
          if(f.field_type === 'person') {
            d.fields[i].is_disabled = isUserSet;
          } else if (f.field_type === 'org_field' && !isOrgSet) {
            // the user has no organization (probably a guest, or just homeless one)
            delete d.fields[i];
          }
        });
        d.fields = d.fields.filter(item => item);
      }

      return d;
    });
    const immutableLayout = fromJSGreedy(converted);
    const initialValues = _cloneDeep(formCache);
    if (!initialValues.person) {
      initialValues.person = {name: user.name, email: user.email};
    } else {
      initialValues.person.name = formCache.person.name || user.name;
      initialValues.person.email = (formCache.person.email && formCache.person.email.email) ? formCache.person.email.email : user.email;
    }

    // Check if all ccs were added
    let missingCcs = false;
    if (ticketSaved && !ticketSaving && ticket) {
      const { ccs: submittedCcs } = formCache;
      const submittedCcsCount = submittedCcs ? submittedCcs.length : 0;
      const savedCcsCount = ticket.cc ? ticket.cc.length : 0;

      console.log('check missing ccs')
      console.log('submittedCcs', submittedCcs)
      console.log('savedCcs', ticket.cc)

      missingCcs = submittedCcsCount !== savedCcsCount;
    }

    console.log('misisng ccs', missingCcs, ticket, formCache)

    return (
      <Fragment>
        <Header icon={widget.icon.download_url} />
        <Block
          title={intl.formatMessage({
            id: `helpcenter.messenger.tickets_form_header`,
            defaultMessage: 'New Ticket'
          })}
        >
          {!ticketSaved && errors && errors.general && (
            <div className="dp-pc_field">
              <span className="dp-pc_error_message">{errors.general}</span>
            </div>
          )}
          {ticketSaving && (
            <div className="dp-pc_field">
              <FormattedMessage
                id="helpcenter.messenger.tickets.form.saving"
                defaultMessage="We're saving your ticket. Please wait"
              />
            </div>
          )}
            {!ticketSaved && (
              <TicketForm
                initialValues={initialValues}
                deskproLayout={immutableLayout}
                departmentPropName="department"
                departments={fromJSGreedy(departments)}
                priorities={fromJSGreedy(priorities)}
                department={formCache.department || department}
                fileUploadUrl={uploadTo}
                csrfToken="not_used"
                onSubmit={this.onSubmit}
                onChange={this.cacheForm}
                errors={errors}
                languageId={parseInt(this.props.language.id, 10)}
                i18n={{
                  name:          intl.formatMessage(transMessages.name),
                  email:         intl.formatMessage(transMessages.email),
                  department:    intl.formatMessage(transMessages.department),
                  subject:       intl.formatMessage(transMessages.subject),
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
                }}
              />
            )}

          {ticketSaved && !ticketSaving && (
            [
              missingCcs && (
                <div className="dpmsg-ChatMessagesDropZoneError">
                  <i className="fa fa-2x fa-exclamation-triangle" />
                  <FormattedMessage
                    {...transMessages.ccDisabledRegistration}
                  />
                </div>
              ),
              <div className="dpmsg-BlockInnerIcon">
                <i className="dpmsg-Icon dpmsg-Icon--Round dpmsg-IconRocket" />
              </div>,
              <div className="dpmsg-BlockInnerHeader">
                <FormattedMessage
                id="helpcenter.messenger.tickets_form_thanks_header"
                defaultMessage="Your request on its way"
                  />
              </div>,
              <div className="dpmsg-BlockInnerContent">
                <FormattedMessage
                  id="helpcenter.messenger.tickets_form_thanks"
                  defaultMessage="Thank you for contacting us. One of our team will be in touch with you via email."
                />
              </div>
            ]
          )}
        </Block>
      </Fragment>
    );
  }
}

export default compose(
  withConfig,
  withScreenContentSize,
  connect(
    mapStateToProps,
    { saveTicket, newTicket, cacheForm }
  ),
  injectIntl
)(TicketFormScreen);
