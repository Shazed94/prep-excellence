<template>
  <v-card>

  </v-card>
</template>

<script>
import BreadCrumbs from "~/components/common/BreadCrumbs";
import {common as commonMixin} from "@/mixins/common";
import Calender from "@/components/admin/course/Calender";
import moment from "moment-timezone";
export default {
  name: 'EScheduleModal',
  components: {BreadCrumbs, Calender},
  mixins: [commonMixin],
  data() {
    return {
      moment,
      pageInfo: {
        pageName: 'My Schedule',
      },
      loader: {isLoading: false, isSubmitting: false, isDeleting: false},
    }
  },
  async mounted() {

  },
  watch:{

  },
  methods: {

  }
}
</script>
<style scoped>
.theme--light * >>> .v-btn {
  color: #1b457d !important;
  border-radius: 6px !important;
}
</style>
