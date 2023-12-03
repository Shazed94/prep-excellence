<template>
  <div class="flex-grow-1" style="max-width: 100%">
    <bread-crumbs
      :page-title="`${pageInfo.pageName}`"
      :items="[{text: 'Employee',disabled: false, href: '/admin/employee'},{text: 'Add',disabled: true, href: '/admin/employee/add'},]"
    />
    <v-row dense>
      <v-col cols="12" sm="12">
        <employee/>
      </v-col>
    </v-row>
  </div>
</template>

<script>

import BreadCrumbs from "@/components/common/BreadCrumbs";
import Employee from "@/components/admin/employee/Employee";
export default {
  name:'AddEmployeeA',
  head: {
    title: 'Employees',
    meta: [
      {
        hid: 'description',
        name: 'description',
        content: ''
      }
    ],
  },
  meta:{
    action: 'create',
    subject: 'Employees'
  },
  components: {BreadCrumbs,Employee},
  props:{
    application:{
      type:Object,
      required:false
    }
  },
  data() {
    return {
      pageInfo: {
        pageName: 'Employee Add',
        apiUrl: '/',
        permission: ''
      },
      loader: {
        isLoading: false,
        isSubmitting: false,
        isDeleting: false
      },
    }
  },
  created() {
    this.$nuxt.$on('application-event', ($event) => console.log($event))
  },
  methods: {

  }
}
</script>
