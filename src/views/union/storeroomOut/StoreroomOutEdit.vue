<template>
  <a-drawer
    title="修改出库"
    :maskClosable="false"
    width=1220
    placement="right"
    :closable="false"
    @close="onClose"
    :visible="outEditVisiable"
    style="height: calc(100% - 55px);overflow: auto;padding-bottom: 53px;">
    <a-form :form="form">
      <a-row class="form-row">
        <a-col :md="12" :sm="24">
          <a-form-item label='单号' v-bind="formItemLayout">
            <a-input placeholder='出库单单号' autocomplete="off" autoFocus
            v-decorator="['num',{rules: [{ required: true, message: '出库单单号不能为空'}]}]"/>
          </a-form-item>
        </a-col>
        <a-col :md="12" :sm="24">
          <a-form-item label='出库日期' v-bind="formItemLayout">
            <a-date-picker placeholder='出库日期' autocomplete="off" format='YYYY-MM-DD' style="width: 100%;"
              v-decorator="['date',{rules: [{ required: true, message: '请选择出库日期'}]}]"/>
          </a-form-item>
        </a-col>
        <a-col :md="12" :sm="24">
          <a-form-item label='经手人' v-bind="formItemLayout">
            <a-input placeholder='经手人' autocomplete="off"  v-decorator="['handle']"/>
          </a-form-item>
        </a-col>
        <a-col :md="12" :sm="24">
          <a-form-item label='保管员' v-bind="formItemLayout">
            <a-input placeholder='保管员' autocomplete="off"  v-decorator="['storage']"/>
          </a-form-item>
        </a-col>
        <a-col :md="12" :sm="24">
          <a-form-item label='物资类别' v-bind="formItemLayout">
            <a-select placeholder='物资类别' v-decorator="['typeApplication', {
              initialValue: [dictData.typeApplication && dictData.typeApplication.length > 0 ? dictData.typeApplication[0].key : ''],
              rules: [{ required: true, message: '请选择物资类别' }]
            }]">
              <a-select-option v-for="i in dictData.typeApplication" :key="i.key">{{ i.value }}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="12" :sm="24">
          <a-form-item label="出库部门" v-bind="formItemLayout">
            <a-tree-select
              :dropdownStyle="{ maxHeight: '220px', overflow: 'auto' }"
              :treeData="deptTreeData"
              v-decorator="['toDeptId',{
                rules: [{ required: true, message: '请选择出库部门' }]
              }]">
            </a-tree-select>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
    <a-card title="出库名单" :bordered="false">
      <a-table
        :columns="columns"
        :dataSource="dataSource"
        :pagination="false"
        :loading="loading"
        rowKey="id"
      >
        <template v-for="(col, i) in ['name', 'money', 'amount','unit', 'type', 'remark', 'receipt']" :slot="col" slot-scope="text, record">
          <a-input
            :key="col"
            v-if="record.editable"
            style="margin: -5px 0"
            :value="text"
            :placeholder="columns[i].title"
            @change="e => handleStoreroomChange(e.target.value, record.id, col)"
          />
          <template v-else>{{text}}</template>
        </template>

        <template slot="name" slot-scope="text, record">
          <template v-if="record.editable || record.isNew">
            <!-- 这里的showSearch属性费了我多少时间，官方api根本没这个东西，我只是想在触发handleSearch的时候调出autoComplete的下拉框而已  -->
            <!-- :showSearch="showSearch" -->
            <a-auto-complete
              :ref="record.id"
              v-model="record.name"
              placeholder='物品名称'
              @select="e => onSelect(e, record.id)"
              :filterOption="filterOption">
              <template slot="dataSource">                      <!-- value不转成string就会报Error: Invalid `value` of type `number`  -->
                <a-select-option v-for="item in autoData[record.id]" :key="item.id" :value="item.money + '^' + item.name" >{{item.name}}</a-select-option>
              </template>
              <a-input @pressEnter="handleSearch(record.name, record.id)">
                <a-icon @click="handleSearch(record.name, record.id)" slot="suffix" type="search" class="certain-category-icon" />
              </a-input>
            </a-auto-complete>
          </template>
          <span v-else>{{ text }}</span>
        </template>

        <template slot="money" slot-scope="text, record">
          <template v-if="record.editable || record.isNew">
            <a-input-number
              v-model="record.money"
              :min="0"
              :precision="2"
              :formatter="value => value"
              placeholder='单价'/>
          </template>
          <span v-else>{{ $tools.addZero($tools.toNumFormant(text)) }}</span>
        </template>

        <template slot="operation" slot-scope="text, record">
          <template v-if="record.editable">
            <span v-if="record.isNew">
              <a @click="saveRow(record.id)">添加</a>
            </span>
            <span v-else>
              <a @click="saveRow(record.id)">保存</a>
              <a-divider type="vertical" />
              <a @click="cancle(record.id)">取消</a>
            </span>
          </template>
          <span v-else>
            <a @click="edit(record.id)">编辑</a>
          </span>
        </template>

      </a-table>
    </a-card>
    <div class="drawer-bootom-button">
      <a-popconfirm title="确定放弃编辑？" @confirm="onClose" okText="确定" cancelText="取消">
        <a-button style="margin-right: .8rem">取消</a-button>
      </a-popconfirm>
      <a-button @click="handleSubmit" type="primary" :loading="outLoading">提交</a-button>
    </div>
  </a-drawer>
</template>
<script>
import moment from 'moment'
moment.locale('zh-cn')
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 17 }
}

