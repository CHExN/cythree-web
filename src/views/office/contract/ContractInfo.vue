<template>
  <a-modal
    title="合同联审单信息"
    :centered="true"
    :width="1200"
    :visible="contractInfoVisiable"
    :keyboard="false"
    :footer="null"
    @cancel="handleCancleClick">
    <a-card :bordered="false">
      <a-steps progressDot :current="current" :status='status'>
        <a-step title="创建">
          <a-step-item-group slot="description">
            <a-step-item :title="contractInfoData.createDate" style="cursor: default;"/>
          </a-step-item-group>
        </a-step>
        <a-step title="联审部门">
          <a-step-item-group slot="description">
            <a-step-item
              v-if="current === 1 && contractInfoData.process === 0"
              title="催一下"
              icon="bell"
              v-on:click.native="bell((contractInfoData.isInitiate === 0 ? user.username + ',' : '') +
                                      (contractInfoData.isFinance === 0 ? 'finance' : ''))"
            />
            <a-step-item
              v-else-if="contractInfoData.isInitiate === 1 && contractInfoData.isFinance === 1"
              title="审核通过"
              icon="check-circle"
              style="cursor: default;"
            />
            <a-step-item
              v-else
              title="审核未通过"
              icon="exclamation-circle"
              style="cursor: default;"
            />
          </a-step-item-group>
        </a-step>
        <template v-for="(username, index) in reviewList">
          <a-step :title="reviewNameList[index]" :key="index">
            <a-step-item-group slot="description">
              <a-step-item
                v-if="current === index + 2 && contractInfoData.process === 0 && username !== user.username"
                title="催一下"
                icon="bell"
                v-on:click.native="bell(username)"
              />
              <a-step-item
                v-else-if="current > index + 2 || contractInfoData.process === 1"
                title="审核通过"
                icon="check-circle"
                style="cursor: default;"
              />
              <a-step-item
                v-else-if="current === index + 2 && contractInfoData.process === -1"
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
        <detail-list-item term="单位名称">北京市朝阳区环境卫生服务中心</detail-list-item>
        <detail-list-item term="承办部门">{{contractInfoData.deptName}}</detail-list-item>
        <detail-list-item term="合同名称">{{contractInfoData.contractName}}</detail-list-item>
        <detail-list-item term="合同对方">{{contractInfoData.contractPartner}}</detail-list-item>
        <detail-list-item term="合同约定事项是否经过招标">{{contractInfoData.isTender==='1'?'是':'否'}}</detail-list-item>
        <detail-list-item term="合同编号">{{contractInfoData.contractNum}}</detail-list-item>
        <detail-list-item term="合同金额">{{$tools.addZero($tools.toNumFormant(contractInfoData.contractAmount))}} 元</detail-list-item>
        <detail-list-item term="其他情况说明">{{contractInfoData.remark}}</detail-list-item>
      </detail-list>
      <a-divider style="margin-bottom: 32px"/>
      <detail-list title="审核情况">
        <a-card-grid
          v-for="(item, index) in data"
          :key="index"
          style="width:25%;height:100px;textAlign:'center'"
        >
          <a-comment :author="item.name" style="left: -18px;top: -22px">
            <p slot="content">{{contractInfoData[item.value] ? contractInfoData[item.value] : '- -'}}</p>
            <a-tooltip slot="datetime">
              <span>{{contractInfoData[item.date]}}</span>
            </a-tooltip>
          </a-comment>
        </a-card-grid>
      </detail-list>
      <div style="margin-top: 32px">
        <a-upload-dragger
          :fileList="fileList"
          :remove="handleRemove"
          :customRequest="customRequest"
          :beforeUpload="handleBeforeUpload"
          :disabled="fileList.length > 5"
        >
          <p class="ant-upload-drag-icon">
            <a-icon type="inbox" />
          </p>
          <p class="ant-upload-hint">单击或拖动文件到此区域进行上传</p>
        </a-upload-dragger>
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
const data = [
  {
    name: '合同承办部门意见',
    value: 'opinionStart',
    date: 'dateStart'
  }, {
    name: '法务审核意见',
    value: 'opinionLegal',
    date: 'dateLegal'
  }, {
    name: '财务审核意见',
    value: 'opinionFinancial',
    date: 'dateFinancial'
  }, {
    name: '关联部门意见',
    value: 'opinionAss',
    date: 'dateAss'
  }, {
    name: '合同管理管理部门意见',
    value: 'opinionOffice',
    date: 'dateOffice'
  }, {
    name: '合同承办部门主管领导意见',
    value: 'opinionHead',
    date: 'dateHead'
  }, {
    name: '合同管理部门主管领导意见',
    value: 'opinionViceCaptain',
    date: 'dateViceCaptain'
  }, {
    name: '单位负责人意见',
    value: 'opinionCaptain',
    date: 'dateCaptain'
  }
]
export default {
  components: { AStepItemGroup, AStepItem, DetailListItem, DetailList },
  name: 'ContractInfo',
  props: {
    contractInfoVisiable: {
      require: true,
      default: false
    },
    contractInfoData: {
      require: true
    }
  },
  data () {
    return {
      reviewNameList: ['管理部门', '承办部门领导', '管理部门领导', '单位负责人'],
      reviewList: [],
      fileList: [],
      data
    }
  },
  computed: {
    ...mapState({
      user: state => state.account.user
    }),
    current () {
      const { process, step, isInitiate, isFinance } = this.contractInfoData
      // 如果审核失败，判断是在联合审核时失败的 还是在逐一审核时
      if (process === -1) {
        return isInitiate === 0 || isFinance === 0 ? 1 : step + 1
      }
      // 如果现在正在联合审核，则直接返回1
      if (isInitiate === 0 || isFinance === 0) {
        return 1
      }
      // 为什么+1? 1是联审部门，同上 process为-1时的step + 1
      return step + process + 1
    },
    status () {
      if (this.contractInfoData.process === 1) { return 'finish' }
      if (this.contractInfoData.process === -1) { return 'error' }
      return 'process'
    }
  },
  methods: {
    handleCancleClick () {
      this.$emit('close')
    },
    handleRemove (file) {
      let that = this
      if (file.status === 'removed') {
        that.$delete('contract/deleteFile/' + file.uid).then(() => {
          that.$message.success(`${file.name.slice(file.name.indexOf('_') + 1)} 删除成功`)
        })
        const index = that.fileList.indexOf(file)
        const newFileList = that.fileList.slice()
        newFileList.splice(index, 1)
        that.fileList = newFileList
      }
    },
    handleBeforeUpload (file) {
      // const isFile = file.type.slice(0, 15) === 'application/vnd'
      // if (!isFile) {
      // this.$message.error('Please upload the file in the correct format!')
      // }
      const isLt20M = file.size / 1024 / 1024 < 20
      if (!isLt20M) {
        this.$message.error('File must smaller than 20Mb!')
      }
      return isLt20M
    },
    customRequest ({data, file, filename, onError, onProgress, onSuccess}) {
      const formData = new FormData()
      if (data) {
        Object.keys(data).map(key => {
          formData.append(key, data[key])
        })
      }
      formData.append('file', file)
      formData.append('id', this.contractInfoData.id)
      this.$upload('contract/uploadContractFile', formData, {
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
    },
    bell (username) {
      const message = `${this.user.username} 催了您一下合同联审单编号为 ${this.contractInfoData.contractNum} 的审核进度`
      this.$post('message', {
        'message': message,
        'sender': this.user.username,
        'senderDept': this.user.deptName,
        'addressee': username
      }).then((r) => {
        this.$message.success(`已向 ${username.replace(/,$/gi, '')} 通知`)
      })
    }
  },
  watch: {
    contractInfoVisiable () {
      if (this.contractInfoVisiable) {
        this.reviewList = this.contractInfoData.review.split(',')
        this.$get('contract/contractFiles', {
          contractId: this.contractInfoData.id
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
