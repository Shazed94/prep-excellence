module.exports = {
  apps: [
    {
      name: 'Prepexcellence_front',
      exec_mode: 'cluster',
      instances: 'max', //'max' Or a number of instances
      script: './node_modules/nuxt/bin/nuxt.js',
      args: 'start'
    }
  ]
}
