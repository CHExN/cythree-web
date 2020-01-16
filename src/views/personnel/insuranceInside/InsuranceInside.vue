<template>
  <a-card :bordered="false" class="card-area">
    <div :class="advanced ? 'search' : null">
      <a-form layout="horizontal">
        <a-row>
          <div :class="advanced ? null: 'fold'">
            <a-col :md="12" :sm="24" >
              <a-form-item
                label="姓名"
                :labelCol="{span: 5}"
                :wrapperCol="{span: 18, offset: 1}">
                <a-input v-model="queryParams.name"/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24" >
              <a-form-item
                label="身份证号"
                :labelCol="{span: 5}"
                :wrapperCol="{span: 18, offset: 1}">
                <a-input v-model="queryParams.idNum"/>
              </a-form-item>
            </a-col>
            <template v-if="advanced">
              <a-col :md="12" :sm="24" >
                <a-form-item
                  label="银行卡号"
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 18, offset: 1}">
                  <a-input v-model="queryParams.bankCardNumber"/>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24" >
                <a-form-item
                  label="社保医院"
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 18, offset: 1}">
                  <a-input v-model="queryParams.socialSecurityHospital"/>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24" >
                <a-form-item
                  label="在职与否"
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 18, offset: 1}">
                  <a-select v-model="queryParams.isLeave">
                    <a-select-option value="0,1">全部</a-select-option>
                    <a-select-option value="0">在职</a-select-option>
                    <a-select-option value="1">非在职</a-select-option>
                  </a-select>
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
        <a-button type="primary" ghost @click="add" v-hasPermission="'insuranceInside:add'">新增</a-button>
        <a-button @click="batchDelete" v-hasPermission="'insuranceInside:delete'">删除</a-button>
        <a-dropdown v-hasAnyPermission="'insuranceInside:export','insuranceInside:add'">
          <a-menu slot="overlay">
            <a-menu-item key="download-template" @click="downloadTemplate">模板下载</a-menu-item>
            <a-menu-item key="import-data" v-hasPermission="'insuranceInside:add'">
              <a-upload class="upload-area" :fileList="fileList" :beforeUpload="importExcel">导入Excel</a-upload>
            </a-menu-item>
            <a-menu-item v-hasPermission="'insuranceInside:export'" key="export-data" @click="exportExcel">导出Excel</a-menu-item>
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
        <template slot="operation" slot-scope="text, record">
          <a-icon v-hasPermission="'insuranceInside:update'" type="setting" theme="twoTone" twoToneColor="#4a9ff5" @click="edit(record)" title="修改"></a-icon>
          &nbsp;
          <a-icon v-hasPermission="'insuranceInside:view'" type="eye" theme="twoTone" twoToneColor="#42b983" @click="view(record)" title="查看"></a-icon>
        </template>
      </a-table>
    </div>
    <!-- 编内保险人员信息查看 -->
    <insurance-inside-info
      :insuranceInsideInfoData="insuranceInsideInfo.data"
      :insuranceInsideInfoVisiable="insuranceInsideInfo.visiable"
      @close="handleInsuranceInsideInfoClose">
    </insurance-inside-info>
    <!-- 新增编内保险人员 -->
    <insurance-inside-add
      :insuranceInsideAddVisiable="insuranceInsideAdd.visiable"
      @close="handleInsuranceInsideAddClose"
      @success="handleInsuranceInsideAddSuccess">
    </insurance-inside-add>
    <!-- 修改编内保险人员 -->
    <insurance-inside-edit
      ref="insuranceInsideEdit"
      :insuranceInsideEditVisiable="insuranceInsideEdit.visiable"
      @close="handleInsuranceInsideEditClose"
      @untied="handleInsuranceInsideEditUntied"
      @success="handleInsuranceInsideEditSuccess">
    </insurance-inside-edit>
    <!-- 导入结果 -->
    <insurance-inside-import-result
      @close="handleClose"
      :importData="importData"
      :errors="errors"
      :times="times"
      :insuranceInsideImportResultVisible="insuranceInsideImportResultVisible">
    </insurance-inside-import-result>
  </a-card>
</template>
<script>
import InsuranceInsideInfo from './InsuranceInsideInfo'
import InsuranceInsideAdd from './InsuranceInsideAdd'
import InsuranceInsideEdit from './InsuranceInsideEdit'
import InsuranceInsideImportResult from './InsuranceInsideImportResult'

