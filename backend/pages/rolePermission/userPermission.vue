<template>
  <div class="flex-grow-1" style="max-width: 100%">
    <bread-crumbs
      :page-title="`Manage ${pageInfo.pageName}`"
      :items="[{text: 'User',disabled: false, href: '/rolePermission'},{text: 'Permissions',disabled: true, href: '/rolePermission/userPermission'},]"
    />
      <validation-observer ref="observer" v-slot="{ invalid }">
        <v-form ref="form" @submit.prevent="updatePermission()">
          <v-row dense>
          <v-col cols="12" sm="4">
            <validation-provider v-slot="{ errors }" name="User" vid="role_id" rules="required">
              <v-select v-model="user_id" :items="users" :error-messages="errors" item-text="name" item-value="id" label="User" dense hide-details="auto" outlined></v-select>
            </validation-provider>
          </v-col>
          <v-col cols="8"></v-col>
          <v-col cols="6" sm="4" v-for="(pm,key) in menu_permissions" :key="key">
            <span>{{ pm.name }}</span><br>
            <v-checkbox v-for="(pm2,key2) in pm.permissions" :key="key2"
                        v-model="current_permissions"
                        name="permissions[]"
                        :label="pm2.name"
                        :value="pm2.pivot.id"
            ></v-checkbox>
          </v-col>
          <v-col cols="12"></v-col>
          <v-btn
            v-if="$can('edit','User Permission')"
            color="green darken-1"
            class="mx-2 white--text"
            type="submit"
            :disabled="invalid"
            :loading="loader.isSubmitting"
            depressed
          >
            {{ 'Save' }}
          </v-btn>
          </v-row>
        </v-form>
      </validation-observer>
  </div>
</template>

<script>

import BreadCrumbs from "../../components/common/BreadCrumbs";
import {common as commonMixin} from "@/mixins/common";

export default {
  name:'UserPermissionPage',
  head: {
    title: 'User Wise Permission',
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
    subject: 'User Permission'
  },
  components: {BreadCrumbs, commonMixin},
  data() {
    return {
      pageInfo: {
        pageName: 'User Wise Permission',
        apiUrl: '/',
        permission: ''
      },
      loader: {isLoading: false, isSubmitting: false, isDeleting: false},
      user_id:null,
      type:null,
      chk:[],
      current_permissions:[],
    }
  },
  async mounted() {
    const payload0 = {apiUrl: '/menu-permission/', stateName: 'menu_permissions'}
    if (!this.menu_permissions.length) await this.$store.dispatch('rolePermission/basic/getItems', payload0)

    const payload2 = {apiUrl: '/menu/', stateName: 'menus'}
    if (!this.menus.length) await this.$store.dispatch('rolePermission/basic/getItems', payload2)

    const payload3 = {apiUrl: '/permission/', stateName: 'permissions'}
    if (!this.permissions.length) await this.$store.dispatch('rolePermission/basic/getItems', payload3)

    const payload4 = {apiUrl: '/role/', stateName: 'roles'}
    if (!this.roles.length) await this.$store.dispatch('rolePermission/basic/getItems', payload4)

    if (!this.users.length) await this.$store.dispatch('user/getUser')
  },
  methods: {
    async updatePermission(){
      let data =new FormData();
      for(let i=0; i<this.current_permissions.length; i++){
        data.append('permissions[]',this.current_permissions[i]);
      }
      await this.$axios.post(`/menu-permission/user${this.user_id}`,data).then((response)=>{
        this.$toaster.success(response.data.message);
        this.$store.dispatch('user/getUser')
      }).catch((error)=>{
        if (error.response.status === 422) {
          this.$refs.observer.setErrors(error?.response?.data?.errors)
          Object.keys(error.response.data.errors).map((field) => {
            this.$toaster.error(error.response.data.errors[field][0]);
          });
        } else this.$toaster.error(error.response.data.message);
      })
    },
    findCurrentPermission(){
      let pm = this.users.find(item=>parseInt(item.id)===parseInt(this.user_id));
      if(pm){
        let ll = this.roles.find(item=>item.id===pm.role_id);
        if (ll) this.type=ll.type;
        else this.type=null;

        this.current_permissions=[];
        this.current_permissions.push(...pm.menuPermissions.map(item=>item.id));
      }
      else{
        this.type=null;
        this.current_permissions=[];
      }
    }
  },
  computed: {
    permissions(){
      return this.$store.state.rolePermission.basic.permissions;
    },
    menu_permissions(){
      return this.$store.state.rolePermission.basic.menu_permissions.filter(item=>item.type===this.type);
    },
    menus(){
      return this.$store.state.rolePermission.basic.menus;
    },
    users(){
      return this.$store.state.user.users;
    },
    roles(){
      return this.$store.state.rolePermission.basic.roles;
    }
  },
  watch:{
    user_id(){
      this.findCurrentPermission();
    },
    users(){
      this.findCurrentPermission();
    }
  }
}
</script>
