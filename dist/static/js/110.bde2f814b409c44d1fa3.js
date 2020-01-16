webpackJsonp([110],{rfui:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var a=n("Dd8w"),o=n.n(a),s=n("g4PW"),i=n.n(s),r={labelCol:{span:4},wrapperCol:{span:17}},m={name:"MenuAdd",components:{Icons:n("gInO").default},props:{menuAddVisiable:{default:!1}},data:function(){return{loading:!1,formItemLayout:r,form:this.$form.createForm(this),menuTreeKey:+new Date,menu:{icon:""},checkedKeys:[],expandedKeys:[],menuTreeData:[],iconChooseVisible:!1}},methods:{reset:function(){this.loading=!1,this.menuTreeKey=+new Date,this.expandedKeys=this.checkedKeys=[],this.menu={},this.form.resetFields()},onClose:function(){this.reset(),this.$emit("close")},handleCheck:function(e){this.checkedKeys=e},expandAll:function(){this.expandedKeys=this.allTreeKeys},closeAll:function(){this.expandedKeys=[]},handleExpand:function(e){this.expandedKeys=e},chooseIcons:function(){this.iconChooseVisible=!0},handleIconCancel:function(){this.iconChooseVisible=!1},handleIconChoose:function(e){this.menu.icon=e,this.iconChooseVisible=!1},deleteIcons:function(){this.menu.icon=""},handleSubmit:function(){var e=this,t=i()(this.checkedKeys.checked,void 0)?this.checkedKeys:this.checkedKeys.checked;t.length>1?this.$message.error("最多只能选择一个上级菜单，请修改"):this.form.validateFields(function(n,a){n||(e.loading=!0,t.length?e.menu.parentId=t[0]:e.menu.parentId="",e.menu.type="0",e.$post("menu",o()({},e.menu)).then(function(){e.reset(),e.$emit("success")}).catch(function(){e.loading=!1}))})}},watch:{menuAddVisiable:function(){var e=this;this.menuAddVisiable&&this.$get("menu",{type:"0"}).then(function(t){e.menuTreeData=t.data.rows.children,e.allTreeKeys=t.data.ids})}}},l={render:function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("a-drawer",{staticStyle:{height:"calc(100% - 55px)",overflow:"auto","padding-bottom":"53px"},attrs:{title:"新增菜单",maskClosable:!1,width:"650",placement:"right",closable:!1,visible:e.menuAddVisiable},on:{close:e.onClose}},[n("a-form",{attrs:{form:e.form}},[n("a-form-item",e._b({attrs:{label:"菜单名称"}},"a-form-item",e.formItemLayout,!1),[n("a-input",{directives:[{name:"decorator",rawName:"v-decorator",value:["menuName",{rules:[{required:!0,message:"菜单名称不能为空"},{max:10,message:"长度不能超过10个字符"}]}],expression:"['menuName',\n                 {rules: [\n                  { required: true, message: '菜单名称不能为空'},\n                  { max: 10, message: '长度不能超过10个字符'}\n                ]}]"}],model:{value:e.menu.menuName,callback:function(t){e.$set(e.menu,"menuName",t)},expression:"menu.menuName"}})],1),e._v(" "),n("a-form-item",e._b({attrs:{label:"菜单URL"}},"a-form-item",e.formItemLayout,!1),[n("a-input",{directives:[{name:"decorator",rawName:"v-decorator",value:["path",{rules:[{required:!0,message:"菜单URL不能为空"},{max:50,message:"长度不能超过50个字符"}]}],expression:"['path',\n               {rules: [\n                { required: true, message: '菜单URL不能为空'},\n                { max: 50, message: '长度不能超过50个字符'}\n              ]}]"}],model:{value:e.menu.path,callback:function(t){e.$set(e.menu,"path",t)},expression:"menu.path"}})],1),e._v(" "),n("a-form-item",e._b({attrs:{label:"组件地址"}},"a-form-item",e.formItemLayout,!1),[n("a-input",{directives:[{name:"decorator",rawName:"v-decorator",value:["component",{rules:[{required:!0,message:"组件地址不能为空"},{max:100,message:"长度不能超过100个字符"}]}],expression:"['component',\n               {rules: [\n                { required: true, message: '组件地址不能为空'},\n                { max: 100, message: '长度不能超过100个字符'}\n              ]}]"}],model:{value:e.menu.component,callback:function(t){e.$set(e.menu,"component",t)},expression:"menu.component"}})],1),e._v(" "),n("a-form-item",e._b({attrs:{label:"相关权限"}},"a-form-item",e.formItemLayout,!1),[n("a-input",{directives:[{name:"decorator",rawName:"v-decorator",value:["perms",{rules:[{max:50,message:"长度不能超过50个字符"}]}],expression:"['perms',\n                 {rules: [\n                  { max: 50, message: '长度不能超过50个字符'}\n                ]}]"}],model:{value:e.menu.perms,callback:function(t){e.$set(e.menu,"perms",t)},expression:"menu.perms"}})],1),e._v(" "),n("a-form-item",e._b({attrs:{label:"菜单图标"}},"a-form-item",e.formItemLayout,!1),[n("a-input",{ref:"icons",attrs:{placeholder:"点击右侧按钮选择图标"},model:{value:e.menu.icon,callback:function(t){e.$set(e.menu,"icon",t)},expression:"menu.icon"}},[e.menu.icon?n("a-icon",{attrs:{slot:"suffix",type:"close-circle"},on:{click:e.deleteIcons},slot:"suffix"}):e._e(),e._v(" "),n("a-icon",{staticStyle:{cursor:"pointer"},attrs:{slot:"addonAfter",type:"setting"},on:{click:e.chooseIcons},slot:"addonAfter"})],1)],1),e._v(" "),n("a-form-item",e._b({attrs:{label:"菜单排序"}},"a-form-item",e.formItemLayout,!1),[n("a-input-number",{staticStyle:{width:"100%"},model:{value:e.menu.orderNum,callback:function(t){e.$set(e.menu,"orderNum",t)},expression:"menu.orderNum"}})],1),e._v(" "),n("a-form-item",e._b({staticStyle:{"margin-bottom":"2rem"},attrs:{label:"上级菜单"}},"a-form-item",e.formItemLayout,!1),[n("a-tree",{key:e.menuTreeKey,attrs:{checkable:!0,checkStrictly:!0,expandedKeys:e.expandedKeys,treeData:e.menuTreeData},on:{check:e.handleCheck,expand:e.handleExpand}})],1)],1),e._v(" "),n("div",{staticClass:"drawer-bootom-button"},[n("a-dropdown",{staticStyle:{float:"left"},attrs:{trigger:["click"],placement:"topCenter"}},[n("a-menu",{attrs:{slot:"overlay"},slot:"overlay"},[n("a-menu-item",{key:"1",on:{click:e.expandAll}},[e._v("展开所有")]),e._v(" "),n("a-menu-item",{key:"2",on:{click:e.closeAll}},[e._v("合并所有")])],1),e._v(" "),n("a-button",[e._v("\n        树操作 "),n("a-icon",{attrs:{type:"up"}})],1)],1),e._v(" "),n("a-popconfirm",{attrs:{title:"确定放弃编辑？",okText:"确定",cancelText:"取消"},on:{confirm:e.onClose}},[n("a-button",{staticStyle:{"margin-right":".8rem"}},[e._v("取消")])],1),e._v(" "),n("a-button",{attrs:{type:"primary",loading:e.loading},on:{click:e.handleSubmit}},[e._v("提交")])],1),e._v(" "),n("icons",{attrs:{iconChooseVisible:e.iconChooseVisible},on:{choose:e.handleIconChoose,close:e.handleIconCancel}})],1)},staticRenderFns:[]},c=n("VU/8")(m,l,!1,null,null,null);t.default=c.exports}});