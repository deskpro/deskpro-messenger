import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
// Import only JS files, styles are imported in Window.jsx inline into iframe.
import 'froala-editor/js/froala_editor.pkgd.min.js';
import $ from 'jquery';
import FroalaEditor from 'react-froala-wysiwyg';
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
  $.FroalaEditor.DefineIcon('sendMessage', { NAME: 'Send', template: 'dpmsg' });
};

class MessageForm extends PureComponent {
  static propTypes = {
    onSend: PropTypes.func.isRequired
  };

  state = { message: '' };

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
      this.handleSubmit(e);
      return false;
    }
    return e;
  };

  froalaConfig = {
    toolbarBottom: true,
    toolbarButtons: ['emoticons', 'insertFile', 'sendMessage'],
    shortcutsEnabled: ['bold', 'italic', 'underline'],
    enter: $.FroalaEditor.ENTER_BR,
    placeholderText: false,
    charCounterCount: false,
    emoticonsUseImage: false,
    key: process.env.REACT_APP_FROALA_KEY,
    events: {
      'froalaEditor.initialized': this.onFroalaInit
    },
    pluginsEnabled: ['file', 'emoticons']
  };

  onChange = (message) => this.setState({ message });

  handleSubmit = (e) => {
    e.preventDefault && e.preventDefault();
    const { message } = this.state;
    this.props.onSend(message);
    this.setState({ message: '' });
  };

  render() {
    return (
      <div className="dpmsg-WrapTextarea">
        <FroalaEditor
          model={this.state.message}
          onModelChange={this.onChange}
          onManualControllerReady={this.onFroalaManualInit}
          config={this.froalaConfig}
        />
      </div>
    );
  }
}

export default MessageForm;
