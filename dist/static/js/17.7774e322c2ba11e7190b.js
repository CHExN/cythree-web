webpackJsonp([17,62,150,151],{"896v":function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r=a("Dd8w"),n=a.n(r),o={labelCol:{span:4},wrapperCol:{span:17}},i={name:"ContractAdd",props:{contractAddVisiable:{default:!1}},data:function(){return{loading:!1,formItemLayout:o,form:this.$form.createForm(this)}},methods:{reset:function(){this.loading=!1,this.form.resetFields()},onClose:function(){this.reset(),this.$emit("close")},handleSubmit:function(){var t=this;this.form.validateFields(function(e,a){e?t.$message.warning("格式出错，请检查表单"):(t.loading=!0,t.$post("contract",n()({},a)).then(function(e){t.reset(),t.$emit("success")}).catch(function(){t.loading=!1}))})}}},s={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("a-drawer",{staticStyle:{height:"calc(100% - 55px)",overflow:"auto","padding-bottom":"53px"},attrs:{title:"新增合同联审单",maskClosable:!1,width:"650",placement:"right",closable:!1,visible:t.contractAddVisiable},on:{close:t.onClose}},[a("a-form",{attrs:{form:t.form}},[a("a-form-item",t._b({attrs:{label:"合同名称"}},"a-form-item",t.formItemLayout,!1),[a("a-input",{directives:[{name:"decorator",rawName:"v-decorator",value:["contractName",{rules:[{required:!0,message:"合同名称不能为空"}]}],expression:"['contractName',{\n          rules: [{ required: true, message: '合同名称不能为空' }]\n        }]"}],attrs:{placeholder:"合同名称",autocomplete:"off"}})],1),t._v(" "),a("a-form-item",t._b({attrs:{label:"合同对方"}},"a-form-item",t.formItemLayout,!1),[a("a-input",{directives:[{name:"decorator",rawName:"v-decorator",value:["contractPartner"],expression:"['contractPartner']"}],attrs:{placeholder:"合同对方",autocomplete:"off"}})],1),t._v(" "),a("a-form-item",t._b({attrs:{label:"经过招标否"}},"a-form-item",t.formItemLayout,!1),[a("a-select",{directives:[{name:"decorator",rawName:"v-decorator",value:["isTender",{rules:[{required:!0,message:"请选择"}]}],expression:"['isTender', {\n          rules: [{ required: true, message: '请选择' }]\n        }]"}],attrs:{placeholder:"合同约定事项是否经过招标",allowClear:!0}},[a("a-select-option",{key:"1"},[t._v("是")]),t._v(" "),a("a-select-option",{key:"0"},[t._v("否")])],1)],1),t._v(" "),a("a-form-item",t._b({attrs:{label:"合同编号"}},"a-form-item",t.formItemLayout,!1),[a("a-input",{directives:[{name:"decorator",rawName:"v-decorator",value:["contractNum",{rules:[{required:!0,message:"合同编号不能为空"}]}],expression:"['contractNum',{\n          rules: [{ required: true, message: '合同编号不能为空' }]\n        }]"}],attrs:{placeholder:"合同编号",autocomplete:"off"}})],1),t._v(" "),a("a-form-item",t._b({attrs:{label:"合同金额"}},"a-form-item",t.formItemLayout,!1),[a("a-input-number",{directives:[{name:"decorator",rawName:"v-decorator",value:["contractAmount",{rules:[{required:!0,message:"合同金额不能为空"}]}],expression:"['contractAmount',{\n          rules: [{ required: true, message: '合同金额不能为空' }]\n        }]"}],staticStyle:{width:"100%"},attrs:{min:0,max:99999999,precision:2,formatter:function(t){return t},autocomplete:"off",placeholder:"合同金额"}})],1),t._v(" "),a("a-form-item",t._b({attrs:{label:"其他情况说明"}},"a-form-item",t.formItemLayout,!1),[a("a-textarea",{directives:[{name:"decorator",rawName:"v-decorator",value:["remark"],expression:"['remark']"}],attrs:{placeholder:"其他情况说明",autocomplete:"off"}})],1)],1),t._v(" "),a("div",{staticClass:"drawer-bootom-button"},[a("a-popconfirm",{attrs:{title:"确定放弃编辑？",okText:"确定",cancelText:"取消"},on:{confirm:t.onClose}},[a("a-button",{staticStyle:{"margin-right":".8rem"}},[t._v("取消")])],1),t._v(" "),a("a-button",{attrs:{type:"primary",loading:t.loading},on:{click:t.handleSubmit}},[t._v("提交")])],1)],1)},staticRenderFns:[]},c=a("VU/8")(i,s,!1,null,null,null);e.default=c.exports},C1xN:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r=a("Gu7T"),n=a.n(r),o=a("fZjL"),i=a.n(o),s=a("Dd8w"),c=a.n(s),l=a("dC1H"),d=a("et8n"),u=a("SJI6"),m=l.a.Item,f=[{name:"合同承办部门意见",value:"opinionStart",date:"dateStart"},{name:"法务审核意见",value:"opinionLegal",date:"dateLegal"},{name:"财务审核意见",value:"opinionFinancial",date:"dateFinancial"},{name:"关联部门意见",value:"opinionAss",date:"dateAss"},{name:"合同管理管理部门意见",value:"opinionOffice",date:"dateOffice"},{name:"合同承办部门主管领导意见",value:"opinionHead",date:"dateHead"},{name:"合同管理部门主管领导意见",value:"opinionViceCaptain",date:"dateViceCaptain"},{name:"单位负责人意见",value:"opinionCaptain",date:"dateCaptain"}],p={components:{AStepItemGroup:d.a.Group,AStepItem:d.a,DetailListItem:m,DetailList:l.a},name:"ContractInfo",props:{contractInfoVisiable:{require:!0,default:!1},contractInfoData:{require:!0}},data:function(){return{reviewNameList:["管理部门","承办部门领导","管理部门领导","单位负责人"],reviewList:[],fileList:[],data:f}},computed:c()({},Object(u.mapState)({user:function(t){return t.account.user}}),{current:function(){var t=this.contractInfoData,e=t.process,a=t.step,r=t.isInitiate,n=t.isFinance;return-1===e?0===r||0===n?1:a+1:0===r||0===n?1:a+e+1},status:function(){return 1===this.contractInfoData.process?"finish":-1===this.contractInfoData.process?"error":"process"}}),methods:{handleCancleClick:function(){this.$emit("close")},handleRemove:function(t){var e=this;if("removed"===t.status){e.$delete("contract/deleteFile/"+t.uid).then(function(){e.$message.success(t.name.slice(t.name.indexOf("_")+1)+" 删除成功")});var a=e.fileList.indexOf(t),r=e.fileList.slice();r.splice(a,1),e.fileList=r}},handleBeforeUpload:function(t){var e=t.size/1024/1024<20;return e||this.$message.error("File must smaller than 20Mb!"),e},customRequest:function(t){var e=this,a=t.data,r=t.file,o=(t.filename,t.onError),s=t.onProgress,c=t.onSuccess,l=new FormData;return a&&i()(a).map(function(t){l.append(t,a[t])}),l.append("file",r),l.append("id",this.contractInfoData.id),this.$upload("contract/uploadContractFile",l,{onUploadProgress:function(t){var e=t.total,a=t.loaded;s({percent:Math.round(a/e*100).toFixed(2)},r)}}).then(function(t){e.$message.success(r.name+" 上传成功"),e.fileList=[].concat(n()(e.fileList),[t.data.data]),c(t.data.data,r)}).catch(o),{abort:function(){this.$message.warning("upload progress is aborted.")}}},bell:function(t){var e=this,a=this.user.username+" 催了您一下合同联审单编号为 "+this.contractInfoData.contractNum+" 的审核进度";this.$post("message",{message:a,sender:this.user.username,senderDept:this.user.deptName,addressee:t}).then(function(a){e.$message.success("已向 "+t.replace(/,$/gi,"")+" 通知")})}},watch:{contractInfoVisiable:function(){var t=this;this.contractInfoVisiable&&(this.reviewList=this.contractInfoData.review.split(","),this.$get("contract/contractFiles",{contractId:this.contractInfoData.id}).then(function(e){t.fileList=e.data.data}))}}},v={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("a-modal",{attrs:{title:"合同联审单信息",centered:!0,width:1200,visible:t.contractInfoVisiable,keyboard:!1,footer:null},on:{cancel:t.handleCancleClick}},[a("a-card",{attrs:{bordered:!1}},[a("a-steps",{attrs:{progressDot:"",current:t.current,status:t.status}},[a("a-step",{attrs:{title:"创建"}},[a("a-step-item-group",{attrs:{slot:"description"},slot:"description"},[a("a-step-item",{staticStyle:{cursor:"default"},attrs:{title:t.contractInfoData.createDate}})],1)],1),t._v(" "),a("a-step",{attrs:{title:"联审部门"}},[a("a-step-item-group",{attrs:{slot:"description"},slot:"description"},[1===t.current&&0===t.contractInfoData.process?a("a-step-item",{attrs:{title:"催一下",icon:"bell"},nativeOn:{click:function(e){t.bell((0===t.contractInfoData.isInitiate?t.user.username+",":"")+(0===t.contractInfoData.isFinance?"finance":""))}}}):1===t.contractInfoData.isInitiate&&1===t.contractInfoData.isFinance?a("a-step-item",{staticStyle:{cursor:"default"},attrs:{title:"审核通过",icon:"check-circle"}}):a("a-step-item",{staticStyle:{cursor:"default"},attrs:{title:"审核未通过",icon:"exclamation-circle"}})],1)],1),t._v(" "),t._l(t.reviewList,function(e,r){return[a("a-step",{key:r,attrs:{title:t.reviewNameList[r]}},[a("a-step-item-group",{attrs:{slot:"description"},slot:"description"},[t.current===r+2&&0===t.contractInfoData.process&&e!==t.user.username?a("a-step-item",{attrs:{title:"催一下",icon:"bell"},nativeOn:{click:function(a){return t.bell(e)}}}):t.current>r+2||1===t.contractInfoData.process?a("a-step-item",{staticStyle:{cursor:"default"},attrs:{title:"审核通过",icon:"check-circle"}}):t.current===r+2&&-1===t.contractInfoData.process?a("a-step-item",{staticStyle:{cursor:"default"},attrs:{title:"审核未通过",icon:"exclamation-circle"}}):t._e()],1)],1)]}),t._v(" "),a("a-step",{attrs:{title:"完成"}})],2),t._v(" "),a("a-divider",{staticStyle:{"margin-bottom":"32px"}})],1),t._v(" "),a("a-card",{attrs:{bordered:!1}},[a("detail-list",{attrs:{title:"基本信息"}},[a("detail-list-item",{attrs:{term:"单位名称"}},[t._v("北京市朝阳区环境卫生服务中心")]),t._v(" "),a("detail-list-item",{attrs:{term:"承办部门"}},[t._v(t._s(t.contractInfoData.deptName))]),t._v(" "),a("detail-list-item",{attrs:{term:"合同名称"}},[t._v(t._s(t.contractInfoData.contractName))]),t._v(" "),a("detail-list-item",{attrs:{term:"合同对方"}},[t._v(t._s(t.contractInfoData.contractPartner))]),t._v(" "),a("detail-list-item",{attrs:{term:"合同约定事项是否经过招标"}},[t._v(t._s("1"===t.contractInfoData.isTender?"是":"否"))]),t._v(" "),a("detail-list-item",{attrs:{term:"合同编号"}},[t._v(t._s(t.contractInfoData.contractNum))]),t._v(" "),a("detail-list-item",{attrs:{term:"合同金额"}},[t._v(t._s(t.$tools.addZero(t.$tools.toNumFormant(t.contractInfoData.contractAmount)))+" 元")]),t._v(" "),a("detail-list-item",{attrs:{term:"其他情况说明"}},[t._v(t._s(t.contractInfoData.remark))])],1),t._v(" "),a("a-divider",{staticStyle:{"margin-bottom":"32px"}}),t._v(" "),a("detail-list",{attrs:{title:"审核情况"}},t._l(t.data,function(e,r){return a("a-card-grid",{key:r,staticStyle:{width:"25%",height:"100px",textAlign:"'center'"}},[a("a-comment",{staticStyle:{left:"-18px",top:"-22px"},attrs:{author:e.name}},[a("p",{attrs:{slot:"content"},slot:"content"},[t._v(t._s(t.contractInfoData[e.value]?t.contractInfoData[e.value]:"- -"))]),t._v(" "),a("a-tooltip",{attrs:{slot:"datetime"},slot:"datetime"},[a("span",[t._v(t._s(t.contractInfoData[e.date]))])])],1)],1)}),1),t._v(" "),a("div",{staticStyle:{"margin-top":"32px"}},[a("a-upload-dragger",{attrs:{fileList:t.fileList,remove:t.handleRemove,customRequest:t.customRequest,beforeUpload:t.handleBeforeUpload,disabled:t.fileList.length>5}},[a("p",{staticClass:"ant-upload-drag-icon"},[a("a-icon",{attrs:{type:"inbox"}})],1),t._v(" "),a("p",{staticClass:"ant-upload-hint"},[t._v("单击或拖动文件到此区域进行上传")])])],1)],1)],1)},staticRenderFns:[]},h=a("VU/8")(p,v,!1,function(t){a("hNfg")},"data-v-6cb5e166",null);e.default=h.exports},I0TD:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r=a("fZjL"),n=a.n(r),o=a("+6Bu"),i=a.n(o),s=a("Dd8w"),c=a.n(s),l=a("SJI6"),d=a("Zz1P"),u=a.n(d);u.a.locale("zh-cn");var m={labelCol:{span:4},wrapperCol:{span:17}},f={name:"ContractEdit",props:{contractEditVisiable:{default:!1}},data:function(){return{loading:!1,formItemLayout:m,contractInfoData:{},dataUpdate:{},id:"",form:this.$form.createForm(this)}},computed:c()({},Object(l.mapState)({user:function(t){return t.account.user}})),methods:{reset:function(){this.loading=!1,this.form.resetFields()},onClose:function(){this.reset(),this.$emit("close")},onUpdateChange:function(t){this.dataUpdate[t]=u()().format("YYYY-MM-DD")},setFormValues:function(t){var e=this,a=i()(t,[]),r=0,o=100;r^=o,r^=o^=r,this.contractInfoData=a,this.id=a.id;var s={};n()(a).forEach(function(t){e.form.getFieldDecorator(t),s[t]=a[t]}),this.form.setFieldsValue(s)},handleSubmit:function(){var t=this;this.form.validateFields(function(e,a){if(e)t.$message.warning("格式出错，请检查表单");else{t.loading=!0;var r=c()({id:t.id},a,t.dataUpdate);t.$put("contract",c()({},r)).then(function(e){t.reset(),t.$emit("success")}).catch(function(){t.loading=!1})}})}}},p={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("a-drawer",{staticStyle:{height:"calc(100% - 55px)",overflow:"auto","padding-bottom":"53px"},attrs:{title:"新增合同联审单",maskClosable:!1,width:"650",placement:"right",closable:!1,visible:t.contractEditVisiable},on:{close:t.onClose}},[a("a-form",{attrs:{form:t.form}},[a("a-form-item",t._b({attrs:{label:"合同名称"}},"a-form-item",t.formItemLayout,!1),[a("a-input",{directives:[{name:"decorator",rawName:"v-decorator",value:["contractName",{rules:[{required:!0,message:"合同名称不能为空"}]}],expression:"['contractName',{\n          rules: [{ required: true, message: '合同名称不能为空' }]\n        }]"}],attrs:{placeholder:"合同名称",autocomplete:"off"}})],1),t._v(" "),a("a-form-item",t._b({attrs:{label:"合同对方"}},"a-form-item",t.formItemLayout,!1),[a("a-input",{directives:[{name:"decorator",rawName:"v-decorator",value:["contractPartner"],expression:"['contractPartner']"}],attrs:{placeholder:"合同对方",autocomplete:"off"}})],1),t._v(" "),a("a-form-item",t._b({attrs:{label:"经过招标否"}},"a-form-item",t.formItemLayout,!1),[a("a-select",{directives:[{name:"decorator",rawName:"v-decorator",value:["isTender",{rules:[{required:!0,message:"请选择"}]}],expression:"['isTender', {\n          rules: [{ required: true, message: '请选择' }]\n        }]"}],attrs:{placeholder:"合同约定事项是否经过招标",allowClear:!0}},[a("a-select-option",{key:"1"},[t._v("是")]),t._v(" "),a("a-select-option",{key:"0"},[t._v("否")])],1)],1),t._v(" "),a("a-form-item",t._b({attrs:{label:"合同编号"}},"a-form-item",t.formItemLayout,!1),[a("a-input",{directives:[{name:"decorator",rawName:"v-decorator",value:["contractNum",{rules:[{required:!0,message:"合同编号不能为空"}]}],expression:"['contractNum',{\n          rules: [{ required: true, message: '合同编号不能为空' }]\n        }]"}],attrs:{placeholder:"合同编号",autocomplete:"off"}})],1),t._v(" "),a("a-form-item",t._b({attrs:{label:"合同金额"}},"a-form-item",t.formItemLayout,!1),[a("a-input-number",{directives:[{name:"decorator",rawName:"v-decorator",value:["contractAmount",{rules:[{required:!0,message:"合同金额不能为空"}]}],expression:"['contractAmount',{\n          rules: [{ required: true, message: '合同金额不能为空' }]\n        }]"}],staticStyle:{width:"100%"},attrs:{min:0,max:99999999,precision:2,formatter:function(t){return t},autocomplete:"off",placeholder:"合同金额"}})],1),t._v(" "),a("a-form-item",t._b({attrs:{label:"其他情况说明"}},"a-form-item",t.formItemLayout,!1),[a("a-textarea",{directives:[{name:"decorator",rawName:"v-decorator",value:["remark"],expression:"['remark']"}],attrs:{placeholder:"其他情况说明",autocomplete:"off"}})],1),t._v(" "),t.user.username===t.contractInfoData.username?a("a-form-item",t._b({attrs:{label:"承办部门"}},"a-form-item",t.formItemLayout,!1),[a("a-textarea",{directives:[{name:"decorator",rawName:"v-decorator",value:["opinionStart"],expression:"['opinionStart']"}],attrs:{placeholder:"合同承办部门意见",autocomplete:"off"},on:{change:function(e){return t.onUpdateChange("dateStart")}}})],1):t._e(),t._v(" "),t.user.username===t.contractInfoData.username?a("a-form-item",t._b({attrs:{label:"法务"}},"a-form-item",t.formItemLayout,!1),[a("a-textarea",{directives:[{name:"decorator",rawName:"v-decorator",value:["opinionLegal"],expression:"['opinionLegal']"}],attrs:{placeholder:"法务审核意见",autocomplete:"off"},on:{change:function(e){return t.onUpdateChange("dateLegal")}}})],1):t._e(),t._v(" "),"finance"===t.user.username?a("a-form-item",t._b({attrs:{label:"财务"}},"a-form-item",t.formItemLayout,!1),[a("a-textarea",{directives:[{name:"decorator",rawName:"v-decorator",value:["opinionFinancial"],expression:"['opinionFinancial']"}],attrs:{placeholder:"财务审核意见",autocomplete:"off"},on:{change:function(e){return t.onUpdateChange("dateFinancial")}}})],1):t._e(),t._v(" "),t.user.username===t.contractInfoData.username?a("a-form-item",t._b({attrs:{label:"关联部门"}},"a-form-item",t.formItemLayout,!1),[a("a-textarea",{directives:[{name:"decorator",rawName:"v-decorator",value:["opinionAss"],expression:"['opinionAss']"}],attrs:{placeholder:"关联部门意见",autocomplete:"off"},on:{change:function(e){return t.onUpdateChange("dateAss")}}})],1):t._e(),t._v(" "),"office"===t.user.username?a("a-form-item",t._b({attrs:{label:"管理部门"}},"a-form-item",t.formItemLayout,!1),[a("a-textarea",{directives:[{name:"decorator",rawName:"v-decorator",value:["opinionOffice"],expression:"['opinionOffice']"}],attrs:{placeholder:"合同管理部门意见",autocomplete:"off"},on:{change:function(e){return t.onUpdateChange("dateOffice")}}})],1):t._e(),t._v(" "),t.user.username===("union"===t.contractInfoData.username?"president":"vice")?a("a-form-item",t._b({attrs:{label:"承办部门主管"}},"a-form-item",t.formItemLayout,!1),[a("a-textarea",{directives:[{name:"decorator",rawName:"v-decorator",value:["opinionHead"],expression:"['opinionHead']"}],attrs:{placeholder:"合同承办部门主管领导意见",autocomplete:"off"},on:{change:function(e){return t.onUpdateChange("dateHead")}}})],1):t._e(),t._v(" "),"vice"===t.user.username?a("a-form-item",t._b({attrs:{label:"管理部门主管"}},"a-form-item",t.formItemLayout,!1),[a("a-textarea",{directives:[{name:"decorator",rawName:"v-decorator",value:["opinionViceCaptain"],expression:"['opinionViceCaptain']"}],attrs:{placeholder:"合同管理部门主管领导意见",autocomplete:"off"},on:{change:function(e){return t.onUpdateChange("dateViceCaptain")}}})],1):t._e(),t._v(" "),"captain"===t.user.username?a("a-form-item",t._b({attrs:{label:"负责人"}},"a-form-item",t.formItemLayout,!1),[a("a-textarea",{directives:[{name:"decorator",rawName:"v-decorator",value:["opinionCaptain"],expression:"['opinionCaptain']"}],attrs:{placeholder:"单位负责人意见",autocomplete:"off"},on:{change:function(e){return t.onUpdateChange("dateCaptain")}}})],1):t._e()],1),t._v(" "),a("div",{staticClass:"drawer-bootom-button"},[a("a-popconfirm",{attrs:{title:"确定放弃编辑？",okText:"确定",cancelText:"取消"},on:{confirm:t.onClose}},[a("a-button",{staticStyle:{"margin-right":".8rem"}},[t._v("取消")])],1),t._v(" "),a("a-button",{attrs:{type:"primary",loading:t.loading},on:{click:t.handleSubmit}},[t._v("提交")])],1)],1)},staticRenderFns:[]},v=a("VU/8")(f,p,!1,null,null,null);e.default=v.exports},N8Uu:function(t,e){},hNfg:function(t,e){},wj8X:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r=a("Dd8w"),n=a.n(r),o=a("C1xN"),i=a("896v"),s=a("I0TD"),c=a("Zbla"),l=a("SJI6"),d={name:"Contract",components:{ContractInfo:o.default,ContractAdd:i.default,ContractEdit:s.default,DeptInputTree:c.default},data:function(){return{advanced:!1,contractInfo:{visiable:!1,data:{}},contractAdd:{visiable:!1},contractEdit:{visiable:!1},queryParams:{},filteredInfo:null,sortedInfo:null,paginationInfo:null,dataSource:[],selectedRowKeys:[],loading:!1,pagination:{pageSizeOptions:["10","20","30","40","100"],defaultCurrent:1,defaultPageSize:10,showQuickJumper:!0,showSizeChanger:!0,showTotal:function(t,e){return"显示 "+e[0]+" ~ "+e[1]+" 条记录，共 "+t+" 条记录"}}}},computed:n()({},Object(l.mapState)({user:function(t){return t.account.user}}),{columns:function(){var t=this,e=this.$createElement,a=this.filteredInfo;return[{title:"承办部门",dataIndex:"deptName"},{title:"合同名称",dataIndex:"contractName"},{title:"合同编号",dataIndex:"contractNum"},{title:"合同伙伴",dataIndex:"contractPartner"},{title:"合同金额",dataIndex:"contractAmount",customRender:function(e,a,r){return t.$tools.addZero(t.$tools.toNumFormant(e))+" 元"}},{title:"招标否",dataIndex:"isTender",customRender:function(t,a,r){switch(t){case"0":return e("a-tag",["否"]);case"1":return e("a-tag",["是"]);default:return t}},filters:[{text:"是",value:"1"},{text:"否",value:"0"}],filterMultiple:!1,filteredValue:(a=a||{}).isTender||null},{title:"流程状态",dataIndex:"process",customRender:function(t,a,r){switch(t){case 1:return e("a-tag",{attrs:{color:"cyan"}},["已通过"]);case 0:return e("a-tag",{attrs:{color:"purple"}},["待审核"]);case-1:return e("a-tag",{attrs:{color:"pink"}},["未通过"]);default:return t}},filters:[{text:"未通过",value:"-1"},{text:"待审核",value:"0"},{text:"已通过",value:"1"}],filterMultiple:!1,filteredValue:a.process||null},{title:"操作",dataIndex:"operation",scopedSlots:{customRender:"operation"},fixed:"right",width:150}]}}),mounted:function(){this.fetch()},methods:{onSelectChange:function(t){this.selectedRowKeys=t},toggleAdvanced:function(){this.advanced=!this.advanced,this.advanced||(this.$refs.deptTree.reset(),this.queryParams.deptId="")},isReview:function(t){if(-1===t.process||1===t.process)return!1;var e=this.user.username,a=t.review.split(","),r=t.isInitiate,n=t.isFinance;return 1===r&&1===n?a[t.step-1]===e:0===r&&e===t.username||0===n&&"finance"===e},isPass:function(t,e){var a=this,r=this.user.username,o=e.review.split(","),i={id:e.id};t?1===e.isInitiate&&1===e.isFinance?o.length===e.step?i.process=1:i.step=e.step+1:r===e.username?i.isInitiate=1:"finance"===r&&(i.isFinance=1):i.process=-1,this.loading=!0,this.$put("contract",n()({},i)).then(function(t){a.fetch(),a.$message.success("操作成功")})},view:function(t){this.contractInfo.data=t,this.contractInfo.visiable=!0},add:function(){this.contractAdd.visiable=!0},handleContractAddClose:function(){this.contractAdd.visiable=!1},handleContractAddSuccess:function(){this.contractAdd.visiable=!1,this.$message.success("新增合同联审单成功"),this.search()},edit:function(t){this.$refs.contractEdit.setFormValues(t),this.contractEdit.visiable=!0},handleContractEditClose:function(){this.contractEdit.visiable=!1},handleContractEditSuccess:function(){this.contractEdit.visiable=!1,this.$message.success("修改合同联审单成功"),this.search()},handleContractInfoClose:function(){this.contractInfo.visiable=!1},handleDeptChange:function(t){this.queryParams.deptId=t||""},batchDelete:function(){if(this.selectedRowKeys.length){var t=this;this.$confirm({title:"确定删除所选中的记录?",content:"当您点击确定按钮后，这些记录将会被彻底删除",centered:!0,onOk:function(){t.$delete("contract/"+t.selectedRowKeys.join(",")).then(function(){t.$message.success("删除成功"),t.selectedRowKeys=[],t.search()})},onCancel:function(){t.selectedRowKeys=[]}})}else this.$message.warning("请选择需要删除的记录")},search:function(){var t=this.sortedInfo,e=this.filteredInfo,a=void 0,r=void 0;t&&(a=t.field,r=t.order),this.fetch(n()({sortField:a,sortOrder:r},this.queryParams,e))},reset:function(){this.selectedRowKeys=[],this.$refs.TableInfo.pagination.current=this.pagination.defaultCurrent,this.paginationInfo&&(this.paginationInfo.current=this.pagination.defaultCurrent,this.paginationInfo.pageSize=this.pagination.defaultPageSize),this.filteredInfo=null,this.sortedInfo=null,this.queryParams={},this.$refs.deptTree.reset(),this.fetch()},handleTableChange:function(t,e,a){this.paginationInfo=t,this.filteredInfo=e,this.sortedInfo=a,this.contractInfo.visiable=!1,this.fetch(n()({sortField:a.field,sortOrder:a.order},this.queryParams,e))},fetch:function(){var t=this,e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};this.loading=!0,this.paginationInfo?(this.$refs.TableInfo.pagination.current=this.paginationInfo.current,this.$refs.TableInfo.pagination.pageSize=this.paginationInfo.pageSize,e.pageSize=this.paginationInfo.pageSize,e.pageNum=this.paginationInfo.current):(e.pageSize=this.pagination.defaultPageSize,e.pageNum=this.pagination.defaultCurrent),this.$get("contract",n()({},e)).then(function(e){var a=e.data,r=n()({},t.pagination);r.total=a.total,t.dataSource=a.rows,t.pagination=r,t.loading=!1})}}},u={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("a-card",{staticClass:"card-area",attrs:{bordered:!1}},[a("div",{class:t.advanced?"search":null},[a("a-form",{attrs:{layout:"horizontal"}},[a("a-row",[a("div",{class:t.advanced?null:"fold"},[a("a-col",{attrs:{md:12,sm:24}},[a("a-form-item",{attrs:{label:"合同名称",labelCol:{span:5},wrapperCol:{span:18,offset:1}}},[a("a-input",{model:{value:t.queryParams.contractName,callback:function(e){t.$set(t.queryParams,"contractName",e)},expression:"queryParams.contractName"}})],1)],1),t._v(" "),a("a-col",{attrs:{md:12,sm:24}},[a("a-form-item",{attrs:{label:"合同编号",labelCol:{span:5},wrapperCol:{span:18,offset:1}}},[a("a-input",{model:{value:t.queryParams.contractNum,callback:function(e){t.$set(t.queryParams,"contractNum",e)},expression:"queryParams.contractNum"}})],1)],1),t._v(" "),t.advanced?[a("a-col",{attrs:{md:12,sm:24}},[a("a-form-item",{attrs:{label:"承办部门",labelCol:{span:5},wrapperCol:{span:18,offset:1}}},[a("dept-input-tree",{ref:"deptTree",on:{change:t.handleDeptChange}})],1)],1)]:t._e()],2),t._v(" "),a("span",{staticStyle:{float:"right",margin:"3px auto 1em"}},[a("a-button",{attrs:{type:"primary"},on:{click:t.search}},[t._v("查询")]),t._v(" "),a("a-button",{staticStyle:{"margin-left":"8px"},on:{click:t.reset}},[t._v("重置")]),t._v(" "),a("a",{staticStyle:{"margin-left":"8px"},on:{click:t.toggleAdvanced}},[t._v("\n            "+t._s(t.advanced?"收起":"展开")+"\n            "),a("a-icon",{attrs:{type:t.advanced?"up":"down"}})],1)],1)])],1)],1),t._v(" "),a("div",[a("div",{staticClass:"operator"},[a("a-button",{directives:[{name:"hasPermission",rawName:"v-hasPermission",value:"contract:add",expression:"'contract:add'"}],attrs:{type:"primary",ghost:""},on:{click:t.add}},[t._v("新增")]),t._v(" "),a("a-button",{directives:[{name:"hasPermission",rawName:"v-hasPermission",value:"contract:delete",expression:"'contract:delete'"}],on:{click:t.batchDelete}},[t._v("删除")])],1),t._v(" "),a("a-table",{ref:"TableInfo",attrs:{columns:t.columns,dataSource:t.dataSource,pagination:t.pagination,loading:t.loading,rowSelection:{selectedRowKeys:t.selectedRowKeys,onChange:t.onSelectChange},scroll:{x:900},rowKey:"id"},on:{change:t.handleTableChange},scopedSlots:t._u([{key:"operation",fn:function(e,r){return[a("a-icon",{directives:[{name:"hasPermission",rawName:"v-hasPermission",value:"contract:update",expression:"'contract:update'"}],attrs:{type:"setting",theme:"twoTone",twoToneColor:"#4a9ff5",title:"修改"},on:{click:function(e){return t.edit(r)}}}),t._v("\n         \n        "),a("a-icon",{directives:[{name:"hasPermission",rawName:"v-hasPermission",value:"contract:view",expression:"'contract:view'"}],attrs:{type:"eye",theme:"twoTone",twoToneColor:"#42b983",title:"查看"},on:{click:function(e){return t.view(r)}}}),t._v("\n         \n        "),a("a-popconfirm",{attrs:{title:"是否通过此申请 ?",okText:"通过",cancelText:"不通过"},on:{confirm:function(e){return t.isPass(1,r)},cancel:function(e){return t.isPass(0,r)}}},[t.isReview(r)?a("a-icon",{directives:[{name:"hasPermission",rawName:"v-hasPermission",value:"contract:update",expression:"'contract:update'"}],attrs:{type:"check-circle",theme:"twoTone",twoToneColor:"#9451ff",title:"确认"}}):t._e()],1)]}}])})],1),t._v(" "),a("contract-info",{attrs:{contractInfoData:t.contractInfo.data,contractInfoVisiable:t.contractInfo.visiable},on:{close:t.handleContractInfoClose}}),t._v(" "),a("contract-add",{attrs:{contractAddVisiable:t.contractAdd.visiable},on:{close:t.handleContractAddClose,success:t.handleContractAddSuccess}}),t._v(" "),a("contract-edit",{ref:"contractEdit",attrs:{contractEditVisiable:t.contractEdit.visiable},on:{close:t.handleContractEditClose,success:t.handleContractEditSuccess}})],1)},staticRenderFns:[]},m=a("VU/8")(d,u,!1,function(t){a("N8Uu")},"data-v-39c5c9c0",null);e.default=m.exports}});