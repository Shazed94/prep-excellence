<template>
  <div>
    <v-dialog ref="dialog" v-model="dialog" width="350">
      <template v-slot:activator="{ on, attrs }">
        <v-text-field
          v-model="formattedDatetime"
          :label="label"
          :prepend-icon="showIcon ? icon : ''"
          readonly
          v-bind="attrs"
          clearable
          :error-messages="errors"
          v-on="on"
          dense
          outlined
          hide-details
          @click:clear="$emit('input',null)"
        ></v-text-field>
      </template>
      <v-card>
        <v-tabs v-model="tabs" centered>
          <v-tab>
            <v-icon>mdi-calendar</v-icon>
          </v-tab>
          <v-tab>
            <v-icon>mdi-clock</v-icon>
          </v-tab>
        </v-tabs>
        <v-tabs-items v-model="tabs">
          <v-tab-item>
            <v-date-picker v-model="date" scrollable full-width @input="tabs=1">
              <v-spacer></v-spacer>
              <v-btn text color="primary" @click="dialog = false">Cancel</v-btn>
              <v-btn text color="primary" @click="tabs=1">OK</v-btn>
            </v-date-picker>
          </v-tab-item>
          <v-tab-item>
            <v-time-picker v-model="time" full-width scrollable>
              <v-spacer></v-spacer>
              <v-btn text color="primary" @click="dialog = false">Cancel</v-btn>
              <v-btn text color="primary" @click="$refs.dialog.save(time)">OK</v-btn>
            </v-time-picker>
          </v-tab-item>
        </v-tabs-items>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import moment from 'moment'

export default {
  props: {
    value: {type: [Date, String, null], required: false, default: null},
    label: {type: String, required: false, default: 'Select datetime'},
    errors: {type: Array, required: false, default: () => []},
    showIcon: {type: Boolean, required: false, default: false},
    defaultValue: {type: Boolean, required: false, default: true},
    icon: {type: String, required: false, default: 'mdi-calendar'}
  },
  data() {
    return {
      date: moment().format('YYYY-MM-DD'),
      time: moment().format('HH:mm'),
      dialog: false,
      tabs: null,
      formattedDatetime: moment().format('YYYY-MM-DD hh:mm A')
    }
  },
  mounted() {
    if (this.defaultValue) {
      this.formattedDatetime = moment(this.date + ' ' + this.time, 'YYYY-MM-DD HH:mm').format('YYYY-MM-DD hh:mm A')
      this.$emit('input', moment(this.date + ' ' + this.time, 'YYYY-MM-DD HH:mm').format('YYYY-MM-DD HH:mm:ss'))
    } else {
      this.formattedDatetime = null
    }
  },
  watch: {
    date() {
      this.formattedDatetime = moment(this.date + ' ' + this.time, 'YYYY-MM-DD HH:mm').format('YYYY-MM-DD hh:mm A')
      this.$emit('input', moment(this.date + ' ' + this.time, 'YYYY-MM-DD HH:mm').format('YYYY-MM-DD HH:mm:ss'))
    },
    time() {
      this.formattedDatetime = moment(this.date + ' ' + this.time, 'YYYY-MM-DD HH:mm').format('YYYY-MM-DD hh:mm A')
      this.$emit('input', moment(this.date + ' ' + this.time, 'YYYY-MM-DD HH:mm').format('YYYY-MM-DD HH:mm:ss'))
    },
    value(value) {
      if (moment(value).isValid()) {
        this.date = moment(value).format('YYYY-MM-DD')
        this.time = moment(value).format('HH:mm')
      } else {
        this.date = moment().format('YYYY-MM-DD')
        this.time = moment().format('HH:mm')
      }
    },
    dialog(val) {
      val || this.close()
    }
  },
  methods: {
    close() {
      this.tabs = null
    }
  }
}
</script>
