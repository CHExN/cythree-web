<template>
  <a-drawer
    title="修改车辆"
    :maskClosable="false"
    width=650
    placement="right"
    :closable="false"
    @close="onClose"
    :visible="carEditVisiable"
    style="height: calc(100% - 55px);overflow: auto;padding-bottom: 53px;">
    <a-form :form="form">
      <a-form-item label='车牌号' v-bind="formItemLayout">
        <a-input
          placeholder='车牌号'
          autocomplete="off"
          autoFocus
          v-decorator="['carNum',
            {rules: [{ required: true, message: '车牌号不能为空'}]}
          ]"/>
      </a-form-item>
      <a-form-item label='车辆品牌' v-bind="formItemLayout">
        <a-input
          placeholder='车辆品牌'
          autocomplete="off"
          v-decorator="['carType',
            {rules: [{ required: true, message: '车辆品牌不能为空'}]}
          ]"/>
      </a-form-item>
      <a-form-item label='车牌颜色' v-bind="formItemLayout">
        <a-radio-group
          v-decorator="['color',
            {rules: [{ required: true, message: '请选择车辆颜色'}]}
          ]">
          <a-radio-button value="1">黄</a-radio-button>
          <a-radio-button value="2">蓝</a-radio-button>
        </a-radio-group>
      </a-form-item>
      <a-form-item label='车辆状态' v-bind="formItemLayout">
        <a-radio-group
          v-decorator="['status',
            {rules: [{ required: true, message: '请选择车辆状态'}]}
          ]">
          <a-radio-button value="1">行驶</a-radio-button>
          <a-radio-button value="2">停驶</a-radio-button>
        </a-radio-group>
      </a-form-item>
      <a-form-item label='汽车排量' v-bind="formItemLayout">
        <a-input
          placeholder='汽车排量'
          autocomplete="off"
          v-decorator="['carDisplacement']"
        />
      </a-form-item>
      <a-form-item label='车辆种类' v-bind="formItemLayout">
        <a-auto-complete
          :dataSource="carKindData"
          :allowClear='true'
          :filterOption="filterOption"
          placeholder="车辆种类"
          v-decorator="['carKind',
            {rules: [{ required: true, message: '车辆种类不能为空'}]}
          ]"/>
      </a-form-item>
      <a-form-item label='车辆用途' v-bind="formItemLayout">
        <a-auto-complete
          :dataSource="carUseData"
          :allowClear='true'
          :filterOption="filterOption"
          placeholder="车辆用途"
          v-decorator="['carUse',
            {rules: [{ required: true, message: '车辆用途不能为空'}]}
          ]"/>
      </a-form-item>
      <a-form-item label='车辆日期' v-bind="formItemLayout">
        <a-date-picker
          placeholder='车辆日期'
          format='YYYY-MM-DD'
          style="width: 100%;"
          v-decorator="['date']"
        />
      </a-form-item>
      <a-form-item label='使用单位' v-bind="formItemLayout">
        <a-input
          placeholder='车辆使用单位'
          autocomplete="off"
          v-decorator="['carUseUnit']"
        />
      </a-form-item>
      <a-form-item label='所属单位' v-bind="formItemLayout">
        <a-input
          placeholder='车辆所属单位'
          autocomplete="off"
          v-decorator="['carUnit']"
        />
      </a-form-item>
      <a-form-item label='原始牌照' v-bind="formItemLayout">
        <a-input
          placeholder='原始牌照'
          autocomplete="off"
          v-decorator="['carNumOld']"
        />
      </a-form-item>
      <a-form-item label='卡号' v-bind="formItemLayout">
        <a-input
          placeholder='加油卡号'
          autocomplete="off"
          v-decorator="['cardNum']"
        />
      </a-form-item>
      <a-form-item label='备注' v-bind="formItemLayout">
        <a-textarea
          placeholder='备注'
          autocomplete="off"
          v-decorator="['remark']"
        />
      </a-form-item>
    </a-form>
    <div class="drawer-bootom-button">
      <a-popconfirm title="确定放弃编辑？" @confirm="onClose" okText="确定" cancelText="取消">
        <a-button style="margin-right: .8rem">取消</a-button>
      </a-popconfirm>
      <a-button @click="handleSubmit" type="primary" :loading="loading">提交</a-button>
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
  name: 'CarEdit',
  props: {
    carEditVisiable: {
      default: false
    },
    carKindData: {
      require: true
    },
    carUseData: {
      require: true
    }
  },
  data () {
    return {
      carId: '',
      loading: false,
      formItemLayout,
      form: this.$form.createForm(this)
    }
  },
  methods: {
    onClose () {
      this.loading = false
      this.form.resetFields()
      this.$emit('close')
    },
    setFormValues ({...car}) {
      this.carId = car.carId
      let fields = ['date']
      let obj = {}
      Object.keys(car).forEach((key) => {
        this.form.getFieldDecorator(key)
        obj[key] = car[key]
      })
      // 把时间类型插件的数据用moment包装一下
      fields.forEach((item) => {
        if (obj[item]) { obj[item] = moment(obj[item]) }
      })
      this.form.setFieldsValue(obj)
    },
    handleSubmit () {
      this.form.validateFields((err, values) => {
        if (!err) {
          const carDate = values['date']
          const carData = {
            ...values,
            'carId': this.carId,
            'date': carDate ? carDate.format('YYYY-MM-DD') : carDate
          }
          this.loading = true
          this.$put('car', {
            ...carData
          }).then((r) => {
            this.loading = false
            this.$emit('success')
          }).catch(() => {
            this.loading = false
          })
        } else {
          this.$message.warning('格式出错，请检查表单')
        }
      })
    },
    filterOption (input, option) {
      return option.componentOptions.children[0].text.toUpperCase().indexOf(input.toUpperCase()) >= 0
    }
  }
}
</script>
