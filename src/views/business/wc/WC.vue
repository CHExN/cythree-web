<template>
  <a-card :bordered="false" class="card-area">
    <div :class="advanced ? 'search' : null">
      <a-form layout="horizontal">
        <a-row >
          <div :class="advanced ? null: 'fold'">
            <a-col :md="12" :sm="24" >
              <a-form-item
                label="公厕名"
                :labelCol="{span: 5}"
                :wrapperCol="{span: 18, offset: 1}">
                <a-input v-model="queryParams.wcName"/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24" >
              <a-form-item
                label="分队名"
                :labelCol="{span: 5}"
                :wrapperCol="{span: 18, offset: 1}">
                <a-select
                  mode="multiple"
                  :allowClear="true"
                  @change="handleOwnChange">
                  <a-select-option v-for="i in filteredWcOwnOptions" :key="i">{{ i }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <template v-if="advanced">
              <a-col :md="12" :sm="24" >
                <a-form-item
                  label="公厕编号"
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 18, offset: 1}">
                  <a-input v-model="queryParams.wcNum"/>
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
        <a-button type="primary" ghost @click="add" v-hasPermission="'wc:add'">新增</a-button>
        <a-button @click="batchDelete" v-hasPermission="'wc:delete'">删除</a-button>
        <!-- <a-button @click="exportExcel" v-hasPermission="'wc:export'">导出Excel</a-button> -->
        <a-dropdown v-hasAnyPermission="'wc:export','wc:add'">
          <a-menu slot="overlay">
            <a-menu-item key="download-template" @click="downloadTemplate">模板下载</a-menu-item>
            <a-menu-item key="import-data" v-hasPermission="'wc:add'">
              <a-upload class="upload-area" :fileList="fileList" :beforeUpload="importExcel">导入Excel</a-upload>
            </a-menu-item>
            <a-menu-item v-hasPermission="'wc:export'" key="export-data" @click="exportExcel">导出Excel</a-menu-item>
          </a-menu>
          <a-button>
            更多操作 <a-icon type="down" />
          </a-button>
        </a-dropdown>
      </div>
      <div class="full-screen-btn-con">
        <a-modal v-model="modal" centered :closable="false" :width="360">
            <div style="text-align: center;">
              <vue-qr
                ref="Qrcode"
                :text="qrCodeConfig.text"
                :download="qrCodeConfig.name"
                :margin="10"
                :size="qrCodeConfig.size"
                :dotScale="qrCodeConfig.dotScale"
                :colorDark="qrCodeConfig.colorDark"/>
            </div>
            <template  slot="footer">
              <a-button type="primary" @click="downloadImg">下载二维码</a-button>
            </template >
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
               rowKey="wcId"
               @change="handleTableChange">
        <template slot="wcName" slot-scope="text">
          <a-popover placement="topLeft">
            <template slot="content">
              <div>{{text}}</div>
            </template>
            <p style="width: 150px;margin-bottom: 0">{{text}}</p>
          </a-popover>
        </template>
        <template slot="operation" slot-scope="text, record">
          <a-icon v-hasPermission="'wc:update'" type="setting" theme="twoTone" twoToneColor="#4a9ff5" @click="edit(record)" title="修改" />
          &nbsp;
          <a-icon type="qrcode" @click="showImage(record)" title="二维码" />
          &nbsp;
          <a-icon v-hasPermission="'wc:view'" type="eye" theme="twoTone" twoToneColor="#42b983" @click="view(record)" title="查看" />
          <!-- <a-badge v-hasNoPermission="'wc:update','wc:view'" status="warning" text="无权限"></a-badge> -->
        </template>
      </a-table>
    </div>
    <!-- 公厕信息查看 -->
    <wc-info
      :wcInfoData="wcInfo.data"
      :wcInfoVisiable="wcInfo.visiable"
      @close="handleWCInfoClose">
    </wc-info>
    <!-- 新增公厕 -->
    <wc-add
      :dictData="dictData"
      :wcOwnData="wcOwnData"
      :wcAddVisiable="wcAdd.visiable"
      @close="handleWCAddClose"
      @success="handleWCAddSuccess">
    </wc-add>
    <!-- 修改公厕 -->
    <wc-edit
      ref="wcEdit"
      :dictData="dictData"
      :wcOwnData="wcOwnData"
      :wcEditVisiable="wcEdit.visiable"
      @close="handleWCEditClose"
      @success="handleWCEditSuccess">
    </wc-edit>
    <!-- 导入结果 -->
    <wc-import-result
      @close="handleClose"
      :importData="importData"
      :errors="errors"
      :times="times"
      :wcImportResultVisible="wcImportResultVisible">
    </wc-import-result>
  </a-card>
