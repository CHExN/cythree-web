<template>
  <a-drawer
    title="新增灭火器"
    :maskClosable="false"
    width=650
    placement="right"
    :closable="false"
    @close="onClose"
    :visible="fireExtinguisherAddVisiable"
    style="height: calc(100% - 55px);overflow: auto;padding-bottom: 53px;">
    <a-form :form="form">
      <a-form-item label='资产名称' v-bind="formItemLayout">
        <a-input
          placeholder='资产名称'
          autocomplete="off"
          autoFocus
          v-decorator="['assetName']"/>
      </a-form-item>
      <a-form-item label='品牌型号' v-bind="formItemLayout">
        <a-input
          placeholder='品牌型号'
          autocomplete="off"
          v-decorator="['brandModel']"/>
      </a-form-item>
      <a-form-item label='配发日期1' v-bind="formItemLayout">
        <a-date-picker
          placeholder='配发日期1'
          format='YYYY-MM-DD'
          style="width: 100%;"
          v-decorator="['allotmentDate1']"
        />
      </a-form-item>
      <a-form-item label='配发日期2' v-bind="formItemLayout">
        <a-date-picker
          placeholder='配发日期2'
          format='YYYY-MM-DD'
          style="width: 100%;"
          v-decorator="['allotmentDate2']"
        />
      </a-form-item>
      <a-form-item label='责任人' v-bind="formItemLayout">
        <a-input
          placeholder='责任人'
          autocomplete="off"
          v-decorator="['user',
            {rules: [{ required: true, message: '责任人不能为空'}]}
          ]"/>
      </a-form-item>
      <a-form-item label='检测日期1' v-bind="formItemLayout">
        <a-date-picker
          placeholder='检测日期1'
          format='YYYY-MM-DD'
          style="width: 100%;"
          v-decorator="['testDate1']"
        />
      </a-form-item>
      <a-form-item label='检测日期2' v-bind="formItemLayout">
        <a-date-picker
          placeholder='检测日期2'
          format='YYYY-MM-DD'
          style="width: 100%;"
          v-decorator="['testDate2']"
        />
      </a-form-item>
      <a-form-item label='选择公厕' v-bind="formItemLayout">
        <a-input
          @click="selectWc"
          readOnly
          placeholder='公厕'
          autocomplete="off"
          v-decorator="['wcName',
            {rules: [{ required: true, message: '请选择公厕'}]}
          ]"/>
      </a-form-item>
      <a-form-item label='规格1' v-bind="formItemLayout">
        <a-input
          placeholder='规格1'
          autocomplete="off"
          v-decorator="['specification1']"
        />
      </a-form-item>
      <a-form-item label='规格2' v-bind="formItemLayout">
        <a-input
          placeholder='规格2'
          autocomplete="off"
          v-decorator="['specification2']"
        />
      </a-form-item>
      <a-form-item label='摆放地点' v-bind="formItemLayout">
        <a-input
          placeholder='摆放地点'
          autocomplete="off"
          v-decorator="['place']"
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
    <wc-list
      :wcListVisiable="wcList.visiable"
      @change="handleWcListChange"
      @close="handleWcListClose"
    >
    </wc-list>
  </a-drawer>
</template>
<script>
import WcList from '../../business/wc/WCList'
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 17 }
}
export default {
  name: 'FireExtinguisherAdd',
  components: { WcList },
  props: {
    fireExtinguisherAddVisiable: {
      default: false
    }
  },
  data () {
    return {
      loading: false,
      formItemLayout,
      wcList: {
        visiable: false
      },
      wcNum: null,
      form: this.$form.createForm(this)
    }
  },
  methods: {
    reset () {
      this.loading = false
      this.wcNum = null
      // 清空表单
      this.form.resetFields()
    },
    onClose () {
      this.reset()
      this.$emit('close')
    },
    selectWc () {
      this.wcList.visiable = true
    },
    handleWcListChange (wcName, wcNum) {
      this.form.getFieldDecorator('wcName')
      this.form.setFieldsValue({ 'wcName': wcName })
      this.wcNum = wcNum
    },
    handleWcListClose () {
      this.wcList.visiable = false
    },
    handleSubmit () {
      this.form.validateFields((err, values) => {
        if (!err) {
          let fields = ['allotmentDate1', 'allotmentDate2', 'testDate1', 'testDate2']
          fields.forEach((item) => {
            if (values[item]) values[item] = values[item].format('YYYY-MM-DD')
          })
          this.loading = true
          this.$post('fireExtinguisher', {
            ...values,
            wcNum: this.wcNum
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
