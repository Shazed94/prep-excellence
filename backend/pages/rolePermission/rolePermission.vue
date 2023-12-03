<template>
  <div class="flex-grow-1" style="max-width: 100%">
    <bread-crumbs
      :page-title="`Manage ${pageInfo.pageName}`"
      :items="[{text: 'Role',disabled: false, href: '/rolePermission'},{text: 'Permissions',disabled: true, href: '/rolePermission/rolePermission'},]"
    />
      <validation-observer ref="observer" v-slot="{ invalid }">
        <v-form ref="form" @submit.prevent="updatePermission()">
          <v-row dense>
          <v-col cols="12" sm="4">
            <validation-provider v-slot="{ errors }" name="Role" vid="role_id" rules="required">
              <v-select v-model="role_id" :items="roles" :error-messages="errors" item-text="name" item-value="id" label="Role" dense hide-details="auto" outlined></v-select>
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
            v-if="$can('edit','Role Permission')"
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
  name:'RPermission',
  head: {
    title: 'Role Wise Permission',
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
    subject: 'Role Permission'
  },
  components: {BreadCrumbs, commonMixin},
  data() {
    return {
      pageInfo: {
        pageName: 'Role Wise Permission',
        apiUrl: '/',
        permission: ''
      },
      loader: {isLoading: false, isSubmitting: false, isDeleting: false},
      role_id:null,
      type:null,
      chk:[],
      current_permissions:[],
    }
  },
  async mounted() {
    const payload0 = {apiUrl: '/menu-permission/', stateName: 'menu_permissions'}
    if (!this.menu_permissions.length) await this.$store.dispatch('rolePermission/basic/getItems', payload0)

    const payload1 = {apiUrl: '/role/', stateName: 'roles'}
    if (!this.roles.length) await this.$store.dispatch('rolePermission/basic/getItems', payload1)

    const payload2 = {apiUrl: '/menu/', stateName: 'menus'}
    if (!this.menus.length) await this.$store.dispatch('rolePermission/basic/getItems', payload2)

    const payload3 = {apiUrl: '/permission/', stateName: 'permissions'}
    if (!this.permissions.length) await this.$store.dispatch('rolePermission/basic/getItems', payload3)
  },
  methods: {
    updatePermission(){
      let data =new FormData();
      for(let i=0; i<this.current_permissions.length; i++){
        data.append('permissions[]',this.current_permissions[i]);
      }
      this.$axios.post(`/menu-permission${this.role_id}`,data).then((response)=>{
        this.$toaster.success(response.data.message);
        const payload1 = {apiUrl: '/role/', stateName: 'roles'}
        this.$store.dispatch('rolePermission/basic/getItems', payload1)
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
      let pm = this.roles.find(item=>parseInt(item.id)===parseInt(this.role_id));
      if(pm){
        this.type=pm.type;
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
    roles(){
      return this.$store.state.rolePermission.basic['roles'].filter(item=>item.is_active===true);
    }
  },
  watch:{
    role_id(){
      this.findCurrentPermission();
    },
    roles(){
      this.findCurrentPermission();
    }
  }
}
</script>
