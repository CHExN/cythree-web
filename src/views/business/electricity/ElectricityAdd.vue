<template>
  <a-drawer
    title="新增电费信息"
    :maskClosable="false"
    width=650
    placement="right"
    :closable="false"
    @close="onClose"
    :visible="electricityAddVisiable"
    style="height: calc(100% - 55px);overflow: auto;padding-bottom: 53px;">
    <a-form :form="form">
      <a-form-item label='选择公厕' v-bind="formItemLayout">
        <a-input
          @click="selectWc"
          readOnly
          autoFocus
          placeholder='公厕'
          autocomplete="off"
          v-decorator="['wcName',
            {rules: [{ required: true, message: '请选择公厕'}]}
          ]"/>
      </a-form-item>
      <a-form-item label='月份' v-bind="formItemLayout">
        <a-month-picker
          placeholder='月份'
          autocomplete="off"
          style="width: 100%;"
          v-decorator="['date',
            {rules: [{ required: true, message: '请选择月份'}]}
          ]"/>
      </a-form-item>
      <a-form-item label='实际用量' v-bind="formItemLayout">
        <a-input-number
          @change="onActualAmountChange"
          :min="0.01"
          :max="100000"
          :precision="2"
          :formatter="value => value"
          style="width: 100%;"
          placeholder='实际用量'
          v-decorator="['actualAmount',
            {rules: [{ required: true, message: '实际用量不能为空'}]}
          ]"/>
      </a-form-item>
      <a-form-item label='单价' v-bind="formItemLayout">
        <a-input-number
          :min="0.01"
          :max="100"
          :precision="4"
          :formatter="value => value"
          style="width: 100%;"
          placeholder='单价(元/度)（金额/用量）'
          v-decorator="['unitPrice',
            {rules: [{ required: true, message: '单价不能为空'}]}
          ]"/>
      </a-form-item>
      <a-form-item label='购电方式' v-bind="formItemLayout">
        <a-auto-complete
          :dataSource="dataSource"
          :filterOption="filterOption"
          :allowClear="true"
          placeholder="购电方式"
          v-decorator="['type',
            {rules: [{ required: true, message: '购电方式不能为空'}]}
          ]"
        />
      </a-form-item>
      <a-form-item label='缴费日期' v-bind="formItemLayout">
        <a-date-picker
          placeholder='缴费日期'
          format='YYYY-MM-DD'
          style="width: 100%;"
          v-decorator="['recDate',
            {rules: [{ required: true, message: '缴费日期不能为空'}]}
          ]"
        />
      </a-form-item>
      <a-form-item label='金额合计' v-bind="formItemLayout">
        <a-input-number
          @change="onTotalAmountChange"
          :min="0.01"
          :max="100000"
          :precision="2"
          :formatter="value => value"
          style="width: 100%;"
          placeholder='金额合计'
          v-decorator="['totalAmount',
            {rules: [{ required: true, message: '金额合计不能为空'}]}
          ]"/>
      </a-form-item>
      <a-form-item label='登记日期' v-bind="formItemLayout">
        <a-date-picker
          placeholder='登记日期'
          format='YYYY-MM-DD'
          style="width: 100%;"
          v-decorator="['createDate',
            {rules: [{ required: true, message: '登记日期不能为空'}]}
          ]"
        />
      </a-form-item>
    </a-form>
    <div class="drawer-bootom-button">
      <a-popconfirm title="确定放弃编辑？" @confirm="onClose" okText="确定" cancelText="取消">
        <a-button style="margin-right: .8rem">取消</a-button>
      </a-popconfirm>
      <a-button @click="handleSubmit" type="primary" :loading="loading">提交</a-button>
    </div>
    <wc-list
      :wcListVisiable="wcList.visiable"
      @change="handleWcListChange"
      @close="handleWcListClose"
    >
    </wc-list>
  </a-drawer>
</template>
<script>
import WcList from '../wc/WCListByElectricityNum'
import moment from 'moment'
moment.locale('zh-cn')
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 17 }
}
export default {
  name: 'ElectricityAdd',
  components: { WcList },
  props: {
    electricityAddVisiable: {
      default: false
    }
  },
  data () {
    return {
      loading: false,
      formItemLayout,
      form: this.$form.createForm(this),
      dataSource: ['电费', '电卡', '缴费', '外交', '现金'],
      wcList: {
        visiable: false
      },
      wcId: '',
      actualAmount: 0,
      totalAmount: 0
    }
  },
  methods: {
    filterOption (input, option) {
      return option.componentOptions.children[0].text.toUpperCase().indexOf(input.toUpperCase()) >= 0
    },
    reset () {
      this.loading = false
      this.wcId = ''
      this.actualAmount = 0
      this.totalAmount = 0
      // 清空表单
      this.form.resetFields()
    },
    onClose () {
      this.reset()
      this.$emit('close')
    },
    onActualAmountChange (value) {
      this.actualAmount = value
      if (typeof this.totalAmount === 'number' && typeof this.actualAmount === 'number') {
        this.form.getFieldDecorator('unitPrice')
        this.form.setFieldsValue({ 'unitPrice': this.totalAmount / this.actualAmount })
      }
    },
    onTotalAmountChange (value) {
      this.totalAmount = value
      if (typeof this.totalAmount === 'number' && typeof this.actualAmount === 'number') {
        this.form.getFieldDecorator('unitPrice')
        this.form.setFieldsValue({ 'unitPrice': this.totalAmount / this.actualAmount })
      }
    },
    handleWcListChange (wcName, wcId) {
      this.form.getFieldDecorator('wcName')
      this.form.setFieldsValue({ 'wcName': wcName })
      this.wcId = wcId
    },
    handleWcListClose () {
      this.wcList.visiable = false
    },
    selectWc () {
      this.wcList.visiable = true
    },
    handleSubmit () {
      this.form.validateFields((err, values) => {
        if (!err) {
          const date = values['date']
          const createDate = values['createDate']
          const recDate = values['recDate']
          const electricityData = {
            ...values,
            'date': date ? date.format('YYYY-MM-DD') : date,
            'createDate': createDate ? new Date(createDate) : createDate,
            'recDate': recDate ? new Date(recDate) : recDate
          }
          this.loading = true
          this.$post('electricity', {
            ...electricityData,
            wcId: this.wcId
          }).then((r) => {
            this.reset()
            this.$emit('success')
          }).catch(() => {
            this.loading = false
          })
        } else {
          this.$message.warning('格式出错，请检查表单')
        }
      })
    }
  },
  watch: {
    electricityAddVisiable () {
      if (this.electricityAddVisiable) {
        let obj = {}
        const fields = ['date', 'createDate', 'recDate']
        fields.forEach((item) => {
          this.form.getFieldDecorator(item)
          obj[item] = moment()
        })
        this.form.setFieldsValue(obj)
      }
    }
  }
}
</script>
