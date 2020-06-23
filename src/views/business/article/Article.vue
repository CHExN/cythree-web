<template>
  <a-card :bordered="false" class="card-area">
    <div :class="advanced ? 'search' : null">
      <a-form layout="horizontal">
        <a-row>
          <div :class="advanced ? null: 'fold'">
            <a-col :md="12" :sm="24" >
              <a-form-item
                label="标题"
                :labelCol="{span: 5}"
                :wrapperCol="{span: 18, offset: 1}">
                <a-input v-model="queryParams.title"/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24" >
              <a-form-item
                label="内容"
                :labelCol="{span: 5}"
                :wrapperCol="{span: 18, offset: 1}">
                <a-input v-model="queryParams.content"/>
              </a-form-item>
            </a-col>
            <template v-if="advanced">
              <a-col :md="12" :sm="24" >
                <a-form-item
                  label="创建日期"
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 18, offset: 1}">
                  <range-date @change="handleCreateDateChange" ref="createDate"></range-date>
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
        <a-button type="primary" ghost @click="add" v-hasPermission="'article:add'">新增</a-button>
        <a-button @click="batchDelete" v-hasPermission="'article:delete'">删除</a-button>
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
          <a-icon v-if="record.isTop === '1'" v-hasPermission="'article:update'" type="up-square" twoToneColor="#08c" @click="sort(0, record)" title="向上调整排序"/>
          <a-icon v-if="record.isTop === '1'" v-hasPermission="'article:update'" type="down-square" twoToneColor="#08c" @click="sort(1, record)" title="向下调整排序"/>
          &nbsp;
          <a-icon v-hasPermission="'article:update'" type="setting" theme="twoTone" twoToneColor="#4a9ff5" @click="edit(record)" title="修改"></a-icon>
          &nbsp;
          <a-icon v-hasPermission="'article:update'" :type="record.isTop === '0' ? 'vertical-align-top' : 'vertical-align-bottom'" @click="top(record)"/>
          <a-badge v-hasNoPermission="'article:update'" status="warning" text="无权限"></a-badge>
        </template>
      </a-table>
    </div>
    <!-- 新增动态 -->
    <article-add
      :articleAddVisiable="articleAdd.visiable"
      @close="handleArticleAddClose"
      @success="handleArticleAddSuccess">
    </article-add>
    <!-- 修改动态 -->
    <article-edit
      ref="articleEdit"
      :articleEditVisiable="articleEdit.visiable"
      @close="handleArticleEditClose"
      @success="handleArticleEditSuccess">
    </article-edit>
    <!-- 动态信息 -->
    <!-- <article-info
      :articleInfoData="articleInfo.data"
      :articleInfoVisiable="articleInfo.visiable"
      @close="handleArticleInfoClose">
    </article-info> -->
  </a-card>
</template>
<script>
import RangeDate from '@/components/datetime/RangeDate'
import ArticleAdd from './ArticleAdd'
import ArticleEdit from './ArticleEdit'
// import ArticleInfo from './ArticleInfo'

export default {
  name: 'Article',
  components: { RangeDate, ArticleAdd, ArticleEdit },
  data () {
    return {
      advanced: false,
      articleAdd: {
        visiable: false,
        data: {}
      },
      articleEdit: {
        visiable: false,
        data: {}
      },
      // articleInfo: {
      //   visiable: false,
      //   data: {}
      // },
      queryParams: {},
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
    columns () {
      // 受控属性
      let { sortedInfo } = this
      sortedInfo = sortedInfo || {}
      return [{
        title: '标题',
        dataIndex: 'title',
        sorter: true,
        sortOrder: sortedInfo.columnKey === 'title' && sortedInfo.order,
        width: '17%'
      }, {
        title: '创建人',
        dataIndex: 'username',
        sorter: true,
        sortOrder: sortedInfo.columnKey === 'username' && sortedInfo.order,
        width: '10%'
      }, {
        title: '内容',
        dataIndex: 'content',
        ellipsis: true
      }, {
        title: '创建日期',
        dataIndex: 'createTime',
        sorter: true,
        sortOrder: sortedInfo.columnKey === 'createTime' && sortedInfo.order,
        customRender: (text, row, index) => {
          return this.$tools.getDateTime(text)
        },
        width: '15%'
      }, {
        title: '操作',
        dataIndex: 'operation',
        scopedSlots: { customRender: 'operation' },
        fixed: 'right',
        width: 150
      }]
    }
  },
  mounted () {
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
        this.queryParams.createTimeFrom = ''
        this.queryParams.createTimeTo = ''
      }
    },
    add () {
      this.articleAdd.visiable = true
    },
    handleArticleAddClose () {
      this.articleAdd.visiable = false
    },
    handleArticleAddSuccess () {
      this.articleAdd.visiable = false
      this.$message.success('新增动态成功')
      this.search()
    },
    top (record) {
      this.loading = true
      this.$put('news', {
        isTop: record.isTop === '0' ? '1' : '0',
        id: record.id
      }).then((r) => {
        this.$message.success(`${record.isTop === '1' ? '取消' : ''}顶置成功`)
        this.search()
      }).catch(() => {
        this.loading = false
      })
    },
    sort (isUp, record) {
      this.loading = true
      this.$put('news/updateSort', {
        sortNum: record.sortNum,
        isUp: isUp
      }).then((r) => {
        const statusArr = {
          '-1': 'error',
          '0': 'warning',
          '1': 'success'
        }
        this.$message[statusArr[r.data.status]](r.data.message)
        this.search()
      }).catch(() => {
        this.loading = false
      })
    },
    edit (record) {
      this.$refs.articleEdit.setFormValues(record)
      this.articleEdit.visiable = true
    },
    handleArticleEditClose () {
      this.articleEdit.visiable = false
    },
    handleArticleEditSuccess () {
      this.articleEdit.visiable = false
      this.$message.success('修改动态成功')
      this.search()
    },
    handleCreateDateChange (value) {
      if (value) {
        this.queryParams.createDateFrom = value[0]
        this.queryParams.createTimeTo = value[1]
      }
    },
    // view (record) {
    //   this.articleInfo.data = record
    //   this.articleInfo.visiable = true
    // },
    // handleArticleInfoClose () {
    //   this.articleInfo.visiable = false
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
          that.$delete('news/' + that.selectedRowKeys.join(',')).then(() => {
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
      if (this.advanced) {
        // 清空时间选择
        this.$refs.createDate.reset()
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
      this.$get('news', {
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
