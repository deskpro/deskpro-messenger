import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import 'froala-editor/js/froala_editor.pkgd.min.js';
import $ from 'jquery';
import FroalaEditor from 'react-froala-wysiwyg';

import { ConfigContext, withConfig } from '../core/ConfigContext';
import { withVisitorId } from '../../containers/withVisitorId';
import { setMessageFormFocus } from '../../modules/app';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { injectIntl } from "react-intl";

window.$ = window.jQuery = $;

const PATH = '<path d="M12 18L8.25003 26.925L29.25 18L8.25003 9.07501L12 18Z" stroke="#4C4F50" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>\n<path d="M29.25 18H12" stroke="#4C4F50" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>';

const transMessages = {
  sendMessage: {
    id: 'helpcenter.messenger.chat_send_message',
    defaultMessage: 'Send Message'
  },
  attachFile: {
    id: 'helpcenter.messenger.chat_attach_file',
    defaultMessage: 'Attach File'
  },
};

/**
 * Extends Froala editor.
 */
const extendFroala = () => {
  $.FroalaEditor.ICON_TEMPLATES['dpmsg'] = '<i class="dpmsg-Icon dpmsg-Icon[NAME]"></i>';
  $.FroalaEditor.DefineIcon('emoticons', { NAME: 'Smile', template: 'dpmsg' });
  $.FroalaEditor.DefineIcon('attachFile', {
    NAME: 'Attach',
    template: 'dpmsg'
  });
  $.FroalaEditor.DefineIcon('sendMessage', { PATH: PATH, template: 'svg' });
};

class MessageForm extends PureComponent {
  static propTypes = {
    visitorId:      PropTypes.string.isRequired,
    onSend:         PropTypes.func.isRequired,
    frameContext:   PropTypes.object.isRequired,
    className:      PropTypes.string,
    style:          PropTypes.object,
    maxFileSize:    PropTypes.number.isRequired,
    scrollMessages: PropTypes.func,
    language:       PropTypes.object,
    intl:           PropTypes.object.isRequired,
  };

  static contextType = ConfigContext;

  state = {
    message: '',
    wrapperHeight: 0,
  };

  wrapperRef = React.createRef();
  froalaRef = React.createRef();

  onFroalaInit = (e, editor) => {
    this.editor = editor;
    editor.events.on('keydown', this.handleKeydown, true);
  };

  onFroalaManualInit = (controls) => {
    this.editorControls = controls;
    const { handleFileSend, intl } = this.props;
    extendFroala();
    $.FroalaEditor.RegisterCommand('sendMessage', {
      title: intl.formatMessage(transMessages.sendMessage),
      callback: this.handleSubmit
    });
    $.FroalaEditor.RegisterCommand('attachFile', {
      title: intl.formatMessage(transMessages.attachFile),
      focus: false,
      undo: false,
      refreshAfterCallback: false,
      callback: function () {
        const input = document.createElement('input');
        input.type = 'file';
        input.style.display = 'none';

        input.onchange = e => {
          const file = e.target.files[0];
          handleFileSend(file);
        };

        window.document.body.appendChild(input);

        input.click();
      }
    });
    this.editorControls.initialize();
  };

  updateHeight = () => {
    if (this.props.scrollMessages) {
      const wrapperHeight = Math.ceil(this.wrapperRef.current.offsetHeight);
      if (wrapperHeight !== this.state.wrapperHeight) {
        this.setState({ wrapperHeight },
          () => this.props.scrollMessages(wrapperHeight));
      }
    }
  };

  componentDidMount() {
    this.interval = setInterval(this.updateHeight, 10);
  }

  componentDidCatch(error, errorInfo) {
    clearInterval(this.interval);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

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

  imageInserted = (e, editor, img) => {
    img.style.display = 'none';
  };

  imageUploaded = (e, editor, response) => {
    const { blob } = JSON.parse(response);

    if (blob) {
      this.props.onSend({
        message: 'chat.attachment',
        type: 'chat.attachment',
        blob: blob,
      });
    }

    editor.popups.hide('file.insert');
  };

  imageLoaded(e, editor, $img) {
    $img.parent().siblings('.fr-image-resizer').removeClass('fr-active');
    $img.remove();
    editor.events.focus();
  }

  fileError = (event, editor, error, response) => {
    const err = [];
    if (!response && error) {
      err.push(error.message);
    } else if (error && response) {
      err.push(error.message);
      if(error.code === 3 || error.code === 4 || error.code === 5) {
        err.push("Contact server administrator for more info.");
      }
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
      const $popup = editor.popups.get('file.insert');
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
    toolbarSticky: false,
    toolbarButtons: ['emoticons', 'attachFile', 'sendMessage'],
    imageEditButtons: [],
    shortcutsEnabled: ['bold', 'italic', 'underline'],
    enter: $.FroalaEditor.ENTER_BR,
    placeholderText: false,
    charCounterCount: false,
    emoticonsUseImage: false,
    key: 'MC1D2D1G2lG4J4A14A7D3D6F6C2C3F3gSXSE1LHAFJVCXCLS==',
    events: {
      'froalaEditor.initialized': this.onFroalaInit,
      'froalaEditor.image.uploaded': this.imageUploaded,
      'froalaEditor.image.loaded': this.imageLoaded,
      'froalaEditor.image.beforePasteUpload': this.imageInserted,
      'froalaEditor.image.error': this.fileError,
      'froalaEditor.focus': () => (this.props.setMessageFormFocus(true)),
      'froalaEditor.blur': () => (this.props.setMessageFormFocus(false)),
    },
    pluginsEnabled: ['image', 'emoticons'],
    scrollableContainer: this.props.frameContext.document.querySelector('body')
  };

  handleTyping = (message) => {
    this.props.onSend({
      message: message
    }, 'chat.typing.start');
  };

  onChange = (message) => {
    if(message !== this.state.message) {
      this.setState({ message });
      this.handleTyping(message);
    }
  };

  handleSubmit = (e) => {
    e.preventDefault && e.preventDefault();

    const {message } = this.state;

    if (message) {
      this.props.onSend({
        message
      });
      this.setState({ message: '' }, () => {
        this.updateHeight();
        this.editor.events.focus();
        setTimeout(() => this.handleTyping(''), 50);
      });
    }
  };
s
  render() {
    const { className, style, language } = this.props;

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
          config={{
            language: language.locale,
            ...this.froalaConfig
          }}
        />
      </div>
    );
  }
}

export default compose(
  connect(
    null,
    { setMessageFormFocus },
  ),
  injectIntl,
  withVisitorId,
  withConfig
)(MessageForm);
