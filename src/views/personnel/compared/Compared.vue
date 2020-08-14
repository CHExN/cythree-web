<template>
  <a-card :bordered="false" class="card-area">
    <div :class="advanced ? 'search' : null">
      <a-form layout="horizontal">
        <a-row>
          <div :class="advanced ? null: 'fold'">
            <a-col :md="12" :sm="24" >
              <a-form-item
                label="模块1"
                :labelCol="{span: 5}"
                :wrapperCol="{span: 18, offset: 1}">
                <a-select @change="handleC1Change" option-label-prop="label">
                  <a-select-option v-for="(i, index) in basisList" :key="index" :label="i.tableCnName">
                    {{i.tableCnName}}
                    <span v-for="v in i.staffType.split(',')" :key="v" style="float: right;">
                      <a-tag :color="getTagByStaffType(v)['color']">{{getTagByStaffType(v)['name']}}</a-tag>
                    </span>
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24" >
              <a-form-item
                label="模块2"
                :labelCol="{span: 5}"
                :wrapperCol="{span: 18, offset: 1}">
                <a-select @change="handleC2Change" option-label-prop="label">
                  <a-select-option v-for="(i, index) in notBasisList" :key="index" :label="i.tableCnName">
                    {{i.tableCnName}}
                    <span v-for="v in i.staffType.split(',')" :key="v" style="float: right;">
                      <a-tag :color="getTagByStaffType(v)['color']">{{getTagByStaffType(v)['name']}}</a-tag>
                    </span>
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <template v-if="advanced">
              <a-col :md="12" :sm="24" >
                <a-form-item
                  label="离职人员"
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 18, offset: 1}">
                  <a-radio-group v-model="isBasis">
                    <a-radio-button :value="false">不比较</a-radio-button>
                    <a-radio-button :value="true">比较</a-radio-button>
                  </a-radio-group>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24" v-if="queryParams.c2.month && queryParams.c2.month !== '0'">
                <a-form-item
                  label="月份选择"
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 18, offset: 1}">
                  <a-month-picker :style="{width: '100%'}" v-model="queryParams.c2.month"/>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24" v-if="queryParams.c2.input === '1'">
                <a-form-item
                  label="编内外"
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 18, offset: 1}">
                  <a-radio-group v-model="queryParams.c2.inputValue">
                    <a-radio-button value="0">编内</a-radio-button>
                    <a-radio-button value="1">编外</a-radio-button>
                  </a-radio-group>
                </a-form-item>
              </a-col>
            </template>
          </div>
          <span style="float: right; margin: 3px auto 1em;">
            <a-button type="primary" @click="search">对比</a-button>
            <a-button type="primary" ghost style="margin-left: 8px" @click="exportExcel">导出</a-button>
            <a-button style="margin-left: 8px" @click="reset">重置</a-button>
          </span>
        </a-row>
      </a-form>
    </div>
    <div>
      <!-- 表格区域 -->
      <a-table ref="TableInfo"
               :columns="columns"
               :dataSource="dataSource"
               :pagination="pagination"
               :loading="loading"
               :scroll="{ x: 900 }"
               rowKey="id"
               @change="handleTableChange">
      </a-table>
    </div>
  </a-card>
</template>
<script>
import moment from 'moment'
moment.locale('zh-cn')

export default {
  name: 'Compared',
  data () {
    return {
      isBasis: false,
      advanced: true,
      notBasisList: [],
      basisList: [],
      queryParams: {
        c1: {},
        c2: {}
      },
      filteredInfo: null,
      sortedInfo: null,
      paginationInfo: null,
      dataSource: [],
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
        }
      }, {
        title: '事由',
        dataIndex: 'cause'
      }, {
        title: '增加日期',
        dataIndex: 'addDate'
      }, {
        title: '减少日期',
        dataIndex: 'leaveDate'
      }]
    }
  },
  mounted () {
    this.loadSelect()
  },
  methods: {
    handleC1Change (value) {
      this.queryParams.c1 = {...this.basisList[value]}
    },
    handleC2Change (value) {
      this.queryParams.c2 = {...this.notBasisList[value]}
      if (this.queryParams.c2.month === '1') this.queryParams.c2.month = moment()
      if (this.queryParams.c2.input === '1') this.queryParams.c2.inputValue = '0'
    },
    getTagByStaffType (satffType) {
      switch (satffType) {
        case '0':
          return {color: 'cyan', name: '编内'}
        case '1':
          return {color: 'orange', name: '归属'}
        case '2':
          return {color: 'purple', name: '分队'}
        default:
          return satffType
      }
    },
    exportExcel () {
      if (!this.verification()) return
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
      if (this.isBasis) this.queryParams.c1.basis = '0'
      console.log(this.queryParams.c2)
      if (this.queryParams.c2.month !== '0' && this.queryParams.c2.month !== '1') this.queryParams.c2.dateValue = this.queryParams.c2.month.format('YYYY-MM')
      this.queryParams.c1 = JSON.stringify(this.queryParams.c1)
      this.queryParams.c2 = JSON.stringify(this.queryParams.c2)
      this.$export('compared/excel', {
        sortField: sortField,
        sortOrder: sortOrder,
        pageSize: pageSize,
        ...this.queryParams,
        ...filteredInfo
      })
    },
    loadSelect () {
      this.$get('compared', {}).then((r) => {
        if (!r.data) return
        let notBasisList = []
        let basisList = []
        r.data.forEach(item => {
          if (item.basis === '1') {
            basisList.push(item)
          } else {
            notBasisList.push(item)
          }
        })
        this.notBasisList = notBasisList
        this.basisList = basisList
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
      if (!this.verification()) return
      this.fetch({
        sortField: sortField,
        sortOrder: sortOrder,
        ...this.queryParams,
        ...filteredInfo
      })
    },
    verification () {
      if (JSON.stringify(this.queryParams.c1) === '{}' || JSON.stringify(this.queryParams.c2) === '{}') {
        this.$message.warning('请检查对比框是否已填选')
        return false
      }
      return true
    },
    reset () {
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
        c1: {},
        c2: {}
      }
      this.dataSource = []
    },
    handleTableChange (pagination, filters, sorter) {
      // 将这三个参数赋值给Vue data，用于后续使用
      this.paginationInfo = pagination
      this.filteredInfo = filters
      this.sortedInfo = sorter
      if (!this.verification()) return
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
      if (this.isBasis) params.c1.basis = '0'
      if (params.c2.month !== '0' && params.c2.month !== '1') params.c2.dateValue = params.c2.month.format('YYYY-MM')
      params.c1 = JSON.stringify(params.c1)
      params.c2 = JSON.stringify(params.c2)
      this.$post('compared/to', {
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
