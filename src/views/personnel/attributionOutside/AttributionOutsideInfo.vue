<template>
  <a-modal
    title="编外归属人员信息"
    :centered="true"
    :width="1200"
    :visible="attributionOutsideInfoVisiable"
    :keyboard="false"
    :footer="null"
    @cancel="handleCancleClick">
    <a-card :bordered="false">
      <detail-list title="人员信息">
        <detail-list-item term="姓名">{{attributionOutsideInfoData.name}}</detail-list-item>
        <detail-list-item term="分队">{{attributionOutsideInfoData.team}}</detail-list-item>
        <detail-list-item term="人员类型">{{attributionOutsideInfoData.temporary}}</detail-list-item>
        <detail-list-item term="事由">{{attributionOutsideInfoData.cause}}</detail-list-item>
        <detail-list-item term="性别">{{getGender(attributionOutsideInfoData.gender)}}</detail-list-item>
        <detail-list-item term="民族">{{attributionOutsideInfoData.clan}}</detail-list-item>
        <detail-list-item term="籍贯">{{attributionOutsideInfoData.birthplace}}</detail-list-item>
        <detail-list-item term="学历">{{attributionOutsideInfoData.culture}}</detail-list-item>
        <detail-list-item term="户籍性质">{{getHouseholdRegistrationType(attributionOutsideInfoData.householdRegistrationType)}}</detail-list-item>
        <detail-list-item term="政治面貌">{{attributionOutsideInfoData.politicalFace}}</detail-list-item>
        <detail-list-item term="家庭住址">{{attributionOutsideInfoData.address}}</detail-list-item>
        <detail-list-item term="身份证号码">{{attributionOutsideInfoData.idNum}}</detail-list-item>
        <detail-list-item term="座机联系电话">{{attributionOutsideInfoData.phoneLandLine}}</detail-list-item>
        <detail-list-item term="手机联系电话">{{attributionOutsideInfoData.phoneCell}}</detail-list-item>
        <detail-list-item term="出生年月">{{attributionOutsideInfoData.birthDate}}</detail-list-item>
        <!-- <detail-list-item term="年龄">{{this.$tools.getAge(attributionOutsideInfoData.birthDate)}}</detail-list-item> -->
        <detail-list-item term="年龄">{{attributionOutsideInfoData.age}}</detail-list-item>
        <detail-list-item term="退休年龄">{{attributionOutsideInfoData.retirementAge}}</detail-list-item>
        <detail-list-item term="退休日期">{{attributionOutsideInfoData.retirementDate}}</detail-list-item>
        <detail-list-item term="调入日期">{{attributionOutsideInfoData.transferDate}}</detail-list-item>
        <detail-list-item term="岗位">{{attributionOutsideInfoData.post}}</detail-list-item>
        <detail-list-item term="岗位类别">{{attributionOutsideInfoData.technicalType}}</detail-list-item>
        <detail-list-item term="备注">{{attributionOutsideInfoData.remark}}</detail-list-item>
      </detail-list>
    </a-card>
    <a-divider v-hasPermission="'contractOutside:view'" v-if="contractPeriod.length > 0" style="margin-bottom: 32px"/>
    <a-card v-hasPermission="'contractOutside:view'" v-if="contractPeriod.length > 0" :loading='loading' :bordered="false">
      <detail-list title="合同信息">
        <template v-for="(k, index) in contractPeriod">
          <detail-list-item :key="index" :term="k">{{contractPeriodDate[index]}}</detail-list-item>
        </template>
        <!-- <detail-list-item term="无固定期">{{contractOutsideData.isFixedPeriod}}</detail-list-item> -->
        <detail-list-item term="续签备注">{{contractOutsideData.remarkRenew}}</detail-list-item>
        <detail-list-item term="备注">{{contractOutsideData.remark}}</detail-list-item>
      </detail-list>
    </a-card>
    <a-divider v-hasPermission="'contractOutside:view'" v-if="jobAgreement.length > 0" style="margin-bottom: 32px"/>
    <a-card v-hasPermission="'contractOutside:view'" v-if="jobAgreement.length > 0" :loading='loading' :bordered="false">
      <detail-list title="岗位协议信息">
        <template v-for="(k, index) in jobAgreement">
          <detail-list-item :key="index" :term="k">{{jobAgreementDate[index]}}</detail-list-item>
        </template>
      </detail-list>
    </a-card>
    <a-divider v-hasPermission="'attributionOutside:addDeletePhoto'" style="margin-bottom: 32px"/>
    <div>
      <div v-hasPermission="'attributionOutside:addDeletePhoto'">
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
      <div v-hasNoPermission="'attributionOutside:addDeletePhoto'">
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
  name: 'AttributionOutsideInfo',
  props: {
    attributionOutsideInfoVisiable: {
      require: true,
      default: false
    },
    attributionOutsideInfoData: {
      require: true
    }
  },
  data () {
    return {
      previewVisible: false,
      previewImage: '',
      fileList: [],
      contractOutsideData: {},
      loading: false
    }
  },
  computed: {
    ...mapState({
      permissions: state => state.account.permissions
    }),
    contractPeriod () {
      return this.contractOutsideData.contractPeriod ? this.contractOutsideData.contractPeriod.split(',') : []
    },
    contractPeriodDate () {
      return this.contractOutsideData.contractPeriodDate ? this.contractOutsideData.contractPeriodDate.split(',') : []
    },
    jobAgreement () {
      return this.contractOutsideData.jobAgreement ? this.contractOutsideData.jobAgreement.split(',') : []
    },
    jobAgreementDate () {
      return this.contractOutsideData.jobAgreementDate ? this.contractOutsideData.jobAgreementDate.split(',') : []
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
        this.$delete('staffOutside/deleteFile/' + file.uid)
      }
      // if (file.error) {
      //   this.fileList = this.fileList.filter(item => item.uid !== file.uid)
      // } else if (file.status === 'removed') {
      //   this.$delete('staffOutside/deleteFile/' + file.uid)
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
      formData.append('id', this.attributionOutsideInfoData.staffId)
      this.$upload('staffOutside/uploadStaffOutsidePhoto', formData, {
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
    }
  },
  watch: {
    attributionOutsideInfoVisiable () {
      if (this.attributionOutsideInfoVisiable) {
        if (this.permissions.includes('contractOutside:view')) {
          this.contractOutsideData = {}
          this.loading = true
          this.$get('contractOutside/getContractOutside', {
            idNum: this.attributionOutsideInfoData.idNum
          }).then((r) => {
            this.loading = false
            if (r.data) {
              this.contractOutsideData = r.data
            }
          })
        }
        this.$get('staffOutside/staffOutsideFiles', {
          staffOutsideId: this.attributionOutsideInfoData.staffId
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
