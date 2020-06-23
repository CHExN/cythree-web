<template>
  <a-modal
    title="修改申请信息"
    :centered="true"
    :width="800"
    :visible="reviewModifyInfoVisiable"
    :keyboard="false"
    :footer="null"
    @cancel="handleCancleClick">
    <a-card :bordered="false" style="margin-bottom: 32px">
      <detail-list>
        <detail-list-item term="申请部门">{{reviewModifyInfoData.deptName}}</detail-list-item>
        <detail-list-item term="模块">{{reviewModifyInfoData.tableCname}}</detail-list-item>
        <detail-list-item term="内容">{{reviewModifyInfoData.info}}</detail-list-item>
        <detail-list-item term="申请人账号">{{reviewModifyInfoData.username}}</detail-list-item>
        <detail-list-item term="申请时间">{{$tools.getDateTime(reviewModifyInfoData.createTime)}}</detail-list-item>
        <detail-list-item term="状态变更时间">{{reviewModifyInfoData.modifyTime}}</detail-list-item>
        <detail-list-item term="状态">{{getProcess(reviewModifyInfoData.process)}}</detail-list-item>
      </detail-list>
    </a-card>
  </a-modal>
</template>
<script>
import DetailList from '@/components/tool/DetailList'
import AStepItem from '../../../components/tool/AStepItem'

const DetailListItem = DetailList.Item
const AStepItemGroup = AStepItem.Group
export default {
  components: { AStepItemGroup, AStepItem, DetailListItem, DetailList },
  name: 'ReviewModifyInfo',
  props: {
    reviewModifyInfoVisiable: {
      require: true,
      default: false
    },
    reviewModifyInfoData: {
      require: true
    }
  },
  data () {
    return {
      getProcess (process) {
        switch (process) {
          case '0':
            return '待审核'
          case '1':
            return '已通过'
          case '2':
            return '未通过'
          case '3':
            return '已修改'
          default:
            return process
        }
      }
    }
  },
  methods: {
    handleCancleClick () {
      this.$emit('close')
    }
  }
}
</script>
