<template>
  <a-drawer
    width=700
    placement="right"
    @close="onClose"
    :closable="false"
    :visible="staffOutsideListVisiable"
    style="height: calc(100% - 55px);overflow: auto;padding-bottom: 53px;">
    <div :class="advanced ? 'search' : null">
      <a-form layout="horizontal">
        <a-row>
          <div :class="advanced ? null: 'fold'">
            <a-col :md="24">
              <a-form-item
                label="姓名"
                :labelCol="{span: 4}"
                :wrapperCol="{span: 18, offset: 1}">
                <a-input v-model="queryParams.name"/>
              </a-form-item>
            </a-col>
            <template v-if="advanced">
              <a-col :md="24">
                <a-form-item
                  label="身份证号"
                  :labelCol="{span: 4}"
                  :wrapperCol="{span: 18, offset: 1}">
                  <a-input v-model="queryParams.idNum"/>
                </a-form-item>
              </a-col>
              <a-col :md="24" >
              <a-form-item
                label="分队"
                :labelCol="{span: 4}"
                :wrapperCol="{span: 18, offset: 1}">
                <a-select
                  mode="multiple"
                  :allowClear="true"
                  @change="handleTeamChange">
                  <a-select-option v-for="i in filteredTeamOptions" :key="i">{{ i }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
              <a-col :md="24" >
                <a-form-item
                  label="岗位职务"
                  :labelCol="{span: 4}"
                  :wrapperCol="{span: 18, offset: 1}">
                  <a-select
                    mode="multiple"
                    :allowClear="true"
                    @change="handleTechnicalTypeChange">
                    <a-select-option v-for="i in filteredTechnicalTypeOptions" :key="i">{{ i }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="24" >
                <a-form-item
                  label="在职与否"
                  :labelCol="{span: 4}"
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
      <!-- 表格区域 -->
      <a-table ref="TableInfo"
               :columns="columns"
               :dataSource="dataSource"
               :pagination="pagination"
               :loading="loading"
               :scroll="{ y: 765 }"
               rowKey="staffId"
               @change="handleTableChange">
        <template slot="district" slot-scope="text, record">
          <a-icon type="check-circle" theme="twoTone" twoToneColor="#9451ff" @click="determine(record)" title="确认"></a-icon>
        </template>
      </a-table>
    </div>
    <div class="drawer-bootom-button">
      <a-button @click="onClose">取消</a-button>
    </div>
  </a-drawer>
</template>
<script>
export default {
  name: 'StaffOutsideList',
  props: {
    staffOutsideListVisiable: {
      default: false
    },
    // 当有传入temporary值的时候，后台就会执行‘未绑定合同的人员列信息’，但如果没传值，或者传空，则会查询‘全部的人员列信息’
    temporary: {
      default: ''
    },
    // 当有传入post值的时候，后台就会执行‘未绑定保险的人员列信息’，但如果没传值，或者传空，则会查询‘全部的人员列信息’
    post: {
      default: ''
    },
    // 当有传入clan值的时候，后台就会执行‘除保洁员外的人员列信息’，但如果没传值，或者传空，则会查询‘全部的人员列信息’
    clan: {
      default: ''
    }
  },
  data () {
    return {
      isLeave: '0',
      advanced: false,
      teamData: [],
      technicalTypeData: [],
      dataSource: [],
      paginationInfo: null,
      queryParams: {
        team: [],
        technicalType: []
      },
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
    filteredTeamOptions () {
      return this.teamData.filter(o => !this.queryParams.team.includes(o))
    },
    filteredTechnicalTypeOptions () {
      return this.technicalTypeData.filter(o => !this.queryParams.technicalType.includes(o))
    },
    columns () {
      return [{
        title: '姓名',
        dataIndex: 'name',
        scopedSlots: { customRender: 'name' }
      }, {
        title: '身份证',
        dataIndex: 'idNum',
        scopedSlots: { customRender: 'idNum' }
      }, {
        title: '操作',
        dataIndex: 'district',
        scopedSlots: { customRender: 'district' }
      }]
    }
  },
  methods: {
    determine (record) {
      this.$emit('change', record.name, record.staffId, record.idNum)
      this.onClose()
    },
    onClose () {
      this.$emit('close')
      this.dataSource = []
      this.technicalTypeData = []
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
      if (!this.advanced) {
        this.queryParams.team = []
        this.queryParams.technicalType = []
      }
    },
    search () {
      this.fetch({
        ...this.queryParams
      })
    },
    reset () {
      this.advanced = false
      // 重置分页
      this.$refs.TableInfo.pagination.current = this.pagination.defaultCurrent
      if (this.paginationInfo) {
        this.paginationInfo.current = this.pagination.defaultCurrent
        this.paginationInfo.pageSize = this.pagination.defaultPageSize
      }
      this.paginationInfo = null
      // 重置查询参数
      this.queryParams = {
        team: [],
        technicalType: []
      }
      this.isLeave = '0'
      this.fetch()
    },
    handleTableChange (pagination, filters, sorter) {
      this.paginationInfo = pagination
      this.fetch({
        ...this.queryParams
      })
    },
    handleTeamChange (value) {
      this.queryParams.team = value || ''
    },
    handleTechnicalTypeChange (value) {
      this.queryParams.technicalType = value || ''
    },
    loadSelect () {
      this.$get('staffOutside/getTeam', {
      }).then((r) => {
        this.teamData = r.data.filter(d => d)
      })
      this.$get('staffOutside/getTechnicalType', {
      }).then((r) => {
        this.technicalTypeData = r.data
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
      this.$get('staffOutside/staffOutsideSimplify', {
        ...params,
        isLeave: this.isLeave,
        temporary: this.temporary,
        clan: this.clan,
        post: this.post
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
    staffOutsideListVisiable () {
      if (this.staffOutsideListVisiable) {
        this.loadSelect()
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