</template>
<script>
import WcInfo from './WCInfo'
import WcAdd from './WCAdd'
import WcEdit from './WCEdit'
import WcImportResult from './WCImportResult'
import VueQr from 'vue-qr'

export default {
  // test
  name: 'WC',
  components: { WcInfo, WcAdd, WcEdit, WcImportResult, VueQr },
  data () {
    return {
      modal: false,
      qrCodeConfig: {
        text: 'qiouweyroqiuweyroiquweryqiouweyroiquwery',
        size: 300,
        name: '二维码'
      },
      // downloadFilename: '',
      fileList: [],
      importData: [],
      times: '',
      errors: [],
      wcImportResultVisible: false,
      advanced: false,
      wcInfo: {
        visiable: false,
        data: {}
      },
      wcAdd: {
        visiable: false,
        data: {}
      },
      wcEdit: {
        visiable: false,
        data: {}
      },
      wcOwnData: [],
      queryParams: {
        wcOwn: [],
        wcSort: []
      },
      filteredInfo: null,
      sortedInfo: null,
      paginationInfo: null,
      dataSource: [],
      selectedRowKeys: [],
      dictData: {},
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
    filteredWcOwnOptions () {
      return this.wcOwnData.filter(o => !this.queryParams.wcOwn.includes(o))
    },
    columns () {
      // 受控属性
      let { sortedInfo, filteredInfo } = this
      sortedInfo = sortedInfo || {}
      filteredInfo = filteredInfo || {}
      return [{
        title: '公厕名称',
        dataIndex: 'wcName',
        scopedSlots: { customRender: 'wcName' },
        sorter: true,
        sortOrder: sortedInfo.columnKey === 'wcName' && sortedInfo.order,
        width: 300
      }, {
        title: '公厕编号',
        dataIndex: 'wcNum',
        scopedSlots: { customRender: 'wcNum' },
        sorter: true,
        sortOrder: sortedInfo.columnKey === 'wcNum' && sortedInfo.order
      }, {
        title: '类别',
        dataIndex: 'wcSort',
        customRender: (text, row, index) => {
          switch (text) {
            case '1':
              return <a-tag color="cyan">一类</a-tag>
            case '2':
              return <a-tag color="orange">二类</a-tag>
            case '3':
              return <a-tag color="purple">三类</a-tag>
            default:
              return text
          }
        },
        // filters 属性指定需要筛选菜单的列
        filters: [
          { text: '一类', value: '1' },
          { text: '二类', value: '2' },
          { text: '三类', value: '3' }
        ],
        // filterMultiple 用于指定多选和单选(true多/false单)
        filterMultiple: true,
        filteredValue: filteredInfo.wcSort || null,
        // onFilter 用于筛选当前数据
        onFilter: (value, record) => record.wcSort.includes(value)
      }, {
        title: '所属分队',
        dataIndex: 'wcOwn',
        sorter: true,
        sortOrder: sortedInfo.columnKey === 'wcOwn' && sortedInfo.order
      }, {
        title: '所在街乡',
        dataIndex: 'streetTown',
        sorter: true,
        sortOrder: sortedInfo.columnKey === 'streetTown' && sortedInfo.order
      }, {
        title: '接管日期',
        dataIndex: 'replaceDate',
        sorter: true,
        sortOrder: sortedInfo.columnKey === 'replaceDate' && sortedInfo.order
      }, {
        title: '操作',
        dataIndex: 'operation',
        scopedSlots: { customRender: 'operation' },
        fixed: 'right',
        width: 120
      }]
    }
  },
  mounted () {
    this.loadSelect()
    this.fetch()
  },
  methods: {
    showImage (record) {
      this.qrCodeConfig.name = `QR-Code_${record.wcName}_${record.wcNum}`
      // this.qrCodeConfig.text = record.wcNum
      this.qrCodeConfig.text = `https://wc.ncsll.com/wc/${record.wcId}`
      this.modal = true
    },
    downloadImg () {
      const iconUrl = this.$refs.Qrcode.$el.src
      let a = document.createElement('a')
      let event = new MouseEvent('click')
      a.download = this.qrCodeConfig.name
      a.href = iconUrl
      a.dispatchEvent(event)
    },
    handleClose () {
      this.wcImportResultVisible = false
    },
    downloadTemplate () {
      this.$download('wc/template', {}, '公厕信息表_导入模板.xlsx')
    },
    importExcel (file) {
      const formData = new FormData()
      formData.append('file', file)
      this.$message.loading('处理中', 0)
      this.$upload('wc/import', formData).then((r) => {
        let data = r.data.data
        if (data.data.length) {
          this.fetch()
        }
        this.$message.destroy()
        this.importData = data.data
        this.errors = data.error
        this.times = data.time / 1000
        this.wcImportResultVisible = true
      }).catch((r) => {
        this.$message.destroy()
        console.error(r)
      })
      return false
    },
    onSelectChange (selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
      // 每次展开，把隐藏的内容清空
      if (!this.advanced) {
        this.queryParams.wcNum = ''
      }
    },
    view (record) {
      Object.keys(this.dictData).forEach(key => {
        record[key + 'ToDict'] = this.dictData[key][record[key]]
      })
      this.wcInfo.data = record
      this.wcInfo.visiable = true
    },
    add () {
      this.wcAdd.visiable = true
    },
    handleWCAddClose () {
      this.wcAdd.visiable = false
    },
    handleWCAddSuccess () {
      this.wcAdd.visiable = false
      this.$message.success('新增公厕成功')
      this.search()
    },
    edit (record) {
      this.$refs.wcEdit.setFormValues(record)
      this.wcEdit.visiable = true
    },
    handleWCEditClose () {
      this.wcEdit.visiable = false
    },
    handleWCEditSuccess () {
      this.wcEdit.visiable = false
      this.$message.success('修改公厕成功')
      this.search()
    },
    handleWCInfoClose () {
      this.wcInfo.visiable = false
    },
    handleOwnChange (value) {
      this.queryParams.wcOwn = value || ''
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
          that.$delete('wc/' + that.selectedRowKeys.join(',')).then(() => {
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
    exportExcel () {
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
      this.$export('wc/excel', {
        sortField: sortField,
        sortOrder: sortOrder,
        pageSize: pageSize,
        ...this.queryParams,
        ...filteredInfo
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
        wcOwn: [],
        wcSort: []
      }
      this.fetch()
    },
    handleTableChange (pagination, filters, sorter) {
      // 将这三个参数赋值给Vue data，用于后续使用
      this.paginationInfo = pagination
      this.filteredInfo = filters
      this.sortedInfo = sorter

      this.wcInfo.visiable = false
      this.fetch({
        sortField: sorter.field,
        sortOrder: sorter.order,
        ...this.queryParams,
        ...filters
      })
    },
    loadSelect () {
      this.$get('wc/wcOwns', {
      }).then((r) => {
        this.wcOwnData = r.data.filter(d => d)
      })
      this.$get('dict/cy_wc', {
      }).then((r) => {
        let dictList = {}
        // 对象版
        r.data.forEach((item) => {
          let fieldName = this.$tools.toHump(item.fieldName.toLowerCase())
          if (dictList[fieldName]) {
            // dictList[fieldName].push({key: item.keyy, value: item.valuee})
            dictList[fieldName][item.keyy] = item.valuee
          } else {
            // dictList[fieldName] = [{key: item.keyy, value: item.valuee}]
            dictList[fieldName] = {[item.keyy]: item.valuee}
          }
        })
        this.dictData = dictList
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
      this.$get('wc', {
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
