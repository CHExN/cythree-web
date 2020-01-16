webpackJsonp([43,155],{"0q38":function(e,t){},WF4I:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=a("bOdI"),r=a.n(o),n=a("Dd8w"),i=a.n(n),s=a("BO1k"),l=a.n(s),d=a("ov/b"),u=a("JpjP"),c={name:"Storeroom",components:{OutAdd:d.default,RangeDate:u.a},data:function(){return{advanced:!1,outAdd:{visiable:!1},dataSource:[],selectedRowKeys:[],paginationInfo:null,dictData:{},pagination:{pageSizeOptions:["10","20","30","40","100"],defaultCurrent:1,defaultPageSize:10,showQuickJumper:!0,showSizeChanger:!0,showTotal:function(e,t){return"显示 "+t[0]+" ~ "+t[1]+" 条记录，共 "+e+" 条记录"}},queryParams:{createTimeFrom:"",createTimeTo:""},loading:!1}},computed:{columns:function(){var e=this;return[{title:"物品名称",dataIndex:"name"},{title:"型号",dataIndex:"type"},{title:"库存",dataIndex:"amount",scopedSlots:{customRender:"amount"}},{title:"单位",dataIndex:"unit"},{title:"单价",dataIndex:"money",scopedSlots:{customRender:"money"}},{title:"收据",dataIndex:"receipt"},{title:"物资类别",dataIndex:"typeApplication",customRender:function(t,a,o){return e.dictData.typeApplication[t]}},{title:"供应商",dataIndex:"supplier",customRender:function(t,a,o){return e.dictData.supplier[t]}},{title:"备注",dataIndex:"remark",scopedSlots:{customRender:"remark"},width:200},{title:"入库日期",dataIndex:"date"},{title:"入库单号",dataIndex:"putNum"}]}},mounted:function(){this.loadSelect()},methods:{onSelectChange:function(e){this.selectedRowKeys=e},toggleAdvanced:function(){this.advanced=!this.advanced,this.advanced||(this.queryParams.name="",this.queryParams.putNum="",this.queryParams.unit="",this.queryParams.receipt="",this.queryParams.createTimeFrom="",this.queryParams.createTimeTo="",this.queryParams.remark="")},addStoreroomOut:function(){if(this.selectedRowKeys.length){var e=void 0,t=void 0,a=[],o=!0,r=!1,n=void 0;try{for(var i,s=l()(this.dataSource);!(o=(i=s.next()).done);o=!0){var d=i.value;if(this.selectedRowKeys.includes(d.id)){if(void 0===e&&(e=d.typeApplication),void 0===t&&(t=d.supplier),e!==d.typeApplication)return a=[],this.selectedRowKeys.splice(this.selectedRowKeys.indexOf(d.id),1),void this.$message.warning("出库的物品类型只能有一种");if(t!==d.supplier)return a=[],this.selectedRowKeys.splice(this.selectedRowKeys.indexOf(d.id),1),void this.$message.warning("出库的供应商只能有一种");d.storeroomCount=d.amount,a.push(this.$tools.deepClone(d))}}}catch(e){r=!0,n=e}finally{try{!o&&s.return&&s.return()}finally{if(r)throw n}}var u=this;this.$confirm({title:"确定出库所选中的记录?",content:"当您点击确定按钮后，这些记录将会被出库",centered:!0,onOk:function(){u.$refs.outAdd.setTableValues(a),u.outAdd.visiable=!0},onCancel:function(){u.selectedRowKeys=[]}})}else this.$message.warning("请选择需要出库的记录")},handleOutAddClose:function(){this.outAdd.visiable=!1},handleOutAddSuccess:function(){this.outAdd.visiable=!1,this.selectedRowKeys=[],this.$message.success("新增出库单成功"),this.search()},handleTypeApplicationChange:function(e){this.queryParams.typeApplication=e||""},handleSupplierChange:function(e){this.queryParams.supplier=e||""},handleDateChange:function(e){e&&(this.queryParams.createTimeFrom=e[0],this.queryParams.createTimeTo=e[1])},search:function(){this.fetch(i()({},this.queryParams))},reset:function(){this.selectedRowKeys=[],this.$refs.TableInfo.pagination.current=this.pagination.defaultCurrent,this.paginationInfo&&(this.paginationInfo.current=this.pagination.defaultCurrent,this.paginationInfo.pageSize=this.pagination.defaultPageSize),this.paginationInfo=null,this.queryParams={createTimeFrom:"",createTimeTo:""},this.advanced&&this.$refs.createTime.reset(),this.fetch()},handleTableChange:function(e,t,a){this.paginationInfo=e,this.fetch(i()({},this.queryParams))},loadSelect:function(){var e=this;this.$get("supplier/all",{}).then(function(t){var a={};t.data.forEach(function(e){a.supplier?a.supplier[e.id]=e.name:a.supplier=r()({},e.id,e.name)}),e.dictData=i()({},e.dictData,a)}),this.$get("dict/cy_storeroom",{}).then(function(t){var a={};t.data.forEach(function(t){var o=e.$tools.toHump(t.fieldName.toLowerCase());a[o]?a[o][t.keyy]=t.valuee:a[o]=r()({},t.keyy,t.valuee)}),e.dictData=i()({},e.dictData,a),e.fetch()})},fetch:function(){var e=this,t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};this.loading=!0,this.paginationInfo?(this.$refs.TableInfo.pagination.current=this.paginationInfo.current,this.$refs.TableInfo.pagination.pageSize=this.paginationInfo.pageSize,t.pageSize=this.paginationInfo.pageSize,t.pageNum=this.paginationInfo.current):(t.pageSize=this.pagination.defaultPageSize,t.pageNum=this.pagination.defaultCurrent),this.$get("storeroom",i()({},t)).then(function(t){var a=t.data,o=i()({},e.pagination);o.total=a.total,e.loading=!1,e.dataSource=a.rows,e.pagination=o})}}},m={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("a-card",{staticClass:"card-area",attrs:{bordered:!1}},[a("div",{class:e.advanced?"search":null},[a("a-form",{attrs:{layout:"horizontal"}},[a("a-row",[a("div",{class:e.advanced?null:"fold"},[a("a-col",{attrs:{md:12,sm:24}},[a("a-form-item",{attrs:{label:"物资类别",labelCol:{span:5},wrapperCol:{span:18,offset:1}}},[a("a-select",{attrs:{mode:"multiple",allowClear:!0},on:{change:e.handleTypeApplicationChange}},e._l(Object.keys(e.dictData.typeApplication||[]),function(t){return a("a-select-option",{key:t},[e._v(e._s(e.dictData.typeApplication[t]))])}),1)],1)],1),e._v(" "),a("a-col",{attrs:{md:12,sm:24}},[a("a-form-item",{attrs:{label:"供应商",labelCol:{span:5},wrapperCol:{span:18,offset:1}}},[a("a-select",{attrs:{mode:"multiple",allowClear:!0},on:{change:e.handleSupplierChange}},e._l(Object.keys(e.dictData.supplier||[]),function(t){return a("a-select-option",{key:t},[e._v(e._s(e.dictData.supplier[t]))])}),1)],1)],1),e._v(" "),e.advanced?[a("a-col",{attrs:{md:12,sm:24}},[a("a-form-item",{attrs:{label:"物品名称",labelCol:{span:5},wrapperCol:{span:18,offset:1}}},[a("a-input",{model:{value:e.queryParams.name,callback:function(t){e.$set(e.queryParams,"name",t)},expression:"queryParams.name"}})],1)],1),e._v(" "),a("a-col",{attrs:{md:12,sm:24}},[a("a-form-item",{attrs:{label:"入库单号",labelCol:{span:5},wrapperCol:{span:18,offset:1}}},[a("a-input",{model:{value:e.queryParams.putNum,callback:function(t){e.$set(e.queryParams,"putNum",t)},expression:"queryParams.putNum"}})],1)],1),e._v(" "),a("a-col",{attrs:{md:12,sm:24}},[a("a-form-item",{attrs:{label:"型号",labelCol:{span:5},wrapperCol:{span:18,offset:1}}},[a("a-input",{model:{value:e.queryParams.type,callback:function(t){e.$set(e.queryParams,"type",t)},expression:"queryParams.type"}})],1)],1),e._v(" "),a("a-col",{attrs:{md:12,sm:24}},[a("a-form-item",{attrs:{label:"收据",labelCol:{span:5},wrapperCol:{span:18,offset:1}}},[a("a-input",{model:{value:e.queryParams.receipt,callback:function(t){e.$set(e.queryParams,"receipt",t)},expression:"queryParams.receipt"}})],1)],1),e._v(" "),a("a-col",{attrs:{md:12,sm:24}},[a("a-form-item",{attrs:{label:"入库日期",labelCol:{span:5},wrapperCol:{span:18,offset:1}}},[a("range-date",{ref:"createTime",on:{change:e.handleDateChange}})],1)],1),e._v(" "),a("a-col",{attrs:{md:12,sm:24}},[a("a-form-item",{attrs:{label:"备注",labelCol:{span:5},wrapperCol:{span:18,offset:1}}},[a("a-input",{model:{value:e.queryParams.remark,callback:function(t){e.$set(e.queryParams,"remark",t)},expression:"queryParams.remark"}})],1)],1)]:e._e()],2),e._v(" "),a("span",{staticStyle:{float:"right",margin:"3px auto 1em"}},[a("a-button",{attrs:{type:"primary"},on:{click:e.search}},[e._v("查询")]),e._v(" "),a("a-button",{staticStyle:{"margin-left":"8px"},on:{click:e.reset}},[e._v("重置")]),e._v(" "),a("a",{staticStyle:{"margin-left":"8px"},on:{click:e.toggleAdvanced}},[e._v("\n            "+e._s(e.advanced?"收起":"展开")+"\n            "),a("a-icon",{attrs:{type:e.advanced?"up":"down"}})],1)],1)])],1)],1),e._v(" "),a("div",[a("div",{staticClass:"operator"},[a("a-button",{directives:[{name:"hasPermission",rawName:"v-hasPermission",value:"storeroomOut:add",expression:"'storeroomOut:add'"}],attrs:{type:"primary",ghost:""},on:{click:e.addStoreroomOut}},[e._v("出库")])],1),e._v(" "),a("a-table",{ref:"TableInfo",attrs:{columns:e.columns,dataSource:e.dataSource,pagination:e.pagination,loading:e.loading,rowSelection:{selectedRowKeys:e.selectedRowKeys,onChange:e.onSelectChange},scroll:{x:900},rowKey:"id"},on:{change:e.handleTableChange},scopedSlots:e._u([{key:"amount",fn:function(t){return[a("span",[e._v(e._s(e.$tools.toNumFormant(t)))])]}},{key:"money",fn:function(t){return[a("span",[e._v(e._s(e.$tools.addZero(e.$tools.toNumFormant(t))))])]}},{key:"remark",fn:function(t){return[a("a-popover",{attrs:{placement:"topLeft"}},[a("template",{slot:"content"},[a("div",[e._v(e._s(t))])]),e._v(" "),a("p",{staticStyle:{width:"200px","margin-bottom":"0"}},[e._v(e._s(t))])],2)]}}])})],1),e._v(" "),a("out-add",{ref:"outAdd",attrs:{outAddVisiable:e.outAdd.visiable},on:{close:e.handleOutAddClose,success:e.handleOutAddSuccess}})],1)},staticRenderFns:[]},p=a("VU/8")(c,m,!1,function(e){a("0q38")},"data-v-36f37b2e",null);t.default=p.exports},"ov/b":function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=a("BO1k"),r=a.n(o),n=a("Dd8w"),i=a.n(n),s=a("mvHQ"),l=a.n(s),d=a("Zbla"),u=a("Zz1P"),c=a.n(u);c.a.locale("zh-cn");var m={labelCol:{span:4},wrapperCol:{span:17}},p={name:"StoreroomOutAdd",components:{DeptInputTree:d.default},props:{outAddVisiable:{default:!1}},data:function(){return{loading:!1,dataSource:[],tableIndex:0,modalVisible:!1,dictData:{},deptId:"",formItemLayout:m,form:this.$form.createForm(this)}},computed:{columns:function(){return[{title:"物品名称",dataIndex:"name"},{title:"型号",dataIndex:"type"},{title:"出库数量",dataIndex:"amount",scopedSlots:{customRender:"amount"}},{title:"单位",dataIndex:"unit"},{title:"备注",dataIndex:"remark"},{title:"单价",dataIndex:"money",scopedSlots:{customRender:"money"}},{title:"收据",dataIndex:"receipt"}]}},methods:{reset:function(){this.loading=!1,this.$refs.deptTree.reset(),this.form.resetFields(),this.dataSource=[]},onClose:function(){this.reset(),this.$emit("close")},setTableValues:function(e){this.dataSource=e},handleSubmit:function(){var e=this;this.form.validateFields(function(t,a){if(!t){var o=!0,n=!1,s=void 0;try{for(var d,u=r()(e.dataSource);!(o=(d=u.next()).done);o=!0){var c=d.value;if(""===c.amount||void 0===c.amount)return void e.$message.warning("请填写正确的出库数量")}}catch(t){n=!0,s=t}finally{try{!o&&u.return&&u.return()}finally{if(n)throw s}}var m=l()(e.dataSource,function(e,t){return"date"===e||"toDeptId"===e||"parentId"===e||"createTimeFrom"===e||"createTimeTo"===e||"status"===e||"amountDist"===e?void 0:t}),p=a.date;e.loading=!0,e.$post("storeroomOut",i()({},a,{date:p.format("YYYY-MM-DD"),storeroomList:m})).then(function(t){e.reset(),e.$emit("success")}).catch(function(){e.loading=!1})}})}},watch:{outAddVisiable:function(){this.outAddVisiable&&(this.form.getFieldDecorator("date"),this.form.setFieldsValue({date:c()()}))}}},f={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("a-drawer",{staticStyle:{height:"calc(100% - 55px)",overflow:"auto","padding-bottom":"53px"},attrs:{title:"新增出库",maskClosable:!1,width:"1220",placement:"right",closable:!1,visible:e.outAddVisiable},on:{close:e.onClose}},[a("a-form",{attrs:{form:e.form}},[a("a-row",{staticClass:"form-row"},[a("a-col",{attrs:{md:12,sm:24}},[a("a-form-item",e._b({attrs:{label:"单号"}},"a-form-item",e.formItemLayout,!1),[a("a-input",{directives:[{name:"decorator",rawName:"v-decorator",value:["num",{rules:[{required:!0,message:"出库单单号不能为空"}]}],expression:"['num',{rules: [{ required: true, message: '出库单单号不能为空'}]}]"}],attrs:{placeholder:"出库单单号",autocomplete:"off",autoFocus:""}})],1)],1),e._v(" "),a("a-col",{attrs:{md:12,sm:24}},[a("a-form-item",e._b({attrs:{label:"日期"}},"a-form-item",e.formItemLayout,!1),[a("a-date-picker",{directives:[{name:"decorator",rawName:"v-decorator",value:["date",{rules:[{required:!0,message:"请选择录入日期"}]}],expression:"['date',{rules: [{ required: true, message: '请选择录入日期'}]}]"}],staticStyle:{width:"100%"},attrs:{placeholder:"日期",autocomplete:"off",format:"YYYY-MM-DD"}})],1)],1),e._v(" "),a("a-col",{attrs:{md:12,sm:24}},[a("a-form-item",e._b({attrs:{label:"经手人"}},"a-form-item",e.formItemLayout,!1),[a("a-input",{directives:[{name:"decorator",rawName:"v-decorator",value:["handle"],expression:"['handle']"}],attrs:{placeholder:"经手人",autocomplete:"off"}})],1)],1),e._v(" "),a("a-col",{attrs:{md:12,sm:24}},[a("a-form-item",e._b({attrs:{label:"保管员"}},"a-form-item",e.formItemLayout,!1),[a("a-input",{directives:[{name:"decorator",rawName:"v-decorator",value:["storage"],expression:"['storage']"}],attrs:{placeholder:"保管员",autocomplete:"off"}})],1)],1),e._v(" "),a("a-col",{attrs:{md:12,sm:24}},[a("a-form-item",e._b({attrs:{label:"出库部门"}},"a-form-item",e.formItemLayout,!1),[a("dept-input-tree",{directives:[{name:"decorator",rawName:"v-decorator",value:["toDeptId",{rules:[{required:!0,message:"请选择出库部门"}]}],expression:"['toDeptId',{\n            rules: [{ required: true, message: '请选择出库部门' }]\n          }]"}],ref:"deptTree",attrs:{placeholder:"出库部门"}})],1)],1)],1)],1),e._v(" "),a("a-card",{attrs:{title:"出库名单",bordered:!1}},[a("a-table",{ref:"TableInfo",attrs:{columns:e.columns,dataSource:e.dataSource,pagination:!1,rowKey:"id"},scopedSlots:e._u([{key:"amount",fn:function(t,o){return[a("a-input-number",{attrs:{min:.01,max:o.storeroomCount,precision:3,formatter:function(e){return e}},model:{value:o.amount,callback:function(t){e.$set(o,"amount",t)},expression:"record.amount"}})]}},{key:"money",fn:function(t){return[a("span",[e._v(e._s(e.$tools.toNumFormant(t)))])]}}])})],1),e._v(" "),a("div",{staticClass:"drawer-bootom-button"},[a("a-popconfirm",{attrs:{title:"确定放弃编辑？",okText:"确定",cancelText:"取消"},on:{confirm:e.onClose}},[a("a-button",{staticStyle:{"margin-right":".8rem"}},[e._v("取消")])],1),e._v(" "),a("a-button",{attrs:{type:"primary",loading:e.loading},on:{click:e.handleSubmit}},[e._v("提交")])],1)],1)},staticRenderFns:[]},h=a("VU/8")(p,f,!1,null,null,null);t.default=h.exports}});