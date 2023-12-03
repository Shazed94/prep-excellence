<template>
  <div class="user-dashboard-area">
    <div class="btcontainer">
      <div class="up_wrap">
        <div class="btrow">
          <sidebar/>
          <!-- main content -->
          <div class="btcol-md-6 btcol-lg-9">
            <div class="up_content_wrap">
              <!-- user calender -->
              <v-container fluid>
                <v-card>
                  <v-card-title class="primary_header fs-4">
                    {{ pageInfo.pageName}}
                  </v-card-title>
                  <v-data-table
                    dense
                    v-model="selected"
                    item-key="id"
                    :headers="headers"
                    :items="home_works"
                    :options.sync="options"
                    :server-items-length="totalItems"
                    :search="search"
                    :footer-props="footerProps"
                    :items-per-page="10"
                    class="elevation-1"
                    :loading="loader.isLoading"
                  >
                    <template v-slot:top>
                      <v-toolbar
                        flat
                      >
                        <div class="mr-2">
                          <v-text-field
                            v-model="search"
                            label="Search"
                            class="mt-3"
                          ></v-text-field>
                        </div>
                        <v-spacer></v-spacer>
                      </v-toolbar>
                    </template>
                    <template v-slot:item.sno="{ index, item }">
                      {{ index+1 }}
                    </template>
                    <template v-slot:item.submission_last_date="{ index, item }">
                      {{ $moment(item.submission_last_date).format('DD-MM-YYYY') }}
                    </template>
                  </v-data-table>
                </v-card>
              </v-container>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {common as commonMixin} from "@/mixins/common";
import {mapGetters} from "vuex";
import Sidebar from "@/components/user/Sidebar";
const stateName = 'tutoring_requests'
const storeName='student/tutoring_request'
export default {
  name: 'tutoringRequest',
  components: {Sidebar},
  mixins: [commonMixin],
  data() {
    return {
      pageInfo: {
        pageName: 'Tutoring Request',
        apiUrl: '/student/tutoring-form/',
      },
      state: {
        name: stateName,
        store_name: storeName,
      },
      selected: [],
      selectedItem:{},
      options: {},
      dialog: false,
      dialog2: false,
      editIndex: -1,
      editMode:false,
      loader: {isLoading: false, isSubmitting: false, isDeleting: false},
      search: '',
      timeout: null,
      headers: [
        {
          text: 'SL',
          align: 'start',
          value: 'sno'
        },
        {
          text: 'Total Hour',
          value: 'total_hour'
        },
        {
          text: 'Hour Rate',
          value: 'hour_rate'
        },
        {
          text: 'Amount',
          value: 'amount'
        },
      ],
      footerProps: {
        itemsPerPageOptions: [10,20, 50, 100, 500]
      },
    }
  },
  computed: {
    ...mapGetters('student/tutoring_request',['tutoring_requests','totalItems']),
    selectedIds() {
      return this.selected.map((a) => a.id)
    },
  },
  watch: {
    options: {
      handler() {
        this.init()
      },
      deep: true
    },
    search(value, oldVal) {
      if ((value.length >= 3) || oldVal.length >= 3) {
        if (this.timeout) {
          clearTimeout(this.timeout)
        }
        this.timeout = setTimeout(() => {
          this.init()
        }, 500)
      }
    },
  },
  async mounted() {
    this.loader.isLoading=true;
    if (!this.tutoring_requests.length)  await this.init();
   this.loader.isLoading=false;
  },
  methods: {
    async init() {
      this.loader.isLoading = true
      let url = this.pageInfo.apiUrl+`?per_page=${this.options.itemsPerPage}&page=${this.options.page}`
      if (this.search.length >= 3) {
        url += `&search=${this.search}`
      }
      const payload1 = {apiUrl: url, stateName}
      await this.$store.dispatch(storeName+'/getItems', payload1)
      this.loader.isLoading = false
    },
  }
}
</script>
