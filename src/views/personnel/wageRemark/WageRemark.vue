<template>
  <a-drawer
    title="工资备注管理"
    width=550
    placement="right"
    :closable="false"
    @close="onClose"
    :visible="wageRemarkVisiable"
    style="height: calc(100% - 55px);overflow: auto;padding-bottom: 53px;">
    <div :class="advanced ? 'search' : null">
      <a-form layout="horizontal">
        <a-row>
          <div :class="advanced ? null: 'fold'">
            <a-col :md="24">
              <a-form-item
                label="月份"
                :labelCol="{span: 4}"
                :wrapperCol="{span: 18, offset: 1}">
                <a-month-picker
                  v-model="nowMonth"
                  style="width: 100%;"
                  :allowClear="false"
                />
              </a-form-item>
            </a-col>
            <template v-if="advanced">
              <a-col :md="24">
                <a-form-item
                  label="备注"
                  :labelCol="{span: 4}"
                  :wrapperCol="{span: 18, offset: 1}">
                  <a-input v-model="queryParams.remark"/>
                </a-form-item>
              </a-col>
            </template>
          </div>
          <span style="float: right; margin: 3px auto 1em;">
            <a @click="toggleAdvanced" style="margin-left: 8px">
              {{advanced ? '收起' : '展开'}}
              <a-icon :type="advanced ? 'up' : 'down'" />
            </a>
            &nbsp;
            <a-button type="primary" @click="search">查询</a-button>
            <a-button style="margin-left: 8px" @click="reset">重置</a-button>
          </span>
        </a-row>
      </a-form>
    </div>
    <div>
      <div class="operator">
        <a-button type="primary" ghost @click="add" v-hasPermission="'wageRemark:add'">新增</a-button>
        <a-button @click="edit" v-if="dataSource.length" v-hasPermission="'wageRemark:update'">修改</a-button>
      </div>
      <!-- 表格区域 -->
      <a-table ref="TableInfo"
               :columns="columns"
               :dataSource="dataSource"
               :loading="loading"
               rowKey="rowKey">
               <!-- :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}" -->
        <!-- <template slot="operation" slot-scope="text, record">
          <a-icon v-hasPermission="'wageRemark:update'" type="setting" theme="twoTone" twoToneColor="#4a9ff5" @click="edit(record)" title="修改"></a-icon>
          <a-badge v-hasNoPermission="'wageRemark:update'" status="warning" text="无权限"></a-badge>
        </template> -->
      </a-table>
    </div>
    <!-- 新增工资备注 -->
    <wage-remark-add
      :wageRemarkAddVisiable="wageRemarkAdd.visiable"
      @close="handleWageRemarkAddClose"
      @success="handleWageRemarkAddSuccess">
    </wage-remark-add>
    <!-- 修改工资备注 -->
    <wage-remark-edit
      ref="wageRemarkEdit"
      :wageRemarkEditVisiable="wageRemarkEdit.visiable"
      @close="handleWageRemarkEditClose"
      @success="handleWageRemarkEditSuccess">
    </wage-remark-edit>
  </a-drawer>
</template>
<script>
import WageRemarkAdd from './WageRemarkAdd'
import WageRemarkEdit from './WageRemarkEdit'
import moment from 'moment'
moment.locale('zh-cn')

export default {
  name: 'WageRemark',
  components: { WageRemarkAdd, WageRemarkEdit },
  props: {
    wageRemarkVisiable: {
      default: false
    }
  },
  data () {
    return {
      nowMonth: moment(),
      advanced: false,
      wageRemarkAdd: {
        visiable: false
      },
      wageRemarkEdit: {
        visiable: false
      },
      queryParams: {},
      filteredInfo: null,
      sortedInfo: null,
      dataSource: [],
      loading: false
    }
  },
  computed: {
    columns () {
      return [{
        title: '空列',
        dataIndex: 'rowKey',
        customRender: (text, row, index) => {
          return `空列${text + 1}`
        }
      }, {
        title: '备注',
        dataIndex: 'remark'
      }]
    }
  },
  mounted () {
    this.fetch()
  },
  methods: {
    // onSelectChange (selectedRowKeys) {
    //   this.selectedRowKeys = selectedRowKeys
    // },
    onClose () {
      this.loading = false
      this.dataSource = []
      this.$emit('close')
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
      if (!this.advanced) {
        this.queryParams.remark = ''
      }
    },
    add () {
      this.wageRemarkAdd.visiable = true
    },
    handleWageRemarkAddClose () {
      this.wageRemarkAdd.visiable = false
    },
    handleWageRemarkAddSuccess () {
      this.wageRemarkAdd.visiable = false
      this.$message.success('新增工资备注成功')
      this.search()
    },
    edit () {
      this.$refs.wageRemarkEdit.setFormValues(this.dataSource)
      this.wageRemarkEdit.visiable = true
    },
    handleWageRemarkEditClose () {
      this.wageRemarkEdit.visiable = false
    },
    handleWageRemarkEditSuccess () {
      this.wageRemarkEdit.visiable = false
      this.$message.success('修改工资备注成功')
      this.search()
    },
    // batchDelete () {
    //   if (!this.selectedRowKeys.length) {
    //     this.$message.warning('请选择需要删除的记录')
    //     return
    //   }
    //   let that = this
    //   this.$confirm({
    //     title: '确定删除所选中的记录?',
    //     content: '当您点击确定按钮后，这些记录将会被彻底删除',
    //     centered: true,
    //     onOk () {
    //       that.$delete('wageRemark/' + that.selectedRowKeys.join(',')).then(() => {
    //         that.$message.success('删除成功')
    //         that.selectedRowKeys = []
    //         that.search()
    //       })
    //     },
    //     onCancel () {
    //       that.selectedRowKeys = []
    //     }
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
      // 重置列过滤器规则
      this.filteredInfo = null
      // 重置列排序规则
      this.sortedInfo = null
      // 重置查询参数
      this.queryParams = {}
      // 重置月份
      this.nowMonth = moment()
      this.fetch()
    },
    fetch (params = {}) {
      // 显示loading
      this.loading = true
      if (this.nowMonth) {
        params.year = this.nowMonth.format('YYYY')
        params.month = this.nowMonth.format('MM')
      }
      this.$get('wageRemark', {
        ...params,
        insideOrOutside: '0'
      }).then((r) => {
        let data = r.data
        this.dataSource = []
        if (data.length) {
          data.forEach(i => {
            if (i.remark) {
              this.dataSource.push({
                label: `emptyColumn0${i.rowKey + 1}`,
                remark: i.remark,
                id: i.id,
                rowKey: i.rowKey,
                year: i.year,
                month: i.month
              })
            }
          })
        }
        this.loading = false
      })
    }
  }
}
</script>
<style lang="less" scoped>
@import "../../../../static/less/Common";
</style>
