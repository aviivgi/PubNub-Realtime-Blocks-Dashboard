<template>
  <div>
    <div class="row mt-4 mb-1">
        <div class="col-12">
            <h1>Google Charts</h1>
            <div id="myChartBlocks" ref="myChartBlocks"></div>
        </div>
    </div>
  </div>
</template>

<script>
import {GoogleCharts} from 'google-charts'

let _ = require('lodash')

export default {
  props: ['myData', 'ehStats'],
  data () {
    return {
      ctx: null,
      chart: null,
      gChartOptionsBlocks: {
        title: 'PubNub Blocks Messages',
        hAxis: {
          title: 'Block Name',
          viewWindow: {
            max: 10,
            min: 0
          }
        },
        vAxis: {
          title: 'Total Messages per Block'
        }
      },
      chartData: [],
      appsStats: []
    }
  },
  watch: {
    myData: function () {
      console.log('myData', this.myData)
      this.drawLineChartBlocks()
    }
  },
  methods: {
    drawLineChartBlocks () {
      let that = this
      console.log('Google Charts - Line')

      // eslint-disable-next-line
      let data = new google.visualization.DataTable()
      data.addColumn('string', 'Block Name')
      data.addColumn('number', 'Messages Count')
      data.addRows(that.myData)

      const LineChart = new GoogleCharts.api.visualization.ColumnChart(this.$refs.myChartBlocks)
      LineChart.draw(data, that.gChartOptionsBlocks)
    },
    addData () {
      // 1. get current array of values
      // console.log('BEFORE SLICE', this.tblData.length)
      // 2. add the new value
      this.tblData.push(
        ['2018', (Math.random() * 10000) + (Math.random() * 100), (Math.random() * 1000) + (Math.random() * 50)]
      )
      // 3. remvoe the last item from the array
      let arrMax = 20
      let arrLen = this.tblData.length
      let nl = 1

      if (arrLen > arrMax) {
        this.tblData = _.slice(this.tblData, nl, arrMax)
      } else {
        this.tblData = _.slice(this.tblData, 0, arrMax)
      }
      // console.log('AFTER SLICE', this.tblData.length)
      // 4. draw the chat with the new values
      this.drawNewLineChart()
    }
  },
  mounted: function () {
    GoogleCharts.load(this.drawLineChartBlocks)
  }
}
</script>

<style>

</style>
