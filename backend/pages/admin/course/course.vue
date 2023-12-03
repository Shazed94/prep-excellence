<template>
  <v-container fluid>
    <bread-crumbs
      :page-title="`${pageInfo.pageName}`"
      :items="[{text: 'Mange Course',disabled: true, href: '/admin/course/course'},{text: `${pageInfo.pageName}`}]"
    />

    <v-card>
      <v-card-title>
        <div style="max-width: 200px;" class="mt-3 mr-2">
          <v-autocomplete
            v-model="filter.category_id"
            :items="course_categories"
            label="Select Category"
            item-text="name"
            item-value="id"
            append-icon="mdi-package-variant-closed"
            required
            clearable
            dense
            outlined
          ></v-autocomplete>
        </div>

        <div style="max-width: 200px;" class="mt-3 mr-2">
          <v-autocomplete
            v-model="filter.course_type_id"
            :items="subjects"
            label="Select Subject"
            item-text="name"
            item-value="id"
            append-icon="mdi-package-variant-closed"
            required
            clearable
            dense
            outlined
          ></v-autocomplete>
        </div>
        <div style="max-width: 200px;" class="mt-3 mr-2">
          <v-autocomplete
            v-model="filter.instructor_id"
            :items="only_employees"
            label="Select Instructor"
            item-text="userable.name"
            item-value="id"
            append-icon="mdi-package-variant-closed"
            required
            clearable
            dense
            outlined
          ></v-autocomplete>
        </div>

        <div class="mr-2" style="max-width: 200px">
          <v-menu
            v-model="start_menu"
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="filter.start_date"
                label="Start date"
                append-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                clearable
                v-on="on"
                hide-details
                outlined
                dense
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="filter.start_date"
              @input="start_menu = false"
            ></v-date-picker>
          </v-menu>
        </div>
        <div class="mr-2" style="max-width: 180px">
          <v-menu
            v-model="end_menu"
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="filter.end_date"
                label="End date"
                append-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                clearable
                v-on="on"
                hide-details
                outlined
                dense
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="filter.end_date"
              @input="end_menu = false"
            ></v-date-picker>
          </v-menu>
        </div>
      </v-card-title>
      <v-data-table
        dense
        v-model="selected"
        item-key="id"
        show-select
        :headers="headers"
        :items="courses"
        :options.sync="options"
        :server-items-length="totalItems"
        :search="search"
        :footer-props="footerProps"
        :items-per-page="10"
        class="elevation-1"
        :loading="loader.isLoading"
      >
        <template v-slot:top>
          <v-toolbar
            flat
          >
            <v-toolbar-title>
              <div>
                <export-excel :url="`${pageInfo.apiUrl}export?format=excel&ids=${selectedIds ? selectedIds : ''}`"
                              :file_name="pageInfo.pageName"/>
                <export-csv :url="`${pageInfo.apiUrl}export?format=csv&ids=${selectedIds ? selectedIds : ''}`"
                            :file_name="pageInfo.pageName"/>
                <export-pdf :url="`${pageInfo.apiUrl}export?format=pdf&ids=${selectedIds ? selectedIds : ''}`"
                            :file_name="pageInfo.pageName"/>
              </div>
            </v-toolbar-title>

            <v-divider
              class="mx-4"
              inset
              vertical
            ></v-divider>

            <div class="mr-2">
              <v-text-field
                v-model="search"
                label="Search by course name"
                class="mt-3"
                outlined
                dense
              ></v-text-field>
            </div>
            <v-spacer></v-spacer>
            <v-dialog v-model="dialog" persistent fullscreen>
              <template v-slot:activator="{ on, attrs }">
                <!--                color="primary"-->
                <v-btn v-if="$can('create',pageInfo.permission)"
                       style="background: #01579B"
                       class="mx-2 white--text"
                       icon
                       small
                       v-bind="attrs"
                       v-on="on"
                       @click="createOrUpdate()"
                >
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </template>
              <v-card>
                <validation-observer ref="observer" v-slot="{ invalid }">
                  <v-form ref="form" @submit.prevent="submitData()">
                    <v-card-title class="text-h5"> {{ editIndex > -1 ? 'Update ' : 'Create' }} {{ pageInfo.pageName | capitalize }}</v-card-title>
                    <v-card-text>
                        <v-stepper v-model="e1">
                          <v-stepper-header v-if="editMode">
                            <v-stepper-step v-for="(st,key) in steps_edit_mode"
                              :key="key"
                              :complete="e1 > (key+1)"
                              :step="key+1"
                              :rules="[value => !!st.valid]"
                            >
                              {{  st.name }}
                            </v-stepper-step>
                            <v-divider></v-divider>
                          </v-stepper-header>
                          <v-stepper-header v-else>
                            <v-stepper-step v-for="(st,key) in steps"
                                            :key="key"
                                            :complete="e1 > (key+1)"
                                            :step="key+1"
                                            :rules="[value => !!st.valid]"
                            >
                              {{  st.name }}
                            </v-stepper-step>
                            <v-divider></v-divider>
                          </v-stepper-header>
                          <v-stepper-items>
                            <v-stepper-content step="1">
                              <validation-observer tag="form" ref="observer1" v-slot="{ invalid2, valid }">
                                <v-row dense>
                                  <v-col cols="12" xs="12" md="12">
                                    <validation-provider
                                      v-slot="{ errors }"
                                      name="title"
                                      vid="name"
                                      rules="required|max:100"
                                    >
                                      <v-text-field
                                        v-model="form.name"
                                        label="Title"
                                        :error-messages="errors"
                                        dense
                                        outlined
                                        auto-grow
                                        no-resize
                                      ></v-text-field>
                                    </validation-provider>
                                  </v-col>
                                  <v-col cols="12" xs="12" md="6">
                                    <validation-provider
                                      v-slot="{ errors }"
                                      name="category"
                                      vid="category"
                                      rules="required">
                                      <v-autocomplete
                                        v-model="form.category_ids"
                                        :items="course_categories"
                                        :error-messages="errors"
                                        item-text="name"
                                        item-value="id"
                                        label="Categories"
                                        multiple
                                        dense
                                        clearable
                                        hide-details="auto"
                                        outlined></v-autocomplete>
                                    </validation-provider>
                                    <add-category></add-category>
                                  </v-col>
                                  <v-col cols="12" xs="12" md="6">
                                    <validation-provider
                                      v-slot="{ errors }"
                                      name="subject"
                                      vid="subject"
                                      rules="required">
                                      <v-autocomplete
                                        v-model="form.course_type_id"
                                        :items="subjects"
                                        :error-messages="errors"
                                        item-text="name"
                                        item-value="id"
                                        label="Subject"
                                        dense
                                        clearable
                                        hide-details="auto"
                                        outlined></v-autocomplete>
                                    </validation-provider>
                                    <add-subject></add-subject>
                                  </v-col>

                                  <v-col cols="12" xs="12" md="4">
                                    <validation-provider
                                      v-slot="{ errors }"
                                      name="batch"
                                      vid="batch"
                                      rules="max:100"
                                    >
                                      <v-text-field
                                        v-model="form.batch"
                                        label="Batch"
                                        :error-messages="errors"
                                        dense
                                        outlined
                                        auto-grow
                                        no-resize
                                      ></v-text-field>
                                    </validation-provider>
                                  </v-col>
                                  <v-col cols="12" xs="12" md="4">
                                    <validation-provider
                                      v-slot="{ errors }"
                                      name="level"
                                      vid="level"
                                      rules="max:100"
                                    >
                                      <v-text-field
                                        v-model="form.level"
                                        label="Level"
                                        :error-messages="errors"
                                        dense
                                        outlined
                                        auto-grow
                                        no-resize
                                      ></v-text-field>
                                    </validation-provider>
                                  </v-col>
                                  <v-col cols="12" xs="12" md="4">
                                    <validation-provider
                                      v-slot="{ errors }"
                                      name="amount"
                                      vid="amount"
                                      rules="required|min_value:1"
                                    >
                                      <v-text-field
                                        v-model="form.amount"
                                        label="Amount"
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
                                  <v-col cols="12" xs="12" md="4">
                                    <form-image-preview
                                      :existingImages="image"
                                      :image-props="form.image"
                                      @removeImage="removeImage($emit, 'image')"
                                    />
                                    <validation-provider
                                      v-slot="{ errors }"
                                      name="image"
                                      vid="image"
                                      :rules="editMode?'':'required'"
                                    >
                                      <v-file-input
                                        v-model="form.image"
                                        label="Image"
                                        filled
                                        prepend-icon="mdi-camera"
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
                                  <v-col cols="12" xs="12" md="12"></v-col>
                                  <v-col cols="12" xs="12" md="6">
                                    <validation-provider
                                      v-slot="{ errors }"
                                      name="duration"
                                      vid="course_location"
                                      rules="required|max:191"
                                    >
                                      <v-text-field
                                        v-model="form.course_location"
                                        label="Course Location"
                                        :error-messages="errors"
                                        dense
                                        outlined
                                        auto-grow
                                        no-resize
                                      ></v-text-field>
                                    </validation-provider>
                                  </v-col>
                                  <v-col cols="12" xs="12" md="6">
                                    <validation-provider
                                      v-slot="{ errors }"
                                      name="class time"
                                      vid="class_time"
                                      rules="required|max:191"
                                    >
                                      <v-text-field
                                        v-model="form.class_time"
                                        label="Class Time"
                                        :error-messages="errors"
                                        dense
                                        outlined
                                        auto-grow
                                        no-resize
                                      ></v-text-field>
                                    </validation-provider>
                                  </v-col>
                                </v-row>
                                <v-btn
                                  color="secondary"
                                  @click="clear1()"
                                  depressed
                                >
                                  Clear
                                </v-btn>
                                <v-btn
                                  color="primary"
                                  @click="val(0,'observer1')"
                                  :disabled="invalid2"
                                  depressed
                                >
                                  Continue
                                </v-btn>
                              </validation-observer>
                            </v-stepper-content>

                            <v-stepper-content v-if="!editMode"
                              step="2">
                              <validation-observer ref="observer2" v-slot="{ invalid2 }">
                                <v-row dense>
                                  <v-col cols="12" md="6">
                                    <v-row dense>
                                      <v-col cols="12" xs="12" md="4">
                                        <validation-provider
                                          v-slot="{ errors }"
                                          name="duration"
                                          vid="duration_in_week"
                                          rules="required|min_value:1"
                                        >
                                          <v-text-field
                                            v-model="form.duration_in_week"
                                            label="Duration(Week)"
                                            :error-messages="errors"
                                            type="number"
                                            dense
                                            outlined
                                            auto-grow
                                            no-resize
                                          ></v-text-field>
                                        </validation-provider>
                                      </v-col>
                                      <v-col cols="12" xs="12" md="4">
                                        <validation-provider
                                          v-slot="{ errors }"
                                          name="start date"
                                          vid="start_date"
                                          rules="required"
                                        >
                                          <v-text-field
                                            v-model="form.start_date"
                                            label="Start Date"
                                            :error-messages="errors"
                                            dense
                                            type="date"
                                            outlined
                                            auto-grow
                                            no-resize
                                          ></v-text-field>
                                        </validation-provider>
                                      </v-col>
                                      <v-col cols="12" xs="12" md="4">
                                        <validation-provider
                                          v-slot="{ errors }"
                                          name="end date"
                                          vid="end_date"
                                          rules="required"
                                        >
                                          <v-text-field
                                            v-model="form.end_date"
                                            label="End Date"
                                            :error-messages="errors"
                                            dense
                                            type="date"
                                            outlined
                                            auto-grow
                                            no-resize
                                          ></v-text-field>
                                        </validation-provider>
                                      </v-col>
                                      <v-col cols="12" xs="12" md="3">
                                        <validation-provider
                                          v-slot="{ errors }"
                                          name="Schedule Type"
                                          vid="Schedule Type"
                                          rules="required"
                                        >
                                          <v-select
                                            v-model.number="form.course_type"
                                            :items="schedule_types"
                                            :error-messages="errors"
                                            label="Schedule Type"
                                            item-text="name"
                                            item-value="id"
                                            dense
                                            outlined
                                            auto-grow
                                            no-resize
                                          ></v-select>
                                        </validation-provider>
                                      </v-col>
                                      <v-col v-if="!editMode" cols="12" xs="12" md="3">
                                        <validation-provider
                                          v-slot="{ errors }"
                                          name="course length"
                                          vid="course_length_in_hour"
                                          rules="required|min_value:1"
                                        >
                                          <v-text-field
                                            v-model="course_length_in_hour"
                                            label="course length(hour)"
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
                                      <v-col cols="12" xs="12" md="3">
                                        <validation-provider
                                          v-slot="{ errors }"
                                          name="duration"
                                          vid="duration_in_hour"
                                          rules="required|min_value:1"
                                        >
                                          <v-text-field
                                            v-model="form.duration_in_hour"
                                            label="Duration(hour)"
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
                                      <v-col cols="12" xs="12" md="3">
                                        <validation-provider
                                          v-slot="{ errors }"
                                          name="instructor"
                                          vid="instructor"
                                          rules="required">
                                          <v-autocomplete
                                            @change="selectedEmployeeFind()"
                                            v-model="form.employee_ids"
                                            :items="subject_wise_employees"
                                            :error-messages="errors"
                                            item-text="userable.name"
                                            item-value="id"
                                            label="Instructors"
                                            multiple
                                            dense
                                            clearable
                                            hide-details="auto"
                                            outlined></v-autocomplete>
                                        </validation-provider>
                                      </v-col>
                                      <!---- schedule view button ---->
