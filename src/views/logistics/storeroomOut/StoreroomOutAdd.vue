<template>
  <a-drawer
    title="新增出库"
    :maskClosable="false"
    width=1220
    placement="right"
    :closable="false"
    @close="onClose"
    :visible="outAddVisiable"
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
          <a-form-item label='出库部门' v-bind="formItemLayout">
            <dept-input-tree placeholder='出库部门' ref="deptTree" v-decorator="['toDeptId',{
              rules: [{ required: true, message: '请选择出库部门' }]
            }]"></dept-input-tree>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
    <a-card title="出库名单" :bordered="false">
      <a-table ref="TableInfo"
               :columns="columns"
               :dataSource="dataSource"
               :pagination="false"
               rowKey="id">
        <template slot="amount" slot-scope="text, record">
          <a-input-number
            v-model="record.amount"
            :min="0.01"
            :max="record.storeroomCount"
            :precision="3"
            :formatter="value => value"
          />
        </template>
        <template slot="money" slot-scope="text">
          <span>{{ $tools.toNumFormant(text) }}</span>
        </template>
      </a-table>
    </a-card>
    <div class="drawer-bootom-button">
      <a-popconfirm title="确定放弃编辑？" @confirm="onClose" okText="确定" cancelText="取消">
        <a-button style="margin-right: .8rem">取消</a-button>
      </a-popconfirm>
      <a-button @click="handleSubmit" type="primary" :loading="loading">提交</a-button>
    </div>
  </a-drawer>
</template>
<script>
import DeptInputTree from '../../system/dept/DeptInputTree'
import moment from 'moment'
moment.locale('zh-cn')
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 17 }
}

export default {
  name: 'StoreroomOutAdd',
  components: { DeptInputTree },
  props: {
    outAddVisiable: {
      default: false
    }
  },
  data () {
    return {
      loading: false,
      dataSource: [],
      tableIndex: 0,
      modalVisible: false,
      dictData: {},
      deptId: '',
      formItemLayout,
      form: this.$form.createForm(this)
    }
  },
  computed: {
    columns () {
      return [{
        title: '物品名称',
        dataIndex: 'name'
      }, {
        title: '型号',
        dataIndex: 'type'
      }, {
        title: '出库数量',
        dataIndex: 'amount',
        scopedSlots: { customRender: 'amount' }
      }, {
        title: '单位',
        dataIndex: 'unit'
      }, {
        title: '备注',
        dataIndex: 'remark'
      }, {
        title: '单价',
        dataIndex: 'money',
        scopedSlots: { customRender: 'money' }
      }, {
        title: '收据',
        dataIndex: 'receipt'
      }]
    }
  },
  methods: {
    reset () {
      this.loading = false
      // 清空部门树选择
      this.$refs.deptTree.reset()
      this.form.resetFields()
      this.dataSource = []
    },
    onClose () {
      this.reset()
      this.$emit('close')
    },
    setTableValues (outData) {
      this.dataSource = outData
    },
    handleSubmit () {
      this.form.validateFields((err, values) => {
        if (!err) {
          for (let item of this.dataSource) {
            if (item.amount === '' || item.amount === undefined) {
              this.$message.warning('请填写正确的出库数量')
              return
            }
          }
          let storeroomList = JSON.stringify(this.dataSource, function (key, value) {
            return key === 'date' ||
            key === 'ids' ||
            key === 'idArr' ||
            key === 'names' ||
            key === 'toDeptId' ||
            key === 'parentId' ||
            key === 'createTimeFrom' ||
            key === 'createTimeTo' ||
            key === 'status' ||
            key === 'unitOriginal' ||
            key === 'amountOriginal' ||
            key === 'moneyOriginal' ||
            key === 'typeApplicationToDict' ||
            key === 'typeApplicationAuthority' ||
            key === 'amountDist' ? undefined : value
          })
          console.log(storeroomList)
          const date = values['date']
          this.loading = true
          this.$post('storeroomOut', {
            ...values,
            date: date.format('YYYY-MM-DD'),
            storeroomList: storeroomList
          }).then((r) => {
            this.reset()
            this.$emit('success')
          }).catch(() => {
            this.loading = false
          })
        }
      })
    }
  },
  watch: {
    outAddVisiable () {
      if (this.outAddVisiable) {
        this.form.getFieldDecorator('date')
        this.form.setFieldsValue({ date: moment() })
      }
    }
  }
}
</script>
