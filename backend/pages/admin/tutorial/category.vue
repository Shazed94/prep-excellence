<template>
  <div class="flex-grow-1 menu-item">
    <bread-crumbs
      :page-title="`${pageInfo.pageName}`"
      :items="[{text: pageInfo.pageName,disabled: true, href: '/admin/tutorial/category'},]"
    />
    <v-card :loading="loader.isLoading">
      <v-card-text>
        <v-row dense>
          <v-col
            cols="12"
            md="8"
          >
            <v-card>
              <v-card-title class="menu-title blue white--text">
                <span class="text-h5">Category List</span>
              </v-card-title>
              <client-only placeholder="loading...">
                <category-item></category-item>
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
import CategoryItem from "@/components/tutorial/CategoryItem.vue";
import {mapGetters} from 'vuex'
const permission = 'Tutorial Category'
const stateName = 'tutorial_categories'
const storeName='admin/tutorial/category'
export default {
  name:'Category',
  head: {
    title: permission,
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
    subject: permission
  },
  components: {BreadCrumbs, CategoryItem},
  mixins: [commonMixin],
  data() {
    return {
      pageInfo: {
        pageName: permission,
        apiUrl: '/tutorial-category/',
        permission
      },
      categories:[],
      state: {
        name: stateName,
        store_name: storeName,
      },
      loader: {isLoading: false, isSubmitting: false, isDeleting: false},

    }
  },
}
</script>

