<template>
  <div>
    <!-- CONTROL PANEL -->
    <div class="row mt-4">
      <div class="col-12">
        <md-switch v-model="show.account" id="showAccount" name="showAccount" class="md-accent">Account</md-switch>
        <md-switch v-model="show.accounts" id="showAccounts" name="showAccounts" class="md-warn">Accounts</md-switch>
        <md-switch v-model="show.apps" id="showApps" name="showApps" class="md-accent">Apps</md-switch>
        <md-switch v-model="show.blocks" id="showBlocks" name="showBlocks" class="md-accent">Blocks</md-switch>
      </div>
    </div>

    <!-- LOGGED-IN ACCOUNT INFO -->
    <div class='row mt-4' v-show="show.account">
      <div class='col-12'>
        <ul class='list-group'>
          <li class='list-group-item active'>Account Information (logged-in)</li>
          <li class='list-group-item justify-content-between'>{{auth.id}} / {{auth.token}} / {{auth.email}} / {{auth.fullName}} / {{auth.phone}}</li>
        </ul>
      </div>
    </div>

    <!-- ACCOUNTS -->
    <appAccounts :my-accounts="accounts" v-show="show.accounts"></appAccounts>

    <!-- APPS -->
    <appApps :my-apps="apps" v-show="show.apps"></appApps>

    <!-- BLOCKS -->
    <appBlocks :my-blocks="blocks" v-show="show.blocks"></appBlocks>

    <!-- Canvas -->
    <!-- <md-button class="md-accent" @click="addData">Accent</md-button> -->

    <!-- Canvas 2 -->
    <!-- <appGoogleChartsMessages :my-data="tblDataBlocks"></appGoogleChartsMessages> -->

    <!-- LOGS -->
    <appLogsTable :my-loglines="logs"></appLogsTable>

  </div>
</template>

<script>
// import Vue from 'vue'
import axios from 'axios'
import tplLoglines from './_loglines'
import tplAccounts from './_accounts'
import tplApps from './_apps'
import tplBlocks from './_blocks'
import tplLogsTable from './_logsTable'
import tplGoogleChartsMessages from './_GoogleCharts_Messages'

import integrations from '../extensions/integrations'
import config from '../extensions/config'

let _ = require('lodash')
let iAxios = axios.create({
  baseURL: 'https://admin.pubnub.com',
  timeout: 3000
})

let PubNub = require('pubnub')
let Stopwatch = require('timer-stopwatch')
let timerApps = new Stopwatch(3000)
let timerBlocks = new Stopwatch(3000)

let slack = require('slack-notify')(integrations.vendors.slack.features.pubnubFunctionsDashboard.webhookUrl)

/**
 * Integrations
 * - Slack WebHook
 */