<!--                                      <v-col cols="12" xs="12" md="3">
                                        <v-btn
                                          color="secondary"
                                          @click="dialog3=true"
                                        >
                                          View Schedule
                                        </v-btn>
                                      </v-col>-->
                                      <template v-if="!editMode">
                                        <v-col cols="12" xs="12" md="12"></v-col>
                                        <template v-if="form.course_type === 1">
                                          <v-col cols="12" xs="12" md="4">
                                            <validation-provider
                                              v-slot="{ errors }"
                                              name="start time"
                                              vid="start_time"
                                              rules="required"
                                            >
                                              <v-text-field
                                                v-model="start_time"
                                                label="Start At"
                                                type="time"
                                                :error-messages="errors"
                                                dense
                                                outlined
                                                auto-grow
                                                no-resize
                                              ></v-text-field>
                                            </validation-provider>
                                          </v-col>
                                          <v-col cols="12" xs="12" md="4">
                                            <validation-provider
                                              v-slot="{ errors }"
                                              name="end time"
                                              vid="end_time"
                                              rules="required"
                                            >
                                              <v-text-field
                                                v-model="end_time"
                                                label="End At"
                                                type="time"
                                                :error-messages="errors"
                                                dense
                                                outlined
                                                auto-grow
                                                no-resize
                                              ></v-text-field>
                                            </validation-provider>
                                          </v-col>
                                          <v-col cols="12" xs="12" md="4">
                                            <validation-provider
                                              v-slot="{ errors }"
                                              name="test days"
                                              vid="test days"
                                              rules=""
                                            >
                                              <v-autocomplete
                                                @change="scheduleMake()"
                                                v-model="selected_exam_days"
                                                :items="exam_days"
                                                :error-messages="errors"
                                                item-text="id"
                                                item-value="id"
                                                outlined
                                                dense
                                                chips
                                                small-chips
                                                label="Test Days"
                                                multiple
                                              >
                                                <template v-slot:item="data">
                                                  <template v-if="typeof data.item !== 'object'">
                                                    <v-list-item-content v-text="data.item"></v-list-item-content>
                                                  </template>
                                                  <template v-else>
                                                    <v-list-item-content>
                                                      <v-list-item-title v-html="data.item.id"></v-list-item-title>
                                                      <v-list-item-title v-html="moment(data.item.date).format('MM-DD-YYYY')"></v-list-item-title>
                                                      <v-list-item-subtitle v-html="data.item.day"></v-list-item-subtitle>
                                                    </v-list-item-content>
                                                  </template>
                                                </template>
                                              </v-autocomplete>
                                            </validation-provider>
                                          </v-col>
                                          <v-col cols="12" md="12" xs="12">
                                            <label>Input First Week Schedule</label>
                                            <v-row dense v-for="(exp,e) in regulars" :key="e">
                                              <v-col cols="12" xs="12" md="3">
                                                <validation-provider
                                                  v-slot="{ errors }"
                                                  :name="'w_date'+e"
                                                  :vid="'w_date'+e"
                                                  rules="required"
                                                >
                                                  <v-text-field
                                                    v-model="regulars[e].date"
                                                    :error-messages="errors"
                                                    label="Date"
                                                    type="date"
                                                    dense
                                                    outlined
                                                    auto-grow
                                                    no-resize
                                                  ></v-text-field>
                                                </validation-provider>
                                              </v-col>
                                              <v-col cols="12" xs="12" md="3">
                                                <validation-provider
                                                  v-slot="{ errors }"
                                                  :name="'day'+e"
                                                  :vid="'day'+e"
                                                  rules="required|max:191"
                                                >
                                                  <v-autocomplete
                                                    v-model="regulars[e].day"
                                                    :items="days"
                                                    :error-messages="errors"
                                                    item-text="name"
                                                    item-value="name"
                                                    label="Day"
                                                    dense
                                                    clearable
                                                    hide-details="auto"
                                                    outlined></v-autocomplete>
                                                </validation-provider>
                                              </v-col>
                                              <v-col cols="12" xs="12" md="3">
                                                <validation-provider
                                                  v-slot="{ errors }"
                                                  :name="'start time'+e"
                                                  :vid="'start_time'+e"
                                                  rules="required"
                                                >
                                                  <v-text-field
                                                    v-model="regulars[e].start_time"
                                                    label="Start At"
                                                    type="time"
                                                    :error-messages="errors"
                                                    dense
                                                    outlined
                                                    auto-grow
                                                    no-resize
                                                  ></v-text-field>
                                                </validation-provider>
                                              </v-col>
                                              <v-col cols="12" xs="12" md="3">
                                                <validation-provider
                                                  v-slot="{ errors }"
                                                  :name="'end time'+e"
                                                  :vid="'end_time'+e"
                                                  rules="required"
                                                >
                                                  <v-text-field
                                                    v-model="regulars[e].end_time"
                                                    label="End At"
                                                    type="time"
                                                    :error-messages="errors"
                                                    dense
                                                    outlined
                                                    auto-grow
                                                    no-resize
                                                  ></v-text-field>
                                                </validation-provider>
                                              </v-col>
                                              <v-col cols="12" xs="12" md="3">
                                                <validation-provider
                                                  v-slot="{ errors }"
                                                  :name="'instructor'+e"
                                                  :vid="'instructor'+e"
                                                  rules="required">
                                                  <v-autocomplete
                                                    v-model="regulars[e].employee_id"
                                                    :items="selected_employees"
                                                    :error-messages="errors"
                                                    item-text="userable.name"
                                                    item-value="id"
                                                    label="Instructors"
                                                    dense
                                                    clearable
                                                    hide-details="auto"
                                                    outlined></v-autocomplete>
                                                </validation-provider>
                                              </v-col>
                                              <v-col cols="12" xs="12" md="3">
                                                <validation-provider
                                                  v-slot="{ errors }"
                                                  :name="'topic name'+e"
                                                  :vid="'topic name'+e"
                                                  rules="required"
                                                >
                                                  <v-text-field
                                                    v-model="regulars[e].course_name"
                                                    label="Topic"
                                                    :error-messages="errors"
                                                    dense
                                                    outlined
                                                    auto-grow
                                                    no-resize
                                                  ></v-text-field>
                                                </validation-provider>
                                              </v-col>
                                              <v-col cols="12" xs="12" md="2">
                                                <v-btn color="error" @click="spliceRegular(e)" x-small fab v-if="regulars.length > 1">
                                                  <v-icon>mdi-delete</v-icon>
                                                </v-btn>
                                                <v-btn color="success" @click="addRegular()" x-small fab v-if="regulars.length === (e+1) && regulars.length < 7">
                                                  <v-icon>mdi-plus</v-icon>
                                                </v-btn>
                                              </v-col>
                                              <v-divider></v-divider>
                                            </v-row>
                                          </v-col>
                                        </template>
                                        <template v-if="form.course_type === 2">
                                          <v-col cols="12" md="12" xs="12">
                                            <label>Input First Week Schedule</label>
                                            <v-row class="border" dense v-for="(exp,e) in one_on_ones" :key="e">
                                              <v-col cols="12" xs="12" md="3">
                                                <validation-provider
                                                  v-slot="{ errors }"
                                                  :name="'w_date'+e"
                                                  :vid="'w_date'+e"
                                                  rules="required"
                                                >
                                                  <v-text-field
                                                    v-model="one_on_ones[e].date"
                                                    :error-messages="errors"
                                                    label="Date"
                                                    type="date"
                                                    dense
                                                    outlined
                                                    auto-grow
                                                    no-resize
                                                  ></v-text-field>
                                                </validation-provider>
                                              </v-col>
                                              <v-col cols="12" xs="12" md="3">
                                                <validation-provider
                                                  v-slot="{ errors }"
                                                  :name="'start time'+e"
                                                  :vid="'start_time'+e"
                                                  rules="required"
                                                >
                                                  <v-text-field
                                                    v-model="one_on_ones[e].start_time"
                                                    label="Start At"
                                                    type="time"
                                                    :error-messages="errors"
                                                    dense
                                                    outlined
                                                    auto-grow
                                                    no-resize
                                                  ></v-text-field>
                                                </validation-provider>
                                              </v-col>
                                              <v-col cols="12" xs="12" md="3">
                                                <validation-provider
                                                  v-slot="{ errors }"
                                                  :name="'end time'+e"
                                                  :vid="'end_time'+e"
                                                  rules="required"
                                                >
                                                  <v-text-field
                                                    v-model="one_on_ones[e].end_time"
                                                    label="End At"
                                                    type="time"
                                                    :error-messages="errors"
                                                    dense
                                                    outlined
                                                    auto-grow
                                                    no-resize
                                                  ></v-text-field>
                                                </validation-provider>
                                              </v-col>
                                              <v-col cols="12" xs="12" md="3">
                                                <validation-provider
                                                  v-slot="{ errors }"
                                                  :name="'instructor'+e"
                                                  :vid="'instructor'+e"
                                                  rules="required">
                                                  <v-autocomplete
                                                    v-model="one_on_ones[e].employee_id"
                                                    :items="selected_employees"
                                                    :error-messages="errors"
                                                    item-text="userable.name"
                                                    item-value="id"
                                                    label="Instructors"
                                                    dense
                                                    clearable
                                                    hide-details="auto"
                                                    outlined></v-autocomplete>
                                                </validation-provider>
                                              </v-col>
                                              <v-col cols="12" xs="12" md="4">
                                                <validation-provider
                                                  v-slot="{ errors }"
                                                  :name="'topic'+e"
                                                  :vid="'topic'+e"
                                                  rules="required"
                                                >
                                                  <v-text-field
                                                    v-model="one_on_ones[e].course_name"
                                                    label="Topic"
                                                    :error-messages="errors"
                                                    dense
                                                    outlined
                                                    auto-grow
                                                    no-resize
                                                  ></v-text-field>
                                                </validation-provider>
                                              </v-col>
                                              <v-col cols="12" xs="12" md="4">
                                                <validation-provider
                                                  v-slot="{ errors }"
                                                  :name="'classes'+e"
                                                  :vid="'classes'+e"
                                                  rules="required"
                                                >
                                                  <v-text-field
                                                    v-model="one_on_ones[e].classes"
                                                    label="Classes"
                                                    :error-messages="errors"
                                                    dense
                                                    outlined
                                                    auto-grow
                                                    no-resize
                                                  ></v-text-field>
                                                </validation-provider>
                                              </v-col>
                                              <v-col cols="12" xs="12" md="2">
                                                <v-btn color="error" @click="spliceOne(e)" x-small fab v-if="one_on_ones.length > 1">
                                                  <v-icon>mdi-delete</v-icon>
                                                </v-btn>
                                                <v-btn color="success" @click="addOne()" x-small fab v-if="one_on_ones.length === (e+1) && one_on_ones.length < 7">
                                                  <v-icon>mdi-plus</v-icon>
                                                </v-btn>
                                              </v-col>
                                            </v-row>
                                          </v-col>
                                        </template>
                                      </template>
                                    </v-row>
                                  </v-col>
                                  <v-col cols="12" md="6">
                                    <employee-schedule :start_date="form.start_date" :end_date="form.end_date" :employee_ids="form.employee_ids" @closeEmpSchedule="closeEmpSchedule"></employee-schedule>
                                  </v-col>
                                </v-row>
                                <v-btn
                                  color="primary"
                                  @click="e1 = 1"
                                >
                                  Back
                                </v-btn>
                                <v-btn
                                  color="secondary"
                                  @click="clear2()"
                                  depressed
                                >
                                  Clear
                                </v-btn>
                                <v-btn
                                  color="primary"
                                  @click="val(1,'observer2')"
                                  :disabled="invalid2"
                                  depressed
                                >
                                  Continue
                                </v-btn>
                              </validation-observer>
                            </v-stepper-content>

                            <v-stepper-content v-if="!editMode"
                              step="3">
                              <!--    course schedule          -->
                              <validation-observer ref="observer3" v-slot="{ invalid2 }">

                                  <!---- schedule view button ---->
