webpackJsonp([23,44,86],{KcAJ:function(e,t){},eioI:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var s=a("Gu7T"),i=a.n(s),n=a("fZjL"),o=a.n(n),r=a("Dd8w"),l=a.n(r),c=a("dC1H"),d=a("et8n"),u=a("SJI6"),p=c.a.Item,f={components:{AStepItemGroup:d.a.Group,AStepItem:d.a,DetailListItem:p,DetailList:c.a},name:"FixedAssetsInfo",props:{fixedAssetsInfoVisiable:{require:!0,default:!1},fixedAssetsInfoData:{require:!0}},data:function(){return{previewVisible:!1,previewImage:"",fileList:[],planList:[],reviewList:[],loading:!1}},computed:l()({},Object(u.mapState)({user:function(e){return e.account.user}}),{columns:function(){return[{title:"物品名称",dataIndex:"name"},{title:"数量",dataIndex:"amount"},{title:"金额",dataIndex:"remark"}]},current:function(){return-1===this.fixedAssetsInfoData.process?this.fixedAssetsInfoData.step:this.fixedAssetsInfoData.step+this.fixedAssetsInfoData.process},status:function(){return 2===this.fixedAssetsInfoData.process?"finish":-1===this.fixedAssetsInfoData.process?"error":"process"}}),methods:{handleCancleClick:function(){this.$emit("close")},processEnglishToChinese:function(e){switch(e){case 0:return"后勤";case 1:return"财务";case 2:return"副职";case 3:return"正职";default:return e}},bell:function(e){var t=this,a=this.user.username+" 催了您一下固定资产申请单号为 "+this.fixedAssetsInfoData.num+" 的流程进度";this.$post("message",{message:a,sender:this.user.username,senderDept:this.user.deptName,addressee:e}).then(function(a){t.$message.success("已向 "+("logistics"===e?"行政后勤":e)+" 通知")})},handleCancel:function(){this.previewVisible=!1},handlePreview:function(e){this.previewImage=e.url||e.thumbUrl,this.previewVisible=!0},handleChange:function(e){var t=e.file,a=e.fileList;e.event,"error"===t.status?this.$message.error(t.name+" 上传失败"):"removed"===t.status&&(this.fileList=a)},handleRemove:function(e){var t=this;"removed"===e.status&&t.$delete("application/deleteFile/"+e.uid).then(function(){t.$message.success(e.name+" 删除成功")})},handleNoPermissionRemove:function(e){e.status="done",this.$message.warning("您无此权限")},handleBeforeUpload:function(e){var t="image/jpeg"===e.type,a="image/png"===e.type;t||a||this.$message.error("You can only upload JPG or PNG file!");var s=e.size/1024/1024<2;return s||this.$message.error("Image must smaller than 2MB!"),(t||a)&&s},customRequest:function(e){var t=this,a=e.data,s=e.file,n=e.filename,r=e.onError,l=e.onProgress,c=e.onSuccess,d=new FormData;return a&&o()(a).map(function(e){d.append(e,a[e])}),d.append(n,s),d.append("id",this.fixedAssetsInfoData.id),this.$upload("application/uploadApplicationPhoto",d,{onUploadProgress:function(e){var t=e.total,a=e.loaded;l({percent:Math.round(a/t*100).toFixed(2)},s)}}).then(function(e){t.$message.success(s.name+" 上传成功"),t.fileList=[].concat(i()(t.fileList),[e.data.data]),c(e.data.data,s)}).catch(r),{abort:function(){this.$message.warning("upload progress is aborted.")}}}},watch:{fixedAssetsInfoVisiable:function(){var e=this;this.fixedAssetsInfoVisiable&&(this.reviewList=this.fixedAssetsInfoData.review.split(","),this.loading=!0,this.$get("application/applicationPlan",{applicationId:this.fixedAssetsInfoData.id}).then(function(t){e.loading=!1,e.planList=t.data}),this.$get("application/applicationFiles",{applicationId:this.fixedAssetsInfoData.id}).then(function(t){e.fileList=t.data.data}))}}},m={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("a-modal",{attrs:{title:"固定资产申请信息",centered:!0,width:1e3,visible:e.fixedAssetsInfoVisiable,keyboard:!1,footer:null},on:{cancel:e.handleCancleClick}},[a("a-card",{attrs:{bordered:!1}},[a("a-steps",{attrs:{progressDot:"",current:e.current,status:e.status}},[a("a-step",{attrs:{title:"创建"}},[a("a-step-item-group",{attrs:{slot:"description"},slot:"description"},[a("a-step-item",{staticStyle:{cursor:"default"},attrs:{title:e.fixedAssetsInfoData.createDate}})],1)],1),e._v(" "),e._l(e.reviewList,function(t,s){return[a("a-step",{key:s,attrs:{title:e.processEnglishToChinese(s)}},[a("a-step-item-group",{attrs:{slot:"description"},slot:"description"},[e.current===s+1&&0===e.fixedAssetsInfoData.process&&t!==e.user.username?a("a-step-item",{attrs:{title:"催一下",icon:"bell"},nativeOn:{click:function(a){return e.bell(t)}}}):e.current>s+1||1===e.fixedAssetsInfoData.process?a("a-step-item",{staticStyle:{cursor:"default"},attrs:{title:"审核通过",icon:"check-circle"}}):e.current===s+1&&-1===e.fixedAssetsInfoData.process?a("a-step-item",{staticStyle:{cursor:"default"},attrs:{title:"审核未通过",icon:"exclamation-circle"}}):e._e()],1)],1)]}),e._v(" "),a("a-step",{attrs:{title:"待入库"}},[a("a-step-item-group",{attrs:{slot:"description"},slot:"description"},[1===e.fixedAssetsInfoData.process?a("a-step-item",{attrs:{title:"催一下",icon:"bell"},nativeOn:{click:function(t){return e.bell("logistics")}}}):2===e.fixedAssetsInfoData.process?a("a-step-item",{staticStyle:{cursor:"default"},attrs:{title:"已入库",icon:"check-circle"}}):e._e()],1)],1),e._v(" "),a("a-step",{attrs:{title:"完成"}})],2),e._v(" "),a("a-divider",{staticStyle:{"margin-bottom":"32px"}})],1),e._v(" "),a("a-card",{attrs:{bordered:!1}},[a("detail-list",[a("detail-list-item",{attrs:{term:"申请部门"}},[e._v(e._s(e.fixedAssetsInfoData.deptName))]),e._v(" "),a("detail-list-item",{attrs:{term:"申请日期"}},[e._v(e._s(e.fixedAssetsInfoData.createDate))]),e._v(" "),a("detail-list-item",{attrs:{term:"联系人"}},[e._v(e._s(e.fixedAssetsInfoData.handle))]),e._v(" "),a("detail-list-item",{attrs:{term:"电话"}},[e._v(e._s(e.fixedAssetsInfoData.num))]),e._v(" "),a("detail-list-item",{attrs:{term:"预计金额"}},[e._v(e._s(e.$tools.addZero(e.$tools.toNumFormant(e.fixedAssetsInfoData.money))))]),e._v(" "),a("detail-list-item",{attrs:{term:"申请购买理由"}},[e._v(e._s(e.fixedAssetsInfoData.description))])],1),e._v(" "),a("a-divider",{staticStyle:{"margin-bottom":"32px"}}),e._v(" "),a("detail-list",[a("a-table",{ref:"TableInfo",attrs:{columns:e.columns,dataSource:e.planList,pagination:!1,loading:e.loading,rowKey:"id"}})],1),e._v(" "),a("div",{staticStyle:{"margin-top":"32px"}},[a("div",{directives:[{name:"hasPermission",rawName:"v-hasPermission",value:"application:addDeletePhoto",expression:"'application:addDeletePhoto'"}]},[a("a-upload",{attrs:{accept:"image/jpg,image/png,image/jpeg,image/bmp",listType:"picture-card",fileList:e.fileList,remove:e.handleRemove,customRequest:e.customRequest,beforeUpload:e.handleBeforeUpload},on:{preview:e.handlePreview,change:e.handleChange}},[e.fileList.length<8?a("div",[a("a-icon",{attrs:{type:"plus"}}),e._v(" "),a("div",{staticClass:"ant-upload-text"},[e._v("Upload")])],1):e._e()]),e._v(" "),a("a-modal",{attrs:{visible:e.previewVisible,footer:null},on:{cancel:e.handleCancel}},[a("img",{staticStyle:{width:"100%"},attrs:{alt:"example",src:e.previewImage}})])],1),e._v(" "),a("div",{directives:[{name:"hasNoPermission",rawName:"v-hasNoPermission",value:"application:addDeletePhoto",expression:"'application:addDeletePhoto'"}]},[a("a-upload",{attrs:{accept:"image/jpg,image/png,image/jpeg,image/bmp",listType:"picture-card",fileList:e.fileList,remove:e.handleNoPermissionRemove,customRequest:e.customRequest,beforeUpload:e.handleBeforeUpload},on:{preview:e.handlePreview,change:e.handleChange}}),e._v(" "),a("a-modal",{attrs:{visible:e.previewVisible,footer:null},on:{cancel:e.handleCancel}},[a("img",{staticStyle:{width:"100%"},attrs:{alt:"example",src:e.previewImage}})])],1)])],1)],1)},staticRenderFns:[]},h=a("VU/8")(f,m,!1,function(e){a("y6rO")},"data-v-f92db22a",null);t.default=h.exports},skgF:function(e,t){},t9TO:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var s=a("Dd8w"),i=a.n(s),n=a("JpjP"),o=a("eioI"),r=a("y1pl"),l=a("/XKx"),c=a("SJI6"),d=a("Mc2z"),u={name:"FixedAssets",components:{RangeDate:n.a,FixedAssetsInfo:o.default,FixedAssetsAdd:r.default,PutAdd:l.default},data:function(){return{advanced:!1,fixedAssetsInfo:{visiable:!1,data:{}},fixedAssetsAdd:{visiable:!1},putAdd:{visiable:!1},queryParams:{createTimeFrom:"",createTimeTo:""},filteredInfo:null,sortedInfo:null,paginationInfo:null,dataSource:[],selectedRowKeys:[],selectedRows:[],putingData:{},loading:!1,pagination:{pageSizeOptions:["10","20","30","40","100"],defaultCurrent:1,defaultPageSize:10,showQuickJumper:!0,showSizeChanger:!0,showTotal:function(e,t){return"显示 "+t[0]+" ~ "+t[1]+" 条记录，共 "+e+" 条记录"}}}},computed:i()({},Object(c.mapState)({user:function(e){return e.account.user}}),{columns:function(){var e=this.$createElement,t=this.sortedInfo,a=this.filteredInfo;return t=t||{},a=a||{},[{title:"申请部门",dataIndex:"deptName"},{title:"申请日期",dataIndex:"createDate",sorter:!0,sortOrder:"createDate"===t.columnKey&&t.order},{title:"联系人",dataIndex:"handle"},{title:"电话",dataIndex:"num"},{title:"流程状态",dataIndex:"process",customRender:function(t,a,s){switch(t){case 2:return e("a-tag",{attrs:{color:"green"}},["已入库"]);case 1:return e("a-tag",{attrs:{color:"cyan"}},["已通过"]);case 0:return e("a-tag",{attrs:{color:"purple"}},["待审核"]);case-1:return e("a-tag",{attrs:{color:"pink"}},["未通过"]);default:return t}},filters:[{text:"未通过",value:"-1"},{text:"待审核",value:"0"},{text:"已通过",value:"1"},{text:"已入库",value:"2"}],filterMultiple:!1,filteredValue:a.process||null},{title:"操作",dataIndex:"operation",scopedSlots:{customRender:"operation"},fixed:"right",width:150}]}}),mounted:function(){this.fetch()},methods:{onSelectChange:function(e,t){this.selectedRowKeys=e,this.selectedRows=t},toggleAdvanced:function(){this.advanced=!this.advanced,this.advanced||(this.queryParams.num="")},isPass:function(e,t){var a=this,s={id:t.id,createDate:t.createDate,typeApplication:t.typeApplication,process:0,username:t.username};e?t.review.split(",").length===t.step?s.process=1:s.step=t.step+1:s.process=-1,this.loading=!0,this.$put("application",i()({},s)).then(function(e){a.fetch(),a.$message.success("操作成功")})},view:function(e){this.fixedAssetsInfo.data=e,this.fixedAssetsInfo.visiable=!0},add:function(){this.fixedAssetsAdd.visiable=!0},handleFixedAssetsAddClose:function(){this.fixedAssetsAdd.visiable=!1},handleFixedAssetsAddSuccess:function(){this.fixedAssetsAdd.visiable=!1,this.$message.success("新增固定资产申请成功"),this.search()},storage:function(e){var t=this;this.putingData=e,this.$get("application/applicationPlan",{applicationId:this.putingData.id}).then(function(a){a.data.forEach(function(e){e.money=parseFloat(e.remark)}),t.$refs.putAdd.setTableValues(e.typeApplication,a.data)}),this.putAdd.visiable=!0},handlePutAddClose:function(){this.putAdd.visiable=!1},handlePutAddSuccess:function(){var e=this;this.putAdd.visiable=!1,this.$message.success("新增入库成功"),this.loading=!0,this.$put("application",{id:this.putingData.id,createDate:this.putingData.createDate,typeApplication:this.putingData.typeApplication,username:this.putingData.username,process:2}).then(function(t){e.search(),e.putingData={}})},handleFixedAssetsInfoClose:function(){this.fixedAssetsInfo.visiable=!1},handleTypeFixedAssetsChange:function(e){this.queryParams.typeApplication=e||""},handleDateChange:function(e){e&&(this.queryParams.createTimeFrom=e[0],this.queryParams.createTimeTo=e[1])},batchDelete:function(){if(this.selectedRowKeys.length){var e=this;this.$confirm({title:"确定删除所选中的记录?",content:"当您点击确定按钮后，这些记录将会被彻底删除",centered:!0,onOk:function(){e.$delete("application/"+e.selectedRowKeys.join(",")).then(function(){e.$message.success("删除成功"),e.selectedRowKeys=[],e.selectedRows=[],e.search()})},onCancel:function(){e.selectedRowKeys=[],e.selectedRows=[]}})}else this.$message.warning("请选择需要删除的记录")},exportExcel:function(){var e=this;if(this.selectedRowKeys.length){var t=[],a={};this.selectedRows.forEach(function(s){t.push({id:s.id,deptName:s.deptName,createDate:s.createDate,handle:s.handle,num:s.num,money:s.money,description:s.description,appDept:s.appDept}),e.$get("application/applicationPlan",{applicationId:s.id}).then(function(e){var t=[];e.data.forEach(function(e){t.push(["",e.name,e.amount,e.remark])}),a[s.id]=t})}),this.$message.loading("正在生成",3,function(){t.forEach(function(e){var t=Object(d.d)("FixedAssets");t=Object(d.a)(t,"FixedAssets",e),t=Object(d.b)(t,"FixedAssets",a[""+e.id]);var s="固定资产申请单_"+e.deptName+"_"+e.handle+".xlsx";Object(d.e)(t,s),Object(d.c)(t,"FixedAssets",a[""+e.id].length)})})}else this.$message.warning("请选择需要导出的记录")},search:function(){var e=this.sortedInfo,t=this.filteredInfo,a=void 0,s=void 0;e&&(a=e.field,s=e.order),this.fetch(i()({sortField:a,sortOrder:s},this.queryParams,t))},reset:function(){this.selectedRowKeys=[],this.selectedRows=[],this.$refs.TableInfo.pagination.current=this.pagination.defaultCurrent,this.paginationInfo&&(this.paginationInfo.current=this.pagination.defaultCurrent,this.paginationInfo.pageSize=this.pagination.defaultPageSize),this.filteredInfo=null,this.sortedInfo=null,this.queryParams={createTimeFrom:"",createTimeTo:""},this.putingData={},this.$refs.createTime.reset(),this.fetch()},handleTableChange:function(e,t,a){this.paginationInfo=e,this.filteredInfo=t,this.sortedInfo=a,this.fixedAssetsInfo.visiable=!1,this.fetch(i()({sortField:a.field,sortOrder:a.order},this.queryParams,t))},fetch:function(){var e=this,t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};this.loading=!0,this.paginationInfo?(this.$refs.TableInfo.pagination.current=this.paginationInfo.current,this.$refs.TableInfo.pagination.pageSize=this.paginationInfo.pageSize,t.pageSize=this.paginationInfo.pageSize,t.pageNum=this.paginationInfo.current):(t.pageSize=this.pagination.defaultPageSize,t.pageNum=this.pagination.defaultCurrent),this.$get("application",i()({},t,{typeApplication:5})).then(function(t){var a=t.data,s=i()({},e.pagination);s.total=a.total,e.dataSource=a.rows,e.pagination=s,e.loading=!1})}}},p={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("a-card",{staticClass:"card-area",attrs:{bordered:!1}},[a("div",{class:e.advanced?"search":null},[a("a-form",{attrs:{layout:"horizontal"}},[a("a-row",[a("div",{class:e.advanced?null:"fold"},[a("a-col",{attrs:{md:12,sm:24}},[a("a-form-item",{attrs:{label:"申请日期",labelCol:{span:5},wrapperCol:{span:18,offset:1}}},[a("range-date",{ref:"createTime",on:{change:e.handleDateChange}})],1)],1),e._v(" "),a("a-col",{attrs:{md:12,sm:24}},[a("a-form-item",{attrs:{label:"联系人",labelCol:{span:5},wrapperCol:{span:18,offset:1}}},[a("a-input",{model:{value:e.queryParams.handle,callback:function(t){e.$set(e.queryParams,"handle",t)},expression:"queryParams.handle"}})],1)],1),e._v(" "),e.advanced?[a("a-col",{attrs:{md:12,sm:24}},[a("a-form-item",{attrs:{label:"电话",labelCol:{span:5},wrapperCol:{span:18,offset:1}}},[a("a-input",{model:{value:e.queryParams.num,callback:function(t){e.$set(e.queryParams,"num",t)},expression:"queryParams.num"}})],1)],1)]:e._e()],2),e._v(" "),a("span",{staticStyle:{float:"right",margin:"3px auto 1em"}},[a("a-button",{attrs:{type:"primary"},on:{click:e.search}},[e._v("查询")]),e._v(" "),a("a-button",{staticStyle:{"margin-left":"8px"},on:{click:e.reset}},[e._v("重置")]),e._v(" "),a("a",{staticStyle:{"margin-left":"8px"},on:{click:e.toggleAdvanced}},[e._v("\n            "+e._s(e.advanced?"收起":"展开")+"\n            "),a("a-icon",{attrs:{type:e.advanced?"up":"down"}})],1)],1)])],1)],1),e._v(" "),a("div",[a("div",{staticClass:"operator"},[a("a-button",{directives:[{name:"hasPermission",rawName:"v-hasPermission",value:"fixedAssets:add",expression:"'fixedAssets:add'"}],attrs:{type:"primary",ghost:""},on:{click:e.add}},[e._v("新增")]),e._v(" "),a("a-button",{directives:[{name:"hasPermission",rawName:"v-hasPermission",value:"fixedAssets:delete",expression:"'fixedAssets:delete'"}],on:{click:e.batchDelete}},[e._v("删除")]),e._v(" "),a("a-button",{directives:[{name:"hasPermission",rawName:"v-hasPermission",value:"fixedAssets:export",expression:"'fixedAssets:export'"}],on:{click:e.exportExcel}},[e._v("导出申请单")])],1),e._v(" "),a("a-table",{ref:"TableInfo",attrs:{columns:e.columns,dataSource:e.dataSource,pagination:e.pagination,loading:e.loading,rowSelection:{selectedRowKeys:e.selectedRowKeys,onChange:e.onSelectChange},scroll:{x:900},rowKey:"id"},on:{change:e.handleTableChange},scopedSlots:e._u([{key:"operation",fn:function(t,s){return[a("a-icon",{directives:[{name:"hasPermission",rawName:"v-hasPermission",value:"fixedAssets:view",expression:"'fixedAssets:view'"}],attrs:{type:"eye",theme:"twoTone",twoToneColor:"#42b983",title:"查看"},on:{click:function(t){return e.view(s)}}}),e._v("\n         \n        "),a("a-popconfirm",{attrs:{title:"是否通过此申请 ?",okText:"通过",cancelText:"不通过"},on:{confirm:function(t){return e.isPass(1,s)},cancel:function(t){return e.isPass(0,s)}}},[0===s.process&&s.review.split(",")[s.step-1]===e.user.username?a("a-icon",{directives:[{name:"hasPermission",rawName:"v-hasPermission",value:"fixedAssets:update",expression:"'fixedAssets:update'"}],attrs:{type:"check-circle",theme:"twoTone",twoToneColor:"#9451ff",title:"确认"}}):e._e()],1),e._v(" "),1===s.process&&"wxclkg"!==e.user.username&&"lbbjkg"!==e.user.username?a("a-icon",{directives:[{name:"hasPermission",rawName:"v-hasPermission",value:"storeroomPut:add",expression:"'storeroomPut:add'"}],attrs:{type:"database",theme:"twoTone",twoToneColor:"#01c9c4",title:"入库"},on:{click:function(t){return e.storage(s)}}}):e._e()]}}])})],1),e._v(" "),a("fixed-assets-info",{attrs:{fixedAssetsInfoData:e.fixedAssetsInfo.data,fixedAssetsInfoVisiable:e.fixedAssetsInfo.visiable},on:{close:e.handleFixedAssetsInfoClose}}),e._v(" "),a("fixed-assets-add",{attrs:{fixedAssetsAddVisiable:e.fixedAssetsAdd.visiable},on:{close:e.handleFixedAssetsAddClose,success:e.handleFixedAssetsAddSuccess}}),e._v(" "),a("put-add",{ref:"putAdd",attrs:{putAddVisiable:e.putAdd.visiable},on:{close:e.handlePutAddClose,success:e.handlePutAddSuccess}})],1)},staticRenderFns:[]},f=a("VU/8")(u,p,!1,function(e){a("KcAJ")},"data-v-4a15a584",null);t.default=f.exports},y1pl:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var s=a("Gu7T"),i=a.n(s),n=a("mvHQ"),o=a.n(n),r=a("Dd8w"),l=a.n(r),c=a("SJI6"),d={labelCol:{span:4},wrapperCol:{span:17,offset:1}},u={name:"FixedAssetsAdd",props:{fixedAssetsAddVisiable:{default:!1}},data:function(){return{loading:!1,formItemLayout:d,form:this.$form.createForm(this),dataSource:[],tableIndex:0}},computed:l()({},Object(c.mapState)({user:function(e){return e.account.user}}),{columns:function(){return[{title:"物品名称",dataIndex:"name",scopedSlots:{customRender:"name"}},{title:"数量",dataIndex:"amount",scopedSlots:{customRender:"amount"}},{title:"金额",dataIndex:"remark",scopedSlots:{customRender:"remark"}},{title:"操作",dataIndex:"action",width:"15%",scopedSlots:{customRender:"operation"}}]}}),methods:{reset:function(){this.loading=!1,this.form.resetFields(),this.dataSource=[]},onClose:function(){this.reset(),this.$emit("close")},handleSubmit:function(){var e=this;this.form.validateFields(function(t,a){if(!t){var s=[];if(e.dataSource.forEach(function(e){!1===e.isNew&&!1===e.editable&&s.push(e)}),0!==s.length){var i=o()(s,function(e,t){return"key"===e||"editable"===e||"isNew"===e?void 0:t});e.loading=!0,e.$post("application",l()({},a,{typeApplication:5,deptId:e.user.deptId,planList:i})).then(function(t){e.reset(),e.$emit("success")}).catch(function(){e.loading=!1})}else e.$message.warning("计划单至少要有一条数据")}})},newRow:function(){this.tableIndex++,this.dataSource.push({key:this.tableIndex,name:"",amount:1,remark:"1",editable:!0,isNew:!0})},remove:function(e){var t=this.dataSource.filter(function(t){return t.key!==e});this.dataSource=t},saveRow:function(e){var t=this.dataSource.filter(function(t){return t.key===e})[0];t.editable=!1,t.isNew=!1},edit:function(e){var t=this.dataSource.filter(function(t){return t.key===e})[0];t.editable=!t.editable},cancle:function(e){this.dataSource.filter(function(t){return t.key===e})[0].editable=!1},handlePlanChange:function(e,t,a){var s=[].concat(i()(this.dataSource)),n=s.filter(function(e){return t===e.key})[0];n&&(n[a]=e,this.dataSource=s)}}},p={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("a-drawer",{staticStyle:{height:"calc(100% - 55px)",overflow:"auto","padding-bottom":"53px"},attrs:{title:"新增固定资产申请",maskClosable:!1,width:"920",placement:"right",closable:!1,visible:e.fixedAssetsAddVisiable},on:{close:e.onClose}},[a("a-form",{attrs:{form:e.form}},[a("a-row",{staticClass:"form-row"},[a("a-col",{attrs:{md:12,sm:24}},[a("a-form-item",e._b({attrs:{label:"申请部门"}},"a-form-item",e.formItemLayout,!1),[a("a-input",{attrs:{placeholder:"申请部门",autocomplete:"off",disabled:"",value:this.user.deptName}})],1)],1),e._v(" "),a("a-col",{attrs:{md:12,sm:24}},[a("a-form-item",e._b({attrs:{label:"联系人"}},"a-form-item",e.formItemLayout,!1),[a("a-input",{directives:[{name:"decorator",rawName:"v-decorator",value:["handle"],expression:"['handle']"}],attrs:{placeholder:"联系人",autocomplete:"off",autoFocus:""}})],1)],1),e._v(" "),a("a-col",{attrs:{md:12,sm:24}},[a("a-form-item",e._b({attrs:{label:"电话"}},"a-form-item",e.formItemLayout,!1),[a("a-input",{directives:[{name:"decorator",rawName:"v-decorator",value:["num"],expression:"['num']"}],attrs:{placeholder:"电话",autocomplete:"off"}})],1)],1),e._v(" "),a("a-col",{attrs:{md:12,sm:24}},[a("a-form-item",e._b({attrs:{label:"预计金额"}},"a-form-item",e.formItemLayout,!1),[a("a-input-number",{directives:[{name:"decorator",rawName:"v-decorator",value:["money",{rules:[{required:!0,message:"预计金额不能为空"}]}],expression:"['money',{rules: [{ required: true, message: '预计金额不能为空' }]}]"}],staticStyle:{width:"100%"},attrs:{min:0,precision:2,formatter:function(e){return e},autocomplete:"off",placeholder:"预计金额"}})],1)],1),e._v(" "),a("a-col",{attrs:{md:12,sm:24}},[a("a-form-item",e._b({attrs:{label:"购买理由"}},"a-form-item",e.formItemLayout,!1),[a("a-textarea",{directives:[{name:"decorator",rawName:"v-decorator",value:["description"],expression:"['description']"}],attrs:{placeholder:"申请购买理由",autocomplete:"off"}})],1)],1),e._v(" "),a("a-col",{attrs:{md:12,sm:24}},[a("a-form-item",e._b({attrs:{label:"规格要求"}},"a-form-item",e.formItemLayout,!1),[a("a-textarea",{directives:[{name:"decorator",rawName:"v-decorator",value:["appDept"],expression:"['appDept']"}],attrs:{placeholder:"规格要求",autocomplete:"off"}})],1)],1)],1)],1),e._v(" "),a("a-card",{attrs:{bordered:!1}},[a("a-table",{attrs:{columns:e.columns,dataSource:e.dataSource,pagination:!1},scopedSlots:e._u([e._l(["name","amount","remark"],function(t,s){return{key:t,fn:function(i,n){return[n.editable?a("a-input",{key:t,staticStyle:{margin:"-5px 0"},attrs:{value:i,placeholder:e.columns[s].title},on:{change:function(a){return e.handlePlanChange(a.target.value,n.key,t)}}}):[e._v(e._s(i))]]}}}),{key:"amount",fn:function(t,s){return[s.editable||s.isNew?[a("a-input-number",{attrs:{min:.01,precision:2,formatter:function(e){return e},placeholder:"数量"},model:{value:s.amount,callback:function(t){e.$set(s,"amount",t)},expression:"record.amount"}})]:a("span",[e._v(e._s(t))])]}},{key:"remark",fn:function(t,s){return[s.editable||s.isNew?[a("a-input-number",{attrs:{min:.01,max:1e6,precision:2,formatter:function(e){return e},placeholder:"金额"},model:{value:s.remark,callback:function(t){e.$set(s,"remark",t)},expression:"record.remark"}})]:a("span",[e._v(e._s(t))])]}},{key:"operation",fn:function(t,s){return[s.editable?[s.isNew?a("span",[a("a",{on:{click:function(t){return e.saveRow(s.key)}}},[e._v("添加")]),e._v(" "),a("a-divider",{attrs:{type:"vertical"}}),e._v(" "),a("a-popconfirm",{attrs:{title:"是否要删除此行？"},on:{confirm:function(t){return e.remove(s.key)}}},[a("a",[e._v("删除")])])],1):a("span",[a("a",{on:{click:function(t){return e.saveRow(s.key)}}},[e._v("保存")]),e._v(" "),a("a-divider",{attrs:{type:"vertical"}}),e._v(" "),a("a",{on:{click:function(t){return e.cancle(s.key)}}},[e._v("取消")])],1)]:a("span",[a("a",{on:{click:function(t){return e.edit(s.key)}}},[e._v("编辑")]),e._v(" "),a("a-divider",{attrs:{type:"vertical"}}),e._v(" "),a("a-popconfirm",{attrs:{title:"是否要删除此行？"},on:{confirm:function(t){return e.remove(s.key)}}},[a("a",[e._v("删除")])])],1)]}}],null,!0)}),e._v(" "),a("a-button",{staticStyle:{width:"100%","margin-top":"16px","margin-bottom":"8px"},attrs:{type:"dashed",icon:"plus"},on:{click:e.newRow}},[e._v("新增物品")])],1),e._v(" "),a("div",{staticClass:"drawer-bootom-button"},[a("a-popconfirm",{attrs:{title:"确定放弃编辑？",okText:"确定",cancelText:"取消"},on:{confirm:e.onClose}},[a("a-button",{staticStyle:{"margin-right":".8rem"}},[e._v("取消")])],1),e._v(" "),a("a-button",{attrs:{type:"primary",loading:e.loading},on:{click:e.handleSubmit}},[e._v("提交")])],1)],1)},staticRenderFns:[]},f=a("VU/8")(u,p,!1,function(e){a("skgF")},"data-v-2408127a",null);t.default=f.exports},y6rO:function(e,t){}});