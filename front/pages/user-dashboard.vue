<template>
  <div class="user-dashboard-area">
    <div class="btcontainer">
      <div class="up_wrap">
        <div class="btrow">

          <sidebar/>

          <!-- main content -->
          <div class="btcol-md-6 btcol-lg-9 mt-3">
            <div class="up_content_wrap">
              <!-- profile  -->

              <!-- user tab -->
              <div class="card shadow mb-4">
                <!-- <div class="card-header primary_header">
                  <h4>Dashboard</h4>
                </div> -->

                <div class="card-body">
                  <div class="dashboard_items">
                    <div class="btrow">
                      <div class="btcol-lg-6 btcol-xl-3 mb-1">
                        <div class="card text-white mb-3 custom_dashboard_card h-100"
                             style="background-image: linear-gradient(to right, rgba(3,168,160,1), rgba(72,190,187,1));">
                          <nuxt-link to="/student/course" class="card-body text-light">
                            <h1 class="card-title">{{ info.total_enrolled }}</h1>
                            <p class="card-text text-white ">Total Enrolled</p>
                          </nuxt-link>
                        </div>
                      </div>
                      <div class="btcol-lg-6 btcol-xl-3 mb-1">
                        <div class="card text-white mb-3 custom_dashboard_card h-100"
                             style="background-image: linear-gradient(to right, rgba(36,136,176,1), rgba(75,176,217,1));">
                          <nuxt-link to="/student/payment-history" class="card-body text-light">
                            <h1 class="card-title">{{ info.unpaid_order }}</h1>
                            <p class="card-text text-white ">Unpaid Order</p>
                          </nuxt-link>
                        </div>
                      </div>
                      <div class="btcol-lg-6 btcol-xl-3 mb-1">
                        <div class="card text-white mb-3 custom_dashboard_card h-100"
                             style="background-image: linear-gradient(to right, rgba(3 168 48), rgba(75 208 137));">
                          <nuxt-link to="/student/course" class="card-body text-light">
                            <h1 class="card-title">{{ info.total_completed }}</h1>
                            <p class="card-text text-white ">Completed Course</p>
                          </nuxt-link>
                        </div>
                      </div>
                      <div class="btcol-lg-6 btcol-xl-3 mb-1">
                        <div class="card text-white mb-3 custom_dashboard_card h-100"
                             style="background-image: linear-gradient(to right, rgba(141 3 168), rgba(190 72 180));">
                          <nuxt-link to="/cart" class="card-body text-light">
                            <h1 class="card-title">{{ totalCartItems }}</h1>
                            <p class="card-text text-white ">Cart Items</p>
                          </nuxt-link>
                        </div>
                      </div>
                    </div>
                  </div>
<!--                  <div class="text-center">
                    <nuxt-link to="/page/courses" class="continue_to_shopping d-inline-block mt-2 cart_btns"><b>Start Shopping</b>
                      <font-awesome-icon :icon="['fa', 'fa-arrow-right']"/>
                    </nuxt-link>
                  </div>-->
                </div>
              </div>

              <!-- user calender -->
              <div class="card shadow mb-4">
                <div class="card-header primary_header">
                  <h4>Calendar</h4>
                </div>

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
  name: 'Profile',
  components: {Sidebar, StudentCalender},
  data(){
    return{
       info:{},
      totalCartItems: 0,
    }
  },
  async mounted() {
    await this.init();
    this.cartItems();
  },
  methods:{
    init(){
        this.$axios.get('/student/dashboard/info').then((response)=>{
          this.info=response.data.data
        }).catch(()=>{
            this.info={}
        })
    },
    cartItems() {
      if (process.client) {
        if (localStorage.getItem("cartItems") != null) {
          this.totalCartItems = JSON.parse(localStorage.getItem('cartItems')).length;
        }
        //this.totalCartItems = localStorage.getItem("cartItems") === null ? 0 : JSON.parse(localStorage.getItem('cartItems').length);
      }
    },
  }

}
</script>

<style scoped>

</style>
