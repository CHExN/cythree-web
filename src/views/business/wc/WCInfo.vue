<template>
  <a-modal
    title="公厕信息"
    :centered="true"
    :width="1000"
    :visible="wcInfoVisiable"
    :keyboard="false"
    :footer="null"
    @cancel="handleCancleClick">
    <a-card :bordered="false">
      <detail-list title="基础信息">
        <detail-list-item term="公厕名称">{{wcInfoData.wcName}}</detail-list-item>
        <detail-list-item term="公厕编号">{{wcInfoData.wcNum}}</detail-list-item>
        <detail-list-item term="所属分队">{{wcInfoData.wcOwn}}</detail-list-item>
        <detail-list-item term="管理单位">{{wcInfoData.manageUnitToDict}}</detail-list-item>
        <detail-list-item term="种类">{{wcInfoData.wcKindToDict}}</detail-list-item>
        <detail-list-item term="管理形式">{{wcInfoData.manageTypeToDict}}</detail-list-item>
        <detail-list-item term="类别">{{wcInfoData.wcSortToDict}}</detail-list-item>
        <detail-list-item term="公厕现在状态">{{wcInfoData.wcNowStatus}}</detail-list-item>
        <detail-list-item term="是否销账">{{wcInfoData.writeOffToDict}}</detail-list-item>
      </detail-list>
      <a-divider style="margin-bottom: 32px"/>
      <detail-list title="详细信息">
        <detail-list-item term="经度">{{wcInfoData.longitude}}</detail-list-item>
        <detail-list-item term="纬度">{{wcInfoData.latitude}}</detail-list-item>
        <detail-list-item term="建筑类型">{{wcInfoData.buildingTypeToDict}}</detail-list-item>
        <detail-list-item term="初建投资">{{wcInfoData.initialMoney}} 万元</detail-list-item>
        <detail-list-item term="建筑面积">{{wcInfoData.wcArea}} 平方米</detail-list-item>
        <detail-list-item term="指标状况">{{wcInfoData.indicatorStatus}}</detail-list-item>
        <detail-list-item term="投入使用日期">{{wcInfoData.useDate}}</detail-list-item>
        <detail-list-item term="接管日期">{{wcInfoData.replaceDate}}</detail-list-item>
        <detail-list-item term="开放时间">{{wcInfoData.openHour}}</detail-list-item>
        <detail-list-item term="所在区县">{{wcInfoData.DictrictToDict}}</detail-list-item>
        <detail-list-item term="所属街乡">{{wcInfoData.streetTown}}</detail-list-item>
        <detail-list-item term="建设方式">{{wcInfoData.buildingMethodToDict}}</detail-list-item>
        <detail-list-item term="男坑位数">{{wcInfoData.pitMale}}</detail-list-item>
        <detail-list-item term="女坑位数">{{wcInfoData.pitFemale}}</detail-list-item>
        <detail-list-item term="无性别数">{{wcInfoData.pitSexless}}</detail-list-item>
        <detail-list-item term="小便器数量">{{wcInfoData.urinalsNum}}</detail-list-item>
        <detail-list-item term="小便器长度">{{wcInfoData.urinalsLen}}</detail-list-item>
        <detail-list-item term="小便器类型">{{wcInfoData.urinalsType}}</detail-list-item>
        <detail-list-item term="导向牌数量">{{wcInfoData.indicatorNum}}</detail-list-item>
        <detail-list-item term="洗手盆数量">{{wcInfoData.sink}}</detail-list-item>
        <detail-list-item term="保洁人数">{{wcInfoData.clranNum}}</detail-list-item>
        <detail-list-item term="粪便处理方式">{{wcInfoData.fecalMethod}}</detail-list-item>
        <detail-list-item term="作业方式">{{wcInfoData.assignmentStyle}}</detail-list-item>
        <detail-list-item term="冲洗方式">{{wcInfoData.flushingMethod}}</detail-list-item>
        <detail-list-item term="有无管理间">{{wcInfoData.isManageRoom}}</detail-list-item>
        <detail-list-item term="有无产权">{{wcInfoData.isPropertyRigth}}</detail-list-item>
        <detail-list-item term="有无标志牌">{{wcInfoData.siIndicator}}</detail-list-item>
        <detail-list-item term="五环内外">{{wcInfoData.is5thRing}}</detail-list-item>
        <detail-list-item term="有无无障碍设施">{{wcInfoData.isAccessibility}}</detail-list-item>
        <detail-list-item term="有无残疾间">{{wcInfoData.isDisabledRoom}}</detail-list-item>
        <detail-list-item term="水费单号">{{wcInfoData.waterNum}}</detail-list-item>
        <detail-list-item term="电费单号">{{wcInfoData.electricityNum}}</detail-list-item>
        <detail-list-item term="缴费号">{{wcInfoData.paymentNum}}</detail-list-item>
      </detail-list>
      <detail-list :col="1">
        <detail-list-item term="公厕详细地址">{{wcInfoData.wcAddress}}</detail-list-item>
      </detail-list>
      <a-divider/>
    </a-card>
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
  </a-modal>
</template>
<script>
import DetailList from '@/components/tool/DetailList'

const DetailListItem = DetailList.Item
export default {
  components: {DetailListItem, DetailList},
  name: 'WCInfo',
  props: {
    wcInfoVisiable: {
      require: true,
      default: false
    },
    wcInfoData: {
      require: true
    }
  },
  data () {
    return {
      previewVisible: false,
      previewImage: '',
      fileList: []
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
        this.$delete('wc/deleteFile/' + file.uid)
      }
      // if (file.error) {
      //   this.fileList = this.fileList.filter(item => item.uid !== file.uid)
      // } else if (file.status === 'removed') {
      //   this.$delete('wc/deleteFile/' + file.uid)
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
      formData.append('wcId', this.wcInfoData.wcId)
      this.$upload('wc/uploadWcPhoto', formData, {
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
    wcInfoVisiable () {
      if (this.wcInfoVisiable) {
        this.$get('wc/wcFiles', {
          wcId: this.wcInfoData.wcId
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
