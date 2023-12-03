<template>
  <v-card>
    <v-row class="fill-height">
      <v-col>
        <v-sheet height="64">
          <v-toolbar
            flat
          >
            <v-btn
              outlined
              class="mr-4"
              color="grey darken-2"
              @click="setToday"
            >
              Today
            </v-btn>
            <v-btn
              fab
              text
              small
              color="grey darken-2"
              @click="prev"
            >
              <v-icon small>
                mdi-chevron-left
              </v-icon>
            </v-btn>
            <v-btn
              fab
              text
              small
              color="grey darken-2"
              @click="next"
            >
              <v-icon small>
                mdi-chevron-right
              </v-icon>
            </v-btn>
            <v-toolbar-title v-if="$refs.calendar">
              {{ $refs.calendar.title }}
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-menu
              bottom
              right
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  outlined
                  color="grey darken-2"
                  v-bind="attrs"
                  v-on="on"
                >
                  <span>{{ typeToLabel[type] }}</span>
                  <v-icon right>
                    mdi-menu-down
                  </v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item @click="type = 'day'">
                  <v-list-item-title>Day</v-list-item-title>
                </v-list-item>
                <v-list-item @click="type = 'week'">
                  <v-list-item-title>Week</v-list-item-title>
                </v-list-item>
                <v-list-item @click="type = 'month'">
                  <v-list-item-title>Month</v-list-item-title>
                </v-list-item>
                <v-list-item @click="type = '4day'">
                  <v-list-item-title>4 days</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-toolbar>
        </v-sheet>
        <v-sheet height="600">
          <v-calendar
            ref="calendar"
            v-model="focus"
            color="primary"
            :events="events"
            :event-color="getEventColor"
            :type="type"
            @click:event="showEvent"
            @click:more="viewDay"
            @click:date="viewDay"
            @change="updateRange"
          ></v-calendar>
          <v-menu
            v-model="selectedOpen"
            :close-on-content-click="false"
            :activator="selectedElement"
            offset-x
          >
            <v-card
              color="grey lighten-4"
              min-width="350px"
              flat
            >
              <v-toolbar
                :color="selectedEvent.color"
              >
                <!--                  <v-btn icon>
                                    <v-icon>mdi-pencil</v-icon>
                                  </v-btn>-->
                <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
                <v-spacer></v-spacer>
                <!--                  <v-btn icon>
                                    <v-icon>mdi-heart</v-icon>
                                  </v-btn>-->
                <v-btn icon>
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </v-toolbar>
              <v-card-text>
                <h6 class="text-center">
                  Class Link:
                  <a v-if="selectedEvent.class_link" :href="selectedEvent.class_link" target="_blank">Click here</a>
                  <span v-else>Not Available</span>
                </h6>
                <v-timeline>
                  <v-timeline-item :color="selectedEvent.color">
                    <template v-slot:opposite>
                      <span>Title</span>
                    </template>
                    <v-card class="elevation-2">
                      <v-card-text>{{ selectedEvent.name }}</v-card-text>
                    </v-card>
                  </v-timeline-item>
                  <v-timeline-item :color="selectedEvent.color" class="text-right">
                    <template v-slot:opposite>
                      <span>Start</span>
                    </template>
                    <v-card class="elevation-2">
                      <v-card-text>{{ selectedEvent.start? moment(selectedEvent.start).format('hh:mm a'):'' }}</v-card-text>
                    </v-card>
                  </v-timeline-item>
                  <v-timeline-item :color="selectedEvent.color">
                    <template v-slot:opposite>
                      <span>End</span>
                    </template>
                    <v-card class="elevation-2">
                      <v-card-text>{{  moment(selectedEvent.end).format('hh:mm a') }}</v-card-text>
                    </v-card>
                  </v-timeline-item>
                  <v-timeline-item :color="selectedEvent.color">
                    <template v-slot:opposite>
                      <span>Status</span>
                    </template>
                    <v-card class="elevation-2">
                      <v-card-text>{{ selectedEvent.status === 0 ? 'Pending' : selectedEvent.status === 1 ? 'Completed' : 'Canceled' }}</v-card-text>
                    </v-card>
                  </v-timeline-item>
                </v-timeline>
                <span></span>
              </v-card-text>
            </v-card>
          </v-menu>
        </v-sheet>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import BreadCrumbs from "~/components/common/BreadCrumbs";
import {common as commonMixin} from "@/mixins/common";
import Calender from "@/components/admin/course/Calender";
import moment from "moment-timezone";
export default {
  name: 'schedule',
  components: {BreadCrumbs, Calender},
  mixins: [commonMixin],
  data() {
    return {
      moment,
      pageInfo: {
        pageName: 'My Schedule',
      },
      loader: {isLoading: false, isSubmitting: false, isDeleting: false},
      focus: '',
      type: 'month',
      typeToLabel: {
        month: 'Month',
        week: 'Week',
        day: 'Day',
        '4day': '4 Days',
      },
      selectedEvent: {},
      selectedElement: null,
      selectedOpen: false,
      events: [],
      test_events: [],
      colors: ['blue', 'indigo', 'deep-purple', 'cyan', 'green', 'orange', 'grey darken-1'],
      names: ['Meeting', 'Holiday', 'PTO', 'Travel', 'Event', 'Birthday', 'Conference', 'Party'],
    }
  },
  async mounted() {
    this.$refs.calendar.checkChange()
  },
  watch:{
    test_events(){
      this.updateEvent()
    }
  },
  methods: {
    async init(start,end) {
      this.loader.isLoading = true
      let url = `/employee/course/schedule?start_date=${start}&end_date=${end}`
      this.$axios.get(url).then((response) => {
        this.test_events=response.data.data;
      }).catch(() => {
        this.test_events=[]
      })
      this.loader.isLoading = false
    },
    viewDay ({ date }) {
      this.focus = date
      this.type = 'day'
    },
    getEventColor (event) {
      return event.color
    },
    setToday () {
      this.focus = ''
    },
    prev () {
      this.$refs.calendar.prev()
    },
    next () {
      this.$refs.calendar.next()
    },
    showEvent ({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = event
        this.selectedElement = nativeEvent.target
        requestAnimationFrame(() => requestAnimationFrame(() => this.selectedOpen = true))
      }

      if (this.selectedOpen) {
        this.selectedOpen = false
        requestAnimationFrame(() => requestAnimationFrame(() => open()))
      } else {
        open()
      }

      nativeEvent.stopPropagation()
    },
    updateRange ({ start, end }) {
      this.init(start.date, end.date);
    },
    updateEvent(){
      const events = []
      this.test_events.filter(item=>{
        let name = item.course.name ??''
        let e_time = item.start_time??item.end_time
        events.push({
          name: name + ' ' + item.classes,
          class_link : item.class_link,
          start: item.date+' '+ e_time,
          end: item.date+' '+ item.end_time,
          color: this.colors[this.rnd(0, this.colors.length - 1)],
          timed: false,
        })
      })
      this.events = events
    },
    rnd (a, b) {
      return Math.floor((b - a + 1) * Math.random()) + a
    },
  }
}
</script>
<style scoped>
.theme--light * >>> .v-btn {
  color: #1b457d !important;
  border-radius: 6px !important;
}
</style>