<!--                                  <v-col cols="12" xs="12" md="3">
                                    <v-btn
                                      color="secondary"
                                      @click="dialog3=true"
                                    >
                                      View Schedule
                                    </v-btn>
                                  </v-col>-->
                                <v-row dense>
                                  <v-col cols="12" md="6">
                                    <v-row class="border" dense v-for="(exp,e) in form.course_schedules" :key="e">
                                      <v-col cols="12" xs="12" md="4">
                                        <validation-provider
                                          v-slot="{ errors }"
                                          name="date"
                                          :vid="'date'+e"
                                          rules="required|max:191"
                                        >
                                          <v-text-field
                                            v-model="form.course_schedules[e].date"
                                            :error-messages="errors"
                                            label="Date"
                                            type="date"
                                            dense
                                            hide-details="auto"
                                            outlined
                                          ></v-text-field>
                                        </validation-provider>
                                      </v-col>
                                      <v-col cols="12" xs="12" md="4">
                                        <validation-provider
                                          v-slot="{ errors }"
                                          name="day"
                                          :vid="'day'+e"
                                          rules="required|max:100"
                                        >
                                          <v-autocomplete
                                            v-model="form.course_schedules[e].day"
                                            :items="days"
                                            :error-messages="errors"
                                            item-text="name"
                                            item-value="name"
                                            label="Day"
                                            dense
                                            clearable
                                            hide-details="auto"
                                            outlined></v-autocomplete>
                                        </validation-provider>
                                      </v-col>
                                      <v-col cols="12" xs="12" md="4">
                                        <validation-provider
                                          v-slot="{ errors }"
                                          name="start time"
                                          :vid="'start_time'+e"
                                          rules=""
                                        >
                                          <v-text-field
                                            v-model="form.course_schedules[e].start_time"
                                            :error-messages="errors"
                                            label="Start Time"
                                            required
                                            type="time"
                                            dense
                                            hide-details="auto"
                                            outlined
                                          ></v-text-field>
                                        </validation-provider>
                                      </v-col>
                                      <v-col cols="12" xs="12" md="4">
                                        <validation-provider
                                          v-slot="{ errors }"
                                          name="end time"
                                          :vid="'end_time'+e"
                                          rules="required"
                                        >
                                          <v-text-field
                                            v-model="form.course_schedules[e].end_time"
                                            :error-messages="errors"
                                            label="End time"
                                            required
                                            type="time"
                                            dense
                                            hide-details="auto"
                                            outlined
                                          ></v-text-field>
                                        </validation-provider>
                                      </v-col>
                                      <v-col cols="12" xs="12" md="4">
                                        <validation-provider
                                          v-slot="{ errors }"
                                          name="topic"
                                          :vid="'topic'+e"
                                          rules="required"
                                        >
                                          <v-text-field
                                            v-model="form.course_schedules[e].course_name"
                                            label="Topic"
                                            :error-messages="errors"
                                            dense
                                            outlined
                                            auto-grow
                                            no-resize
                                          ></v-text-field>
                                        </validation-provider>
                                      </v-col>
                                      <v-col cols="12" xs="12" md="4">
                                        <validation-provider
                                          v-slot="{ errors }"
                                          name="classes"
                                          :vid="'classes'+e"
                                          rules="required"
                                        >
                                          <v-text-field
                                            v-model="form.course_schedules[e].classes"
                                            :error-messages="errors"
                                            label="classes"
                                            dense
                                            outlined
                                            auto-grow
                                            no-resize
                                          ></v-text-field>
                                        </validation-provider>
                                      </v-col>
                                      <v-col cols="12" xs="12" md="4">
                                        <validation-provider
                                          v-slot="{ errors }"
                                          name="instructor"
                                          :vid="'instructor'+e"
                                          rules="required">
                                          <v-autocomplete
                                            v-model="form.course_schedules[e].employee_id"
                                            :items="selected_employees"
                                            :error-messages="errors"
                                            item-text="userable.name"
                                            item-value="id"
                                            label="Instructors"
                                            dense
                                            clearable
                                            hide-details="auto"
                                            outlined></v-autocomplete>
                                        </validation-provider>
                                      </v-col>
                                      <v-col cols="12" xs="12" md="2">
                                        <v-btn color="error" @click="spliceWE(e)" x-small fab v-if="form.course_schedules.length > 1">
                                          <v-icon>mdi-delete</v-icon>
                                        </v-btn>
                                      </v-col>
                                      <v-col cols="12" xs="12" md="12"></v-col>
                                      <v-col cols="12" xs="12" md="2">
                                        <v-btn color="success" @click="addWE()" x-small fab v-if="form.course_schedules.length === (e+1)">
                                          <v-icon>mdi-plus</v-icon>
                                        </v-btn>
                                      </v-col>
                                    </v-row>
                                  </v-col>
                                  <v-col cols="12" md="6">
                                    <employee-schedule :start_date="form.start_date" :end_date="form.end_date" :employee_ids="form.employee_ids" @closeEmpSchedule="closeEmpSchedule"></employee-schedule>
                                  </v-col>
                                </v-row>
                                <v-btn
                                  color="primary"
                                  @click="e1 = 2"
                                >
                                  Back
                                </v-btn>
                                <v-btn
                                  color="primary"
                                  @click="val(2,'observer3')"
                                >
                                  Continue
                                </v-btn>
                              </validation-observer>
                            </v-stepper-content>

                            <v-stepper-content :step="editMode ? 2 : 4">
                              <v-col cols="12" xs="12" md="12">
                                <validation-provider
                                  v-slot="{ errors }"
                                  name="course outline"
                                  vid="course_outline"
                                  rules=""
                                >
                                  <vue-editor v-model="form.course_outline"
                                              label="Course Outline"
                                              :error-messages="errors"
                                              dense
                                              outlined
                                              counter
                                              rows="3">

                                  </vue-editor>
                                </validation-provider>
                              </v-col>
                              <v-btn
                                color="primary"
                                @click="e1 = editMode ? 1 : 3"
                              >
                                Back
                              </v-btn>
                            </v-stepper-content>
                          </v-stepper-items>
                        </v-stepper>
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
                        {{ editIndex > -1 ? 'Update' : 'Save' }}
                      </v-btn>
                      <v-btn class="mr-2 error darken-1 white--text" depressed @click="closeModal">Close</v-btn>
                    </v-card-actions>
                  </v-form>
                </validation-observer>
              </v-card>
            </v-dialog>
          </v-toolbar>
        </template>
        <template v-slot:item.image="{item }">
          <img v-if="item.image" :src="item.image" width="50" height="50" alt=""/>
        </template>
        <template v-slot:item.created_at="{item }">
          {{ moment(item.created_at).format('MM-DD-YYYY') }}
        </template>
        <template v-slot:item.categories="{item }">
          <ul>
            <li v-for="(im,k) in item.courseCategories" :key="k">{{ im.name}}</li>
          </ul>
        </template>
        <template v-slot:item.instructor="{item }">
          <ul>
            <li v-for="(im,k) in item.employees" :key="k">{{ im.userable?im.userable.name:''}}</li>
          </ul>
        </template>
        <template v-slot:item.status="{ index, item }">
          <v-switch v-if="$can('status change',pageInfo.permission)"
                    class="pa-0 ma-0"
                    hide-details
                    :value="true"
                    :input-value="item.is_active"
                    @change="toggleStatusChange(index, $event !== null, $event, item.id, state.name, state.store_name)">
          </v-switch>
        </template>

        <template v-slot:item.actions="{index, item }">
          <course-preview :course="item"></course-preview>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn x-small class="mr-1 mb-1 mt-1 accent" v-bind="attrs"
                     v-on="on" fab @click="viewSchedule(item)">
                <v-icon>mdi-clock-outline</v-icon>
              </v-btn>
            </template>
              <span>Schedule</span>
          </v-tooltip>
          <v-tooltip bottom v-if="$can('create',pageInfo.permission)">
            <template v-slot:activator="{ on, attrs }">
              <v-btn x-small class="mr-1 mb-1 accent" color="green" v-bind="attrs"
                     v-on="on" fab @click="clone(item)">
                <v-icon>mdi-content-copy</v-icon>
              </v-btn>
            </template>
            <span>Clone</span>
          </v-tooltip>
          <v-tooltip bottom v-if="$can('edit',pageInfo.permission)">
            <template v-slot:activator="{ on, attrs }">
              <v-btn x-small class="mr-1 mb-1 accent" v-bind="attrs"
                     v-on="on" fab @click="createOrUpdate(item)" >
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
            </template>
            <span>Edit</span>
          </v-tooltip>
          <add-more-schedule :course="item"></add-more-schedule>
          <v-tooltip bottom v-if="$can('remove',pageInfo.permission)">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="error" class="mt-1" x-small v-bind="attrs"
                     v-on="on" fab @click="deleteItem(item, index, state.store_name)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </template>
            <span>Remove</span>
          </v-tooltip>
        </template>
      </v-data-table>
      <v-dialog v-model="dialog2" persistent max-width="1300">
          <course-schedule :selectedItem="selectedItem" @closeSchedule="closeSchedule"></course-schedule>
      </v-dialog>
      <v-dialog v-model="dialog3" max-width="800">
        <employee-schedule :start_date="form.start_date" :end_date="form.end_date" :employee_ids="form.employee_ids" @closeEmpSchedule="closeEmpSchedule"></employee-schedule>
      </v-dialog>
    </v-card>
  </v-container>
