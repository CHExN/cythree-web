<template>
  <div :class="[multipage === true ? 'multi-page':'single-page', 'not-menu-page', 'home-page']">
    <a-row :gutter="8" class="head-info">
      <a-card :loading="loading" class="head-info-card" :bordered="false" :hoverable="true" >
        <a-col :md="12" :xl="18">
          <div class="head-info-avatar">
            <img alt="头像" :src="avatar">
          </div>
          <div class="head-info-count">
            <div class="head-info-welcome">
              {{welcomeMessage}}
            </div>
            <div class="head-info-desc">
              <p>{{user.deptName ? user.deptName : '暂无部门'}} | {{user.roleName ? user.roleName : '暂无角色'}}</p>
            </div>
            <div class="head-info-time">上次登录时间：{{user.lastLoginTime ? user.lastLoginTime : '第一次访问系统'}}</div>
          </div>
        </a-col>
        <a-col :md="12" :xl="6">
          <div>
            <a-row class="more-info">
              <a-col v-hasPermission="'wc:view'" :span="8" @click="go('/business/wc')">
                <head-info title="公厕数量" :content="wcCount" :center="false" :bordered="false"/>
              </a-col>
              <a-col v-hasPermission="'staffInside:view'" :span="8" @click="go('/personnel/staffInside')" >
                <head-info title="编内人员" :content="staffInsideCount" :center="false" :bordered="false"/>
              </a-col>
              <a-col v-hasPermission="'staffOutside:view'" :span="8" @click="go('/personnel/staffOutside')" >
                <head-info title="编外人员" :content="staffOutsideCount" :center="false" :bordered="false"/>
              </a-col>
            </a-row>
          </div>
        </a-col>
      </a-card>
    </a-row>
    <a-row :gutter="24">
      <a-col v-hasPermission="'totalExpenses:view'" :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
        <chart-card :loading="loading" title="总支出" :total="`￥${totalExpenditureThisYear}`">
          <a-tooltip title="本年总支出" slot="action">
            <a-icon type="info-circle-o" />
          </a-tooltip>
          <div>
            <trend :type="yearPercentage>0" term="年同比" style="margin-right: 16px;" :percentage="Math.abs(yearPercentage)"/>
            <trend :type="monthPercentage>0" term="月环比" style="margin-right: 16px;" :percentage="Math.abs(monthPercentage)"/>
          </div>
          <template slot="footer">月均支出<span>{{`￥ ${monthAverage}`}}</span></template>
        </chart-card>
      </a-col>
      <a-col v-hasPermission="'views:view'" :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
        <chart-card :loading="loading" title="访问量" :total="totalVisitCount | NumberFormat">
          <a-tooltip title="访问量" slot="action">
            <a-icon type="info-circle-o" />
          </a-tooltip>
          <div>
            <mini-area :data="miniAreaData" />
          </div>
          <template slot="footer">今日访问量<span> {{ todayVisitCount | NumberFormat }}</span></template>
        </chart-card>
      </a-col>
      <a-col v-hasPermission="'inventoryNumber:view'" :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
        <chart-card :loading="loading" title="入库单数" :total="totalStoreroomPutThisYear | NumberFormat">
          <a-tooltip title="指标说明" slot="action">
            <a-icon type="info-circle-o" />
          </a-tooltip>
          <div>
            <mini-bar :data="miniBarData" />
          </div>
          <template slot="footer">
            <trend :type="monthPercentageStoreroom>0" term="月环比" style="margin-right: 16px;" :percentage="Math.abs(monthPercentageStoreroom)"/>
            <trend :type="dayPercentageStoreroom>0" term="日环比" style="margin-right: 16px;" :percentage="Math.abs(dayPercentageStoreroom)"/>
          </template>
        </chart-card>
      </a-col>
      <a-col v-hasPermission="'annualProgress:view'" :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
        <chart-card :loading="loading" title="年进度" :total="`${yearProgress}%`">
          <a-tooltip title="对比日期为今年的一月一号至来年的一月一号" slot="action">
            <a-icon type="info-circle-o" />
          </a-tooltip>
          <div>
            <mini-progress color="rgb(19, 194, 194)" :target="yearProgress" :percentage="yearProgress" height="8px" />
          </div>
          <template slot="footer">已过天数 <span>{{dayPassed}}</span></template>
        </chart-card>
      </a-col>
    </a-row>

    <a-card v-hasPermission="'wcConsumptionChart:view'" :bordered="false" :hoverable="true" :body-style="{padding: '0'}">
      <a-spin :spinning="loadingMore" style="padding: 2px 0 0 0;">
        <div class="salesCard">
          <a-tabs default-active-key="1" size="large" :tab-bar-style="{marginBottom: '24px', paddingLeft: '16px'}">
            <div class="extra-wrapper" slot="tabBarExtraContent">
              <a-select @change="handleYearChange" v-model="yearValue" :style="{width: '256px'}">
                <a-select-option v-for="i in 20" :key="2017 + i">{{ `${2017 + i}年` }}</a-select-option>
              </a-select>
            </div>
            <template v-for="(key, index) in Object.keys(rankList)">
              <a-tab-pane :tab="key" :key="index + 1">
                <a-row>
                  <a-col :xl="16" :lg="12" :md="12" :sm="24" :xs="24">
                    <bar :data="barData[key]" title="整年排行" />
                  </a-col>
                  <a-col :xl="8" :lg="12" :md="12" :sm="24" :xs="24">
                    <rank-list title="总消耗排行榜" :list="rankList[key]"/>
                  </a-col>
                </a-row>
              </a-tab-pane>
            </template>
          </a-tabs>
        </div>
      </a-spin>
    </a-card>

    <div v-hasPermission="'storeroomPutApplicationProportion:view'" class="antd-pro-pages-dashboard-analysis-twoColLayout">
      <a-row :gutter="24" type="flex" :style="{ marginTop: '24px' }">

        <a-col :xl="12" :lg="24" :md="24" :sm="24" :xs="24">
      <a-spin :spinning="loadingMoreMore" >
          <a-card class="antd-pro-pages-dashboard-analysis-salesCard" title="入库类别占比"
            :loading="loading" :bordered="false" :hoverable="true" :style="{ height: '100%' }">
            <div slot="extra" style="height: inherit;">
              <div class="analysis-salesTypeRadio">
                <a-month-picker :allowClear="false" v-model="monthValue" @change="handleMonthChange"/>
                <!-- <a-radio-group defaultValue="a">
                  <a-radio-button value="a">全部渠道</a-radio-button>
                  <a-radio-button value="b">线上</a-radio-button>
                  <a-radio-button value="c">门店</a-radio-button>
                </a-radio-group> -->
              </div>
            </div>
            <h4>占比度</h4>
            <div>
              <!-- style="width: calc(100% - 240px);" -->
              <div>
                <v-chart :force-fit="true" :height="405" :data="pieData" :scale="pieScale">
                  <v-tooltip :showTitle="false" dataKey="item*percent" />
                  <v-axis />
                  <!-- position="right" :offsetX="-140" -->
                  <v-legend dataKey="item*count"/>
                  <v-pie position="percent" color="item" :vStyle="pieStyle" />
                  <v-coord type="theta" :radius="0.75" :innerRadius="0.6" />
                </v-chart>
              </div>
            </div>
          </a-card>
      </a-spin>
        </a-col>

      </a-row>
    </div>

  </div>
