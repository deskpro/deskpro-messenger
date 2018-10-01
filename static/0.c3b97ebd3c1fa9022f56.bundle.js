webpackJsonp([0],{1797:function(module,__webpack_exports__,__webpack_require__){"use strict";var __WEBPACK_IMPORTED_MODULE_0_react__=__webpack_require__(0),__WEBPACK_IMPORTED_MODULE_0_react___default=__webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__),__WEBPACK_IMPORTED_MODULE_1_redux__=__webpack_require__(269),__WEBPACK_IMPORTED_MODULE_2__deskpro_portal_components__=__webpack_require__(647),__WEBPACK_IMPORTED_MODULE_3_react_intl__=(__webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__deskpro_portal_components__),__webpack_require__(95)),__WEBPACK_IMPORTED_MODULE_4__form_Button__=__webpack_require__(194),__WEBPACK_IMPORTED_MODULE_5__core_TranslatedLayoutHOC__=__webpack_require__(915),TicketForm=function TicketForm(props){return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_2__deskpro_portal_components__.Form,null,__WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_2__deskpro_portal_components__.FieldLayout,props),__WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_4__form_Button__.a,{width:"full",size:"medium",color:"primary",type:"submit"},__WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_3_react_intl__.a,{id:"tickets.create_form.button",defaultMessage:"Save Ticket"})))},formEnhancer=Object(__WEBPACK_IMPORTED_MODULE_2__deskpro_portal_components__.withFormik)({enableReinitialize:!0,mapPropsToValues:function mapPropsToValues(_ref){var layout=_ref.layouts.getMatchingLayout({});return layout?layout.getDefaultValues():{}},handleSubmit:function handleSubmit(values,_ref2){var props=_ref2.props;_ref2.setSubmitting;props.onSubmit(values)}});__webpack_exports__.a=Object(__WEBPACK_IMPORTED_MODULE_1_redux__.d)(__WEBPACK_IMPORTED_MODULE_5__core_TranslatedLayoutHOC__.a,formEnhancer)(TicketForm),TicketForm.__docgenInfo={description:"",displayName:"TicketForm"},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/components/tickets/TicketForm.jsx"]={name:"TicketForm",docgenInfo:TicketForm.__docgenInfo,path:"src/components/tickets/TicketForm.jsx"})},918:function(module,__webpack_exports__,__webpack_require__){"use strict";Object.defineProperty(__webpack_exports__,"__esModule",{value:!0});var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_get_prototype_of__=__webpack_require__(9),__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_get_prototype_of___default=__webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_get_prototype_of__),__WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck__=__webpack_require__(4),__WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck___default=__webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck__),__WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass__=__webpack_require__(5),__WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass___default=__webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass__),__WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn__=__webpack_require__(7),__WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn___default=__webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn__),__WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits__=__webpack_require__(8),__WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits___default=__webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits__),__WEBPACK_IMPORTED_MODULE_5_react__=__webpack_require__(0),__WEBPACK_IMPORTED_MODULE_5_react___default=__webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_react__),__WEBPACK_IMPORTED_MODULE_6_prop_types__=__webpack_require__(2),__WEBPACK_IMPORTED_MODULE_6_prop_types___default=__webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_prop_types__),__WEBPACK_IMPORTED_MODULE_7_react_redux__=__webpack_require__(646),__WEBPACK_IMPORTED_MODULE_8_react_intl__=__webpack_require__(95),__WEBPACK_IMPORTED_MODULE_9__components_core_Block__=__webpack_require__(911),__WEBPACK_IMPORTED_MODULE_10__components_tickets_TicketForm__=__webpack_require__(1797),__WEBPACK_IMPORTED_MODULE_11__modules_tickets__=__webpack_require__(919),TicketFormScreen=function(_PureComponent){function TicketFormScreen(){return __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck___default()(this,TicketFormScreen),__WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn___default()(this,(TicketFormScreen.__proto__||__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_get_prototype_of___default()(TicketFormScreen)).apply(this,arguments))}return __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits___default()(TicketFormScreen,_PureComponent),__WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass___default()(TicketFormScreen,[{key:"render",value:function render(){return __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_9__components_core_Block__.a,{title:this.props.intl.formatMessage({id:"ticket_form.header",defaultMessage:"New Ticket"})},__WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_10__components_tickets_TicketForm__.a,{formConfig:this.props.formConfig,onSubmit:this.props.saveTicket}))}}]),TicketFormScreen}(__WEBPACK_IMPORTED_MODULE_5_react__.PureComponent);TicketFormScreen.propTypes={formConfig:__WEBPACK_IMPORTED_MODULE_6_prop_types___default.a.array.isRequired,saveTicket:__WEBPACK_IMPORTED_MODULE_6_prop_types___default.a.func.isRequired,intl:__WEBPACK_IMPORTED_MODULE_6_prop_types___default.a.object.isRequired},__webpack_exports__.default=Object(__WEBPACK_IMPORTED_MODULE_7_react_redux__.b)(null,{saveTicket:__WEBPACK_IMPORTED_MODULE_11__modules_tickets__.b})(Object(__WEBPACK_IMPORTED_MODULE_8_react_intl__.d)(TicketFormScreen)),TicketFormScreen.__docgenInfo={description:"",displayName:"TicketFormScreen",props:{formConfig:{type:{name:"array"},required:!0,description:""},saveTicket:{type:{name:"func"},required:!0,description:""},intl:{type:{name:"object"},required:!0,description:""}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/screens/TicketFormScreen.jsx"]={name:"TicketFormScreen",docgenInfo:TicketFormScreen.__docgenInfo,path:"src/screens/TicketFormScreen.jsx"})}});