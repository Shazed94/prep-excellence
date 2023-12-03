<template>
  <div class="flex-grow-1 menu-item">
    <bread-crumbs
      :page-title="`${pageInfo.pageName}`"
      :items="[{text: `Settings`,disabled: true, href: '#'},{text: 'Menu',disabled: true, href: '/settings/menu'},]"
    />
    <v-card :loading="loader.isLoading">
      <v-card-text>
        <v-row dense>
          <v-col cols="12" md="4">
            <v-row dense>
              <v-col
                cols="12"
                sm="12"
                class="create_menu"
              >
                <v-card >
                  <v-card-title class="menu-title blue white--text">
                    <span class="text-h5">Menu</span>
                    <v-spacer></v-spacer>
                  </v-card-title>
                  <p-menu></p-menu>
                </v-card>
              </v-col>
              <v-col
                cols="12"
                sm="12"
              >
                <v-card >
                  <v-card-title class="menu-title blue white--text">
                    <span class="text-h5">Add Menu Items</span>
                    <v-spacer></v-spacer>
                  </v-card-title>
                  <page></page>
                  <custom-link></custom-link>
                </v-card>
              </v-col>
            </v-row>
          </v-col>
          <v-col
            cols="12"
            md="8"
          >
            <v-card>
              <v-card-title class="menu-title blue white--text">
                <span class="text-h5">Menu List</span>
              </v-card-title>
              <client-only placeholder="loading...">
                <p-menu-list></p-menu-list>
              </client-only>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import BreadCrumbs from "@/components/common/BreadCrumbs";
import {common as commonMixin} from "@/mixins/common";
import PMenu from "@/components/public/settings/menu/PMenu";
import PMenuList from "@/components/public/settings/menu/PMenuList";
import CustomLink from "@/components/public/settings/menu/CustomLink";
import page from "@/components/public/settings/menu/Page";
import {mapGetters} from 'vuex'
const permission = 'Menu'
const stateName = 'p_menus'
const storeName='public/settings/menu'
export default {
  name:'Menu',
  head: {
    title: 'Menu',
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
    subject: 'Menu'
  },
  components: {BreadCrumbs, PMenu, PMenuList, CustomLink, page},
  mixins: [commonMixin],
  data() {
    return {
      pageInfo: {
        pageName: 'Menus',
        apiUrl: '/p-menu/',
        permission: permission
      },
      state: {
        name: stateName,
        store_name: storeName,
      },
      loader: {isLoading: false, isSubmitting: false, isDeleting: false},
    }
  },
  computed: {
    ...mapGetters('public/settings/menu',['p_menus']),
    editMode() {
      return this.editIndex > -1
    }
  },
  async mounted() {
    this.loader.isLoading = true
    const payload = {apiUrl: this.pageInfo.apiUrl, stateName}
    if(this.p_menus.length<1 ) await this.$store.dispatch(storeName+'/getItems', payload)

    let url = '/page/?per_page=50&page=1'
    const payload2 = {apiUrl: url, stateName:'pages'}
    await this.$store.dispatch('public/settings/page/getItems', payload2)

    this.loader.isLoading = false
  },
  methods: {

  }
}
</script>

