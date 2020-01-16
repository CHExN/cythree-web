<template>
  <a-card :bordered="false" class="card-area">
    <div :class="advanced ? 'search' : null">
      <a-form layout="horizontal">
        <a-row>
          <div :class="advanced ? null: 'fold'">
            <a-col :md="12" :sm="24" >
              <a-form-item
                label="项目名称"
                :labelCol="{span: 5}"
                :wrapperCol="{span: 18, offset: 1}">
                <a-input v-model="queryParams.name"/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24" >
              <a-form-item
                label="合同编号"
                :labelCol="{span: 5}"
                :wrapperCol="{span: 18, offset: 1}">
                <a-input v-model="queryParams.num"/>
              </a-form-item>
            </a-col>
            <template v-if="advanced">
              <a-col :md="12" :sm="24" >
                <a-form-item
                  label="验收日期"
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 18, offset: 1}">
                  <range-date @change="handleDateChange" ref="createTime"></range-date>
                </a-form-item>
              </a-col>
            </template>
          </div>
          <span style="float: right; margin: 3px auto 1em;">
            <a-button type="primary" @click="search">查询</a-button>
            <a-button style="margin-left: 8px" @click="reset">重置</a-button>
            <a @click="toggleAdvanced" style="margin-left: 8px">
              {{advanced ? '收起' : '展开'}}
              <a-icon :type="advanced ? 'up' : 'down'" />
            </a>
          </span>
        </a-row>
      </a-form>
    </div>
    <div>
      <div class="operator">
        <a-button type="primary" ghost @click="add" v-hasPermission="'fixedAssetsAcceptance:add'">新增</a-button>
        <a-button @click="batchDelete" v-hasPermission="'fixedAssetsAcceptance:delete'">删除</a-button>
        <a-button @click="exportExcel" v-hasPermission="'fixedAssetsAcceptance:export'">导出验收单</a-button>
        <!-- <a-dropdown v-hasAnyPermission="'fixedAssetsAcceptance:export'">
          <a-menu slot="overlay">
            <a-menu-item key="export-data" @click="exportExcel">导出Excel</a-menu-item>
          </a-menu>
          <a-button>
            更多操作 <a-icon type="down" />
          </a-button>
        </a-dropdown> -->
      </div>
      <!-- 表格区域 -->
      <a-table ref="TableInfo"
               :columns="columns"
               :dataSource="dataSource"
               :pagination="pagination"
               :loading="loading"
               :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
               :scroll="{ x: 900 }"
               rowKey="id"
               @change="handleTableChange">
        <template slot="fixedAssetsAcceptanceNum" slot-scope="text, record">
          <a-tag :color="record.color==='1'?'orange':'blue'" style="font-size:100%">{{text}}</a-tag>
        </template>
        <template slot="operation" slot-scope="text, record">
          <a-icon v-hasPermission="'fixedAssetsAcceptance:update'" type="setting" theme="twoTone" twoToneColor="#4a9ff5" @click="edit(record)" title="修改"></a-icon>
          &nbsp;
          <a-icon v-hasPermission="'fixedAssetsAcceptance:view'" type="eye" theme="twoTone" twoToneColor="#42b983" @click="view(record)" title="查看"></a-icon>
          <a-badge v-hasNoPermission="'fixedAssetsAcceptance:update','fixedAssetsAcceptance:view'" status="warning" text="无权限"></a-badge>
        </template>
      </a-table>
    </div>
    <!-- 固定资产验收信息查看 -->
    <fixed-assets-acceptance-info
      :fixedAssetsAcceptanceInfoData="fixedAssetsAcceptanceInfo.data"
      :fixedAssetsAcceptanceInfoVisiable="fixedAssetsAcceptanceInfo.visiable"
      @close="handleFixedAssetsAcceptanceInfoClose">
    </fixed-assets-acceptance-info>
    <!-- 新增固定资产验收信息 -->
    <fixed-assets-acceptance-add
      :fixedAssetsAcceptanceAddVisiable="fixedAssetsAcceptanceAdd.visiable"
      @close="handleFixedAssetsAcceptanceAddClose"
      @success="handleFixedAssetsAcceptanceAddSuccess">
    </fixed-assets-acceptance-add>
    <!-- 修改固定资产验收信息 -->
    <fixed-assets-acceptance-edit
      ref="fixedAssetsAcceptanceEdit"
      :fixedAssetsAcceptanceEditVisiable="fixedAssetsAcceptanceEdit.visiable"
      @close="handleFixedAssetsAcceptanceEditClose"
      @success="handleFixedAssetsAcceptanceEditSuccess">
    </fixed-assets-acceptance-edit>
  </a-card>
