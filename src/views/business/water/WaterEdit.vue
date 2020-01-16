<template>
  <a-drawer
    title="新增水费信息"
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
          @change="onUnitPriceChange"
          :min="0.01"
          :max="100"
          :precision="4"
          :formatter="value => value"
          style="width: 100%;"
          placeholder='单价(元/吨)'
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
          :min="0.01"
          :max="100000"
          :precision="2"
          :formatter="value => value"
          style="width: 100%;"
          placeholder='金额合计（实际用量*单价）'
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
import moment from 'moment'
import WcList from '../wc/WCListByWaterNum'
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
      waterId: '',
      actualAmount: 0,
      unitPrice: 0
    }
  },
  methods: {
    reset () {
      this.loading = false
      // 清空表单
      this.form.resetFields()
    },
    setFormValues ({...water}) {
      this.waterId = water.waterId
      let obj = {}
      Object.keys(water).forEach((key) => {
        this.form.getFieldDecorator(key)
        obj[key] = water[key]
      })
      // 把时间类型插件的数据用moment包装一下
      obj['createDate'] = moment(obj['createDate'])
      const date = water.year + '-' + water.month
      obj['date'] = moment(date)
      this.form.setFieldsValue(obj)
    },
    onClose () {
      this.reset()
      this.$emit('close')
    },
    onActualAmountChange (value) {
      this.actualAmount = value
      if (typeof this.unitPrice === 'number' && typeof this.actualAmount === 'number') {
        this.form.getFieldDecorator('totalAmount')
        this.form.setFieldsValue({ 'totalAmount': this.unitPrice * this.actualAmount })
      }
    },
    onUnitPriceChange (value) {
      this.unitPrice = value
      if (typeof this.unitPrice === 'number' && typeof this.actualAmount === 'number') {
        this.form.getFieldDecorator('totalAmount')
        this.form.setFieldsValue({ 'totalAmount': this.unitPrice * this.actualAmount })
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
          const waterData = {
            ...values,
            'date': date ? date.format('YYYY-MM-DD') : date,
            'createDate': createDate ? new Date(createDate) : createDate
          }
          this.loading = true
          this.$put('water', {
            ...waterData,
            wcId: this.wcId,
            waterId: this.waterId
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
