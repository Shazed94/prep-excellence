<template>
  <div class="flex-grow-1" style="max-width: 100%">
    <bread-crumbs
      :page-title="`Manage ${pageInfo.pageName}`"
      :items="[{text: 'User',disabled: true, href: '/user'}]"
    />
    <v-row dense>
      <v-col cols="12" sm="6" v-if="$can('read','Qualification')">
        <designation/>
      </v-col>
      <v-col cols="12" sm="6" v-if="$can('read','Religion')">
        <religion/>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import Designation from "@/components/user/Designation";
import Religion from "@/components/user/Religion";
import BreadCrumbs from "../../components/common/BreadCrumbs";

export default {
  head: {
    title: 'Role Permission',
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
    subject: 'Auth'
  },
  components: {Designation, BreadCrumbs, Religion},
  data() {
    return {
      pageInfo: {
        pageName: 'User Basic',
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
  methods: {

  }
}
</script>
