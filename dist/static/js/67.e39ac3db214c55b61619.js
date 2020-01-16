webpackJsonp([67],{ZWws:function(t,e){},"gh2+":function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var s=a("dC1H"),i=a("et8n"),r=s.a.Item,n={components:{AStepItemGroup:i.a.Group,AStepItem:i.a,DetailListItem:r,DetailList:s.a},name:"InsuranceInsideInfo",props:{insuranceInsideInfoVisiable:{require:!0,default:!1},insuranceInsideInfoData:{require:!0}},data:function(){return{staffInsideData:{},loading:!1}},methods:{handleCancleClick:function(){this.staffInsideData={},this.$emit("close")},getNewTransfer:function(t){return"0"===t?"新参":"1"===t?"传入":void 0},getType:function(t){return"0"===t?"固定工":"1"===t?"合同制":void 0},getGender:function(t){return"0"===t?"女":"1"===t?"男":void 0},getIsDisabilityCertificate:function(t){return"0"===t?"无":"1"===t?"有":void 0},getHouseholdRegistrationType:function(t){switch(t){case"0":return"外地农业";case"1":return"外地非农业";case"2":return"本地农业";case"3":return"本地非农业";default:return t}},getPost:function(t){switch(t){case"0":return"管理";case"1":return"技工";case"2":return"普工";case"3":return"专技";default:return t}}},watch:{insuranceInsideInfoVisiable:function(){var t=this;this.insuranceInsideInfoVisiable&&(this.loading=!0,this.$get("staffInside/getStaffInside",{staffId:this.insuranceInsideInfoData.staffId}).then(function(e){t.loading=!1,e.data&&(t.staffInsideData=e.data)}))}}},d={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("a-modal",{attrs:{title:"编内保险人员信息",centered:!0,width:1200,visible:t.insuranceInsideInfoVisiable,keyboard:!1,footer:null},on:{cancel:t.handleCancleClick}},[a("a-card",{attrs:{bordered:!1}},[a("a-card",{attrs:{bordered:!1}},[a("detail-list",{attrs:{title:"保险信息"}},[a("detail-list-item",{attrs:{term:"姓名"}},[t._v(t._s(t.insuranceInsideInfoData.name))]),t._v(" "),a("detail-list-item",{attrs:{term:"户口地址邮编"}},[t._v(t._s(t.insuranceInsideInfoData.accountPostalCode))]),t._v(" "),a("detail-list-item",{attrs:{term:"户口地址"}},[t._v(t._s(t.insuranceInsideInfoData.accountAddress))]),t._v(" "),a("detail-list-item",{attrs:{term:"类型"}},[t._v(t._s(t.getNewTransfer(t.insuranceInsideInfoData.newTransfer)))]),t._v(" "),a("detail-list-item",{attrs:{term:"现居住地址邮编"}},[t._v(t._s(t.insuranceInsideInfoData.currentPostalCode))]),t._v(" "),a("detail-list-item",{attrs:{term:"现居住地址"}},[t._v(t._s(t.insuranceInsideInfoData.currentAddress))]),t._v(" "),a("detail-list-item",{attrs:{term:"银行卡号"}},[t._v(t._s(t.insuranceInsideInfoData.bankCardNumber))]),t._v(" "),a("detail-list-item",{attrs:{term:"社保医院"}},[t._v(t._s(t.insuranceInsideInfoData.socialSecurityHospital))]),t._v(" "),a("detail-list-item",{attrs:{term:"养老保险基数"}},[t._v(t._s(t.insuranceInsideInfoData.pensionInsuranceBase))]),t._v(" "),a("detail-list-item",{attrs:{term:"工伤保险基数"}},[t._v(t._s(t.insuranceInsideInfoData.workInjuryInsuranceBase))]),t._v(" "),a("detail-list-item",{attrs:{term:"医疗保险基数"}},[t._v(t._s(t.insuranceInsideInfoData.medicalInsuranceBase))])],1)],1),t._v(" "),a("a-divider",{staticStyle:{"margin-bottom":"32px"}}),t._v(" "),a("a-card",{attrs:{loading:t.loading,bordered:!1}},[a("detail-list",{attrs:{title:"人员信息"}},[a("detail-list-item",{attrs:{term:"姓名"}},[t._v(t._s(t.staffInsideData.name))]),t._v(" "),a("detail-list-item",{attrs:{term:"部门"}},[t._v(t._s(t.staffInsideData.deptName))]),t._v(" "),a("detail-list-item",{attrs:{term:"人员类型"}},[t._v(t._s(t.getType(t.staffInsideData.type)))]),t._v(" "),a("detail-list-item",{attrs:{term:"事由"}},[t._v(t._s(t.staffInsideData.cause))]),t._v(" "),a("detail-list-item",{attrs:{term:"性别"}},[t._v(t._s(t.getGender(t.staffInsideData.gender)))]),t._v(" "),a("detail-list-item",{attrs:{term:"民族"}},[t._v(t._s(t.staffInsideData.clan))]),t._v(" "),a("detail-list-item",{attrs:{term:"籍贯"}},[t._v(t._s(t.staffInsideData.birthplace))]),t._v(" "),a("detail-list-item",{attrs:{term:"原学历"}},[t._v(t._s(t.staffInsideData.cultureBefore))]),t._v(" "),a("detail-list-item",{attrs:{term:"现学历"}},[t._v(t._s(t.staffInsideData.cultureCurrent))]),t._v(" "),a("detail-list-item",{attrs:{term:"户籍性质"}},[t._v(t._s(t.getHouseholdRegistrationType(t.staffInsideData.householdRegistrationType)))]),t._v(" "),a("detail-list-item",{attrs:{term:"专业"}},[t._v(t._s(t.staffInsideData.profession))]),t._v(" "),a("detail-list-item",{attrs:{term:"毕业日期"}},[t._v(t._s(t.staffInsideData.graduationDate))]),t._v(" "),a("detail-list-item",{attrs:{term:"政治面貌"}},[t._v(t._s(t.staffInsideData.politicalFace))]),t._v(" "),a("detail-list-item",{attrs:{term:"有无残疾证"}},[t._v(t._s(t.getIsDisabilityCertificate(t.staffInsideData.isDisabilityCertificate)))]),t._v(" "),a("detail-list-item",{attrs:{term:"工伤证发证日期"}},[t._v(t._s(t.staffInsideData.workInjuryCertificateDate))]),t._v(" "),a("detail-list-item",{attrs:{term:"伤残鉴定等级"}},[t._v(t._s(t.staffInsideData.disabilityIdentificationLevel))]),t._v(" "),a("detail-list-item",{attrs:{term:"家庭住址"}},[t._v(t._s(t.staffInsideData.address))]),t._v(" "),a("detail-list-item",{attrs:{term:"身份证号码"}},[t._v(t._s(t.staffInsideData.idNum))]),t._v(" "),a("detail-list-item",{attrs:{term:"座机联系电话"}},[t._v(t._s(t.staffInsideData.phoneLandLine))]),t._v(" "),a("detail-list-item",{attrs:{term:"手机联系电话"}},[t._v(t._s(t.staffInsideData.phoneCell))]),t._v(" "),a("detail-list-item",{attrs:{term:"出生年月"}},[t._v(t._s(t.staffInsideData.birthDate))]),t._v(" "),a("detail-list-item",{attrs:{term:"年龄"}},[t._v(t._s(this.$tools.getAge(t.staffInsideData.birthDate)))]),t._v(" "),a("detail-list-item",{attrs:{term:"参加工作日期"}},[t._v(t._s(t.staffInsideData.workDate))]),t._v(" "),a("detail-list-item",{attrs:{term:"农转工转工日期"}},[t._v(t._s(t.staffInsideData.farmerWorkDate))]),t._v(" "),a("detail-list-item",{attrs:{term:"调入环卫或报到日期"}},[t._v(t._s(t.staffInsideData.transferDate))]),t._v(" "),a("detail-list-item",{attrs:{term:"现任岗位职务"}},[t._v(t._s(t.staffInsideData.technicalType))]),t._v(" "),a("detail-list-item",{attrs:{term:"岗位"}},[t._v(t._s(t.getPost(t.staffInsideData.post)))]),t._v(" "),a("detail-list-item",{attrs:{term:"岗位级别"}},[t._v(t._s(t.staffInsideData.postLevel))]),t._v(" "),a("detail-list-item",{attrs:{term:"聘任时间"}},[t._v(t._s(t.staffInsideData.appointmentDate))]),t._v(" "),a("detail-list-item",{attrs:{term:"技术等级取得日期"}},[t._v(t._s(t.staffInsideData.technicalLevelDate))]),t._v(" "),a("detail-list-item",{attrs:{term:"证书编号"}},[t._v(t._s(t.staffInsideData.certificateNum))]),t._v(" "),a("detail-list-item",{attrs:{term:"入职状态"}},[t._v(t._s(t.staffInsideData.entryStatus))])],1)],1)],1)],1)},staticRenderFns:[]},l=a("VU/8")(n,d,!1,function(t){a("ZWws")},"data-v-5a3d4294",null);e.default=l.exports}});