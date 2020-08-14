<template>
  <a-drawer
    title="新增上会议题"
    :maskClosable="false"
    width=650
    placement="right"
    :closable="false"
    @close="onClose"
    :visible="bilateralMeetingAddVisiable"
    style="height: calc(100% - 55px);overflow: auto;padding-bottom: 53px;">
    <a-form :form="form">
      <a-form-item label='申请人' v-bind="formItemLayout">
        <a-input
          placeholder='申请人'
          autocomplete="off"
          v-decorator="['applicant',
            {rules: [{required: true, message: '申请人不能为空'}]}
          ]"/>
      </a-form-item>
      <a-form-item label='申请日期' v-bind="formItemLayout">
        <a-date-picker
          placeholder='申请日期'
          format='YYYY-MM-DD'
          style="width: 100%;"
          v-decorator="['applicationDate',
            {rules: [{ required: true, message: '申请日期不能为空'}]}
          ]"
        />
      </a-form-item>
      <a-form-item label='议题' v-bind="formItemLayout">
        <a-textarea
          placeholder='拟上会议题'
          :auto-size="{ minRows: 5, maxRows: 500 }"
          autocomplete="off"
          v-decorator="['bilateralMeeting',
            {rules: [{required: true, message: '拟上会议题不能为空'}]}
          ]"/>
      </a-form-item>
      <a-form-item label='梗概' v-bind="formItemLayout">
        <a-textarea
          placeholder='提议事由梗概'
          :auto-size="{ minRows: 10, maxRows: 500 }"
          autocomplete="off"
          v-decorator="['proposedCauseSummary',
            {rules: [{required: true, message: '提议事由梗概不能为空'}]}
          ]"
        />
      </a-form-item>
      <a-form-item label='附件' v-bind="formItemLayout">
        <a-upload-dragger
          :fileList="fileList"
          :remove="handleRemove"
          :customRequest="customRequest"
          :beforeUpload="handleBeforeUpload"
          @change="handleChange"
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
import moment from 'moment'
moment.locale('zh-cn')
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 17 }
}
export default {
  name: 'BilateralMeetingAdd',
  props: {
    bilateralMeetingAddVisiable: {
      default: false
    }
  },
  data () {
    return {
      loading: false,
      formItemLayout,
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
      // 删除已经上传但取消提交的文件
      this.fileList.forEach(file => { this.$delete('file/' + file.uid) })
      this.reset()
      this.$emit('close')
    },
    handleChange ({ file, fileList, event }) {
      if (file.status === 'error') {
        this.$message.error(`${file.name} 上传失败`)
      } else if (file.status === 'removed') {
        this.fileList = fileList.map(item => item.response || item)
      } else if (file.status === 'done') {
        this.$message.success(`${file.name} 上传成功`)
        this.fileList = fileList.map(item => item.response || item)
      } else if (file.status === 'uploading') {
        this.fileList = fileList.map(item => item.response || item)
      }
    },
    handleRemove (file) {
      let that = this
      if (file.status === 'removed') {
        that.$delete('file/' + file.uid)
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
      this.$upload('file/uploadFile', formData, {
        onUploadProgress: ({ total, loaded }) => {
          onProgress({ percent: Math.round(loaded / total * 100) }, file)
        }
      }).then((response) => {
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
          let fileUidList = this.fileList.map(file => { return file.uid })
          values.applicationDate = values.applicationDate.format('YYYY-MM-DD')
          this.$post('bilateralMeeting', {
            ...values,
            fileId: this.fileList.length ? fileUidList : null
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
    bilateralMeetingAddVisiable () {
      if (this.bilateralMeetingAddVisiable) {
        this.form.getFieldDecorator('applicationDate')
        this.form.setFieldsValue({ applicationDate: moment() })
      }
    }
  }
}
</script>
