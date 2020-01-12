import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { quickSearch, getSearchResults } from '../../modules/search';

class QuickSearchBlock extends React.Component {
  static propTypes = {
    title: PropTypes.string,
    results: PropTypes.arrayOf(PropTypes.object)
  };

  static defaultProps = {
    results: []
  };

  state = { query: '' };

  onChange = (e) => {
    this.setState({query: e.target.value});
    quickSearch(e.target.value);
  };

  render() {
    const { title, className } = this.props;

    return (
      <div className={classNames('dpmsg-Block', className)}>
        <div className="dpmsg-BlockWrapper">
          {!!title && <div className="dpmsg-BlockHeader">{title}</div>}
          <input onChange={this.onChange} value={this.state.query} />
          {(this.state.query && !this.props.results.length) && <div>No results</div>}
          {this.props.results.map((r) => (<div><h4>{r.title}</h4>{r.excerpt}<a target="_parent" href={r.link}>view more</a></div>))}
        </div>
      </div>
    );
  }
}


export default connect((state) => ({ results: getSearchResults(state) }))(QuickSearchBlock);

