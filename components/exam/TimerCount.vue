<template>
  <div>
    <vue-countdown-timer
      :start-time="startTime"
      :end-time="endTime"
      :interval="1000"
      :end-text="'Time over!'"
      :hour-txt="' :'"
      :minutes-txt="' :'"
      :seconds-txt="' :'"
      @start_callback="$emit('startCallBack')"
      @end_callback="$emit('endCallBack')"
    >
      <template slot="countdown" slot-scope="scope">
        <div style="min-width: 160px; width: 100% !important;">
          <div v-if="$vuetify.breakpoint.mdAndUp && timer_type">
            <v-progress-circular
              :rotate="-90"
              :size="130"
              :width="5"
              :value="progressValue"
              :color="barColor"
              style="background-color: #FFE5E2; border-radius: 50%"
            >
              <h4 style="color: #E52520">
                <span>{{ scope.props.hours }}</span><b>{{ scope.props.hourTxt }}</b>
                <span>{{ scope.props.minutes }}</span><b>{{ scope.props.minutesTxt }}</b>
                <span>{{ scope.props.seconds }}</span>
              </h4>
              <div>
                <slot name="examInfo"></slot>
              </div>
            </v-progress-circular>
          </div>
          <h3 v-else>
            <div class="d-flex justify-space-between align-center pa-1 gpa-10">
              <div>
                <slot name="examInfo"></slot>
              </div>
              <div>
                <span>{{ scope.props.hours }}</span><b>{{ scope.props.hourTxt }}</b>
                <span>{{ scope.props.minutes }}</span><b>{{ scope.props.minutesTxt }}</b>
                <span>{{ scope.props.seconds }}</span>
              </div>
            </div>
            <div class="bar mb-3">
              <div class="inner" :style="progressValue?`width:${progressValue}%; background:${'red'}`:''"></div>
            </div>
          </h3>
        </div>
      </template>
      <template slot="end-text" slot-scope="scope">
        <span style="color: red">{{ scope.props.endText }}</span>
      </template>
    </vue-countdown-timer>

  </div>
</template>

<script>
import moment from 'moment'

export default {
  props: {
    startTime: {type: [Object, String], required: true},
    endTime: {type: [Object, String], required: true},
    duration: {type: [Number], required: true},
    strict: {type: [Boolean], required: true},
    timer_type: {type: [Boolean], required: true},
  },
  data() {
    return {
      timer: {
        interval: {},
        value: 1
      },
      moment,
      showReminder: true,
      barColor: '#E52520'
    }
  },
  computed: {
    progressValue() {
      let progress = 0
      let duration = moment()

      if (this.strict) duration = moment(this.endTime).diff(moment(), 'seconds')
      else duration = (this.duration * 60)
      progress = (this.timer.value * 100) / (duration)

      return progress
    }
  },
  beforeDestroy() {
    clearInterval(this.timer.interval)
  },
  mounted() {
    this.initTimer()
  },
  methods: {
    initTimer() {
      this.timer.interval = setInterval(() => {
        // if (this.timer.value === 100) return (this.timer.value = 0)
        const duration = moment(this.endTime, 'DD/MM/YYYY HH:mm:ss').diff(moment(this.startTime, 'DD/MM/YYYY HH:mm:ss'), 'second')

        if (moment(this.endTime).diff(moment(), 'seconds') <= (duration / 2) && this.showReminder) this.barColor = 'edb602'
        if (moment(this.endTime).diff(moment(), 'seconds') <= 120 && this.showReminder) this.barColor = 'red'
        if (moment(this.endTime).diff(moment(), 'seconds') <= 120 && this.showReminder) this.setReminder()

        this.timer.value++
      }, 1000)
    },
    setReminder() {
      this.showReminder = false
      this.$successMessage(' ', 'Your Exam is about to end in 2 min\'s')
    }
  }
}
</script>

<style lang="scss" scoped>
.v-progress-circular__underlay {
  background-color: white !important;
  fill: white !important;
  color: black !important;
}

@media only screen and (max-width: 600px) {
  .Timer {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1000;
    background-color: white;
    width: 100% !important;
    box-shadow: 0 0 10px rgba(0, 0, 0, .4);
    display: flex;
    justify-content: space-around;
    align-items: center;

    padding: 0 10px 0 0;
    margin: 0;

    h2 {
      margin: 0
    }

    hr {
      display: none;
    }

    .timeProgress {
      transform: scale(0.8);
    }
  }
  .result-mobile-flex {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .examQuestions {
    margin-top: 50px;
  }
}

.count-down {
  position: absolute;
  background-color: rgba(20, 20, 20, .98);
  pointer-events: none;
  opacity: 1;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  z-index: 1000;
  transition: all 200ms ease-in-out;
  animation-name: fade-out;
  animation-duration: 1s;
  animation-delay: 4s;
  animation-timing-function: ease;
  animation-iteration-count: 1;
  animation-fill-mode: forwards;
}

.count-down .number {
  position: inherit;
  font-size: 200px;
  line-height: 1;
  color: #fff;
  opacity: 0;
  left: 50%;
  top: 50%;
  transform: translate3d(-50%, 0, 0);
  animation-name: count-down;
  animation-duration: 1s;
  animation-timing-function: ease;
  animation-iteration-count: 1;
  animation-fill-mode: forwards;
}

.count-down .number:nth-child(1) {
  animation-delay: 0.8s;
}

.count-down .number:nth-child(2) {
  animation-delay: 1.6s;
}

.count-down .number:nth-child(3) {
  animation-delay: 2.4s;
}

.count-down .number:nth-child(4) {
  animation-delay: 3.2s;
}

@keyframes count-down {
  0% {
    opacity: 1;
    transform: translate3d(-50%, 0, 0);
  }
  100% {
    opacity: 0;
    transform: translate3d(-50%, -66%, 0);
  }
}

@keyframes fade-out {
  0% {
    opacity: 1;
  }
  99% {
    opacity: 0;
  }
  100% {
    opacity: 0;
    display: none;
  }
}

.bar {
  position: relative;
  height: 4px;
  width: 100%;
  border-radius: 20px;
  background: #0d131c;

  .inner {
    max-width: 100%;
    position: absolute;
    transform: translateY(-50%);
    top: 50%;
    width: 0;
    height: 6px;
    border-radius: 20px;
  }
}

.v-dialog__content.v-dialog__content--active {
  z-index: 2000 !important;
}
</style>
