<template>
  <v-dialog
    v-model="dialog"
    persistent
    max-width="900"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn
          class="ml-1 mb-1"
        color="green"
        dark
        x-small
        fab
        v-bind="attrs"
        v-on="on"
      >
        <v-icon color="white">mdi-printer</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title class="text-h5">
        Print Student ID Card
      </v-card-title>
      <v-card-text>
        <v-row dense justify="center" >
          <v-col  cols="12" xs="12" sm="12">
            <div class="text-right">
              <v-btn
                ref="printBtn"
                v-print="`#printMeID`"
                icon
              >
                <v-icon color="light-blue">mdi-printer</v-icon>
              </v-btn>
            </div>
            <v-sheet :id="`printMeID`" style="margin:10px;">
              <v-container>
                <div class="text-center" style="border-bottom: 1px dotted #070707">
                  <h1 >{{ 'PrepExcellence' }}</h1>
                  <h3 >Address: {{ 'Address' }}</h3>
                  <h4 >Phone: {{ '+2188021212121' }}</h4>
                  <h4 >Issue Date: {{ student.created_at }}</h4>
                </div>
                <div style="margin-top: 10px;">
                  <div class="text-center">ID Card</div>
                  <v-row justify="space-around" style="text-align: center; display: flex;
    justify-content: center;">
                    <v-avatar style="text-align: center"
                      class="profile"
                      color="grey"
                      size="164"
                      tile
                    >
                      <v-img :src="$auth.user.image"></v-img>
                    </v-avatar>
                  </v-row>
                  <table style="width:100%; margin-top: 5px;">

                    <tr class="text-left" style="border-top:1px dotted #070707;">
                      <td >Student ID:</td>
                      <td colspan="2"></td>
                      <td>{{ student.userable?student.userable.student_id:'' }}</td>
                    </tr>
                    <tr  class="text-left" style="border-top:1px dotted #070707;">
                      <td>Name :</td>
                      <td colspan="2"></td>
                      <td>{{ student.name }}</td>
                    </tr>
                    <tr  class="text-left" style="border-top:1px dotted #070707;">
                      <td>DOB :</td>
                      <td colspan="2"></td>
                      <td>{{student.userable?student.userable.date_of_birth:'' }}</td>
                    </tr>
                  </table>
                </div>
              </v-container>
            </v-sheet>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn class="mr-2 error darken-1 white--text" depressed @click="dialog = false">
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "StudentIDCard",
  props: {
    student: {type: Object, required: true},
  },
  data() {
    return {
      dialog: false,
    }
  },
  computed: {

  },
  created() {

  },
}
</script>

<style scoped>
.d-flex {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}
.text-center {
  text-align: center;
}
table {
  border-collapse: collapse;
}

@page {
  size: auto;
  margin: 0;
}
</style>

