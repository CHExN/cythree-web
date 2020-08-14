<template>
  <a-drawer
    title="修改固定资产验收信息"
    :maskClosable="false"
    width=650
    placement="right"
    :closable="false"
    @close="onClose"
    :visible="fixedAssetsAcceptanceEditVisiable"
    style="height: calc(100% - 55px);overflow: auto;padding-bottom: 53px;">
    <a-form :form="form">
      <a-form-item label='项目名称' v-bind="formItemLayout">
        <a-input
          autoFocus
          placeholder='项目名称'
          autocomplete="off"
          v-decorator="['name',
            {rules: [{ required: true, message: '项目名称不能为空'}]}
          ]"/>
      </a-form-item>
      <a-form-item label='合同编号' v-bind="formItemLayout">
        <a-input
          placeholder='合同编号'
          autocomplete="off"
          v-decorator="['num']"/>
      </a-form-item>
      <a-form-item label='项目负责人' v-bind="formItemLayout">
        <a-input
          placeholder='项目负责人'
          autocomplete="off"
          v-decorator="['manager']"/>
      </a-form-item>
      <a-form-item label='合同金额' v-bind="formItemLayout">
        <a-input
          placeholder='合同金额'
          autocomplete="off"
          v-decorator="['money']"/>
      </a-form-item>
      <a-form-item label='实际金额' v-bind="formItemLayout">
        <a-input-number
          :min="0.01"
          :max="10000000"
          :precision="2"
          :formatter="value => value"
          style="width: 100%;"
          placeholder='实际金额'
          v-decorator="['moneyTrue']"/>
      </a-form-item>
      <a-form-item label='选择出库单' v-bind="formItemLayout">
        <a-input
          @click="selectStoreroomOutList"
          readOnly
          placeholder='出库单'
          autocomplete="off"
          v-decorator="['storeroomOutNum']"/>
      </a-form-item>
      <a-form-item label='是否有与合同不符的情况' v-bind="formItemRadioLayout">
        <a-radio-group
          style="width: 100%;"
          v-decorator="['isMatch']">
          <a-radio-button value="0">否</a-radio-button>
          <a-radio-button value="1">是</a-radio-button>
        </a-radio-group>
      </a-form-item>
      <a-form-item label='资产适用性能是否达到要求' v-bind="formItemRadioLayout">
        <a-radio-group
          style="width: 100%;"
          v-decorator="['isApplicability']">
          <a-radio-button value="0">否</a-radio-button>
          <a-radio-button value="1">是</a-radio-button>
        </a-radio-group>
      </a-form-item>
      <a-form-item label='资产技术指标是否与合同相符' v-bind="formItemRadioLayout">
        <a-radio-group
          style="width: 100%;"
          v-decorator="['isIndicators']">
          <a-radio-button value="0">否</a-radio-button>
          <a-radio-button value="1">是</a-radio-button>
        </a-radio-group>
      </a-form-item>
      <a-form-item label='资产配件是否与采购要求相符' v-bind="formItemRadioLayout">
        <a-radio-group
          style="width: 100%;"
          v-decorator="['isAccessories']">
          <a-radio-button value="0">否</a-radio-button>
          <a-radio-button value="1">是</a-radio-button>
        </a-radio-group>
      </a-form-item>
      <a-form-item label='资产是否全新完好' v-bind="formItemRadioLayout">
        <a-radio-group
          style="width: 100%;"
          v-decorator="['isNew']">
          <a-radio-button value="0">否</a-radio-button>
          <a-radio-button value="1">是</a-radio-button>
        </a-radio-group>
      </a-form-item>
      <a-form-item label='技术文档是否齐全' v-bind="formItemRadioLayout">
        <a-radio-group
          style="width: 100%;"
          v-decorator="['isComplete']">
          <a-radio-button value="0">否</a-radio-button>
          <a-radio-button value="1">是</a-radio-button>
        </a-radio-group>
      </a-form-item>

      <a-form-item label='过程情况' v-bind="formItemLayout">
        <a-textarea
          placeholder='资产在安装调试、试用过程中的情况'
          autocomplete="off"
          v-decorator="['remarkO']"/>
      </a-form-item>
      <a-form-item label='备注' v-bind="formItemLayout">
        <a-textarea
          placeholder='备注'
          autocomplete="off"
          v-decorator="['remark']"/>
      </a-form-item>
      <a-form-item label='资产存放点' v-bind="formItemLayout">
        <a-input
          placeholder='资产存放地点'
          autocomplete="off"
          v-decorator="['location']"/>
      </a-form-item>
      <a-form-item label='安装完成日期' v-bind="formItemLayout">
        <a-date-picker
          placeholder='安装完成日期'
          format='YYYY-MM-DD'
          style="width: 100%;"
          v-decorator="['installCompleteDate']"/>
      </a-form-item>
      <a-form-item label='验收日期' v-bind="formItemLayout">
        <a-date-picker
          placeholder='验收日期'
          format='YYYY-MM-DD'
          style="width: 100%;"
          v-decorator="['acceptanceDate']"/>
      </a-form-item>
      <a-form-item label='验收结果' v-bind="formItemLayout">
        <a-input
          placeholder='验收结果'
          autocomplete="off"
          v-decorator="['acceptanceResult']"/>
      </a-form-item>
    </a-form>
    <div class="drawer-bootom-button">
      <a-popconfirm title="确定放弃编辑？" @confirm="onClose" okText="确定" cancelText="取消">
        <a-button style="margin-right: .8rem">取消</a-button>
      </a-popconfirm>
      <a-button @click="handleSubmit" type="primary" :loading="loading">提交</a-button>
    </div>
    <storeroom-out-list
      :storeroomOutListVisiable="storeroomOutList.visiable"
      @change="handleStoreroomOutListChange"
      @close="handleStoreroomOutListClose"
    >
    </storeroom-out-list>
  </a-drawer>
