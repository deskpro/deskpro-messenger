import { connect } from 'react-redux';
import { getSearchQuery, getSearchResults, search } from '../modules/search';
import SearchBlock from '../components/common/SearchBlock';
import React, { Fragment } from 'react';
import Header from '../components/ui/Header';

class QuickSearchScreen extends SearchBlock {
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