</template>
<script>
import RangeDate from '@/components/datetime/RangeDate'
import FixedAssetsAcceptanceAdd from './FixedAssetsAcceptanceAdd'
import FixedAssetsAcceptanceEdit from './FixedAssetsAcceptanceEdit'
import FixedAssetsAcceptanceInfo from './FixedAssetsAcceptanceInfo'
import { newSpread, fixedForm, saveExcel } from '@/utils/spreadJS'

export default {
  name: 'FixedAssetsAcceptance',
  components: { RangeDate, FixedAssetsAcceptanceAdd, FixedAssetsAcceptanceEdit, FixedAssetsAcceptanceInfo },
  data () {
    return {
      advanced: false,
      fixedAssetsAcceptanceInfo: {
        visiable: false,
        data: {}
      },
      fixedAssetsAcceptanceAdd: {
        visiable: false,
        data: {}
      },
      fixedAssetsAcceptanceEdit: {
        visiable: false,
        data: {}
      },
      queryParams: {
        createTimeFrom: '',
        createTimeTo: ''
      },
      filteredInfo: null,
      sortedInfo: null,
      paginationInfo: null,
      dataSource: [],
      selectedRowKeys: [],
      selectedRows: [],
      loading: false,
      pagination: {
        pageSizeOptions: ['10', '20', '30', '40', '100'],
        defaultCurrent: 1,
        defaultPageSize: 10,
        showQuickJumper: true,
        showSizeChanger: true,
        showTotal: (total, range) => `显示 ${range[0]} ~ ${range[1]} 条记录，共 ${total} 条记录`
      }
    }
  },
  computed: {
    columns () {
      return [{
        title: '项目名称',
        dataIndex: 'name'
      }, {
        title: '合同编号',
        dataIndex: 'num'
      }, {
        title: '出库单号',
        dataIndex: 'storeroomOutNum'
      }, {
        title: '安装完成日期',
        dataIndex: 'installCompleteDate'
      }, {
        title: '验收日期',
        dataIndex: 'acceptanceDate'
      }, {
        title: '操作',
        dataIndex: 'operation',
        scopedSlots: { customRender: 'operation' },
        fixed: 'right',
        width: 100
      }]
    }
  },
  mounted () {
    this.fetch()
  },
  methods: {
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
      // 每次展开，把隐藏的内容清空
      if (!this.advanced) {
        this.queryParams.createTimeFrom = ''
        this.queryParams.createTimeTo = ''
      }
    },
    add () {
      this.fixedAssetsAcceptanceAdd.visiable = true
    },
    handleFixedAssetsAcceptanceAddClose () {
      this.fixedAssetsAcceptanceAdd.visiable = false
    },
    handleFixedAssetsAcceptanceAddSuccess () {
      this.fixedAssetsAcceptanceAdd.visiable = false
      this.$message.success('新增固定资产验收信息成功')
      this.search()
    },
    view (record) {
      this.fixedAssetsAcceptanceInfo.data = record
      this.fixedAssetsAcceptanceInfo.visiable = true
    },
    handleFixedAssetsAcceptanceInfoClose () {
      this.fixedAssetsAcceptanceInfo.visiable = false
    },
    edit (record) {
      this.$refs.fixedAssetsAcceptanceEdit.setFormValues(record)
      this.fixedAssetsAcceptanceEdit.visiable = true
    },
    handleFixedAssetsAcceptanceEditClose () {
      this.fixedAssetsAcceptanceEdit.visiable = false
    },
    handleFixedAssetsAcceptanceEditSuccess () {
      this.fixedAssetsAcceptanceEdit.visiable = false
      this.$message.success('修改固定资产验收信息成功')
      this.search()
    },
    handleDateChange (value) {
      if (value) {
        this.queryParams.createTimeFrom = value[0]
        this.queryParams.createTimeTo = value[1]
      }
    },
    batchDelete () {
      if (!this.selectedRowKeys.length) {
        this.$message.warning('请选择需要删除的记录')
        return
      }
      let that = this
      this.$confirm({
        title: '确定删除所选中的记录?',
        content: '当您点击确定按钮后，这些记录将会被彻底删除',
        centered: true,
        onOk () {
          that.$delete('fixedAssetsAcceptance/' + that.selectedRowKeys.join(',')).then(() => {
            that.$message.success('删除成功')
            that.selectedRowKeys = []
            that.selectedRows = []
            that.search()
          })
        },
        onCancel () {
          that.selectedRowKeys = []
          that.selectedRows = []
        }
      })
    },
    exportExcel () {
      if (!this.selectedRowKeys.length) {
        this.$message.warning('请选择需要导出的记录')
        return
      }
      // this.$message.loading('正在生成', 0)
      let newData = []
      this.selectedRows.forEach(item => {
        this.$get('storeroomOut/storeroomByOutId', {
          outId: item.storeroomOutId
        }).then((r) => {
          let assetList = ''
          r.data.forEach(item1 => {
            assetList = assetList + `${item1.name} ${item1.amount}${item1.unit} ${item1.money}\r`
          })
          newData.push({
            name: item.name,
            num: item.num,
            manager: item.manager,
            money: item.money,
            moneyTrue: item.moneyTrue,
            isMatch: this.getTrueOrFalse(item.isMatch),
            isApplicability: this.getTrueOrFalse(item.isApplicability),
            isIndicators: this.getTrueOrFalse(item.isIndicators),
            isAccessories: this.getTrueOrFalse(item.isAccessories),
            isNew: this.getTrueOrFalse(item.isNew),
            isComplete: this.getTrueOrFalse(item.isComplete),
            remarkO: item.remarkO,
            remark: item.remark,
            location: item.location,
            installCompleteDate: item.installCompleteDate,
            acceptanceDate: item.acceptanceDate,
            acceptanceResult: item.acceptanceResult,
            assetList: assetList
          })
          // 这里这段代码等项目上线体验后一段时间后解释掉，还有上面的message.loadoing
          // if (this.selectedRows.length === newData.length) {
          //   this.$message.destroy() // 等全部执行完后，再把message全局销毁
          //   newData.forEach(item => {
          //     let spread = newSpread('FixedAssetsAcceptance')
          //     spread = fixedForm(spread, 'FixedAssetsAcceptance', item)
          //     let fileName = `固定资产验收单_${item.name}_${item.num}.xlsx`
          //     saveExcel(spread, fileName)
          //   })
          // }
        })
      })
      // 上面解释后 下面这些删掉
      this.$message.loading('正在生成', 3, () => { // 3s后关闭执行关闭回调函数
        newData.forEach(item => {
          let spread = newSpread('FixedAssetsAcceptance')
          spread = fixedForm(spread, 'FixedAssetsAcceptance', item)
          let fileName = `固定资产验收单_${item.name}_${item.num}.xlsx`
          saveExcel(spread, fileName)
        })
      })
    },
    getTrueOrFalse (value) {
      if (value === '0') {
        return '否'
      } else if (value === '1') {
        return '是'
      }
      return value
    },
    search () {
      let {sortedInfo, filteredInfo} = this
      let sortField, sortOrder
      // 获取当前列的排序和列的过滤规则
      if (sortedInfo) {
        sortField = sortedInfo.field
        sortOrder = sortedInfo.order
      }
      this.fetch({
        sortField: sortField,
        sortOrder: sortOrder,
        ...this.queryParams,
        ...filteredInfo
      })
    },
    reset () {
      // 取消选中
      this.selectedRowKeys = []
      this.selectedRows = []
      // 重置分页
      this.$refs.TableInfo.pagination.current = this.pagination.defaultCurrent
      if (this.paginationInfo) {
        this.paginationInfo.current = this.pagination.defaultCurrent
        this.paginationInfo.pageSize = this.pagination.defaultPageSize
      }
      // 重置列过滤器规则
      this.filteredInfo = null
      // 重置列排序规则
      this.sortedInfo = null
      // 重置查询参数
      this.queryParams = {
        createTimeFrom: '',
        createTimeTo: ''
      }
      if (this.advanced) {
        // 清空时间选择
        this.$refs.createTime.reset()
      }
      this.fetch()
    },
    handleTableChange (pagination, filters, sorter) {
      // 将这三个参数赋值给Vue data，用于后续使用
      this.paginationInfo = pagination
      this.filteredInfo = filters
      this.sortedInfo = sorter

      this.fetch({
        sortField: sorter.field,
        sortOrder: sorter.order,
        ...this.queryParams,
        ...filters
      })
    },
    fetch (params = {}) {
      // 显示loading
      this.loading = true
      if (this.paginationInfo) {
        // 如果分页信息不为空，则设置表格当前第几页，每页条数，并设置查询分页参数
        this.$refs.TableInfo.pagination.current = this.paginationInfo.current
        this.$refs.TableInfo.pagination.pageSize = this.paginationInfo.pageSize
        params.pageSize = this.paginationInfo.pageSize
        params.pageNum = this.paginationInfo.current
      } else {
        // 如果分页信息为空，则设置为默认值
        params.pageSize = this.pagination.defaultPageSize
        params.pageNum = this.pagination.defaultCurrent
      }
      this.$get('fixedAssetsAcceptance', {
        ...params
      }).then((r) => {
        let data = r.data
        const pagination = { ...this.pagination }
        pagination.total = data.total
        this.dataSource = data.rows
        this.pagination = pagination
        // 数据加载完毕，关闭loading
        this.loading = false
      })
    }
  }
}
</script>
<style lang="less" scoped>
@import "../../../../static/less/Common";
</style>
