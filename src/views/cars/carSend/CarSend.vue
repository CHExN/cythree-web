<template>
  <a-card :bordered="false" class="card-area">
    <div :class="advanced ? 'search' : null">
      <a-form layout="horizontal">
        <a-row>
          <div :class="advanced ? null: 'fold'">
            <a-col :md="12" :sm="24" >
              <a-form-item
                label="车牌号"
                :labelCol="{span: 5}"
                :wrapperCol="{span: 18, offset: 1}">
                <a-input v-model="queryParams.carNum"/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24" >
              <a-form-item
                label="部门"
                :labelCol="{span: 5}"
                :wrapperCol="{span: 18, offset: 1}">
                <a-tree-select
                  :allowClear="true"
                  :dropdownStyle="{ maxHeight: '220px', overflow: 'auto' }"
                  :treeData="deptTreeData"
                  @change="handleDeptChange">
                </a-tree-select>
              </a-form-item>
            </a-col>
            <template v-if="advanced">
              <a-col :md="12" :sm="24" >
                <a-form-item
                  label="司机"
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 18, offset: 1}">
                  <a-input v-model="queryParams.driver"/>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24" >
                <a-form-item
                  label="事由"
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 18, offset: 1}">
                  <a-input v-model="queryParams.remark"/>
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
        <a-button type="primary" ghost @click="add" v-hasPermission="'carSend:add'">新增</a-button>
        <a-button @click="batchDelete" v-hasPermission="'carSend:delete'">删除</a-button>
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
        <template slot="carNum" slot-scope="text, record">
          <a-tag v-if="text" :color="record.color==='1'?'orange':'blue'" style="font-size:100%">{{text}}</a-tag>
          <span v-else>- -</span>
        </template>
        <template slot="operation" slot-scope="text, record">
          <a-icon v-hasPermission="'carSend:update'" type="setting" theme="twoTone" twoToneColor="#4a9ff5" @click="edit(record)" title="修改"></a-icon>
          &nbsp;
          <a-icon v-hasPermission="'carSend:view'" type="eye" theme="twoTone" twoToneColor="#42b983" @click="view(record)" title="查看"></a-icon>
          <a-badge v-hasNoPermission="'carSend:update','carSend:view'" status="warning" text="无权限"></a-badge>
        </template>
      </a-table>
    </div>
    <!-- 新增派车 -->
    <car-send-add
      :carSendAddVisiable="carSendAdd.visiable"
      @close="handleCarSendAddClose"
      @success="handleCarSendAddSuccess">
    </car-send-add>
    <!-- 派车信息查看 -->
    <car-send-info
      :carSendInfoData="carSendInfo.data"
      :carSendInfoVisiable="carSendInfo.visiable"
      @close="handleCarSendInfoClose">
    </car-send-info>
    <!-- 修改派车 -->
    <car-send-edit
      ref="carSendEdit"
      :carSendEditVisiable="carSendEdit.visiable"
      @close="handleCarSendEditClose"
      @success="handleCarSendEditSuccess">
    </car-send-edit>
  </a-card>
</template>
<script>
import CarSendAdd from './CarSendAdd'
import CarSendEdit from './CarSendEdit'
import CarSendInfo from './CarSendInfo'

export default {
  name: 'CarSend',
  components: { CarSendAdd, CarSendEdit, CarSendInfo },

  data () {
    return {
      advanced: false,
      carSendAdd: {
        visiable: false
      },
      carSendEdit: {
        visiable: false
      },
      carSendInfo: {
        visiable: false,
        data: {}
      },
      queryParams: {},
      filteredInfo: null,
      sortedInfo: null,
      paginationInfo: null,
      dataSource: [],
      selectedRowKeys: [],
      deptTreeData: [],
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
      let { filteredInfo } = this
      filteredInfo = filteredInfo || {}
      return [{
        title: '事由',
        dataIndex: 'remark',
        scopedSlots: { customRender: 'remark' },
        width: 300
      }, {
        title: '部门',
        dataIndex: 'deptName'
      }, {
        title: '状态',
        dataIndex: 'status',
        customRender: (text, row, index) => {
          switch (text) {
            case '0':
              return <a-badge status="default" text="未派车"/>
            case '1':
              return <a-badge status="success" text="已派车"/>
            default:
              return text
          }
        },
        // filters 属性指定需要筛选菜单的列
        filters: [
          { text: '未派车', value: '0' },
          { text: '已派车', value: '1' }
        ],
        // filterMultiple 用于指定多选和单选(true多/false单)
        filterMultiple: false,
        filteredValue: filteredInfo.status || null,
        // onFilter 用于筛选当前数据
        onFilter: (value, record) => record.status.includes(value)
      }, {
        title: '司机',
        dataIndex: 'driver',
        customRender: (text, row, index) => {
          return text || '- -'
        }
      }, {
        title: '车牌号',
        dataIndex: 'carNum',
        scopedSlots: { customRender: 'carNum' }
      }, {
        title: '创建时间',
        dataIndex: 'createTime',
        customRender: (text, row, index) => {
          return text.replace(/T/, ' ')
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
    this.fetch()
  },
  methods: {
    onSelectChange (selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
      // 每次展开，把隐藏的内容清空
      if (!this.advanced) {
        this.queryParams.driver = ''
        this.queryParams.remark = ''
      }
    },
    add () {
      this.carSendAdd.visiable = true
    },
    handleCarSendAddClose () {
      this.carSendAdd.visiable = false
    },
    handleCarSendAddSuccess () {
      this.carSendAdd.visiable = false
      this.$message.success('新增派车成功')
      this.search()
    },
    edit (record) {
      this.$refs.carSendEdit.setFormValues(record)
      this.carSendEdit.visiable = true
    },
    handleCarSendEditClose () {
      this.carSendEdit.visiable = false
    },
    handleCarSendEditSuccess () {
      this.carSendEdit.visiable = false
      this.$message.success('修改派车成功')
      this.search()
    },
    view (record) {
      this.carSendInfo.data = record
      this.carSendInfo.visiable = true
    },
    handleCarSendInfoClose () {
      this.carSendInfo.visiable = false
    },
    handleDeptChange (value) {
      this.queryParams.deptId = value || ''
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
          that.$delete('carSend/' + that.selectedRowKeys.join(',')).then(() => {
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
      this.queryParams = {}
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
      this.$get('dept').then((r) => {
        this.deptTreeData = r.data.rows.children
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
      this.$get('carSend', {
        ...params
      }).then((r) => {
        let data = r.data
        const pagination = { ...this.pagination }
        pagination.total = data.total
        this.dataSource = data.rows
        this.pagination = pagination
        this.loading = false
      })
    }
  }
}
</script>
<style lang="less" scoped>
@import "../../../../static/less/Common";
</style>
