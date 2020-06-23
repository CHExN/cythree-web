<template>
  <a-drawer
    title="工会用品入库"
    :maskClosable="false"
    width=1000
    placement="right"
    :closable="false"
    @close="onClose"
    :visible="putAddVisiable"
    style="height: calc(100% - 55px);overflow: auto;padding-bottom: 53px;">
    <a-form :form="form">
      <a-row class="form-row">
        <a-col :md="12" :sm="24">
          <a-form-item label='单号' v-bind="formItemLayout">
            <a-input placeholder='入库单单号' autocomplete="off" autoFocus
              v-decorator="['num',{rules: [{ required: true, message: '入库单单号不能为空'}]}]"/>
          </a-form-item>
        </a-col>
        <a-col :md="12" :sm="24">
          <a-form-item label='入库日期' v-bind="formItemLayout">
            <a-date-picker placeholder='入库日期' autocomplete="off" format='YYYY-MM-DD' style="width: 100%;"
              v-decorator="['date',{rules: [{ required: true, message: '请选择入库日期'}]}]"/>
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
      </a-row>
    </a-form>
    <a-card title="入库名单" :bordered="false">
      <a-table
        :loading="loading"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="false"
      >
        <template v-for="(col, i) in ['name', 'money', 'amount', 'unit', 'remark', 'receipt']" :slot="col" slot-scope="text, record">
          <a-input
            :key="col"
            v-if="record.editable"
            style="margin: -5px 0"
            :value="text"
            :placeholder="columns[i].title"
            @change="e => handleUnionChange(e.target.value, record.key, col)"
          />
          <template v-else>{{text}}</template>
        </template>

        <template slot="amount" slot-scope="text, record">
          <template v-if="record.editable || record.isNew">
            <a-input-number
              v-model="record.amount"
              :min="0.01"
              :precision="3"
              :formatter="value => value"
              placeholder='数量'/>
          </template>
          <span v-else>{{ $tools.toNumFormant(text) }}</span>
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
              <a @click="saveRow(record.key)">添加</a>
              <a-divider type="vertical" />
              <a-popconfirm title="是否要删除此行？" @confirm="remove(record.key)">
                <a>删除</a>
              </a-popconfirm>
            </span>
            <span v-else>
              <a @click="saveRow(record.key)">保存</a>
              <a-divider type="vertical" />
              <a @click="cancle(record.key)">取消</a>
            </span>
          </template>
          <span v-else>
            <a @click="edit(record.key)">编辑</a>
            <a-divider type="vertical" />
            <a-popconfirm title="是否要删除此行？" @confirm="remove(record.key)">
              <a>删除</a>
            </a-popconfirm>
          </span>
        </template>

      </a-table>
      <a-button style="width: 100%; margin-top: 16px; margin-bottom: 8px" type="dashed" icon="plus" @click="newRow">新增物品</a-button>
    </a-card>
    <div class="drawer-bootom-button">
      <a-popconfirm title="确定放弃编辑？" @confirm="onClose" okText="确定" cancelText="取消">
        <a-button style="margin-right: .8rem">取消</a-button>
      </a-popconfirm>
      <a-button type="primary" ghost  @click="subPutOut" :loading="putOutLoading">即入即出</a-button>
      &nbsp;&nbsp;
      <a-button @click="handleSubmit" type="primary" :loading="putLoading">提交</a-button>
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
  name: 'UnionPutAdd',
  props: {
    putAddVisiable: {
      default: false
    }
  },
  data () {
    return {
      loading: false,
      putLoading: false,
      putOutLoading: false,
      dataSource: [],
      open: false,
      tableIndex: 0,
      formItemLayout,
      form: this.$form.createForm(this)
    }
  },
  computed: {
    columns () {
      return [{
        title: '名称',
        dataIndex: 'name',
        width: '20%',
        scopedSlots: { customRender: 'name' }
      }, {
        title: '单价',
        dataIndex: 'money',
        width: '15%',
        scopedSlots: { customRender: 'money' }
      }, {
        title: '数量',
        dataIndex: 'amount',
        width: '15%',
        scopedSlots: { customRender: 'amount' }
      }, {
        title: '单位',
        dataIndex: 'unit',
        width: '10%',
        scopedSlots: { customRender: 'unit' }
      }, {
        title: '备注',
        dataIndex: 'remark',
        width: '15%',
        scopedSlots: { customRender: 'remark' }
      }, {
        title: '收据',
        dataIndex: 'receipt',
        width: '10%',
        scopedSlots: { customRender: 'receipt' }
      }, {
        title: '操作',
        dataIndex: 'operation',
        scopedSlots: { customRender: 'operation' }
      }]
    }
  },
  methods: {
    reset () {
      this.putLoading = false
      this.putOutLoading = false
      this.form.resetFields()
      this.dataSource = []
      this.tableIndex = 0
    },
    onClose () {
      this.reset()
      this.$emit('close')
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
          if (data.length === 0) {
            return this.$message.warning('入库名单至少要有一条数据')
          }
          let unionList = JSON.stringify(data, function (key, value) {
            return key === 'key' || key === 'editable' || key === 'isNew' ? undefined : value
          })
          const date = values['date']
          console.log({
            ...values,
            typeApplication: 6, // 工会用品
            storeroomList: unionList,
            date: date.format('YYYY-MM-DD')
          })
          // this.putLoading = true
          // this.$post('storeroomPut', {
          //   ...values,
          //   typeApplication: 6, // 工会用品
          //   storeroomList: unionList,
          //   date: date.format('YYYY-MM-DD')
          // }).then((r) => {
          //   this.reset()
          //   this.$emit('success')
          // }).catch(() => {
          //   this.putLoading = false
          // })
        }
      })
    },
    newRow () {
      this.tableIndex++
      this.dataSource.push({
        key: this.tableIndex,
        name: '',
        unit: '',
        amount: 1,
        remark: '',
        money: 0,
        receipt: '',
        editable: true,
        isNew: true
      })
    },
    remove (key) {
      const newData = this.dataSource.filter(item => item.key !== key)
      this.dataSource = newData
    },
    saveRow (key) {
      let target = this.dataSource.filter(item => item.key === key)[0]
      target.editable = false
      target.isNew = false
      target.name = target.name.indexOf('^') === -1 ? target.name : target.name.split('^')[1]
    },
    edit (key) {
      let target = this.dataSource.filter(item => item.key === key)[0]
      target.editable = !target.editable
    },
    cancle (key) {
      let target = this.dataSource.filter(item => item.key === key)[0]
      target.editable = false
      target.name = target.name.indexOf('^') === -1 ? target.name : target.name.split('^')[1]
    },
    handleUnionChange (value, key, column) {
      const newData = [...this.dataSource]
      const target = newData.filter(item => key === item.key)[0]
      if (target) {
        target[column] = value
        this.dataSource = newData
      }
    },
    onSelect (moneyAndName, key) {
      const moneyAndNameArr = moneyAndName.split('^')
      // 鼠标点击选中项时触发
      this.dataSource.forEach(item => {
        if (item.key === key) { item.money = moneyAndNameArr[0] }
      })
    },
    filterOption (input, option) {
      return option.componentOptions.children[0].text.toUpperCase().indexOf(input.toUpperCase()) >= 0
    },
    showModal () {
      this.form.validateFields((err) => {
        if (!err) {
          if (this.dataSource.length !== 0) {
            this.modalVisible = true
          } else {
            this.$message.warning('入库名单至少要有一条数据')
          }
        }
      })
    },
    subPutOut () {
      this.form.validateFields((err, values) => {
        if (!err) {
          let data = []
          this.dataSource.forEach(item => {
            if (item.isNew === false && item.editable === false) {
              data.push(item)
            }
          })
          if (data.length === 0) {
            return this.$message.warning('入库名单至少要有一条数据')
          }
          this.modalVisible = false
          let unionList = JSON.stringify(data, function (key, value) {
            return key === 'key' || key === 'editable' || key === 'isNew' ? undefined : value
          })
          const date = values['date']
          console.log({
            ...values,
            typeApplication: 6, // 工会用品
            toDeptId: 16, // 默认出库到工会
            date: date.format('YYYY-MM-DD'),
            storeroomList: unionList
          })
          // this.putOutLoading = true
          // this.$post('storeroomPut/inOut', {
          //   ...values,
          //   typeApplication: 6, // 工会用品
          //   toDeptId: 16, // 默认出库到工会
          //   date: date.format('YYYY-MM-DD'),
          //   storeroomList: unionList
          // }).then((r) => {
          //   this.reset()
          //   this.$emit('success')
          // }).catch(() => {
          //   this.putOutLoading = false
          // })
        }
      })
    }
  },
  watch: {
    putAddVisiable () {
      if (this.putAddVisiable) {
        this.form.getFieldDecorator('date')
        this.form.setFieldsValue({ date: moment() })
      }
    }
  }
}
</script>
