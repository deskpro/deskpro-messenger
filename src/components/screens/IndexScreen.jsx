import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';

import { ConfigConsumer } from '../core/ConfigContext';

const blocks = {
  conversations: ({ category }) => (
    <Fragment>
      <h2>You Conversations</h2>
      <Link to={`/conversations/${category}`}>
        Start {category} conversation
      </Link>
    </Fragment>
  ),
  tickets: () => (
    <Fragment>
      <h2>Your Tickets</h2>
      <Link to="/tickets">view all</Link>
    </Fragment>
  ),
  search: () => <h2>Quick Search</h2>,
  contact_us: () => <h2>Contact Us</h2>
};

const IndexScreen = () => (
  <ConfigConsumer>
    {({ features = [] }) =>
      features.map(({ type, options = {} }) => {
        const Component = blocks[type];
        return Component ? <Component key={type} {...options} /> : null;
      })
    }
  </ConfigConsumer>
);

export default IndexScreen;
