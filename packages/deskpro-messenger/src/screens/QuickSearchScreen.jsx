import { connect } from 'react-redux';
import { getSearchQuery, getSearchResults, search } from '../modules/search';
import SearchBlock from '../components/common/SearchBlock';
import React, { Fragment } from 'react';
import Header from '../components/ui/Header';

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
  (props) =>
    <Fragment>
      <Header />
      <QuickSearchScreen {...props} />
    </Fragment>
);

