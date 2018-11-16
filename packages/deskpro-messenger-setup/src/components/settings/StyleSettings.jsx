import React from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import { Colorpicker, Drawer, Heading, Label } from '@deskpro/react-components';

class StyleSettings extends React.PureComponent {
  static propTypes = {
    config: PropTypes.object,
    handleChange: PropTypes.func.isRequired
  };

  static defaultProps = {
    config: Immutable.fromJS({})
  };

  render() {
    const { config, handleChange } = this.props;
    return (
      <Drawer>
        <Heading>Style</Heading>
        <Label>Background color</Label>
        <Colorpicker
          value={config.getIn(['styles', 'backgroundColor'])}
          name="styles.backgroundColor"
          onChange={handleChange}
        />

        <Label>Primary color</Label>
        <Colorpicker
          value={config.getIn(['styles', 'primaryColor'])}
          name="styles.primaryColor"
          onChange={handleChange}
        />
      </Drawer>
    );
  }
}
export default StyleSettings;
