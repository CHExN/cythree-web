webpackJsonp([87],{L72B:function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var a=r("Dd8w"),n=r.n(a),s=r("BO1k"),o=r.n(s),i={props:{electricityImportResultVisible:{required:!0,default:!1},importData:{required:!0},errors:{required:!0},times:{required:!0}},data:function(){return{pagination:{pageSizeOptions:["5","10"],defaultCurrent:1,defaultPageSize:5,showQuickJumper:!0,showSizeChanger:!0,showTotal:function(t,e){return"显示 "+e[0]+" ~ "+e[1]+" 条记录，共 "+t+" 条记录"}}}},computed:{errorsData:function(){for(var t=[],e=0;e<this.errors.length;e++){var r=this.errors[e],a={},s=!0,i=!1,l=void 0;try{for(var c,u=o()(r.errorFields);!(s=(c=u.next()).done);s=!0){var d=c.value;(a=n()({},d)).row=r.row,t.push(a)}}catch(t){i=!0,l=t}finally{try{!s&&u.return&&u.return()}finally{if(i)throw l}}}return t},successColumns:function(){return[{title:"电表编号",dataIndex:"electricityNum"},{title:"金额合计",dataIndex:"totalAmount"},{title:"登记日期",dataIndex:"createDate",scopedSlots:{customRender:"createDate"}}]},errorColumns:function(){return[{title:"行",dataIndex:"row",customRender:function(t,e,r){return"第 "+(t+1)+" 行"}},{title:"列",dataIndex:"cellIndex",customRender:function(t,e,r){return"第 "+(t+1)+" 列"}},{title:"列名",dataIndex:"column"},{title:"值",dataIndex:"name"},{title:"错误信息",dataIndex:"errorMessage"}]},show:{get:function(){return this.electricityImportResultVisible},set:function(){}}},methods:{handleCancel:function(){this.$emit("close")}}},l={render:function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("a-modal",{staticClass:"import-result",attrs:{title:"导入结果",centered:!0,footer:null,maskClosable:!1,width:1e3},on:{cancel:t.handleCancel},model:{value:t.show,callback:function(e){t.show=e},expression:"show"}},[r("div",{staticClass:"import-desc"},[0===t.importData.length&&0===t.errors.length?r("span",[r("a-alert",{attrs:{message:"暂无导入记录",type:"info"}})],1):t._e(),t._v(" "),0!==t.importData.length&&0!==t.errors.length?r("span",[r("a-alert",{attrs:{message:"部分导入成功",type:"warning"}},[r("div",{attrs:{slot:"description"},slot:"description"},[t._v("\n          成功导入 "),r("a",[t._v(t._s(t.importData.length))]),t._v(" 条记录，"),r("a",[t._v(t._s(t.errors.length))]),t._v(" 条记录导入失败，共耗时 "),r("a",[t._v(t._s(t.times))]),t._v(" 秒\n        ")])])],1):t._e(),t._v(" "),0!==t.importData.length&&0===t.errors.length?r("span",[r("a-alert",{attrs:{message:"全部导入成功",type:"success"}},[r("div",{attrs:{slot:"description"},slot:"description"},[t._v("\n          成功导入 "),r("a",[t._v(t._s(t.importData.length))]),t._v(" 条记录，共耗时 "),r("a",[t._v(t._s(t.times))]),t._v(" 秒\n        ")])])],1):t._e(),t._v(" "),0===t.importData.length&&0!==t.errors.length?r("span",[r("a-alert",{attrs:{message:"全部导入失败",type:"error"}},[r("div",{attrs:{slot:"description"},slot:"description"},[r("a",[t._v(t._s(t.errors.length))]),t._v(" 条记录导入失败，共耗时  "),r("a",[t._v(t._s(t.times))]),t._v(" 秒\n        ")])])],1):t._e()]),t._v(" "),r("a-tabs",{attrs:{defaultActiveKey:"1"}},[t.importData.length?r("a-tab-pane",{key:"1",attrs:{tab:"成功记录"}},[r("a-table",{ref:"successTable",attrs:{rowKey:"electricityId",columns:t.successColumns,dataSource:t.importData,pagination:t.pagination,scroll:{x:900}},scopedSlots:t._u([{key:"createDate",fn:function(e){return[t._v("\n          "+t._s(e.split(" ")[0])+"\n        ")]}}],null,!1,2429887175)})],1):t._e(),t._v(" "),t.errors.length?r("a-tab-pane",{key:"2",attrs:{tab:"失败记录"}},[r("a-table",{ref:"errorTable",attrs:{columns:t.errorColumns,dataSource:t.errorsData,pagination:t.pagination,scroll:{x:900}}})],1):t._e()],1)],1)},staticRenderFns:[]},c=r("VU/8")(i,l,!1,function(t){r("vL97")},null,null);e.default=c.exports},vL97:function(t,e){}});