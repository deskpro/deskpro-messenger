import React from 'react';
import { render } from '../../../utils/tests';

import Block from '../Block';

describe('<Block />', () => {
  it('should render correctly with title', () => {
    const { getByText, asFragment } = render(
      <Block title="Some Title">
        <div>Block Content</div>
      </Block>
    );

    expect(asFragment()).toMatchSnapshot();
    expect(getByText('Some Title')).toBeInTheDocument();
    expect(getByText('Block Content')).toBeInTheDocument();
  });

  it('should render correctly without title', () => {
    const { getByText, asFragment } = render(
      <Block>
        <div>Block Content</div>
      </Block>
    );

    expect(asFragment()).toMatchSnapshot();
    expect(getByText('Block Content')).toBeInTheDocument();
  });
});
