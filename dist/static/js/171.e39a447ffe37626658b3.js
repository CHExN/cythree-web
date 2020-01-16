webpackJsonp([171],{QBEN:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=a("Dd8w"),o=a.n(r),i=a("fZjL"),s=a.n(i),n=a("+6Bu"),l=a.n(n),c=a("Zz1P"),m=a.n(c),u=a("a/Ho");m.a.locale("zh-cn");var d={labelCol:{span:4},wrapperCol:{span:17}},f={name:"ElectricityEdit",components:{WcList:u.default},props:{electricityEditVisiable:{default:!1}},data:function(){return{loading:!1,formItemLayout:d,form:this.$form.createForm(this),dataSource:["电费","电卡","缴费","外交","现金"],wcList:{visiable:!1},wcId:"",electricityId:"",actualAmount:0,totalAmount:0}},methods:{filterOption:function(e,t){return t.componentOptions.children[0].text.toUpperCase().indexOf(e.toUpperCase())>=0},reset:function(){this.loading=!1,this.wcId="",this.actualAmount=0,this.totalAmount=0,this.form.resetFields()},setFormValues:function(e){var t=this,a=l()(e,[]);this.electricityId=a.electricityId;var r={};s()(a).forEach(function(e){t.form.getFieldDecorator(e),r[e]=a[e]}),r.createDate=m()(r.createDate),r.recDate=m()(r.recDate);var o=a.year+"-"+a.month;r.date=m()(o),this.form.setFieldsValue(r)},onClose:function(){this.reset(),this.$emit("close")},onActualAmountChange:function(e){this.actualAmount=e,"number"==typeof this.totalAmount&&"number"==typeof this.actualAmount&&(this.form.getFieldDecorator("unitPrice"),this.form.setFieldsValue({unitPrice:this.totalAmount/this.actualAmount}))},onTotalAmountChange:function(e){this.totalAmount=e,"number"==typeof this.totalAmount&&"number"==typeof this.actualAmount&&(this.form.getFieldDecorator("unitPrice"),this.form.setFieldsValue({unitPrice:this.totalAmount/this.actualAmount}))},handleWcListChange:function(e,t){this.form.getFieldDecorator("wcName"),this.form.setFieldsValue({wcName:e}),this.wcId=t},handleWcListClose:function(){this.wcList.visiable=!1},selectWc:function(){this.wcList.visiable=!0},handleSubmit:function(){var e=this;this.form.validateFields(function(t,a){if(t)e.$message.warning("格式出错，请检查表单");else{var r=a.date,i=a.createDate,s=a.recDate,n=o()({},a,{date:r?r.format("YYYY-MM-DD"):r,createDate:i?new Date(i):i,recDate:s?new Date(s):s});e.loading=!0,e.$put("electricity",o()({},n,{wcId:e.wcId,electricityId:e.electricityId})).then(function(t){e.reset(),e.$emit("success")}).catch(function(){e.loading=!1})}})}}},h={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("a-drawer",{staticStyle:{height:"calc(100% - 55px)",overflow:"auto","padding-bottom":"53px"},attrs:{title:"新增电费信息",maskClosable:!1,width:"650",placement:"right",closable:!1,visible:e.electricityEditVisiable},on:{close:e.onClose}},[a("a-form",{attrs:{form:e.form}},[a("a-form-item",e._b({attrs:{label:"选择公厕"}},"a-form-item",e.formItemLayout,!1),[a("a-input",{directives:[{name:"decorator",rawName:"v-decorator",value:["wcName",{rules:[{required:!0,message:"请选择公厕"}]}],expression:"['wcName',\n          {rules: [{ required: true, message: '请选择公厕'}]}\n        ]"}],attrs:{readOnly:"",autoFocus:"",placeholder:"公厕",autocomplete:"off"},on:{click:e.selectWc}})],1),e._v(" "),a("a-form-item",e._b({attrs:{label:"月份"}},"a-form-item",e.formItemLayout,!1),[a("a-month-picker",{directives:[{name:"decorator",rawName:"v-decorator",value:["date",{rules:[{required:!0,message:"请选择月份"}]}],expression:"['date',\n          {rules: [{ required: true, message: '请选择月份'}]}\n        ]"}],staticStyle:{width:"100%"},attrs:{placeholder:"月份",autocomplete:"off"}})],1),e._v(" "),a("a-form-item",e._b({attrs:{label:"实际用量"}},"a-form-item",e.formItemLayout,!1),[a("a-input-number",{directives:[{name:"decorator",rawName:"v-decorator",value:["actualAmount",{rules:[{required:!0,message:"实际用量不能为空"}]}],expression:"['actualAmount',\n          {rules: [{ required: true, message: '实际用量不能为空'}]}\n        ]"}],staticStyle:{width:"100%"},attrs:{min:.01,max:1e5,precision:2,formatter:function(e){return e},placeholder:"实际用量"},on:{change:e.onActualAmountChange}})],1),e._v(" "),a("a-form-item",e._b({attrs:{label:"单价"}},"a-form-item",e.formItemLayout,!1),[a("a-input-number",{directives:[{name:"decorator",rawName:"v-decorator",value:["unitPrice",{rules:[{required:!0,message:"单价不能为空"}]}],expression:"['unitPrice',\n          {rules: [{ required: true, message: '单价不能为空'}]}\n        ]"}],staticStyle:{width:"100%"},attrs:{min:.01,max:100,precision:4,formatter:function(e){return e},placeholder:"单价(元/度)（金额/用量）"}})],1),e._v(" "),a("a-form-item",e._b({attrs:{label:"购电方式"}},"a-form-item",e.formItemLayout,!1),[a("a-auto-complete",{directives:[{name:"decorator",rawName:"v-decorator",value:["type",{rules:[{required:!0,message:"购电方式不能为空"}]}],expression:"['type',\n          {rules: [{ required: true, message: '购电方式不能为空'}]}\n        ]"}],attrs:{dataSource:e.dataSource,placeholder:"购电方式",filterOption:e.filterOption,allowClear:!0}})],1),e._v(" "),a("a-form-item",e._b({attrs:{label:"缴费日期"}},"a-form-item",e.formItemLayout,!1),[a("a-date-picker",{directives:[{name:"decorator",rawName:"v-decorator",value:["recDate",{rules:[{required:!0,message:"缴费日期不能为空"}]}],expression:"['recDate',\n          {rules: [{ required: true, message: '缴费日期不能为空'}]}\n        ]"}],staticStyle:{width:"100%"},attrs:{placeholder:"缴费日期",format:"YYYY-MM-DD"}})],1),e._v(" "),a("a-form-item",e._b({attrs:{label:"金额合计"}},"a-form-item",e.formItemLayout,!1),[a("a-input-number",{directives:[{name:"decorator",rawName:"v-decorator",value:["totalAmount",{rules:[{required:!0,message:"金额合计不能为空"}]}],expression:"['totalAmount',\n          {rules: [{ required: true, message: '金额合计不能为空'}]}\n        ]"}],staticStyle:{width:"100%"},attrs:{min:.01,max:1e5,precision:2,formatter:function(e){return e},placeholder:"金额合计"},on:{change:e.onTotalAmountChange}})],1),e._v(" "),a("a-form-item",e._b({attrs:{label:"登记日期"}},"a-form-item",e.formItemLayout,!1),[a("a-date-picker",{directives:[{name:"decorator",rawName:"v-decorator",value:["createDate",{rules:[{required:!0,message:"登记日期不能为空"}]}],expression:"['createDate',\n          {rules: [{ required: true, message: '登记日期不能为空'}]}\n        ]"}],staticStyle:{width:"100%"},attrs:{placeholder:"登记日期",format:"YYYY-MM-DD"}})],1)],1),e._v(" "),a("div",{staticClass:"drawer-bootom-button"},[a("a-popconfirm",{attrs:{title:"确定放弃编辑？",okText:"确定",cancelText:"取消"},on:{confirm:e.onClose}},[a("a-button",{staticStyle:{"margin-right":".8rem"}},[e._v("取消")])],1),e._v(" "),a("a-button",{attrs:{type:"primary",loading:e.loading},on:{click:e.handleSubmit}},[e._v("提交")])],1),e._v(" "),a("wc-list",{attrs:{wcListVisiable:e.wcList.visiable},on:{change:e.handleWcListChange,close:e.handleWcListClose}})],1)},staticRenderFns:[]},p=a("VU/8")(f,h,!1,null,null,null);t.default=p.exports}});