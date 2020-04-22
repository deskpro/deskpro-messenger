import React, { Fragment, PureComponent } from 'react';
import { Progress } from '@deskpro/portal-components';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

const transMessages = {
  dragAndDrop: {
    id: 'helpcenter.messenger.chat_dragdrop_drag_and_drop',
    defaultMessage: 'Drag and drop file here'
  },
  uploading: {
    id: 'helpcenter.messenger.chat_dragdrop_uploading',
    defaultMessage: 'Uploading'
  },
  ok: {
    id: 'helpcenter.messenger.ok',
    defaultMessage: 'OK'
  }
};

class DropArea extends PureComponent {
  static propTypes = {
    progress: PropTypes.number,
    isDragActive: PropTypes.bool,
    error: PropTypes.object,
    clearError: PropTypes.func,
  };

  static defaultProps = {
    progress: -1,
    clearError() {},
    error: null,
  };

  renderDrop = () =>
    <div>
      <i className="fa fa-3x fa-image" />
      <p>
        <FormattedMessage {...transMessages.dragAndDrop} />
      </p>
    </div>;

  renderProgress = () => {
    const { progress } = this.props;
    return (
      <div>
        {progress > 0 ? <span className="dpmsg-ChatMessagesDropZoneProgress">{Math.round(progress)} %</span> : null}
        <Progress percent={progress} />
        <p><FormattedMessage {...transMessages.uploading} />...</p>
      </div>
    );
  };

  renderError = () => {
    const { error, clearError } = this.props;
    return (
      <div className="dpmsg-ChatMessagesDropZoneError">
        <i className="fa fa-2x fa-exclamation-triangle" />
        <p>{error.message}</p>
        <button className="dpmsg-Button Button-large Button--danger" onClick={clearError}>
          <FormattedMessage
            {...transMessages.ok}
          />
        </button>
      </div>
    )
  }

  render() {
    const {
      isDragActive,
      progress,
      error,
      clearError,
      ...inputProps
    } = this.props;

    return (
      <Fragment>
        <div
          className="dpmsg-ChatMessagesDropZone"
          style={{
            display: isDragActive || progress !== -1 || error !== null ? 'block' : 'none'
          }}
        >
          {error !== null ? this.renderError() : progress === -1 ? this.renderDrop() : this.renderProgress()}
        </div>
        <input {...inputProps} />
      </Fragment>
    );
  }
}

export default DropArea;
