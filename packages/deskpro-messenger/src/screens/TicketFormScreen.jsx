import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from "redux";
import { FormattedMessage, injectIntl } from 'react-intl';
import { fromJSGreedy } from '../utils/common';

import Block from '../components/core/Block';
import { TicketForm } from '@deskpro/portal-components';
import { getErrors, getTicketSavedState, getTicketSavingState, newTicket, saveTicket } from '../modules/tickets';
import { getTicketDepartments, getTicketPriorities } from '../modules/info';
import { getUser, isUserSet } from '../modules/guest';
import Header from '../components/ui/Header';
import { withConfig } from '../components/core/ConfigContext';

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
};

const mapStateToProps = (state) => ({
    departments:  getTicketDepartments(state),
    priorities:   getTicketPriorities(state),
    ticketSaved:  getTicketSavedState(state),
    ticketSaving: getTicketSavingState(state),
    user:         getUser(state),
    isUserSet:    isUserSet(state),
    errors:       getErrors(state)
});

class TicketFormScreen extends React.Component {
  static propTypes = {
    formConfig:   PropTypes.array.isRequired,
    uploadTo:     PropTypes.string.isRequired,
    saveTicket:   PropTypes.func.isRequired,
    newTicket:    PropTypes.func.isRequired,
    departments:  PropTypes.object.isRequired,
    intl:         PropTypes.object.isRequired,
    user:         PropTypes.object,
    language:     PropTypes.object,
    userId:       PropTypes.bool,
    ticketSaved:  PropTypes.bool,
    ticketSaving: PropTypes.bool,
    widget:       PropTypes.object,
  };

  static defaultProps = {
    ticketSaved: false,
    ticketSaving: false,
    user: {name: '', email: ''},
    language: {},
  };

  onSubmit = (values) => {
    return this.props.saveTicket(values);
  };

  componentDidMount() {
    this.props.newTicket();
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
      user,
      isUserSet
    } = this.props;
    const converted = formConfig.map((d) => {
      if(d.fields) {
        d.fields.forEach((f, i) => {
          if(f.field_type === 'person') {
            d.fields[i].is_disabled = isUserSet;
          }
        });
      }

      return d;
    });
    const immutableLayout = fromJSGreedy(converted);

    return (
      <Fragment>
        <Header icon={widget.icon.download_url} />
        <Block
          title={intl.formatMessage({
            id: `helpcenter.messenger.tickets_form_header`,
            defaultMessage: 'New Ticket'
          })}
        >
          {ticketSaving && (
            <FormattedMessage
              id="tickets.form.saving"
              defaultMessage="We're saving your ticket. Please wait"
            />
          )}
            {!ticketSaved && (
              <TicketForm
                initialValues={{ person: user }}
                deskproLayout={immutableLayout}
                departmentPropName="department"
                departments={fromJSGreedy(departments)}
                priorities={fromJSGreedy(priorities)}
                department={department}
                fileUploadUrl={uploadTo}
                csrfToken="not_used"
                onSubmit={this.onSubmit}
                errors={errors}
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
                }}
              />
            )}

          {ticketSaved && !ticketSaving && (
            [
              <div className="dpmsg-BlockInnerIcon">
                <i className="dpmsg-Icon dpmsg-Icon--Round dpmsg-IconRocket" />
              </div>,
              <div className="dpmsg-BlockInnerHeader">
                <FormattedMessage
                id="tickets.form.thanks_header"
                defaultMessage="Your request on its way"
                  />
              </div>,
              <div className="dpmsg-BlockInnerContent">
                <FormattedMessage
                  id="tickets_form_thanks"
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
  connect(
    mapStateToProps,
    { saveTicket, newTicket }
  ),
  injectIntl
)(TicketFormScreen);
