webpackJsonp([128],{"7y4K":function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=a("Dd8w"),o=a.n(r),i=a("Zbla"),l=a("Zz1P"),m=a.n(l);m.a.locale("zh-cn");var s={labelCol:{span:4},wrapperCol:{span:17}},c={name:"StaffOutsideAdd",components:{DeptInputTree:i.default},props:{staffOutsideAddVisiable:{default:!1},technicalTypeData:{require:!0},postData:{require:!0},teamData:{require:!0}},data:function(){return{loading:!1,formItemLayout:s,form:this.$form.createForm(this),temporaryData:["临时合同工"],cultureData:["小学","初中","高中","专科","本科","硕士","博士"],politicalFaceData:["群众","团员","党员","预备党员"]}},methods:{reset:function(){this.loading=!1,this.form.resetFields()},onIdNumChange:function(){var e=this.form.getFieldValue("idNum"),t=m()(this.$tools.getBirthday(e)),a=this.$tools.getBirthplace(e),r=this.$tools.getGender(e);this.form.getFieldDecorator("birthDate"),this.form.getFieldDecorator("birthplace"),this.form.getFieldDecorator("gender"),this.form.setFieldsValue({birthDate:t}),this.form.setFieldsValue({birthplace:a}),this.form.setFieldsValue({gender:r+""})},onClose:function(){this.reset(),this.$emit("close")},handleSubmit:function(){var e=this;this.form.validateFields(function(t,a){if(t)e.$message.warning("格式出错，请检查表单");else{var r=a.birthDate,i=a.transferDate,l=a.toTeamDate,m=o()({},a,{birthDate:r?r.format("YYYY-MM-DD"):r,transferDate:i?i.format("YYYY-MM-DD"):i,toTeamDate:l?l.format("YYYY-MM-DD"):l});e.loading=!0,e.$post("staffOutside",o()({},m)).then(function(t){e.reset(),e.$emit("success")}).catch(function(){e.loading=!1})}})},filterOption:function(e,t){return t.componentOptions.children[0].text.toUpperCase().indexOf(e.toUpperCase())>=0}}},n={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("a-drawer",{staticStyle:{height:"calc(100% - 55px)",overflow:"auto","padding-bottom":"53px"},attrs:{title:"新增编外人员",maskClosable:!1,width:"650",placement:"right",closable:!1,visible:e.staffOutsideAddVisiable},on:{close:e.onClose}},[a("a-form",{attrs:{form:e.form}},[a("a-form-item",e._b({attrs:{label:"姓名"}},"a-form-item",e.formItemLayout,!1),[a("a-input",{directives:[{name:"decorator",rawName:"v-decorator",value:["name",{rules:[{required:!0,message:"姓名不能为空"}]}],expression:"['name',\n          {rules: [{ required: true, message: '姓名不能为空'}]}\n        ]"}],attrs:{placeholder:"姓名",autocomplete:"off"}})],1),e._v(" "),a("a-form-item",e._b({attrs:{label:"户籍性质"}},"a-form-item",e.formItemLayout,!1),[a("a-radio-group",{directives:[{name:"decorator",rawName:"v-decorator",value:["householdRegistrationType"],expression:"['householdRegistrationType']"}]},[a("a-radio-button",{attrs:{value:"0"}},[e._v("外地农业")]),e._v(" "),a("a-radio-button",{attrs:{value:"1"}},[e._v("外地非农业")]),e._v(" "),a("a-radio-button",{attrs:{value:"2"}},[e._v("本地农业")]),e._v(" "),a("a-radio-button",{attrs:{value:"3"}},[e._v("本地非农业")])],1)],1),e._v(" "),a("a-form-item",e._b({attrs:{label:"人员类型"}},"a-form-item",e.formItemLayout,!1),[a("a-auto-complete",{directives:[{name:"decorator",rawName:"v-decorator",value:["temporary"],expression:"['temporary']"}],attrs:{placeholder:"人员类型",dataSource:e.temporaryData,allowClear:!0,filterOption:e.filterOption}})],1),e._v(" "),a("a-form-item",e._b({attrs:{label:"分队"}},"a-form-item",e.formItemLayout,!1),[a("a-auto-complete",{directives:[{name:"decorator",rawName:"v-decorator",value:["team"],expression:"['team']"}],attrs:{placeholder:"分队",dataSource:e.teamData,allowClear:!0,filterOption:e.filterOption}})],1),e._v(" "),a("a-form-item",e._b({attrs:{label:"身份证号"}},"a-form-item",e.formItemLayout,!1),[a("a-input",{directives:[{name:"decorator",rawName:"v-decorator",value:["idNum",{rules:[{required:!0,message:"身份证号不能为空"}]}],expression:"['idNum',{rules: [\n          {required: true, message: '身份证号不能为空'},\n        ]}]"}],attrs:{placeholder:"身份证号",autocomplete:"off"},on:{blur:e.onIdNumChange}})],1),e._v(" "),a("a-form-item",e._b({attrs:{label:"民族"}},"a-form-item",e.formItemLayout,!1),[a("a-input",{directives:[{name:"decorator",rawName:"v-decorator",value:["clan"],expression:"['clan']"}],attrs:{placeholder:"民族",autocomplete:"off"}})],1),e._v(" "),a("a-form-item",e._b({attrs:{label:"籍贯"}},"a-form-item",e.formItemLayout,!1),[a("a-input",{directives:[{name:"decorator",rawName:"v-decorator",value:["birthplace"],expression:"['birthplace']"}],attrs:{placeholder:"籍贯",autocomplete:"off"}})],1),e._v(" "),a("a-form-item",e._b({attrs:{label:"性别"}},"a-form-item",e.formItemLayout,!1),[a("a-radio-group",{directives:[{name:"decorator",rawName:"v-decorator",value:["gender"],expression:"['gender']"}]},[a("a-radio-button",{attrs:{value:"0"}},[e._v("女")]),e._v(" "),a("a-radio-button",{attrs:{value:"1"}},[e._v("男")])],1)],1),e._v(" "),a("a-form-item",e._b({attrs:{label:"出生年月"}},"a-form-item",e.formItemLayout,!1),[a("a-date-picker",{directives:[{name:"decorator",rawName:"v-decorator",value:["birthDate"],expression:"['birthDate']"}],staticStyle:{width:"100%"},attrs:{placeholder:"出生年月",format:"YYYY-MM-DD"}})],1),e._v(" "),a("a-form-item",e._b({attrs:{label:"家庭住址"}},"a-form-item",e.formItemLayout,!1),[a("a-textarea",{directives:[{name:"decorator",rawName:"v-decorator",value:["address"],expression:"['address']"}],attrs:{placeholder:"家庭住址",autocomplete:"off"}})],1),e._v(" "),a("a-form-item",e._b({attrs:{label:"座机联系电话"}},"a-form-item",e.formItemLayout,!1),[a("a-input",{directives:[{name:"decorator",rawName:"v-decorator",value:["phoneLandLine"],expression:"['phoneLandLine']"}],attrs:{placeholder:"座机电话",autocomplete:"off"}})],1),e._v(" "),a("a-form-item",e._b({attrs:{label:"手机联系电话"}},"a-form-item",e.formItemLayout,!1),[a("a-input",{directives:[{name:"decorator",rawName:"v-decorator",value:["phoneCell"],expression:"['phoneCell']"}],attrs:{placeholder:"手机电话",autocomplete:"off"}})],1),e._v(" "),a("a-form-item",e._b({attrs:{label:"学历"}},"a-form-item",e.formItemLayout,!1),[a("a-auto-complete",{directives:[{name:"decorator",rawName:"v-decorator",value:["culture"],expression:"['culture']"}],attrs:{placeholder:"原学历",dataSource:e.cultureData,allowClear:!0,filterOption:e.filterOption}})],1),e._v(" "),a("a-form-item",e._b({attrs:{label:"政治面貌"}},"a-form-item",e.formItemLayout,!1),[a("a-auto-complete",{directives:[{name:"decorator",rawName:"v-decorator",value:["politicalFace"],expression:"['politicalFace']"}],attrs:{placeholder:"政治面貌",dataSource:e.politicalFaceData,allowClear:!0,filterOption:e.filterOption}})],1),e._v(" "),a("a-form-item",e._b({attrs:{label:"调入日期"}},"a-form-item",e.formItemLayout,!1),[a("a-date-picker",{directives:[{name:"decorator",rawName:"v-decorator",value:["transferDate"],expression:"['transferDate']"}],staticStyle:{width:"100%"},attrs:{placeholder:"调入或报到日期",format:"YYYY-MM-DD"}})],1),e._v(" "),a("a-form-item",e._b({attrs:{label:"到本场队日期"}},"a-form-item",e.formItemLayout,!1),[a("a-date-picker",{directives:[{name:"decorator",rawName:"v-decorator",value:["toTeamDate"],expression:"['toTeamDate']"}],staticStyle:{width:"100%"},attrs:{placeholder:"到本场队日期",format:"YYYY-MM-DD"}})],1),e._v(" "),a("a-form-item",e._b({attrs:{label:"岗位"}},"a-form-item",e.formItemLayout,!1),[a("a-auto-complete",{directives:[{name:"decorator",rawName:"v-decorator",value:["post"],expression:"['post']"}],attrs:{placeholder:"岗位",dataSource:e.postData,allowClear:!0,filterOption:e.filterOption}})],1),e._v(" "),a("a-form-item",e._b({attrs:{label:"现任岗位职务"}},"a-form-item",e.formItemLayout,!1),[a("a-auto-complete",{directives:[{name:"decorator",rawName:"v-decorator",value:["technicalType",{rules:[{required:!0,message:"现任岗位职务不能为空"}]}],expression:"['technicalType',\n          {rules: [{ required: true, message: '现任岗位职务不能为空'}]}\n        ]"}],attrs:{placeholder:"现任岗位职务",dataSource:e.technicalTypeData,allowClear:!0,filterOption:e.filterOption}})],1),e._v(" "),a("a-form-item",e._b({attrs:{label:"排序序号1"}},"a-form-item",e.formItemLayout,!1),[a("a-input-number",{directives:[{name:"decorator",rawName:"v-decorator",value:["sortNum1"],expression:"['sortNum1']"}],staticStyle:{width:"100%"},attrs:{placeholder:"排序序号1会排列总数居",autocomplete:"off"}})],1),e._v(" "),a("a-form-item",e._b({attrs:{label:"排序序号2"}},"a-form-item",e.formItemLayout,!1),[a("a-input-number",{directives:[{name:"decorator",rawName:"v-decorator",value:["sortNum2"],expression:"['sortNum2']"}],staticStyle:{width:"100%"},attrs:{placeholder:"排序序号2会排列序号1内的数据",autocomplete:"off"}})],1),e._v(" "),a("a-form-item",e._b({attrs:{label:"备注"}},"a-form-item",e.formItemLayout,!1),[a("a-textarea",{directives:[{name:"decorator",rawName:"v-decorator",value:["remark"],expression:"['remark']"}],attrs:{placeholder:"备注",autocomplete:"off"}})],1)],1),e._v(" "),a("div",{staticClass:"drawer-bootom-button"},[a("a-popconfirm",{attrs:{title:"确定放弃编辑？",okText:"确定",cancelText:"取消"},on:{confirm:e.onClose}},[a("a-button",{staticStyle:{"margin-right":".8rem"}},[e._v("取消")])],1),e._v(" "),a("a-button",{attrs:{type:"primary",loading:e.loading},on:{click:e.handleSubmit}},[e._v("提交")])],1)],1)},staticRenderFns:[]},d=a("VU/8")(c,n,!1,null,null,null);t.default=d.exports}});