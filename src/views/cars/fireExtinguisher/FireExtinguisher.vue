<template>
  <a-card :bordered="false" class="card-area">
    <div :class="advanced ? 'search' : null">
      <a-form layout="horizontal">
        <a-row>
          <div :class="advanced ? null: 'fold'">
            <a-col :md="12" :sm="24" >
              <a-form-item
                label="资产名称"
                :labelCol="{span: 5}"
                :wrapperCol="{span: 18, offset: 1}">
                <a-input v-model="queryParams.assetName"/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24" >
              <a-form-item
                label="公厕名称"
                :labelCol="{span: 5}"
                :wrapperCol="{span: 18, offset: 1}">
                <a-input v-model="queryParams.wcName"/>
              </a-form-item>
            </a-col>
            <template v-if="advanced">
              <a-col :md="12" :sm="24" >
                <a-form-item
                  label="公厕编号"
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 18, offset: 1}">
                  <a-input v-model="queryParams.wcNum"/>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24" >
                <a-form-item
                  label="责任人"
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 18, offset: 1}">
                  <a-input v-model="queryParams.user"/>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24" >
                <a-form-item
                  label="规格"
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 18, offset: 1}">
                  <a-input v-model="queryParams.specification"/>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24" >
                <a-form-item
                  label="摆放地点"
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 18, offset: 1}">
                  <a-input v-model="queryParams.place"/>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24" >
                <a-form-item
                  label="备注"
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 18, offset: 1}">
                  <a-input v-model="queryParams.remark"/>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24" >
                <a-form-item
                  label="配发日期1"
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 18, offset: 1}">
                  <range-date @change="handleAllotmentDate1Change" ref="allotmentDate1"></range-date>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24" >
                <a-form-item
                  label="配发日期2"
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 18, offset: 1}">
                  <range-date @change="handleAllotmentDate2Change" ref="allotmentDate2"></range-date>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24" >
                <a-form-item
                  label="检测日期1"
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 18, offset: 1}">
                  <range-date @change="handleTestDate1Change" ref="testDate1"></range-date>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24" >
                <a-form-item
                  label="检测日期2"
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 18, offset: 1}">
                  <range-date @change="handleTestDate2Change" ref="testDate2"></range-date>
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
        <a-button type="primary" ghost @click="add" v-hasPermission="'fireExtinguisher:add'">新增</a-button>
        <a-button @click="batchDelete" v-hasPermission="'fireExtinguisher:delete'">删除</a-button>
        <a-dropdown>
          <a-menu slot="overlay">
            <a-menu-item key="download-template" @click="downloadTemplate">模板下载</a-menu-item>
            <a-menu-item key="import-data" v-hasPermission="'fireExtinguisher:add'">
              <a-upload class="upload-area" :fileList="fileList" :beforeUpload="importExcel">导入Excel</a-upload>
            </a-menu-item>
            <a-menu-item v-hasPermission="'fireExtinguisher:export'" key="export-data" @click="exportExcel">导出Excel</a-menu-item>
          </a-menu>
          <a-button>
            更多操作 <a-icon type="down" />
          </a-button>
        </a-dropdown>
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
        <template slot="wcName" slot-scope="text">
          <a-popover placement="topLeft">
            <template slot="content">
              <div>{{text}}</div>
            </template>
            <p style="width: 150px;margin-bottom: 0">{{text}}</p>
          </a-popover>
        </template>
        <template slot="operation" slot-scope="text, record">
          <a-icon v-hasPermission="'fireExtinguisher:update'" type="setting" theme="twoTone" twoToneColor="#4a9ff5" @click="edit(record)" title="修改"></a-icon>
          &nbsp;
          <a-icon v-hasPermission="'fireExtinguisher:view'" type="eye" theme="twoTone" twoToneColor="#42b983" @click="view(record)" title="查看"></a-icon>
          <!-- <a-badge v-hasNoPermission="'fireExtinguisher:update'" status="warning" text="无权限"></a-badge> -->
        </template>
      </a-table>
    </div>
    <!-- 灭火器信息查看 -->
    <fire-extinguisher-info
      :fireExtinguisherInfoData="fireExtinguisherInfo.data"
      :fireExtinguisherInfoVisiable="fireExtinguisherInfo.visiable"
      @close="handleFireExtinguisherInfoClose">
    </fire-extinguisher-info>
    <!-- 新增灭火器 -->
    <fire-extinguisher-add
      :fireExtinguisherAddVisiable="fireExtinguisherAdd.visiable"
      @close="handleFireExtinguisherAddClose"
      @success="handleFireExtinguisherAddSuccess">
    </fire-extinguisher-add>
    <!-- 修改灭火器 -->
    <fire-extinguisher-edit
      ref="fireExtinguisherEdit"
      :fireExtinguisherEditVisiable="fireExtinguisherEdit.visiable"
      @close="handleFireExtinguisherEditClose"
      @success="handleFireExtinguisherEditSuccess">
    </fire-extinguisher-edit>
    <!-- 导入结果 -->
    <import-result
      @close="handleClose"
      :importData="importData"
      :errors="errors"
      :times="times"
      :successColumns="successColumns"
      :importResultVisible="importResultVisible">
    </import-result>
  </a-card>
