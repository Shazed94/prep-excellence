import Vue from 'vue'
import moment from 'moment-timezone'

Vue.filter('capitalize', (value, allWords) => {
  if (!value) return ''

  if (allWords) {
    return value.replace(/\b\w/g, (l) => l.toUpperCase())
  } else {
    return value.replace(/\b\w/, (l) => l.toUpperCase())
  }
})

Vue.filter('uppercase', (value) => {
  if (!value) return ''

  return value.toString().toUpperCase()
})

Vue.filter('lowercase', (value) => {
  if (!value) return ''

  return value.toString().toLowerCase()
})

export default ({store}) => {
  Vue.filter('formatDate', (value, filterFormat) => {
    const {zone, format} = store.state.app.time

    if (value) {
      return moment(value).tz(zone).format(filterFormat || format || 'lll')
    }

    return ''
  })
}
