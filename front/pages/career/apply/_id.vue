<template>
  <div>
    <!-- Breadcumb -->
    <bread-crumbs2 :title="info.title" image="/bc_career.png" :items="[{title: pageInfo.pageName, link:'/career', disabled:true},{title: info.title, link:'#', disabled:true}]"></bread-crumbs2>
    <!-- aboutus page start -->
    <section class="about-page-area">
      <div class="btcontainer py-2">
        <div class="btrow">
          <div class="btcol-12">
            <div class=" text-subtitle-1" v-html="info.title"></div>
            <div v-html="info.job_context"></div>
          </div>
        </div>
      </div>
      <div class="map py-3">
        <div class="btcontainer">
          <div class="btrow">
            <div class="btcol-md-12">
              <v-card>
                <validation-observer ref="observer" v-slot="{ invalid }">
                  <v-form ref="form" @submit.prevent="submitData()">
                    <v-card-title class="text-h5"> Instructor/Tutor Application</v-card-title>
                    <v-card-text>
                      <v-container>
                        <v-row dense>
                          <v-col cols="12" sm="4">
                            <form-image-preview
                              :image-props="form.image"
                              @removeImage="removeImage($emit, 'image')"
                            />
                            <validation-provider
                              v-slot="{ errors }"
                              name="image"
                              vid="image"
                              rules="required"
                            >
                              <v-file-input
                                v-model="form.image"
                                label="Image"
                                filled
                                prepend-icon="mdi-camera"
                                accept="image/png, image/jpeg, image/jpeg"
                                :error-messages="errors"
                                outlined
                                dense
                                hide-details="auto"
                                show-size
                                single-line
                                small-chips
                                counter
                              />
                            </validation-provider>
                          </v-col>
                          <v-col cols="12" sm="12" md="4">
                            <validation-provider
                              v-slot="{ errors }"
                              name="name"
                              vid="name"
                              rules="required"
                            >
                              <v-text-field
                                v-model="form.name"
                                clearable
                                clear-icon="mdi-close-circle"
                                label="Name"
                                :error-messages="errors"
                                dense
                                outlined
                                auto-grow
                                no-resize
                              ></v-text-field>
                            </validation-provider>
                          </v-col>
                          <v-col cols="12" sm="12" md="4">
                            <validation-provider
                              v-slot="{ errors }"
                              name="email"
                              vid="email"
                              rules="required|email"
                            >
                              <v-text-field
                                v-model="form.email"
                                clearable
                                clear-icon="mdi-close-circle"
                                label="Email"
                                :error-messages="errors"
                                dense
                                outlined
                                auto-grow
                                no-resize
                              ></v-text-field>
                            </validation-provider>
                          </v-col>
                          <v-col cols="12" sm="6" md="4">
                            <validation-provider
                              v-slot="{ errors }"
                              name="phone number"
                              vid="phone number"
                              rules="required"
                            >
                              <vue-tel-input-vuetify
                                v-model="form.phone_number"
                                label="Phone Number"
                                v-bind="bindProps"
                                :error-messages="errors"
                                dense
                                outlined
                                auto-grow
                                no-resize
                              ></vue-tel-input-vuetify>
                            </validation-provider>
                          </v-col>
                          <v-col cols="12" sm="4">
                            <validation-provider
                              v-slot="{ errors }"
                              name="cv"
                              vid="cv"
                              rules="required"
                            >
                              <v-file-input
                                v-model="form.cv_file"
                                label="Current CV"
                                filled
                                :error-messages="errors"
                                outlined
                                accept="application/pdf"
                                dense
                                hide-details="auto"
                                show-size
                                single-line
                                small-chips
                                counter
                              />
                            </validation-provider>
                          </v-col>
                          <v-col cols="12" sm="12" md="4">
                            <validation-provider
                              v-slot="{ errors }"
                              name="referral"
                              vid="referral"
                              rules="required"
                            >
                              <v-text-field
                                v-model="form.referral"
                                clearable
                                clear-icon="mdi-close-circle"
                                label="Who referred you to us? "
                                :error-messages="errors"
                                dense
                                outlined
                                auto-grow
                                no-resize
                              ></v-text-field>
                            </validation-provider>
                          </v-col>
                          <v-col cols="12" sm="12" md="4">
                            <validation-provider
                              v-slot="{ errors }"
                              name="School/College"
                              vid="School/College"
                              rules="required"
                            >
                              <v-text-field
                                v-model="form.school_college"
                                clearable
                                clear-icon="mdi-close-circle"
                                label="School/College you are currently attending or graduated from"
                                :error-messages="errors"
                                dense
                                outlined
                                auto-grow
                                no-resize
                              ></v-text-field>
                            </validation-provider>
                          </v-col>
                          <v-col cols="12" sm="12" md="4">
                            <validation-provider
                              v-slot="{ errors }"
                              name="grade year"
                              vid="grade year"
                              rules="required"
                            >
                              <v-text-field
                                v-model="form.grade_year"
                                clearable
                                clear-icon="mdi-close-circle"
                                label="Grade/Year"
                                :error-messages="errors"
                                dense
                                outlined
                                auto-grow
                                no-resize
                              ></v-text-field>
                            </validation-provider>
                          </v-col>
                          <v-col cols="12" sm="12" md="4">
                            <validation-provider
                              v-slot="{ errors }"
                              name="subjects"
                              vid="subjects"
                              rules="required"
                            >
                              <v-select v-model="form.subjects"
                                        :items="course_categories"
                                        item-text="name"
                                        item-value="name"
                                        clear-icon="mdi-close-circle"
                                        label="What subjects and/or test prep do you want to tutor"
                                        :error-messages="errors"
                                        dense
                                        outlined
                                        auto-grow
                                        multiple>
                              </v-select>
                            </validation-provider>
                          </v-col>
                          <v-col cols="12" sm="12" md="4">
                            <validation-provider
                              v-slot="{ errors }"
                              name="mention subject"
                              vid="mention subject"
                              rules="required"
                            >
                              <v-text-field
                                v-model="form.school_math_subject"
                                clearable
                                clear-icon="mdi-close-circle"
                                label="If you selected High School Math, please mention the subjects."
                                :error-messages="errors"
                                dense
                                outlined
                                auto-grow
                                no-resize
                              ></v-text-field>
                            </validation-provider>
                          </v-col>
                          <v-col cols="12" sm="12" md="4">
                            <validation-provider
                              v-slot="{ errors }"
                              name="top 5 choice"
                              vid="top 5 choice"
                              rules="required"
                            >
                              <v-select v-model="form.top_subjects"
                                        :items="course_categories"
                                        item-text="name"
                                        item-value="name"
                                        clear-icon="mdi-close-circle"
                                        label="What are your top 5 choices for tutoring from the above?"
                                        :error-messages="errors"
                                        dense
                                        outlined
                                        auto-grow
                                        multiple>
                              </v-select>
                            </validation-provider>
                          </v-col>
                          <v-col cols="12" sm="12" md="4">
                            <validation-provider
                              v-slot="{ errors }"
                              name="Have you taught"
                              vid="Have you taught"
                              rules="required"
                            >
                              <v-select v-model="form.taught_class_before"
                                        :items="yes_no"
                                        item-text="name"
                                        item-value="id"
                                        clear-icon="mdi-close-circle"
                                        label="Have you taught a class before?"
                                        :error-messages="errors"
                                        dense
                                        outlined
                                        auto-grow>
                              </v-select>
                            </validation-provider>
                          </v-col>
                          <v-col cols="12" sm="12" md="4" v-if="form.taught_class_before == 1">
                            <validation-provider
                              v-slot="{ errors }"
                              name="provide details"
                              vid="provide details"
                              rules="required"
                            >
                              <v-text-field
                                v-model="form.taught_details"
                                clearable
                                clear-icon="mdi-close-circle"
                                label="please provide details including name, location, duration, etc."
                                :error-messages="errors"
                                dense
                                outlined
                                auto-grow
                                no-resize
                              ></v-text-field>
                            </validation-provider>
                          </v-col>
                          <v-col cols="12" sm="12" md="4">
                            <validation-provider
                              v-slot="{ errors }"
                              name="Have you tutored before"
                              vid="Have you tutored before"
                              rules="required"
                            >
                              <v-select v-model="form.tutored_before"
                                        :items="yes_no"
                                        item-text="name"
                                        item-value="id"
                                        clear-icon="mdi-close-circle"
                                        label="Have you tutored before?"
                                        :error-messages="errors"
                                        dense
                                        outlined
                                        auto-grow>
                              </v-select>
                            </validation-provider>
                          </v-col>
                          <v-col cols="12" sm="12" md="4" v-if="form.tutored_before == 1">
                            <validation-provider
                              v-slot="{ errors }"
                              name="how long"
                              vid="how long"
                              rules="required"
                            >
                              <v-text-field
                                v-model="form.how_long"
                                clearable
                                clear-icon="mdi-close-circle"
                                label="how long (in years)?"
                                :error-messages="errors"
                                dense
                                outlined
                                auto-grow
                                no-resize
                              ></v-text-field>
                            </validation-provider>
                          </v-col>
                          <v-col cols="12" sm="12" md="4" v-if="form.tutored_before == 1">
                            <validation-provider
                              v-slot="{ errors }"
                              name="tutored subject"
                              vid="tutored subject"
                              rules="required"
                            >
                              <v-text-field
                                v-model="form.tutored_subject"
                                clearable
                                clear-icon="mdi-close-circle"
                                label="which subjects have you tutored?"
                                :error-messages="errors"
                                dense
                                outlined
                                auto-grow
                                no-resize
                              ></v-text-field>
                            </validation-provider>
                          </v-col>
                          <v-col cols="12" sm="12" md="4">
                            <validation-provider
                              v-slot="{ errors }"
                              name="SAT Score english"
                              vid="SAT Score english"
                              rules="required"
                            >
                              <v-text-field
                                v-model="form.sat_score_english"
                                clearable
                                clear-icon="mdi-close-circle"
                                label="Your SAT Score (English: 200-800 or N/A)?"
                                :error-messages="errors"
                                dense
                                outlined
                                auto-grow
                                no-resize
                              ></v-text-field>
                            </validation-provider>
                          </v-col>
                          <v-col cols="12" sm="12" md="4">
                            <validation-provider
                              v-slot="{ errors }"
                              name="SAT score math"
                              vid="SAT score math"
                              rules="required"
                            >
                              <v-text-field
                                v-model="form.sat_score_math"
                                clearable
                                clear-icon="mdi-close-circle"
                                label="Your SAT Score (Math: 200-800 or N/A)?"
                                :error-messages="errors"
                                dense
                                outlined
                                auto-grow
                                no-resize
                              ></v-text-field>
                            </validation-provider>
                          </v-col>
                          <v-col cols="12" sm="12" md="4">
                            <validation-provider
                              v-slot="{ errors }"
                              name="SAT score total"
                              vid="SAT score total"
                              rules="required"
                            >
                              <v-text-field
                                v-model="form.sat_score_total"
                                clearable
                                clear-icon="mdi-close-circle"
                                label="Your SAT Score (Total: 400-1600 or N/A)?"
                                :error-messages="errors"
                                dense
                                outlined
                                auto-grow
                                no-resize
                              ></v-text-field>
                            </validation-provider>
                          </v-col>
                          <v-col cols="12" sm="12" md="4">
                            <validation-provider
                              v-slot="{ errors }"
                              name="PSAT score"
                              vid="PSAT score"
                              rules="required"
                            >
                              <v-text-field
                                v-model="form.p_sat_score"
                                clearable
                                clear-icon="mdi-close-circle"
                                label="Your PSAT (320-1520) NMSC Selection Index (48-228) score?"
                                :error-messages="errors"
                                dense
                                outlined
                                auto-grow
                                no-resize
                              ></v-text-field>
                            </validation-provider>
                          </v-col>
                          <v-col cols="12" sm="12" md="4">
                            <validation-provider
                              v-slot="{ errors }"
                              name="ACT score english"
                              vid="ACT score english"
                              rules="required"
                            >
                              <v-text-field
                                v-model="form.act_english_score"
                                clearable
                                clear-icon="mdi-close-circle"
                                label="Your ACT Score (English: 1-36 or N/A)?"
                                :error-messages="errors"
                                dense
                                outlined
                                auto-grow
                                no-resize
                              ></v-text-field>
                            </validation-provider>
                          </v-col>
                          <v-col cols="12" sm="12" md="4">
                            <validation-provider
                              v-slot="{ errors }"
                              name="ACT score math"
                              vid="ACT score math"
                              rules="required"
                            >
                              <v-text-field
                                v-model="form.act_math_score"
                                clearable
                                clear-icon="mdi-close-circle"
                                label="Your ACT Score (Math: 1-36 or N/A)?"
                                :error-messages="errors"
                                dense
                                outlined
                                auto-grow
                                no-resize
                              ></v-text-field>
                            </validation-provider>
                          </v-col>
                          <v-col cols="12" sm="12" md="4">
                            <validation-provider
                              v-slot="{ errors }"
                              name="ACT score science"
                              vid="ACT score science"
                              rules="required"
                            >
                              <v-text-field
                                v-model="form.act_science_score"
                                clearable
                                clear-icon="mdi-close-circle"
                                label="Your ACT Score (Science: 1-36 or N/A)?"
                                :error-messages="errors"
                                dense
                                outlined
                                auto-grow
                                no-resize
                              ></v-text-field>
                            </validation-provider>
                          </v-col>
                          <v-col cols="12" sm="12" md="4">
                            <validation-provider
                              v-slot="{ errors }"
                              name="ACT score reading"
                              vid="ACT score reading"
                              rules="required"
                            >
                              <v-text-field
                                v-model="form.act_reading_score"
                                clearable
                                clear-icon="mdi-close-circle"
                                label="Your ACT Score (Reading: 1-36 or N/A)?"
                                :error-messages="errors"
                                dense
                                outlined
                                auto-grow
                                no-resize
                              ></v-text-field>
                            </validation-provider>
                          </v-col>
                          <v-col cols="12" sm="12" md="4">
                            <validation-provider
                              v-slot="{ errors }"
                              name="ACT score total"
                              vid="ACT score total"
                              rules="required"
                            >
                              <v-text-field
                                v-model="form.act_total_score"
                                clearable
                                clear-icon="mdi-close-circle"
                                label="Your ACT Score (TOTAL: 1-36 or N/A)?"
                                :error-messages="errors"
                                dense
                                outlined
                                auto-grow
                                no-resize
                              ></v-text-field>
                            </validation-provider>
                          </v-col>
                          <v-col cols="12" sm="12" md="4">
                            <validation-provider
                              v-slot="{ errors }"
                              name="AP score"
                              vid="AP score"
                              rules="required"
                            >
                              <v-text-field
                                v-model="form.ap_exam_scores"
                                clearable
                                clear-icon="mdi-close-circle"
                                label="AP Exam Scores? (Please use format Subj1: Score1, Subj2: Score2, etc. or N/A)"
                                :error-messages="errors"
                                dense
                                outlined
                                auto-grow
                                no-resize
                              ></v-text-field>
                            </validation-provider>
                          </v-col>
                          <v-col cols="12" sm="12" md="4">
                            <validation-provider
                              v-slot="{ errors }"
                              name="hsc gpa"
                              vid="hsc gpa"
                              rules="required"
                            >
                              <v-text-field
                                v-model="form.hsc_gpa"
                                clearable
                                clear-icon="mdi-close-circle"
                                label="High School GPA?"
                                :error-messages="errors"
                                dense
                                outlined
                                auto-grow
                                no-resize
                              ></v-text-field>
                            </validation-provider>
                          </v-col>
                          <v-col cols="12" sm="12" md="4">
                            <validation-provider
                              v-slot="{ errors }"
                              name="college gpa"
                              vid="college gpa"
                              rules=""
                            >
                              <v-text-field
                                v-model="form.college_gpa"
                                clearable
                                clear-icon="mdi-close-circle"
                                label="College GPA"
                                :error-messages="errors"
                                dense
                                outlined
                                auto-grow
                                no-resize
                              ></v-text-field>
                            </validation-provider>
                          </v-col>
                          <v-col cols="12" sm="12" md="4">
                            <validation-provider
                              v-slot="{ errors }"
                              name="available"
                              vid="available"
                              rules="required"
                            >
                              <v-select v-model="form.available"
                                        :items="availables"
                                        clear-icon="mdi-close-circle"
                                        label="Are you available during the following?"
                                        :error-messages="errors"
                                        dense
                                        outlined
                                        auto-grow
                                        multiple>
                              </v-select>
                            </validation-provider>
                          </v-col>
                          <v-col cols="12" sm="12" md="4">
                            <validation-provider
                              v-slot="{ errors }"
                              name="How many hours"
                              vid="How many hours"
                              rules="required"
                            >
                              <v-text-field
                                v-model="form.available_hour"
                                clearable
                                clear-icon="mdi-close-circle"
                                label="How many hours can you teach/tutor?"
                                :error-messages="errors"
                                dense
                                outlined
                                auto-grow
                                no-resize
                              ></v-text-field>
                            </validation-provider>
                          </v-col>
                          <v-col cols="12" sm="12" md="4">
                            <validation-provider
                              v-slot="{ errors }"
                              name="preference"
                              vid="preference"
                              rules=""
                            >
                              <v-text-field
                                v-model="form.preference_schedule"
                                clearable
                                clear-icon="mdi-close-circle"
                                label="Do you have any preferences/limitations about your schedule"
                                :error-messages="errors"
                                dense
                                outlined
                                auto-grow
                                no-resize
                              ></v-text-field>
                            </validation-provider>
                          </v-col>
                          <v-col cols="12" sm="12" md="4">
                            <validation-provider
                              v-slot="{ errors }"
                              name="hourly rate"
                              vid="hourly rate"
                              rules=""
                            >
                              <v-text-field
                                v-model="form.hourly_rate"
                                clearable
                                clear-icon="mdi-close-circle"
                                label="What hourly rate would you like? "
                                :error-messages="errors"
                                type="number"
                                step="any"
                                dense
                                outlined
                                auto-grow
                                no-resize
                              ></v-text-field>
                            </validation-provider>
                          </v-col>
                          <v-col cols="12" sm="12" md="4">
                            <validation-provider
                              v-slot="{ errors }"
                              name="willing"
                              vid="willing"
                              rules="required"
                            >
                              <v-select v-model="form.willing_create_lesson"
                                        :items="yes_no"
                                        item-text="name"
                                        item-value="id"
                                        clear-icon="mdi-close-circle"
                                        label="Will you be willing/able to create lesson videos for us"
                                        :error-messages="errors"
                                        dense
                                        outlined
                                        auto-grow>
                              </v-select>
                            </validation-provider>
                          </v-col>
                          <v-col cols="12" sm="12" md="4" v-if="form.willing_create_lesson == 1">
                            <validation-provider
                              v-slot="{ errors }"
                              name="topic"
                              vid="topic"
                              rules="required"
                            >
                              <v-text-field
                                v-model="form.willing_topics"
                                clearable
                                clear-icon="mdi-close-circle"
                                label="what topics would you cover"
                                :error-messages="errors"
                                dense
                                outlined
                                auto-grow
                                no-resize
                              ></v-text-field>
                            </validation-provider>
                          </v-col>
                          <v-col cols="12" sm="12" md="4" v-if="form.willing_create_lesson == 1">
                            <validation-provider
                              v-slot="{ errors }"
                              name="lesson rate"
                              vid="lesson rate"
                              rules="required"
                            >
                              <v-text-field
                                v-model="form.lesson_rate"
                                clearable
                                clear-icon="mdi-close-circle"
                                label="If you have an idea, please let us know how much we should pay for a 5-minute, 10-minute, and 15-minute video? If you can edit the video yourself, how much would you charge for editing? (Write N/A, if not applicable.)"
                                :error-messages="errors"
                                type="number"
                                step="any"
                                dense
                                outlined
                                auto-grow
                                no-resize
                              ></v-text-field>
                            </validation-provider>
                          </v-col>
                          <v-col cols="12" sm="12" md="4">
                            <validation-provider
                              v-slot="{ errors }"
                              name="artical write"
                              vid="artical write"
                              rules="required"
                            >
                              <v-select v-model="form.willing_create_lesson"
                                        :items="yes_no"
                                        item-text="name"
                                        item-value="id"
                                        clear-icon="mdi-close-circle"
                                        label="Would you be able to write articles for our Blogs?"
                                        :error-messages="errors"
                                        dense
                                        outlined
                                        auto-grow>
                              </v-select>
                            </validation-provider>
                          </v-col>
                          <v-col cols="12" sm="12" md="4" v-if="form.artical_write == 1">
                            <validation-provider
                              v-slot="{ errors }"
                              name="artical rate"
                              vid="artical rate"
                              rules=""
                            >
                              <v-text-field
                                v-model="form.artical_rate"
                                clearable
                                clear-icon="mdi-close-circle"
                                label="Artical Write rate"
                                :error-messages="errors"
                                type="number"
                                step="any"
                                dense
                                outlined
                                auto-grow
                                no-resize
                              ></v-text-field>
                            </validation-provider>
                          </v-col>
                          <v-col cols="12" sm="12" md="12">
                            <validation-provider
                              v-slot="{ errors }"
                              name="short description"
                              vid="short description"
                              rules="required"
                            >
                              <v-textarea
                                v-model="form.short_description"
                                clearable
                                clear-icon="mdi-close-circle"
                                label="Please provide a short description about yourself"
                                :error-messages="errors"
                                placeholder="Please provide a short description about yourself THAT WOULD GO ON THE WEBSITE. You could say something like: (What you are doing now. Why do you want to tutor (say if you have a good story)? Do you have prior tutoring experience? What was your ACT/SAT score? Subject SAT scores if applicable? Have you taken AP classes and AP exams? Your extracurricular, interests, and hobbies. For example, please see https://www.prepscholartutors.com/who-we-are and https://prepexpert.com/)"
                                dense
                                outlined
                                auto-grow
                                no-resize
                              ></v-textarea>
                            </validation-provider>
                          </v-col>
                          <v-col cols="12" sm="12" md="6">
                            <validation-provider
                              v-slot="{ errors }"
                              name="permission"
                              vid="permission"
                              rules="required"
                            >
                              <v-radio-group v-model="form.publish_permission" label="Do we have your permission to include your photo in our website?">
                                <v-radio
                                  label="Yes"
                                  value="1"
                                ></v-radio>
                                <v-radio
                                  label="No"
                                  value="0"
                                ></v-radio>
                              </v-radio-group>
                            </validation-provider>
                          </v-col>
                          <v-col cols="12" sm="12" md="6">
                            <validation-provider
                              v-slot="{ errors }"
                              name="agree"
                              vid="agree"
                              rules="required"
                            >
                              <v-radio-group v-model="form.is_agree" label="Do you agree with the following? 1) We reserve the right to verify your SAT/PSAT/ACT scores, GPA, and other credentials. 2) For tutoring, you are expected to schedule the sessions with the students, teach on time, and keep record. If you need to change a scheduled lesson, please give the student an adequate notice.">
                                <v-radio
                                  label="Yes"
                                  value="1"
                                ></v-radio>
                                <v-radio
                                  label="No"
                                  value="0"
                                ></v-radio>
                              </v-radio-group>
                            </validation-provider>
                          </v-col>
                        </v-row>
                      </v-container>
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn
                        color="green darken-1"
                        class="mx-2 white--text"
                        type="submit"
                        :disabled="invalid"
                        :loading="loader.isSubmitting"
                        depressed
                      >
                        {{ 'Submit' }}
                      </v-btn>
                    </v-card-actions>
                  </v-form>
                </validation-observer>
              </v-card>
            </div>
          </div>
        </div>
      </div>

    </section>
    <!-- aboutus page End -->
  </div>
