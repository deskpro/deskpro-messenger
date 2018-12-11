import React from 'react';
import renderer from 'react-test-renderer';
import ChatSettings from '../../../src/components/settings/ChatSettings';
import noop from '@deskpro/js-utils/dist/noop';
import Immutable from "immutable";

const mockMath = Object.create(global.Math);
mockMath.random = () => 0.5;
global.Math = mockMath;

const departments = [
  { id: 3, title: 'Sales' }, { id: 4, title: 'Support' }
];

it('+++capturing Snapshot of BooleanInput with true set', () => {
  const renderedValue = renderer.create(
    <ChatSettings
      handleChange={noop}
      chatDepartments={Immutable.fromJS(departments)}
    />
  ).toJSON();
  expect(renderedValue).toMatchSnapshot();
});
