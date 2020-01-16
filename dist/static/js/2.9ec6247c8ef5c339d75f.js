webpackJsonp([2,67,68,135,136],{"Q4/Y":function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var s=a("Dd8w"),i=a.n(s),n={labelCol:{span:4},wrapperCol:{span:17}},r={name:"InsuranceInsideAdd",components:{StaffInsideList:a("p1UK").default},props:{insuranceInsideAddVisiable:{default:!1}},data:function(){return{loading:!1,formItemLayout:n,form:this.$form.createForm(this),staffInsideList:{visiable:!1},staffId:""}},methods:{reset:function(){this.loading=!1,this.form.resetFields()},onClose:function(){this.reset(),this.$emit("close")},selectName:function(){this.staffInsideList.visiable=!0},handleStaffInsideListChange:function(e,t){this.form.getFieldDecorator("name"),this.form.setFieldsValue({name:e}),this.staffId=t},handleStaffInsideListClose:function(){this.staffInsideList.visiable=!1},handleSubmit:function(){var e=this;this.form.validateFields(function(t,a){t?e.$message.warning("格式出错，请检查表单"):(e.loading=!0,e.$post("insuranceInside",i()({},a,{staffId:e.staffId})).then(function(t){e.reset(),e.$emit("success")}).catch(function(){e.loading=!1}))})}}},o={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("a-drawer",{staticStyle:{height:"calc(100% - 55px)",overflow:"auto","padding-bottom":"53px"},attrs:{title:"新增编内保险人员",maskClosable:!1,width:"650",placement:"right",closable:!1,visible:e.insuranceInsideAddVisiable},on:{close:e.onClose}},[a("a-form",{attrs:{form:e.form}},[a("a-form-item",e._b({attrs:{label:"类型"}},"a-form-item",e.formItemLayout,!1),[a("a-radio-group",{directives:[{name:"decorator",rawName:"v-decorator",value:["newTransfer",{rules:[{required:!0,message:"请选择类型"}]}],expression:"['newTransfer',\n          {rules: [{ required: true, message: '请选择类型'}]}\n        ]"}]},[a("a-radio-button",{attrs:{value:"0"}},[e._v("新参")]),e._v(" "),a("a-radio-button",{attrs:{value:"1"}},[e._v("转入")])],1)],1),e._v(" "),a("a-form-item",e._b({attrs:{label:"姓名"}},"a-form-item",e.formItemLayout,!1),[a("a-input",{directives:[{name:"decorator",rawName:"v-decorator",value:["name"],expression:"['name']"}],attrs:{readOnly:"",placeholder:"姓名",autocomplete:"off"},on:{click:e.selectName}})],1),e._v(" "),a("a-form-item",e._b({attrs:{label:"户口地址"}},"a-form-item",e.formItemLayout,!1),[a("a-textarea",{directives:[{name:"decorator",rawName:"v-decorator",value:["accountAddress"],expression:"['accountAddress']"}],attrs:{placeholder:"户口地址",autocomplete:"off"}})],1),e._v(" "),a("a-form-item",e._b({attrs:{label:"户口邮编"}},"a-form-item",e.formItemLayout,!1),[a("a-input",{directives:[{name:"decorator",rawName:"v-decorator",value:["accountPostalCode"],expression:"['accountPostalCode']"}],attrs:{placeholder:"户口地址邮编",autocomplete:"off"}})],1),e._v(" "),a("a-form-item",e._b({attrs:{label:"现地址"}},"a-form-item",e.formItemLayout,!1),[a("a-textarea",{directives:[{name:"decorator",rawName:"v-decorator",value:["currentAddress"],expression:"['currentAddress']"}],attrs:{placeholder:"现居住地址",autocomplete:"off"}})],1),e._v(" "),a("a-form-item",e._b({attrs:{label:"现邮编"}},"a-form-item",e.formItemLayout,!1),[a("a-input",{directives:[{name:"decorator",rawName:"v-decorator",value:["currentPostalCode"],expression:"['currentPostalCode']"}],attrs:{placeholder:"现居住地址邮编",autocomplete:"off"}})],1),e._v(" "),a("a-form-item",e._b({attrs:{label:"银行卡号"}},"a-form-item",e.formItemLayout,!1),[a("a-input",{directives:[{name:"decorator",rawName:"v-decorator",value:["bankCardNumber"],expression:"['bankCardNumber']"}],attrs:{placeholder:"银行卡号",autocomplete:"off"}})],1),e._v(" "),a("a-form-item",e._b({attrs:{label:"社保医院"}},"a-form-item",e.formItemLayout,!1),[a("a-textarea",{directives:[{name:"decorator",rawName:"v-decorator",value:["socialSecurityHospital"],expression:"['socialSecurityHospital']"}],attrs:{placeholder:"社保医院",autocomplete:"off"}})],1),e._v(" "),a("a-form-item",e._b({attrs:{label:"养老保险"}},"a-form-item",e.formItemLayout,!1),[a("a-input-number",{directives:[{name:"decorator",rawName:"v-decorator",value:["pensionInsuranceBase"],expression:"['pensionInsuranceBase']"}],staticStyle:{width:"100%"},attrs:{precision:2,formatter:function(e){return e},placeholder:"养老保险"}})],1),e._v(" "),a("a-form-item",e._b({attrs:{label:"工伤保险"}},"a-form-item",e.formItemLayout,!1),[a("a-input-number",{directives:[{name:"decorator",rawName:"v-decorator",value:["workInjuryInsuranceBase"],expression:"['workInjuryInsuranceBase']"}],staticStyle:{width:"100%"},attrs:{precision:2,formatter:function(e){return e},placeholder:"工伤保险"}})],1),e._v(" "),a("a-form-item",e._b({attrs:{label:"医疗保险"}},"a-form-item",e.formItemLayout,!1),[a("a-input-number",{directives:[{name:"decorator",rawName:"v-decorator",value:["medicalInsuranceBase"],expression:"['medicalInsuranceBase']"}],staticStyle:{width:"100%"},attrs:{precision:2,formatter:function(e){return e},placeholder:"医疗保险"}})],1)],1),e._v(" "),a("div",{staticClass:"drawer-bootom-button"},[a("a-popconfirm",{attrs:{title:"确定放弃编辑？",okText:"确定",cancelText:"取消"},on:{confirm:e.onClose}},[a("a-button",{staticStyle:{"margin-right":".8rem"}},[e._v("取消")])],1),e._v(" "),a("a-button",{attrs:{type:"primary",loading:e.loading},on:{click:e.handleSubmit}},[e._v("提交")])],1),e._v(" "),a("staff-inside-list",{attrs:{staffInsideListVisiable:e.staffInsideList.visiable,causeDate:"123123"},on:{change:e.handleStaffInsideListChange,close:e.handleStaffInsideListClose}})],1)},staticRenderFns:[]},l=a("VU/8")(r,o,!1,null,null,null);t.default=l.exports},ZWws:function(e,t){},"gh2+":function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var s=a("dC1H"),i=a("et8n"),n=s.a.Item,r={components:{AStepItemGroup:i.a.Group,AStepItem:i.a,DetailListItem:n,DetailList:s.a},name:"InsuranceInsideInfo",props:{insuranceInsideInfoVisiable:{require:!0,default:!1},insuranceInsideInfoData:{require:!0}},data:function(){return{staffInsideData:{},loading:!1}},methods:{handleCancleClick:function(){this.staffInsideData={},this.$emit("close")},getNewTransfer:function(e){return"0"===e?"新参":"1"===e?"传入":void 0},getType:function(e){return"0"===e?"固定工":"1"===e?"合同制":void 0},getGender:function(e){return"0"===e?"女":"1"===e?"男":void 0},getIsDisabilityCertificate:function(e){return"0"===e?"无":"1"===e?"有":void 0},getHouseholdRegistrationType:function(e){switch(e){case"0":return"外地农业";case"1":return"外地非农业";case"2":return"本地农业";case"3":return"本地非农业";default:return e}},getPost:function(e){switch(e){case"0":return"管理";case"1":return"技工";case"2":return"普工";case"3":return"专技";default:return e}}},watch:{insuranceInsideInfoVisiable:function(){var e=this;this.insuranceInsideInfoVisiable&&(this.loading=!0,this.$get("staffInside/getStaffInside",{staffId:this.insuranceInsideInfoData.staffId}).then(function(t){e.loading=!1,t.data&&(e.staffInsideData=t.data)}))}}},o={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("a-modal",{attrs:{title:"编内保险人员信息",centered:!0,width:1200,visible:e.insuranceInsideInfoVisiable,keyboard:!1,footer:null},on:{cancel:e.handleCancleClick}},[a("a-card",{attrs:{bordered:!1}},[a("a-card",{attrs:{bordered:!1}},[a("detail-list",{attrs:{title:"保险信息"}},[a("detail-list-item",{attrs:{term:"姓名"}},[e._v(e._s(e.insuranceInsideInfoData.name))]),e._v(" "),a("detail-list-item",{attrs:{term:"户口地址邮编"}},[e._v(e._s(e.insuranceInsideInfoData.accountPostalCode))]),e._v(" "),a("detail-list-item",{attrs:{term:"户口地址"}},[e._v(e._s(e.insuranceInsideInfoData.accountAddress))]),e._v(" "),a("detail-list-item",{attrs:{term:"类型"}},[e._v(e._s(e.getNewTransfer(e.insuranceInsideInfoData.newTransfer)))]),e._v(" "),a("detail-list-item",{attrs:{term:"现居住地址邮编"}},[e._v(e._s(e.insuranceInsideInfoData.currentPostalCode))]),e._v(" "),a("detail-list-item",{attrs:{term:"现居住地址"}},[e._v(e._s(e.insuranceInsideInfoData.currentAddress))]),e._v(" "),a("detail-list-item",{attrs:{term:"银行卡号"}},[e._v(e._s(e.insuranceInsideInfoData.bankCardNumber))]),e._v(" "),a("detail-list-item",{attrs:{term:"社保医院"}},[e._v(e._s(e.insuranceInsideInfoData.socialSecurityHospital))]),e._v(" "),a("detail-list-item",{attrs:{term:"养老保险基数"}},[e._v(e._s(e.insuranceInsideInfoData.pensionInsuranceBase))]),e._v(" "),a("detail-list-item",{attrs:{term:"工伤保险基数"}},[e._v(e._s(e.insuranceInsideInfoData.workInjuryInsuranceBase))]),e._v(" "),a("detail-list-item",{attrs:{term:"医疗保险基数"}},[e._v(e._s(e.insuranceInsideInfoData.medicalInsuranceBase))])],1)],1),e._v(" "),a("a-divider",{staticStyle:{"margin-bottom":"32px"}}),e._v(" "),a("a-card",{attrs:{loading:e.loading,bordered:!1}},[a("detail-list",{attrs:{title:"人员信息"}},[a("detail-list-item",{attrs:{term:"姓名"}},[e._v(e._s(e.staffInsideData.name))]),e._v(" "),a("detail-list-item",{attrs:{term:"部门"}},[e._v(e._s(e.staffInsideData.deptName))]),e._v(" "),a("detail-list-item",{attrs:{term:"人员类型"}},[e._v(e._s(e.getType(e.staffInsideData.type)))]),e._v(" "),a("detail-list-item",{attrs:{term:"事由"}},[e._v(e._s(e.staffInsideData.cause))]),e._v(" "),a("detail-list-item",{attrs:{term:"性别"}},[e._v(e._s(e.getGender(e.staffInsideData.gender)))]),e._v(" "),a("detail-list-item",{attrs:{term:"民族"}},[e._v(e._s(e.staffInsideData.clan))]),e._v(" "),a("detail-list-item",{attrs:{term:"籍贯"}},[e._v(e._s(e.staffInsideData.birthplace))]),e._v(" "),a("detail-list-item",{attrs:{term:"原学历"}},[e._v(e._s(e.staffInsideData.cultureBefore))]),e._v(" "),a("detail-list-item",{attrs:{term:"现学历"}},[e._v(e._s(e.staffInsideData.cultureCurrent))]),e._v(" "),a("detail-list-item",{attrs:{term:"户籍性质"}},[e._v(e._s(e.getHouseholdRegistrationType(e.staffInsideData.householdRegistrationType)))]),e._v(" "),a("detail-list-item",{attrs:{term:"专业"}},[e._v(e._s(e.staffInsideData.profession))]),e._v(" "),a("detail-list-item",{attrs:{term:"毕业日期"}},[e._v(e._s(e.staffInsideData.graduationDate))]),e._v(" "),a("detail-list-item",{attrs:{term:"政治面貌"}},[e._v(e._s(e.staffInsideData.politicalFace))]),e._v(" "),a("detail-list-item",{attrs:{term:"有无残疾证"}},[e._v(e._s(e.getIsDisabilityCertificate(e.staffInsideData.isDisabilityCertificate)))]),e._v(" "),a("detail-list-item",{attrs:{term:"工伤证发证日期"}},[e._v(e._s(e.staffInsideData.workInjuryCertificateDate))]),e._v(" "),a("detail-list-item",{attrs:{term:"伤残鉴定等级"}},[e._v(e._s(e.staffInsideData.disabilityIdentificationLevel))]),e._v(" "),a("detail-list-item",{attrs:{term:"家庭住址"}},[e._v(e._s(e.staffInsideData.address))]),e._v(" "),a("detail-list-item",{attrs:{term:"身份证号码"}},[e._v(e._s(e.staffInsideData.idNum))]),e._v(" "),a("detail-list-item",{attrs:{term:"座机联系电话"}},[e._v(e._s(e.staffInsideData.phoneLandLine))]),e._v(" "),a("detail-list-item",{attrs:{term:"手机联系电话"}},[e._v(e._s(e.staffInsideData.phoneCell))]),e._v(" "),a("detail-list-item",{attrs:{term:"出生年月"}},[e._v(e._s(e.staffInsideData.birthDate))]),e._v(" "),a("detail-list-item",{attrs:{term:"年龄"}},[e._v(e._s(this.$tools.getAge(e.staffInsideData.birthDate)))]),e._v(" "),a("detail-list-item",{attrs:{term:"参加工作日期"}},[e._v(e._s(e.staffInsideData.workDate))]),e._v(" "),a("detail-list-item",{attrs:{term:"农转工转工日期"}},[e._v(e._s(e.staffInsideData.farmerWorkDate))]),e._v(" "),a("detail-list-item",{attrs:{term:"调入环卫或报到日期"}},[e._v(e._s(e.staffInsideData.transferDate))]),e._v(" "),a("detail-list-item",{attrs:{term:"现任岗位职务"}},[e._v(e._s(e.staffInsideData.technicalType))]),e._v(" "),a("detail-list-item",{attrs:{term:"岗位"}},[e._v(e._s(e.getPost(e.staffInsideData.post)))]),e._v(" "),a("detail-list-item",{attrs:{term:"岗位级别"}},[e._v(e._s(e.staffInsideData.postLevel))]),e._v(" "),a("detail-list-item",{attrs:{term:"聘任时间"}},[e._v(e._s(e.staffInsideData.appointmentDate))]),e._v(" "),a("detail-list-item",{attrs:{term:"技术等级取得日期"}},[e._v(e._s(e.staffInsideData.technicalLevelDate))]),e._v(" "),a("detail-list-item",{attrs:{term:"证书编号"}},[e._v(e._s(e.staffInsideData.certificateNum))]),e._v(" "),a("detail-list-item",{attrs:{term:"入职状态"}},[e._v(e._s(e.staffInsideData.entryStatus))])],1)],1)],1)],1)},staticRenderFns:[]},l=a("VU/8")(r,o,!1,function(e){a("ZWws")},"data-v-5a3d4294",null);t.default=l.exports},lQPI:function(e,t){},mfXY:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var s=a("Dd8w"),i=a.n(s),n=a("BO1k"),r=a.n(n),o={props:{insuranceInsideImportResultVisible:{required:!0,default:!1},importData:{required:!0},errors:{required:!0},times:{required:!0}},data:function(){return{pagination:{pageSizeOptions:["5","10"],defaultCurrent:1,defaultPageSize:5,showQuickJumper:!0,showSizeChanger:!0,showTotal:function(e,t){return"显示 "+t[0]+" ~ "+t[1]+" 条记录，共 "+e+" 条记录"}}}},computed:{errorsData:function(){for(var e=[],t=0;t<this.errors.length;t++){var a=this.errors[t],s={},n=!0,o=!1,l=void 0;try{for(var d,c=r()(a.errorFields);!(n=(d=c.next()).done);n=!0){var u=d.value;(s=i()({},u)).row=a.row,e.push(s)}}catch(e){o=!0,l=e}finally{try{!n&&c.return&&c.return()}finally{if(o)throw l}}}return e},successColumns:function(){return[{title:"姓名",dataIndex:"name"},{title:"身份证号",dataIndex:"idNum"},{title:"导入时间",dataIndex:"createTime"}]},errorColumns:function(){return[{title:"行",dataIndex:"row",customRender:function(e,t,a){return"第 "+(e+1)+" 行"}},{title:"列",dataIndex:"cellIndex",customRender:function(e,t,a){return"第 "+(e+1)+" 列"}},{title:"列名",dataIndex:"column"},{title:"值",dataIndex:"name"},{title:"错误信息",dataIndex:"errorMessage"}]},show:{get:function(){return this.insuranceInsideImportResultVisible},set:function(){}}},methods:{handleCancel:function(){this.$emit("close")}}},l={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("a-modal",{staticClass:"import-result",attrs:{title:"导入结果",centered:!0,footer:null,maskClosable:!1,width:1e3},on:{cancel:e.handleCancel},model:{value:e.show,callback:function(t){e.show=t},expression:"show"}},[a("div",{staticClass:"import-desc"},[0===e.importData.length&&0===e.errors.length?a("span",[a("a-alert",{attrs:{message:"暂无导入记录",type:"info"}})],1):e._e(),e._v(" "),0!==e.importData.length&&0!==e.errors.length?a("span",[a("a-alert",{attrs:{message:"部分导入成功",type:"warning"}},[a("div",{attrs:{slot:"description"},slot:"description"},[e._v("\n          成功导入 "),a("a",[e._v(e._s(e.importData.length))]),e._v(" 条记录，"),a("a",[e._v(e._s(e.errors.length))]),e._v(" 条记录导入失败，共耗时 "),a("a",[e._v(e._s(e.times))]),e._v(" 秒\n        ")])])],1):e._e(),e._v(" "),0!==e.importData.length&&0===e.errors.length?a("span",[a("a-alert",{attrs:{message:"全部导入成功",type:"success"}},[a("div",{attrs:{slot:"description"},slot:"description"},[e._v("\n          成功导入 "),a("a",[e._v(e._s(e.importData.length))]),e._v(" 条记录，共耗时 "),a("a",[e._v(e._s(e.times))]),e._v(" 秒\n        ")])])],1):e._e(),e._v(" "),0===e.importData.length&&0!==e.errors.length?a("span",[a("a-alert",{attrs:{message:"全部导入失败",type:"error"}},[a("div",{attrs:{slot:"description"},slot:"description"},[a("a",[e._v(e._s(e.errors.length))]),e._v(" 条记录导入失败，共耗时  "),a("a",[e._v(e._s(e.times))]),e._v(" 秒\n        ")])])],1):e._e()]),e._v(" "),a("a-tabs",{attrs:{defaultActiveKey:"1"}},[e.importData.length?a("a-tab-pane",{key:"1",attrs:{tab:"成功记录"}},[a("a-table",{ref:"successTable",attrs:{rowKey:"id",columns:e.successColumns,dataSource:e.importData,pagination:e.pagination,scroll:{x:900}}})],1):e._e(),e._v(" "),e.errors.length?a("a-tab-pane",{key:"2",attrs:{tab:"失败记录"}},[a("a-table",{ref:"errorTable",attrs:{columns:e.errorColumns,dataSource:e.errorsData,pagination:e.pagination,scroll:{x:900}}})],1):e._e()],1)],1)},staticRenderFns:[]},d=a("VU/8")(o,l,!1,function(e){a("lQPI")},null,null);t.default=d.exports},p0Vi:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var s=a("Dd8w"),i=a.n(s),n=a("gh2+"),r=a("Q4/Y"),o=a("ryPF"),l=a("mfXY"),d={name:"InsuranceInside",components:{InsuranceInsideInfo:n.default,InsuranceInsideAdd:r.default,InsuranceInsideEdit:o.default,InsuranceInsideImportResult:l.default},data:function(){return{fileList:[],importData:[],times:"",errors:[],insuranceInsideImportResultVisible:!1,advanced:!1,insuranceInsideInfo:{visiable:!1,data:{}},insuranceInsideAdd:{visiable:!1,data:{}},insuranceInsideEdit:{visiable:!1,data:{}},queryParams:{isLeave:"0"},filteredInfo:null,sortedInfo:null,paginationInfo:null,dataSource:[],selectedRowKeys:[],loading:!1,pagination:{pageSizeOptions:["10","20","30","40","100"],defaultCurrent:1,defaultPageSize:10,showQuickJumper:!0,showSizeChanger:!0,showTotal:function(e,t){return"显示 "+t[0]+" ~ "+t[1]+" 条记录，共 "+e+" 条记录"}}}},computed:{columns:function(){var e=this;return[{title:"序号",dataIndex:"sortNum"},{title:"姓名",dataIndex:"name"},{title:"身份证号",dataIndex:"idNum"},{title:"性别",dataIndex:"gender",customRender:function(e,t,a){switch(e){case"0":return"女";case"1":return"男";default:return e}},filters:[{text:"女",value:"0"},{text:"男",value:"1"}],filterMultiple:!1},{title:"户籍性质",dataIndex:"householdRegistrationType",customRender:function(e,t,a){switch(e){case"0":return"外地农业";case"1":return"外地非农业";case"2":return"本地农业";case"3":return"本地非农业";default:return e}},filters:[{text:"外地农业",value:"0"},{text:"外地非农业",value:"1"},{text:"本地农业",value:"2"},{text:"本地非农业",value:"3"}],filterMultiple:!0},{title:"类型",dataIndex:"newTransfer",customRender:function(e,t,a){switch(e){case"0":return"新参";case"1":return"转入";default:return e}},filters:[{text:"新参",value:"0"},{text:"转入",value:"1"}],filterMultiple:!1},{title:"养老保险",dataIndex:"pensionInsuranceBase",customRender:function(t,a,s){return e.$tools.addZero(t)||t}},{title:"工伤保险",dataIndex:"workInjuryInsuranceBase",customRender:function(t,a,s){return e.$tools.addZero(t)||t}},{title:"医疗保险",dataIndex:"medicalInsuranceBase",customRender:function(t,a,s){return e.$tools.addZero(t)||t}},{title:"操作",dataIndex:"operation",scopedSlots:{customRender:"operation"},fixed:"right",width:100}]}},mounted:function(){this.fetch()},methods:{handleClose:function(){this.insuranceInsideImportResultVisible=!1},downloadTemplate:function(){this.$download("insuranceInside/template",{},"编内人员保险信息_导入模板.xlsx")},importExcel:function(e){var t=this,a=new FormData;return a.append("file",e),this.$message.loading("处理中",0),this.$upload("insuranceInside/import",a).then(function(e){var a=e.data.data;a.data.length&&t.fetch(),t.$message.destroy(),t.importData=a.data,t.errors=a.error,t.times=a.time/1e3,t.insuranceInsideImportResultVisible=!0}).catch(function(e){t.$message.destroy()}),!1},exportExcel:function(){var e=this.sortedInfo,t=this.filteredInfo,a=void 0,s=void 0,n=void 0;this.pagination&&(n=this.pagination.total),e&&(a=e.field,s=e.order),this.$export("insuranceInside/excel",i()({sortField:a,sortOrder:s,pageSize:n},this.queryParams,t))},onSelectChange:function(e){this.selectedRowKeys=e},toggleAdvanced:function(){this.advanced=!this.advanced,this.advanced||(this.queryParams.bankCardNumber="",this.queryParams.socialSecurityHospital="")},view:function(e){this.insuranceInsideInfo.data=e,this.insuranceInsideInfo.visiable=!0},add:function(){this.insuranceInsideAdd.visiable=!0},handleInsuranceInsideAddClose:function(){this.insuranceInsideAdd.visiable=!1},handleInsuranceInsideAddSuccess:function(){this.insuranceInsideAdd.visiable=!1,this.$message.success("新增编内保险人员成功"),this.search()},edit:function(e){this.$refs.insuranceInsideEdit.setFormValues(e),this.insuranceInsideEdit.visiable=!0},handleInsuranceInsideEditClose:function(){this.insuranceInsideEdit.visiable=!1},handleInsuranceInsideEditUntied:function(){this.search()},handleInsuranceInsideEditSuccess:function(){this.insuranceInsideEdit.visiable=!1,this.$message.success("修改编内保险人员成功"),this.search()},handleInsuranceInsideInfoClose:function(){this.insuranceInsideInfo.visiable=!1},batchDelete:function(){if(this.selectedRowKeys.length){var e=this;this.$confirm({title:"确定删除所选中的记录?",content:"当您点击确定按钮后，这些记录将会被彻底删除",centered:!0,onOk:function(){e.$delete("insuranceInside/"+e.selectedRowKeys.join(",")).then(function(){e.$message.success("删除成功"),e.selectedRowKeys=[],e.search()})},onCancel:function(){e.selectedRowKeys=[]}})}else this.$message.warning("请选择需要删除的记录")},search:function(){var e=this.sortedInfo,t=this.filteredInfo,a=void 0,s=void 0;e&&(a=e.field,s=e.order),this.fetch(i()({sortField:a,sortOrder:s},this.queryParams,t))},reset:function(){this.selectedRowKeys=[],this.$refs.TableInfo.pagination.current=this.pagination.defaultCurrent,this.paginationInfo&&(this.paginationInfo.current=this.pagination.defaultCurrent,this.paginationInfo.pageSize=this.pagination.defaultPageSize),this.filteredInfo=null,this.sortedInfo=null,this.queryParams={isLeave:"0"},this.fetch()},handleTableChange:function(e,t,a){this.paginationInfo=e,this.filteredInfo=t,this.sortedInfo=a,this.insuranceInsideInfo.visiable=!1,this.fetch(i()({sortField:a.field,sortOrder:a.order},this.queryParams,t))},fetch:function(){var e=this,t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};this.loading=!0,this.paginationInfo?(this.$refs.TableInfo.pagination.current=this.paginationInfo.current,this.$refs.TableInfo.pagination.pageSize=this.paginationInfo.pageSize,t.pageSize=this.paginationInfo.pageSize,t.pageNum=this.paginationInfo.current):(t.pageSize=this.pagination.defaultPageSize,t.pageNum=this.pagination.defaultCurrent),this.$get("insuranceInside",i()({},t,{isLeave:this.queryParams.isLeave})).then(function(t){var a=t.data,s=i()({},e.pagination);s.total=a.total,e.dataSource=a.rows,e.pagination=s,e.loading=!1})}}},c={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("a-card",{staticClass:"card-area",attrs:{bordered:!1}},[a("div",{class:e.advanced?"search":null},[a("a-form",{attrs:{layout:"horizontal"}},[a("a-row",[a("div",{class:e.advanced?null:"fold"},[a("a-col",{attrs:{md:12,sm:24}},[a("a-form-item",{attrs:{label:"姓名",labelCol:{span:5},wrapperCol:{span:18,offset:1}}},[a("a-input",{model:{value:e.queryParams.name,callback:function(t){e.$set(e.queryParams,"name",t)},expression:"queryParams.name"}})],1)],1),e._v(" "),a("a-col",{attrs:{md:12,sm:24}},[a("a-form-item",{attrs:{label:"身份证号",labelCol:{span:5},wrapperCol:{span:18,offset:1}}},[a("a-input",{model:{value:e.queryParams.idNum,callback:function(t){e.$set(e.queryParams,"idNum",t)},expression:"queryParams.idNum"}})],1)],1),e._v(" "),e.advanced?[a("a-col",{attrs:{md:12,sm:24}},[a("a-form-item",{attrs:{label:"银行卡号",labelCol:{span:5},wrapperCol:{span:18,offset:1}}},[a("a-input",{model:{value:e.queryParams.bankCardNumber,callback:function(t){e.$set(e.queryParams,"bankCardNumber",t)},expression:"queryParams.bankCardNumber"}})],1)],1),e._v(" "),a("a-col",{attrs:{md:12,sm:24}},[a("a-form-item",{attrs:{label:"社保医院",labelCol:{span:5},wrapperCol:{span:18,offset:1}}},[a("a-input",{model:{value:e.queryParams.socialSecurityHospital,callback:function(t){e.$set(e.queryParams,"socialSecurityHospital",t)},expression:"queryParams.socialSecurityHospital"}})],1)],1),e._v(" "),a("a-col",{attrs:{md:12,sm:24}},[a("a-form-item",{attrs:{label:"在职与否",labelCol:{span:5},wrapperCol:{span:18,offset:1}}},[a("a-select",{model:{value:e.queryParams.isLeave,callback:function(t){e.$set(e.queryParams,"isLeave",t)},expression:"queryParams.isLeave"}},[a("a-select-option",{attrs:{value:"0,1"}},[e._v("全部")]),e._v(" "),a("a-select-option",{attrs:{value:"0"}},[e._v("在职")]),e._v(" "),a("a-select-option",{attrs:{value:"1"}},[e._v("非在职")])],1)],1)],1)]:e._e()],2),e._v(" "),a("span",{staticStyle:{float:"right",margin:"3px auto 1em"}},[a("a-button",{attrs:{type:"primary"},on:{click:e.search}},[e._v("查询")]),e._v(" "),a("a-button",{staticStyle:{"margin-left":"8px"},on:{click:e.reset}},[e._v("重置")]),e._v(" "),a("a",{staticStyle:{"margin-left":"8px"},on:{click:e.toggleAdvanced}},[e._v("\n            "+e._s(e.advanced?"收起":"展开")+"\n            "),a("a-icon",{attrs:{type:e.advanced?"up":"down"}})],1)],1)])],1)],1),e._v(" "),a("div",[a("div",{staticClass:"operator"},[a("a-button",{directives:[{name:"hasPermission",rawName:"v-hasPermission",value:"insuranceInside:add",expression:"'insuranceInside:add'"}],attrs:{type:"primary",ghost:""},on:{click:e.add}},[e._v("新增")]),e._v(" "),a("a-button",{directives:[{name:"hasPermission",rawName:"v-hasPermission",value:"insuranceInside:delete",expression:"'insuranceInside:delete'"}],on:{click:e.batchDelete}},[e._v("删除")]),e._v(" "),a("a-dropdown",{directives:[{name:"hasAnyPermission",rawName:"v-hasAnyPermission",value:"insuranceInside:add",expression:"'insuranceInside:export','insuranceInside:add'"}]},[a("a-menu",{attrs:{slot:"overlay"},slot:"overlay"},[a("a-menu-item",{key:"download-template",on:{click:e.downloadTemplate}},[e._v("模板下载")]),e._v(" "),a("a-menu-item",{directives:[{name:"hasPermission",rawName:"v-hasPermission",value:"insuranceInside:add",expression:"'insuranceInside:add'"}],key:"import-data"},[a("a-upload",{staticClass:"upload-area",attrs:{fileList:e.fileList,beforeUpload:e.importExcel}},[e._v("导入Excel")])],1),e._v(" "),a("a-menu-item",{directives:[{name:"hasPermission",rawName:"v-hasPermission",value:"insuranceInside:export",expression:"'insuranceInside:export'"}],key:"export-data",on:{click:e.exportExcel}},[e._v("导出Excel")])],1),e._v(" "),a("a-button",[e._v("\n          更多操作 "),a("a-icon",{attrs:{type:"down"}})],1)],1)],1),e._v(" "),a("a-table",{ref:"TableInfo",attrs:{columns:e.columns,dataSource:e.dataSource,pagination:e.pagination,loading:e.loading,rowSelection:{selectedRowKeys:e.selectedRowKeys,onChange:e.onSelectChange},scroll:{x:900},rowKey:"id"},on:{change:e.handleTableChange},scopedSlots:e._u([{key:"operation",fn:function(t,s){return[a("a-icon",{directives:[{name:"hasPermission",rawName:"v-hasPermission",value:"insuranceInside:update",expression:"'insuranceInside:update'"}],attrs:{type:"setting",theme:"twoTone",twoToneColor:"#4a9ff5",title:"修改"},on:{click:function(t){return e.edit(s)}}}),e._v("\n         \n        "),a("a-icon",{directives:[{name:"hasPermission",rawName:"v-hasPermission",value:"insuranceInside:view",expression:"'insuranceInside:view'"}],attrs:{type:"eye",theme:"twoTone",twoToneColor:"#42b983",title:"查看"},on:{click:function(t){return e.view(s)}}})]}}])})],1),e._v(" "),a("insurance-inside-info",{attrs:{insuranceInsideInfoData:e.insuranceInsideInfo.data,insuranceInsideInfoVisiable:e.insuranceInsideInfo.visiable},on:{close:e.handleInsuranceInsideInfoClose}}),e._v(" "),a("insurance-inside-add",{attrs:{insuranceInsideAddVisiable:e.insuranceInsideAdd.visiable},on:{close:e.handleInsuranceInsideAddClose,success:e.handleInsuranceInsideAddSuccess}}),e._v(" "),a("insurance-inside-edit",{ref:"insuranceInsideEdit",attrs:{insuranceInsideEditVisiable:e.insuranceInsideEdit.visiable},on:{close:e.handleInsuranceInsideEditClose,untied:e.handleInsuranceInsideEditUntied,success:e.handleInsuranceInsideEditSuccess}}),e._v(" "),a("insurance-inside-import-result",{attrs:{importData:e.importData,errors:e.errors,times:e.times,insuranceInsideImportResultVisible:e.insuranceInsideImportResultVisible},on:{close:e.handleClose}})],1)},staticRenderFns:[]},u=a("VU/8")(d,c,!1,function(e){a("wAKf")},"data-v-7b05ab25",null);t.default=u.exports},ryPF:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var s=a("Dd8w"),i=a.n(s),n=a("fZjL"),r=a.n(n),o=a("+6Bu"),l=a.n(o),d={labelCol:{span:4},wrapperCol:{span:17}},c={name:"InsuranceInsideEdit",components:{StaffInsideList:a("p1UK").default},props:{insuranceInsideEditVisiable:{default:!1}},data:function(){return{id:"",loading:!1,formItemLayout:d,form:this.$form.createForm(this),staffInsideList:{visiable:!1},staffId:""}},methods:{reset:function(){this.loading=!1,this.form.resetFields()},onClose:function(){this.reset(),this.$emit("close")},selectName:function(){this.staffInsideList.visiable=!0},handleStaffInsideListChange:function(e,t){this.form.getFieldDecorator("name"),this.form.setFieldsValue({name:e}),this.staffId=t},handleStaffInsideListClose:function(){this.staffInsideList.visiable=!1},setFormValues:function(e){var t=this,a=l()(e,[]);this.id=a.id,this.staffId=a.staffId;var s=["createTime","modifyTime"],i={};r()(a).forEach(function(e){-1===s.indexOf(e)&&(t.form.getFieldDecorator(e),i[e]=a[e])}),this.form.setFieldsValue(i)},handleSubmit:function(){var e=this;this.form.validateFields(function(t,a){t?e.$message.warning("格式出错，请检查表单"):(e.loading=!0,e.$put("insuranceInside",i()({},a,{staffId:e.staffId,id:e.id})).then(function(t){e.reset(),e.$emit("success")}).catch(function(){e.loading=!1}))})}}},u={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("a-drawer",{staticStyle:{height:"calc(100% - 55px)",overflow:"auto","padding-bottom":"53px"},attrs:{title:"修改编内保险人员",maskClosable:!1,width:"650",placement:"right",closable:!1,visible:e.insuranceInsideEditVisiable},on:{close:e.onClose}},[a("a-form",{attrs:{form:e.form}},[a("a-form-item",e._b({attrs:{label:"类型"}},"a-form-item",e.formItemLayout,!1),[a("a-radio-group",{directives:[{name:"decorator",rawName:"v-decorator",value:["newTransfer",{rules:[{required:!0,message:"请选择类型"}]}],expression:"['newTransfer',\n          {rules: [{ required: true, message: '请选择类型'}]}\n        ]"}]},[a("a-radio-button",{attrs:{value:"0"}},[e._v("新参")]),e._v(" "),a("a-radio-button",{attrs:{value:"1"}},[e._v("转入")])],1)],1),e._v(" "),a("a-form-item",e._b({attrs:{label:"姓名"}},"a-form-item",e.formItemLayout,!1),[a("a-input",{directives:[{name:"decorator",rawName:"v-decorator",value:["name"],expression:"['name']"}],attrs:{readOnly:"",placeholder:"姓名",autocomplete:"off"},on:{click:e.selectName}})],1),e._v(" "),a("a-form-item",e._b({attrs:{label:"户口地址"}},"a-form-item",e.formItemLayout,!1),[a("a-textarea",{directives:[{name:"decorator",rawName:"v-decorator",value:["accountAddress"],expression:"['accountAddress']"}],attrs:{placeholder:"户口地址",autocomplete:"off"}})],1),e._v(" "),a("a-form-item",e._b({attrs:{label:"户口邮编"}},"a-form-item",e.formItemLayout,!1),[a("a-input",{directives:[{name:"decorator",rawName:"v-decorator",value:["accountPostalCode"],expression:"['accountPostalCode']"}],attrs:{placeholder:"户口地址邮编",autocomplete:"off"}})],1),e._v(" "),a("a-form-item",e._b({attrs:{label:"现地址"}},"a-form-item",e.formItemLayout,!1),[a("a-textarea",{directives:[{name:"decorator",rawName:"v-decorator",value:["currentAddress"],expression:"['currentAddress']"}],attrs:{placeholder:"现居住地址",autocomplete:"off"}})],1),e._v(" "),a("a-form-item",e._b({attrs:{label:"现邮编"}},"a-form-item",e.formItemLayout,!1),[a("a-input",{directives:[{name:"decorator",rawName:"v-decorator",value:["currentPostalCode"],expression:"['currentPostalCode']"}],attrs:{placeholder:"现居住地址邮编",autocomplete:"off"}})],1),e._v(" "),a("a-form-item",e._b({attrs:{label:"银行卡号"}},"a-form-item",e.formItemLayout,!1),[a("a-input",{directives:[{name:"decorator",rawName:"v-decorator",value:["bankCardNumber"],expression:"['bankCardNumber']"}],attrs:{placeholder:"银行卡号",autocomplete:"off"}})],1),e._v(" "),a("a-form-item",e._b({attrs:{label:"社保医院"}},"a-form-item",e.formItemLayout,!1),[a("a-textarea",{directives:[{name:"decorator",rawName:"v-decorator",value:["socialSecurityHospital"],expression:"['socialSecurityHospital']"}],attrs:{placeholder:"社保医院",autocomplete:"off"}})],1),e._v(" "),a("a-form-item",e._b({attrs:{label:"养老保险"}},"a-form-item",e.formItemLayout,!1),[a("a-input-number",{directives:[{name:"decorator",rawName:"v-decorator",value:["pensionInsuranceBase"],expression:"['pensionInsuranceBase']"}],staticStyle:{width:"100%"},attrs:{precision:2,formatter:function(e){return e},placeholder:"养老保险"}})],1),e._v(" "),a("a-form-item",e._b({attrs:{label:"工伤保险"}},"a-form-item",e.formItemLayout,!1),[a("a-input-number",{directives:[{name:"decorator",rawName:"v-decorator",value:["workInjuryInsuranceBase"],expression:"['workInjuryInsuranceBase']"}],staticStyle:{width:"100%"},attrs:{precision:2,formatter:function(e){return e},placeholder:"工伤保险"}})],1),e._v(" "),a("a-form-item",e._b({attrs:{label:"医疗保险"}},"a-form-item",e.formItemLayout,!1),[a("a-input-number",{directives:[{name:"decorator",rawName:"v-decorator",value:["medicalInsuranceBase"],expression:"['medicalInsuranceBase']"}],staticStyle:{width:"100%"},attrs:{precision:2,formatter:function(e){return e},placeholder:"医疗保险"}})],1)],1),e._v(" "),a("div",{staticClass:"drawer-bootom-button"},[a("a-popconfirm",{attrs:{title:"确定放弃编辑？",okText:"确定",cancelText:"取消"},on:{confirm:e.onClose}},[a("a-button",{staticStyle:{"margin-right":".8rem"}},[e._v("取消")])],1),e._v(" "),a("a-button",{attrs:{type:"primary",loading:e.loading},on:{click:e.handleSubmit}},[e._v("提交")])],1),e._v(" "),a("staff-inside-list",{attrs:{staffInsideListVisiable:e.staffInsideList.visiable,causeDate:"123123"},on:{change:e.handleStaffInsideListChange,close:e.handleStaffInsideListClose}})],1)},staticRenderFns:[]},m=a("VU/8")(c,u,!1,null,null,null);t.default=m.exports},wAKf:function(e,t){}});