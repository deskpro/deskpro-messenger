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
          <input onChange={this.onChange} value={this.state.query} />
          {(this.state.query.length >= 3 && !this.props.results.length) && <div>No results</div>}
          {this.state.query.length >= 3 && this.props.results.map((r) => (<div><h4>{r.title}</h4>{r.excerpt}<a target="_parent" href={r.link}>view more</a></div>))}
        </div>
      </div>
    );
  }
}


export default connect((state) => ({ results: getSearchResults(state) }), { quickSearch })(QuickSearchBlock);

