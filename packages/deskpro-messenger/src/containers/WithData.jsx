import { connect } from 'react-redux';
import _isEmpty from 'lodash/isEmpty';

import { getChatDepartments } from '../modules/info';

const WithData = ({ data, children }) => (_isEmpty(data) ? null : children);

export default connect((state) => ({ data: getChatDepartments(state) }))(WithData);
