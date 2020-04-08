import { connect } from 'react-redux';
import { getSearching, getSearchQuery, getSearchResults, quickSearch } from '../../modules/search';
import SearchBlock from '../common/SearchBlock';

class QuickSearchBlock extends SearchBlock {

}


export default connect((state) => ({
    results:   getSearchResults(state),
    query:     getSearchQuery(state),
    searching: getSearching(state)
  }),
  { search: quickSearch }
)(QuickSearchBlock)

