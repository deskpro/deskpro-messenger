import { connect } from 'react-redux';
import { getVisitorId } from '../modules/guest';

const mapStateToProps = (state) => ({ visitorId: getVisitorId(state) });
export const withVisitorId = connect(mapStateToProps);
export default withVisitorId;
