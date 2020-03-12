<template>
  <a-drawer
    title="修改电动三轮车"
    :maskClosable="false"
    width=650
    placement="right"
    :closable="false"
    @close="onClose"
    :visible="carElectricThreeEditVisiable"
    style="height: calc(100% - 55px);overflow: auto;padding-bottom: 53px;">
    <a-form :form="form">
      <a-form-item label='车辆类型' v-bind="formItemLayout">
        <a-input
          placeholder='车辆类型'
          autocomplete="off"
          autoFocus
          v-decorator="['carType']"/>
      </a-form-item>
      <a-form-item label='车辆品牌' v-bind="formItemLayout">
        <a-input
          placeholder='车辆品牌'
          autocomplete="off"
          v-decorator="['carBrands']"/>
      </a-form-item>
      <a-form-item label='钢架号' v-bind="formItemLayout">
        <a-input
          placeholder='钢架号'
          autocomplete="off"
          v-decorator="['steelFrameNumber']"/>
      </a-form-item>
      <a-form-item label='电机号' v-bind="formItemLayout">
        <a-input
          placeholder='电机号'
          autocomplete="off"
          v-decorator="['motorNumber']"/>
      </a-form-item>
      <a-form-item label='车牌号' v-bind="formItemLayout">
        <a-input
          placeholder='车牌号'
          autocomplete="off"
          v-decorator="['carNumber',
            {rules: [{ required: true, message: '车牌号不能为空'}]}
          ]"/>
      </a-form-item>
      <a-form-item label='使用人' v-bind="formItemLayout">
        <a-input
          placeholder='使用人'
          autocomplete="off"
          v-decorator="['user',
            {rules: [{ required: true, message: '使用人不能为空'}]}
          ]"/>
      </a-form-item>
      <a-form-item label='使用部门' v-bind="formItemLayout">
        <a-input
          placeholder='使用部门'
          autocomplete="off"
          v-decorator="['useDeptName',
            {rules: [{ required: true, message: '使用部门不能为空'}]}
          ]"/>
      </a-form-item>
      <a-form-item label='车辆配发日期' v-bind="formItemLayout">
        <a-date-picker
          placeholder='车辆日期'
          format='YYYY-MM-DD'
          style="width: 100%;"
          v-decorator="['carAllotmentDate']"
        />
      </a-form-item>
      <a-form-item label='电池数量' v-bind="formItemLayout">
        <a-input
          placeholder='电池数量'
          autocomplete="off"
          v-decorator="['batteryNumber']"
        />
      </a-form-item>
      <a-form-item label='电一日期' v-bind="formItemLayout">
        <a-date-picker
          placeholder='电池一更换日期'
          format='YYYY-MM-DD'
          style="width: 100%;"
          v-decorator="['batteryReplacementDate1']"
        />
      </a-form-item>
      <a-form-item label='电二日期' v-bind="formItemLayout">
        <a-date-picker
          placeholder='电池二更换日期'
          format='YYYY-MM-DD'
          style="width: 100%;"
          v-decorator="['batteryReplacementDate2']"
        />
      </a-form-item>
      <a-form-item label='是否临牌' v-bind="formItemLayout">
        <a-radio-group
          v-decorator="['ifLicense',
            {rules: [{ required: true, message: '请选择是否临牌'}]}
          ]">
          <a-radio-button value="1">是</a-radio-button>
          <a-radio-button value="2">否</a-radio-button>
        </a-radio-group>
      </a-form-item>
      <a-form-item label='存储地点' v-bind="formItemLayout">
        <a-input
          placeholder='存储地点'
          autocomplete="off"
          v-decorator="['storageLocation']"
        />
      </a-form-item>
      <a-form-item label='状态' v-bind="formItemLayout">
        <a-radio-group
          v-decorator="['status',
            {rules: [{ required: true, message: '请选择状态'}]}
          ]">
          <a-radio-button value="1">正常</a-radio-button>
          <a-radio-button value="2">损坏</a-radio-button>
        </a-radio-group>
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
  name: 'CarElectricThreeEdit',
  props: {
    carElectricThreeEditVisiable: {
      default: false
    }
  },
  data () {
    return {
      id: null,
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
    setFormValues ({...carElectricThree}) {
      this.id = carElectricThree.id
      let fields = ['carAllotmentDate', 'batteryReplacementDate1', 'batteryReplacementDate2']
      let forbids = ['createTime', 'modifyTime']
      let obj = {}
      Object.keys(carElectricThree).forEach((key) => {
        if (forbids.indexOf(key) === -1) {
          this.form.getFieldDecorator(key)
          obj[key] = carElectricThree[key]
        }
      })
      // 把时间类型插件的数据用moment包装一下
      fields.forEach((item) => {
        if (obj[item]) obj[item] = moment(obj[item])
      })
      this.form.setFieldsValue(obj)
    },
    handleSubmit () {
      this.form.validateFields((err, values) => {
        if (!err) {
          let fields = ['carAllotmentDate', 'batteryReplacementDate1', 'batteryReplacementDate2']
          fields.forEach((item) => {
            if (values[item]) values[item] = values[item].format('YYYY-MM-DD')
          })
          this.loading = true
          this.$put('carElectric', {
            ...values,
            id: this.id
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
