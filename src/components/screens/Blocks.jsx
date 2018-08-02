import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';

const blocksMapping = {
  StartChatBlock: ({ to }) => (
    <div>
      <Link to={`/${to}`}>Start Chat</Link>
    </div>
  ),
  TicketsBlock: () => (
    <Fragment>
      <h2>Your Tickets</h2>
      <Link to="/tickets">view all</Link>
    </Fragment>
  ),
  ScreenLink: ({ to, label }) => (
    <div>
      <Link to={`/${to}`}>{label}</Link>
    </div>
  )
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
