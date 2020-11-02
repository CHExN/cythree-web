<template>
  <a-card :bordered="false" class="card-area">
    <div :class="advanced ? 'search' : null">
      <a-form layout="horizontal">
        <a-row>
          <div :class="advanced ? null: 'fold'">
            <!-- <a-col :md="12" :sm="24" >
              <a-form-item
                label="编制类别"
                :labelCol="{span: 5}"
                :wrapperCol="{span: 18, offset: 1}">
                <a-select v-model="insOut">
                  <a-select-option value="2">全部</a-select-option>
                  <a-select-option value="0">编内</a-select-option>
                  <a-select-option value="1">编外</a-select-option>
                </a-select>
              </a-form-item>
            </a-col> -->
            <a-col :md="12" :sm="24" >
              <a-form-item
                label="姓名"
                :labelCol="{span: 5}"
                :wrapperCol="{span: 18, offset: 1}">
                <a-input v-model="queryParams.staffName"/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24" >
              <a-form-item
                label="月份"
                :labelCol="{span: 5}"
                :wrapperCol="{span: 18, offset: 1}">
                <a-month-picker
                  v-model="queryParams.nowMonth"
                  style="width: 100%;"
                  :allowClear="false"
                />
              </a-form-item>
            </a-col>
            <template v-if="advanced">
              <a-col :md="12" :sm="24" >
                <a-form-item
                  label="身份证号"
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 18, offset: 1}">
                  <a-input v-model="queryParams.staffIdCard"/>
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
              <a-col :md="12" :sm="24" >
                <a-form-item
                  label="岗位级别"
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 18, offset: 1}">
                  <a-select
                    mode="multiple"
                    :allowClear="true"
                    @change="handlePostLevelChange">
                    <a-select-option v-for="i in filteredPostLevelOptions" :key="i">{{ i }}</a-select-option>
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
        <a-button type="primary" ghost @click="add" v-hasPermission="'wage:add'">新增</a-button>
        <a-button @click="batchDelete" v-hasPermission="'wage:delete'">删除</a-button>
        <a-dropdown>
          <a-menu slot="overlay">
            <a-menu-item key="download-template" @click="downloadTemplate">模板下载</a-menu-item>
            <a-menu-item key="import-data" v-hasPermission="'wage:add'">
              <a-upload class="upload-area" :fileList="fileList" :beforeUpload="beforeUpload">导入Excel</a-upload>
            </a-menu-item>
            <a-menu-item v-hasPermission="'wage:export'" key="export-data" @click="exportExcel">导出Excel</a-menu-item>
            <a-menu-item v-hasPermission="'wageRemark:view'" key="wage-remark" @click="onWageRemark">工资备注</a-menu-item>
            <a-menu-item v-hasPermission="'wage:delete'" key="delete-all-wage" @click="deleteAll">删除本月全部</a-menu-item>
          </a-menu>
          <a-button>
            更多操作 <a-icon type="down" />
          </a-button>
        </a-dropdown>
        &nbsp;
        <a-modal
          title="选择月份"
          v-model="modalVisible"
          :mask="false"
          :maskClosable="false"
          :width='350'
          style="left: -12%;top: 25%"
          @ok="importExcel"
          okText="提交">
          <a-month-picker
            style="width: 100%;"
            @change="handleYearMonthChange"
          />
        </a-modal>
        <a-modal
          title="选择导出日期"
          :mask="false"
          :maskClosable="false"
          :width='350'
          style="left: -12%;top: 25%"
          @ok="exportExcel"
          okText="提交">
          <a-month-picker style="width: 100%;"/>
        </a-modal>
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
        <template slot="wageNum" slot-scope="text, record">
          <a-tag :color="record.color==='1'?'orange':'blue'" style="font-size:100%">{{text}}</a-tag>
        </template>
        <template slot="operation" slot-scope="text, record">
          <a-icon v-hasPermission="'wage:update'" type="setting" theme="twoTone" twoToneColor="#4a9ff5" @click="edit(record)" title="修改"></a-icon>
          &nbsp;
          <a-icon v-hasPermission="'wage:view'" type="eye" theme="twoTone" twoToneColor="#42b983" @click="view(record)" title="查看"></a-icon>
        </template>
      </a-table>
    </div>
    <!-- 新增编内工资信息 -->
    <wage-add
      :wageAddVisiable="wageAdd.visiable"
      @close="handleWageAddClose"
      @success="handleWageAddSuccess">
    </wage-add>
    <!-- 修改编内工资信息 -->
    <wage-edit
      ref="wageEdit"
      :wageEditVisiable="wageEdit.visiable"
      @close="handleWageEditClose"
      @success="handleWageEditSuccess">
    </wage-edit>
    <!-- 编内工资详细信息 -->
    <wage-info
      :wageInfoData="wageInfo.data"
      :wageInfoVisiable="wageInfo.visiable"
      @close="handleWageInfoClose">
    </wage-info>
    <!-- 导入结果 -->
    <import-result
      @close="handleClose"
      :importData="importData"
      :errors="errors"
      :times="times"
      :successColumns="successColumns"
      :importResultVisible="importResultVisible">
    </import-result>
    <!-- 编内工资备注管理 -->
    <wage-remark
      :wageRemarkVisiable="wageRemark.visiable"
      :insideOrOutside="'0'"
      @close="handleWageRemarkClose">
    </wage-remark>
  </a-card>
