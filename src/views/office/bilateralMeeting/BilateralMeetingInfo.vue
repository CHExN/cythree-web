<template>
  <a-modal
    title="上会议题信息"
    :centered="true"
    :width="1000"
    :visible="bilateralMeetingInfoVisiable"
    :keyboard="false"
    :footer="null"
    @cancel="handleCancleClick">
    <a-card :bordered="false">
      <a-steps progressDot :current="current" :status='status'>
        <a-step title="创建">
          <a-step-item-group slot="description">
            <a-step-item :title="bilateralMeetingInfoData.createTime ? bilateralMeetingInfoData.createTime.substr(0, 10) : ''" style="cursor: default;"/>
          </a-step-item-group>
        </a-step>
        <template v-for="(username, index) in reviewList">
          <a-step :title="processEnglishToChinese(index)" :key="index">
            <a-step-item-group slot="description">
              <a-step-item
                v-if="current === index + 1 && bilateralMeetingInfoData.process === 0 && username !== user.username"
                title="催一下"
                icon="bell"
                v-on:click.native="bell(username)"
              />
              <a-step-item
                v-else-if="current > index + 1 || bilateralMeetingInfoData.process === 1"
                title="审核通过"
                icon="check-circle"
                style="cursor: default;"
              />
              <a-step-item
                v-else-if="current === index + 1 && bilateralMeetingInfoData.process === -1"
                title="审核未通过"
                icon="exclamation-circle"
                style="cursor: default;"
              />
            </a-step-item-group>
          </a-step>
        </template>
        <a-step title="完成"></a-step>
      </a-steps>
      <a-divider style="margin-bottom: 32px"/>
    </a-card>
    <a-card :bordered="false">
      <detail-list title="基本信息">
        <detail-list-item term="部门">{{bilateralMeetingInfoData.deptName}}</detail-list-item>
        <detail-list-item term="申请人">{{bilateralMeetingInfoData.applicant}}</detail-list-item>
        <detail-list-item term="拟上会议题">{{bilateralMeetingInfoData.bilateralMeeting}}</detail-list-item>
        <detail-list-item term="提议事由梗概">{{bilateralMeetingInfoData.proposedCauseSummary}}</detail-list-item>
        <detail-list-item term="上会时间">{{bilateralMeetingInfoData.meetingTime ?  this.$tools.getDateTime(bilateralMeetingInfoData.meetingTime) : '未定'}}</detail-list-item>
      </detail-list>
      <a-divider style="margin-bottom: 32px"/>
      <detail-list title="意见信息">
        <!-- <a-card-grid
          v-for="(item, index) in data"
          :key="index"
          style="width:25%;height:100px;textAlign:'center'"
        >
          <a-comment :author="item.name" style="left: -18px;top: -22px">
            <a slot="actions">编辑</a>
            <p slot="content">{{bilateralMeetingInfoData[item.value] ? bilateralMeetingInfoData[item.value] : '- -'}}</p>
            <a-tooltip slot="datetime">
              <span>{{bilateralMeetingInfoData[item.date]}}</span>
            </a-tooltip>
          </a-comment>
        </a-card-grid> -->
        <a-list itemLayout="horizontal" :dataSource="data">
        <a-list-item slot="renderItem" slot-scope="item">
          <a slot="actions" v-if="user.username===item.username" @click="handleEditorialOpinion(item)">编辑</a>
          <!-- <a slot="actions">删除</a> -->
          <a-list-item-meta :description="item.text">
            <span slot="title" >{{bilateralMeetingInfoData[item.value] ? bilateralMeetingInfoData[item.value] : '暂无'}}</span>
            <!-- <a-avatar
              slot="avatar"
              src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
            /> -->
          </a-list-item-meta>
        </a-list-item>
      </a-list>
      </detail-list>
      <a-upload :multiple="true" :fileList="fileList"/>
      <a-modal
        title="编辑意见"
        centered
        v-model="modalVisible"
      >
        <template slot="footer">
          <a-button key="back" @click="handleCancel">取消</a-button>
          <a-button key="submit" type="primary" :loading="loading" @click="handleOk">
            确定
          </a-button>
        </template>
        <a-textarea placeholder="Basic usage" v-model="text" :rows="6"/>
      </a-modal>
    </a-card>
  </a-modal>
</template>
<script>
import DetailList from '@/components/tool/DetailList'
import AStepItem from '../../../components/tool/AStepItem'
import { mapState } from 'vuex'

const DetailListItem = DetailList.Item
const AStepItemGroup = AStepItem.Group
// const data = [
//   {
//     name: '办公室意见',
//     value: 'opinionOffice',
//     date: 'dateOffice'
//   }, {
//     name: '队长意见',
//     value: 'opinionCaptain',
//     date: 'dateCaptain'
//   }
// ]
const data = [
  {
    text: '办公室意见',
    value: 'opinionOffice',
    date: 'dateOffice',
    username: 'office'
  },
  {
    text: '队长意见',
    value: 'opinionCaptain',
    date: 'dateCaptain',
    username: 'captain'
  }
]

export default {
  components: { AStepItemGroup, AStepItem, DetailListItem, DetailList },
  name: 'BilateralMeetingInfo',
  props: {
    bilateralMeetingInfoVisiable: {
      require: true,
      default: false
    },
    bilateralMeetingInfoData: {
      require: true
    }
  },
  data () {
    return {
      data,
      loading: false,
      modalVisible: false,
      text: '',
      opinionType: '',
      fileList: [],
      reviewList: []
    }
  },
  computed: {
    ...mapState({
      user: state => state.account.user
    }),
    current () {
      if (this.bilateralMeetingInfoData.process === -1) {
        return this.bilateralMeetingInfoData.step
      }
      return this.bilateralMeetingInfoData.step + this.bilateralMeetingInfoData.process
    },
    status () {
      if (this.bilateralMeetingInfoData.process === 1) { return 'finish' }
      if (this.bilateralMeetingInfoData.process === -1) { return 'error' }
      return 'process'
    }
  },
  methods: {
    handleCancel () {
      this.modalVisible = false
    },
    handleOk () {
      this.loading = true
      let data = {}
      data.id = this.bilateralMeetingInfoData.id
      data[this.opinionType] = this.text
      this.$put('bilateralMeeting/updateOpinion', {
        ...data
      }).then((r) => {
        this.bilateralMeetingInfoData[this.opinionType] = this.text
        this.opinionType = ''
        this.text = ''
        this.loading = false
        this.modalVisible = false
        this.$emit('success')
      })
    },
    handleEditorialOpinion (item) {
      this.opinionType = item.value
      this.text = this.bilateralMeetingInfoData[item.value]
      this.modalVisible = true
    },
    handleCancleClick () {
      this.$emit('close')
    },
    processEnglishToChinese (index) {
      switch (index) {
        case 0:
          return '办公室'
        case 1:
          return '队长'
        default:
          return index
      }
    },
    bell (username) {
      const message = `${this.user.username} 催了您一下上会议题申请人为 ${this.bilateralMeetingInfoData.applicant} 的流程进度`
      this.$post('message', {
        'message': message,
        'sender': this.user.username,
        'senderDept': this.user.deptName,
        'addressee': username
      }).then((r) => {
        this.$message.success(`已向 ${username} 通知`)
      })
    }
  },
  watch: {
    bilateralMeetingInfoVisiable () {
      if (this.bilateralMeetingInfoVisiable) {
        this.reviewList = this.bilateralMeetingInfoData.review.split(',')
        this.$get('bilateralMeeting/bilateralMeetingFiles', {
          bilateralMeetingId: this.bilateralMeetingInfoData.id
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
