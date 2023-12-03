<template>
  <v-container fluid>
    <bread-crumbs
      :page-title="`${pageInfo.pageName}`"
      :items="[{text: 'Student',disabled: false, href: '/admin/student/student '},{text: `${pageInfo.pageName}`,disabled: true, href: '/admin/student/{id}/student'}]"
    />
    <v-card>
    <v-toolbar
      flat
    >
      <template v-slot:extension>
        <v-tabs
          v-model="tab"
          align-with-title
        >
          <v-tabs-slider></v-tabs-slider>

          <v-tab
            v-for="item in items"
            :key="item"
          >
            {{ item }}
          </v-tab>
        </v-tabs>
      </template>
    </v-toolbar>

    <v-tabs-items v-model="tab">
      <v-tab-item key="Basic">
        <v-card flat>
          <basic :student="student"/>
        </v-card>
      </v-tab-item>
      <v-tab-item key="Courses">
        <v-card flat>
          <student-course :student="student"/>
        </v-card>
      </v-tab-item>
    </v-tabs-items>
  </v-card>
  </v-container>
</template>
<script>
import BreadCrumbs from "@/components/common/BreadCrumbs";
import {common as commonMixin} from "@/mixins/common";
import Basic from "@/components/admin/student/Basic";
import StudentCourse from "@/components/admin/student/studentCourse";
export default {
  name:'studentDetails',
  head: {
    title: 'Students',
    meta: [
      {
        hid: 'description',
        name: 'description',
        content: ''
      }
    ],
  },
  meta:{
    action: 'read',
    subject: 'Students'
  },
  components:{BreadCrumbs, Basic, StudentCourse},
  mixins: [commonMixin],
  data () {
    return {
      pageInfo: {
        pageName: 'Student Details',
        apiUrl: '/student/',
        permission: ''
      },
      loader: {isLoading: false, isSubmitting: false, isDeleting: false},
      student:{},
      tab: null,
      items: [
        'Basic', 'Courses'
      ],
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    }
  },
  mounted() {
    this.init();
  },
  methods:{
    async init(){
      this.loader.isLoading=true
      await this.$axios.get(this.pageInfo.apiUrl + this.$route.params.id).then((response) => {
        this.student=response.data.data;
      }).catch(() => {
        this.student={}
        this.$toaster.error('Invalid request');
        return this.$router.go(-1);
      })
      this.loader.isLoading=false
    }
  }
}
</script>