</template>

<script>
import ExportExcel from '@/components/common/ExportExcel'
import ExportCsv from '@/components/common/ExportCsv'
import ExportPdf from '@/components/common/ExportPdf'
import BreadCrumbs from "~/components/common/BreadCrumbs";
import {common as commonMixin} from "@/mixins/common";
import AddSubject from "@/components/admin/course/AddSubject";
import AddCategory from "@/components/admin/course/AddCategory";
import ReportHead from "@/components/report/ReportHead";
import CoursePreview from "@/components/admin/course/CoursePreview";
import AddMoreSchedule from "@/components/admin/course/AddMoreSchedule";
import CourseSchedule from "@/components/admin/course/CourseSchedule";
import EmployeeSchedule from "@/components/admin/course/EmployeeSchedule";
import {mapGetters} from "vuex";
import moment from "moment-timezone";
const permission = 'Course'
const stateName = 'courses'
const storeName='admin/course'

export default {
  name: 'Course',
  head: {
    title: 'Course',
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
    subject: permission
  },
  components: {BreadCrumbs, ExportPdf, ExportCsv, ExportExcel,
    AddSubject, AddCategory, ReportHead, CoursePreview, AddMoreSchedule,CourseSchedule,EmployeeSchedule },
  mixins: [commonMixin],
  data() {
    return {
      itemKeys: new WeakMap(),
      currentItemKey: 0,
      moment,
      pageInfo: {
        pageName: 'Course',
        apiUrl: '/course/',
        permission
      },
      state: {
        name: stateName,
        store_name: storeName,
      },
      e1: 1,
      selected: [],
      selectedItem:{},
      options: {},
      dialog: false,
      dialog2: false,
      dialog3: false,
      editIndex: -1,
      editMode:false,
      loader: {isLoading: false, isSubmitting: false, isDeleting: false},
      image:null,
      start_time:null,
      end_time:null,
      exam_days:[],
      selected_exam_days:[],
      exam_counter:0,
      class_counter:0,
      selected_employees:[],
      course_length_in_hour:0,
      form: {
        course_type_id:null,
        course_type:1,
        category_ids:[],
        employee_ids:[],
        name: null,
        batch: null,
        level: null,
        image: null,
        amount: 0,
        start_date: null,
        end_date: null,
        duration_in_hour: null,
        duration_in_week: null,
        course_location: null,
        class_time: null,
        course_outline: null,
        course_schedules:[
          {employee_id:null, date:null, day:null, start_time:null, end_time:null, classes:'', course:'', is_exam:false}
        ],
      },
      search: '',
      timeout: null,
      headers: [
        {
          text: 'SL',
          align: 'start',
          value: 'id'
        },
        {
          text: 'Image',
          align: 'start',
          value: 'image'
        },
        {
          text: 'Batch',
          align: 'start',
          value: 'batch'
        },
        {
          text: 'Subject',
          align: 'start',
          value: 'courseType.name'
        },
        {
          text: 'Name',
          align: 'start',
          value: 'name'
        },
        {
          text: 'Amount',
          align: 'start',
          value: 'amount'
        },
        {
          text: 'Categories',
          align: 'start',
          value: 'categories'
        },
        {
          text: 'Instructor',
          align: 'start',
          value: 'instructor'
        },
        {
          text: 'Start Date',
          align: 'start',
          value: 'start_date'
        },
        {
          text: 'End Date',
          align: 'start',
          value: 'end_date'
        },
        {
          text: 'Duration(h)',
          align: 'start',
          value: 'duration_in_hour'
        },
        {
          text: 'Created At',
          align: 'start',
          value: 'created_at'
        },
        /*{
          text: 'Enrolled',
          align: 'start',
          value: 'enrolled'
        },*/
        {
          text: 'Status',
          value: 'status'
        },
        {text: 'Actions', value: 'actions', sortable: false}
      ],
      footerProps: {
        itemsPerPageOptions: [10,20, 50, 100, 500]
      },
      start_menu: false,
      end_menu: false,
      filter: {
        category_id: '',
        course_type_id: '',
        instructor_id: '',
        start_date: '',
        end_date: '',
      },
      steps: [
        {name: "Course Basic", valid: true},
        {name: "Schedule Setup", valid: true},
        {name: "Schedule Modify", valid: true},
        {name: "Course Outline", valid: true},
      ],
      steps_edit_mode: [
        {name: "Course Basic", valid: true},
        {name: "Course Outline", valid: true},
      ],
      one_on_ones:[
        {employee_id:null, date:null, start_time:null, end_time:null, classes:'', course_name:'', is_exam:false}
      ],
      regulars:[
        {employee_id:null, date:null, day:null, start_time:null, end_time:null, classes:'', course_name:'', is_exam:false},
        {employee_id:null, date:null, day:null, start_time:null, end_time:null, classes:'', course_name:'', is_exam:false},
        {employee_id:null, date:null, day:null, start_time:null, end_time:null, classes:'', course_name:'', is_exam:false},
        {employee_id:null, date:null, day:null, start_time:null, end_time:null, classes:'', course_name:'', is_exam:false},
        {employee_id:null, date:null, day:null, start_time:null, end_time:null, classes:'', course_name:'', is_exam:false},
        {employee_id:null, date:null, day:null, start_time:null, end_time:null, classes:'', course_name:'', is_exam:false},
        {employee_id:null, date:null, day:null, start_time:null, end_time:null, classes:'', course_name:'', is_exam:false},
      ],
      schedule_types: [
        {id:1, name: "Regular"},
        {id:2, name: "One on One"},
      ],
      subject_wise_employees:[]
    }
  },
  computed: {
    ...mapGetters('admin/course',['courses','totalItems','days']),
    ...mapGetters('admin/subject',['subjects']),
    ...mapGetters('admin/courseCategory',['course_categories']),
    ...mapGetters('admin/employee',['only_employees']),
    selectedIds() {
      return this.selected.map((a) => a.id)
    },
  },
  watch: {
    options: {
      handler() {
        this.init()
      },
      deep: true
    },
    search(value, oldVal) {
      if ((value.length >= 3) || oldVal.length >= 3) {
        if (this.timeout) {
          clearTimeout(this.timeout)
        }
        this.timeout = setTimeout(() => {
          this.init()
        }, 500)
      }
    },
    'filter.category_id'(value) {
      this.init()
    },
    'filter.course_type_id'(value) {
      this.init()
    },
    'filter.instructor_id'(value) {
      this.init()
    },
    'filter.start_date'(value) {
      this.init()
    },
    'filter.end_date'(value) {
      this.init()
    },
    'form.start_date'(){
      this.endDateCalculate()
      this.weekCount()
      this.auto7DateMake()
      //this.scheduleMake()
    },
    'form.end_date'(){
      this.weekCount()
      this.auto7DateMake()
      //this.scheduleMake()
    },
    'form.duration_in_week'(){
      this.endDateCalculate()
      this.examDaysCreate()
      this.auto7DateMake()
      this.durationHourCalculate()
      //this.scheduleMake()
    },
    start_time(){
      this.auto7DateMake()
      //this.scheduleMake()
    },
    end_time(){
      this.auto7DateMake()
      //this.scheduleMake()
    },
    'form.course_type'(){
      this.auto7DateMake()
      this.durationHourCalculate()
      //this.scheduleMake()
    },
    course_length_in_hour(){
      this.durationHourCalculate()
    },
    one_on_ones:{
      handler: function (val, oldVal) {
        this.durationHourCalculate()
        /*let one_counter=0
        this.one_on_ones.filter(item=>{
          if (item.date) one_counter +=1
        })
        if (one_counter === this.one_on_ones.length) this.scheduleMake()*/
      },
      deep: true
    },
    regulars:{
      handler: function (val, oldVal) {
        this.durationHourCalculate()
        this.examDaysCreate()
      },
      deep: true
    },
    'form.course_type_id'(){
      this.subject_wise_employees=[]
      this.only_employees.forEach((item)=>{
        if(item.employeeSubjectSalaries && item.employeeSubjectSalaries.length){
          item.employeeSubjectSalaries.forEach((item2)=> {
            if (item2.course_type_id === this.form.course_type_id) this.subject_wise_employees.push(item)
          })
        }
      })
    }
  },
  async mounted() {
    this.loader.isLoading=true;
    await this.init();
    const payload1 = {apiUrl: '/course-type/', stateName: 'subjects'}
    if (!this.subjects.length) await this.$store.dispatch('admin/subject/getItems', payload1)

    const payload2 = {apiUrl: '/course-category/', stateName: 'course_categories'}
    if (!this.course_categories.length) await this.$store.dispatch('admin/courseCategory/getItems', payload2)

    const payload3 = {apiUrl: '/employee/all/active', stateName: 'only_employees'}
    await this.$store.dispatch('admin/employee/getItems2', payload3)

    this.loader.isLoading=false;
  },
  methods: {
    selectedEmployeeFind() {
      this.selected_employees = this.only_employees.filter(item => {
        if (this.form.employee_ids.includes(item.id)) return item
      })
      this.auto7DateMake()
    },
    weekCount() {
      if (!this.editMode) {
        if (this.form.start_date && this.form.end_date) {
          this.form.duration_in_week = this.moment(this.form.end_date).diff(this.form.start_date, 'weeks')
        } else this.form.duration_in_week = 0
      }
    },
    durationHourCalculate(){
      if (!this.editMode) {
        if (this.course_length_in_hour && this.form.course_type && this.form.duration_in_week){
            if (this.form.course_type === 1){
              //this.form.duration_in_hour = (this.course_length_in_hour * this.form.duration_in_week * 7)
              this.form.duration_in_hour = (this.course_length_in_hour * this.form.duration_in_week * this.regulars.length)
            }else{
              this.form.duration_in_hour = (this.course_length_in_hour * this.form.duration_in_week * this.one_on_ones.length)
            }
        }else{
          this.form.duration_in_hour=0
        }
      }
    },
    examDaysCreate() {
      if (!this.editMode) {
        this.exam_days = []
        this.selected_exam_days = []
        if (this.form.start_date && this.form.end_date && this.form.duration_in_week) {
          //let ll =this.form.start_date
          //for (let i = 0; i < (this.form.duration_in_week * 7); i++) {
          /*for (let i = 0; i < (this.form.duration_in_week * this.regulars.length); i++) {
            if (i > 0) {
              ll = moment(ll).add(i, 'days');
              ll = moment(ll).format('YYYY-MM-DD');
            }
            let day = this.moment(ll).format('dddd')
            this.exam_days.push({ id:(i + 1),date:ll, day:day });
          }*/
          for (let i = 0; i < (this.form.duration_in_week); i++) {
            this.regulars.forEach((item, key) => {
              let c_date = item.date
              if (i > 0) {
                c_date = moment(c_date).add((i * 7), 'days');
                c_date = moment(c_date).format('YYYY-MM-DD');
              }
              let day = this.moment(c_date).format('dddd')
              this.exam_days.push({ id:(this.exam_days.length + 1),date:c_date, day:day });
            })
          }
        }
      }
    },
    endDateCalculate() {
      if (this.form.start_date && this.form.duration_in_week) {
        let c_date = moment(this.form.start_date).add(this.form.duration_in_week, 'weeks');
        this.form.end_date = moment(c_date).format('YYYY-MM-DD');
      } else {
        this.form.end_date = null
      }

    },
    auto7DateMake() {
      if (!this.editMode && this.form.start_date && this.form.course_type === 1) {
        let ll = this.form.start_date;
        this.regulars = this.regulars.filter((itm, key) => {
          if (key > 0) {
            ll = moment(ll).add(1, 'days');
            ll = moment(ll).format('YYYY-MM-DD');
          }
          itm.date = ll
          itm.day = this.moment(ll).format('dddd')
          itm.start_time = this.start_time
          itm.end_time = this.end_time
          itm.employee_id = this.selected_employees[0] ? this.selected_employees[0].id : null
          return itm;
        })
      }
    },
    scheduleMake() {
      if (!this.editMode) {
        this.form.course_schedules = []
        if (this.form.course_type === 1) {
          //this.auto7DateMake()
          //this.examDaysCreate()
          this.exam_counter = 0
          this.class_counter = 0
          if (this.form.start_date && this.form.end_date && this.form.duration_in_week && this.start_time && this.end_time) {
            this.form.course_schedules = []
            //let c_date= this.form.start_date
            for (let i = 0; i < this.form.duration_in_week; i++) {
              this.regulars.forEach((item, key) => {
                let c_date = item.date
                if (i > 0) {
                  c_date = moment(c_date).add((i * 7), 'days');
                  c_date = moment(c_date).format('YYYY-MM-DD');
                }
                /*if exam date found*/
                //if (this.selected_exam_days.includes((i * 7) + (key + 1))) {
                if (this.selected_exam_days.includes(this.form.course_schedules.length+1)) {
                  this.exam_counter += 1
                  this.form.course_schedules.push({
                    employee_id: item.employee_id,
                    date: c_date,
                    day: this.moment(c_date).format('dddd'),
                    start_time: null,
                    end_time: '23:59',
                    classes: 'Test - ' + this.exam_counter,
                    course_name: item.course_name,
                    is_exam: true
                  });
                } else {
                  this.class_counter += 1
                  this.form.course_schedules.push({
                    employee_id: item.employee_id,
                    date: c_date,
                    day: this.moment(c_date).format('dddd'),
                    start_time: item.start_time,
                    end_time: item.end_time,
                    classes: 'Class - ' + this.class_counter,
                    course_name: item.course_name,
                    is_exam: false
                  });
                }
              })
            }
          } else {
            this.form.course_schedules = [{
              employee_id: null,
              date: null,
              day: null,
              start_time: null,
              end_time: null,
              classes: '',
              course_name: '',
              is_exam: false
            }];
          }
        } else if (this.form.course_type === 2) {
          if (this.form.duration_in_week && this.one_on_ones.length) {
            let one_counter = 0
            this.one_on_ones.filter(item => {
              if (item.date) one_counter += 1
            })
            let one_ones = this.one_on_ones;
            if (one_counter === this.one_on_ones.length) {
              for (let i = 0; i < this.form.duration_in_week; i++) {
                one_ones.forEach(itm => {
                  let ll = itm.date;
                  if (i > 0) {
                    ll = moment(ll).add((7 * i), 'days');
                    ll = moment(ll).format('YYYY-MM-DD');
                  }
                  this.form.course_schedules.push({
                    employee_id: itm.employee_id,
                    date: ll,
                    day: this.moment(ll).format('dddd'),
                    start_time: itm.start_time,
                    end_time: itm.end_time,
                    classes: itm.classes,
                    course_name: itm.course_name,
                    is_exam: false
                  });
                })
              }
            } else {
              this.form.course_schedules = [{
                employee_id: null,
                date: null,
                day: null,
                start_time: null,
                end_time: null,
                classes: '',
                course_name: '',
                is_exam: false
              }];
            }
          } else {
            this.form.course_schedules = [{
              employee_id: null,
              date: null,
              day: null,
              start_time: null,
              end_time: null,
              classes: '',
              course_name: '',
              is_exam: false
            }];
          }
        }

      }
    },
    removeImage($emit, formElementName) {
      if (!formElementName) return
      if ($emit && (this.form[formElementName] && this.form[formElementName].length > 1))
        $emit ? this.form[formElementName].splice($emit, 1) : this.form[formElementName] = null
      else this.form[formElementName] = null
    },
    addWE() {
      this.form.course_schedules.push({
        employee_id: null,
        date: null,
        day: null,
        start_time: null,
        end_time: null,
        classes: '',
        course_name: '',
        is_exam: false
      });
    },
    spliceWE(index) {
      this.form.course_schedules.splice(index, 1);
    },
    addOne() {
      this.one_on_ones.push({
        employee_id: null,
        date: null,
        start_time: null,
        end_time: null,
        classes: '',
        course_name: '',
        is_exam: false
      });
    },
    spliceOne(index) {
      this.one_on_ones.splice(index, 1);
    },
    addRegular() {
      this.regulars.push({employee_id:null, date:null, day:null, start_time:null, end_time:null, classes:'', course_name:'', is_exam:false},);
    },
    spliceRegular(index) {
      this.regulars.splice(index, 1);
    },
    async init() {
      this.loader.isLoading = true
      let url = `${this.pageInfo.apiUrl}?per_page=${this.options.itemsPerPage}&page=${this.options.page}`
      if (this.search.length > 3) {
        url += `&search=${this.search}`
      }
      if (this.filter.category_id) {
        url += `&category_id=${this.filter.category_id}`
      }
      if (this.filter.course_type_id) {
        url += `&course_type_id=${this.filter.course_type_id}`
      }
      if (this.filter.instructor_id) {
        url += `&instructor_id=${this.filter.instructor_id}`
      }

      if (this.filter.start_date) {
        url += `&start_date=${this.filter.start_date}`
      }
      if (this.filter.end_date) {
        url += `&end_date=${this.filter.end_date}`
      }
      const payload = {apiUrl: url, stateName}
      await this.$store.dispatch(storeName + '/getItems', payload)
      this.loader.isLoading = false
    },
    viewSchedule(item) {
      this.selectedItem = item
      this.dialog2 = true
    },
    closeSchedule() {
      this.dialog2 = false
      this.selectedItem = {}
      this.init()
    },
    closeEmpSchedule(){
      this.dialog3 = false
    },
    clone(item) {
      this.editIndex = -1
      this.editMode = false;
      this.selectedItem = item
      if (Object.keys(this.form) && Object.keys(this.form).length){
        Object.keys(this.form).map((field) => {
          this.form[field] = this.selectedItem[field] ?? null;
        });
      }
      this.form.image = null
      this.image = null
      this.form.category_ids = item.courseCategories ? item.courseCategories.map(item => item.id):[]
      this.form.employee_ids = item.only_employees ? item.only_employees.map(item => item.id):[]
      this.selectedEmployeeFind()
      this.form.course_schedules = []
      this.form.course_schedules = [{
        employee_id: null,
        date: null,
        day: null,
        start_time: null,
        end_time: null,
        classes: null,
        course_name: null,
        is_exam: false
      }];
      this.dialog = true
    },
    createOrUpdate(item = null) {
      if (item) {
        this.editIndex = this.courses.indexOf(item)
        this.editMode = true;
      } else {
        this.editIndex = -1
        this.editMode = false;
      }

      if (this.editMode) {
        this.selectedItem = item
        Object.keys(this.form).map((field) => {
          this.form[field] = this.selectedItem[field] ?? '';
        });
        this.form.image = null
        this.image = item.image
        this.course_type = item.course_type
        this.form.category_ids = item.courseCategories.map(item => item.id)
        /*this.form.employee_ids = item.only_employees.map(item => item.id)
        this.selectedEmployeeFind()
        this.form.course_schedules = []
        if (this.selectedItem.courseSchedules.length) {
          this.selectedItem.courseSchedules.forEach(item => {
            this.form.course_schedules.push({
              employee_id: item.employee_id,
              date: item.date,
              day: item.day,
              start_time: item.start_time,
              end_time: item.end_time,
              classes: item.classes,
              course_name: item.course_name,
              is_exam: item.is_exam ?? false
            })
          })
        } else {
          this.form.course_schedules.push({
            employee_id: null,
            date: null,
            'day': null,
            start_time: null,
            end_time: null,
            classes: '',
            course_name: '',
            is_exam: false
          })
        }*/
        //this.form.course_schedules = this.selectedItem.courseSchedules.length ? this.selectedItem.courseSchedules: [{date:null, 'day':null, start_time:null, end_time:null, classes:'', is_exam:false}]
      } else {
        this.selectedItem = {}
        Object.keys(this.form).map((field) => {
          this.form[field] = null;
        });
        this.form.image = null
        this.image = null
        //this.course_type = 1
        this.form.employee_ids = []
        this.form.category_ids = []
        this.form.course_schedules = [{
          employee_id: null,
          date: null,
          day: null,
          start_time: null,
          end_time: null,
          classes: null,
          course_name: null,
          is_exam: false
        }];
      }
      this.dialog = true
    },
    async submitData() {
      this.loader.isSubmitting = true
      const formData = this.$generateFormData(this.form, this.editIndex > -1, ['course_schedules'])
      let url = this.pageInfo.apiUrl

      if (this.editMode) url = url + this.selectedItem.id

      await this.$axios.post(url, formData).then((response) => {
        this.addOrUpdateState(response, stateName, storeName)
        this.$toaster.success(`${this.pageInfo.pageName} ${this.editMode ? 'updated' : 'created'} successfully!!`)
        this.closeModal()
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
    closeModal() {
      this.dialog = false
      this.e1 = 1
      this.clear()
    },
    clear() {
      this.editIndex = -1
      this.$refs.form.reset()
      this.form.employee_ids = []
      this.form.category_ids = []
      this.form.course_schedules = [];
      this.$refs.observer.reset()
    },
    async val(n, obs) {
      this.steps[n].valid = false
      const v = await this.$refs[obs].validate()
      if (v) {
        //if (n === 1) this.scheduleMake()
        if (n === 1 && !this.editMode) this.scheduleMake()
        this.steps[n].valid = true
        this.e1 = n + 2
      }
    },
    clear1() {
      this.form.course_type_id=null
      this.form.name=null
      this.form.category_ids=[]
      this.form.batch=null
      this.form.level=null
      this.form.image=null
      this.image=null
      this.form.amount=0
      this.form.course_location=null
      this.form.class_time=null
      this.$refs.observer1.reset()
    },
    clear2(){
      this.form.course_type=1
      this.form.employee_ids=[]
      this.form.start_date=null
      this.form.end_date=null
      this.form.duration_in_hour=null
      this.form.duration_in_week=null
      this.$refs.observer2.reset()
    }
  }
}
</script>
