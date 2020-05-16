<template>
  <a-modal
    title="办公用品申请信息"
    :centered="true"
    :width="1000"
    :visible="officeSuppliesInfoVisiable"
    :keyboard="false"
    :footer="null"
    @cancel="handleCancleClick">
    <a-card :bordered="false">
      <a-steps progressDot :current="current" :status='status'>
        <a-step title="创建">
          <a-step-item-group slot="description">
            <a-step-item :title="officeSuppliesInfoData.createDate" style="cursor: default;"/>
          </a-step-item-group>
        </a-step>
        <template v-for="(username, index) in reviewList">
          <a-step :title="'后勤'" :key="index">
            <a-step-item-group slot="description">
              <a-step-item
                v-if="current === index + 1 && officeSuppliesInfoData.process === 0 && username !== user.username"
                title="催一下"
                icon="bell"
                v-on:click.native="bell(username)"
              />
              <a-step-item
                v-else-if="current > index + 1 || officeSuppliesInfoData.process === 1"
                title="审核通过"
                icon="check-circle"
                style="cursor: default;"
              />
              <a-step-item
                v-else-if="current === index + 1 && officeSuppliesInfoData.process === -1"
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
              v-if="officeSuppliesInfoData.process===1"
              title="催一下"
              icon="bell"
              v-on:click.native="bell('logistics')"
            />
            <a-step-item
              v-else-if="officeSuppliesInfoData.process===2"
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
    </a-card>
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
  name: 'OfficeSuppliesInfo',
  props: {
    officeSuppliesInfoVisiable: {
      require: true,
      default: false
    },
    officeSuppliesInfoData: {
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
        title: '型号',
        dataIndex: 'type'
      }, {
        title: '数量',
        dataIndex: 'amount'
      }, {
        title: '单位',
        dataIndex: 'unit'
      }, {
        title: '备注',
        dataIndex: 'remark'
      }]
    },
    current () {
      if (this.officeSuppliesInfoData.process === -1) {
        return this.officeSuppliesInfoData.step
      }
      return this.officeSuppliesInfoData.step + this.officeSuppliesInfoData.process
    },
    status () {
      if (this.officeSuppliesInfoData.process === 2) { return 'finish' }
      if (this.officeSuppliesInfoData.process === -1) { return 'error' }
      return 'process'
    }
  },
  methods: {
    handleCancleClick () {
      this.fileList = []
      this.$emit('close')
    },
    bell (username) {
      const message = `${this.user.username} 催了您一下办公用品申请单号为 ${this.officeSuppliesInfoData.num} 的流程进度`
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
      if (file.error) {
        this.fileList = this.fileList.filter(item => item.uid !== file.uid)
      } else if (file.status === 'removed') {
        this.$delete('application/deleteFile/' + file.uid)
      }
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
      formData.append('id', this.officeSuppliesInfoData.id)
      this.$upload('application/uploadApplicationPhoto', formData, {
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
    }
  },
  watch: {
    officeSuppliesInfoVisiable () {
      if (this.officeSuppliesInfoVisiable) {
        this.reviewList = this.officeSuppliesInfoData.review.split(',')
        this.planList = []
        this.loading = true
        this.$get('application/applicationPlan', {
          applicationId: this.officeSuppliesInfoData.id
        }).then((r) => {
          this.loading = false
          this.planList = r.data
        })
        this.$get('application/applicationFiles', {
          applicationId: this.officeSuppliesInfoData.id
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
