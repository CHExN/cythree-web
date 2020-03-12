<template>
  <a-drawer
    title="修改申请介绍信"
    :maskClosable="false"
    width=650
    placement="right"
    :closable="false"
    @close="onClose"
    :visible="letterEditVisiable"
    style="height: calc(100% - 55px);overflow: auto;padding-bottom: 53px;">
    <a-form :form="form">
      <a-form-item label='介绍信人' v-bind="formItemLayout">
        <a-input
          placeholder='介绍信人'
          autocomplete="off"
          v-decorator="['letterUser',
            {rules: [{required: true, message: '介绍信人不能为空'}]}
          ]"/>
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
      <a-form-item label='附件' v-bind="formItemLayout">
        <a-upload-dragger
          :fileList="fileList"
          :remove="handleRemove"
          :customRequest="customRequest"
          :beforeUpload="handleBeforeUpload"
        >
          <p class="ant-upload-drag-icon">
            <a-icon type="inbox" />
          </p>
          <p class="ant-upload-hint">单击或拖动文件到此区域进行上传</p>
        </a-upload-dragger>
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
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 17 }
}
export default {
  name: 'LetterEdit',
  props: {
    letterEditVisiable: {
      default: false
    }
  },
  data () {
    return {
      loading: false,
      formItemLayout,
      id: null,
      fileList: [],
      form: this.$form.createForm(this)
    }
  },
  methods: {
    reset () {
      this.loading = false
      this.fileList = []
      // 清空表单
      this.form.resetFields()
    },
    onClose () {
      this.reset()
      this.$emit('close')
    },
    setFormValues ({...letter}) {
      this.id = letter.letterId
      let obj = {}
      Object.keys(letter).forEach((key) => {
        this.form.getFieldDecorator(key)
        obj[key] = letter[key]
      })
      this.form.setFieldsValue(obj)
      // 获取上传附件
      this.$get('letter/letterFiles', {
        letterId: letter.letterId
      }).then((r) => {
        this.fileList = r.data.data
      })
    },
    handleRemove (file) {
      let that = this
      if (file.status === 'removed') {
        that.$delete('letter/deleteFile/' + file.uid).then(() => {
          that.$message.success(`${file.name.slice(file.name.indexOf('_') + 1)} 删除成功`)
        })
        const index = that.fileList.indexOf(file)
        const newFileList = that.fileList.slice()
        newFileList.splice(index, 1)
        that.fileList = newFileList
      }
    },
    handleBeforeUpload (file) {
      const isLt10M = file.size / 1024 / 1024 < 10
      if (!isLt10M) {
        this.$message.error('File must smaller than 10MB!')
      }
      return isLt10M
    },
    customRequest ({data, file, filename, onError, onProgress, onSuccess}) {
      const formData = new FormData()
      if (data) {
        Object.keys(data).map(key => {
          formData.append(key, data[key])
        })
      }
      formData.append(filename, file)
      formData.append('id', this.id)
      this.$upload('letter/uploadLetterFile', formData, {
        onUploadProgress: ({ total, loaded }) => {
          onProgress({ percent: Math.round((loaded / total) * 100).toFixed(2) }, file)
        }
      }).then((response) => {
        this.$message.success(`${file.name} 上传成功`)
        this.fileList = [...this.fileList, response.data.data]
        onSuccess(response.data.data, file)
      }).catch(onError)
      return {
        abort () {
          this.$message.warning('upload progress is aborted.')
        }
      }
    },
    handleSubmit () {
      this.form.validateFields((err, values) => {
        if (!err) {
          this.loading = true
          this.$put('letter', {
            ...values,
            'letterId': this.id
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