</template>
<script>
import HeadInfo from '@/views/common/HeadInfo'
import { ChartCard, MiniArea, MiniBar, MiniProgress, Trend, RankList, Bar } from '@/components'
import { mapState } from 'vuex'
import moment from 'moment'
moment.locale('zh-cn')

const DataSet = require('@antv/data-set')

export default {
  name: 'HomePage',
  components: { HeadInfo, ChartCard, MiniArea, MiniBar, MiniProgress, Trend, RankList, Bar },
  data () {
    return {
      loading: true,
      loadingMore: false,
      loadingMoreMore: false,

      pieData: [],
      pieScale: [{
        dataKey: 'percent',
        min: 0,
        formatter: '.0%'
      }],
      pieStyle: {
        stroke: '#fff',
        lineWidth: 1
      },

      rankList: [],
      barData: [],

      miniAreaData: [],
      miniBarData: [],
      wcCount: 0,
      staffInsideCount: 0,
      staffOutsideCount: 0,
      totalVisitCount: '',
      todayVisitCount: '',
      totalExpenditureThisYear: '',
      yearPercentage: 0,
      monthPercentage: 0,
      monthAverage: '',
      lastLoginTime: '',
      welcomeMessage: '',
      yearProgress: 0,
      dayPassed: 0,
      totalStoreroomPutThisYear: 0,
      monthPercentageStoreroom: 0,
      dayPercentageStoreroom: 0,

      yearValue: moment().year(),
      monthValue: moment()
    }
  },
  computed: {
    ...mapState({
      multipage: state => state.setting.multipage,
      user: state => state.account.user
    }),
    avatar () {
      return `static/avatar/${this.user.avatar}`
    }
  },
  methods: {
    welcome () {
      const hour = moment().hours()
      let time = hour < 6 ? '早上好' : (hour <= 11 ? '上午好' : (hour <= 13 ? '中午好' : (hour <= 18 ? '下午好' : '晚上好')))
      return `${time}，${this.user.username}`
    },
    go (path) {
      this.$router.push(path)
    },
    handleYearChange (value) {
      this.loadingMore = true
      this.$get(`wc/index/${this.yearValue}`).then((r) => {
        this.tableDiagramDataProcessing(r.data.data.allMonthWcConsumptionByYear, r.data.data.allOwnWcConsumptionByYear)
        this.loadingMore = false
      })
    },
    handleMonthChange (value) {
      this.loadingMoreMore = true
      this.$get(`storeroomPut/index/${value.format('YYYY')}-${value.format('MM')}`).then((r) => {
        this.ringDiagramDataProcessing(r.data.data.storeroomPutTypeApplicationProportion)
        this.loadingMoreMore = false
      })
    },
    ringDiagramDataProcessing (storeroomPutTypeApplicationProportion) {
      const dv = new DataSet.View().source(storeroomPutTypeApplicationProportion)
      dv.transform({
        type: 'percent',
        field: 'money',
        dimension: 'item',
        as: 'percent'
      })
      this.pieData = dv.rows
    },
    tableDiagramDataProcessing (allMonthWcConsumptionByYear, allOwnWcConsumptionByYear) {
      let newData = {
        barData: {},
        rankList: {}
      }
      // 以下数据处理
      allMonthWcConsumptionByYear.forEach((item) => {
        let name = item.wcOwn
        if (newData.barData[name]) {
          newData.barData[name].push({date: item.date, money: item.money})
        } else {
          newData.barData[name] = [{date: item.date, money: item.money}]
        }
      })
      Object.keys(newData.barData).forEach(key => {
        let months = newData.barData[key].map(a => a.date)
        for (let i = 0; i <= 11; i++) {
          let month = moment().year(this.yearValue).month(i).format('YY-MM')
          if (!months.includes(month)) newData.barData[key].splice(i, 0, {date: month, money: 0})
        }
      })
      allOwnWcConsumptionByYear.forEach((item) => {
        let name = item.wcOwn
        if (newData.rankList[name]) {
          newData.rankList[name].push({name: item.wcName, total: item.money, wcId: item.wcId})
        } else {
          newData.rankList[name] = [{name: item.wcName, total: item.money, wcId: item.wcId}]
        }
      })
      this.barData = newData.barData
      this.rankList = newData.rankList
    },
    compare (property) {
      return function (obj1, obj2) {
        let value1 = obj1[property]
        let value2 = obj2[property]
        return value1 - value2
      }
    }
  },
  mounted () {
    this.loading = true
    this.loadingMore = true
    this.welcomeMessage = this.welcome()
    this.$get(`loadData`, {
      year: this.yearValue,
      date: `${this.monthValue.format('YYYY')}-${this.monthValue.format('MM')}`
    }).then((r) => {
      let data = r.data.data
      this.miniAreaData = data.lastSevenVisitCount || [] // 近期系统访问记录
      this.miniBarData = data.storeroomPutDaysVisitCount || [] // 近期系统入库单数记录
      this.totalVisitCount = this.$tools.toNumFormant(data.countList[0]) // 系统总访问次数
      this.todayVisitCount = this.$tools.toNumFormant(data.countList[1]) // 系统今日访问次数
      this.wcCount = this.$tools.toNumFormant(data.countList[2]) // 公厕总数
      this.staffInsideCount = this.$tools.toNumFormant(data.countList[3]) // 编内人员总数
      this.staffOutsideCount = this.$tools.toNumFormant(data.countList[4]) // 编外人员总数
      this.totalExpenditureThisYear = this.$tools.toNumFormant(data.countList[5])// 今年总支出
      this.yearPercentage = data.countList[6] // 今年支出与去年支出比较的百分比
      this.monthPercentage = data.countList[7] // 本月支出与上月支出比较的百分比
      this.monthAverage = this.$tools.toNumFormant(Math.round(data.countList[5] / (moment().month() + 1) * 100) / 100) // 月均支出
      this.totalStoreroomPutThisYear = this.$tools.toNumFormant(data.countList[8])// 总入库单数
      this.monthPercentageStoreroom = data.countList[9] // 月同比入库单数
      this.dayPercentageStoreroom = data.countList[10] // 日同比入库单数

      // 中间那个表图数据处理
      this.tableDiagramDataProcessing(data.allMonthWcConsumptionByYear, data.allOwnWcConsumptionByYear)

      // 环形图
      this.ringDiagramDataProcessing(data.storeroomPutTypeApplicationProportion)

      // 设置年进度
      let day = moment().diff(moment().startOf('year'), 'day')
      let dayCount = 0
      for (let i = 1; i < 13; i++) {
        dayCount += moment().month(i).daysInMonth()
      }
      this.dayPassed = day // 已过天数
      this.yearProgress = Math.round(day / dayCount * 100) // 年进度

      this.loading = false
      this.loadingMore = false
    }).catch((r) => {
      console.error(r)
      this.loading = false
      this.$message.error('获取首页信息失败')
    })
  }
}
</script>
<style lang="less">
  .antd-pro-pages-dashboard-analysis-twoColLayout {
    position: relative;
    display: flex;
    display: block;
    flex-flow: row wrap;
  }

  .antd-pro-pages-dashboard-analysis-salesCard {
    height: calc(100% - 24px);
    /deep/ .ant-card-head {
      position: relative;
    }
  }

  .dashboard-analysis-iconGroup {
    i {
      margin-left: 16px;
      color: rgba(0,0,0,.45);
      cursor: pointer;
      transition: color .32s;
      color: black;
    }
  }

  .extra-wrapper {
    line-height: 55px;
    padding-right: 24px;

    .extra-item {
      display: inline-block;
      margin-right: 24px;

      a {
        margin-left: 24px;
      }
    }
  }

  .analysis-salesTypeRadio {
    position: absolute;
    right: 20px;
    bottom: 12px;
  }

  .home-page {
    .head-info {
      margin-bottom: .5rem;
      .head-info-card {
        padding: .5rem;
        border-color: #f1f1f1;
        .head-info-avatar {
          display: inline-block;
          float: left;
          margin-right: 1rem;
          img {
            width: 5rem;
            border-radius: 2px;
          }
        }
        .head-info-count {
          display: inline-block;
          float: left;
          .head-info-welcome {
            font-size: 1.05rem;
            margin-bottom: .1rem;
          }
          .head-info-desc {
            color: rgba(0, 0, 0, 0.45);
            font-size: .8rem;
            padding: .2rem 0;
            p {
              margin-bottom: 0;
            }
          }
          .head-info-time {
            color: rgba(0, 0, 0, 0.45);
            font-size: .8rem;
            padding: .2rem 0;
          }
        }
      }
    }
    .count-info {
      .visit-count-wrapper {
        padding-left: 0 !important;
        .visit-count {
          padding: .5rem;
          border-color: #f1f1f1;
          .ant-card-body {
            padding: .5rem 1rem !important;
          }
        }
      }
      .project-wrapper {
        padding-right: 0 !important;
        .project-card {
          border: none !important;
          .ant-card-head {
            border-left: 1px solid #f1f1f1 !important;
            border-top: 1px solid #f1f1f1 !important;
            border-right: 1px solid #f1f1f1 !important;
          }
          .ant-card-body {
            padding: 0 !important;
            table {
              width: 100%;
              td {
                width: 50%;
                border: 1px solid #f1f1f1;
                padding: .6rem;
                .project-avatar-wrapper {
                  display:inline-block;
                  float:left;
                  margin-right:.7rem;
                  .project-avatar {
                    color: #42b983;
                    background-color: #d6f8b8;
                  }
                }
              }
            }
          }
          .project-detail {
            display:inline-block;
            float:left;
            text-align:left;
            width: 78%;
            .project-name {
              font-size:.9rem;
              margin-top:-2px;
              font-weight:600;
            }
            .project-desc {
              color:rgba(0, 0, 0, 0.45);
              p {
                margin-bottom:0;
                font-size:.6rem;
                white-space:normal;
              }
            }
          }
        }
      }
    }
  }
</style>
