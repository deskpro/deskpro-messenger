import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import Isvg from 'react-inlinesvg';
import asset from '../../utils/asset';

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
      query: props.query,
      focused: false
    }
  }

  componentDidMount() {
    this.props.search(this.state.query)
  }

  getSearchHint() {
    return this.state.query.length >= 3 && this.props.results.length < 1 ? (
      <span>
        {`No results for "${this.state.query}"`}
      </span>
    ) : null;
  }

  getResults() {
    return this.props.results.slice(0, 3);
  }

  getSeeMore() {
    return this.props.results.length > 3 && <Link to="/screens/search" className="dpmsg-QuickSearchFooter">See more results</Link>;
  }

  onChange = (e) => {
    const value = e.target.value;
    this.setState({query: value}, () => this.props.search(value));
  };

  onClear = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({query: ''}, () => this.props.search(''));
  };

  render() {
    const { title, className } = this.props;

    return (
      <div className={classNames('dpmsg-Block', className)}>
        <div className="dpmsg-BlockWrapper">
          {!!title && <div className="dpmsg-BlockHeader">{title}</div>}
          <div className="dpmsg-QuickSearchControl">
            <div className={classNames("dpmsg-QuickSearchControl--wrapper", {focused: this.state.focused})}>
              <input
                className="dpmsg-QuickSearchControl--input"
                id="quickSearchInput"
                onChange={this.onChange}
                onFocus={() => this.setState({focused: true})}
                onBlur={() => this.setState({focused: false})}
                value={this.state.query}

              />
              <label className="dpmsg-QuickSearchControl--label" htmlFor="quickSearchInput">
                <Isvg src={asset('img/search.svg')} />
                <span aria-hidden={true}>Search</span>
              </label>
              { (this.state.query.length > 0) && <i className="dpmsg-Icon dpmsg-IconSearchClear" onClick={this.onClear} /> }
            </div>
            <div className="dpmsg-QuickSearchControl--hint">
              {this.getSearchHint()}
            </div>
          </div>

          <div className="dpmsg-QuickSearchResults">
            {this.state.query.length >= 3 && this.getResults().map((r, i) => (
              <div className="dpmsg-QuickSearchEntry" key={`search_entry_${i}`}>
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
