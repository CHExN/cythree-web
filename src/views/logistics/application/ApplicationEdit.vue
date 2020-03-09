<template>
  <a-drawer
    title="修改采购申请"
    :maskClosable="false"
    width=920
    placement="right"
    :closable="false"
    @close="onClose"
    :visible="applicationEditVisiable"
    style="height: calc(100% - 55px);overflow: auto;padding-bottom: 53px;">
    <a-form :form="form">
      <a-row class="form-row">
        <a-col :md="12" :sm="24">
          <a-form-item label='编号' v-bind="formItemLayout">
            <a-input
              placeholder='申请单编号'
              autocomplete="off"
              autoFocus
              v-decorator="['num',
                {rules: [{ required: true, message: '申请单编号不能为空'}]}
              ]"/>
          </a-form-item>
        </a-col>
        <a-col :md="12" :sm="24">
          <a-form-item label='申请部门' v-bind="formItemLayout">
            <a-input placeholder='申请部门' autocomplete="off" disabled :value="this.deptName"/>
          </a-form-item>
        </a-col>
        <a-col :md="12" :sm="24">
          <a-form-item label='物资类别' v-bind="formItemLayout">
            <a-select
              placeholder='物资类别'
              v-decorator="['typeApplication', {
                initialValue: [dictData.typeApplication && JSON.stringify(dictData.typeApplication)!=='{}' ? Object.keys(dictData.typeApplication)[0] : ''],
                rules: [{ required: true, message: '请选择物资类别' }]
              }]">
              <a-select-option v-for="i in Object.keys(dictData.typeApplication||[])" :key="i">{{ dictData.typeApplication[i] }}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="12" :sm="24">
          <a-form-item label='预计金额' v-bind="formItemLayout">
            <a-input-number
              :min="0"
              :precision="2"
              :formatter="value => value"
              autocomplete="off"
              placeholder='预计金额'
              style="width: 100%;"
              v-decorator="['money']"
            />
          </a-form-item>
        </a-col>
        <a-col :md="12" :sm="24">
          <a-form-item label='采购说明' v-bind="formItemLayout">
            <a-textarea
              placeholder='采购用途、采购数量、功能要求等'
              autocomplete="off"
              v-decorator="['description']"/>
          </a-form-item>
        </a-col>
        <a-col :md="12" :sm="24">
          <a-form-item label='经办人' v-bind="formItemLayout">
            <a-input
              placeholder='分管采购工作经办人'
              autocomplete="off"
              v-decorator="['handle']"/>
          </a-form-item>
        </a-col>
        <a-col :md="12" :sm="24">
          <a-form-item label='申请日期' v-bind="formItemLayout">
            <a-date-picker
              placeholder='申请日期'
              format='YYYY-MM-DD'
              style="width: 100%;"
              v-decorator="['createDate',
                {rules: [{ required: true, message: '申请日期不能为空'}]}
              ]"
            />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
    <a-card title="采购计划" :bordered="false">
      <a-table
        :columns="columns"
        :dataSource="dataSource"
        :pagination="false"
        :loading="loading"
        rowKey="id"
      >
        <template  v-for="(col, i) in ['name', 'type', 'amount', 'unit', 'remark']" :slot="col" slot-scope="text, record">
          <a-input
            :key="col"
            style="margin: -5px 0"
            v-model="record[col]"
            :placeholder="columns[i].title"
            @change="e => handlePlanChange(e.target.value, record.id, col)"
          />
        </template>

        <template slot="amount" slot-scope="text, record">
          <a-input-number
            v-model="record.amount"
            :min="0.01"
            :precision="2"
            :formatter="value => value"
            placeholder='数量'
          />
        </template>

      </a-table>
    </a-card>
    <div class="drawer-bootom-button">
      <a-popconfirm title="确定放弃编辑？" @confirm="onClose" okText="确定" cancelText="取消">
        <a-button style="margin-right: .8rem">取消</a-button>
      </a-popconfirm>
      <a-button @click="handleSubmit" type="primary" :loading="editLoading">提交</a-button>
    </div>
  </a-drawer>
</template>
<script>
import moment from 'moment'
moment.locale('zh-cn')
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 17, offset: 1 }
}
export default {
  name: 'ApplicationEdit',
  props: {
    applicationEditVisiable: {
      default: false
    },
    dictData: {
      require: true
    }
  },
  data () {
    return {
      formItemLayout,
      form: this.$form.createForm(this),
      id: '',
      loading: false,
      editLoading: false,
      dataSource: [],
      deptName: ''
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
        title: '型号',
        dataIndex: 'type',
        width: '15%',
        scopedSlots: { customRender: 'type' }
      }, {
        title: '数量',
        dataIndex: 'amount',
        width: '15%',
        scopedSlots: { customRender: 'amount' }
      }, {
        title: '单位',
        dataIndex: 'unit',
        width: '12%',
        scopedSlots: { customRender: 'unit' }
      }, {
        title: '备注',
        dataIndex: 'remark',
        width: '23%',
        scopedSlots: { customRender: 'remark' }
      }]
    }
  },
  methods: {
    reset () {
      this.loading = false
      this.form.resetFields()
      this.dataSource = []
    },
    onClose () {
      this.editLoading = false
      this.form.resetFields()
      this.reset()
      this.$emit('close')
    },
    setTableValues (plan) {
      this.dataSource = plan
    },
    handlePlanChange (value, key, column) {
      const newData = [...this.dataSource]
      const target = newData.filter(item => key === item.key)[0]
      if (target) {
        target[column] = value
        this.dataSource = newData
      }
    },
    setFormValues ({...application}) {
      this.id = application.id
      this.deptName = application.deptName
      let obj = {}
      Object.keys(application).forEach((key) => {
        this.form.getFieldDecorator(key)
        obj[key] = application[key]
      })
      obj['createDate'] = moment(obj['createDate'])
      this.form.setFieldsValue(obj)
      // this.form.getFieldDecorator('createDate')
      // this.form.setFieldsValue({'createDate': moment(application.createDate)})
    },
    handleSubmit () {
      this.form.validateFields((err, values) => {
        if (!err) {
          this.editLoading = true
          let planList = JSON.stringify(this.dataSource)
          this.$put('application', {
            ...values,
            createDate: values.createDate.format('YYYY-MM-DD'),
            planList: planList,
            id: this.id
          }).then((r) => {
            this.editLoading = false
            this.reset()
            this.$emit('success')
          }).catch(() => {
            this.editLoading = false
          })
        }
      })
    }
  },
  watch: {
    applicationEditVisiable () {
      if (this.applicationEditVisiable) {
        this.loading = true
        this.$get('application/applicationPlan', {
          applicationId: this.id
        }).then((r) => {
          this.loading = false
          this.setTableValues(r.data)
        })
      }
    }
  }
}
</script>