</template>

<script>
import FormImagePreview from '@/components/form/formImagePreview';
import VueTelInputVuetify from "vue-tel-input-vuetify/lib/vue-tel-input-vuetify.vue"
import BreadCrumbs2 from "@/components/common/BreadCrumbs2";
import {mapGetters} from "vuex";
export default {
  name: 'Apply',
  auth:false,
  components:{FormImagePreview,VueTelInputVuetify,BreadCrumbs2},
  data() {
    return {
      pageInfo: {
        pageName: 'Career',
        apiUrl: '/get/all/jobs',
      },
      loader: {isLoading: false, isSubmitting: false, isDeleting: false},
      info:{},
      bindProps:{
        mode: 'international'
      },
      form: {
        'job_id': null,
        'name':'',
        'email':'',
        'phone_number':'',
        'image':null,
        'referral':'',
        'school_college':'',
        'grade_year':'',
        'subjects':[],
        'school_math_subject':'',
        'top_subjects':[],
        'taught_class_before':'',
        'taught_details':'',
        'tutored_before':'',
        'how_long':'',
        'tutored_subject':'',
        'sat_score_english':'',
        'sat_score_math':'',
        'sat_score_total':'',
        'p_sat_score':'',
        'act_english_score':'',
        'act_math_score':'',
        'act_science_score':'',
        'act_reading_score':'',
        'act_total_score':'',
        'ap_exam_scores':'',
        'hsc_gpa':'',
        'college_gpa':'',
        'available':[],
        'available_hour':'',
        'preference_schedule':'',
        'hourly_rate':'',
        'willing_create_lesson':'',
        'willing_topics':'',
        'lesson_rate':'',
        'artical_write':'',
        'artical_rate':'',
        'short_description':'',
        'is_agree':1,
        'cv_file':null,
        'publish_permission':'',
      },
      availables:[
        'Spring',
        'Fall',
        'Winter',
        'Fall/Winter',
      ],
      yes_no:[
        {'id':1, name:'Yes'},
        {'id':0, name:'No'},
      ],
    }
  },
  async mounted() {
    await this.init()
    const payload1 = {apiUrl: '/public/course/categories', stateName:'course_categories'}
    if (!this.course_categories.length) await this.$store.dispatch('common/courseCategory/getItems', payload1)

  },
  computed:{
    ...mapGetters('common/courseCategory',['course_categories']),
  },
  methods: {
    availableCheck(){
      if(this.$moment().format('YYYYMMDD') > this.$moment(this.info.last_date).format('YYYYMMDD')){
        this.$toaster.error('This job application last date is over')
        this.$router.push('/')
      }
    },
    removeImage($emit, formElementName) {
      if (!formElementName) return
      if ($emit && (this.form[formElementName] && this.form[formElementName].length > 1))
        $emit ? this.form[formElementName].splice($emit, 1) : this.form[formElementName] = null
      else this.form[formElementName] = null
    },
    async init(){
      this.loader.isLoading = true
      await this.$axios.get(`/get/single/job/${this.$route.params.id}`).then((response)=>{
        this.info=response.data.data
        this.availableCheck()
      }).catch(()=>{
        this.info={}
      })
      this.loader.isLoading = false
    },
    async submitData(){
      this.loader.isSubmitting = true
      const formData = this.$generateFormData(this.form, false,['subjects','top_subjects','available'])
      formData.append('job_id',this.info.id)
      await this.$axios.post('/public/job/application', formData).then((response) => {
        this.$toaster.success('Thank you for your application')
        this.clear()
        //this.$router.push('/')
      }).catch((error) => {
        if (error.response.status === 422) {
          this.$refs.observer.setErrors(error?.response?.data?.errors)
          Object.keys(error.response.data.errors).map((field) => {
            this.$toaster.error(error.response.data.errors[field][0]);
          });
        } else this.$toaster.error(error.response.data.message);
      }).finally(() => {
        this.loader.isSubmitting = false
      })
    },
    clear() {
      this.$refs.form.reset()
      this.$refs.observer.reset()
    }
  }
}
</script>

<style>


</style>
