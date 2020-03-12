<template>
  <a-card :bordered="false" class="card-area">
    <div :class="advanced ? 'search' : null">
      <a-form layout="horizontal">
        <a-row>
          <div :class="advanced ? null: 'fold'">
            <a-col :md="12" :sm="24" >
              <a-form-item
                label="使用部门"
                :labelCol="{span: 5}"
                :wrapperCol="{span: 18, offset: 1}">
                <a-input v-model="queryParams.useDeptName"/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24" >
              <a-form-item
                label="使用人"
                :labelCol="{span: 5}"
                :wrapperCol="{span: 18, offset: 1}">
                <a-input v-model="queryParams.user"/>
              </a-form-item>
            </a-col>
            <template v-if="advanced">
              <a-col :md="12" :sm="24" >
                <a-form-item
                  label="车牌号"
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 18, offset: 1}">
                  <a-input v-model="queryParams.carNumber"/>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24" >
                <a-form-item
                  label="车辆品牌"
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 18, offset: 1}">
                  <a-input v-model="queryParams.carBrands"/>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24" >
                <a-form-item
                  label="车辆类型"
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 18, offset: 1}">
                  <a-input v-model="queryParams.carType"/>
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
        <a-button type="primary" ghost @click="add" v-hasPermission="'carElectric:add'">新增</a-button>
        <a-button @click="batchDelete" v-hasPermission="'carElectric:delete'">删除</a-button>
        <!-- <a-button @click="exportExcel" v-hasPermission="'carElectric:export'">导出Excel</a-button> -->
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
          <a-icon v-hasPermission="'carElectric:update'" type="setting" theme="twoTone" twoToneColor="#4a9ff5" @click="edit(record)" title="修改"></a-icon>
          &nbsp;
          <a-icon v-hasPermission="'carElectric:view'" type="eye" theme="twoTone" twoToneColor="#42b983" @click="view(record)" title="查看"></a-icon>
          <a-badge v-hasNoPermission="'carElectric:update','carElectric:view'" status="warning" text="无权限"></a-badge>
        </template>
      </a-table>
    </div>
    <!-- 电动三轮车信息查看 -->
    <car-electric-three-info
      :carElectricThreeInfoData="carElectricThreeInfo.data"
      :carElectricThreeInfoVisiable="carElectricThreeInfo.visiable"
      @close="handleCarElectricThreeInfoClose">
    </car-electric-three-info>
    <!-- 新增电动三轮车 -->
    <car-electric-three-add
      :carElectricThreeAddVisiable="carElectricThreeAdd.visiable"
      @close="handleCarElectricThreeAddClose"
      @success="handleCarElectricThreeAddSuccess">
    </car-electric-three-add>
    <!-- 修改电动三轮车 -->
    <car-electric-three-edit
      ref="carElectricThreeEdit"
      :carElectricThreeEditVisiable="carElectricThreeEdit.visiable"
      @close="handleCarElectricThreeEditClose"
      @success="handleCarElectricThreeEditSuccess">
    </car-electric-three-edit>
  </a-card>
</template>
<script>
import CarElectricThreeInfo from './CarElectricThreeInfo'
import CarElectricThreeAdd from './CarElectricThreeAdd'
import CarElectricThreeEdit from './CarElectricThreeEdit'

export default {
  name: 'CarElectricThree',
  components: {CarElectricThreeInfo, CarElectricThreeAdd, CarElectricThreeEdit},
  data () {
    return {
      advanced: false,
      carElectricThreeInfo: {
        visiable: false,
        data: {}
      },
      carElectricThreeAdd: {
        visiable: false,
        data: {}
      },
      carElectricThreeEdit: {
        visiable: false,
        data: {}
      },
      // carKindData: [],
      // carUseData: [],
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
    // filteredKindOptions () {
    //   return this.carKindData.filter(o => !this.queryParams.carKind.includes(o))
    // },
    // filteredUseOptions () {
    //   return this.carUseData.filter(o => !this.queryParams.carUse.includes(o))
    // },
    columns () {
      // 受控属性
      let { sortedInfo, filteredInfo } = this
      sortedInfo = sortedInfo || {}
      filteredInfo = filteredInfo || {}
      return [{
        title: '车辆类型',
        dataIndex: 'carType',
        scopedSlots: { customRender: 'carType' },
        sorter: true,
        sortOrder: sortedInfo.columnKey === 'carType' && sortedInfo.order
      }, {
        title: '车辆品牌',
        dataIndex: 'carBrands'
      }, {
        title: '车牌号',
        dataIndex: 'carNumber'
      }, {
        title: '使用人',
        dataIndex: 'user'
      }, {
        title: '使用部门',
        dataIndex: 'useDeptName'
      }, {
        title: '状态',
        dataIndex: 'status',
        customRender: (text, row, index) => {
          switch (text) {
            case '1':
              return <a-badge status="success" text="正常"/>
            case '2':
              return <a-badge status="default" text="损坏"/>
            default:
              return text
          }
        },
        // filters 属性指定需要筛选菜单的列
        filters: [
          { text: '正常', value: '1' },
          { text: '损坏', value: '2' }
        ],
        // filterMultiple 用于指定多选和单选(true多/false单)
        filterMultiple: false,
        filteredValue: filteredInfo.status || null,
        // onFilter 用于筛选当前数据
        onFilter: (value, record) => record.status.includes(value)
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
    // this.loadSelect()
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
        this.queryParams.carNumber = ''
        this.queryParams.carBrands = ''
        this.queryParams.carType = ''
      }
    },
    view (record) {
      this.carElectricThreeInfo.data = record
      this.carElectricThreeInfo.visiable = true
    },
    add () {
      this.carElectricThreeAdd.visiable = true
    },
    handleCarElectricThreeAddClose () {
      this.carElectricThreeAdd.visiable = false
    },
    handleCarElectricThreeAddSuccess () {
      this.carElectricThreeAdd.visiable = false
      this.$message.success('新增电动三轮车成功')
      this.search()
    },
    edit (record) {
      this.$refs.carElectricThreeEdit.setFormValues(record)
      this.carElectricThreeEdit.visiable = true
    },
    handleCarElectricThreeEditClose () {
      this.carElectricThreeEdit.visiable = false
    },
    handleCarElectricThreeEditSuccess () {
      this.carElectricThreeEdit.visiable = false
      this.$message.success('修改电动三轮车成功')
      this.search()
    },
    handleCarElectricThreeInfoClose () {
      this.carElectricThreeInfo.visiable = false
    },
    // handleKindChange (value) {
    //   this.queryParams.carKind = value || ''
    // },
    // handleUseChange (value) {
    //   this.queryParams.carUse = value || ''
    // },
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
          that.$delete('carElectric/' + that.selectedRowKeys.join(',')).then(() => {
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
    //   this.$export('carElectricThree/excel', {
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
      this.queryParams = {}
      this.fetch()
    },
    handleTableChange (pagination, filters, sorter) {
      // 将这三个参数赋值给Vue data，用于后续使用
      this.paginationInfo = pagination
      this.filteredInfo = filters
      this.sortedInfo = sorter

      this.carElectricThreeInfo.visiable = false
      this.fetch({
        sortField: sorter.field,
        sortOrder: sorter.order,
        ...this.queryParams,
        ...filters
      })
    },
    // loadSelect () {
    //   this.$get('carElectricThree/carKind', {
    //   }).then((r) => {
    //     this.carKindData = r.data.filter(d => d)
    //   })
    //   this.$get('carElectricThree/carUse', {
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
      this.$get('carElectric', {
        ...params,
        ifThree: 1 // 是否是三轮
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
