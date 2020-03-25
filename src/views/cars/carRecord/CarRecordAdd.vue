<template>
  <a-drawer
    title="新增车辆维修保养"
    :maskClosable="false"
    width=650
    placement="right"
    :closable="false"
    @close="onClose"
    :visible="carRecordAddVisiable"
    style="height: calc(100% - 55px);overflow: auto;padding-bottom: 53px;">
    <a-form :form="form">
      <a-form-item label='车牌号' v-bind="formItemLayout">
        <a-input
          @click="selectCarNum"
          readOnly
          autoFocus
          placeholder='车牌号'
          autocomplete="off"
          v-decorator="['carNum',
            {rules: [{ required: true, message: '请选择车牌号'}]}
          ]"/>
      </a-form-item>
      <a-form-item label='日期' v-bind="formItemLayout">
        <a-date-picker
          placeholder='日期'
          format='YYYY-MM-DD'
          style="width: 100%;"
          v-decorator="['date',
            {rules: [{ required: true, message: '日期不能为空'}]}
          ]"
        />
      </a-form-item>
      <a-form-item label='车辆状态' v-bind="formItemLayout">
        <a-select
          placeholder='送检前/后车辆状况'
          v-decorator="['type', {
            initialValue: [dictData.type && JSON.stringify(dictData.type) !== '{}' ? Object.keys(dictData.type)[0] : ''],
            rules: [{ required: true, message: '请选择车辆状态' }]
          }]">
          <a-select-option v-for="i in Object.keys(dictData.type || [])" :key="i">{{ dictData.type[i] }}</a-select-option>
        </a-select>
        <!-- <a-select
          placeholder='送检前/后车辆状况'
          v-decorator="['type',
            {rules: [{ required: true, message: '请选择车辆状态' }]}
          ]">
          <a-select-option v-for="i in dictData.type" :key="i.key">{{ i.value }}</a-select-option>
        </a-select> -->
      </a-form-item>
      <a-form-item label='维修方' v-bind="formItemLayout">
        <a-input
          placeholder='维修方'
          autocomplete="off"
          v-decorator="['reporter',
            {rules: [{required: true, message: '维修方不能为空'}]}
          ]"/>
      </a-form-item>
      <a-form-item label='驾驶员' v-bind="formItemLayout">
        <a-input
          placeholder='驾驶员'
          autocomplete="off"
          v-decorator="['dirver',
            {rules: [{required: true, message: '驾驶员不能为空'}]}
          ]"/>
      </a-form-item>
      <a-form-item label='送检事由' v-bind="formItemLayout">
        <a-textarea
          placeholder='送检事由'
          autocomplete="off"
          v-decorator="['cause',
            {rules: [{required: true, message: '送检事由不能为空'}]}
          ]"
        />
      </a-form-item>
      <a-form-item label='备注' v-bind="formItemLayout">
        <a-textarea
          placeholder='备注'
          autocomplete="off"
          v-decorator="['remark',
            {rules: [{required: true, message: '备注不能为空'}]}
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
    <car-list
      :carListVisiable="carList.visiable"
      @change="handleCarListChange"
      @close="handleCarListClose"
    >
    </car-list>
  </a-drawer>
</template>
<script>
import CarList from '../car/CarList'
import moment from 'moment'
moment.locale('zh-cn')
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 17 }
}
export default {
  name: 'CarRecordAdd',
  components: { CarList },
  props: {
    carRecordAddVisiable: {
      default: false
    },
    dictData: {
      require: true
    }
  },
  data () {
    return {
      loading: false,
      formItemLayout,
      form: this.$form.createForm(this),
      carList: {
        visiable: false
      },
      carId: null
    }
  },
  methods: {
    reset () {
      this.loading = false
      // 清空表单
      this.form.resetFields()
    },
    onClose () {
      this.reset()
      this.$emit('close')
    },
    handleCarListChange (carNum, carId) {
      this.form.getFieldDecorator('carNum')
      this.form.setFieldsValue({ 'carNum': carNum })
      this.carId = carId
    },
    handleCarListClose () {
      this.carList.visiable = false
    },
    selectCarNum () {
      this.carList.visiable = true
    },
    handleSubmit () {
      this.form.validateFields((err, values) => {
        if (!err) {
          const date = values['date']
          this.loading = true
          this.$post('carRecord', {
            ...values,
            date: date ? date.format('YYYY-MM-DD') : date,
            carId: this.carId
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
    carRecordAddVisiable () {
      if (this.carRecordAddVisiable) {
        this.form.getFieldDecorator('date')
        this.form.setFieldsValue({'date': moment(new Date())})
      }
    }
  }
}
</script>
