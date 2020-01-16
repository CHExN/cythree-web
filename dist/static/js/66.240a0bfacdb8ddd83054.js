webpackJsonp([66],{AXnp:function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=i("Dd8w"),a=i.n(n),o=i("Gu7T"),r=i.n(o),s={name:"SupplierManage",props:{supplierManageVisiable:{require:!0,default:!1}},data:function(){return{loading:!1,form:this.$form.createForm(this),dataSource:[]}},computed:{columns:function(){return[{title:"供应商名称",dataIndex:"name",width:"70%",scopedSlots:{customRender:"name"}},{title:"操作",dataIndex:"operation",width:"30%",scopedSlots:{customRender:"operation"}}]}},methods:{reset:function(){this.loading=!1,this.dataSource=[]},onClose:function(){this.reset(),this.$emit("close")},setTableValues:function(t){if(!t)return[];var e=[];return t.forEach(function(t){e.push({id:t.id,name:t.name,editable:!1,isNew:!1})}),e},newRow:function(){this.dataSource.push({id:Math.max.apply(Math,r()(this.dataSource.map(function(t){return t.id})))+1,name:"",editable:!0,isNew:!0})},remove:function(t){var e=this;this.loading=!0,this.$delete("supplier/"+t).then(function(){var i=e.dataSource.filter(function(e){return e.id!==t});e.dataSource=i,e.$message.success("删除成功"),e.loading=!1})},addRow:function(t){var e=this;this.loading=!0;var i=this.dataSource.filter(function(e){return e.id===t})[0];this.$post("supplier",a()({},i)).then(function(t){e.loading=!1,i.id=t.data,i.editable=!1,i.isNew=!1})},edit:function(t){var e=this.dataSource.filter(function(e){return e.id===t})[0];e.editable=!e.editable},saveRow:function(t){var e=this,i=this.dataSource.filter(function(e){return e.id===t})[0];this.$put("supplier",a()({},i)).then(function(t){e.loading=!1,i.editable=!1,i.isNew=!1})},cancle:function(t){this.dataSource.filter(function(e){return e.id===t})[0].editable=!1}},watch:{supplierManageVisiable:function(){var t=this;this.supplierManageVisiable&&(this.tableLoading=!0,this.$get("supplier",{}).then(function(e){t.tableLoading=!1,t.dataSource=t.setTableValues(e.data.rows)}))}}},c={render:function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("a-drawer",{staticStyle:{height:"calc(100% - 55px)",overflow:"auto","padding-bottom":"53px"},attrs:{title:"供应商管理",width:"500",placement:"right",closable:!1,visible:t.supplierManageVisiable},on:{close:t.onClose}},[i("a-table",{attrs:{columns:t.columns,dataSource:t.dataSource,pagination:!1,loading:t.loading,rowKey:"id"},scopedSlots:t._u([{key:"name",fn:function(e,n){return[n.editable?i("a-input",{staticStyle:{margin:"-5px 0"},attrs:{placeholder:"供应商名称"},model:{value:n.name,callback:function(e){t.$set(n,"name",e)},expression:"record.name"}}):[t._v(t._s(e))]]}},{key:"operation",fn:function(e,n){return[n.editable?[n.isNew?i("span",[i("a",{on:{click:function(e){return t.addRow(n.id)}}},[t._v("添加")]),t._v(" "),i("a-divider",{attrs:{type:"vertical"}}),t._v(" "),i("a-popconfirm",{attrs:{title:"是否要删除此行？"},on:{confirm:function(e){return t.remove(n.id)}}},[i("a",[t._v("删除")])])],1):i("span",[i("a",{on:{click:function(e){return t.saveRow(n.id)}}},[t._v("保存")]),t._v(" "),i("a-divider",{attrs:{type:"vertical"}}),t._v(" "),i("a",{on:{click:function(e){return t.cancle(n.id)}}},[t._v("取消")])],1)]:i("span",[i("a",{on:{click:function(e){return t.edit(n.id)}}},[t._v("编辑")]),t._v(" "),i("a-divider",{attrs:{type:"vertical"}}),t._v(" "),i("a-popconfirm",{attrs:{title:"是否要删除此行？"},on:{confirm:function(e){return t.remove(n.id)}}},[i("a",[t._v("删除")])])],1)]}}])}),t._v(" "),i("a-button",{staticStyle:{width:"100%","margin-top":"16px","margin-bottom":"8px"},attrs:{type:"dashed",icon:"plus"},on:{click:t.newRow}},[t._v("新增供应商")])],1)},staticRenderFns:[]},u=i("VU/8")(s,c,!1,function(t){i("Va4o")},"data-v-5fd625fe",null);e.default=u.exports},Va4o:function(t,e){}});