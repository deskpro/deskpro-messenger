import { connect } from 'react-redux';
import _isEmpty from 'lodash/isEmpty';

import { getDepartments } from '../modules/info';

const WithData = ({ data, children }) => (_isEmpty(data) ? null : children);

export default connect((state) => ({ data: getDepartments(state) }))(WithData);
