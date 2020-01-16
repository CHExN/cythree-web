webpackJsonp([80],{"7mdg":function(t,e){},gdq2:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var s=a("dC1H"),i=a("et8n"),r=s.a.Item,n={components:{AStepItemGroup:i.a.Group,AStepItem:i.a,DetailListItem:r,DetailList:s.a},name:"InsuranceOutsideInfo",props:{insuranceOutsideInfoVisiable:{require:!0,default:!1},insuranceOutsideInfoData:{require:!0}},data:function(){return{staffOutsideData:{},loading:!1}},methods:{handleCancleClick:function(){this.staffOutsideData={},this.$emit("close")},getNewTransfer:function(t){return"0"===t?"新参":"1"===t?"传入":void 0},getGender:function(t){return"0"===t?"女":"1"===t?"男":void 0},getHouseholdRegistrationType:function(t){switch(t){case"0":return"外地农业";case"1":return"外地非农业";case"2":return"本地农业";case"3":return"本地非农业";default:return t}}},watch:{insuranceOutsideInfoVisiable:function(){var t=this;this.insuranceOutsideInfoVisiable&&(this.loading=!0,this.$get("staffOutside/getStaffOutsideByStaffId",{staffId:this.insuranceOutsideInfoData.staffId}).then(function(e){t.loading=!1,e.data&&(t.staffOutsideData=e.data)}))}}},d={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("a-modal",{attrs:{title:"编外保险人员信息",centered:!0,width:1200,visible:t.insuranceOutsideInfoVisiable,keyboard:!1,footer:null},on:{cancel:t.handleCancleClick}},[a("a-card",{attrs:{bordered:!1}},[a("a-card",{attrs:{bordered:!1}},[a("detail-list",{attrs:{title:"保险信息"}},[a("detail-list-item",{attrs:{term:"姓名"}},[t._v(t._s(t.insuranceOutsideInfoData.name))]),t._v(" "),a("detail-list-item",{attrs:{term:"户口地址邮编"}},[t._v(t._s(t.insuranceOutsideInfoData.accountPostalCode))]),t._v(" "),a("detail-list-item",{attrs:{term:"户口地址"}},[t._v(t._s(t.insuranceOutsideInfoData.accountAddress))]),t._v(" "),a("detail-list-item",{attrs:{term:"类型"}},[t._v(t._s(t.getNewTransfer(t.insuranceOutsideInfoData.newTransfer)))]),t._v(" "),a("detail-list-item",{attrs:{term:"现居住地址邮编"}},[t._v(t._s(t.insuranceOutsideInfoData.currentPostalCode))]),t._v(" "),a("detail-list-item",{attrs:{term:"现居住地址"}},[t._v(t._s(t.insuranceOutsideInfoData.currentAddress))]),t._v(" "),a("detail-list-item",{attrs:{term:"银行卡号"}},[t._v(t._s(t.insuranceOutsideInfoData.bankCardNumber))]),t._v(" "),a("detail-list-item",{attrs:{term:"社保医院"}},[t._v(t._s(t.insuranceOutsideInfoData.socialSecurityHospital))]),t._v(" "),a("detail-list-item",{attrs:{term:"养老保险基数"}},[t._v(t._s(t.insuranceOutsideInfoData.pensionInsuranceBase))]),t._v(" "),a("detail-list-item",{attrs:{term:"工伤保险基数"}},[t._v(t._s(t.insuranceOutsideInfoData.workInjuryInsuranceBase))]),t._v(" "),a("detail-list-item",{attrs:{term:"医疗保险基数"}},[t._v(t._s(t.insuranceOutsideInfoData.medicalInsuranceBase))])],1)],1),t._v(" "),a("a-divider",{staticStyle:{"margin-bottom":"32px"}}),t._v(" "),a("a-card",{attrs:{loading:t.loading,bordered:!1}},[a("detail-list",{attrs:{title:"人员信息"}},[a("detail-list-item",{attrs:{term:"姓名"}},[t._v(t._s(t.staffOutsideData.name))]),t._v(" "),a("detail-list-item",{attrs:{term:"分队"}},[t._v(t._s(t.staffOutsideData.team))]),t._v(" "),a("detail-list-item",{attrs:{term:"人员类型"}},[t._v(t._s(t.staffOutsideData.temporary))]),t._v(" "),a("detail-list-item",{attrs:{term:"性别"}},[t._v(t._s(t.getGender(t.staffOutsideData.gender)))]),t._v(" "),a("detail-list-item",{attrs:{term:"民族"}},[t._v(t._s(t.staffOutsideData.clan))]),t._v(" "),a("detail-list-item",{attrs:{term:"籍贯"}},[t._v(t._s(t.staffOutsideData.birthplace))]),t._v(" "),a("detail-list-item",{attrs:{term:"学历"}},[t._v(t._s(t.staffOutsideData.culture))]),t._v(" "),a("detail-list-item",{attrs:{term:"户籍性质"}},[t._v(t._s(t.getHouseholdRegistrationType(t.staffOutsideData.householdRegistrationType)))]),t._v(" "),a("detail-list-item",{attrs:{term:"政治面貌"}},[t._v(t._s(t.staffOutsideData.politicalFace))]),t._v(" "),a("detail-list-item",{attrs:{term:"家庭住址"}},[t._v(t._s(t.staffOutsideData.address))]),t._v(" "),a("detail-list-item",{attrs:{term:"身份证号码"}},[t._v(t._s(t.staffOutsideData.idNum))]),t._v(" "),a("detail-list-item",{attrs:{term:"座机联系电话"}},[t._v(t._s(t.staffOutsideData.phoneLandLine))]),t._v(" "),a("detail-list-item",{attrs:{term:"手机联系电话"}},[t._v(t._s(t.staffOutsideData.phoneCell))]),t._v(" "),a("detail-list-item",{attrs:{term:"出生年月"}},[t._v(t._s(t.staffOutsideData.birthDate))]),t._v(" "),a("detail-list-item",{attrs:{term:"年龄"}},[t._v(t._s(this.$tools.getAge(t.staffOutsideData.birthDate)))]),t._v(" "),a("detail-list-item",{attrs:{term:"调入环卫或报到日期"}},[t._v(t._s(t.staffOutsideData.transferDate))]),t._v(" "),a("detail-list-item",{attrs:{term:"到本场队日期"}},[t._v(t._s(t.staffOutsideData.toTeamDate))]),t._v(" "),a("detail-list-item",{attrs:{term:"岗位"}},[t._v(t._s(t.staffOutsideData.post))]),t._v(" "),a("detail-list-item",{attrs:{term:"岗位类别"}},[t._v(t._s(t.staffOutsideData.technicalType))]),t._v(" "),a("detail-list-item",{attrs:{term:"备注"}},[t._v(t._s(t.staffOutsideData.remark))])],1)],1)],1)],1)},staticRenderFns:[]},l=a("VU/8")(n,d,!1,function(t){a("7mdg")},"data-v-38870156",null);e.default=l.exports}});