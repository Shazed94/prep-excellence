<template>
  <div class="flex-grow-1" style="max-width: 100%">
    <bread-crumbs
      :page-title="`${pageInfo.pageName}`"
      :items="[{text: 'Employee',disabled: false, href: '/admin/employee'},{text: 'Add',disabled: true, href: '/admin/employee/edit'},]"
    />
    <v-row dense>
      <v-col cols="12" sm="12">
        <edit/>
      </v-col>
    </v-row>
  </div>
</template>

<script>

import BreadCrumbs from "@/components/common/BreadCrumbs";
import Edit from "@/components/admin/employee/Edit";
export default {
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
    action: 'edit',
    subject: 'Employees'
  },
  components: {BreadCrumbs, Edit},
  data() {
    return {
      pageInfo: {
        pageName: 'Employee Edit',
        apiUrl: '/',
        permission: ''
      },
    }
  },
}
</script>
