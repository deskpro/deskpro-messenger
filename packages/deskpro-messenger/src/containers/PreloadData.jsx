import { PureComponent } from 'react';
import { connect } from 'react-redux';
import _isEmpty from 'lodash/isEmpty';

import { loadDepartments, getDepartments } from '../modules/departments';

class PreloadData extends PureComponent {
  componentDidMount() {
    this.props.loadData();
  }

  render() {
    if (_isEmpty(this.props.data)) {
      return null;
    }
    return this.props.children;
  }
}

const mapStateToProps = (state) => ({
  data: getDepartments(state)
});
export default connect(
  mapStateToProps,
  { loadData: loadDepartments }
)(PreloadData);
