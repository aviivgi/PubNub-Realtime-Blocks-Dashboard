module.exports = {
  vendors: {
    slack: {
      features: {
        pubnubFunctionsDashboard: {
          webhookUrl: 'https://hooks.slack.com/services/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',
          username: 'Bigoper'
        }
      },
      channels: {
        init: 'dashboard_init',
        main: 'dashboard_main',
        alerts: 'dashboard_alerts',
        info: 'dashboard_info',
        other: 'dashboard_other',
        system: 'dashboard_system'
      },
      default: {
        title: '',
        icon: '',
        type: ''
      },
      enabled: true
    }
  }
}
