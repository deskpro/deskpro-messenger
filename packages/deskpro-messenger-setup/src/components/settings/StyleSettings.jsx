import React from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import { Colorpicker, Drawer, Heading, Label } from '@deskpro/react-components';

class StyleSettings extends React.PureComponent {
  static propTypes = {
    config: PropTypes.object
  };

  static defaultProps = {
    config: Immutable.fromJS({})
  };

  render() {
    const { config } = this.props;
    return (
      <Drawer>
        <Heading>Style</Heading>
        <Label>Background color</Label>
        <Colorpicker value={config.getIn(['style'], ['backgroundColor'])} />

        <Label>Primary color</Label>
        <Colorpicker value={config.getIn(['style'], ['primaryColor'])} />
      </Drawer>
    );
  }
}
export default StyleSettings;