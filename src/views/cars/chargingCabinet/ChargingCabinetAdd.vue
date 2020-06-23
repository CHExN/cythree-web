<template>
  <a-drawer
    title="新增充电柜"
    :maskClosable="false"
    width=650
    placement="right"
    :closable="false"
    @close="onClose"
    :visible="chargingCabinetAddVisiable"
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
      <a-form-item label='配发日期' v-bind="formItemLayout">
        <a-date-picker
          placeholder='配发日期'
          format='YYYY-MM-DD'
          style="width: 100%;"
          v-decorator="['allotmentDate']"/>
      </a-form-item>
      <!-- <a-form-item label='编制类别' v-bind="formItemLayout">
        <a-radio-group @change="onRadioChange" v-decorator="['insideOrOutside',
          {initialValue: '1', rules: [{ required: true, message: '请选择编制类别' }]}
        ]">
          <a-radio-button value="0">编内</a-radio-button>
          <a-radio-button value="1">编外</a-radio-button>
        </a-radio-group>
      </a-form-item>
      <a-form-item label='责任人' v-bind="formItemLayout">
        <a-input
          @click="selectName"
          readOnly
          placeholder='责任人'
          autocomplete="off"
          v-decorator="['user',
            {rules: [{ required: true, message: '请选择责任人'}]}
          ]"/>
      </a-form-item> -->
      <a-form-item label='责任人' v-bind="formItemLayout">
        <a-input
          placeholder='责任人'
          autocomplete="off"
          v-decorator="['user',
            {rules: [{ required: true, message: '责任人不能为空'}]}
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
      <a-form-item label='充电端口数' v-bind="formItemLayout">
        <a-input
          placeholder='充电端口数'
          autocomplete="off"
          v-decorator="['chargingSectionsNumber']"
        />
      </a-form-item>
      <a-form-item label='能否充电' v-bind="formItemLayout">
        <a-radio-group
          v-decorator="['ifCharge',
            {rules: [{ required: true, message: '请选择能否充电'}]}
          ]">
          <a-radio-button value="1">能</a-radio-button>
          <a-radio-button value="2">否</a-radio-button>
        </a-radio-group>
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
    <!-- <staff-inside-list
      :staffInsideListVisiable="staffInsideList.visiable"
      @change="handleStaffInsideListChange"
      @close="handleStaffInsideListClose"
    >
    </staff-inside-list>
    <staff-outside-list
      :staffOutsideListVisiable="staffOutsideList.visiable"
      @change="handleStaffOutsideListChange"
      @close="handleStaffOutsideListClose"
    >
    </staff-outside-list> -->
  </a-drawer>
</template>
<script>
// import StaffInsideList from '../../personnel/staffInside/StaffInsideList'
// import StaffOutsideList from '../../personnel/staffOutside/StaffOutsideList'
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 17 }
}
export default {
  name: 'ChargingCabinetAdd',
  // components: { StaffInsideList, StaffOutsideList },
  props: {
    chargingCabinetAddVisiable: {
      default: false
    }
  },
  data () {
    return {
      loading: false,
      formItemLayout,
      form: this.$form.createForm(this),
      staffInsideList: {
        visiable: false
      },
      staffOutsideList: {
        visiable: false
      }
      // idNum: null
    }
  },
  methods: {
    reset () {
      this.loading = false
      // this.idNum = null
      // 清空表单
      this.form.resetFields()
    },
    onClose () {
      this.reset()
      this.$emit('close')
    },
    // onRadioChange (e) {
    //   // 切换radio时 重置选择人员
    //   this.form.getFieldDecorator('user')
    //   this.form.setFieldsValue({ user: '' })
    //   this.idNum = null
    // },
    // selectName () {
    //   let insideOrOutside = this.form.getFieldValue('insideOrOutside')
    //   if (insideOrOutside === '0') {
    //     this.staffInsideList.visiable = true
    //   } else if (insideOrOutside === '1') {
    //     this.staffOutsideList.visiable = true
    //   } else {
    //     this.$message.warning('请先选择编制类别')
    //   }
    // },
    // handleStaffInsideListChange (staffName, staffId, idNum) {
    //   this.form.getFieldDecorator('user')
    //   this.form.setFieldsValue({ user: staffName })
    //   this.idNum = idNum
    // },
    // handleStaffInsideListClose () {
    //   this.staffInsideList.visiable = false
    // },
    // handleStaffOutsideListChange (staffName, staffId, idNum) {
    //   this.form.getFieldDecorator('user')
    //   this.form.setFieldsValue({ user: staffName })
    //   this.idNum = idNum
    // },
    // handleStaffOutsideListClose () {
    //   this.staffOutsideList.visiable = false
    // },
    handleSubmit () {
      this.form.validateFields((err, values) => {
        if (!err) {
          let fields = ['allotmentDate']
          fields.forEach((item) => {
            if (values[item]) values[item] = values[item].format('YYYY-MM-DD')
          })
          this.loading = true
          this.$post('chargingCabinet', {
            ...values
            // idNum: this.idNum
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
