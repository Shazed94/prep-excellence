<template>
  <v-card :loading="loader.isLoading">
    <div class="text-right">
<!--      <v-btn
        ref="printBtn"
        v-print="'#printMe'"
        icon
      >
        <v-icon color="light-blue">mdi-printer</v-icon>
      </v-btn>-->
      <student-i-d-card :student="student" />
    </div>
    <v-sheet id="printMe">
      <v-container
        id="input-usage"
        fluid
      >
        <v-row justify="space-around">
          <v-avatar style="text-align: center"
                    class="profile"
                    color="grey"
                    size="164"
                    tile>
            <v-img :src="student.userable?student.userable.image:null"></v-img>
          </v-avatar>
        </v-row>
        <v-row>
          <v-col cols="12" xs="12" sm="4">
            <v-input
              :messages="['Student ID']"
              prepend-icon="mdi-school-outline"
            >
              {{ student.student_id }}
            </v-input>
          </v-col>
          <template v-if="student.userable">
            <v-col cols="12" xs="12" sm="4">
              <v-input
                :messages="['Name']"
                prepend-icon="mdi-account"
              >
                {{ student.userable.name }}
              </v-input>
            </v-col>
            <v-col cols="12" xs="12" sm="4" v-if="student.userable.email">
              <v-input
                :messages="['Email']"
                prepend-icon="mdi-email"
              >
                {{ student.userable.email }}
              </v-input>
            </v-col>
            <v-col cols="12" xs="12" sm="4" v-if="student.userable.phone_number">
              <v-input
                :messages="['Phone Number']"
                prepend-icon="mdi-phone"
              >
                {{ student.userable.phone_number }}
              </v-input>
            </v-col>
            <v-col cols="12" xs="12" sm="4" v-if="student.userable.gender">
              <v-input
                :messages="['Gender']"
                prepend-icon="mdi-gender-male"
              >
                {{ student.userable.gender.name }}
              </v-input>
            </v-col>
            <v-col cols="12" xs="12" sm="4" v-if="student.userable.bloodGroup">
              <v-input
                :messages="['Blood Group']"
                prepend-icon="mdi-water-outline"
              >
                {{ student.userable.bloodGroup.name }}
              </v-input>
            </v-col>
          </template>
          <v-col cols="12" xs="12" sm="4" v-if="student.parents">
            <v-input
              :messages="['Present Address']"
              prepend-icon="mdi-map-marker"></v-input>
            <div v-for="(ad,key) in jsonDecode(student.parents.present_address)" :key="key">
              <span class="ml-md-4">{{ key+': ' }} {{ ad }}</span><br>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-sheet>
  </v-card>
</template>

<script>
import {common as commonMixin} from "@/mixins/common";
import StudentIDCard from "@/components/admin/student/StudentIDCard";
export default {
  components:{StudentIDCard},
  mixins: [commonMixin],
  props:{
    student:{
      required:true,
      type:Object
    }
  },
  data() {
    return {
      loader: {isLoading: false, isSubmitting: false, isDeleting: false},
    }
  },
  computed: {

  },
  async mounted() {

  },
  methods: {
    jsonDecode(dt){
      try {
        return JSON.parse(dt)
      }catch (e){
        return {}
      }
    },
  }
}
</script>
<style>
@page {
  size: auto;
  margin: 0;
}
</style>
