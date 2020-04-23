import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from "react-intl";
import { getSearching, getSearchQuery, getSearchResults, search } from '../modules/search';
import SearchBlock from '../components/common/SearchBlock';
import Header from '../components/ui/Header';

const transMessages = {
  noResults: {
    id: 'helpcenter.messenger.blocks_search_block_no_results',
    defaultMessage: 'No results for {query}'
  }
}

class QuickSearchScreen extends SearchBlock {

  getSearchHint() {
    return this.state.query.length >= 3 && this.props.results.length < 1 && !this.props.searching
      ? <FormattedMessage {...transMessages.noResults} values={{query: this.state.query}} />
      : null
  }

  getResults() {
    return this.props.results;
  }

  getSeeMore() {
    return null;
  }
}

export default connect((state) => ({
    results:   getSearchResults(state),
    query:     getSearchQuery(state),
    searching: getSearching(state)
  }),
  { search })(
  (props) =>
    <Fragment>
      <Header/>
      <QuickSearchScreen {...props} />
    </Fragment>
);

