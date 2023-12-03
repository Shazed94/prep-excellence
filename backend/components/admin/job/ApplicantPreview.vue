<template>
  <v-dialog
    v-model="dialog"
    max-width="1200"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        color="green"
        dark
        x-small
        fab
        v-bind="attrs"
        v-on="on"
      >
        <v-icon>mdi-eye</v-icon>
      </v-btn>
    </template>
    <v-card>
      <div class="text-right">
        <v-btn
          ref="printBtn"
          v-print="`#printMeID`"
          icon
        >
          <v-icon color="light-blue">mdi-printer</v-icon>
        </v-btn>
      </div>
      <v-sheet :id="`printMeID`">
        <v-container>
          <report-head></report-head>
          <v-row>
            <v-col cols="12" md="7">
              <div class="py-2">
                <h4 class="text-dark h6">Applicant Details (Position: <b>{{ applicant?.job?.title}} </b>)</h4>
              </div>
                <v-simple-table>
                  <template v-slot:default>
                    <tbody>
                      <tr>
                        <td>Referer</td>
                        <td>{{ applicant.referral}}</td>
                      </tr>
                      <tr>
                        <td>School/College</td>
                        <td>{{ applicant.school_college}}</td>
                      </tr>
                      <tr>
                        <td>Graduate Year</td>
                        <td>{{ applicant.grade_year}}</td>
                      </tr>
                      <tr>
                        <td>Tutored Subject</td>
                        <td>{{ applicant.subjects }}</td>
                      </tr>
                      <tr>
                        <td>School Math Subject</td>
                        <td>{{ applicant.school_math_subject	}}</td>
                      </tr>
                      <tr>
                        <td>Top 5 Tutored Subject</td>
                        <td>{{ applicant.top_subjects	}}</td>
                      </tr>
                      <tr>
                        <td>Taught Class Before</td>
                        <td>{{ applicant.taught_class_before?"Yes":"NO"	}}</td>
                      </tr>
                      <tr v-if="applicant.taught_details">
                        <td>Taught Details</td>
                        <td>{{ applicant.taught_details	}}</td>
                      </tr>
                      <tr>
                        <td>Tutored Before</td>
                        <td>{{ applicant.tutored_before?"Yes":"NO"	}}</td>
                      </tr>
                      <tr v-if="applicant.how_long">
                        <td>Duration</td>
                        <td>{{ applicant.how_long	}}</td>
                      </tr>
                      <tr v-if="applicant.tutored_subject">
                        <td>Tutored Subject</td>
                        <td>{{ applicant.tutored_subject	}}</td>
                      </tr>
                      <tr v-if="applicant.sat_score_english">
                        <td>SAT Score English</td>
                        <td>{{ applicant.sat_score_english	}}</td>
                      </tr>
                      <tr v-if="applicant.sat_score_math">
                        <td>SAT Score Math</td>
                        <td>{{ applicant.sat_score_math	}}</td>
                      </tr>
                      <tr v-if="applicant.sat_score_total">
                        <td>SAT Score Total</td>
                        <td>{{ applicant.sat_score_total	}}</td>
                      </tr>
                      <tr v-if="applicant.p_sat_score">
                        <td>PSAT Score</td>
                        <td>{{ applicant.p_sat_score	}}</td>
                      </tr>
                      <tr v-if="applicant.act_english_score">
                        <td>ACT English</td>
                        <td>{{ applicant.act_english_score	}}</td>
                      </tr>
                      <tr v-if="applicant.act_math_score">
                        <td>ACT Math</td>
                        <td>{{ applicant.act_math_score	}}</td>
                      </tr>
                      <tr v-if="applicant.act_english_score">
                        <td>ACT English</td>
                        <td>{{ applicant.act_english_score	}}</td>
                      </tr>
                      <tr v-if="applicant.act_science_score">
                        <td>ACT Science</td>
                        <td>{{ applicant.act_science_score	}}</td>
                      </tr>
                      <tr v-if="applicant.act_reading_score">
                        <td>ACT Reading</td>
                        <td>{{ applicant.act_reading_score	}}</td>
                      </tr>
                      <tr v-if="applicant.act_total_score">
                        <td>ACT Total</td>
                        <td>{{ applicant.act_total_score	}}</td>
                      </tr>
                      <tr v-if="applicant.ap_exam_scores">
                        <td>AP Exam Score</td>
                        <td>{{ applicant.ap_exam_scores	}}</td>
                      </tr>
                      <tr v-if="applicant.hsc_gpa">
                        <td>HSC GPA</td>
                        <td>{{ applicant.hsc_gpa	}}</td>
                      </tr>
                      <tr v-if="applicant.college_gpa">
                        <td>College GPA</td>
                        <td>{{ applicant.college_gpa	}}</td>
                      </tr>
                      <tr v-if="applicant.available">
                        <td>Available</td>
                        <td>{{ applicant.available	}}</td>
                      </tr>
                      <tr v-if="applicant.available_hour">
                        <td>Available Hour</td>
                        <td>{{ applicant.available_hour	}}</td>
                      </tr>
                      <tr v-if="applicant.preference_schedule">
                        <td>Preference Time</td>
                        <td>{{ applicant.preference_schedule	}}</td>
                      </tr>
                      <tr v-if="applicant.hourly_rate">
                        <td>Hourly Rate</td>
                        <td>{{ applicant.hourly_rate	}}</td>
                      </tr>
                      <tr >
                        <td>Willing to create lesson</td>
                        <td>{{ applicant.willing_create_lesson?"Yes":"NO"	}}</td>
                      </tr>
                      <tr v-if="applicant.willing_topics">
                        <td>Willing Topics</td>
                        <td>{{ applicant.willing_topics	}}</td>
                      </tr>
                      <tr v-if="applicant.lesson_rate">
                        <td>lesson Rate</td>
                        <td>{{ applicant.lesson_rate	}}</td>
                      </tr>
                      <tr>
                        <td>Willing to Article Write</td>
                        <td>{{ applicant.artical_write?"Yes":"NO"	}}</td>
                      </tr>
                      <tr v-if="applicant.artical_rate">
                        <td>Article Rate</td>
                        <td>{{ applicant.artical_rate	}}</td>
                      </tr>
                      <tr>
                        <td>Agree Terms and Condition</td>
                        <td>{{ applicant.is_agree?"Yes":"NO"	}}</td>
                      </tr>
                      <tr>
                        <td>Phone and Information Publish Permission</td>
                        <td>{{ applicant.publish_permission?"Yes":"NO"	}}</td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              <!-- applicant details -->
              <div class="mt-3 text-dark" v-if="applicant.short_description">
                <label>Short Description</label>
                <div v-html="applicant.short_description"></div>
              </div>
              <!-- instructor rating -->
            </v-col>
            <v-col cols="12" md="5">
              <div class="tutor-course-price-preview btcol-xl-4 btcol-lg-4 btcol-md-6 btcol-12">
                <div class="course-card shadow-lg border bg-white border-gray-200 rounded p-2">
                  <div class="text-center">
                    <img class="img-fluid" :src="applicant.image" :alt="applicant.name">
                  </div>
                  <!-- contend -->
                  <div class="single-page-cart btcol-xl-4 btcol-lg-4 btcol-md-4 col-12 p-4">
                    <div class="d-flex text-secondary">
                      <span class="me-2"> <v-icon>mdi-account-tie-woman</v-icon></span>
                      <p>{{ applicant.name }}</p>
                    </div>
                    <div class="d-flex text-secondary">
                      <span class="me-2"> <v-icon>mdi-email</v-icon></span>
                      <p>{{ applicant.email }}</p>
                    </div>
                    <div class="d-flex text-secondary me-2">
                      <span class="me-2"><v-icon>mdi-phone-classic</v-icon></span>
                      <p> {{ applicant.phone_number}}</p>
                    </div>
                    <div class="d-flex text-secondary me-2">
                      <span class="me-2"><v-icon>mdi-file-account</v-icon></span>
                      <p><a :href="applicant.cv_file" target="_blank">CV View</a></p>
                    </div>
                  </div>
                </div>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </v-sheet>
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
import moment from "moment-timezone";
import ReportHead from "@/components/report/ReportHead";
export default {
  name:'ApplicantPreview',
  components:{ReportHead},
  props:{
    applicant:{
      required:true,
      type:Object,
      default() {
        return {}
      }
    }
  },
  data(){
    return{
      moment,
      dialog: false,
      instructors:[],
    }
  },
  watch:{
    applicant(){
      this.instructors = this.applicant.employees ??[]
    }
  },
  methods:{
    findEmployeeName(id){
      let emp = this.instructors.find(item=>item.id === id);
      if (emp) return emp.userable.name
      else return null

    },
  }
}
</script>

<style>
.tutor-course-price .sale-price {
  font-size: 34px;
  line-height: 34px;
  font-weight: 700;
  color: #d31819;
}
h4.material-include-title {
  font-size: 20px;
  font-weight: 600;
  padding: 10px 0;
}
</style>
