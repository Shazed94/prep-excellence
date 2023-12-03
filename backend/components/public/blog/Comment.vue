<template>
  <v-card>
    <v-card-text>
      <div class="text-right">
        <v-btn
          ref="printBtn"
          v-print="`#printSchedule`"
          icon
        >
          <v-icon color="light-blue">mdi-printer</v-icon>
        </v-btn>
      </div>
      <v-sheet :id="`printSchedule`" style="margin:10px;">
        <v-container>
          <report-head></report-head>
          <v-card-subtitle class="text-center"><b>{{  'Blog Comments' }}</b></v-card-subtitle>
          <v-simple-table>
            <template v-slot:default>
              <thead>
              <tr>
                <th class="text-left">
                  Date
                </th>
                <th class="text-left">
                  Name
                </th>
                <th class="text-left">
                  Email
                </th>
                <th class="text-left">
                  Comment
                </th>
                <th class="text-left">
                  Status
                </th>
                <th class="text-left">
                  Action
                </th>
              </tr>
              </thead>
              <tbody>
              <tr
                v-for="(item,key ) in selectedItems"
                :key="key"
              >
                <td>{{ item.date }}</td>
                <td>{{ item.name }}</td>
                <td>{{ item.email }}</td>
                <td>{{ item.comment }}</td>
                <td>{{ item.status }}</td>
                <td>
                  <v-tooltip bottom v-if="item.status === 0 ">
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn x-small class="mr-1 mb-1 danger" color="red" v-bind="attrs"
                             v-on="on" fab @click="deleteItemBasic(item)" v-if="$can('read','Auth')">
                        <v-icon>mdi-delete</v-icon>
                      </v-btn>
                    </template>
                    <span>Remove</span>
                  </v-tooltip>
                </td>
              </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-container>
      </v-sheet>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn class="mr-2 error darken-1 white--text" depressed @click="$emit('closeSchedule')">Close</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import moment from "moment-timezone";
import ReportHead from "@/components/report/ReportHead";
import {common as commonMixin} from "@/mixins/common";
import {mapGetters} from "vuex";
export default {
  name:'CourseSchedule',
  components:{ReportHead},
  mixins: [commonMixin],
  props:{
    selectedItems:{
      required:true,
      type:Array,
      default() {
        return {}
      }
    }
  },
  data(){
    return{
      moment,
      pageInfo: {
        pageName: 'Course Schedule',
        apiUrl: '/course-schedule/',
        permission: ''
      },
      loader: {isLoading: false, isSubmitting: false, isDeleting: false},
    }
  },
}
</script>

