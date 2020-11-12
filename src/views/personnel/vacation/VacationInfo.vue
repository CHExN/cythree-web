<template>
  <a-drawer
    :title="`${yearValue}年 ${insOutName}人员休假统计`"
    width=1300
    placement="right"
    @close="onClose"
    :visible="vacationInfoVisiable"
    style="height: calc(100% - 55px);overflow: auto;padding-bottom: 53px;">
    <div :class="advanced ? 'search' : null">
      <a-form layout="horizontal">
        <a-row>
          <div :class="advanced ? null: 'fold'" :style="advanced ? {}: { width: '70%' }">
            <a-col :md="12" :sm="24" >
              <a-form-item
                label="姓名"
                :labelCol="{span: 5}"
                :wrapperCol="{span: 18, offset: 1}">
                <a-textarea auto-size v-model="queryParams.name"/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24" >
              <a-form-item
                label="编制类别"
                :labelCol="{span: 5}"
                :wrapperCol="{span: 18, offset: 1}">
                <a-select v-model="insOutCopy">
                  <!-- 这里不能加 ‘全部’ 选项 因为后台不支持 -->
                  <a-select-option value="0">编内</a-select-option>
                  <a-select-option value="1">编外归属</a-select-option>
                  <a-select-option value="2">编外分队</a-select-option>
                  <a-select-option value="3">派遣</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <template v-if="advanced">
              <a-col :md="12" :sm="24" >
                <a-form-item
                  label="身份证号码"
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 18, offset: 1}">
                  <a-input v-model="queryParams.idNum"/>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24" >
                <a-form-item
                  label="在职与否"
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 18, offset: 1}">
                  <a-select v-model="isLeave">
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
            <a-button type="primary" ghost style="margin-left: 8px" @click="exportExcel">导出</a-button>
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
      <!-- 表格区域 -->
      <a-table ref="TableInfo" bordered
               :columns="columns"
               :dataSource="dataSource"
               :pagination="pagination"
               :loading="loading"
               size="small"
               rowKey="staffId"
               @change="handleTableChange">
        <template v-for="month in 12" :slot="`month${month}`" slot-scope="text, record">
          <a-popover v-if="record[`month${month}Remark`]" placement="topLeft" :key="month">
            <div slot="content" style="text-align: right;">
              <div v-for="(item, index) in record[`month${month}Remark`].split(',')" :key="index">
                <span>{{item}}</span><br/>
              </div>
            </div>
            <div v-for="(item, index) in text.split('\n')" :key="index">
              <span>{{text.split('\n').length === (index + 1) ? item : item + '\n'}}</span>
            </div>
            <!-- 替换字符串为\n -->
            <!-- {{ text.replace(';', '\n') }} -->
          </a-popover>
        </template>
      </a-table>
    </div>
  </a-drawer>
</template>
<script>
import { newSpread, fixedForm, floatForm, floatReset, saveExcel } from '@/utils/spreadJS'

export default {
  name: 'VacationInfo',
  props: {
    vacationInfoVisiable: {
      default: false
    },
    yearValue: {
      require: true
    },
    insOut: {
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
      loading: false,
      isLeave: '0',
      insOutCopy: this.insOut
    }
  },
  computed: {
    insOutName () {
      if (this.insOutCopy === '0') {
        return '编内'
      } else if (this.insOutCopy === '1') {
        return '编外归属'
      } else if (this.insOutCopy === '2') {
        return '编外分队'
      } else if (this.insOutCopy === '3') {
        return '劳务派遣'
      }
    },
    columns () {
      return [{
        title: '序号',
        align: 'center',
        dataIndex: 'sortNum',
        width: '5%'
      }, {
        title: '姓名',
        align: 'center',
        dataIndex: 'name'
      }, {
        title: '1月',
        align: 'center',
        dataIndex: 'month1',
        scopedSlots: { customRender: 'month1' },
        width: '7%'
      }, {
        title: '2月',
        align: 'center',
        dataIndex: 'month2',
        scopedSlots: { customRender: 'month2' },
        width: '7%'
      }, {
        title: '3月',
        align: 'center',
        dataIndex: 'month3',
        scopedSlots: { customRender: 'month3' },
        width: '7%'
      }, {
        title: '4月',
        align: 'center',
        dataIndex: 'month4',
        scopedSlots: { customRender: 'month4' },
        width: '7%'
      }, {
        title: '5月',
        align: 'center',
        dataIndex: 'month5',
        scopedSlots: { customRender: 'month5' },
        width: '7%'
      }, {
        title: '6月',
        align: 'center',
        dataIndex: 'month6',
        scopedSlots: { customRender: 'month6' },
        width: '7%'
      }, {
        title: '7月',
        align: 'center',
        dataIndex: 'month7',
        scopedSlots: { customRender: 'month7' },
        width: '7%'
      }, {
        title: '8月',
        align: 'center',
        dataIndex: 'month8',
        scopedSlots: { customRender: 'month8' },
        width: '7%'
      }, {
        title: '9月',
        align: 'center',
        dataIndex: 'month9',
        scopedSlots: { customRender: 'month9' },
        width: '7%'
      }, {
        title: '10月',
        align: 'center',
        dataIndex: 'month10',
        scopedSlots: { customRender: 'month10' },
        width: '7%'
      }, {
        title: '11月',
        align: 'center',
        dataIndex: 'month11',
        scopedSlots: { customRender: 'month11' },
        width: '7%'
      }, {
        title: '12月',
        align: 'center',
        dataIndex: 'month12',
        scopedSlots: { customRender: 'month12' },
        width: '7%'
      }]
    }
  },
  methods: {
    onClose () {
      this.$emit('close')
      this.dataSource = []
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
      // 每次展开，把隐藏的内容清空
      if (!this.advanced) {
        this.queryParams.idNum = ''
      }
    },
    exportExcel () {
      let pageSize
      // 设置导出的数据为总数据条数
      if (this.pagination) {
        pageSize = this.pagination.total
      }
      this.$get('vacation/insOutVacation', {
        ...this.queryParams,
        pageSize: pageSize,
        date: this.yearValue,
        insOut: this.insOutCopy,
        isLeave: this.isLeave
      }).then((r) => {
        let newData = []
        r.data.rows.forEach(element => {
          newData.push([
            element.name,
            element.month1,
            element.month2,
            element.month3,
            element.month4,
            element.month5,
            element.month6,
            element.month7,
            element.month8,
            element.month9,
            element.month10,
            element.month11,
            element.month12
          ])
        })
        this.$message.loading('正在生成', 3, () => { // 3s后关闭执行关闭回调函数
          let spread = newSpread('Vacation')
          spread = fixedForm(spread, 'Vacation', {title: `${this.yearValue}年 ${this.insOutName}人员休假统计`})
          spread = floatForm(spread, 'Vacation', newData)
          let fileName = `休假统计_${this.insOutName}人员_${this.yearValue}.xlsx`
          saveExcel(spread, fileName)
          floatReset(spread, 'Vacation', newData.length)
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
      this.isLeave = '0'
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
      this.$get('vacation/insOutVacation', {
        ...params,
        date: this.yearValue,
        insOut: this.insOutCopy,
        isLeave: this.isLeave
      }).then((r) => {
        let data = r.data
        const pagination = { ...this.pagination }
        pagination.total = data.total
        this.loading = false
        this.dataSource = data.rows
        this.pagination = pagination
      })
    }
  },
  watch: {
    vacationInfoVisiable () {
      if (this.vacationInfoVisiable) {
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
