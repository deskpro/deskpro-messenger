import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';

const blocksMapping = {
  StartChatBlock: ({ to }) => (
    <div>
      <Link to={`/${to}`}>Start Chat</Link>
    </div>
  ),
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

const Blocks = ({ blocks }) => (
  <Fragment>
    {blocks.map(({ blockType, ...props }) => {
      const Component = blocksMapping[blockType];
      return Component ? <Component key={blockType} {...props} /> : null;
    })}
  </Fragment>
);

export default Blocks;