</template>
<script>
import RangeDate from '@/components/datetime/RangeDate'
import FireExtinguisherInfo from './FireExtinguisherInfo'
import FireExtinguisherAdd from './FireExtinguisherAdd'
import FireExtinguisherEdit from './FireExtinguisherEdit'
import ImportResult from '@/components/view/ImportResult'

export default {
  name: 'FireExtinguisher',
  components: { RangeDate, FireExtinguisherInfo, FireExtinguisherAdd, FireExtinguisherEdit, ImportResult },
  data () {
    return {
      fileList: [],
      importData: [],
      times: '',
      errors: [],
      successColumns: [],
      importResultVisible: false,
      advanced: false,
      fireExtinguisherInfo: {
        visiable: false,
        data: {}
      },
      fireExtinguisherAdd: {
        visiable: false,
        data: {}
      },
      fireExtinguisherEdit: {
        visiable: false,
        data: {}
      },
      queryParams: {
        carKind: [],
        carUse: []
      },
      filteredInfo: null,
      sortedInfo: null,
      paginationInfo: null,
      dataSource: [],
      selectedRowKeys: [],
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
      // 受控属性
      return [{
        title: '资产名称',
        dataIndex: 'assetName'
      }, {
        title: '品牌型号',
        dataIndex: 'brandModel'
      }, {
        title: '配发日期1',
        dataIndex: 'allotmentDate1'
      }, {
        title: '配发日期2',
        dataIndex: 'allotmentDate2'
      }, {
        title: '责任人',
        dataIndex: 'user'
      }, {
        title: '检测日期1',
        dataIndex: 'testDate1'
      }, {
        title: '检测日期2',
        dataIndex: 'testDate2'
      }, {
        title: '公厕名称',
        dataIndex: 'wcName',
        scopedSlots: { customRender: 'wcName' }
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
    handleClose () {
      this.importResultVisible = false
    },
    downloadTemplate () {
      this.$download('fireExtinguisher/template', {}, '灭火器表_导入模板.xlsx')
    },
    importExcel (file) {
      const formData = new FormData()
      formData.append('file', file)
      this.$message.loading('处理中', 0)
      this.$upload('fireExtinguisher/import', formData).then((r) => {
        let data = r.data.data
        if (data.data.length) {
          this.search()
        }
        this.$message.destroy()
        this.importData = data.data
        this.errors = data.error
        this.times = data.time / 1000
        this.successColumns = [{
          title: '品牌型号',
          dataIndex: 'brandModel'
        }, {
          title: '责任人',
          dataIndex: 'user'
        }, {
          title: '公厕编号',
          dataIndex: 'wcName'
        }]
        this.importResultVisible = true
      }).catch((r) => {
        this.$message.destroy()
        console.error(r)
      })
      return false
    },
    onSelectChange (selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
      // 每次展开，把隐藏的内容清空
      if (!this.advanced) {
        this.queryParams.wcNum = ''
        this.queryParams.user = ''
        this.queryParams.specification = ''
        this.queryParams.place = ''
        this.queryParams.remark = ''
        this.queryParams.allotmentDate1From = ''
        this.queryParams.allotmentDate1To = ''
        this.queryParams.allotmentDate2From = ''
        this.queryParams.allotmentDate2To = ''
        this.queryParams.testDate1From = ''
        this.queryParams.testDate1To = ''
        this.queryParams.testDate2From = ''
        this.queryParams.testDate2To = ''
      }
    },
    view (record) {
      this.fireExtinguisherInfo.data = record
      this.fireExtinguisherInfo.visiable = true
    },
    add () {
      this.fireExtinguisherAdd.visiable = true
    },
    handleFireExtinguisherAddClose () {
      this.fireExtinguisherAdd.visiable = false
    },
    handleFireExtinguisherAddSuccess () {
      this.fireExtinguisherAdd.visiable = false
      this.$message.success('新增灭火器成功')
      this.search()
    },
    edit (record) {
      this.$refs.fireExtinguisherEdit.setFormValues(record)
      this.fireExtinguisherEdit.visiable = true
    },
    handleFireExtinguisherEditClose () {
      this.fireExtinguisherEdit.visiable = false
    },
    handleFireExtinguisherEditSuccess () {
      this.fireExtinguisherEdit.visiable = false
      this.$message.success('修改灭火器成功')
      this.search()
    },
    handleFireExtinguisherInfoClose () {
      this.fireExtinguisherInfo.visiable = false
    },
    handleAllotmentDate1Change (value) {
      if (value) {
        this.queryParams.allotmentDate1From = value[0]
        this.queryParams.allotmentDate1To = value[1]
      }
    },
    handleAllotmentDate2Change (value) {
      if (value) {
        this.queryParams.allotmentDate2From = value[0]
        this.queryParams.allotmentDate2To = value[1]
      }
    },
    handleTestDate1Change (value) {
      if (value) {
        this.queryParams.testDate1From = value[0]
        this.queryParams.testDate1To = value[1]
      }
    },
    handleTestDate2Change (value) {
      if (value) {
        this.queryParams.testDate2From = value[0]
        this.queryParams.testDate2To = value[1]
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
          that.$delete('fireExtinguisher/' + that.selectedRowKeys.join(',')).then(() => {
            that.$message.success('删除成功')
            that.selectedRowKeys = []
            that.search()
          })
        },
        onCancel () {
          that.selectedRowKeys = []
        }
      })
    },
    exportExcel () {
      let {sortedInfo, filteredInfo} = this
      let sortField, sortOrder, pageSize
      // 设置导出的数据为总数据条数
      if (this.pagination) {
        pageSize = this.pagination.total
      }
      // 获取当前列的排序和列的过滤规则
      if (sortedInfo) {
        // 列名
        sortField = sortedInfo.field
        // 排序方式 ascend正序 descend倒序
        sortOrder = sortedInfo.order
      }
      this.$export('fireExtinguisher/excel', {
        sortField: sortField,
        sortOrder: sortOrder,
        pageSize: pageSize,
        ...this.queryParams,
        ...filteredInfo
      })
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
      this.queryParams = {}
      if (this.advanced) {
        // 清空时间选择
        this.$refs.allotmentDate1.reset()
        this.$refs.allotmentDate2.reset()
        this.$refs.testDate1.reset()
        this.$refs.testDate2.reset()
      }
      this.fetch()
    },
    handleTableChange (pagination, filters, sorter) {
      // 将这三个参数赋值给Vue data，用于后续使用
      this.paginationInfo = pagination
      this.filteredInfo = filters
      this.sortedInfo = sorter

      this.fireExtinguisherInfo.visiable = false
      this.fetch({
        sortField: sorter.field,
        sortOrder: sorter.order,
        ...this.queryParams,
        ...filters
      })
    },
    // loadSelect () {
    //   this.$get('fireExtinguisher/carKind', {
    //   }).then((r) => {
    //     this.carKindData = r.data.filter(d => d)
    //   })
    //   this.$get('fireExtinguisher/carUse', {
    //   }).then((r) => {
    //     this.carUseData = r.data.filter(d => d)
    //   })
    // },
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
      this.$get('fireExtinguisher', {
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
