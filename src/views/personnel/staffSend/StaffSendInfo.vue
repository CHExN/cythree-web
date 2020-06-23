<template>
  <a-modal
    title="劳务派遣人员信息"
    :centered="true"
    :width="900"
    :visible="staffSendInfoVisiable"
    :keyboard="false"
    :footer="null"
    @cancel="handleCancleClick">
    <a-card :bordered="false">
      <detail-list>
        <detail-list-item term="姓名">{{staffSendInfoData.name}}</detail-list-item>
        <detail-list-item term="性别">{{getGender(staffSendInfoData.gender)}}</detail-list-item>
        <detail-list-item term="籍贯">{{staffSendInfoData.birthplace}}</detail-list-item>
        <detail-list-item term="学历">{{staffSendInfoData.culture}}</detail-list-item>
        <detail-list-item term="身份证号码">{{staffSendInfoData.idNum}}</detail-list-item>
        <detail-list-item term="手机电话">{{staffSendInfoData.phoneCell}}</detail-list-item>
        <detail-list-item term="出生年月">{{staffSendInfoData.birthDate}}</detail-list-item>
        <detail-list-item term="年龄">{{staffSendInfoData.age}}</detail-list-item>
        <detail-list-item term="调入日期">{{staffSendInfoData.transferDate}}</detail-list-item>
        <detail-list-item term="银行卡号">{{staffSendInfoData.bankCardNumber}}</detail-list-item>
        <detail-list-item term="银行卡归属">{{staffSendInfoData.bankCardAttribution}}</detail-list-item>
        <detail-list-item term="备注">{{staffSendInfoData.remark}}</detail-list-item>
      </detail-list>
    </a-card>
    <a-divider v-hasPermission="'staffSend:addDeletePhoto'" style="margin-bottom: 32px"/>
    <div>
      <div v-hasPermission="'staffSend:addDeletePhoto'">
        <a-upload
          accept="image/jpg,image/png,image/jpeg,image/bmp"
          listType="picture-card"
          :fileList="fileList"
          :remove="handleRemove"
          :customRequest="customRequest"
          :beforeUpload="handleBeforeUpload"
          @preview="handlePreview"
          @change="handleChange">
          <div v-if="fileList.length < 8">
            <a-icon type="plus" />
            <div class="ant-upload-text">Upload</div>
          </div>
        </a-upload>
        <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
          <img alt="example" style="width: 100%;" :src="previewImage" />
        </a-modal>
      </div>
      <div v-hasNoPermission="'staffSend:addDeletePhoto'">
        <a-upload
          accept="image/jpg,image/png,image/jpeg,image/bmp"
          listType="picture-card"
          :fileList="fileList"
          :showUploadList="{ showPreviewIcon: true, showRemoveIcon: false }"
          :customRequest="customRequest"
          :beforeUpload="handleBeforeUpload"
          @preview="handlePreview"
          @change="handleChange">
        </a-upload>
        <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
          <img alt="example" style="width: 100%;" :src="previewImage" />
        </a-modal>
      </div>
    </div>
  </a-modal>
</template>
<script>
import DetailList from '@/components/tool/DetailList'
import AStepItem from '../../../components/tool/AStepItem'

const DetailListItem = DetailList.Item
const AStepItemGroup = AStepItem.Group
export default {
  components: { AStepItemGroup, AStepItem, DetailListItem, DetailList },
  name: 'StaffSendInfo',
  props: {
    staffSendInfoVisiable: {
      require: true,
      default: false
    },
    staffSendInfoData: {
      require: true
    }
  },
  data () {
    return {
      previewVisible: false,
      previewImage: '',
      fileList: [],
      loading: false
    }
  },
  methods: {
    handleCancleClick () {
      this.fileList = []
      this.$emit('close')
    },
    handleCancel () {
      this.previewVisible = false
    },
    handlePreview (file) {
      this.previewImage = file.url
      this.previewVisible = true
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
      if (file.uid) {
        this.$delete('staffSend/deleteFile/' + file.uid)
      }
      // if (file.error) {
      //   this.fileList = this.fileList.filter(item => item.uid !== file.uid)
      // } else if (file.status === 'removed') {
      //   this.$delete('staffSend/deleteFile/' + file.uid)
      // }
    },
    handleBeforeUpload (file) {
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      if (!(isJPG || isPNG)) {
        this.$message.error('You can only upload JPG or PNG file!')
      }
      const isLt8M = file.size / 1024 / 1024 < 8
      if (!isLt8M) {
        this.$message.error('Image must smaller than 8MB!')
      }
      return (isJPG || isPNG) && isLt8M
    },
    customRequest ({data, file, filename, onError, onProgress, onSuccess}) {
      const formData = new FormData()
      if (data) {
        Object.keys(data).map(key => {
          formData.append(key, data[key])
        })
      }
      formData.append(filename, file)
      formData.append('id', this.staffSendInfoData.staffId)
      this.$upload('staffSend/uploadStaffSendPhoto', formData, {
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
    getGender (gender) {
      if (gender === '0') {
        return '女'
      } else if (gender === '1') {
        return '男'
      }
    }
  },
  watch: {
    staffSendInfoVisiable () {
      if (this.staffSendInfoVisiable) {
        this.$get('staffSend/staffSendFiles', {
          staffSendId: this.staffSendInfoData.staffId
        }).then((r) => {
          this.fileList = r.data.data
        })
      }
    }
  }
}
</script>
<style lang="less" scoped>
  /* you can make up upload button and sample style by using stylesheets */
  .ant-upload-select-picture-card i {
    font-size: 32px;
    color: #999;
  }
  .ant-upload-select-picture-card .ant-upload-text {
    margin-top: 8px;
    color: #666;
  }
</style>
