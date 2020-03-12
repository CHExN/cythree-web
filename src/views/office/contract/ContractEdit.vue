<template>
  <a-drawer
    title="新增合同联审单"
    :maskClosable="false"
    width=650
    placement="right"
    :closable="false"
    @close="onClose"
    :visible="contractEditVisiable"
    style="height: calc(100% - 55px);overflow: auto;padding-bottom: 53px;">
    <a-form :form="form">
      <a-form-item label='合同名称' v-bind="formItemLayout">
        <a-input
          placeholder='合同名称'
          autocomplete="off"
          v-decorator="['contractName',{
            rules: [{ required: true, message: '合同名称不能为空' }]
          }]"
        />
      </a-form-item>
      <a-form-item label='合同对方' v-bind="formItemLayout">
        <a-input
          placeholder='合同对方'
          autocomplete="off"
          v-decorator="['contractPartner']"
        />
      </a-form-item>
      <a-form-item label='经过招标否' v-bind="formItemLayout">
        <a-select
          placeholder='合同约定事项是否经过招标'
          :allowClear="true"
          v-decorator="['isTender', {
            rules: [{ required: true, message: '请选择' }]
          }]"
        >
          <a-select-option key="1">是</a-select-option>
          <a-select-option key="0">否</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label='合同编号' v-bind="formItemLayout">
        <a-input
          placeholder='合同编号'
          autocomplete="off"
          v-decorator="['contractNum',{
            rules: [{ required: true, message: '合同编号不能为空' }]
          }]"
        />
      </a-form-item>
      <a-form-item label='合同金额' v-bind="formItemLayout">
        <a-input-number
          :min="0"
          :max="99999999"
          :precision="2"
          :formatter="value => value"
          autocomplete="off"
          placeholder='合同金额'
          style="width: 100%;"
          v-decorator="['contractAmount',{
            rules: [{ required: true, message: '合同金额不能为空' }]
          }]"
        />
      </a-form-item>
      <a-form-item label='其他情况说明' v-bind="formItemLayout">
        <a-textarea
          placeholder='其他情况说明'
          autocomplete="off"
          v-decorator="['remark']"
        />
      </a-form-item>

      <a-form-item label='承办部门' v-bind="formItemLayout" v-if="user.username === contractInfoData.username">
        <a-textarea
          placeholder='合同承办部门意见'
          autocomplete="off"
          v-decorator="['opinionStart']"
          @change="onUpdateChange('dateStart')"
        />
      </a-form-item>
      <a-form-item label='法务' v-bind="formItemLayout" v-if="user.username === contractInfoData.username">
        <a-textarea
          placeholder='法务审核意见'
          autocomplete="off"
          v-decorator="['opinionLegal']"
          @change="onUpdateChange('dateLegal')"
        />
      </a-form-item>
      <a-form-item label='财务' v-bind="formItemLayout" v-if="user.username === 'finance'">
        <a-textarea
          placeholder='财务审核意见'
          autocomplete="off"
          v-decorator="['opinionFinancial']"
          @change="onUpdateChange('dateFinancial')"
        />
      </a-form-item>
      <a-form-item label='关联部门' v-bind="formItemLayout" v-if="user.username === contractInfoData.username">
        <a-textarea
          placeholder='关联部门意见'
          autocomplete="off"
          v-decorator="['opinionAss']"
          @change="onUpdateChange('dateAss')"
        />
      </a-form-item>
      <a-form-item label='管理部门' v-bind="formItemLayout" v-if="user.username === 'office'">
      <!-- <a-form-item label='管理部门' v-bind="formItemLayout" v-if="user.username === 'xzhisoft'"> -->
        <a-textarea
          placeholder='合同管理部门意见'
          autocomplete="off"
          v-decorator="['opinionOffice']"
          @change="onUpdateChange('dateOffice')"
        />
      </a-form-item>
      <!-- 如果当前账号为工会，则上级领导为公会会长，否则全给副队长（这里等测试完后把注释解开） -->
      <a-form-item label='承办部门主管' v-bind="formItemLayout" v-if="user.username === (contractInfoData.username === 'union' ? 'president' : 'vice')">
      <!-- <a-form-item label='承办部门主管' v-bind="formItemLayout" v-if="user.username === 'xzhisoft'"> -->
        <a-textarea
          placeholder='合同承办部门主管领导意见'
          autocomplete="off"
          v-decorator="['opinionHead']"
          @change="onUpdateChange('dateHead')"
        />
      </a-form-item>
      <a-form-item label='管理部门主管' v-bind="formItemLayout" v-if="user.username === 'vice'">
        <a-textarea
          placeholder='合同管理部门主管领导意见'
          autocomplete="off"
          v-decorator="['opinionViceCaptain']"
          @change="onUpdateChange('dateViceCaptain')"
        />
      </a-form-item>
      <a-form-item label='负责人' v-bind="formItemLayout" v-if="user.username === 'captain'">
        <a-textarea
          placeholder='单位负责人意见'
          autocomplete="off"
          v-decorator="['opinionCaptain']"
          @change="onUpdateChange('dateCaptain')"
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
import { mapState } from 'vuex'
import moment from 'moment'
moment.locale('zh-cn')

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 17 }
}
export default {
  name: 'ContractEdit',
  props: {
    contractEditVisiable: {
      default: false
    }
  },
  data () {
    return {
      loading: false,
      formItemLayout,
      contractInfoData: {},
      dataUpdate: {},
      id: null,
      fileList: [],
      form: this.$form.createForm(this)
    }
  },
  computed: {
    ...mapState({
      user: state => state.account.user
    })
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
    onUpdateChange (value) {
      this.dataUpdate[value] = moment().format('YYYY-MM-DD')
    },
    setFormValues ({...contract}) {
      let x = 0
      let y = 100
      x = x ^ y // （1）
      y = x ^ y // （2）
      x = x ^ y // （3）
      // 把（1）中的 x 带入 （2）中的 x，有
      // y = x ^ y = (x ^ y) ^ y = x ^ (y ^ y) = x ^ 0 = x
      // 对于（3）,推导如下
      // x = x ^ y = (x ^ y) ^ x = (x ^ x) ^ y = 0 ^ y = y
      console.log(x)
      console.log(y)
      this.contractInfoData = contract
      this.id = contract.id
      let obj = {}
      Object.keys(contract).forEach((key) => {
        this.form.getFieldDecorator(key)
        obj[key] = contract[key]
      })
      this.form.setFieldsValue(obj)
      // 获取上传附件
      this.$get('contract/contractFiles', {
        contractId: contract.id
      }).then((r) => {
        this.fileList = r.data.data
      })
    },
    handleRemove (file) {
      let that = this
      if (file.status === 'removed') {
        that.$delete('contract/deleteFile/' + file.uid).then(() => {
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
      this.$upload('contract/uploadContractFile', formData, {
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
          let data = {
            id: this.id,
            ...values,
            ...this.dataUpdate
          }
          this.$put('contract', {
            ...data
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
