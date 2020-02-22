import { connect } from 'react-redux';
import { getSearchQuery, getSearchResults, search } from '../modules/search';
import SearchBlock from '../components/common/SearchBlock';
import ScrollArea from 'react-scrollbar/dist/no-css';
import React from 'react';

class QuickSearchScreen extends SearchBlock {
  getSearchHint() {
    return this.state.query.length >= 3
      ? `${(this.props.results.length < 1 ? 'No results' : `${this.props.results.length} Search results`)} for "${this.state.query}"`
      : null
  }

  getResults() {
    return this.props.results;
  }

  getSeeMore() {
    return null;
  }
}

export default connect((state) => ({ results: getSearchResults(state), query: getSearchQuery(state) }), { search })(
  (props) => <ScrollArea
    stopScrollPropagation={true}
    horizontal={false}
    style={{ height: '100%' }}
  ><QuickSearchScreen {...props} /></ScrollArea>
);

