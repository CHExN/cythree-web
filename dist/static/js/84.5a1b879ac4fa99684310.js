webpackJsonp([84],{ewVw:function(t,a){},qDNE:function(t,a,e){"use strict";Object.defineProperty(a,"__esModule",{value:!0});var r=e("dC1H"),i={components:{DetailListItem:r.a.Item,DetailList:r.a},name:"CarInfo",props:{carInfoVisiable:{require:!0,default:!1},carInfoData:{require:!0}},data:function(){return{}},methods:{handleCancleClick:function(){this.$emit("close")}}},s={render:function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("a-modal",{attrs:{title:"车辆信息",centered:!0,width:850,visible:t.carInfoVisiable,keyboard:!1,footer:null},on:{cancel:t.handleCancleClick}},[e("a-card",{attrs:{bordered:!1}},[e("detail-list",[e("detail-list-item",{attrs:{term:"车牌号"}},[t._v(t._s(t.carInfoData.carNum))]),t._v(" "),e("detail-list-item",{attrs:{term:"车辆年龄"}},[t._v(t._s(t.$tools.getAge(t.carInfoData.date)))]),t._v(" "),e("detail-list-item",{attrs:{term:"车牌颜色"}},[t._v(t._s("1"===t.carInfoData.color?"黄":"蓝"))]),t._v(" "),e("detail-list-item",{attrs:{term:"车辆品牌"}},[t._v(t._s(t.carInfoData.carType))]),t._v(" "),e("detail-list-item",{attrs:{term:"汽车排量"}},[t._v(t._s(t.carInfoData.carDisplacement))]),t._v(" "),e("detail-list-item",{attrs:{term:"车辆种类"}},[t._v(t._s(t.carInfoData.carKind))]),t._v(" "),e("detail-list-item",{attrs:{term:"车辆日期"}},[t._v(t._s(t.carInfoData.date))]),t._v(" "),e("detail-list-item",{attrs:{term:"车辆用途"}},[t._v(t._s(t.carInfoData.carUse))]),t._v(" "),e("detail-list-item",{attrs:{term:"车辆使用单位"}},[t._v(t._s(t.carInfoData.carUseUnit))]),t._v(" "),e("detail-list-item",{attrs:{term:"车辆所属单位"}},[t._v(t._s(t.carInfoData.carUnit))]),t._v(" "),e("detail-list-item",{attrs:{term:"原始牌照"}},[t._v(t._s(t.carInfoData.carNumOld))]),t._v(" "),e("detail-list-item",{attrs:{term:"备注"}},[t._v(t._s(t.carInfoData.remark))]),t._v(" "),e("detail-list-item",{attrs:{term:"车辆状态"}},[t._v(t._s("1"===t.carInfoData.status?"行驶":"停驶"))])],1)],1)],1)},staticRenderFns:[]},l=e("VU/8")(i,s,!1,function(t){e("ewVw")},"data-v-264e3ba4",null);a.default=l.exports}});