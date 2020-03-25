<template>
  <a-modal
    title="派车信息"
    :centered="true"
    :width="850"
    :visible="carSendInfoVisiable"
    :keyboard="false"
    :footer="null"
    @cancel="handleCancleClick">
      <a-card :bordered="false">
        <detail-list>
          <detail-list-item term="事由">{{carSendInfoData.remark}}</detail-list-item>
          <detail-list-item term="状态">{{getStatus(carSendInfoData.status)}}</detail-list-item>
          <detail-list-item term="车牌号">{{carSendInfoData.carNum}}</detail-list-item>
          <detail-list-item term="车牌颜色">{{getColor(carSendInfoData.color)}}</detail-list-item>
          <detail-list-item term="司机">{{carSendInfoData.driver}}</detail-list-item>
          <detail-list-item term="部门">{{carSendInfoData.deptName}}</detail-list-item>
          <detail-list-item term="创建时间">{{getCreateTime(carSendInfoData.createTime)}}</detail-list-item>
        </detail-list>
      </a-card>
  </a-modal>
</template>
<script>
import DetailList from '@/components/tool/DetailList'

const DetailListItem = DetailList.Item
export default {
  components: {DetailListItem, DetailList},
  name: 'CarSendInfo',
  props: {
    carSendInfoVisiable: {
      require: true,
      default: false
    },
    carSendInfoData: {
      require: true
    }
  },
  data () {
    return {}
  },
  methods: {
    getStatus (status) {
      if (status === '0') {
        return '未派车'
      } else if (status === '1') {
        return '已派车'
      }
    },
    getColor (color) {
      if (color === '1') {
        return '黄'
      } else if (color === '2') {
        return '蓝'
      }
    },
    getCreateTime (createTime) {
      if (createTime) return createTime.replace(/T/, ' ')
    },
    handleCancleClick () {
      this.$emit('close')
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
