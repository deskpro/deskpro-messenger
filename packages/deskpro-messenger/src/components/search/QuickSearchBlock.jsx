import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { getSearchResults, quickSearch } from '../../modules/search';

class QuickSearchBlock extends React.Component {
  static propTypes = {
    title: PropTypes.string,
    quickSearch: PropTypes.func.isRequired,
    results: PropTypes.arrayOf(PropTypes.object)
  };

  static defaultProps = {
    results: []
  };

  state = { query: '' };

  onChange = (e) => {
    const value = e.target.value;
    this.setState({query: value}, () => this.props.quickSearch(value));

  };

  render() {
    const { title, className } = this.props;

    return (
      <div className={classNames('dpmsg-Block', className)}>
        <div className="dpmsg-BlockWrapper">
          {!!title && <div className="dpmsg-BlockHeader">{title}</div>}
          <div className="dpmsg-QuickSearchControl">
            <div className="dpmsg-QuickSearchControl--wrapper">
              <input className="dpmsg-QuickSearchControl--input" id="quickSearchInput" onChange={this.onChange} value={this.state.query} />
              <label className="dpmsg-QuickSearchControl--label" htmlFor="quickSearchInput">
                <i className="fa fa-search" />
                <span aria-hidden={true}>Search</span>
              </label>
            </div>
            <div className="dpmsg-QuickSearchControl--hint">
              <span>
                {this.state.query.length >= 3 ? `${(!this.props.results.length ? 'No results' : 'Search results')} for "${this.state.query}"` : null }
              </span>
            </div>
          </div>

          <div className="dpmsg-QuickSearchResults">
            {this.state.query.length >= 3 && this.props.results.map((r) => (
              <div className="dpmsg-QuickSearchEntry">
                <h4 className="dpmsg-QuickSearchEntryHeaderLink"><a rel="noreferrer noopener" target="_blank" href={r.link}>{r.title}</a></h4>
                <div className="dpmsg-QuickSearchExcerpt">
                  {r.excerpt}
                </div>
                <div className="dpmsg-QuickSearchEntry--divider" />
              </div>))}
          </div>
        </div>
      </div>
    );
  }
}


export default connect((state) => ({ results: getSearchResults(state) }), { quickSearch })(QuickSearchBlock);

