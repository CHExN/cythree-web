<template>
  <a-drawer
    :title="yearValue+'年 编内年假统计'"
    :maskClosable="false"
    width=1300
    placement="right"
    @close="onClose"
    :visible="insideAnnualLeaveVisiable"
    style="height: calc(100% - 55px);overflow: auto;padding-bottom: 53px;">
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
          </div>
          <span style="float: right; margin: 3px auto 1em;">
            <a-button type="primary" @click="search">查询</a-button>
            <a-button style="margin-left: 8px" @click="reset">重置</a-button>
            &nbsp;
            <a-button type="primary" ghost @click="exportExcel">导出</a-button>
          </span>
        </a-row>
      </a-form>
    </div>
    <div>
      <!-- 表格区域 -->
      <a-table ref="TableInfo" bordered
               :columns="columns"
               :dataSource="dataSource"
               :pagination="pagination"
               :loading="loading"
               rowKey="staffId"
               @change="handleTableChange">
      </a-table>
    </div>
  </a-drawer>
</template>
<script>
import { newSpread, fixedForm, floatForm, floatReset, saveExcel } from '@/utils/spreadJS'

export default {
  name: 'InsideAnnualLeave',
  props: {
    insideAnnualLeaveVisiable: {
      default: false
    },
    yearValue: {
      require: true
    }
  },
  data () {
    return {
      advanced: false,
      dataSource: [],
      paginationInfo: null,
      queryParams: {},
      pagination: {
        size: 'small',
        pageSizeOptions: ['20', '40', '80', '160'],
        defaultCurrent: 1,
        defaultPageSize: 20,
        showSizeChanger: true,
        showTotal: total => `共 ${total} 条`
      },
      loading: false
    }
  },
  computed: {
    columns () {
      return [{
        title: '姓名',
        align: 'center',
        dataIndex: 'name'
      }, {
        title: '参工日期',
        align: 'center',
        dataIndex: 'workDate'
      }, {
        title: '工作年限',
        align: 'center',
        dataIndex: 'workingYears'
      }, {
        title: '可休天数',
        align: 'center',
        dataIndex: 'vacationDays'
      }, {
        title: '已休天数',
        align: 'center',
        dataIndex: 'alreadyDays'
      }, {
        title: '剩余天数',
        align: 'center',
        dataIndex: 'remainingDays'
      }, {
        title: '1月',
        align: 'center',
        dataIndex: 'january'
      }, {
        title: '2月',
        align: 'center',
        dataIndex: 'february'
      }, {
        title: '3月',
        align: 'center',
        dataIndex: 'march'
      }, {
        title: '4月',
        align: 'center',
        dataIndex: 'april'
      }, {
        title: '5月',
        align: 'center',
        dataIndex: 'may'
      }, {
        title: '6月',
        align: 'center',
        dataIndex: 'june'
      }, {
        title: '7月',
        align: 'center',
        dataIndex: 'july'
      }, {
        title: '8月',
        align: 'center',
        dataIndex: 'august'
      }, {
        title: '9月',
        align: 'center',
        dataIndex: 'september'
      }, {
        title: '10月',
        align: 'center',
        dataIndex: 'october'
      }, {
        title: '11月',
        align: 'center',
        dataIndex: 'november'
      }, {
        title: '12月',
        align: 'center',
        dataIndex: 'december'
      }]
    }
  },
  methods: {
    onClose () {
      this.$emit('close')
      this.dataSource = []
    },
    exportExcel () {
      let pageSize
      // 设置导出的数据为总数据条数
      if (this.pagination) {
        pageSize = this.pagination.total
      }
      this.$get('vacation/insideAnnualLeave', {
        ...this.queryParams,
        pageSize: pageSize,
        day: this.yearValue
      }).then((r) => {
        let newData = []
        r.data.rows.forEach(element => {
          if (element.workDate) {
            element.workingYears = this.$tools.getAge(element.workDate)
            element.vacationDays = element.workingYears >= 20 ? 15 : element.workingYears >= 10 ? 10 : element.workingYears >= 1 ? 5 : 0
            element.remainingDays = element.vacationDays - element.alreadyDays
          }
          newData.push([
            element.name,
            element.workDate,
            element.workingYears,
            element.vacationDays,
            element.alreadyDays,
            element.remainingDays,
            element.january,
            element.february,
            element.march,
            element.april,
            element.may,
            element.june,
            element.july,
            element.august,
            element.september,
            element.october,
            element.november,
            element.december
          ])
        })
        this.$message.loading('正在生成', 3, () => { // 3s后关闭执行关闭回调函数
          let spread = newSpread('InsideAnnualLeave')
          spread = fixedForm(spread, 'InsideAnnualLeave', {title: `${this.yearValue}年编内人员年假统计`})
          spread = floatForm(spread, 'InsideAnnualLeave', newData)
          let fileName = `编内人员年假统计_${this.yearValue}.xlsx`
          saveExcel(spread, fileName)
          floatReset(spread, 'InsideAnnualLeave', newData.length)
        })
      })
    },
    search () {
      this.fetch({
        ...this.queryParams
      })
    },
    reset () {
      // 重置分页
      this.$refs.TableInfo.pagination.current = this.pagination.defaultCurrent
      if (this.paginationInfo) {
        this.paginationInfo.current = this.pagination.defaultCurrent
        this.paginationInfo.pageSize = this.pagination.defaultPageSize
      }
      this.paginationInfo = null
      // 重置查询参数
      this.queryParams = {}
      this.fetch()
    },
    handleTableChange (pagination, filters, sorter) {
      this.paginationInfo = pagination
      this.fetch({
        ...this.queryParams
      })
    },
    fetch (params = {}) {
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
      this.$get('vacation/insideAnnualLeave', {
        ...params,
        day: this.yearValue
      }).then((r) => {
        this.dataSource = []
        let data = r.data
        const pagination = { ...this.pagination }
        pagination.total = data.total
        this.loading = false
        data.rows.forEach(element => {
          if (element.workDate) {
            element.workingYears = this.$tools.getAge(element.workDate)
            element.vacationDays = element.workingYears >= 20 ? 15 : element.workingYears >= 10 ? 10 : element.workingYears >= 1 ? 5 : 0
            element.remainingDays = element.vacationDays - element.alreadyDays
          }
          this.dataSource.push(element)
        })
        this.pagination = pagination
      })
    }
  },
  watch: {
    insideAnnualLeaveVisiable () {
      if (this.insideAnnualLeaveVisiable) {
        this.fetch()
      }
    }
  }
}
</script>
<style lang="less" scoped>
  @import "../../../../static/less/Common";
  .alert {
    margin-bottom: .5rem;
  }
</style>
