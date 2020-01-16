<template>
  <a-modal
    title="固定资产申请信息"
    :centered="true"
    :width="1000"
    :visible="fixedAssetsInfoVisiable"
    :keyboard="false"
    :footer="null"
    @cancel="handleCancleClick">
      <a-card :bordered="false">
        <a-steps progressDot :current="current" :status='status'>
          <a-step title="创建">
            <a-step-item-group slot="description">
              <a-step-item :title="fixedAssetsInfoData.createDate" style="cursor: default;"/>
            </a-step-item-group>
          </a-step>
          <template v-for="(username, index) in reviewList">
            <a-step :title="processEnglishToChinese(index)" :key="index">
              <a-step-item-group slot="description">
                <a-step-item
                  v-if="current === index + 1 && fixedAssetsInfoData.process === 0 && username !== user.username"
                  title="催一下"
                  icon="bell"
                  v-on:click.native="bell(username)"
                />
                <a-step-item
                  v-else-if="current > index + 1 || fixedAssetsInfoData.process === 1"
                  title="审核通过"
                  icon="check-circle"
                  style="cursor: default;"
                />
                <a-step-item
                  v-else-if="current === index + 1 && fixedAssetsInfoData.process === -1"
                  title="审核未通过"
                  icon="exclamation-circle"
                  style="cursor: default;"
                />
              </a-step-item-group>
            </a-step>
          </template>
          <a-step title="待入库">
            <a-step-item-group slot="description">
              <a-step-item
                v-if="fixedAssetsInfoData.process===1"
                title="催一下"
                icon="bell"
                v-on:click.native="bell('logistics')"
              />
              <a-step-item
                v-else-if="fixedAssetsInfoData.process===2"
                title="已入库"
                icon="check-circle"
                style="cursor: default;"
              />
            </a-step-item-group>
          </a-step>
          <a-step title="完成"></a-step>
        </a-steps>
        <a-divider style="margin-bottom: 32px"/>
      </a-card>
      <a-card :bordered="false">
        <detail-list>
          <detail-list-item term="申请部门">{{fixedAssetsInfoData.deptName}}</detail-list-item>
          <detail-list-item term="申请日期">{{fixedAssetsInfoData.createDate}}</detail-list-item>
          <detail-list-item term="联系人">{{fixedAssetsInfoData.handle}}</detail-list-item>
          <detail-list-item term="电话">{{fixedAssetsInfoData.num}}</detail-list-item>
          <!-- <detail-list-item term="物资类别">{{fixedAssetsInfoData.typeFixedAssetsToDict}}</detail-list-item> -->
          <!-- <detail-list-item term="采购部门负责人">{{fixedAssetsInfoData.purDept}}</detail-list-item> -->
          <!-- <detail-list-item term="申请部门负责人">{{fixedAssetsInfoData.appDept}}</detail-list-item> -->
          <detail-list-item term="预计金额">{{$tools.addZero($tools.toNumFormant(fixedAssetsInfoData.money))}}</detail-list-item>
          <detail-list-item term="申请购买理由">{{fixedAssetsInfoData.description}}</detail-list-item>
        </detail-list>
        <a-divider style="margin-bottom: 32px"/>
        <detail-list>
          <a-table ref="TableInfo"
                   :columns="columns"
                   :dataSource="planList"
                   :pagination="false"
                   :loading="loading"
                   rowKey="id">
          </a-table>
        </detail-list>
        <div style="margin-top: 32px;">
          <div v-hasPermission="'application:addDeletePhoto'">
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
          <div v-hasNoPermission="'application:addDeletePhoto'">
            <a-upload
              accept="image/jpg,image/png,image/jpeg,image/bmp"
              listType="picture-card"
              :fileList="fileList"
              :remove="handleNoPermissionRemove"
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
      </a-card>
  </a-modal>
</template>
<script>
import DetailList from '../../../components/tool/DetailList'
import AStepItem from '../../../components/tool/AStepItem'
import { mapState } from 'vuex'