</template>
<script>
import WageAdd from './WageAdd'
import WageEdit from './WageEdit'
import WageInfo from './WageInfo'
import ImportResult from '@/components/view/ImportResult'
import WageRemark from '../wageRemark/WageRemark'
import moment from 'moment'
moment.locale('zh-cn')

export default {
  name: 'Wage',
  components: { WageAdd, WageEdit, WageInfo, ImportResult, WageRemark },
  data () {
    return {
      // insOut: '0',
      monthData: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
      modalVisible: false,
      fileList: [],
      file: '',
      importData: [],
      times: '',
      errors: [],
      successColumns: [],
      importResultVisible: false,
      advanced: false,
      wageAdd: {
        visiable: false,
        data: {}
      },
      wageEdit: {
        visiable: false,
        data: {}
      },
      wageInfo: {
        visiable: false,
        data: {}
      },
      dateData: {
        dateForm: {},
        dateTo: {}
      },
      wageRemark: {
        visiable: false
      },
      postLevelData: [],
      queryParams: {
        postLevel: [],
        nowMonth: moment(),
        isLeave: '0,1'
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
    filteredPostLevelOptions () {
      return this.postLevelData.filter(o => !this.queryParams.postLevel.includes(o))
    },
    columns () {
      return [{
        title: '序号',
        dataIndex: 'sortNum',
        width: '6%'
      }, {
        title: '姓名',
        dataIndex: 'staffName'
      }, {
        title: '证照号码',
        dataIndex: 'staffIdCard',
        width: '16%'
      }, {
        title: '岗位等级',
        dataIndex: 'postLevel'
      }, {
        title: '岗位工资',
        dataIndex: 'currentIncomeSum'
      }, {
        title: '应发工资',
        dataIndex: 'payableSum'
      }, {
        title: '实发工资',
        dataIndex: 'realWageSum'
      }, {
        title: '月份',
        dataIndex: 'year',
        customRender: (text, row, index) => {
          return `${text}-${row.month}`
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
    this.loadSelect()
    this.fetch({...this.queryParams})
  },
  methods: {
    handleClose () {
      this.importResultVisible = false
    },
    downloadTemplate () {
      this.$download('wage/template', {}, '编内工资表_导入模板.xlsx')
    },
    beforeUpload (file) {
      this.modalVisible = true
      this.file = file
      return false
    },
    importExcel () {
      if (!this.dateData.dateTo.year || !this.dateData.dateTo.month) {
        this.$message.warning('请选择月份')
        return
      }
      this.modalVisible = false
      const formData = new FormData()
      formData.append('file', this.file)
      formData.append('date', `${this.dateData.dateTo.year}-${this.dateData.dateTo.month}`)
      this.$message.loading('处理中', 0)
      this.$upload('wage/import', formData).then((r) => {
        let data = r.data.data
        if (data.data.length) {
          this.search()
        }
        this.file = ''
        this.$message.destroy()
        this.importData = data.data
        this.errors = data.error
        this.times = data.time / 1000
        this.successColumns = [{
          title: '姓名',
          dataIndex: 'staffName'
        }, {
          title: '月份',
          dataIndex: 'year',
          customRender: (text, row, index) => {
            return `${text}-${row.month}`
          }
        }, {
          title: '插入时间',
          dataIndex: 'createTime',
          customRender: (text, row, index) => {
            return this.$tools.getDateTime(text)
          }
        }]
        this.importResultVisible = true
      }).catch((r) => {
        this.file = ''
        this.$message.destroy()
        console.error(r)
      })
    },
    handleYearMonthChange (value) {
      if (!value) {
        this.dateData.dateTo = {}
        return
      }
      this.dateData.dateTo = {
        year: value.format('YYYY'),
        month: value.format('MM')
      }
    },
    onSelectChange (selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
      // 每次展开，把隐藏的内容清空
      if (!this.advanced) {
        this.queryParams.staffIdCard = ''
        this.queryParams.postLevel = ''
      }
    },
    add () {
      this.wageAdd.visiable = true
    },
    handleWageAddClose () {
      this.wageAdd.visiable = false
    },
    handleWageAddSuccess () {
      this.wageAdd.visiable = false
      this.$message.success('新增编内工资信息成功')
      this.search()
    },
    edit (record) {
      this.$refs.wageEdit.setFormValues(record)
      this.wageEdit.visiable = true
    },
    handleWageEditClose () {
      this.wageEdit.visiable = false
    },
    handleWageEditSuccess () {
      this.wageEdit.visiable = false
      this.$message.success('修改编内工资信息成功')
      this.search()
    },
    view (record) {
      console.log(record)
      this.wageInfo.data = record
      this.wageInfo.data.monthArr = this.monthData.slice(0, this.monthData.indexOf(record.month) + 1).join()
      this.wageInfo.visiable = true
    },
    handleWageInfoClose () {
      this.wageInfo.visiable = false
    },
    handlePostLevelChange (value) {
      this.queryParams.postLevel = value || ''
    },
    onWageRemark () {
      this.wageRemark.visiable = true
    },
    handleWageRemarkClose () {
      this.wageRemark.visiable = false
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
          that.$delete('wage/' + that.selectedRowKeys.join(',')).then(() => {
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
    deleteAll () {
      let that = this
      const year = that.queryParams.nowMonth.format('YYYY')
      const month = that.queryParams.nowMonth.format('MM')
      this.$confirm({
        title: `确定删除${year}年${month}月的全部记录?`,
        content: '当您点击确定按钮后，这些记录将会被彻底删除',
        centered: true,
        onOk () {
          that.$delete('wage/deleteAll', { year, month }).then(() => {
            that.$message.success('删除成功')
            that.search()
          })
        }
      })
    },
    exportExcel () {
      let { sortedInfo, filteredInfo } = this
      let sortField, sortOrder, pageSize, params
      params = {...this.queryParams}
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
      if (params.nowMonth) {
        params.year = params.nowMonth.format('YYYY')
        params.month = params.nowMonth.format('MM')
        params.monthArr = this.monthData.slice(0, this.monthData.indexOf(params.month) + 1).join()
        delete params.nowMonth
      }
      this.$export('wage/excel', {
        sortField: sortField,
        sortOrder: sortOrder,
        pageSize: pageSize,
        ...params,
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
      this.queryParams = {
        postLevel: [],
        nowMonth: moment(),
        isLeave: '0,1'
      }
      this.fetch({...this.queryParams})
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
    loadSelect () {
      this.$get('staffInside/getPostLevel', {}).then((r) => {
        this.postLevelData = r.data.filter(d => d)
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
      if (params.nowMonth) {
        params.year = params.nowMonth.format('YYYY')
        params.month = params.nowMonth.format('MM')
        params.monthArr = this.monthData.slice(0, this.monthData.indexOf(params.month) + 1).join()
        delete params.nowMonth
      }
      this.$get('wage', {
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
