webpackJsonp([108],{"6OtN":function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var a=i("dC1H"),r=i("et8n"),s=a.a.Item,n={components:{AStepItemGroup:r.a.Group,AStepItem:r.a,DetailListItem:s,DetailList:a.a},name:"ReviewModifyInfo",props:{reviewModifyInfoVisiable:{require:!0,default:!1},reviewModifyInfoData:{require:!0}},data:function(){return{getProcess:function(e){switch(e){case"0":return"待审核";case"1":return"已通过";case"2":return"未通过";case"3":return"已修改";default:return e}}}},methods:{handleCancleClick:function(){this.$emit("close")}}},o={render:function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("a-modal",{attrs:{title:"修改申请信息",centered:!0,width:800,visible:e.reviewModifyInfoVisiable,keyboard:!1,footer:null},on:{cancel:e.handleCancleClick}},[i("a-card",{staticStyle:{"margin-bottom":"32px"},attrs:{bordered:!1}},[i("detail-list",[i("detail-list-item",{attrs:{term:"申请部门"}},[e._v(e._s(e.reviewModifyInfoData.deptName))]),e._v(" "),i("detail-list-item",{attrs:{term:"模块"}},[e._v(e._s(e.reviewModifyInfoData.tableCname))]),e._v(" "),i("detail-list-item",{attrs:{term:"内容"}},[e._v(e._s(e.reviewModifyInfoData.info))]),e._v(" "),i("detail-list-item",{attrs:{term:"申请人账号"}},[e._v(e._s(e.reviewModifyInfoData.username))]),e._v(" "),i("detail-list-item",{attrs:{term:"申请时间"}},[e._v(e._s(e.reviewModifyInfoData.createTime))]),e._v(" "),i("detail-list-item",{attrs:{term:"状态变更时间"}},[e._v(e._s(e.reviewModifyInfoData.modifyTime))]),e._v(" "),i("detail-list-item",{attrs:{term:"状态"}},[e._v(e._s(e.getProcess(e.reviewModifyInfoData.process)))])],1)],1)],1)},staticRenderFns:[]},l=i("VU/8")(n,o,!1,null,null,null);t.default=l.exports}});