const DetailListItem = DetailList.Item
const AStepItemGroup = AStepItem.Group

export default {
  components: { AStepItemGroup, AStepItem, DetailListItem, DetailList },
  name: 'FixedAssetsInfo',
  props: {
    fixedAssetsInfoVisiable: {
      require: true,
      default: false
    },
    fixedAssetsInfoData: {
      require: true
    }
  },
  data () {
    return {
      previewVisible: false,
      previewImage: '',
      fileList: [],
      planList: [],
      reviewList: [],
      loading: false
    }
  },
  computed: {
    ...mapState({
      user: state => state.account.user
    }),
    columns () {
      return [{
        title: '物品名称',
        dataIndex: 'name'
      }, {
        title: '数量',
        dataIndex: 'amount'
      }, {
        title: '金额',
        dataIndex: 'remark'
      }]
    },
    current () {
      if (this.fixedAssetsInfoData.process === -1) {
        return this.fixedAssetsInfoData.step
      }
      return this.fixedAssetsInfoData.step + this.fixedAssetsInfoData.process
    },
    status () {
      if (this.fixedAssetsInfoData.process === 2) { return 'finish' }
      if (this.fixedAssetsInfoData.process === -1) { return 'error' }
      return 'process'
    }
  },
  methods: {
    handleCancleClick () {
      this.$emit('close')
    },
    processEnglishToChinese (index) {
      switch (index) {
        case 0:
          return '后勤'
        case 1:
          return '财务'
        case 2:
          return '副职'
        case 3:
          return '正职'
        default:
          return index
      }
    },
    bell (username) {
      const message = `${this.user.username} 催了您一下固定资产申请单号为 ${this.fixedAssetsInfoData.num} 的流程进度`
      this.$post('message', {
        'message': message,
        'sender': this.user.username,
        'senderDept': this.user.deptName,
        'addressee': username
      }).then((r) => {
        this.$message.success(`已向 ${username === 'logistics' ? '行政后勤' : username} 通知`)
      })
    },
    handleCancel () {
      this.previewVisible = false
    },
    handlePreview (file) {
      this.previewImage = file.url || file.thumbUrl
      this.previewVisible = true
    },
    handleChange ({ file, fileList, event }) {
      if (file.status === 'error') {
        this.$message.error(`${file.name} 上传失败`)
      } else if (file.status === 'removed') {
        this.fileList = fileList
      }
    },
    handleRemove (file) {
      let that = this
      if (file.status === 'removed') {
        that.$delete('application/deleteFile/' + file.uid).then(() => {
          that.$message.success(`${file.name} 删除成功`)
        })
      }
    },
    handleNoPermissionRemove (file) {
      file.status = 'done'
      this.$message.warning('您无此权限')
    },
    handleBeforeUpload (file) {
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      if (!(isJPG || isPNG)) {
        this.$message.error('You can only upload JPG or PNG file!')
      }
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('Image must smaller than 2MB!')
      }
      return (isJPG || isPNG) && isLt2M
    },
    customRequest ({data, file, filename, onError, onProgress, onSuccess}) {
      const formData = new FormData()
      if (data) {
        Object.keys(data).map(key => {
          formData.append(key, data[key])
        })
      }
      formData.append(filename, file)
      formData.append('id', this.fixedAssetsInfoData.id)
      this.$upload('application/uploadApplicationPhoto', formData, {
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
    }
  },
  watch: {
    fixedAssetsInfoVisiable () {
      if (this.fixedAssetsInfoVisiable) {
        this.reviewList = this.fixedAssetsInfoData.review.split(',')
        this.loading = true
        this.$get('application/applicationPlan', {
          applicationId: this.fixedAssetsInfoData.id
        }).then((r) => {
          this.loading = false
          this.planList = r.data
        })
        this.$get('application/applicationFiles', {
          applicationId: this.fixedAssetsInfoData.id
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
