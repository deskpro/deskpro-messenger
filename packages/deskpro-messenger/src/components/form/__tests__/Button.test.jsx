import React from 'react';
import { render, fireEvent } from '../../../utils/tests';

import Button from '../Button';

describe('<Button />', () => {
  it('should render correctly as button', () => {
    const onClick = jest.fn();
    const { getByText, asFragment } = render(
      <Button width="full" color="primary" onClick={onClick}>
        Button Label
      </Button>
    );

    expect(asFragment()).toMatchSnapshot();
    expect(getByText('Button Label')).toBeInTheDocument();
    fireEvent.click(getByText('Button Label'));
    expect(onClick).toBeCalled();
  });

  it('should render correctly as link', () => {
    const { getByText, asFragment } = render(
      <Button size="medium" color="transparent" textOnly to="/screens/index">
        Button Label
      </Button>
    );

    expect(asFragment()).toMatchSnapshot();
    expect(getByText('Button Label')).toBeInTheDocument();
    expect(getByText('Button Label').href).toBe(
      'http://localhost/screens/index'
    );
  });
});
