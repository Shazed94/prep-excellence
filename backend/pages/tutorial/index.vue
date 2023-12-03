<template>
  <v-container fluid>
    <bread-crumbs
      :page-title="`${pageInfo.pageName}`"
      :items="[{text: `${pageInfo.pageName}`,disabled: true, href: '/public/settings/page'}]"
    />
    <template>
      <v-card>
        <v-card-title class="indigo white--text text-h5">
          Tutorials
        </v-card-title>
        <v-row
          class="pa-4"
          justify="space-between"
        >
          <v-col cols="12" md="4" xl="3" lg="3">
            <v-treeview
              :active.sync="active"
              :items="categories"
              :open.sync="open"
              item-key="id"
              activatable
              return-object
              color="warning"
              open-on-click
              transition
            >
              <template v-slot:prepend="{ item }">
<!--                <v-icon v-if="!item.children">
                  mdi-blur-radial
                </v-icon>-->
                <v-btn v-if="item.children" depressed x-medium class="m-1 p-1" style=" background-color:#65c0eb; color: white"
                       @click="selected_item=item" >{{ item.title }}</v-btn>
                <v-btn v-else depressed x-medium class="m-1 p-1" style=" background-color:rgb(231 242 249)"
                       @click="selected_item=item" > <span style="color: black">{{ item.title }}</span></v-btn>
              </template>
            </v-treeview>
          </v-col>

          <v-divider vertical></v-divider>

          <v-col
            cols="12" md="8" lg="9" xl="9"
            class="d-flex text-center"
          >
            <v-scroll-y-transition mode="out-in">
              <div
                v-if="!selected_item"
                class="text-h6 grey--text text--lighten-1 font-weight-light"
                style="align-self: center;"
              >
                Select a Tutorial
              </div>
              <v-card
                v-else
                :key="selected_item.id"
                class="pt-2 mx-auto"
                flat
              >
                <v-card-text>
                  <div v-html="selected_item.description">{{  selected_item.title }}</div>
                </v-card-text>
              </v-card>
            </v-scroll-y-transition>
          </v-col>
        </v-row>
      </v-card>
    </template>
  </v-container>
</template>
<script>
import BreadCrumbs from "@/components/common/BreadCrumbs.vue";
const permission = 'Auth'
const stateName = 'tutoring_requests'
const storeName='admin/tutoring_request'
import moment from "moment";
export default {
  name:'CommonTutorial',
  components:{BreadCrumbs},
  head: {
    title: 'Tutorial',
    meta: [
      {
        hid: 'description',
        name: 'description',
        content: ''
      }
    ],
  },
  meta:{
    action: 'read',
    subject: permission
  },
  data(){
    return{
      pageInfo: {
        pageName: 'Tutorials',
        apiUrl: '/tutorial-category/with/tutorials',
        permission
      },
      loader: {isLoading: false, isSubmitting: false, isDeleting: false},
      categories:[],
      selected_item:{},
      active: [],
      avatar: null,
      open: [],
      users: [],
    }
  },
  async mounted() {
    await this.init()
  },
  created() {
    this.$nuxt.$emit('hide-sidebar-event')
  },
  computed:{
    selected () {
      if (!this.active.length) return undefined
      //const id = this.active[0]
      //return this.categories.find(cat => cat.id === id)
      return this.active[0]
    },
  },
  methods:{
    async init() {
      this.loader.isLoading = true
      await this.$axios.get(this.pageInfo.apiUrl).then((response)=>{
          this.categories = response.data.data
          this.open = this.categories.map((item)=>item)
      }).catch(()=>{
        this.categories = []
      })
      this.loader.isLoading = false
    },
  }
}
</script>
