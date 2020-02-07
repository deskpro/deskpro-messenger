import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Link } from 'react-router-dom';

class SearchBlock extends React.Component {
  static propTypes = {
    title: PropTypes.string,
    search: PropTypes.func.isRequired,
    results: PropTypes.arrayOf(PropTypes.object),
    query: PropTypes.string
  };

  static defaultProps = {
    results: [],
    query: '',
  };

  constructor(props) {
    super(props);
    this.state = {
      query: props.query
    }
  }

  componentDidMount() {
    this.props.search(this.state.query)
  }

  onChange = (e) => {
    const value = e.target.value;
    this.setState({query: value}, () => this.props.search(value));

  };

  getSearchHint() {
    return (
      <span>
        {this.state.query.length >= 3 ? `${(this.props.results.length < 1 ? 'No results' : 'Search results')} for "${this.state.query}"` : null }
      </span>
    );
  }

  getResults() {
    return this.props.results.slice(0, 3);
  }

  getSeeMore() {
    return this.props.results.length > 3 && <Link to="/screens/search" className="dpmsg-QuickSearchFooter">See more results</Link>;
  }

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
              {this.getSearchHint()}
            </div>
          </div>

          <div className="dpmsg-QuickSearchResults">
            {this.state.query.length >= 3 && this.getResults().map((r) => (
              <div className="dpmsg-QuickSearchEntry">
                <h4 className="dpmsg-QuickSearchEntryHeaderLink"><a rel="noreferrer noopener" target="_blank" href={r.link}>{r.title}</a></h4>
                <div className="dpmsg-QuickSearchExcerpt">
                  {r.excerpt}
                </div>
                <div className="dpmsg-QuickSearchEntry--divider" />
              </div>))}
            {this.getSeeMore()}
          </div>
        </div>
      </div>
    );
  }
}


export default SearchBlock;
