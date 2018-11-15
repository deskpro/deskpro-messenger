import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
// import { FrameContextConsumer } from 'react-frame-component';
// Import only JS files, styles are imported in Window.jsx inline into iframe.
import 'froala-editor/js/froala_editor.pkgd.min.js';
import $ from 'jquery';
import FroalaEditor from 'react-froala-wysiwyg';

import { ConfigContext } from '../core/ConfigContext';
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
    frameContext: PropTypes.object.isRequired
  };

  static contextType = ConfigContext;

  state = { message: '' };
  uploadedFiles = [];
  wrapperRef = React.createRef();
  froalaRef = React.createRef();

  onFroalaInit = (_, editor) => {
    this.editor = editor;
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

  froalaConfig = {
    requestHeaders: {
      'X-DESKPRO-VISITORID': this.props.visitorId
    },
    imageUploadMethod: 'POST',
    imageUploadURL: `${this.context.helpdeskURL}api/messenger/file/upload-file`,
    fileUploadMethod: 'POST',
    fileUploadURL: `${this.context.helpdeskURL}api/messenger/file/upload-file`,
    toolbarBottom: true,
    toolbarButtons: ['emoticons', 'insertFile', 'insertImage', 'sendMessage'],
    imageEditButtons: [],
    shortcutsEnabled: ['bold', 'italic', 'underline'],
    enter: $.FroalaEditor.ENTER_BR,
    placeholderText: false,
    charCounterCount: false,
    emoticonsUseImage: false,
    key: this.context.froalaKey,
    events: {
      'froalaEditor.initialized': this.onFroalaInit,
      'froalaEditor.file.uploaded': this.fileUploaded,
      'froalaEditor.image.uploaded': this.fileUploaded
    },
    pluginsEnabled: ['file', 'image', 'emoticons'],
    scrollableContainer: $(this.props.frameContext.document).find('body')
  };

  onChange = (message) => this.setState({ message });

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
    return (
      <div className="dpmsg-WrapTextarea" ref={this.wrapperRef}>
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

export default withVisitorId(withFrameContext(MessageForm));
