<template>
  <a-modal
    title="公厕投诉信息"
    :centered="true"
    :width="700"
    :visible="wcComplaintInfoVisiable"
    :keyboard="false"
    :footer="null"
    @cancel="handleCancleClick">
      <a-card :bordered="false">
        <detail-list :col="2">
          <detail-list-item term="公厕名称">{{wcComplaintInfoData.wcName}}</detail-list-item>
          <detail-list-item term="公厕编号">{{wcComplaintInfoData.wcNum}}</detail-list-item>
          <detail-list-item term="创建时间">{{$tools.getDateTime(wcComplaintInfoData.createTime)}}</detail-list-item>
          <detail-list-item term="投诉人电话">{{wcComplaintInfoData.phone}}</detail-list-item>
        </detail-list>
        <detail-list :col="1">
          <detail-list-item term="投诉内容">{{wcComplaintInfoData.content}}</detail-list-item>
        </detail-list>
        <a-divider v-if="wcComplaintInfoData.voiceId" style="margin-bottom: 32px"/>
        <div v-if="wcComplaintInfoData.voiceId" style="font-size: 16px; color: rgba(0,0,0,.85); font-weight: bolder; margin-bottom: 16px;">语音信息
          <a-button type="primary" @click="play">
            <a-icon type="sound" />
          </a-button>
        </div>
      </a-card>
  </a-modal>
</template>
<script>
import DetailList from '@/components/tool/DetailList'

const DetailListItem = DetailList.Item
export default {
  components: { DetailListItem, DetailList },
  name: 'WcComplaintInfo',
  props: {
    wcComplaintInfoVisiable: {
      require: true,
      default: false
    },
    wcComplaintInfoData: {
      require: true
    }
  },
  data () {
    return {
    }
  },
  methods: {
    handleCancleClick () {
      this.$emit('close')
    },
    play () {
      let audio = new Audio()
      audio.src = `https://wc.ncsll.com${this.wcComplaintInfoData.voiceAddress}`
      audio.play()
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
