<template>
  <a-modal
    title="考勤信息"
    :centered="true"
    :width="850"
    :visible="attendanceInfoVisiable"
    :keyboard="false"
    :footer="null"
    @cancel="handleCancleClick">
      <a-card :bordered="false">
        <detail-list>
          <detail-list-item term="姓名">{{attendanceInfoData.staffName}}</detail-list-item>
          <detail-list-item term="日勤">{{attendanceInfoData.dayWork}}</detail-list-item>
          <detail-list-item term="夜勤">{{attendanceInfoData.nightWork}}</detail-list-item>
          <detail-list-item term="双加">{{attendanceInfoData.doublePlus}}</detail-list-item>
          <detail-list-item term="节加">{{attendanceInfoData.holidayPlus}}</detail-list-item>
          <detail-list-item term="1.5倍">{{attendanceInfoData.hour15}}</detail-list-item>
          <detail-list-item term="2倍">{{attendanceInfoData.hour20}}</detail-list-item>
          <detail-list-item term="公休">{{attendanceInfoData.publicHoliday}}</detail-list-item>
          <detail-list-item term="工龄">{{attendanceInfoData.workingLeave}}</detail-list-item>
          <detail-list-item term="病假">{{attendanceInfoData.sickLeave}}</detail-list-item>
          <detail-list-item term="事假">{{attendanceInfoData.thingLeave}}</detail-list-item>
          <detail-list-item term="婚假">{{attendanceInfoData.marriageLeave}}</detail-list-item>
          <detail-list-item term="丧假">{{attendanceInfoData.funeralLeave}}</detail-list-item>
          <detail-list-item term="工伤">{{attendanceInfoData.workInjury}}</detail-list-item>
          <detail-list-item term="迟退">{{attendanceInfoData.lateAndLeaveEarly}}</detail-list-item>
          <detail-list-item term="平值">{{attendanceInfoData.usuallyDuty}}</detail-list-item>
          <detail-list-item term="双值">{{attendanceInfoData.weekendDuty}}</detail-list-item>
          <detail-list-item term="节值">{{attendanceInfoData.holidayWatch}}</detail-list-item>
          <detail-list-item term="扣分">{{attendanceInfoData.deduction}}</detail-list-item>
          <detail-list-item term="总计">{{attendanceInfoData.totalAttendanceDays}}</detail-list-item>
          <detail-list-item term="备注">{{attendanceInfoData.remark}}</detail-list-item>
          <detail-list-item term="开始日期">{{attendanceInfoData.startDate ? attendanceInfoData.startDate.split(' ')[0] : attendanceInfoData.startDate}}</detail-list-item>
          <detail-list-item term="结束日期">{{attendanceInfoData.endDate ? attendanceInfoData.endDate.split(' ')[0] : attendanceInfoData.endDate}}</detail-list-item>
        </detail-list>
      </a-card>
  </a-modal>
</template>
<script>
import DetailList from '@/components/tool/DetailList'

const DetailListItem = DetailList.Item
export default {
  components: {DetailListItem, DetailList},
  name: 'AttendanceInfo',
  props: {
    attendanceInfoVisiable: {
      require: true,
      default: false
    },
    attendanceInfoData: {
      require: true
    }
  },
  data () {
    return {}
  },
  methods: {
    handleCancleClick () {
      this.$emit('close')
    }
  }
}
</script>
<style lang="less" scoped>
  /* you can make up upload button and sample style by using stylesheets */
  .ant-upload-select-picture-attendanced i {
    font-size: 32px;
    color: #999;
  }
  .ant-upload-select-picture-attendanced .ant-upload-text {
    margin-top: 8px;
    color: #666;
  }
</style>
