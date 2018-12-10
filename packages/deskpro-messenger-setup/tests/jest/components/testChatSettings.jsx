import React from 'react';
import renderer from 'react-test-renderer';
import ChatSettings from '../../../src/components/settings/ChatSettings';
import noop from '@deskpro/js-utils/dist/noop';

const mockMath = Object.create(global.Math);
mockMath.random = () => 0.5;
global.Math = mockMath;

it('+++capturing Snapshot of BooleanInput with true set', () => {
  const renderedValue = renderer.create(
    <ChatSettings
      handleChange={noop}
    />
  ).toJSON();
  expect(renderedValue).toMatchSnapshot();
});
