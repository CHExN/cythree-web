<template>
  <a-drawer
    title="工资备注管理"
    width=550
    placement="right"
    :closable="false"
    @close="onClose"
    :visible="wageRemarkVisiable"
    style="height: calc(100% - 55px);overflow: auto;padding-bottom: 53px;">
    <div>
      <a-form layout="horizontal">
        <a-row>
          <a-col :md="18">
            <a-form-item
              label="年份"
              :labelCol="{span: 4}"
              :wrapperCol="{span: 18, offset: 1}">
              <a-select v-model="year" :style="{width: 'width: 100%;'}" @change="handleYearChange">
                <a-select-option v-for="i in 20" :key="2017 + i">{{ `${2017 + i}年` }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="6" style="float: right; margin: 3px auto 1em;">
            <a-button @click="add" v-show="dataSource.length === 0" v-hasPermission="'wageRemark:add'" :disabled="loading" ghost type="primary" >新增</a-button>
            <a-button @click="edit" v-show="dataSource.length > 0" v-hasPermission="'wageRemark:update'" :disabled="loading">修改</a-button>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <div>
      <!-- 表格区域 -->
      <a-table ref="TableInfo"
               :columns="columns"
               :dataSource="dataSource"
               :loading="loading"
               rowKey="rowKey">
      </a-table>
    </div>
    <!-- 新增工资备注 -->
    <wage-remark-add
      :wageRemarkAddVisiable="wageRemarkAdd.visiable"
      :insideOrOutside="insideOrOutside"
      :remarkCount="remarkCount"
      :year="year"
      @close="handleWageRemarkAddClose"
      @success="handleWageRemarkAddSuccess">
    </wage-remark-add>
    <!-- 修改工资备注 -->
    <wage-remark-edit
      ref="wageRemarkEdit"
      :wageRemarkEditVisiable="wageRemarkEdit.visiable"
      :remarkCount="remarkCount"
      :year="year"
      @close="handleWageRemarkEditClose"
      @success="handleWageRemarkEditSuccess"
      @delete="handleWageRemarkDeleteSuccess">
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
    },
    insideOrOutside: {
      require: true
    }
  },
  data () {
    return {
      year: moment().year(),
      advanced: false,
      wageRemarkAdd: {
        visiable: false
      },
      wageRemarkEdit: {
        visiable: false
      },
      filteredInfo: null,
      sortedInfo: null,
      dataSource: [],
      loading: false
    }
  },
  computed: {
    remarkCount () {
      let count = 0
      if (this.insideOrOutside === '0') {
        count = 10
      } else if (this.insideOrOutside === '1') {
        count = 10
      }
      return count
    },
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
  methods: {
    onClose () {
      this.loading = false
      this.dataSource = []
      this.$emit('close')
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
      this.fetch()
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
      this.fetch()
    },
    handleWageRemarkDeleteSuccess () {
      this.wageRemarkEdit.visiable = false
      this.$message.success('删除成功')
      this.fetch()
    },
    handleYearChange (value) {
      this.fetch()
    },
    fetch () {
      this.loading = true
      this.$get('wageRemark', {
        year: this.year,
        insideOrOutside: this.insideOrOutside
      }).then((r) => {
        let data = r.data
        this.dataSource = []
        if (data.length) {
          data.forEach(i => {
            if (i.remark) {
              this.dataSource.push({
                label: `emptyColumn${this.$tools.zero(i.rowKey + 1)}`,
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
  },
  watch: {
    wageRemarkVisiable () {
      if (this.wageRemarkVisiable) {
        this.fetch()
      }
    }
  }
}
</script>
<style lang="less" scoped>
@import "../../../../static/less/Common";
</style>
