webpackJsonp([16,109,110,111,112],{"1QKC":function(e,t){},E24t:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var a=n("Dd8w"),s=n.n(a),o=n("g4PW"),i=n.n(o),r=n("fZjL"),l=n.n(r),c=n("+6Bu"),d=n.n(c),u={labelCol:{span:4},wrapperCol:{span:17}},m={name:"MenuEdit",components:{Icons:n("gInO").default},props:{menuEditVisiable:{default:!1}},data:function(){return{loading:!1,formItemLayout:u,form:this.$form.createForm(this),menuTreeKey:+new Date,menu:{icon:""},checkedKeys:[],expandedKeys:[],menuTreeData:[],defaultCheckedKeys:[],iconChooseVisible:!1}},methods:{reset:function(){this.loading=!1,this.menuTreeKey=+new Date,this.expandedKeys=this.checkedKeys=this.defaultCheckedKeys=[],this.menu={},this.form.resetFields()},onClose:function(){this.reset(),this.$emit("close")},handleCheck:function(e){this.checkedKeys=e},expandAll:function(){this.expandedKeys=this.allTreeKeys},closeAll:function(){this.expandedKeys=[]},handleExpand:function(e){this.expandedKeys=e},chooseIcons:function(){this.iconChooseVisible=!0},handleIconCancel:function(){this.iconChooseVisible=!1},handleIconChoose:function(e){this.menu.icon=e,this.iconChooseVisible=!1},deleteIcons:function(){this.menu.icon=""},setFormValues:function(e){var t=this,n=d()(e,[]),a=["path","component","icon"],s={};l()(n).forEach(function(e){-1!==a.indexOf(e)&&(t.form.getFieldDecorator(e),s[e]=n[e])}),this.form.setFieldsValue(s),this.form.getFieldDecorator("menuName"),this.form.setFieldsValue({menuName:n.text}),this.form.getFieldDecorator("perms"),this.form.setFieldsValue({perms:n.permission}),this.form.getFieldDecorator("orderNum"),this.form.setFieldsValue({orderNum:n.order}),this.menu.icon=n.icon,"0"!==n.parentId&&(this.defaultCheckedKeys.push(n.parentId),this.checkedKeys=this.defaultCheckedKeys,this.expandedKeys=this.checkedKeys),this.menu.menuId=n.id,this.menuTreeKey=+new Date},handleSubmit:function(){var e=this,t=i()(this.checkedKeys.checked,void 0)?this.checkedKeys:this.checkedKeys.checked;return t.length>1?void this.$message.error("最多只能选择一个上级菜单，请修改"):t[0]===this.menu.menuId?void this.$message.error("不能选择自己作为上级菜单，请修改"):void this.form.validateFields(function(n,a){if(!n){e.loading=!0;var o=e.menu.icon,i=e.form.getFieldsValue();i.icon=o,i.menuId=e.menu.menuId,t.length?i.parentId=t[0]:i.parentId="",i.type="0",e.$put("menu",s()({},i)).then(function(){e.reset(),e.$emit("success")}).catch(function(){e.loading=!1})}})}},watch:{menuEditVisiable:function(){var e=this;this.menuEditVisiable&&this.$get("menu",{type:"0"}).then(function(t){e.menuTreeData=t.data.rows.children,e.allTreeKeys=t.data.ids,e.menuTreeKey=+new Date})}}},h={render:function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("a-drawer",{staticStyle:{height:"calc(100% - 55px)",overflow:"auto","padding-bottom":"53px"},attrs:{title:"修改菜单",maskClosable:!1,width:"650",placement:"right",closable:!1,visible:e.menuEditVisiable},on:{close:e.onClose}},[n("a-form",{attrs:{form:e.form}},[n("a-form-item",e._b({attrs:{label:"菜单名称"}},"a-form-item",e.formItemLayout,!1),[n("a-input",{directives:[{name:"decorator",rawName:"v-decorator",value:["menuName",{rules:[{required:!0,message:"菜单名称不能为空"},{max:10,message:"长度不能超过10个字符"}]}],expression:"['menuName',\n                 {rules: [\n                  { required: true, message: '菜单名称不能为空'},\n                  { max: 10, message: '长度不能超过10个字符'}\n                ]}]"}]})],1),e._v(" "),n("a-form-item",e._b({attrs:{label:"菜单URL"}},"a-form-item",e.formItemLayout,!1),[n("a-input",{directives:[{name:"decorator",rawName:"v-decorator",value:["path",{rules:[{required:!0,message:"菜单URL不能为空"},{max:50,message:"长度不能超过50个字符"}]}],expression:"['path',\n               {rules: [\n                { required: true, message: '菜单URL不能为空'},\n                { max: 50, message: '长度不能超过50个字符'}\n              ]}]"}]})],1),e._v(" "),n("a-form-item",e._b({attrs:{label:"组件地址"}},"a-form-item",e.formItemLayout,!1),[n("a-input",{directives:[{name:"decorator",rawName:"v-decorator",value:["component",{rules:[{required:!0,message:"组件地址不能为空"},{max:100,message:"长度不能超过100个字符"}]}],expression:"['component',\n               {rules: [\n                { required: true, message: '组件地址不能为空'},\n                { max: 100, message: '长度不能超过100个字符'}\n              ]}]"}]})],1),e._v(" "),n("a-form-item",e._b({attrs:{label:"相关权限"}},"a-form-item",e.formItemLayout,!1),[n("a-input",{directives:[{name:"decorator",rawName:"v-decorator",value:["perms",{rules:[{max:50,message:"长度不能超过50个字符"}]}],expression:"['perms',\n                 {rules: [\n                  { max: 50, message: '长度不能超过50个字符'}\n                ]}]"}]})],1),e._v(" "),n("a-form-item",e._b({directives:[{name:"decorator",rawName:"v-decorator",value:["icon"],expression:"['icon']"}],attrs:{label:"菜单图标"}},"a-form-item",e.formItemLayout,!1),[n("a-input",{attrs:{placeholder:"点击右侧按钮选择图标"},model:{value:e.menu.icon,callback:function(t){e.$set(e.menu,"icon",t)},expression:"menu.icon"}},[e.menu.icon?n("a-icon",{attrs:{slot:"suffix",type:"close-circle"},on:{click:e.deleteIcons},slot:"suffix"}):e._e(),e._v(" "),n("a-icon",{staticStyle:{cursor:"pointer"},attrs:{slot:"addonAfter",type:"setting"},on:{click:e.chooseIcons},slot:"addonAfter"})],1)],1),e._v(" "),n("a-form-item",e._b({attrs:{label:"菜单排序"}},"a-form-item",e.formItemLayout,!1),[n("a-input-number",{directives:[{name:"decorator",rawName:"v-decorator",value:["orderNum"],expression:"['orderNum']"}],staticStyle:{width:"100%"}})],1),e._v(" "),n("a-form-item",e._b({staticStyle:{"margin-bottom":"2rem"},attrs:{label:"上级菜单"}},"a-form-item",e.formItemLayout,!1),[n("a-tree",{key:e.menuTreeKey,ref:"menuTree",attrs:{checkable:!0,checkStrictly:!0,expandedKeys:e.expandedKeys,defaultCheckedKeys:e.defaultCheckedKeys,treeData:e.menuTreeData},on:{check:e.handleCheck,expand:e.handleExpand}})],1)],1),e._v(" "),n("div",{staticClass:"drawer-bootom-button"},[n("a-dropdown",{staticStyle:{float:"left"},attrs:{trigger:["click"],placement:"topCenter"}},[n("a-menu",{attrs:{slot:"overlay"},slot:"overlay"},[n("a-menu-item",{key:"1",on:{click:e.expandAll}},[e._v("展开所有")]),e._v(" "),n("a-menu-item",{key:"2",on:{click:e.closeAll}},[e._v("合并所有")])],1),e._v(" "),n("a-button",[e._v("\n        树操作 "),n("a-icon",{attrs:{type:"up"}})],1)],1),e._v(" "),n("a-popconfirm",{attrs:{title:"确定放弃编辑？",okText:"确定",cancelText:"取消"},on:{confirm:e.onClose}},[n("a-button",{staticStyle:{"margin-right":".8rem"}},[e._v("取消")])],1),e._v(" "),n("a-button",{attrs:{type:"primary",loading:e.loading},on:{click:e.handleSubmit}},[e._v("提交")])],1),e._v(" "),n("icons",{attrs:{iconChooseVisible:e.iconChooseVisible},on:{choose:e.handleIconChoose,close:e.handleIconCancel}})],1)},staticRenderFns:[]},f=n("VU/8")(m,h,!1,null,null,null);t.default=f.exports},OO9F:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var a=n("Dd8w"),s=n.n(a),o=n("g4PW"),i=n.n(o),r=n("+6Bu"),l=n.n(r),c={labelCol:{span:4},wrapperCol:{span:17}},d={name:"ButtonEdit",props:{buttonEditVisiable:{default:!1}},data:function(){return{loading:!1,formItemLayout:c,form:this.$form.createForm(this),menuTreeKey:+new Date,button:{},checkedKeys:[],expandedKeys:[],defaultCheckedKeys:[],menuTreeData:[]}},methods:{reset:function(){this.loading=!1,this.menuTreeKey=+new Date,this.expandedKeys=this.checkedKeys=this.defaultCheckedKeys=[],this.button={},this.form.resetFields()},onClose:function(){this.reset(),this.$emit("close")},handleCheck:function(e){this.checkedKeys=e},expandAll:function(){this.expandedKeys=this.allTreeKeys},closeAll:function(){this.expandedKeys=[]},handleExpand:function(e){this.expandedKeys=e},setFormValues:function(e){var t=l()(e,[]);this.form.getFieldDecorator("menuName"),this.form.setFieldsValue({menuName:t.text}),this.form.getFieldDecorator("perms"),this.form.setFieldsValue({perms:t.permission}),this.defaultCheckedKeys.push(t.parentId),this.checkedKeys=this.defaultCheckedKeys,this.expandedKeys=this.checkedKeys,this.button.menuId=t.id},handleSubmit:function(){var e=this,t=i()(this.checkedKeys.checked,void 0)?this.checkedKeys:this.checkedKeys.checked;return t.length?t.length>1?void this.$message.error("最多只能选择一个上级菜单，请修改"):void this.form.validateFields(function(n,a){if(!n){e.loading=!0;var o=e.form.getFieldsValue();o.parentId=t[0],o.type="1",o.menuId=e.button.menuId,e.$put("menu",s()({},o)).then(function(){e.reset(),e.$emit("success")}).catch(function(){e.loading=!1})}}):void this.$message.error("请为按钮选择一个上级菜单")}},watch:{buttonEditVisiable:function(){var e=this;this.buttonEditVisiable&&this.$get("menu",{type:"0"}).then(function(t){e.menuTreeData=t.data.rows.children,e.allTreeKeys=t.data.ids,e.menuTreeKey=+new Date})}}},u={render:function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("a-drawer",{staticStyle:{height:"calc(100% - 55px)",overflow:"auto","padding-bottom":"53px"},attrs:{title:"修改按钮",maskClosable:!1,width:"650",placement:"right",closable:!1,visible:e.buttonEditVisiable},on:{close:e.onClose}},[n("a-form",{attrs:{form:e.form}},[n("a-form-item",e._b({attrs:{label:"按钮名称"}},"a-form-item",e.formItemLayout,!1),[n("a-input",{directives:[{name:"decorator",rawName:"v-decorator",value:["menuName",{rules:[{required:!0,message:"按钮名称不能为空"},{max:10,message:"长度不能超过10个字符"}]}],expression:"['menuName',\n                 {rules: [\n                  { required: true, message: '按钮名称不能为空'},\n                  { max: 10, message: '长度不能超过10个字符'}\n                ]}]"}]})],1),e._v(" "),n("a-form-item",e._b({attrs:{label:"相关权限"}},"a-form-item",e.formItemLayout,!1),[n("a-input",{directives:[{name:"decorator",rawName:"v-decorator",value:["perms",{rules:[{max:50,message:"长度不能超过50个字符"}]}],expression:"['perms',\n                 {rules: [\n                  { max: 50, message: '长度不能超过50个字符'}\n                ]}]"}]})],1),e._v(" "),n("a-form-item",e._b({staticStyle:{"margin-bottom":"2rem"},attrs:{label:"上级菜单"}},"a-form-item",e.formItemLayout,!1),[n("a-tree",{key:e.menuTreeKey,attrs:{checkable:!0,checkStrictly:!0,expandedKeys:e.expandedKeys,defaultCheckedKeys:e.defaultCheckedKeys,treeData:e.menuTreeData},on:{check:e.handleCheck,expand:e.handleExpand}})],1)],1),e._v(" "),n("div",{staticClass:"drawer-bootom-button"},[n("a-dropdown",{staticStyle:{float:"left"},attrs:{trigger:["click"],placement:"topCenter"}},[n("a-menu",{attrs:{slot:"overlay"},slot:"overlay"},[n("a-menu-item",{key:"1",on:{click:e.expandAll}},[e._v("展开所有")]),e._v(" "),n("a-menu-item",{key:"2",on:{click:e.closeAll}},[e._v("合并所有")])],1),e._v(" "),n("a-button",[e._v("\n        树操作 "),n("a-icon",{attrs:{type:"up"}})],1)],1),e._v(" "),n("a-popconfirm",{attrs:{title:"确定放弃编辑？",okText:"确定",cancelText:"取消"},on:{confirm:e.onClose}},[n("a-button",{staticStyle:{"margin-right":".8rem"}},[e._v("取消")])],1),e._v(" "),n("a-button",{attrs:{type:"primary",loading:e.loading},on:{click:e.handleSubmit}},[e._v("提交")])],1)],1)},staticRenderFns:[]},m=n("VU/8")(d,u,!1,null,null,null);t.default=m.exports},ZkPy:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var a=n("Dd8w"),s=n.n(a),o=n("g4PW"),i=n.n(o),r={labelCol:{span:4},wrapperCol:{span:17}},l={name:"ButtonAdd",props:{buttonAddVisiable:{default:!1}},data:function(){return{loading:!1,formItemLayout:r,form:this.$form.createForm(this),menuTreeKey:+new Date,button:{},checkedKeys:[],expandedKeys:[],menuTreeData:[]}},methods:{reset:function(){this.loading=!1,this.menuTreeKey=+new Date,this.expandedKeys=this.checkedKeys=[],this.button={},this.form.resetFields()},onClose:function(){this.reset(),this.$emit("close")},handleCheck:function(e){this.checkedKeys=e},expandAll:function(){this.expandedKeys=this.allTreeKeys},closeAll:function(){this.expandedKeys=[]},handleExpand:function(e){this.expandedKeys=e},handleSubmit:function(){var e=this,t=i()(this.checkedKeys.checked,void 0)?this.checkedKeys:this.checkedKeys.checked;return t.length?t.length>1?void this.$message.error("最多只能选择一个上级菜单，请修改"):void this.form.validateFields(function(n,a){n||(e.loading=!0,t.length?e.button.parentId=t[0]:e.button.parentId="",e.button.type="1",e.$post("menu",s()({},e.button)).then(function(){e.reset(),e.$emit("success")}).catch(function(){e.loading=!1}))}):void this.$message.error("请为按钮选择一个上级菜单")}},watch:{buttonAddVisiable:function(){var e=this;this.buttonAddVisiable&&this.$get("menu",{type:"0"}).then(function(t){e.menuTreeData=t.data.rows.children,e.allTreeKeys=t.data.ids})}}},c={render:function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("a-drawer",{staticStyle:{height:"calc(100% - 55px)",overflow:"auto","padding-bottom":"53px"},attrs:{title:"新增按钮",maskClosable:!1,width:"650",placement:"right",closable:!1,visible:e.buttonAddVisiable},on:{close:e.onClose}},[n("a-form",{attrs:{form:e.form}},[n("a-form-item",e._b({attrs:{label:"按钮名称"}},"a-form-item",e.formItemLayout,!1),[n("a-input",{directives:[{name:"decorator",rawName:"v-decorator",value:["menuName",{rules:[{required:!0,message:"按钮名称不能为空"},{max:10,message:"长度不能超过10个字符"}]}],expression:"['menuName',\n                 {rules: [\n                  { required: true, message: '按钮名称不能为空'},\n                  { max: 10, message: '长度不能超过10个字符'}\n                ]}]"}],model:{value:e.button.menuName,callback:function(t){e.$set(e.button,"menuName",t)},expression:"button.menuName"}})],1),e._v(" "),n("a-form-item",e._b({attrs:{label:"相关权限"}},"a-form-item",e.formItemLayout,!1),[n("a-input",{directives:[{name:"decorator",rawName:"v-decorator",value:["perms",{rules:[{max:50,message:"长度不能超过50个字符"}]}],expression:"['perms',\n                 {rules: [\n                  { max: 50, message: '长度不能超过50个字符'}\n                ]}]"}],model:{value:e.button.perms,callback:function(t){e.$set(e.button,"perms",t)},expression:"button.perms"}})],1),e._v(" "),n("a-form-item",e._b({staticStyle:{"margin-bottom":"2rem"},attrs:{label:"上级菜单"}},"a-form-item",e.formItemLayout,!1),[n("a-tree",{key:e.menuTreeKey,attrs:{checkable:!0,checkStrictly:!0,expandedKeys:e.expandedKeys,treeData:e.menuTreeData},on:{check:e.handleCheck,expand:e.handleExpand}})],1)],1),e._v(" "),n("div",{staticClass:"drawer-bootom-button"},[n("a-dropdown",{staticStyle:{float:"left"},attrs:{trigger:["click"],placement:"topCenter"}},[n("a-menu",{attrs:{slot:"overlay"},slot:"overlay"},[n("a-menu-item",{key:"1",on:{click:e.expandAll}},[e._v("展开所有")]),e._v(" "),n("a-menu-item",{key:"2",on:{click:e.closeAll}},[e._v("合并所有")])],1),e._v(" "),n("a-button",[e._v("\n        树操作 "),n("a-icon",{attrs:{type:"up"}})],1)],1),e._v(" "),n("a-popconfirm",{attrs:{title:"确定放弃编辑？",okText:"确定",cancelText:"取消"},on:{confirm:e.onClose}},[n("a-button",{staticStyle:{"margin-right":".8rem"}},[e._v("取消")])],1),e._v(" "),n("a-button",{attrs:{type:"primary",loading:e.loading},on:{click:e.handleSubmit}},[e._v("提交")])],1)],1)},staticRenderFns:[]},d=n("VU/8")(l,c,!1,null,null,null);t.default=d.exports},fJlc:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var a=n("g4PW"),s=n.n(a),o=n("Dd8w"),i=n.n(o),r=n("JpjP"),l=n("rfui"),c=n("E24t"),d=n("ZkPy"),u=n("OO9F"),m={name:"Menu",components:{ButtonAdd:d.default,ButtonEdit:u.default,RangeDate:r.a,MenuAdd:l.default,MenuEdit:c.default},data:function(){return{advanced:!1,key:+new Date,queryParams:{},filteredInfo:null,dataSource:[],selectedRowKeys:[],pagination:{defaultPageSize:1e7,hideOnSinglePage:!0,indentSize:100},loading:!1,menuAddVisiable:!1,menuEditVisiable:!1,buttonAddVisiable:!1,buttonEditVisiable:!1}},computed:{columns:function(){var e=this.$createElement,t=this.filteredInfo;return[{title:"名称",dataIndex:"text",width:200,scopedSlots:{customRender:"text"},fixed:"left"},{title:"图标",dataIndex:"icon",scopedSlots:{customRender:"icon"}},{title:"类型",dataIndex:"type",customRender:function(t,n,a){switch(t){case"0":return e("a-tag",{attrs:{color:"cyan"}},[" 菜单 "]);case"1":return e("a-tag",{attrs:{color:"pink"}},[" 按钮 "]);default:return t}},filters:[{text:"按钮",value:"1"},{text:"菜单",value:"0"}],filterMultiple:!1,filteredValue:(t=t||{}).type||null,onFilter:function(e,t){return t.type.includes(e)}},{title:"地址",dataIndex:"path"},{title:"Vue组件",dataIndex:"component"},{title:"权限",dataIndex:"permission"},{title:"排序",dataIndex:"order"},{title:"操作",dataIndex:"operation",width:120,scopedSlots:{customRender:"operation"},fixed:"right"}]}},mounted:function(){this.fetch()},methods:{onSelectChange:function(e){this.selectedRowKeys=e},handleMenuEditClose:function(){this.menuEditVisiable=!1},handleMenuEditSuccess:function(){this.menuEditVisiable=!1,this.$message.success("修改菜单成功"),this.fetch()},handleButtonEditClose:function(){this.buttonEditVisiable=!1},handleButtonEditSuccess:function(){this.buttonEditVisiable=!1,this.$message.success("修改按钮成功"),this.fetch()},edit:function(e){"0"===e.type?(this.$refs.menuEdit.setFormValues(e),this.menuEditVisiable=!0):(this.$refs.buttonEdit.setFormValues(e),this.buttonEditVisiable=!0)},handleButtonAddClose:function(){this.buttonAddVisiable=!1},handleButtonAddSuccess:function(){this.buttonAddVisiable=!1,this.$message.success("新增按钮成功"),this.fetch()},createButton:function(){this.buttonAddVisiable=!0},handleMenuAddClose:function(){this.menuAddVisiable=!1},handleMenuAddSuccess:function(){this.menuAddVisiable=!1,this.$message.success("新增菜单成功"),this.fetch()},createMenu:function(){this.menuAddVisiable=!0},handleDateChange:function(e){e&&(this.queryParams.createTimeFrom=e[0],this.queryParams.createTimeTo=e[1])},batchDelete:function(){if(this.selectedRowKeys.length){var e=this;this.$confirm({title:"确定删除所选中的记录?",content:"当您点击确定按钮后，这些记录将会被彻底删除，如果其包含子记录，也将一并删除！",centered:!0,onOk:function(){e.$delete("menu/"+e.selectedRowKeys.join(",")).then(function(){e.$message.success("删除成功"),e.selectedRowKeys=[],e.fetch()})},onCancel:function(){e.selectedRowKeys=[]}})}else this.$message.warning("请选择需要删除的记录")},exprotExccel:function(){var e=this.filteredInfo;this.$export("menu/excel",i()({},this.queryParams,e))},search:function(){var e=this.filteredInfo;this.fetch(i()({},this.queryParams,e))},reset:function(){this.selectedRowKeys=[],this.filteredInfo=null,this.queryParams={},this.$refs.createTime.reset(),this.fetch()},handleTableChange:function(e,t,n){this.filteredInfo=t,this.fetch(i()({sortField:n.field,sortOrder:n.order},this.queryParams,t))},fetch:function(){var e=this,t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};this.loading=!0,this.$get("menu",i()({},t)).then(function(t){var n=t.data;e.loading=!1,s()(n.rows.children,void 0)?e.dataSource=n.rows:e.dataSource=n.rows.children})}}},h={render:function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("a-card",{staticClass:"card-area",attrs:{bordered:!1}},[n("div",{class:e.advanced?"search":null},[n("a-form",{attrs:{layout:"horizontal"}},[n("div",{class:e.advanced?null:"fold"},[n("a-row",[n("a-col",{attrs:{md:12,sm:24}},[n("a-form-item",{attrs:{label:"名称",labelCol:{span:5},wrapperCol:{span:18,offset:1}}},[n("a-input",{model:{value:e.queryParams.menuName,callback:function(t){e.$set(e.queryParams,"menuName",t)},expression:"queryParams.menuName"}})],1)],1),e._v(" "),n("a-col",{attrs:{md:12,sm:24}},[n("a-form-item",{attrs:{label:"创建时间",labelCol:{span:5},wrapperCol:{span:18,offset:1}}},[n("range-date",{ref:"createTime",on:{change:e.handleDateChange}})],1)],1)],1)],1),e._v(" "),n("span",{staticStyle:{float:"right",margin:"3px auto 1em"}},[n("a-button",{attrs:{type:"primary"},on:{click:e.search}},[e._v("查询")]),e._v(" "),n("a-button",{staticStyle:{"margin-left":"8px"},on:{click:e.reset}},[e._v("重置")])],1)])],1),e._v(" "),n("div",[n("div",{staticClass:"operator"},[n("a-popconfirm",{attrs:{title:"请选择创建类型",okText:"按钮",cancelText:"菜单"},on:{cancel:function(){return e.createMenu()},confirm:function(){return e.createButton()}}},[n("a-icon",{staticStyle:{color:"orangered"},attrs:{slot:"icon",type:"question-circle-o"},slot:"icon"}),e._v(" "),n("a-button",{directives:[{name:"hasPermission",rawName:"v-hasPermission",value:"menu:add",expression:"'menu:add'"}],attrs:{type:"primary",ghost:""}},[e._v("新增")])],1),e._v(" "),n("a-button",{directives:[{name:"hasPermission",rawName:"v-hasPermission",value:"menu:delete",expression:"'menu:delete'"}],on:{click:e.batchDelete}},[e._v("删除")]),e._v(" "),n("a-dropdown",{directives:[{name:"hasPermission",rawName:"v-hasPermission",value:"menu:export",expression:"'menu:export'"}]},[n("a-menu",{attrs:{slot:"overlay"},slot:"overlay"},[n("a-menu-item",{key:"export-data",on:{click:e.exprotExccel}},[e._v("导出Excel")])],1),e._v(" "),n("a-button",[e._v("\n          更多操作 "),n("a-icon",{attrs:{type:"down"}})],1)],1)],1),e._v(" "),n("a-table",{key:e.key,attrs:{columns:e.columns,dataSource:e.dataSource,pagination:e.pagination,loading:e.loading,rowSelection:{selectedRowKeys:e.selectedRowKeys,onChange:e.onSelectChange},scroll:{x:1500}},on:{change:e.handleTableChange},scopedSlots:e._u([{key:"text",fn:function(t){return[n("span",[e._v(e._s(t))])]}},{key:"icon",fn:function(e){return[n("a-icon",{attrs:{type:e}})]}},{key:"operation",fn:function(t,a){return[n("a-icon",{directives:[{name:"hasPermission",rawName:"v-hasPermission",value:"menu:update",expression:"'menu:update'"}],attrs:{type:"setting",theme:"twoTone",twoToneColor:"#4a9ff5",title:"修改"},on:{click:function(t){return e.edit(a)}}}),e._v(" "),n("a-badge",{directives:[{name:"hasNoPermission",rawName:"v-hasNoPermission",value:"menu:update",expression:"'menu:update'"}],attrs:{status:"warning",text:"无权限"}})]}}])})],1),e._v(" "),n("menu-add",{attrs:{menuAddVisiable:e.menuAddVisiable},on:{close:e.handleMenuAddClose,success:e.handleMenuAddSuccess}}),e._v(" "),n("menu-edit",{ref:"menuEdit",attrs:{menuEditVisiable:e.menuEditVisiable},on:{close:e.handleMenuEditClose,success:e.handleMenuEditSuccess}}),e._v(" "),n("button-add",{attrs:{buttonAddVisiable:e.buttonAddVisiable},on:{close:e.handleButtonAddClose,success:e.handleButtonAddSuccess}}),e._v(" "),n("button-edit",{ref:"buttonEdit",attrs:{buttonEditVisiable:e.buttonEditVisiable},on:{close:e.handleButtonEditClose,success:e.handleButtonEditSuccess}})],1)},staticRenderFns:[]},f=n("VU/8")(m,h,!1,function(e){n("1QKC")},"data-v-4044bc3c",null);t.default=f.exports},rfui:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var a=n("Dd8w"),s=n.n(a),o=n("g4PW"),i=n.n(o),r={labelCol:{span:4},wrapperCol:{span:17}},l={name:"MenuAdd",components:{Icons:n("gInO").default},props:{menuAddVisiable:{default:!1}},data:function(){return{loading:!1,formItemLayout:r,form:this.$form.createForm(this),menuTreeKey:+new Date,menu:{icon:""},checkedKeys:[],expandedKeys:[],menuTreeData:[],iconChooseVisible:!1}},methods:{reset:function(){this.loading=!1,this.menuTreeKey=+new Date,this.expandedKeys=this.checkedKeys=[],this.menu={},this.form.resetFields()},onClose:function(){this.reset(),this.$emit("close")},handleCheck:function(e){this.checkedKeys=e},expandAll:function(){this.expandedKeys=this.allTreeKeys},closeAll:function(){this.expandedKeys=[]},handleExpand:function(e){this.expandedKeys=e},chooseIcons:function(){this.iconChooseVisible=!0},handleIconCancel:function(){this.iconChooseVisible=!1},handleIconChoose:function(e){this.menu.icon=e,this.iconChooseVisible=!1},deleteIcons:function(){this.menu.icon=""},handleSubmit:function(){var e=this,t=i()(this.checkedKeys.checked,void 0)?this.checkedKeys:this.checkedKeys.checked;t.length>1?this.$message.error("最多只能选择一个上级菜单，请修改"):this.form.validateFields(function(n,a){n||(e.loading=!0,t.length?e.menu.parentId=t[0]:e.menu.parentId="",e.menu.type="0",e.$post("menu",s()({},e.menu)).then(function(){e.reset(),e.$emit("success")}).catch(function(){e.loading=!1}))})}},watch:{menuAddVisiable:function(){var e=this;this.menuAddVisiable&&this.$get("menu",{type:"0"}).then(function(t){e.menuTreeData=t.data.rows.children,e.allTreeKeys=t.data.ids})}}},c={render:function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("a-drawer",{staticStyle:{height:"calc(100% - 55px)",overflow:"auto","padding-bottom":"53px"},attrs:{title:"新增菜单",maskClosable:!1,width:"650",placement:"right",closable:!1,visible:e.menuAddVisiable},on:{close:e.onClose}},[n("a-form",{attrs:{form:e.form}},[n("a-form-item",e._b({attrs:{label:"菜单名称"}},"a-form-item",e.formItemLayout,!1),[n("a-input",{directives:[{name:"decorator",rawName:"v-decorator",value:["menuName",{rules:[{required:!0,message:"菜单名称不能为空"},{max:10,message:"长度不能超过10个字符"}]}],expression:"['menuName',\n                 {rules: [\n                  { required: true, message: '菜单名称不能为空'},\n                  { max: 10, message: '长度不能超过10个字符'}\n                ]}]"}],model:{value:e.menu.menuName,callback:function(t){e.$set(e.menu,"menuName",t)},expression:"menu.menuName"}})],1),e._v(" "),n("a-form-item",e._b({attrs:{label:"菜单URL"}},"a-form-item",e.formItemLayout,!1),[n("a-input",{directives:[{name:"decorator",rawName:"v-decorator",value:["path",{rules:[{required:!0,message:"菜单URL不能为空"},{max:50,message:"长度不能超过50个字符"}]}],expression:"['path',\n               {rules: [\n                { required: true, message: '菜单URL不能为空'},\n                { max: 50, message: '长度不能超过50个字符'}\n              ]}]"}],model:{value:e.menu.path,callback:function(t){e.$set(e.menu,"path",t)},expression:"menu.path"}})],1),e._v(" "),n("a-form-item",e._b({attrs:{label:"组件地址"}},"a-form-item",e.formItemLayout,!1),[n("a-input",{directives:[{name:"decorator",rawName:"v-decorator",value:["component",{rules:[{required:!0,message:"组件地址不能为空"},{max:100,message:"长度不能超过100个字符"}]}],expression:"['component',\n               {rules: [\n                { required: true, message: '组件地址不能为空'},\n                { max: 100, message: '长度不能超过100个字符'}\n              ]}]"}],model:{value:e.menu.component,callback:function(t){e.$set(e.menu,"component",t)},expression:"menu.component"}})],1),e._v(" "),n("a-form-item",e._b({attrs:{label:"相关权限"}},"a-form-item",e.formItemLayout,!1),[n("a-input",{directives:[{name:"decorator",rawName:"v-decorator",value:["perms",{rules:[{max:50,message:"长度不能超过50个字符"}]}],expression:"['perms',\n                 {rules: [\n                  { max: 50, message: '长度不能超过50个字符'}\n                ]}]"}],model:{value:e.menu.perms,callback:function(t){e.$set(e.menu,"perms",t)},expression:"menu.perms"}})],1),e._v(" "),n("a-form-item",e._b({attrs:{label:"菜单图标"}},"a-form-item",e.formItemLayout,!1),[n("a-input",{ref:"icons",attrs:{placeholder:"点击右侧按钮选择图标"},model:{value:e.menu.icon,callback:function(t){e.$set(e.menu,"icon",t)},expression:"menu.icon"}},[e.menu.icon?n("a-icon",{attrs:{slot:"suffix",type:"close-circle"},on:{click:e.deleteIcons},slot:"suffix"}):e._e(),e._v(" "),n("a-icon",{staticStyle:{cursor:"pointer"},attrs:{slot:"addonAfter",type:"setting"},on:{click:e.chooseIcons},slot:"addonAfter"})],1)],1),e._v(" "),n("a-form-item",e._b({attrs:{label:"菜单排序"}},"a-form-item",e.formItemLayout,!1),[n("a-input-number",{staticStyle:{width:"100%"},model:{value:e.menu.orderNum,callback:function(t){e.$set(e.menu,"orderNum",t)},expression:"menu.orderNum"}})],1),e._v(" "),n("a-form-item",e._b({staticStyle:{"margin-bottom":"2rem"},attrs:{label:"上级菜单"}},"a-form-item",e.formItemLayout,!1),[n("a-tree",{key:e.menuTreeKey,attrs:{checkable:!0,checkStrictly:!0,expandedKeys:e.expandedKeys,treeData:e.menuTreeData},on:{check:e.handleCheck,expand:e.handleExpand}})],1)],1),e._v(" "),n("div",{staticClass:"drawer-bootom-button"},[n("a-dropdown",{staticStyle:{float:"left"},attrs:{trigger:["click"],placement:"topCenter"}},[n("a-menu",{attrs:{slot:"overlay"},slot:"overlay"},[n("a-menu-item",{key:"1",on:{click:e.expandAll}},[e._v("展开所有")]),e._v(" "),n("a-menu-item",{key:"2",on:{click:e.closeAll}},[e._v("合并所有")])],1),e._v(" "),n("a-button",[e._v("\n        树操作 "),n("a-icon",{attrs:{type:"up"}})],1)],1),e._v(" "),n("a-popconfirm",{attrs:{title:"确定放弃编辑？",okText:"确定",cancelText:"取消"},on:{confirm:e.onClose}},[n("a-button",{staticStyle:{"margin-right":".8rem"}},[e._v("取消")])],1),e._v(" "),n("a-button",{attrs:{type:"primary",loading:e.loading},on:{click:e.handleSubmit}},[e._v("提交")])],1),e._v(" "),n("icons",{attrs:{iconChooseVisible:e.iconChooseVisible},on:{choose:e.handleIconChoose,close:e.handleIconCancel}})],1)},staticRenderFns:[]},d=n("VU/8")(l,c,!1,null,null,null);t.default=d.exports}});