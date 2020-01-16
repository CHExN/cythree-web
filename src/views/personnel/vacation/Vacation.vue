<template>
  <a-card :bordered="false" class="card-area">
    <div :class="advanced ? 'search' : null">
      <a-form layout="horizontal">
        <a-row>
          <div :class="advanced ? null: 'fold'">
            <a-col :md="12" :sm="24" >
              <a-form-item
                label="编制类别"
                :labelCol="{span: 5}"
                :wrapperCol="{span: 18, offset: 1}">
                <a-select v-model="insOut">
                  <!-- 这里不能加 ‘全部’ 选项 因为后台不支持 -->
                  <a-select-option value="0">编内</a-select-option>
                  <a-select-option value="1">编外</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24" >
              <a-form-item
                label="日期"
                :labelCol="{span: 5}"
                :wrapperCol="{span: 18, offset: 1}">
                <range-date
                  @change="handleDateChange"
                  ref="createTime">
                </range-date>
              </a-form-item>
            </a-col>
            <template v-if="advanced">
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
                  label="休假类型"
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 18, offset: 1}">
                  <a-select
                    mode="multiple"
                    :allowClear="true"
                    @change="handleTypeChange">
                    <a-select-option v-for="i in filteredTypeOptions" :key="i">{{ i }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24" >
                <a-form-item
                  label="是否为假期"
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 18, offset: 1}">
                  <a-select v-model="queryParams.isVacation">
                    <a-select-option value="0">是</a-select-option>
                    <a-select-option value="1">不是</a-select-option>
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
        <a-button type="primary" ghost @click="add" v-hasPermission="'vacation:add'">新增</a-button>
        <a-button @click="batchDelete" v-hasPermission="'vacation:delete'">删除</a-button>
        <a-dropdown>
          <a-menu slot="overlay">
            <a-menu-item key="inside-annual-leave" @click="showModal(2)">编内年假统计</a-menu-item>
            <a-menu-item key="inside-vacation" @click="showModal(0)">编内休假统计</a-menu-item>
            <a-menu-item key="outside-vacation" @click="showModal(1)">编外休假统计</a-menu-item>
          </a-menu>
          <a-button>
            更多操作 <a-icon type="down" />
          </a-button>
        </a-dropdown>
        &nbsp;
        <a-modal
          title="选择查看年份"
          v-model="modalVisible"
          :mask="false"
          :maskClosable="false"
          :width='350'
          style="left: -12%;top: 25%"
          @ok="view"
          okText="提交">
          <a-select
            v-model="yearValue"
            style="width: 100%;">
            <a-select-option v-for="i in 20" :key="2008 + i">{{ `${2008 + i}年` }}</a-select-option>
          </a-select>
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
        <template slot="remark" slot-scope="text">
          <a-popover placement="topLeft">
            <template slot="content">
              <div>{{text}}</div>
            </template>
            <p style="width: 150px;margin-bottom: 0">{{text}}</p>
          </a-popover>
        </template>
        <template slot="operation" slot-scope="text, record">
          <a-icon v-hasPermission="'vacation:update'" type="setting" theme="twoTone" twoToneColor="#4a9ff5" @click="edit(record)" title="修改"></a-icon>
        </template>
      </a-table>
    </div>
    <!-- 新增人员休假 -->
    <vacation-add
      :typeData="typeData"
      :vacationAddVisiable="vacationAdd.visiable"
      @close="handleVacationAddClose"
      @success="handleVacationAddSuccess">
    </vacation-add>
    <!-- 修改人员休假 -->
    <vacation-edit
      ref="vacationEdit"
      :typeData="typeData"
      :vacationEditVisiable="vacationEdit.visiable"
      @close="handleVacationEditClose"
      @success="handleVacationEditSuccess">
    </vacation-edit>
    <!-- 人员休假统计详情 -->
    <vacation-info
      :viewType="viewType"
      :yearValue="yearValue"
      :vacationInfoVisiable="vacationInfo.visiable"
      @close="handleVacationInfoClose">
    </vacation-info>
    <!-- 编内年假统计信息 -->
    <inside-annual-leave
      :yearValue="yearValue"
      :insideAnnualLeaveVisiable="insideAnnualLeave.visiable"
      @close="handleInsideAnnualLeaveClose">
    </inside-annual-leave>
  </a-card>
</template>
<script>
import VacationAdd from './VacationAdd'
import VacationEdit from './VacationEdit'
import VacationInfo from './VacationInfo'
import InsideAnnualLeave from './InsideAnnualLeave'
import RangeDate from '@/components/datetime/RangeDate'

export default {
  name: 'Vacation',
  components: { VacationAdd, VacationEdit, VacationInfo, InsideAnnualLeave, RangeDate },
  data () {
    return {
      viewType: 0,
      modalVisible: false,
      yearValue: new Date().getFullYear(),
      insOut: '0',
      advanced: false,
      vacationAdd: {
        visiable: false,
        data: {}
      },
      vacationEdit: {
        visiable: false,
        data: {}
      },
      vacationInfo: {
        visiable: false
      },
      insideAnnualLeave: {
        visiable: false
      },
      typeData: [],
      queryParams: {
        type: []
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
    filteredTypeOptions () {
      return this.typeData.filter(o => !this.queryParams.type.includes(o))
    },
    columns () {
      return [{
        title: '姓名',
        dataIndex: 'name'
      }, {
        title: '编制类别',
        dataIndex: 'insOut',
        customRender: (text, row, index) => {
          switch (text) {
            case '0':
              return '编内'
            case '1':
              return '编外'
            default:
              return text
          }
        }
      }, {
        title: '休假类型',
        dataIndex: 'type'
      }, {
        title: '天数',
        dataIndex: 'day'
      // }, {
      //   title: '休假日期',
      //   dataIndex: 'date'
      }, {
        title: '备注',
        dataIndex: 'remark'
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
  },
  methods: {
    view () {
      this.modalVisible = false
      if (this.viewType === 2) {
        this.insideAnnualLeave.visiable = true
      } else if (this.viewType === 0 || this.viewType === 1) {
        this.vacationInfo.visiable = true
      }
    },
    showModal (value) {
      this.viewType = value || 0
      this.modalVisible = true
    },
    onSelectChange (selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
      // 每次展开，把隐藏的内容清空
      if (!this.advanced) {
        this.queryParams.type = ''
        this.queryParams.createTimeFrom = ''
        this.queryParams.createTimeTo = ''
      }
    },
    add () {
      this.vacationAdd.visiable = true
    },
    handleVacationAddClose () {
      this.vacationAdd.visiable = false
    },
    handleVacationAddSuccess () {
      this.vacationAdd.visiable = false
      this.$message.success('新增人员休假成功')
      this.search()
    },
    edit (record) {
      this.$refs.vacationEdit.setFormValues(record)
      this.vacationEdit.visiable = true
    },
    handleVacationEditClose () {
      this.vacationEdit.visiable = false
    },
    handleVacationEditSuccess () {
      this.vacationEdit.visiable = false
      this.$message.success('修改人员休假成功')
      this.search()
    },
    handleVacationInfoClose () {
      this.vacationInfo.visiable = false
    },
    handleInsideAnnualLeaveClose () {
      this.insideAnnualLeave.visiable = false
    },
    handleTypeChange (value) {
      this.queryParams.type = value || ''
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
          that.$delete('vacation/' + that.selectedRowKeys.join(',')).then(() => {
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
        type: []
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
    loadSelect () {
      this.$get('vacation/getType', {
      }).then((r) => {
        this.typeData = r.data
        this.fetch()
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
      this.$get('vacation', {
        insOut: this.insOut,
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
