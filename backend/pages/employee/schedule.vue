<template>
  <v-container fluid>
    <bread-crumbs
      :page-title="`${pageInfo.pageName}`"
      :items="[{text: 'Course',disabled: false, href: '/employee/course'},{text: `${pageInfo.pageName}`,disabled: true, href: '/employee/schedule'}]"
    />
    <employee-schedule></employee-schedule>
  </v-container>
</template>

<script>
import BreadCrumbs from "~/components/common/BreadCrumbs";
import {common as commonMixin} from "@/mixins/common";
import EmployeeSchedule from "@/components/employee/EmployeeSchedule";
export default {
  name: 'Schedule',
  head: {
    title: 'My Schedule',
    meta: [
      {
        hid: 'description',
        name: 'description',
        content: 'Prepexcellence'
      }
    ],
  },
  meta:{
    action: 'read',
    subject: 'Employee Schedule'
  },
  components: {BreadCrumbs,EmployeeSchedule},
  mixins: [commonMixin],
  data() {
    return {
      pageInfo: {
        pageName: 'My Schedule',
      },
      loader: {isLoading: false, isSubmitting: false, isDeleting: false},
    }
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
