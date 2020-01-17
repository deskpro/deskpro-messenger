import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
// import { FrameContextConsumer } from 'react-frame-component';
// Import only JS files, styles are imported in Window.jsx inline into iframe.
import 'froala-editor/js/froala_editor.pkgd.min.js';
import $ from 'jquery';
import FroalaEditor from 'react-froala-wysiwyg';

import { ConfigContext, withConfig } from '../core/ConfigContext';
import { withFrameContext } from '../core/Frame';
import { withVisitorId } from '../../containers/withVisitorId';

window.$ = window.jQuery = $;

/**
 * Extends Froala editor.
 */
const extendFroala = () => {
  $.FroalaEditor.ICON_TEMPLATES['dpmsg'] = '<i class="dpmsg-Icon[NAME]"></i>';
  $.FroalaEditor.DefineIcon('emoticons', { NAME: 'Smile', template: 'dpmsg' });
  $.FroalaEditor.DefineIcon('insertFile', {
    NAME: 'Attach',
    template: 'dpmsg'
  });
  $.FroalaEditor.DefineIcon('insertImage', {
    NAME: 'ImageUpload',
    template: 'dpmsg'
  });
  $.FroalaEditor.DefineIcon('sendMessage', { NAME: 'Send', template: 'dpmsg' });
};

class MessageForm extends PureComponent {
  static propTypes = {
    visitorId: PropTypes.string.isRequired,
    onSend: PropTypes.func.isRequired,
    frameContext: PropTypes.object.isRequired,
    className: PropTypes.string,
    style: PropTypes.object,
    maxFileSize: PropTypes.number.isRequired,
  };

  static contextType = ConfigContext;

  state = { message: '' };
  uploadedFiles = [];
  wrapperRef = React.createRef();
  froalaRef = React.createRef();

  onFroalaInit = (_, editor) => {
    this.editor = editor;
    this.editor.events.focus();
    editor.events.on('keydown', this.handleKeydown, true);
  };

  onFroalaManualInit = (controls) => {
    this.editorControls = controls;
    extendFroala();
    $.FroalaEditor.RegisterCommand('sendMessage', {
      title: 'Send Message',
      callback: this.handleSubmit
    });
    this.editorControls.initialize();
  };

  handleKeydown = (e) => {
    if (
      e.keyCode === 13 &&
      !(e.ctrlKey || e.metaKey || e.shiftKey || e.altKey)
    ) {
      e.stopPropagation();
      this.froalaRef.current.updateModel();
      this.handleSubmit(e);
      return false;
    }
    return e;
  };

  fileUploaded = (e, editor, response) => {
    const { blob_id } = JSON.parse(response);
    this.uploadedFiles.push(blob_id);
  };

  fileError = (event, editor, error, response) => {
    const err = [];
    if (!response && error) {
      err.push(error.message);
    } else if (error && response) {
      err.push(error.message);
    } else {
      try {
        const { errors } = JSON.parse(response);
        for (let [, error] of Object.entries(errors)) {
          err.push(error);
        }
      } catch (e) {
        err.push(e.message);
      }
    }
    if(err.length > 0) {
      const $popup = editor.popups.get('file.insert') || editor.popups.get('file.insert');
      const $layer = $popup.find('.fr-layer');
      $layer.find('h3').text(err.join(' '));
    }

  };

  froalaConfig = {
    requestHeaders: {
      'X-DESKPRO-VISITORID': this.props.visitorId
    },
    imageUploadMethod: 'POST',
    imageUploadURL: `${this.context.helpdeskURL}/api/messenger/file/upload-file`,
    fileUploadMethod: 'POST',
    fileUploadURL: `${this.context.helpdeskURL}/api/messenger/file/upload-file`,
    fileMaxSize: this.props.maxFileSize || (1024*1024*10),
    toolbarBottom: true,
    toolbarButtons: ['sendMessage', 'emoticons', 'insertFile', 'insertImage'],
    imageEditButtons: [],
    shortcutsEnabled: ['bold', 'italic', 'underline'],
    enter: $.FroalaEditor.ENTER_BR,
    placeholderText: false,
    charCounterCount: false,
    emoticonsUseImage: false,
    key: 'MC1D2D1G2lG4J4A14A7D3D6F6C2C3F3gSXSE1LHAFJVCXCLS==',
    events: {
      'froalaEditor.initialized': this.onFroalaInit,
      'froalaEditor.file.uploaded': this.fileUploaded,
      'froalaEditor.image.uploaded': this.fileUploaded,
      'froalaEditor.file.error': this.fileError,
      'froalaEditor.image.error': this.fileError
    },
    pluginsEnabled: ['file', 'image', 'emoticons'],
    scrollableContainer: $(this.props.frameContext.document).find('body')
  };

  handleTyping = (message) => {
    this.props.onSend({
      message: message
    }, 'chat.typing.start');
  };

  onChange = (message) => this.setState({ message }, () => this.handleTyping(message));

  handleSubmit = (e) => {
    e.preventDefault && e.preventDefault();
    if (this.state.message) {
      this.props.onSend({
        message: this.state.message,
        blobs: this.uploadedFiles
      });
      this.setState({ message: '' }, () => {
        this.uploadedFiles = [];
      });
    }
  };

  render() {
    const { className, style } = this.props;

    return (
      <div
        className={classNames('dpmsg-WrapTextarea', className)}
        ref={this.wrapperRef}
        style={style}
      >
        <FroalaEditor
          ref={this.froalaRef}
          model={this.state.message}
          onModelChange={this.onChange}
          onManualControllerReady={this.onFroalaManualInit}
          config={this.froalaConfig}
        />
      </div>
    );
  }
}

export default withVisitorId(withFrameContext(withConfig(MessageForm)));