export default {
  name: 'StoreroomOutEdit',
  props: {
    outEditVisiable: {
      default: false
    }
  },
  data () {
    return {
      outLoading: false,
      loading: false,
      dataSource: [],
      autoData: {},
      open: false,
      tableIndex: 0,
      dictData: {},
      deptTreeData: [],
      deptId: '',
      formItemLayout,
      form: this.$form.createForm(this),
      id: '',
      reviewModify: null
    }
  },
  computed: {
    columns () {
      return [{
        title: '物品名称',
        dataIndex: 'name',
        width: '20%',
        scopedSlots: { customRender: 'name' }
      }, {
        title: '单价',
        dataIndex: 'money',
        width: '11%',
        scopedSlots: { customRender: 'money' }
      }, {
        title: '数量',
        dataIndex: 'amount',
        width: '11%'
      }, {
        title: '单位',
        dataIndex: 'unit',
        width: '10%',
        scopedSlots: { customRender: 'unit' }
      }, {
        title: '型号',
        dataIndex: 'type',
        width: '10%',
        scopedSlots: { customRender: 'type' }
      }, {
        title: '备注',
        dataIndex: 'remark',
        width: '14%',
        scopedSlots: { customRender: 'remark' }
      }, {
        title: '收据',
        dataIndex: 'receipt',
        width: '14%',
        scopedSlots: { customRender: 'receipt' }
      }, {
        title: '操作',
        dataIndex: 'operation',
        scopedSlots: { customRender: 'operation' }
      }]
    }
  },
  methods: {
    setFormValues (out, reviewModify) {
      this.id = out.id
      this.reviewModify = reviewModify
      let obj = {}
      Object.keys(out).forEach((key) => {
        this.form.getFieldDecorator(key)
        obj[key] = out[key]
      })
      obj.toDeptId = `${out.toDeptId}`
      obj['date'] = moment(obj['date'])
      this.form.setFieldsValue(obj)
    },
    reset () {
      this.outLoading = false
      this.form.resetFields()
      this.dataSource = []
      this.autoData = {}
      this.tableIndex = 0
    },
    onClose () {
      this.reset()
      this.$emit('close')
    },
    setTableValues (storeroom) {
      for (const i in storeroom) {
        storeroom[i].editable = false
        storeroom[i].isNew = false
      }
      this.dataSource = storeroom
    },
    handleSubmit () {
      this.form.validateFields((err, values) => {
        if (!err) {
          let data = []
          this.dataSource.forEach(item => {
            if (item.isNew === false && item.editable === false) {
              data.push(item)
            }
          })
          if (data.length > 0) {
            let storeroomList = JSON.stringify(data, function (key, value) {
              return key === 'key' || key === 'editable' || key === 'isNew' ? undefined : value
            })
            const date = values['date']
            this.outLoading = true
            this.$put('unionStoreroomOut', {
              ...values,
              isPut: '2',
              storeroomList: storeroomList,
              id: this.id,
              date: date.format('YYYY-MM-DD')
            }).then((r) => {
              if (this.reviewModify) this.$put('reviewModify/alreadyEdited', this.reviewModify)
              this.reset()
              this.$emit('success')
            }).catch(() => {
              this.outLoading = false
            })
          } else {
            this.$message.warning('出库名单至少要有一条数据')
          }
        }
      })
    },
    saveRow (id) {
      let target = this.dataSource.filter(item => item.id === id)[0]
      target.editable = false
      target.isNew = false
      target.name = target.name.indexOf('^') === -1 ? target.name : target.name.split('^')[1]
      // let targetName = JSON.parse(target.name)
      // target.name = targetName.name
    },
    edit (id) {
      let target = this.dataSource.filter(item => item.id === id)[0]
      target.editable = !target.editable
    },
    cancle (id) {
      let target = this.dataSource.filter(item => item.id === id)[0]
      target.editable = false
      // let targetName = JSON.parse(target.name)
      // target.name = targetName.name
      target.name = target.name.indexOf('^') === -1 ? target.name : target.name.split('^')[1]
    },
    handleStoreroomChange (value, id, column) {
      const newData = [...this.dataSource]
      const target = newData.filter(item => id === item.id)[0]
      if (target) {
        target[column] = value
        this.dataSource = newData
      }
    },
    onSelect (moneyAndName, id) {
      // moneyAndName = JSON.parse(moneyAndName)
      const moneyAndNameArr = moneyAndName.split('^')
      // 鼠标点击选中项时触发
      this.dataSource.forEach(item => {
        if (item.id === id) { item.money = moneyAndNameArr[0] }
      })
    },
    handleSearch (name, id) {
      if (name) {
        this.$get('price/name', {name}).then((r) => {
          if (r.data.length) {
            this.autoData[id] = r.data
            this.$refs[id].showSearch = true
          }
        })
      }
    },
    filterOption (input, option) {
      return option.componentOptions.children[0].text.toUpperCase().indexOf(input.toUpperCase()) >= 0
    }
  },
  watch: {
    outEditVisiable () {
      if (this.outEditVisiable) {
        this.loading = true
        this.$get('dept').then((r) => {
          this.deptTreeData = r.data.rows.children
        })
        this.$get('unionStoreroomOut/storeroomByOutId', {
          outId: this.id
        }).then((r) => {
          this.loading = false
          this.setTableValues(r.data)
        })
        this.$get('dict/cy_storeroom', {
        }).then((r) => {
          let dictList = {}
          r.data.forEach((item) => {
            let fieldName = this.$tools.toHump(item.fieldName.toLowerCase())
            if (dictList[fieldName]) {
              dictList[fieldName].push({key: item.keyy, value: item.valuee})
            } else {
              dictList[fieldName] = [{key: item.keyy, value: item.valuee}]
            }
          })
          this.dictData = {...this.dictData, ...dictList}
        })
      }
    }
  }
}
</script>
