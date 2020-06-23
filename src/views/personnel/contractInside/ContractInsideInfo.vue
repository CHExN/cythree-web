<template>
  <a-modal
    title="编内合同信息"
    :centered="true"
    :width="1200"
    :visible="contractInsideInfoVisiable"
    :keyboard="false"
    :footer="null"
    @cancel="handleCancleClick">
    <a-card :bordered="false" v-if="contractPeriod.length > 0">
      <detail-list title="合同信息">
        <template v-for="(k, index) in contractPeriod">
          <detail-list-item :key="index" :term="k">{{contractPeriodDate[index]}}</detail-list-item>
        </template>
        <detail-list-item term="续签备注">{{contractInsideInfoData.remarkRenew}}</detail-list-item>
        <detail-list-item term="备注">{{contractInsideInfoData.remark}}</detail-list-item>
      </detail-list>
    </a-card>
    <a-divider style="margin-bottom: 32px" v-if="contractPeriod.length > 0 && jobAgreement.length > 0"/>
    <a-card :bordered="false" v-if="jobAgreement.length > 0">
      <detail-list title="岗位协议信息">
        <template v-for="(k, index) in jobAgreement">
          <detail-list-item :key="index" :term="k">{{jobAgreementDate[index]}}</detail-list-item>
        </template>
      </detail-list>
    </a-card>
    <a-divider v-hasPermission="'staffInside:view'" v-if="contractPeriod.length > 0 || jobAgreement.length > 0" style="margin-bottom: 32px"/>
    <a-card v-hasPermission="'staffInside:view'" :loading='loading' :bordered="false">
      <detail-list title="人员信息">
        <detail-list-item term="姓名">{{staffInsideData.name}}</detail-list-item>
        <detail-list-item term="部门">{{staffInsideData.deptName}}</detail-list-item>
        <detail-list-item term="人员类型">{{getType(staffInsideData.type)}}</detail-list-item>
        <detail-list-item term="事由">{{staffInsideData.cause}}</detail-list-item>
        <detail-list-item term="性别">{{getGender(staffInsideData.gender)}}</detail-list-item>
        <detail-list-item term="民族">{{staffInsideData.clan}}</detail-list-item>
        <detail-list-item term="籍贯">{{staffInsideData.birthplace}}</detail-list-item>
        <detail-list-item term="原学历">{{staffInsideData.cultureBefore}}</detail-list-item>
        <detail-list-item term="现学历">{{staffInsideData.cultureCurrent}}</detail-list-item>
        <detail-list-item term="户籍性质">{{getHouseholdRegistrationType(staffInsideData.householdRegistrationType)}}</detail-list-item>
        <detail-list-item term="专业">{{staffInsideData.profession}}</detail-list-item>
        <detail-list-item term="毕业日期">{{staffInsideData.graduationDate}}</detail-list-item>
        <detail-list-item term="政治面貌">{{staffInsideData.politicalFace}}</detail-list-item>
        <detail-list-item term="有无残疾证">{{getIsDisabilityCertificate(staffInsideData.isDisabilityCertificate)}}</detail-list-item>
        <detail-list-item term="残疾证编号">{{staffInsideData.disabilityCertificateNumber}}</detail-list-item>
        <detail-list-item term="伤残鉴定等级">{{staffInsideData.disabilityIdentificationLevel}}</detail-list-item>
        <detail-list-item term="家庭住址">{{staffInsideData.address}}</detail-list-item>
        <detail-list-item term="身份证号码">{{staffInsideData.idNum}}</detail-list-item>
        <detail-list-item term="座机联系电话">{{staffInsideData.phoneLandLine}}</detail-list-item>
        <detail-list-item term="手机联系电话">{{staffInsideData.phoneCell}}</detail-list-item>
        <detail-list-item term="出生年月">{{staffInsideData.birthDate}}</detail-list-item>
        <!-- <detail-list-item term="年龄">{{this.$tools.getAge(staffInsideData.birthDate)}}</detail-list-item> -->
        <detail-list-item term="年龄">{{staffInsideData.age}}</detail-list-item>
        <detail-list-item term="退休年龄">{{staffInsideData.retirementAge}}</detail-list-item>
        <detail-list-item term="退休日期">{{staffInsideData.retirementDate}}</detail-list-item>
        <detail-list-item term="调入日期">{{staffInsideData.transferDate}}</detail-list-item>
        <detail-list-item term="参加工作日期">{{staffInsideData.workDate}}</detail-list-item>
        <detail-list-item term="农转工转工日期">{{staffInsideData.farmerWorkDate}}</detail-list-item>
        <detail-list-item term="现任职务">{{staffInsideData.technicalType}}</detail-list-item>
        <detail-list-item term="岗位">{{getPost(staffInsideData.post)}}</detail-list-item>
        <detail-list-item term="岗位级别">{{staffInsideData.postLevel}}</detail-list-item>
        <detail-list-item term="聘任岗位">{{staffInsideData.hiringPositions}}</detail-list-item>
        <detail-list-item term="聘任时间">{{staffInsideData.appointmentDate}}</detail-list-item>
        <detail-list-item term="技术等级取得日期">{{staffInsideData.technicalLevelDate}}</detail-list-item>
        <detail-list-item term="证书编号">{{staffInsideData.certificateNum}}</detail-list-item>
        <detail-list-item term="入职状态">{{staffInsideData.entryStatus}}</detail-list-item>
      </detail-list>
    </a-card>
    <a-divider v-hasPermission="'staffInside:addDeletePhoto'" style="margin-bottom: 32px"/>
    <div>
      <div v-hasPermission="'staffInside:addDeletePhoto'">
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
      <div v-hasNoPermission="'staffInside:addDeletePhoto'">
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
import { mapState } from 'vuex'

