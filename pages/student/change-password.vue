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
import {common as commonMixin} from "@/mixins/common";
import Sidebar from "@/components/user/Sidebar";
import ChangePassword from "@/components/auth/ChangePassword.vue";
const stateName = 'home_works'
const storeName='student/home_work'
export default {
  name: 'passwordChange',
  components: {Sidebar,ChangePassword},
  mixins: [commonMixin],
  data() {
    return {
      loader: {isLoading: false, isSubmitting: false, isDeleting: false},
    }
  },
  methods: {

  }
}
</script>
