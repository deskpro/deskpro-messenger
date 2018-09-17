import React from 'react';
import PropTypes from 'prop-types';
import { LayoutConfig } from '@deskpro/portal-components';
import { injectIntl } from 'react-intl';

import translateFieldLayout from '../../utils/translateFieldLayout';

export default (WrappedComponent) => {
  class TranslatedLayout extends React.PureComponent {
    static propTypes = {
      formConfig: PropTypes.array.isRequired,
      intl: PropTypes.shape({
        formatMessage: PropTypes.func.isRequired
      })
    };
    static displayName = `withTranslatedLayout(${WrappedComponent.displayName ||
      WrappedComponent.name})`;

    render() {
      const { formConfig, ...props } = this.props;
      return (
        <WrappedComponent
          {...props}
          layouts={
            new LayoutConfig(
              translateFieldLayout(formConfig, props.intl.formatMessage)
            )
          }
        />
      );
    }
  }

  return injectIntl(TranslatedLayout);
};
