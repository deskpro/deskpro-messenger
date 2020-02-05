import React, { lazy, PureComponent } from 'react';
import { compose } from 'redux';
import { injectIntl } from 'react-intl';
import { fromJSGreedy } from '../../utils/common';
import { connect } from 'react-redux';
import { getUser } from '../../modules/guest';
import PropTypes from 'prop-types';

const TicketForm = lazy(() => import('../tickets/LazyTicketForm'));

class SaveTicketForm extends PureComponent {

  static propTypes = {
    user: PropTypes.object,
    formConfig: PropTypes.array,
    department: PropTypes.number.isRequired,
    onSubmit: PropTypes.func.isRequired,
  };

  static defaultProps = {
    user: {},
    formConfig: [],
  };

  render() {
    const { department, formConfig, user, uploadTo, onSubmit } = this.props;
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
