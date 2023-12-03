<template>
  <div class="flex-grow-1" style="max-width: 100%">
    <bread-crumbs
      :page-title="`Manage ${pageInfo.pageName}`"
      :items="[{text: 'Role',disabled: false, href: '/role'},{text: 'Basic Setup',disabled: true, href: '/role/basic'},]"
    />
    <v-row dense>
      <v-col cols="12" md="6" v-if="$can('read','Role')">
        <role/>
      </v-col>
      <v-col cols="12" md="6" v-if="$can('read','Permission')">
        <permission/>
      </v-col>
      <v-col cols="12" md="12" v-if="$can('read','Role Menu')">
        <Menu/>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import Role from "../../components/rolePermission/Role";
import Menu from "../../components/rolePermission/Menu";
import Permission from "../../components/rolePermission/Permission";
import BreadCrumbs from "../../components/common/BreadCrumbs";

export default {
  name:'RoleBasic',
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
    subject: 'Admin'
  },
  components: {BreadCrumbs, Menu, Permission,Role},
  data() {
    return {
      pageInfo: {
        pageName: 'Role & Permission',
        apiUrl: '/',
        permission: ''
      },
      items: [],
      item: {},
      loader: {
        isLoading: false,
        isSubmitting: false,
        isDeleting: false
      },
      editIndex: -1,
      form: {},
      formBackup: {}
    }
  },
  methods: {

  }
}
</script>
<style>
.v-data-table table td {
  border-bottom:thin solid rgba(0, 0, 0, 0.05)!important;
}
.v-application .text-h5 {
    padding: 5px 0px 0px 0px;
    font-size: 17px!important;
    font-weight: 600!important;
    padding-left: 38px;
}
.v-btn.error{
  background-color:red !important;
}
</style>
