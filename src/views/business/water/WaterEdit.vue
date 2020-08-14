<template>
  <a-drawer
    title="修改水费信息"
    :maskClosable="false"
    width=650
    placement="right"
    :closable="false"
    @close="onClose"
    :visible="waterEditVisiable"
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
          :max="100000"
          :precision="4"
          :formatter="value => value"
          style="width: 100%;"
          placeholder='单价(金额合计/实际用量)'
          v-decorator="['unitPrice',
            {rules: [{ required: true, message: '单价不能为空'}]}
          ]"/>
      </a-form-item>
      <a-form-item label='自来水费' v-bind="formItemLayout">
        <a-input-number
          :min="0"
          :max="100000"
          :precision="2"
          :formatter="value => value"
          style="width: 100%;"
          placeholder='自来水费'
          v-decorator="['tapWaterFee',
            {rules: [{ required: true, message: '自来水费不能为空'}]}
          ]"/>
      </a-form-item>
      <a-form-item label='水资源费' v-bind="formItemLayout">
        <a-input-number
          :min="0"
          :max="100000"
          :precision="2"
          :formatter="value => value"
          style="width: 100%;"
          placeholder='水资源费'
          v-decorator="['waterResourcesFee',
            {rules: [{ required: true, message: '水资源费不能为空'}]}
          ]"/>
      </a-form-item>
      <a-form-item label='污水费' v-bind="formItemLayout">
        <a-input-number
          :min="0"
          :max="100000"
          :precision="2"
          :formatter="value => value"
          style="width: 100%;"
          placeholder='污水费'
          v-decorator="['sewageFee',
            {rules: [{ required: true, message: '污水费不能为空'}]}
          ]"/>
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
import moment from 'moment'
import WcList from '../wc/WCList'
moment.locale('zh-cn')
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 17 }
}
export default {
  name: 'WaterEdit',
  components: { WcList },
  props: {
    waterEditVisiable: {
      default: false
    }
  },
  data () {
    return {
      loading: false,
      formItemLayout,
      form: this.$form.createForm(this),
      wcList: {
        visiable: false
      },
      wcId: '',
      waterId: ''
    }
  },
  methods: {
    reset () {
      this.loading = false
      this.wcId = ''
      this.waterId = ''
      // 清空表单
      this.form.resetFields()
    },
    setFormValues ({...water}) {
      this.waterId = water.waterId
      let fields = ['createTime', 'modifyTime']
      let obj = {}
      Object.keys(water).forEach((key) => {
        if (fields.indexOf(key) === -1) {
          this.form.getFieldDecorator(key)
          obj[key] = water[key]
        }
      })
      this.form.getFieldDecorator('date')
      const date = water.year + '-' + water.month
      obj['date'] = moment(date)
      this.form.setFieldsValue(obj)
    },
    onClose () {
      this.reset()
      this.$emit('close')
    },
    onActualAmountChange (value) {
      const totalAmount = this.form.getFieldValue('totalAmount')
      if (typeof totalAmount === 'number' && typeof value === 'number') {
        this.form.getFieldDecorator('unitPrice')
        this.form.setFieldsValue({ 'unitPrice': this.$tools.rounding(this.$tools.accDivide(totalAmount, value), 4) })
      }
    },
    onTotalAmountChange (value) {
      const actualAmount = this.form.getFieldValue('actualAmount')
      if (typeof value === 'number' && typeof actualAmount === 'number') {
        this.form.getFieldDecorator('unitPrice')
        this.form.setFieldsValue({ 'unitPrice': this.$tools.rounding(this.$tools.accDivide(value, actualAmount), 4) })
      }
    },
    handleWcListChange (wcName, wcNum, wcId) {
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
          const date = values['date'].format('YYYY-MM').split('-')
          const waterData = {
            ...values,
            wcId: this.wcId,
            waterId: this.waterId,
            year: date[0],
            month: date[1]
          }
          this.loading = true
          this.$put('water', {
            ...waterData
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
  }
}
</script>
