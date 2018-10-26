import { PureComponent } from 'react';
import { connect } from 'react-redux';
import _isEmpty from 'lodash/isEmpty';

import { loadAppInfo, getDepartments } from '../modules/info';

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
  { loadData: loadAppInfo }
)(PreloadData);
