<template>
  <a-modal
    title="公厕评价信息"
    :centered="true"
    :width="700"
    :visible="wcEvaluateInfoVisiable"
    :keyboard="false"
    :footer="null"
    @cancel="handleCancleClick">
      <a-card :bordered="false">
        <detail-list title="评分信息" :col="2">
          <detail-list-item term="环境评分"><a-rate disabled v-model="wcEvaluateInfoData.environmentStar" /></detail-list-item>
          <detail-list-item term="保洁评分"><a-rate disabled v-model="wcEvaluateInfoData.cleanStar" /></detail-list-item>
          <detail-list-item term="设施评分"><a-rate disabled v-model="wcEvaluateInfoData.installationStar" /></detail-list-item>
          <detail-list-item term="总体评分"><a-rate disabled v-model="wcEvaluateInfoData.wholeStar" /></detail-list-item>
        </detail-list>
        <a-divider style="margin-bottom: 32px"/>
        <detail-list title="基础信息" :col="2">
          <detail-list-item term="公厕名称">{{wcEvaluateInfoData.wcName}}</detail-list-item>
          <detail-list-item term="公厕编号">{{wcEvaluateInfoData.wcNum}}</detail-list-item>
          <detail-list-item term="评价时间">{{$tools.getDateTime(wcEvaluateInfoData.createTime)}}</detail-list-item>
          <detail-list-item term="评价内容">{{wcEvaluateInfoData.content}}</detail-list-item>
        </detail-list>
        <a-divider v-if="wcEvaluateInfoData.voiceId" style="margin-bottom: 32px"/>
        <detail-list v-if="wcEvaluateInfoData.voiceId" title="语音信息">
          <a-button type="primary" @click="play">
            <a-icon type="sound" />
          </a-button>
        </detail-list>
      </a-card>
  </a-modal>
</template>
<script>
import DetailList from '@/components/tool/DetailList'

const DetailListItem = DetailList.Item
export default {
  components: { DetailListItem, DetailList },
  name: 'WcEvaluateInfo',
  props: {
    wcEvaluateInfoVisiable: {
      require: true,
      default: false
    },
    wcEvaluateInfoData: {
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
      audio.src = `https://wc.ncsll.com${this.wcEvaluateInfoData.voiceAddress}`
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
