webpackJsonp([104],{qmc6:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=a("Dd8w"),s=a.n(r),o={labelCol:{span:4},wrapperCol:{span:17}},l={name:"UserAdd",props:{userAddVisiable:{default:!1}},data:function(){return{user:{username:""},loading:!1,roleData:[],deptTreeData:[],formItemLayout:o,defaultPassword:"1234qwer",form:this.$form.createForm(this),validateStatus:"",help:""}},methods:{reset:function(){this.validateStatus="",this.help="",this.user.username="",this.loading=!1,this.form.resetFields()},onClose:function(){this.reset(),this.$emit("close")},handleSubmit:function(){var e=this;"success"!==this.validateStatus&&this.handleUserNameBlur(),this.form.validateFields(function(t,a){t||"success"!==e.validateStatus||(e.loading=!0,e.user.roleId=e.user.roleId.join(","),e.$post("user",s()({},e.user)).then(function(t){e.reset(),e.$emit("success")}).catch(function(){e.loading=!1}))})},handleUserNameBlur:function(){var e=this,t=this.user.username.trim();t.length?t.length>10?(this.validateStatus="error",this.help="用户名不能超过10个字符"):t.length<4?(this.validateStatus="error",this.help="用户名不能少于4个字符"):(this.validateStatus="validating",this.$get("user/check/"+t).then(function(t){t.data?(e.validateStatus="success",e.help=""):(e.validateStatus="error",e.help="抱歉，该用户名已存在")})):(this.validateStatus="error",this.help="用户名不能为空")}},watch:{userAddVisiable:function(){var e=this;this.userAddVisiable&&(this.$get("role/allRole").then(function(t){e.roleData=t.data}),this.$get("dept").then(function(t){e.deptTreeData=t.data.rows.children}))}}},i={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("a-drawer",{staticStyle:{height:"calc(100% - 55px)",overflow:"auto","padding-bottom":"53px"},attrs:{title:"新增用户",maskClosable:!1,width:"650",placement:"right",closable:!1,visible:e.userAddVisiable},on:{close:e.onClose}},[a("a-form",{attrs:{form:e.form}},[a("a-form-item",e._b({attrs:{label:"用户名",validateStatus:e.validateStatus,help:e.help}},"a-form-item",e.formItemLayout,!1),[a("a-input",{directives:[{name:"decorator",rawName:"v-decorator",value:["username",{rules:[{required:!0,message:"用户名不能为空"}]}],expression:"['username',{rules: [{ required: true, message: '用户名不能为空'}]}]"}],attrs:{autocomplete:"off"},on:{blur:e.handleUserNameBlur},model:{value:e.user.username,callback:function(t){e.$set(e.user,"username",t)},expression:"user.username"}})],1),e._v(" "),a("a-form-item",e._b({attrs:{label:"密码"}},"a-form-item",e.formItemLayout,!1),[a("a-tooltip",{attrs:{title:"新用户默认密码为 1234qwer"}},[a("a-input",{attrs:{type:"password",readOnly:"",autocomplete:"off",value:e.defaultPassword}})],1)],1),e._v(" "),a("a-form-item",e._b({attrs:{label:"邮箱"}},"a-form-item",e.formItemLayout,!1),[a("a-input",{directives:[{name:"decorator",rawName:"v-decorator",value:["email",{rules:[{type:"email",message:"请输入正确的邮箱"},{max:50,message:"长度不能超过50个字符"}]}],expression:"['email',{rules: [\n          { type: 'email', message: '请输入正确的邮箱' },\n          { max: 50, message: '长度不能超过50个字符'}\n        ]}]"}],attrs:{autocomplete:"off"},model:{value:e.user.email,callback:function(t){e.$set(e.user,"email",t)},expression:"user.email"}})],1),e._v(" "),a("a-form-item",e._b({attrs:{label:"手机"}},"a-form-item",e.formItemLayout,!1),[a("a-input",{directives:[{name:"decorator",rawName:"v-decorator",value:["mobile"],expression:"['mobile']"}],attrs:{autocomplete:"off"},model:{value:e.user.mobile,callback:function(t){e.$set(e.user,"mobile",t)},expression:"user.mobile"}})],1),e._v(" "),a("a-form-item",e._b({attrs:{label:"角色"}},"a-form-item",e.formItemLayout,!1),[a("a-select",{directives:[{name:"decorator",rawName:"v-decorator",value:["role",{rules:[{required:!0,message:"请选择角色"}]}],expression:"['role',{rules: [{ required: true, message: '请选择角色' }]}]"}],staticStyle:{width:"100%"},attrs:{mode:"multiple",allowClear:!0,autocomplete:"off"},model:{value:e.user.roleId,callback:function(t){e.$set(e.user,"roleId",t)},expression:"user.roleId"}},e._l(e.roleData,function(t){return a("a-select-option",{key:t.roleId},[e._v(e._s(t.roleName))])}),1)],1),e._v(" "),a("a-form-item",e._b({attrs:{label:"部门"}},"a-form-item",e.formItemLayout,!1),[a("a-tree-select",{directives:[{name:"decorator",rawName:"v-decorator",value:["deptId"],expression:"['deptId']"}],attrs:{allowClear:!0,dropdownStyle:{maxHeight:"220px",overflow:"auto"},treeData:e.deptTreeData,autocomplete:"off"},model:{value:e.user.deptId,callback:function(t){e.$set(e.user,"deptId",t)},expression:"user.deptId"}})],1),e._v(" "),a("a-form-item",e._b({attrs:{label:"状态"}},"a-form-item",e.formItemLayout,!1),[a("a-radio-group",{directives:[{name:"decorator",rawName:"v-decorator",value:["status",{rules:[{required:!0,message:"请选择状态"}]}],expression:"['status',{rules: [{ required: true, message: '请选择状态'}]}]"}],attrs:{autocomplete:"off"},model:{value:e.user.status,callback:function(t){e.$set(e.user,"status",t)},expression:"user.status"}},[a("a-radio-button",{attrs:{value:"0"}},[e._v("锁定")]),e._v(" "),a("a-radio-button",{attrs:{value:"1"}},[e._v("有效")])],1)],1),e._v(" "),a("a-form-item",e._b({attrs:{label:"性别"}},"a-form-item",e.formItemLayout,!1),[a("a-radio-group",{directives:[{name:"decorator",rawName:"v-decorator",value:["ssex",{rules:[{required:!0,message:"请选择性别"}]}],expression:"['ssex',{rules: [{ required: true, message: '请选择性别' }]}]"}],attrs:{autocomplete:"off"},model:{value:e.user.ssex,callback:function(t){e.$set(e.user,"ssex",t)},expression:"user.ssex"}},[a("a-radio-button",{attrs:{value:"0"}},[e._v("男")]),e._v(" "),a("a-radio-button",{attrs:{value:"1"}},[e._v("女")]),e._v(" "),a("a-radio-button",{attrs:{value:"2"}},[e._v("保密")])],1)],1)],1),e._v(" "),a("div",{staticClass:"drawer-bootom-button"},[a("a-popconfirm",{attrs:{title:"确定放弃编辑？",okText:"确定",cancelText:"取消"},on:{confirm:e.onClose}},[a("a-button",{staticStyle:{"margin-right":".8rem"}},[e._v("取消")])],1),e._v(" "),a("a-button",{attrs:{type:"primary",loading:e.loading},on:{click:e.handleSubmit}},[e._v("提交")])],1)],1)},staticRenderFns:[]},u=a("VU/8")(l,i,!1,null,null,null);t.default=u.exports}});