</template>
<script>
import StoreroomOutList from '../storeroomOut/StoreroomOutList'
import moment from 'moment'
moment.locale('zh-cn')
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 17 }
}
const formItemRadioLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 14 }
}
export default {
  name: 'FixedAssetsAcceptanceEdit',
  components: { StoreroomOutList },
  props: {
    fixedAssetsAcceptanceEditVisiable: {
      default: false
    }
  },
  data () {
    return {
      loading: false,
      formItemLayout,
      formItemRadioLayout,
      form: this.$form.createForm(this),
      storeroomOutList: {
        visiable: false
      },
      id: null,
      storeroomOutId: null
    }
  },
  methods: {
    reset () {
      this.loading = false
      this.id = null
      this.storeroomOutId = null
      // 清空表单
      this.form.resetFields()
    },
    setFormValues ({...fixedAssetsAcceptance}) {
      this.id = fixedAssetsAcceptance.id
      let obj = {}
      Object.keys(fixedAssetsAcceptance).forEach((key) => {
        this.form.getFieldDecorator(key)
        obj[key] = fixedAssetsAcceptance[key]
      })
      // 把时间类型插件的数据用moment包装一下
      if (obj['installCompleteDate']) obj['installCompleteDate'] = moment(obj['installCompleteDate'])
      if (obj['acceptanceDate']) obj['acceptanceDate'] = moment(obj['acceptanceDate'])
      this.form.setFieldsValue(obj)
    },
    onClose () {
      this.reset()
      this.$emit('close')
    },
    handleStoreroomOutListChange (storeroomOutNum, storeroomOutId) {
      this.form.getFieldDecorator('storeroomOutNum')
      this.form.setFieldsValue({ 'storeroomOutNum': storeroomOutNum })
      this.storeroomOutId = storeroomOutId
    },
    handleStoreroomOutListClose () {
      this.storeroomOutList.visiable = false
    },
    selectStoreroomOutList () {
      this.storeroomOutList.visiable = true
    },
    handleSubmit () {
      this.form.validateFields((err, values) => {
        if (!err) {
          const installCompleteDate = values['installCompleteDate']
          const acceptanceDate = values['acceptanceDate']
          const fixedAssetsAcceptanceData = {
            ...values,
            'installCompleteDate': installCompleteDate ? installCompleteDate.format('YYYY-MM-DD') : installCompleteDate,
            'acceptanceDate': acceptanceDate ? acceptanceDate.format('YYYY-MM-DD') : acceptanceDate
          }
          this.loading = true
          this.$put('fixedAssetsAcceptance', {
            ...fixedAssetsAcceptanceData,
            storeroomOutId: this.storeroomOutId,
            id: this.id
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
