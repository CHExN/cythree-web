<template>
  <a-drawer
    title="修改电费信息"
    :maskClosable="false"
    width=650
    placement="right"
    :closable="false"
    @close="onClose"
    :visible="electricityEditVisiable"
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
  name: 'ElectricityEdit',
  components: { WcList },
  props: {
    electricityEditVisiable: {
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
      electricityId: ''
    }
  },
  methods: {
    filterOption (input, option) {
      return option.componentOptions.children[0].text.toUpperCase().indexOf(input.toUpperCase()) >= 0
    },
    reset () {
      this.loading = false
      this.wcId = ''
      // 清空表单
      this.form.resetFields()
    },
    setFormValues ({...electricity}) {
      this.electricityId = electricity.electricityId
      let fields = ['createTime', 'modifyTime']
      let obj = {}
      Object.keys(electricity).forEach((key) => {
        if (fields.indexOf(key) === -1) {
          this.form.getFieldDecorator(key)
          obj[key] = electricity[key]
        }
      })
      // 把时间类型插件的数据用moment包装一下
      obj['recDate'] = moment(obj['recDate'])
      this.form.getFieldDecorator('date')
      const date = electricity.year + '-' + electricity.month
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
          const recDate = values['recDate']
          const electricityData = {
            ...values,
            wcId: this.wcId,
            electricityId: this.electricityId,
            year: date[0],
            month: date[1],
            recDate: recDate ? new Date(recDate) : recDate
          }
          this.loading = true
          this.$put('electricity', {
            ...electricityData
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