const DetailListItem = DetailList.Item
const AStepItemGroup = AStepItem.Group
export default {
  components: { AStepItemGroup, AStepItem, DetailListItem, DetailList },
  name: 'ContractInsideInfo',
  props: {
    contractInsideInfoVisiable: {
      require: true,
      default: false
    },
    contractInsideInfoData: {
      require: true
    }
  },
  data () {
    return {
      previewVisible: false,
      previewImage: '',
      fileList: [],
      staffInsideData: {},
      loading: false
    }
  },
  computed: {
    ...mapState({
      permissions: state => state.account.permissions
    }),
    contractPeriod () {
      return this.contractInsideInfoData.contractPeriod ? this.contractInsideInfoData.contractPeriod.split(',') : []
    },
    contractPeriodDate () {
      return this.contractInsideInfoData.contractPeriodDate ? this.contractInsideInfoData.contractPeriodDate.split(',') : []
    },
    jobAgreement () {
      return this.contractInsideInfoData.jobAgreement ? this.contractInsideInfoData.jobAgreement.split(',') : []
    },
    jobAgreementDate () {
      return this.contractInsideInfoData.jobAgreementDate ? this.contractInsideInfoData.jobAgreementDate.split(',') : []
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
        this.$delete('staffInside/deleteFile/' + file.uid)
      }
      // if (file.error) {
      //   this.fileList = this.fileList.filter(item => item.uid !== file.uid)
      // } else if (file.status === 'removed') {
      //   this.$delete('staffInside/deleteFile/' + file.uid)
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
      formData.append('id', this.contractInsideInfoData.staffId)
      this.$upload('staffInside/uploadStaffInsidePhoto', formData, {
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
    getType (type) {
      if (type === '0') {
        return '固定工'
      } else if (type === '1') {
        return '合同制'
      }
    },
    getGender (gender) {
      if (gender === '0') {
        return '女'
      } else if (gender === '1') {
        return '男'
      }
    },
    getIsDisabilityCertificate (isDisabilityCertificate) {
      if (isDisabilityCertificate === '0') {
        return '无'
      } else if (isDisabilityCertificate === '1') {
        return '有'
      }
    },
    getHouseholdRegistrationType (householdRegistrationType) {
      switch (householdRegistrationType) {
        case '0':
          return '外地农业'
        case '1':
          return '外地非农业'
        case '2':
          return '本地农业'
        case '3':
          return '本地非农业'
        default:
          return householdRegistrationType
      }
    },
    getPost (post) {
      switch (post) {
        case '0':
          return '管理岗'
        case '1':
          return '技工'
        case '2':
          return '工勤岗'
        case '3':
          return '专业技术岗'
        default:
          return post
      }
    }
  },
  watch: {
    contractInsideInfoVisiable () {
      if (this.contractInsideInfoVisiable && this.permissions.includes('staffInside:view')) {
        this.staffInsideData = {}
        this.loading = true
        this.$get('staffInside/getStaffInsideByIdNum', {
          idNum: this.contractInsideInfoData.idNum
        }).then((r) => {
          this.loading = false
          if (r.data) {
            this.staffInsideData = r.data
            this.$get('staffInside/staffInsideFiles', {
              staffInsideId: this.staffInsideData.staffId
            }).then((r) => {
              this.fileList = r.data.data
            })
          }
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
