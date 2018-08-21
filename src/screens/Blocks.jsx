import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';

import Block from '../components/core/Block';
import Button from '../components/form/Button';

const blocksMapping = {
  StartChatBlock: ({ to, linkText = 'Start Chat' }) => (
    <Block title="Conversations">
      <Button to={`/screens/${to}`} width="full">
        {linkText}
      </Button>
    </Block>
  ),
  TicketsBlock: () => (
    <Block title="Your Tickets">
      <Link to="/screens/tickets">view all</Link>
    </Block>
  ),
  ScreenLink: ({ to, label, blockTitle }) => (
    <Block title={blockTitle}>
      <Link to={`/screens/${to}`}>{label}</Link>
    </Block>
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
