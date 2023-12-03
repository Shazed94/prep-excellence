<template>
  <div class="user-dashboard-area">
    <div class="btcontainer">
      <div class="up_wrap">
        <div class="btrow">
          <sidebar class="mt-1"/>
          <!-- main content -->
          <div class="btcol-md-6 btcol-lg-9">
            <div class="up_content_wrap">
              <v-container fluid>
                <v-row dense>
                  <v-col cols="12">
                    <v-card>
                      <v-card-title class="primary_header fs-4">
                        Profile
                        <v-spacer />
                        <div class="text-right" style="margin-top: -40px">
                          <v-btn class="mr-2 success white--text" style="background-color: rgb(48 171 245) !important" to="/user/profile/edit" depressed>
                            <v-icon color="white">mdi-account-edit-outline</v-icon>
                          </v-btn>
                        </div>
                      </v-card-title>
                      <v-card-text>
                        <v-container fluid>
                          <template v-if="user.role_id == 3 && user.userable">
                            <v-row dense>
                              <v-col cols="4" md="3">
                                <h6 class="mb-0">Student Id :</h6>
                              </v-col>
                              <v-col cols="8" md="9">
                                {{user.userable.student_id}}
                              </v-col>
                            </v-row>
                            <hr>
                          </template>
                          <v-row dense>
                            <v-col cols="4" md="3">
                              <h6 class="mb-0">Name :</h6>
                            </v-col>
                            <v-col cols="8" md="9">
                              {{user.name}}
                            </v-col>
                          </v-row>
                          <hr>
                          <v-row dense>
                            <v-col cols="4" md="3">
                              <h6 class="mb-0">Email :</h6>
                            </v-col>
                            <v-col cols="8" md="9">
                              {{user.email}}
                            </v-col>
                          </v-row>
                          <hr>
                          <v-row dense>
                            <v-col cols="4" md="3">
                              <h6 class="mb-0">Phone Number :</h6>
                            </v-col>
                            <v-col cols="8" md="9">
                              {{user.phone_number}}
                            </v-col>
                          </v-row>
                          <hr>
                          <template v-if="user.role_id == 3 && user.userable">
                            <v-row dense>
                              <v-col cols="4" md="3">
                                <h6 class="mb-0">Date of Birth :</h6>
                              </v-col>
                              <v-col cols="8" md="9">
                                {{user.userable.date_of_birth}}
                              </v-col>
                            </v-row>
                            <hr>
                          </template>
                          <template v-if="user.role_id == 4">
                            <v-row dense>
                              <v-col cols="12" md="6" v-for="(student,key) in students" :key="key">
                                <v-card>
                                  <v-card-title class="text-white fs-4" style="background-color:#031f46;">{{ student.userable ? student.userable.name : ''}}</v-card-title>
                                  <v-card-text>
                                    <v-container fluid>
                                      <v-row dense>
                                        <v-col cols="4" md="5">
                                          <h6 class="mb-0">Student Id :</h6>
                                        </v-col>
                                        <v-col cols="8" md="7">
                                          {{ student.student_id }}
                                        </v-col>
                                      </v-row>
                                      <hr>
                                      <template v-if="student.userable">
                                        <v-row dense>
                                          <v-col cols="4" md="5">
                                            <h6 class="mb-0">Name :</h6>
                                          </v-col>
                                          <v-col cols="8" md="7">
                                            {{ student.userable.name }}
                                          </v-col>
                                        </v-row>
                                        <hr>
                                        <v-row dense>
                                          <v-col cols="4" md="5">
                                            <h6 class="mb-0">Email :</h6>
                                          </v-col>
                                          <v-col cols="8" md="7">
                                            {{ student.userable.email }}
                                          </v-col>
                                        </v-row>
                                        <hr>
                                        <v-row dense>
                                          <v-col cols="4" md="5">
                                            <h6 class="mb-0">Phone Number :</h6>
                                          </v-col>
                                          <v-col cols="8" md="7">
                                            {{ student.userable.phone_number }}
                                          </v-col>
                                        </v-row>
                                        <hr>
                                      </template>
                                    </v-container>
                                  </v-card-text>
                                </v-card>
                              </v-col>
                            </v-row>
                          </template>
                        </v-container>

                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>
                <v-card>
                  <v-card-title class="primary_header fs-4">Change Password</v-card-title>
                  <change-password></change-password>
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
import BreadCrumbs from "@/components/common/BreadCrumbs";
import Sidebar from "@/components/user/Sidebar";
import {common as commonMixin} from "@/mixins/common";
import ChangePassword from "@/components/auth/ChangePassword.vue";
import {mapGetters} from "vuex";
const permission = ''

export default {
  name: 'profile',
  components: {BreadCrumbs,Sidebar, ChangePassword},
  mixins: [commonMixin],
  data() {
    return {
      pageInfo: {
        pageName: 'User Profile',
        apiUrl: '/user/',
        permission
      },
      dialog: false,
      loader: {isLoading: false, isSubmitting: false, isDeleting: false},
      user: {}
    }
  },

  async mounted() {
    this.loader.isLoading=true
    await this.init();
    if (this.$auth.user && this.$auth.user.role_id == 4) await this.init2()
    this.loader.isLoading=false
  },
  computed: {
    ...mapGetters('user/basic',['students']),
  },
  methods: {
    async init(){
      await this.$axios.get(this.pageInfo.apiUrl)
      .then((response) => {
        this.user = response.data;
      }).catch(() => {
        this.user={}
        this.$toaster.error('Invalid request');
        return this.$router.go(-1);
      })
    },
    async init2() {
      let url = `/parent/parent/child/info`
      const payload = {apiUrl: url, stateName}
      await this.$store.dispatch(storeName+'/getItems', payload)
    },

  }
}
</script>
