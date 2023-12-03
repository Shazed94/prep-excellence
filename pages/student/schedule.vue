<template>
  <div class="user-dashboard-area">
    <div class="btcontainer">
      <div class="up_wrap">
        <div class="btrow">
          <sidebar/>
          <!-- main content -->
          <div class="btcol-md-6 btcol-lg-9 mt-3">
              <div class="up_content_wrap">
                <!-- user calender -->
                <div class="card shadow mb-4">
                  <v-card-title class="primary_header fs-4">
                    {{ "Schedule" }}
                  </v-card-title>
                  <div class="card-body">
                    <div class="dashboard_items">
                      <student-calender></student-calender>
                    </div>
                  </div>
                </div>
              </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Sidebar from "@/components/user/Sidebar";
import StudentCalender from "@/components/user/StudentCalender";
export default {
  name: 'schedule',
  components:{Sidebar, StudentCalender},
}
</script>
