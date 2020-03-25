<template>
  <a-drawer
    title="新增派车"
    :maskClosable="false"
    width=650
    placement="right"
    :closable="false"
    @close="onClose"
    :visible="carSendAddVisiable"
    style="height: calc(100% - 55px);overflow: auto;padding-bottom: 53px;">
    <a-form :form="form">
      <a-form-item label='事由' v-bind="formItemLayout">
        <a-textarea
          autoFocus
          placeholder='事由'
          autocomplete="off"
          v-decorator="['remark',
            {rules: [{ required: true, message: '事由不能为空'}]}
          ]"/>
      </a-form-item>
      <a-form-item v-hasPermission="'carSend:send'" label='车牌号' v-bind="formItemLayout">
        <a-input
          @click="selectCarNum"
          readOnly
          placeholder='车牌号'
          autocomplete="off"
          v-decorator="['carNum']"/>
      </a-form-item>
      <a-form-item v-hasPermission="'carSend:send'" label='司机' v-bind="formItemLayout">
        <a-input
          placeholder='司机'
          autocomplete="off"
          v-decorator="['driver']"/>
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

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 17 }
}
export default {
  name: 'CarSendAdd',
  components: { CarList },
  props: {
    carSendAddVisiable: {
      default: false
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
      this.carId = null
      this.loading = false
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
          this.loading = true
          this.$post('carSend', {
            ...values,
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
  }
}
</script>