export default {
  name: 'InsuranceInside',
  components: { InsuranceInsideInfo, InsuranceInsideAdd, InsuranceInsideEdit, InsuranceInsideImportResult },
  data () {
    return {
      fileList: [],
      importData: [],
      times: '',
      errors: [],
      insuranceInsideImportResultVisible: false,
      advanced: false,
      insuranceInsideInfo: {
        visiable: false,
        data: {}
      },
      insuranceInsideAdd: {
        visiable: false,
        data: {}
      },
      insuranceInsideEdit: {
        visiable: false,
        data: {}
      },
      queryParams: {
        isLeave: '0'
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
      return [{
        title: '序号',
        dataIndex: 'sortNum'
      }, {
        title: '姓名',
        dataIndex: 'name'
      }, {
        title: '身份证号',
        dataIndex: 'idNum'
      }, {
        title: '性别',
        dataIndex: 'gender',
        customRender: (text, row, index) => {
          switch (text) {
            case '0':
              return '女'
            case '1':
              return '男'
            default:
              return text
          }
        },
        filters: [
          { text: '女', value: '0' },
          { text: '男', value: '1' }
        ],
        filterMultiple: false
      }, {
        title: '户籍性质',
        dataIndex: 'householdRegistrationType',
        customRender: (text, row, index) => {
          switch (text) {
            case '0':
              return '外地农业'
            case '1':
              return '外地非农业'
            case '2':
              return '本地农业'
            case '3':
              return '本地非农业'
            default:
              return text
          }
        },
        filters: [
          { text: '外地农业', value: '0' },
          { text: '外地非农业', value: '1' },
          { text: '本地农业', value: '2' },
          { text: '本地非农业', value: '3' }
        ],
        filterMultiple: true
      }, {
        title: '类型',
        dataIndex: 'newTransfer',
        customRender: (text, row, index) => {
          switch (text) {
            case '0':
              return '新参'
            case '1':
              return '转入'
            default:
              return text
          }
        },
        filters: [
          { text: '新参', value: '0' },
          { text: '转入', value: '1' }
        ],
        filterMultiple: false
      }, {
        title: '养老保险',
        dataIndex: 'pensionInsuranceBase',
        customRender: (text, row, index) => {
          return this.$tools.addZero(text) || text
        }
      }, {
        title: '工伤保险',
        dataIndex: 'workInjuryInsuranceBase',
        customRender: (text, row, index) => {
          return this.$tools.addZero(text) || text
        }
      }, {
        title: '医疗保险',
        dataIndex: 'medicalInsuranceBase',
        customRender: (text, row, index) => {
          return this.$tools.addZero(text) || text
        }
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
      this.insuranceInsideImportResultVisible = false
    },
    downloadTemplate () {
      this.$download('insuranceInside/template', {}, '编内人员保险信息_导入模板.xlsx')
    },
    importExcel (file) {
      const formData = new FormData()
      formData.append('file', file)
      this.$message.loading('处理中', 0)
      this.$upload('insuranceInside/import', formData).then((r) => {
        let data = r.data.data
        if (data.data.length) {
          this.fetch()
        }
        this.$message.destroy()
        this.importData = data.data
        this.errors = data.error
        this.times = data.time / 1000
        this.insuranceInsideImportResultVisible = true
      }).catch((r) => {
        this.$message.destroy()
        console.error(r)
      })
      return false
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
      this.$export('insuranceInside/excel', {
        sortField: sortField,
        sortOrder: sortOrder,
        pageSize: pageSize,
        ...this.queryParams,
        ...filteredInfo
      })
    },
    onSelectChange (selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
      // 每次展开，把隐藏的内容清空
      if (!this.advanced) {
        this.queryParams.bankCardNumber = ''
        this.queryParams.socialSecurityHospital = ''
      }
    },
    view (record) {
      this.insuranceInsideInfo.data = record
      this.insuranceInsideInfo.visiable = true
    },
    add () {
      this.insuranceInsideAdd.visiable = true
    },
    handleInsuranceInsideAddClose () {
      this.insuranceInsideAdd.visiable = false
    },
    handleInsuranceInsideAddSuccess () {
      this.insuranceInsideAdd.visiable = false
      this.$message.success('新增编内保险人员成功')
      this.search()
    },
    edit (record) {
      this.$refs.insuranceInsideEdit.setFormValues(record)
      this.insuranceInsideEdit.visiable = true
    },
    handleInsuranceInsideEditClose () {
      this.insuranceInsideEdit.visiable = false
    },
    handleInsuranceInsideEditUntied () {
      this.search()
    },
    handleInsuranceInsideEditSuccess () {
      this.insuranceInsideEdit.visiable = false
      this.$message.success('修改编内保险人员成功')
      this.search()
    },
    handleInsuranceInsideInfoClose () {
      this.insuranceInsideInfo.visiable = false
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
          that.$delete('insuranceInside/' + that.selectedRowKeys.join(',')).then(() => {
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
    // exportExcel () {
    //   let {sortedInfo, filteredInfo} = this
    //   let sortField, sortOrder, pageSize
    //   // 设置导出的数据为总数据条数
    //   if (this.pagination) {
    //     pageSize = this.pagination.total
    //   }
    //   // 获取当前列的排序和列的过滤规则
    //   if (sortedInfo) {
    //     // 列名
    //     sortField = sortedInfo.field
    //     // 排序方式 ascend正序 descend倒序
    //     sortOrder = sortedInfo.order
    //   }
    //   this.$export('insuranceInside/excel', {
    //     sortField: sortField,
    //     sortOrder: sortOrder,
    //     pageSize: pageSize,
    //     ...this.queryParams,
    //     ...filteredInfo
    //   })
    // },
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
      this.queryParams = {
        isLeave: '0'
      }
      this.fetch()
    },
    handleTableChange (pagination, filters, sorter) {
      // 将这三个参数赋值给Vue data，用于后续使用
      this.paginationInfo = pagination
      this.filteredInfo = filters
      this.sortedInfo = sorter

      this.insuranceInsideInfo.visiable = false
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
      this.$get('insuranceInside', {
        ...params,
        isLeave: this.queryParams.isLeave
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
