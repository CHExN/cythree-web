webpackJsonp([154],{PalO:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=a("Gu7T"),r=a.n(o),n=a("Dd8w"),i=a.n(n),s=a("mvHQ"),d=a.n(s),l=a("fZjL"),c=a.n(l),u=a("Zz1P"),m=a.n(u);m.a.locale("zh-cn");var f={labelCol:{span:4},wrapperCol:{span:17}},p={name:"StoreroomOutEdit",props:{outEditVisiable:{default:!1}},data:function(){return{outLoading:!1,loading:!1,dataSource:[],autoData:{},deptTreeData:[],open:!1,tableIndex:0,deptId:"",formItemLayout:f,form:this.$form.createForm(this),id:"",reviewModify:null}},computed:{columns:function(){return[{title:"物品名称",dataIndex:"name",width:"20%",scopedSlots:{customRender:"name"}},{title:"单价",dataIndex:"money",width:"11%",scopedSlots:{customRender:"money"}},{title:"数量",dataIndex:"amount",width:"11%"},{title:"单位",dataIndex:"unit",width:"10%",scopedSlots:{customRender:"unit"}},{title:"型号",dataIndex:"type",width:"10%",scopedSlots:{customRender:"type"}},{title:"备注",dataIndex:"remark",width:"14%",scopedSlots:{customRender:"remark"}},{title:"收据",dataIndex:"receipt",width:"14%",scopedSlots:{customRender:"receipt"}},{title:"操作",dataIndex:"operation",scopedSlots:{customRender:"operation"}}]}},methods:{setFormValues:function(e,t){var a=this;this.id=e.id,this.reviewModify=t;var o={};c()(e).forEach(function(t){a.form.getFieldDecorator(t),o[t]=e[t]}),o.toDeptId=""+e.toDeptId,o.date=m()(o.date),this.form.setFieldsValue(o)},reset:function(){this.outLoading=!1,this.form.resetFields(),this.dataSource=[],this.autoData={},this.tableIndex=0},onClose:function(){this.reset(),this.$emit("close")},setTableValues:function(e){for(var t in e)e[t].editable=!1,e[t].isNew=!1;this.dataSource=e},handleSubmit:function(){var e=this;this.form.validateFields(function(t,a){if(!t){var o=[];if(e.dataSource.forEach(function(e){!1===e.isNew&&!1===e.editable&&o.push(e)}),o.length>0){var r=d()(o,function(e,t){return"key"===e||"editable"===e||"isNew"===e?void 0:t}),n=a.date;e.outLoading=!0,e.$put("storeroomOut",i()({},a,{isPut:"2",storeroomList:r,id:e.id,date:n.format("YYYY-MM-DD")})).then(function(t){e.reviewModify&&e.$put("reviewModify/alreadyEdited",e.reviewModify),e.reset(),e.$emit("success")}).catch(function(){e.outLoading=!1})}else e.$message.warning("出库名单至少要有一条数据")}})},saveRow:function(e){var t=this.dataSource.filter(function(t){return t.id===e})[0];t.editable=!1,t.isNew=!1;var a=JSON.parse(t.name);t.name=a.name},edit:function(e){var t=this.dataSource.filter(function(t){return t.id===e})[0];t.editable=!t.editable},cancle:function(e){var t=this.dataSource.filter(function(t){return t.id===e})[0];t.editable=!1;var a=JSON.parse(t.name);t.name=a.name},handleStoreroomChange:function(e,t,a){var o=[].concat(r()(this.dataSource)),n=o.filter(function(e){return t===e.id})[0];n&&(n[a]=e,this.dataSource=o)},onSelect:function(e,t){e=JSON.parse(e),this.dataSource.forEach(function(a){a.id===t&&(a.money=e.money)})},handleSearch:function(e,t){var a=this;e&&this.$get("price/"+e,{}).then(function(e){e.data.length&&(a.autoData[t]=e.data,a.$refs[t].showSearch=!0)})},filterOption:function(e,t){return t.componentOptions.children[0].text.toUpperCase().indexOf(e.toUpperCase())>=0}},watch:{outEditVisiable:function(){var e=this;this.outEditVisiable&&(this.loading=!0,this.$get("dept").then(function(t){e.deptTreeData=t.data.rows.children}),this.$get("storeroomOut/storeroomByOutId",{outId:this.id}).then(function(t){e.loading=!1,e.setTableValues(t.data)}))}}},h={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("a-drawer",{staticStyle:{height:"calc(100% - 55px)",overflow:"auto","padding-bottom":"53px"},attrs:{title:"修改出库",maskClosable:!1,width:"1220",placement:"right",closable:!1,visible:e.outEditVisiable},on:{close:e.onClose}},[a("a-form",{attrs:{form:e.form}},[a("a-row",{staticClass:"form-row"},[a("a-col",{attrs:{md:12,sm:24}},[a("a-form-item",e._b({attrs:{label:"单号"}},"a-form-item",e.formItemLayout,!1),[a("a-input",{directives:[{name:"decorator",rawName:"v-decorator",value:["num",{rules:[{required:!0,message:"出库单单号不能为空"}]}],expression:"['num',{rules: [{ required: true, message: '出库单单号不能为空'}]}]"}],attrs:{placeholder:"出库单单号",autocomplete:"off",autoFocus:""}})],1)],1),e._v(" "),a("a-col",{attrs:{md:12,sm:24}},[a("a-form-item",e._b({attrs:{label:"日期"}},"a-form-item",e.formItemLayout,!1),[a("a-date-picker",{directives:[{name:"decorator",rawName:"v-decorator",value:["date",{rules:[{required:!0,message:"请选择录入日期"}]}],expression:"['date',{rules: [{ required: true, message: '请选择录入日期'}]}]"}],staticStyle:{width:"100%"},attrs:{placeholder:"日期",autocomplete:"off",format:"YYYY-MM-DD"}})],1)],1),e._v(" "),a("a-col",{attrs:{md:12,sm:24}},[a("a-form-item",e._b({attrs:{label:"经手人"}},"a-form-item",e.formItemLayout,!1),[a("a-input",{directives:[{name:"decorator",rawName:"v-decorator",value:["handle"],expression:"['handle']"}],attrs:{placeholder:"经手人",autocomplete:"off"}})],1)],1),e._v(" "),a("a-col",{attrs:{md:12,sm:24}},[a("a-form-item",e._b({attrs:{label:"保管员"}},"a-form-item",e.formItemLayout,!1),[a("a-input",{directives:[{name:"decorator",rawName:"v-decorator",value:["storage"],expression:"['storage']"}],attrs:{placeholder:"保管员",autocomplete:"off"}})],1)],1),e._v(" "),a("a-col",{attrs:{md:12,sm:24}},[a("a-form-item",e._b({attrs:{label:"出库部门"}},"a-form-item",e.formItemLayout,!1),[a("a-tree-select",{directives:[{name:"decorator",rawName:"v-decorator",value:["toDeptId"],expression:"['toDeptId']"}],attrs:{dropdownStyle:{maxHeight:"220px",overflow:"auto"},treeData:e.deptTreeData}})],1)],1)],1)],1),e._v(" "),a("a-card",{attrs:{title:"出库名单",bordered:!1}},[a("a-table",{attrs:{columns:e.columns,dataSource:e.dataSource,pagination:!1,loading:e.loading,rowKey:"id"},scopedSlots:e._u([e._l(["name","money","amount","unit","type","remark","receipt"],function(t,o){return{key:t,fn:function(r,n){return[n.editable?a("a-input",{key:t,staticStyle:{margin:"-5px 0"},attrs:{value:r,placeholder:e.columns[o].title},on:{change:function(a){return e.handleStoreroomChange(a.target.value,n.id,t)}}}):[e._v(e._s(r))]]}}}),{key:"name",fn:function(t,o){return[o.editable||o.isNew?[a("a-auto-complete",{ref:o.id,attrs:{placeholder:"物品名称",filterOption:e.filterOption},on:{select:function(t){return e.onSelect(t,o.id)}},model:{value:o.name,callback:function(t){e.$set(o,"name",t)},expression:"record.name"}},[a("template",{slot:"dataSource"},e._l(e.autoData[o.id],function(t){return a("a-select-option",{key:t.id,attrs:{value:JSON.stringify(t)}},[e._v(e._s(t.name))])}),1),e._v(" "),a("a-input",{on:{pressEnter:function(t){return e.handleSearch(o.name,o.id)}}},[a("a-icon",{staticClass:"certain-category-icon",attrs:{slot:"suffix",type:"search"},on:{click:function(t){return e.handleSearch(o.name,o.id)}},slot:"suffix"})],1)],2)]:a("span",[e._v(e._s(t))])]}},{key:"money",fn:function(t,o){return[o.editable||o.isNew?[a("a-input-number",{attrs:{min:0,precision:2,formatter:function(e){return e},placeholder:"单价"},model:{value:o.money,callback:function(t){e.$set(o,"money",t)},expression:"record.money"}})]:a("span",[e._v(e._s(e.$tools.addZero(e.$tools.toNumFormant(t))))])]}},{key:"operation",fn:function(t,o){return[o.editable?[o.isNew?a("span",[a("a",{on:{click:function(t){return e.saveRow(o.id)}}},[e._v("添加")])]):a("span",[a("a",{on:{click:function(t){return e.saveRow(o.id)}}},[e._v("保存")]),e._v(" "),a("a-divider",{attrs:{type:"vertical"}}),e._v(" "),a("a",{on:{click:function(t){return e.cancle(o.id)}}},[e._v("取消")])],1)]:a("span",[a("a",{on:{click:function(t){return e.edit(o.id)}}},[e._v("编辑")])])]}}],null,!0)})],1),e._v(" "),a("div",{staticClass:"drawer-bootom-button"},[a("a-popconfirm",{attrs:{title:"确定放弃编辑？",okText:"确定",cancelText:"取消"},on:{confirm:e.onClose}},[a("a-button",{staticStyle:{"margin-right":".8rem"}},[e._v("取消")])],1),e._v(" "),a("a-button",{attrs:{type:"primary",loading:e.outLoading},on:{click:e.handleSubmit}},[e._v("提交")])],1)],1)},staticRenderFns:[]},v=a("VU/8")(p,h,!1,null,null,null);t.default=v.exports}});