export default {
  name: 'Configurator',
  components: {
    appLoglines: tplLoglines,
    appAccounts: tplAccounts,
    appApps: tplApps,
    appBlocks: tplBlocks,
    appLogsTable: tplLogsTable,
    appGoogleChartsMessages: tplGoogleChartsMessages
  },
  data () {
    return {
      mode: {
        debug: true,
        consoleLog: false,
        blockEvents: true,
        blockOther: false
      },
      msg: 'configurator',
      content: '',
      accounts: [],
      apps: [],
      apps_new: [],
      key_set: {},
      blocks: [],
      auth: {
        id: '',
        token: '',
        email: '',
        fullName: '',
        phone: ''
      },
      myPubNubs: [],
      logs: [],
      per_page: 1,
      filter: '',
      page: 1,
      show: {
        account: true,
        accounts: true,
        apps: true,
        blocks: true
      },
      tblDataBlocks: [
        ['Bigoper', 0],
        ['Pubnub', 0],
        ['IDX 2.0', 0]
      ],
      tblAppsStats: [],
      gChartsConfig: {
        max: 10,
        trim: 1
      }
    }
  },
  /**
   * watch
   * - here you can react on variable changes -> 'watch' them.
   */
  watch: {
    accounts: function () {
      console.log('==> ACCOUNTS', this.accounts)
    },
    tblDataBlocks: function () {
      console.log('--> tblDataBlocks')
    }
  },
  /**
   * methods
   * - all of your 'functions' live here
   */
  methods: {
    /**
     * TOOLS
     * Set of tools related to page UI and functionality
     * - these are very self explainatory
     */
    showAll () {
      this.show.account = true
      this.show.accounts = true
      this.show.apps = true
      this.show.blocks = true
    },
    hideAll () {
      this.show.account = false
      this.show.accounts = false
      this.show.apps = false
      this.show.blocks = true
    },
    prependArray (value, array) {
      var newArray = array.slice()
      newArray.unshift(value)
      return newArray
    },
    /**
     * init
     * Set of tasks/calls to execute of the 'page' load.
     */
    init () {
      let that = this

      this.getAuth()
      timerApps.start()
      timerApps.onDone(function () {
        that.getBlocks()
      })
    },
    /**
     * pnSubscribeToEH
     * - an array of channels and keys
     * - here we actually subscribing to the requested channels using the relevant keys
     */
    pnSubscribeToEH (channels, keyset) {
      // this.$log.debug('==> PUBNUB INIT', keyset.subscribe_key)
      let that = this
      let pubnub = new PubNub({
        subscribeKey: keyset.subscribe_key,
        publishKey: keyset.publish_key,
        secretKey: keyset.secret_key,
        logVerbosity: false,
        ssl: true,
        restore: true,
        keepAlive: true
      })

      this.myPubNubs = _.concat(this.myPubNubs, pubnub)

      // this.$log.debug('==> PUBNUB SUBSCRIBE', channels)
      that.printManager('channels', channels)
      pubnub.subscribe({
        channels: channels
      })

      // this.$log.debug('==> PUBNUB EVENT LISTENER')
      pubnub.addListener({
        status: function (statusEvent) {
          // this.$log.debug('==> STATUS', statusEvent)
          that.printManager('status', statusEvent)
        },
        message: function (message) {
          // this.$log.debug('==> MESSAGE', message)
          that.printManager('message', message)
        },
        presence: function (presenceEvent) {
          // this.$log.debug('==> PRESENCE', presenceEvent)
          that.printManager('presence', presenceEvent)
        }
      })
    },
    printManager (type, message) {
      switch (type) {
        case 'channels':
          this.printChannels(message)
          break
        case 'debug':
          // this.printDebug(message)
          break
        case 'message':
          this.printMessage(message)
          break
        case 'status':
          // this.printStatus(message)
          break
        case 'presence':
          // this.printPresence(message)
          break
        default:
          // this.printdebug(message)
          break
      }
    },
    /**
     * printDebug
     * - use it to print 'debug' messages to the logs lines
     */
    printDebug (message) {
      // this.$log.debug('==> STATUS: EVENT LISTNER - printDebug', message)
      console.log('-->> this.logs (3)', this.logs)
      this.logs = this.prependArray(message, this.logs)
      console.log('-->> this.logs (4)', this.logs)
    },
    /**
     * printMessage
     * - add the message to the logs array (this.logs)
     * - send the message to a Slack Channel (alert)
     */
    printMessage (message) {
      let payload = {}

      // Building the 'payload'
      payload['message'] = message
      payload['timetoken'] = new Date(Math.floor(Date.now()))

      // Determind the payload 'type'
      if (message.message.hasOwnProperty('level')) {
        payload['type'] = message.message.level
      } else if (
        message.message.hasOwnProperty('block_id')
      ) {
        payload['type'] = message.message.type + ' ' + message.message.state
      } else if (message.message.hasOwnProperty('type')) {
        payload['type'] = message.message.type
      } else {
        payload['type'] = 'Other'
      }

      payload['message'] = JSON.stringify(message)
      payload['text'] = JSON.stringify(payload)

      if (config.mode.debug) {
        console.log('GOT MESSAGE', message)
        console.log('===> ===> TYPE LEN', payload['type'].length)
      }

      if (message.hasOwnProperty('message')) {
        message.message = JSON.stringify(message.message)
      }

      if (payload['type'].length > 0) {
        if (integrations.vendors.slack.enabled) {
          this.slackAlert(integrations.vendors.slack.features.pubnubFunctionsDashboard.webhookUrl, {
            channel: integrations.vendors.slack.channels.alerts,
            icon_emoji: ':red_circle:',
            text: 'Incoming Message: ' + payload['type'],
            username: integrations.vendors.slack.features.pubnubFunctionsDashboard.username,
            fields: message
          })
        }
      }

      // Add to logs
      console.log('-->> this.logs (4)', this.logs)
      this.logs = this.prependArray(payload, this.logs)
      console.log('-->> this.logs (5)', this.logs)
    },
    printChannels (message) {
      let payload = {}

      payload['message'] = message
      payload['timetoken'] = new Date(Math.floor(Date.now()))
      payload['type'] = 'info'
      payload['text'] = JSON.stringify(payload)

      if (config.mode.debug) {
        console.log('-> MESSAGE', message)
        console.log('-> PAYLOAD', payload)
      }

      if (integrations.vendors.slack.enabled) {
        this.slackAlert(integrations.vendors.slack.features.pubnubFunctionsDashboard.webhookUrl, {
          type: 'info',
          channel: integrations.vendors.slack.channels.init,
          icon_emoji: ':white_circle:',
          text: 'INFO: CHANNEL SUBSCRIBE',
          username: integrations.vendors.slack.features.pubnubFunctionsDashboard.username,
          fields: {
            'API': 'Subscribe',
            'CHANNELS': JSON.stringify(message)
          }
        })
      }

      console.log('-->> this.logs (1)', this.logs)
      this.logs = this.prependArray(payload, this.logs)
      console.log('-->> this.logs (2)', this.logs)
    },
    /**
     * getAuth
     * - here we actually using the provided credentials to login to the Portal
     * - get the required information for future API calls.
     */
    getAuth () {
      let that = this
      that.$log.debug('==> ACTION: getAuth')

      return iAxios({
        method: 'POST',
        url: '/api/me',
        headers: { 'Content-Type': 'application/json' },
        data: {
          email: 'bigoper.ha@gmail.com',
          password: 'Bigoper@0!7'
        }
      })
        .then(function (response) {
          that.content = response.data.result
          // this.$log.debug('==> DATA:', that.content)
          that.auth.id = that.content.user_id
          that.auth.token = that.content.token
          that.auth.email = that.content.user.email
          that.auth.fullName = that.content.user.properties.first + ' ' + that.content.user.properties.last
          that.auth.phone = that.content.user.properties.phone

          that.getAccounts()
        })
        .catch(function (error) {
          that.$log.debug(error)
        })
    },
    /**
     * getAccounts
     * - get an array of accounts that the logged-in account has access to
     */
    getAccounts () {
      let that = this
      let myUrl = '/api/accounts?user_id=' + that.auth.id
      this.$log.debug('==> ACTION: getAccounts')

      return iAxios({
        method: 'GET',
        url: myUrl,
        headers: { 'X-Session-Token': that.auth.token }
      })
        .then(function (response) {
          that.content = response.data.result
          that.$log.debug('==> that.content: ACCOUNTS', that.content)
          that.accounts = that.content.accounts
          // _.forEach(that.accounts, function (account) {
          //   that.accounts_new[account.id] = account
          //   that.accounts_new_2.push(account)
          // })

          // console.log('that.accounts_new', that.accounts_new)
          // console.log('that.accounts_new_2', that.accounts_new_2)

          that.getAccountApps()
        })
        .catch(function (error) {
          that.$log.debug('ERROR: ACCOUNTS', error)
        })
    },
    /**
     * getAccountApps
     * - get all Account related Apps
     */
    getAccountApps () {
      let that = this
      that.$log.debug('==> ACTION: gatAccountApps')
      _.forEach(this.accounts, function (account) {
        let myUrl = '/api/apps?owner_id=' + account.id

        return iAxios({
          method: 'GET',
          url: myUrl,
          headers: { 'X-Session-Token': that.auth.token }
        })
          .then(function (response) {
            that.content = response.data.result
            let apps = that.content
            if (config.mode.debug) {
              that.$log.debug('==> ACCOUNT APPS', apps)
            }

            let appsNew = {}

            _.forEach(apps, function (app) {
              // this.$log.debug('==> ACCOUNT APP', app)
              appsNew[app.id] = app
              that.apps = _.concat(that.apps, app)
            })

            // that.accounts_new[account.id].apps = appsNew
          })
          .then(function () {
            // that.$log.debug('--> ACCOUNT APPS', that.accounts_new)
          })
          .catch(function (error) {
            that.$log.debug('ERROR: ACCOUNT APPS', error)
          })
      })
    },
    /**
     * getBlocks
     * - get all App related Blocks/Functions
     */
    getBlocks () {
      let that = this
      // that.$log.debug('==> ACTION: getBlocks')
      _.forEach(this.apps, function (app) {
        _.forEach(app.keys, function (key) {
          // that.$log.debug('==> ==> KEY', key)
          let myUrl = '/api/v1/blocks/key/' + key.id + '/block'

          return iAxios({
            method: 'GET',
            url: myUrl,
            headers: {
              'X-Session-Token': that.auth.token,
              'Content-Type': 'application/json'
            }
          })
            .then(function (response) {
              that.content = response.data.payload
              let blocks = that.content
              if (blocks.length > 0) {
                // that.$log.debug('==> APP -> KEY.ID -> BLOCKS', blocks)
                _.forEach(blocks, function (block) {
                  block['realtime_analytics_channel'] = key.properties.realtime_analytics_channel
                  that.blocks = _.concat(that.blocks, block)
                })
              }
            })
            .then(function () {
              // that.key_set = _.concat(that.key_set, key)
              that.key_set[key.id] = key
            })
            .catch(function (error) {
              that.$log.debug('ERROR: APP -> KEY.ID -> BLOCKS', error)
            })
        })
      })

      timerBlocks.start()
      timerBlocks.onDone(function () {
        // that.$log.debug('-->> SYSTEM: Timer Blocks is complete, calling: pnSubscribe (to all blocks)')
        that.getEventHanlders(that.blocks)
        that.hideAll()
      })
    },
    /**
     * getEventHandlers
     * We'll retrieve an array of Event Hanlders that exists in that block/function
     * - usually 3 channels -> event handlers
     */
    getEventHanlders (value) {
      let that = this
      that.$log.debug('==> ACTION: getEventHanlders')
      _.forEach(value, function (block) {
        let blockChannels = []
        _.forEach(block.event_handlers, function (eh) {
          if (config.mode.debug) {
            // Log to console
            that.$log.debug(
              '|-> EH',
              eh.create_user_id,
              eh.name,
              eh.block_id,
              eh.event,
              eh.output,
              block.sub_key
            )
          }
          if (integrations.vendors.slack.enabled) {
            // message fields structure
            let ehInfo = {
              'User ID': eh.create_user_id,
              'Name': eh.name,
              'Block ID': eh.block_id,
              'Event': eh.event,
              'Output': eh.output,
              'SubKey': block.sub_key
            }
            // Slack alerts
            if (config.mode.blockOther) {
              that.slackAlert(integrations.vendors.slack.features.pubnubFunctionsDashboard.webhookUrl, {
                type: 'info',
                channel: integrations.vendors.slack.channels.init,
                icon_emoji: ':white_circle:',
                text: 'INFO: EVENT HANDLER',
                username: integrations.vendors.slack.features.pubnubFunctionsDashboard.username,
                fields: ehInfo
              })
            }
          }

          /**
           * Building an array of channels to subscribe to
           * - this is per App.
           * - this is the location for you to decide which type of 'channels' you wish to subscribe to
           */
          let blockStateChannel = 'blocks-state-' + block.realtime_analytics_channel + '.' + block.id

          /**
           * Captures
           * - internal function errors (bad library, code, etc..)
           * - console.log
           */
          if (config.mode.consoleLog) {
            blockChannels = _.concat(blockChannels, eh.output)
          }

          /**
           * Capture block events (pending, stop, running)
           */
          if (config.mode.blockEvents) {
            blockChannels = _.concat(blockChannels, blockStateChannel)
          }

          /**
           * Capture "everything" that is output into the Portal Console
           * - example: publich from the Function Console 'PUBLISH' button.
           */
          if (config.mode.blockOther) {
            blockChannels = _.concat(blockChannels, eh.channels)
          }
        })
        /**
         * ToDo: verify the use case of the code bellow :)
         */
        if (block.hasOwnProperty('sub_key')) {
          // this.$log.debug('SUB KEY EXISTS')
        }

        let keyset = that.key_set[block.key_id]

        /**
         * Remove Duplicates
         * - No need to have the same channels twice in the array.
         * - avoid subscribing to the same channel twice.
         */
        blockChannels = new Set(blockChannels).toJSON()
        that.pnSubscribeToEH(blockChannels, keyset)
      })
    },
    /**
     * getModal
     * - used inside an HTML tag.
     * - use it to retrieve a manipulated string (element ID)
     */
    getModal (id) {
      return '#' + id
    },
    addData () {
      // test
      console.log('this.tblDataBlocks', this.tblDataBlocks)

      let arrMax = this.gChartsConfig.max
      let arrLen = this.tblDataBlocks.length
      let nl = 1

      if (arrLen > arrMax) {
        this.tblDataBlocks = _.slice(this.tblDataBlocks, nl, arrMax)
      } else {
        this.tblDataBlocks = _.slice(this.tblDataBlocks, 0, arrMax)
      }

      let max = 15
      this.tblDataBlocks.push(['test' + (Math.floor(Math.random() * Math.floor(max))), (Math.floor(Math.random() * Math.floor(max)))])
      console.log('this.tblDataBlocks', this.tblDataBlocks)
      // this.drawNewLineChart()
    },
    tests () {
      if (config.mode.debug) {
        console.log('DASHBOARD TESTS()')
      }
      if (integrations.vendors.slack.enabled) {
        this.slackAlert(integrations.vendors.slack.features.pubnubFunctionsDashboard.webhookUrl, {
          type: 'alert',
          channel: 'general',
          icon_emoji: ':red_circle:',
          text: 'ALERT',
          username: integrations.vendors.slack.features.pubnubFunctionsDashboard.username,
          fields: {
            'TYPE': 'TEST',
            'MESSAGE': 'THIS IS A TEST ALERT.'
          }
        })
      }
    },
    /**
     * INTEGRATION: SLACK
     */
    slackAlert (webhookUrl, payload) {
      // https://github.com/andrewchilds/slack-notify
      // const MY_SLACK_WEBHOOK_URL = webhookUrl
      // let slack = require('slack-notify')(MY_SLACK_WEBHOOK_URL)

      let statLog = slack.extend({
        channel: '#' + payload['channel'],
        icon_emoji: payload['icon_emoji'],
        username: integrations.vendors.slack.features.pubnubFunctionsDashboard.username
      })

      statLog({
        text: payload['text'],
        fields: payload['fields']
      })

      slack.onError = function (err) {
        console.log('SLACK API ERROR:', err)
      }
    }
  },
  /**
   * Component Lifecycle
   */
  beforeCreated: function () {},
  created: function () {
    this.$log.debug('Configurator -> created')
  },
  beforeMount: function () {
    this.showAll()
    this.init()
    this.tests()
  },
  mounted: function () {
    // this.tests()
  },
  beforeDestroy () {}
}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style>

</style>
