import { connect } from 'react-redux';
import { getSearchQuery, getSearchResults, quickSearch } from '../../modules/search';
import SearchBlock from '../common/SearchBlock';

class QuickSearchBlock extends SearchBlock {

}


export default connect((state) => ({ results: getSearchResults(state), query: getSearchQuery(state) }), { search: quickSearch })(QuickSearchBlock)

