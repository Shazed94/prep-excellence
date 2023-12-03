<template>
  <div class="user-dashboard-area">
    <div class="btcontainer">
      <template v-if="loader.isLoading">
        <v-sheet
          :color="`grey lighten-4`"
          class="pa-3"
        >
          <v-row>
            <v-col cols="12" md="4">
              <v-skeleton-loader
                class="mx-auto"
                max-width="300"
                type="card"
              ></v-skeleton-loader>
            </v-col>
            <v-col cols="12" md="4">
              <v-skeleton-loader
                class="mx-auto"
                max-width="300"
                type="card"
              ></v-skeleton-loader>
            </v-col>
            <v-col cols="12" md="4">
              <v-skeleton-loader
                class="mx-auto"
                max-width="300"
                type="card"
              ></v-skeleton-loader>
            </v-col>
          </v-row>

        </v-sheet>
      </template>
      <div v-else class="up_wrap">
        <v-container fluid class="text-center">
          <bread-crumbs class="text-center"
            :page-title="`${pageInfo.pageName}`"
            :items="[{text: 'Student',disabled: false, href: '/student'},{text: `${pageInfo.pageName}`,disabled: true, href: '/student/attendance'}]"
          />
          <TimerCount v-if="exam.time_type === 1"
            :strict="true"
            :duration="exam.duration"
            :end-time="exam.exam_end"
            :start-time="exam.exam_start"
            :timer_type="false"
            @endCallBack="handelSubmitAnswer"
          >
            <template v-slot:examInfo>
              <strong class="mt-2 mx-1 d-md-none">
                ( <span class="primary--text">{{ 5 }}</span> / <span class="primary--text">{{ 5 }}</span> )
              </strong>
            </template>
          </TimerCount>
        </v-container>
        <div class="btrow">
          <div class="btcol-md-6 btcol-lg-6">
            <!-- main content -->
            <div class="ml-2 mt-9 mr-1">
              <template v-if="exam.question_type === 1">
                <v-card
                  class="overflow-y-auto"
                  max-height="800"
                >
                  <v-card-text>
                    <v-card-title>Question Part 1</v-card-title>
                    <v-container fluid v-for="(mcq, n) in exam_questions.filter(item=>item.question_part === 1)" :key="mcq.id+'-'+n">
                      <div class="d-flex justify-space-between">
                        <div class="d-flex">
                          <div class="mr-1"><strong v-if="n+1">{{ n+1 }}.</strong></div>
                          <div v-html="mcq.question"></div>
                        </div>
                      </div>
                      <v-radio-group v-if="mcq.question_type === 1"
                        row
                      >
                        <v-radio
                          v-for="(option, i) in jsonDecode(mcq.options)"
                          :key="n+i"
                          ripple
                          :off-icon="`mdi-alpha-${findOptionStyle(i)}-circle-outline`"
                          :on-icon="`mdi-alpha-${findOptionStyle(i)}-circle-outline`"
                        >
                          <template v-slot:label>
                            <div>
                              <strong  v-html="option"></strong>
                            </div>
                          </template>
                        </v-radio>
                      </v-radio-group>
                    </v-container>
                    <v-card-title>Question Part 2</v-card-title>
                    <v-container fluid v-for="(mcq, n) in exam_questions.filter(item=>item.question_part === 2)" :key="mcq.id+'-'+n">
                      <div class="d-flex justify-space-between">
                        <div class="d-flex">
                          <div class="mr-1"><strong v-if="n+1">{{ n+1 }}.</strong></div>
                          <div v-html="mcq.question"></div>
                        </div>
                      </div>
                      <v-radio-group v-if="mcq.question_type === 1"
                                     row
                      >
                        <v-radio
                          v-for="(option, i) in jsonDecode(mcq.options)"
                          :key="n+i"
                          ripple
                          :off-icon="`mdi-alpha-${findOptionStyle(i)}-circle-outline`"
                          :on-icon="`mdi-alpha-${findOptionStyle(i)}-circle-outline`"
                        >
                          <template v-slot:label>
                            <div>
                              <strong  v-html="option"></strong>
                            </div>
                          </template>
                        </v-radio>
                      </v-radio-group>
                    </v-container>
                    <v-card-title>Question Part 3</v-card-title>
                    <v-container fluid v-for="(mcq, n) in exam_questions.filter(item=>item.question_part === 3)" :key="mcq.id+'-'+n">
                      <div class="d-flex justify-space-between">
                        <div class="d-flex">
                          <div class="mr-1"><strong v-if="n+1">{{ n+1 }}.</strong></div>
                          <div v-html="mcq.question"></div>
                        </div>
                      </div>
                      <v-radio-group v-if="mcq.question_type === 1"
                                     row
                      >
                        <v-radio
                          v-for="(option, i) in jsonDecode(mcq.options)"
                          :key="n+i"
                          ripple
                          :off-icon="`mdi-alpha-${findOptionStyle(i)}-circle-outline`"
                          :on-icon="`mdi-alpha-${findOptionStyle(i)}-circle-outline`"
                        >
                          <template v-slot:label>
                            <div>
                              <strong  v-html="option"></strong>
                            </div>
                          </template>
                        </v-radio>
                      </v-radio-group>
                    </v-container>
                    <v-card-title>Question Part 4</v-card-title>
                    <v-container fluid v-for="(mcq, n) in exam_questions.filter(item=>item.question_part === 4)" :key="mcq.id+'-'+n">
                      <div class="d-flex justify-space-between">
                        <div class="d-flex">
                          <div class="mr-1"><strong v-if="n+1">{{ n+1 }}.</strong></div>
                          <div v-html="mcq.question"></div>
                        </div>
                      </div>
                      <v-radio-group v-if="mcq.question_type === 1"
                                     row
                      >
                        <v-radio
                          v-for="(option, i) in jsonDecode(mcq.options)"
                          :key="n+i"
                          ripple
                          :off-icon="`mdi-alpha-${findOptionStyle(i)}-circle-outline`"
                          :on-icon="`mdi-alpha-${findOptionStyle(i)}-circle-outline`"
                        >
                          <template v-slot:label>
                            <div>
                              <strong  v-html="option"></strong>
                            </div>
                          </template>
                        </v-radio>
                      </v-radio-group>
                    </v-container>
                  </v-card-text>
                </v-card>
              </template>
              <template v-else>

                <client-only>
<!--                  <vue-pdf-app :pdf="exam.question"></vue-pdf-app>-->
                  <iframe :src="`${exam.question}#toolbar=0&navpanes=0&scrollbar=0&embedded=true`" tool="off" width="100%" height="700px"></iframe>
                </client-only>
              </template>

            </div>
          </div>
          <div class="btcol-md-6 btcol-lg-6">
            <div class="up_content_wrap">
                <v-container fluid>
                  <v-card>
                  <v-tabs v-model="tab">
                    <v-tab v-for="(itm, key3) in sat_exams" :key="key3">{{  itm.name }}</v-tab>
                  </v-tabs>
                  <v-tabs-items v-model="tab">
                    <v-tab-item
                      v-for="(itm, key2) in sat_exams"
                      :key="key2"
                    >
                      <form>
                        <main>
                          <div class="col">
                            <table>
                              <thead>
                              <tr>
                                <th colspan="2">Answer Sheet</th>
                              </tr>
                              </thead>
                            </table>
                          </div>
                          <div class="col"><strong></strong></div>
                          <div class="col"><span>© Prep-Excellence 2022 <br/>All rights reserved</span>
                            <span class="no-tt">SAT Exam <br/>1-800-Prep-Excellence</span>
                            <span><em>Feed this direction</em></span>
                            <span><strong>8012 4207 599</strong> 16</span>
                          </div>
                          <div class="col"></div>
                          <div class="col">
                            <div class="bubble-group" v-if="key2 === 0">

                              <template v-for="(item, i) in exam_questions.filter(it=>it.question_part === 1)">
                                <template v-if="item.question_type === 1">
                                  <strong :key="item.id">{{ i+1 }}</strong>
                                  <input type="radio" v-model="answer.part1[i]" @change="changeEvent(item.id,answer.part1[i])" :name="'_'+item.id" :id="'_'+item.id+'a'" value="A"/>
                                  <label class="bubble" :for="'_'+item.id+'a'">
                                    <div class="bubble-inner">A</div>
                                  </label>
                                  <input type="radio" v-model="answer.part1[i]" @change="changeEvent(item.id,answer.part1[i])" :name="'_'+item.id" :id="'_'+item.id+'b'" value="B"/>
                                  <label class="bubble" :for="'_'+item.id+'b'">
                                    <div class="bubble-inner">B</div>
                                  </label>
                                  <input type="radio" v-model="answer.part1[i]" @change="changeEvent(item.id,answer.part1[i])" :name="'_'+item.id" :id="'_'+item.id+'c'" value="C"/>
                                  <label class="bubble" :for="'_'+item.id+'c'">
                                    <div class="bubble-inner">C</div>
                                  </label>
                                  <input type="radio" v-model="answer.part1[i]" @change="changeEvent(item.id,answer.part1[i])" :name="'_'+item.id" :id="'_'+item.id+'d'" value="D"/>
                                  <label class="bubble" :for="'_'+item.id+'d'">
                                    <div class="bubble-inner">D</div>
                                  </label>
                                </template>
                                <template v-else>
                                  <strong :key="item.id">{{ i+1 }}</strong>
                                  <input type="text" v-model="answer.part1[i]" @input="changeEvent(item.id,answer.part1[i])" :name="'_'+item.id" :id="'_'+item.id+'d'"/>
                                  <v-divider></v-divider>
                                  <v-divider></v-divider>
                                  <v-divider></v-divider>
                                </template>
                                <v-divider></v-divider>
                              </template>
                            </div>
                            <div class="bubble-group" v-if="key2 === 1">
                              <template v-for="(item, i) in exam_questions.filter(it=>it.question_part === 2)">
                                <template v-if="item.question_type === 1">
                                  <strong :key="item.id">{{ i+1 }}</strong>
                                  <input type="radio" v-model="answer.part2[i]" @change="changeEvent(item.id,answer.part2[i])" :name="'_'+item.id" :id="'_'+item.id+'a'" value="A"/>
                                  <label class="bubble" :for="'_'+item.id+'a'">
                                    <div class="bubble-inner">A</div>
                                  </label>
                                  <input type="radio" v-model="answer.part2[i]" @change="changeEvent(item.id,answer.part2[i])" :name="'_'+item.id" :id="'_'+item.id+'b'" value="B"/>
                                  <label class="bubble" :for="'_'+item.id+'b'">
                                    <div class="bubble-inner">B</div>
                                  </label>
                                  <input type="radio" v-model="answer.part2[i]" @change="changeEvent(item.id,answer.part2[i])" :name="'_'+item.id" :id="'_'+item.id+'c'" value="C"/>
                                  <label class="bubble" :for="'_'+item.id+'c'">
                                    <div class="bubble-inner">C</div>
                                  </label>
                                  <input type="radio" v-model="answer.part2[i]" @change="changeEvent(item.id,answer.part2[i])" :name="'_'+item.id" :id="'_'+item.id+'d'" value="D"/>
                                  <label class="bubble" :for="'_'+item.id+'d'">
                                    <div class="bubble-inner">D</div>
                                  </label>
                                </template>
                                <template v-else>
                                  <strong :key="item.id">{{ i+1 }}</strong>
                                  <input type="text" v-model="answer.part2[i]" @input="changeEvent(item.id,answer.part2[i])" :name="'_'+item.id" :id="'_'+item.id+'d'"/>
                                  <v-divider></v-divider>
                                  <v-divider></v-divider>
                                  <v-divider></v-divider>
                                </template>
                                <v-divider></v-divider>
                              </template>
                            </div>
                            <div class="bubble-group" v-if="key2 === 2">
                                <template v-for="(item, i) in exam_questions.filter(it=>it.question_part === 3)">
                                  <template v-if="item.question_type === 1">
                                    <strong :key="item.id">{{ i+1 }}</strong>
                                    <input type="radio" v-model="answer.part3[i]" @change="changeEvent(item.id,answer.part3[i])" :name="'_'+item.id" :id="'_'+item.id+'a'" value="A"/>
                                    <label class="bubble" :for="'_'+item.id+'a'">
                                      <div class="bubble-inner">A</div>
                                    </label>
                                    <input type="radio" v-model="answer.part3[i]" @change="changeEvent(item.id,answer.part3[i])" :name="'_'+item.id" :id="'_'+item.id+'b'" value="B"/>
                                    <label class="bubble" :for="'_'+item.id+'b'">
                                      <div class="bubble-inner">B</div>
                                    </label>
                                    <input type="radio" v-model="answer.part3[i]" @change="changeEvent(item.id,answer.part3[i])" :name="'_'+item.id" :id="'_'+item.id+'c'" value="C"/>
                                    <label class="bubble" :for="'_'+item.id+'c'">
                                      <div class="bubble-inner">C</div>
                                    </label>
                                    <input type="radio" v-model="answer.part3[i]" @change="changeEvent(item.id,answer.part3[i])" :name="'_'+item.id" :id="'_'+item.id+'d'" value="D"/>
                                    <label class="bubble" :for="'_'+item.id+'d'">
                                      <div class="bubble-inner">D</div>
                                    </label>
                                </template>
                                <template v-else>
                                  <strong :key="item.id">{{ i+1 }}</strong>
                                  <input type="text" v-model="answer.part3[i]" @input="changeEvent(item.id,answer.part3[i])" :name="'_'+item.id" :id="'_'+item.id+'d'"/>
                                  <v-divider></v-divider>
                                  <v-divider></v-divider>
                                  <v-divider></v-divider>
                                </template>
                                <v-divider></v-divider>
                              </template>
                            </div>
                            <div class="bubble-group" v-if="key2 === 3">
                              <template v-for="(item, i) in exam_questions.filter(it=>it.question_part === 4)">
                                <template v-if="item.question_type === 1">
                                  <strong :key="item.id">{{ i+1 }}</strong>
                                  <input type="radio" v-model="answer.part4[i]" @change="changeEvent(item.id,answer.part4[i])" :name="'_'+item.id" :id="'_'+item.id+'a'" value="A"/>
                                  <label class="bubble" :for="'_'+item.id+'a'">
                                    <div class="bubble-inner">A</div>
                                  </label>
                                  <input type="radio" v-model="answer.part4[i]" @change="changeEvent(item.id,answer.part4[i])" :name="'_'+item.id" :id="'_'+item.id+'b'" value="B"/>
                                  <label class="bubble" :for="'_'+item.id+'b'">
                                    <div class="bubble-inner">B</div>
                                  </label>
                                  <input type="radio" v-model="answer.part4[i]" @change="changeEvent(item.id,answer.part4[i])" :name="'_'+item.id" :id="'_'+item.id+'c'" value="C"/>
                                  <label class="bubble" :for="'_'+item.id+'c'">
                                    <div class="bubble-inner">C</div>
                                  </label>
                                  <input type="radio" v-model="answer.part4[i]" @change="changeEvent(item.id,answer.part4[i])" :name="'_'+item.id" :id="'_'+item.id+'d'" value="D"/>
                                  <label class="bubble" :for="'_'+item.id+'d'">
                                    <div class="bubble-inner">D</div>
                                  </label>
                                </template>
                                <template v-else>
                                  <strong :key="item.id">{{ i+1 }}</strong>
                                  <input type="text" v-model="answer.part4[i]" @input="changeEvent(item.id,answer.part4[i])" :name="'_'+item.id" :id="'_'+item.id+'d'"/>
                                  <v-divider></v-divider>
                                  <v-divider></v-divider>
                                  <v-divider></v-divider>
                                </template>
                                <v-divider></v-divider>
                              </template>
                            </div>
                          </div>
                          <div class="col">
                            <aside>
                              <div>
                                <table>
                                  <thead>
                                  <tr>
                                    <th colspan="2">Important</th>
                                  </tr>
                                  </thead>
                                  <tbody>
                                  <tr>
                                    <td>
                                      <div class="pencil">Use NO. 2 pencil only</div>
                                      <ul>
                                        <li>Make dark marks</li>
                                        <li>Erase completely<br/>&nbsp; to change
                                        </li>
                                        <li>Example:
                                          <div class="bubble">
                                            <div class="bubble-inner">A</div>
                                          </div>
                                          <div class="bubble">
                                            <div class="bubble-inner">B</div>
                                          </div>
                                          <div class="bubble filled">
                                            <div class="bubble-inner">C</div>
                                          </div>
                                          <div class="bubble">
                                            <div class="bubble-inner">D</div>
                                          </div>
                                        </li>
                                      </ul>
                                    </td>
                                    <!--                                <td>
                                                                      <p><strong>To use subjective<br/>score feature:</strong></p>
                                                                      <ul class="no-tt">
                                                                        <li>Make total possible subjective points</li>
                                                                        <li>Only one mark per line on key</li>
                                                                        <li>163 points maximum</li>
                                                                      </ul>
                                                                      <div class="example-table">
                                                                        <p><strong>Example of student score:</strong></p>
                                                                        <table>
                                                                          <tbody>
                                                                          <tr>
                                                                            <td class="bubble-group">
                                                                              <div class="bubble filled">
                                                                                <div class="bubble-inner narrow-num">100</div>
                                                                              </div>
                                                                              <div class="bubble">
                                                                                <div class="bubble-inner narrow-num">90</div>
                                                                              </div>
                                                                              <div class="bubble">
                                                                                <div class="bubble-inner narrow-num">80</div>
                                                                              </div>
                                                                              <div class="bubble">
                                                                                <div class="bubble-inner narrow-num">70</div>
                                                                              </div>
                                                                              <div class="bubble">
                                                                                <div class="bubble-inner narrow-num">60</div>
                                                                              </div>
                                                                              <div class="bubble">
                                                                                <div class="bubble-inner narrow-num">50</div>
                                                                              </div>
                                                                              <div class="bubble">
                                                                                <div class="bubble-inner narrow-num">40</div>
                                                                              </div>
                                                                              <div class="bubble">
                                                                                <div class="bubble-inner narrow-num">30</div>
                                                                              </div>
                                                                              <div class="bubble filled">
                                                                                <div class="bubble-inner narrow-num">20</div>
                                                                              </div>
                                                                              <div class="bubble">
                                                                                <div class="bubble-inner narrow-num">10</div>
                                                                              </div>
                                                                              <div class="bubble">
                                                                                <div class="bubble-inner">9</div>
                                                                              </div>
                                                                              <div class="bubble">
                                                                                <div class="bubble-inner">8</div>
                                                                              </div>
                                                                              <div class="bubble">
                                                                                <div class="bubble-inner">7</div>
                                                                              </div>
                                                                              <div class="bubble">
                                                                                <div class="bubble-inner">6</div>
                                                                              </div>
                                                                              <div class="bubble filled">
                                                                                <div class="bubble-inner">5</div>
                                                                              </div>
                                                                              <div class="bubble">
                                                                                <div class="bubble-inner">4</div>
                                                                              </div>
                                                                              <div class="bubble">
                                                                                <div class="bubble-inner">3</div>
                                                                              </div>
                                                                              <div class="bubble">
                                                                                <div class="bubble-inner">2</div>
                                                                              </div>
                                                                              <div class="bubble">
                                                                                <div class="bubble-inner">1</div>
                                                                              </div>
                                                                              <div class="bubble">
                                                                                <div class="bubble-inner">0</div>
                                                                              </div>
                                                                            </td>
                                                                            <td><code>125</code></td>
                                                                          </tr>
                                                                          </tbody>
                                                                        </table>
                                                                      </div>
                                                                    </td>-->
                                  </tr>
                                  </tbody>
                                </table>
                              </div>
                              <!--                          <div><span class="logo">
                                                          <div class="logo-text">Scantron</div><sup>®</sup></span><br/><span class="form-no">Form No. 883-E</span></div>
                                                        <div><em>For use on<br/>test scoring machine only</em></div>
                                                        <div>
                                                          <table>
                                                            <thead>
                                                            <tr>
                                                              <th colspan="2">Test Record</th>
                                                            </tr>
                                                            </thead>
                                                            <tbody>
                                                            <tr>
                                                              <td>
                                                                <label for="part1">Part 1</label>
                                                              </td>
                                                              <td>
                                                                <input type="text" id="part1" name="part1"/>
                                                              </td>
                                                            </tr>
                                                            <tr>
                                                              <td>
                                                                <label for="part2">Part 2</label>
                                                              </td>
                                                              <td>
                                                                <input type="text" id="part2" name="part2"/>
                                                              </td>
                                                            </tr>
                                                            <tr>
                                                              <td>
                                                                <label for="part3">Part 3</label>
                                                              </td>
                                                              <td>
                                                                <input type="text" id="part3" name="part3"/>
                                                              </td>
                                                            </tr>
                                                            <tr>
                                                              <td>
                                                                <label for="total"><strong>Total</strong></label>
                                                              </td>
                                                              <td>
                                                                <input type="text" id="total" name="total"/>
                                                              </td>
                                                            </tr>
                                                            </tbody>
                                                          </table>
                                                        </div>
                                                        <div>
                                                          <table>
                                                            <tbody>
                                                            <tr>
                                                              <th>
                                                                <label for="name">Name</label>
                                                              </th>
                                                              <td colspan="3">
                                                                <input type="text" id="name" name="name"/>
                                                              </td>
                                                            </tr>
                                                            <tr>
                                                              <th>
                                                                <label for="subject">Subject</label>
                                                              </th>
                                                              <td>
                                                                <input type="text" id="subject" name="subject"/>
                                                              </td>
                                                              <th>
                                                                <label for="testno"><span>Test </span><span>No.</span></label>
                                                              </th>
                                                              <td>
                                                                <input type="number" id="testno" name="testno"/>
                                                              </td>
                                                            </tr>
                                                            <tr>
                                                              <th>
                                                                <label for="date">Date</label>
                                                              </th>
                                                              <td>
                                                                <input type="text" id="date" name="date"/>
                                                              </td>
                                                              <th>
                                                                <label for="period">Period</label>
                                                              </th>
                                                              <td>
                                                                <input type="number" id="period" name="period"/>
                                                              </td>
                                                            </tr>
                                                            </tbody>
                                                          </table>
                                                        </div>-->
                            </aside>
                          </div>
                        </main>
                      </form>
                    </v-tab-item>
                  </v-tabs-items>
                  <v-card-actions>
                    <v-btn color="#00A1FF" class="white--text px-5 mr-1 mb-3" @click="submitAnswer()">Finished All Part</v-btn>
                  </v-card-actions>
                  </v-card>
              </v-container>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BreadCrumbs from "@/components/common/BreadCrumbs";
import {common as commonMixin} from "@/mixins/common";
import {mapGetters} from "vuex";
import Sidebar from "@/components/user/Sidebar";
import TimerCount from "@/components/exam/TimerCount";
import moment from "moment-timezone";
const stateName = 'exam_questions'
const storeName='student/exam'
export default {
  name: 'studentExam',
  components: {Sidebar, BreadCrumbs,TimerCount},
  mixins: [commonMixin],
  data() {
    return {
      pageInfo: {
        pageName: 'Student Test',
        apiUrl: '/student/exam/question/',
      },
      state: {
        name: stateName,
        store_name: storeName,
      },
      moment,
      loader: {isLoading: false, isSubmitting: false, isDeleting: false},
      tab:0,
      exam:{},
      is_answer: false,
      answer: {
        part1:[],
        part2:[],
        part3:[],
        part4:[],
      },
    }
  },
  computed: {
    ...mapGetters('sat/basic',['sat_exams']),
    ...mapGetters('student/exam',['exam_questions']),
  },
  watch: {

  },
  async mounted() {
    this.loader.isLoading=true;
    const payload7 = {apiUrl: '/sat/exams', stateName:'sat_exams'}
    if (!this.sat_exams.length) await this.$store.dispatch('sat/basic/getItems', payload7)
    await this.init();
    await this.getExam();
    this.loader.isLoading=false;
  },
  methods: {
    jsonDecode(data){
      try {
        return JSON.parse(data);
      }catch (e){
        return data
      }
    },
    findOptionStyle(n){
      if (n === 'option_a') return 'a';
      else if (n === 'option_b') return 'b';
      else if (n === 'option_c') return 'c';
      else if (n === 'option_d') return 'd';
    },
    findOptionValue(n){
      if (n === 'option_a') return 'A';
      else if (n === 'option_b') return 'B';
      else if (n === 'option_c') return 'C';
      else if (n === 'option_d') return 'D';
    },
    async init() {
      this.loader.isLoading = true
      let url = `/student/exam/question/${this.$route.params.id}`
      const payload1 = {apiUrl: url, stateName}
      await this.$store.dispatch(storeName+'/getItems2', payload1)
      this.loader.isLoading = false
    },
    async getExam(){
      this.loader.isLoading = true
      let url = `/student/exam/${this.$route.params.id}`
      await this.$axios.get(url).then((response)=>{
        this.exam =response.data.data;
      }).catch(()=>{
        this.exam={}
      })
      this.loader.isLoading = false
    },
    async changeEvent(question, ans){
      this.loader.isSubmitting = true
      const formData = new FormData();
      formData.append('exam_id',this.exam.id)
      formData.append('exam_question_id',question)
      formData.append('student_answer',ans)
      await this.$axios.post(`/student/exam/answer/by${this.exam.id}`,formData).then((response)=>{
        //this.$toaster.success(response.data.message)
        //this.getExam();
      }).catch((error)=>{
        this.$toaster.error(error.response.data.message)
      }).finally(()=>{
        this.loader.isSubmitting = false
      })
    },
    async submitAnswer(){
      this.$swal.fire({
        title: 'Are you sure?',
        icon: 'warning',
        text: `Do you want to submit all part answer`,
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes'
      }).then(async (result) => {
        if (result.isConfirmed) {
          this.$swal.fire('Submitted!', `Your answer is submitted`, 'success')
          await this.$router.push('/student/exam/exam')
          /*this.loader.isLoading = true
          await this.$axios.delete(`${this.pageInfo.apiUrl + item.id}`).then((response) => {
            const payload = {stateName: this.state.name, index: index}
            this.$store.commit(storeName + '/DELETE_ITEM', payload)
            this.$swal.fire('Deleted!', `${this.pageInfo.pageName} has been deleted!`, 'success')
          }).catch(() => {
            this.$toaster.error('Something went wrong!!')
          }).finally(() => this.loader.isLoading = false)*/
        }
      })
    },
    handelSubmitAnswer() {
      /*this.$swal?.fire({
        toast: true, type: 'success', icon: 'success', position: 'top-end',
        timer: 2000, title: 'Warning', text: 'You have 2 min',
        showConfirmButton: false, timerProgressBar: true,
      })*/
      this.$swal.fire('Submitted!', `Your answer is submitted`, 'success')
      this.$router.push('/student/exam/exam')
    },
    examStatus(){
      if (this.exam.time_type && this.exam.time_type === 1){
        if (!this.exam.exam_end || !this.exam.exam_start){
          this.$router.push('/')
        }else if ( (this.moment(this.exam.exam_end)).diff(this.moment(),'minutes') < 1){
          this.$toaster.error('Test is end')
          this.$router.push('/')
        }else if(this.moment(this.exam.exam_start).format('YYYYMMDD') === this.moment().format('YYYYMMDD')){
          if((this.moment(this.exam.exam_start)).diff(this.moment(),'minutes') > 1){
            this.$toaster.error('Test not started yet.')
            this.$router.push('/')
          }
        }else{
          this.$toaster.error('Invalid request')
          this.$router.push('/')
        }
      }else if (this.exam.time_type && this.exam.time_type === 2){
        if (this.exam.exam_start_date && this.moment(this.exam.exam_start_date).format('YMMDD') > this.moment().format('YMMDD')){
          this.$toaster.error(`Test enable on ${this.exam.exam_start_date}`)
          this.$router.push('/')
        }else if (this.exam.exam_end_date && this.moment(this.exam.exam_end_date).format('YMMDD') < this.moment().format('YMMDD')){
          this.$toaster.error(`Test is end`)
          this.$router.push('/')
        }
      }else{
        this.$toaster.error(`Invalid request`)
        this.$router.push('/')
      }
    }
  }
}
</script>
<style scoped>
*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
:root {
  --c: rgb(32, 176, 144);
  font-size: 16px;
}
body,
input {
  font: 1em "Helvetica Neue", Helvetica, sans-serif;
  line-height: 1.5;
}
body {
  background: #999;
  color: rgb(32, 176, 144);
  color: var(--c);
}
input[type="text"],
input[type="number"] {
  border: 0;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  font-family: "Patrick Hand", sans-serif;
  width: 100%;
}
input[type="radio"] {
  opacity: 0;
  position: absolute;
  width: 0;
  height: 0;
}
input[type="radio"]:checked + .bubble:after {
  width: 100%;
}
main {
  background: #fff;
  clip-path: polygon(0 0, 100% 0, 100% 100%, 2em 100%, 0% 80.7em);
  -webkit-clip-path: polygon(0 0, 100% 0, 100% 100%, 2em 100%, 0% 80.7em);
  display: grid;
  display: -ms-grid;
  grid-template-columns: minmax(2.4em, 1fr) 1.1fr 7fr 1fr 1fr minmax(14.6em, 6fr);
  -ms-grid-columns: minmax(2.4em, 1fr) 1.1fr 7fr 1fr 1fr minmax(14.6em, 6fr);
  grid-template-rows: 2fr 14fr;
  -ms-grid-rows: 2.15fr 14fr;
  margin: 1em auto 0 auto;
  width: 41.5em;
  height: 82.7em;
  text-transform: uppercase;
  transition: 0.5s ease-out;
}
form {
  width: 100%;
  height: 100%;
}
form > label,
form > input[type="checkbox"] {
  position: fixed;
  z-index: 2;
}
form > input[type="checkbox"] {
  top: 1.5em;
  left: 0.75em;
}
form > label {
  background: rgba(0, 0, 0, 0.9);
  color: #f1f1f1;
  padding: 0.375em 0.75em 0.75em 2.25em;
  top: 0.75em;
  left: 0;
  z-index: 1;
}
form > input[type="checkbox"]:checked ~ main {
  transform: rotate(-90deg);
}
table {
  border-collapse: collapse;
  box-shadow: 0 0 0 1px inset;
  border-radius: 0.5em;
}
thead th:first-of-type,
tbody tr:first-of-type th:first-child {
  border-top-left-radius: 0.5em;
}
thead th:last-of-type {
  border-top-right-radius: 0.5em;
}
tbody tr:last-of-type th:first-of-type {
  border-bottom-left-radius: 0.5em;
}
th {
  background: rgb(32, 176, 144);
  color: #fff;
  line-height: 1.25;
  padding: 0.25em 0.75em;
}
td {
  padding: 0.125em 0.25em;
}
tr:not(:last-of-type) {
  border-bottom: 1px solid currentColor;
}
td:not(:last-of-type) {
  border-right: 1px solid currentColor;
}
p,
ul {
  font-size: 0.63em;
  margin-bottom: 0.5em;
}
p:first-child {
  text-align: center;
}
ul {
  font-weight: bold;
  list-style: none;
  padding-left: 0.5em;
}
li {
  margin-left: 0.125em;
}
li:before {
  content: "• ";
}

/* Columns */
.col:first-of-type {
  grid-column: 3 / 4;
  -ms-grid-column: 3;
  -ms-grid-column-span: 1;
}
.col:first-of-type table {
  margin: 3em auto 0 1.75em;
  width: 15em;
}
.col:first-of-type table td {
  padding: 0 0.25em;
}
.col:first-of-type tbody td:nth-of-type(2) {
  position: relative;
  width: 2em;
  max-width: 2em;
}
.col:first-of-type tbody td:nth-of-type(2) input {
  font-family: Monaco, monospace;
  letter-spacing: 0.5em;
  transform: rotate(90deg) translateY(100%);
  text-align: center;
  width: 4.5em;
}
.col:nth-of-type(2) {
  grid-column: 4 / 7;
  -ms-grid-column: 4;
  -ms-grid-column-span: 3;
  text-align: center;
}
.col:nth-of-type(2) strong {
  display: block;
  margin-top: 4.5em;
}
.col:nth-of-type(3),
.col:nth-of-type(4) {
  grid-row: 1 / 3;
  -ms-grid-row: 1;
  -ms-grid-row-span: 2;
}
.col:nth-of-type(3) {
  -ms-grid-row: 1;
}
.col:nth-of-type(3) span {
  display: block;
  font-size: 0.75em;
  line-height: 1;
  width: 2em;
  height: 2em;
  white-space: nowrap;
  transform: rotate(90deg);
  transform-origin: 1em 1em;
}
.col:nth-of-type(3) span:first-of-type {
  font-size: 0.6em;
  letter-spacing: -0.03em;
  text-indent: -1em;
  transform: rotate(90deg) translate(12.5em, -1.5em);
}
.col:nth-of-type(3) span:nth-of-type(2) {
  letter-spacing: 0.04em;
  transform: rotate(90deg) translate(33em, -1.4em) scaleY(1.2);
}
.col:nth-of-type(3) span:nth-of-type(3) {
  background: linear-gradient(-15deg, currentColor 45%, transparent 50%) 0 0 /
			2.5em 50%,
  linear-gradient(195deg, currentColor 45%, transparent 50%) 0 100% / 2.5em 50%,
  linear-gradient(
    transparent 38%,
    currentColor 38%,
    currentColor 62%,
    transparent 62%
  )
  2.5em 0 / 19em 100%,
  linear-gradient(
    -25deg,
    transparent 27%,
    currentColor 30%,
    currentColor 77%,
    transparent 80%
  )
  100% 0 / 3.5em 50%,
  linear-gradient(
    205deg,
    transparent 27%,
    currentColor 30%,
    currentColor 77%,
    transparent 80%
  )
  100% 100% / 3.5em 50%;
  background-repeat: no-repeat;
  font-size: 0.75em;
  line-height: 1.5;
  transform: rotate(90deg) translate(42.5em, -1.25em);
  text-align: center;
  width: 25em;
  height: 1.5em;
}
.col:nth-of-type(3) span:nth-of-type(3) em {
  background-color: #fff;
  padding: 0 0.4em;
  letter-spacing: 0.5px;
}
.col:nth-of-type(3) span:nth-of-type(4) {
  transform: rotate(90deg) translate(81.75em, -0.5em) scaleX(0.75);
  word-spacing: 0.15em;
}
.col:nth-of-type(4) {
  background: linear-gradient(
    #000 0.85em,
    transparent 0.85em,
    transparent 62.5em,
    #000 62.5em
  )
  50% 12.5em / 1.9em 63.25em,
  repeating-linear-gradient(
    #000,
    #000 0.2em,
    transparent 0.2em,
    transparent 1.25em
  )
  50% 6.25em / 1.9em 5em,
  repeating-linear-gradient(
    #000,
    #000 0.2em,
    transparent 0.2em,
    transparent 1.25em
  )
  50% 13.75em / 1.9em 62em;
  background-repeat: no-repeat;
  -ms-grid-column: 2;
}
.col:nth-of-type(5) {
  position: relative;
  -ms-grid-column: 3;
  -ms-grid-row: 2;
}
.col:nth-of-type(5):after {
  background-color: #fff;
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  width: 2.5em;
  height: 100%;
}
.col:nth-of-type(5) .bubble-group > span,
.col:nth-of-type(5) .bubble-group > strong {
  letter-spacing: 0.05em;
  text-align: center;
}
.col:nth-of-type(6) {
  -ms-grid-column: 4;
  -ms-grid-row: 2;
}
.col:nth-of-type(6) > span,
.col:nth-of-type(7) > span {
  display: inline-block;
  width: 1em;
  height: 1em;
  white-space: nowrap;
  transform: 0 50%;
}
.col:nth-of-type(6) > span {
  font-size: 1.8em;
  line-height: 0.75;
  letter-spacing: 0.02em;
  transform: rotate(90deg) translateX(0.875em);
}
.col:nth-of-type(7) {
  -ms-grid-column: 5;
  -ms-grid-row: 2;
}
.col:nth-of-type(7) > span {
  line-height: 0;
  letter-spacing: 0.04em;
  transform: rotate(90deg) translateX(35.5em) scale(0.85, 1.25);
}
.col:last-of-type {
  -ms-grid-column: 6;
  -ms-grid-row: 2;
}
.col:last-of-type aside {
  display: grid;
  display: -ms-grid;
  grid-template-columns: 2.1fr 1fr 0.75fr 1fr;
  -ms-grid-columns: 2.1fr 1fr 0.75fr 1fr;
  grid-template-rows: 1fr 3fr;
  -ms-grid-rows: 1fr 3fr;
  grid-gap: 0 1em;
  margin-top: 1.5em;
  width: 63em;
  height: 10.5em;
  transform: translateY(-100%) rotate(90deg);
  transform-origin: 0 100%;
}
.col:last-of-type
aside
> div:first-of-type
> table
> tbody
> tr
> td:last-of-type,
.col:last-of-type aside > div:nth-of-type(4) > table td {
  width: 50%;
}
.col:last-of-type aside div:first-of-type td {
  vertical-align: top;
}
.col:last-of-type aside div:first-of-type td:first-child li {
  margin-bottom: 1.25em;
}
.col:last-of-type aside div:first-of-type td:nth-child(2) ul {
  line-height: 1.25;
  margin-bottom: 1.75em;
  padding-left: 0;
}
.col:last-of-type aside > div:nth-of-type(3) {
  width: 9em;
}
.col:last-of-type aside > div:nth-of-type(3) em {
  display: inline-block;
  font-size: 0.9em;
  letter-spacing: 0.02em;
  line-height: 1.2;
  vertical-align: top;
  transform: translateY(-0.5em);
}
.col:last-of-type aside div:nth-of-type(4) tbody tr:last-of-type {
  border-top: 2px solid currentColor;
}
.col:last-of-type aside div:nth-of-type(5) tr:not(:last-of-type) th {
  box-shadow: 0 -1px 0 #fff inset;
}
.col:last-of-type aside div:nth-of-type(5) th {
  line-height: 0;
}
.col:last-of-type aside div:nth-of-type(5) th:first-child {
  text-align: left;
  width: 26%;
}
.col:last-of-type aside div:nth-of-type(5) td:nth-child(2) {
  width: 30%;
}
.col:last-of-type aside div:nth-of-type(5) th:nth-child(3) {
  width: 20%;
}
.col:last-of-type aside div:nth-of-type(5) th:nth-child(3) span {
  display: inline-block;
  transform: translateY(0.5em);
}
.col:last-of-type aside div:nth-of-type(5) th:nth-child(3) span:first-of-type {
  transform: translateY(-0.5em);
}
.col:last-of-type aside div:nth-of-type(5) td:nth-child(4) {
  width: auto;
}
.col:last-of-type aside > div > table {
  width: 100%;
  height: 100%;
}
.col:last-of-type aside > div:first-of-type {
  grid-row: 1 / 3;
  -ms-grid-row: 1;
  -ms-grid-row-span: 2;
}
.col:last-of-type aside > div:nth-of-type(2) {
  -ms-grid-column: 2;
}
.col:last-of-type aside > div:nth-of-type(n + 3):nth-of-type(-n + 4),
.col:last-of-type aside > div:nth-of-type(4) input {
  text-align: center;
}
.col:last-of-type aside > div:nth-of-type(3) {
  line-height: 1;
  -ms-grid-column: 3;
}
.col:last-of-type aside > div:nth-of-type(4) {
  grid-column: 4 / 5;
  -ms-grid-column: 4;
  -ms-grid-column-span: 1;
  grid-row: 1 / 3;
  -ms-grid-row: 1;
  -ms-grid-row-span: 2;
}
.col:last-of-type aside > div:nth-of-type(4) tr:not(:last-of-type) td {
  vertical-align: top;
}
.col:last-of-type aside > div:nth-of-type(5) {
  grid-column: 2 / 4;
  -ms-grid-column: 2;
  -ms-grid-column-span: 2;
  grid-row: 2 / 3;
  -ms-grid-row: 2;
  -ms-grid-row-span: 1;
}
/* Bubbles */
.bubble-group {
  display: grid;
}
.col:first-of-type .bubble-group {
  grid-template-columns: repeat(5, 2.5em);
  grid-template-rows: repeat(4, 1.25em);
}
.col:nth-of-type(5) .bubble-group {
  grid-template-columns: 2em 2.5em 2.5em 2.5em 2.5em 2.5em;
  grid-template-rows: repeat(10, 1.25em);
}
.col:nth-of-type(5) .bubble-group:first-of-type {
  grid-template-rows: repeat(2, 1.25em);
}
.col:nth-of-type(5)
.bubble-group:first-of-type
span:nth-of-type(n + 1):nth-of-type(-n + 4) {
  font-size: 0.8em;
}
.col:nth-of-type(5) .bubble-group:first-of-type span:first-of-type {
  grid-column: 2 / 3;
}
.col:nth-of-type(5) .bubble-group:first-of-type span:nth-of-type(3) {
  grid-column: 4 / 6;
}
.col:nth-of-type(5) .bubble-group:not(:first-of-type):nth-of-type(odd) {
  border-radius: 0.375em;
  box-shadow: 0 0 0 2px inset;
}
.col:nth-of-type(5) .bubble-group:not(:first-of-type) strong {
  line-height: 1.25;
  text-align: right;
  margin-right: 0.25em;
}
.col:nth-of-type(7) span span {
  margin-left: 1em;
}
.bubble,
.bubble-inner {
  display: inline-block;
}
.bubble {
  box-shadow: 0 0 0 1px;
  cursor: pointer;
  font-size: 0.875em;
  height: 0.4em;
  margin: 0.5em;
  position: relative;
  line-height: 0.4;
  text-align: center;
  width: 1.75em;
}
.bubble:after {
  background-color: #555;
  content: "";
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  width: 0;
  height: 100%;
  transition: width 0.1s linear;
  z-index: 1;
}
.col:last-of-type li .bubble {
  margin: 0.5em 0.48em;
}
.bubble-inner {
  background-color: #fff;
  font-weight: bold;
  padding: 0.25em 0.13em;
  transform: translateY(-0.25em);
}
aside .bubble-inner {
  transform: translateY(-0.3em);
}
.filled {
  background-color: currentColor;
}
.filled .bubble-inner {
  background-color: transparent;
}
/* Miscellaneous */
.narrow-num {
  transform: translateY(-0.3em) scaleX(0.75);
}
.no-tt {
  text-transform: none;
}
.lg-bullet {
  background-color: currentColor;
  border-radius: 50%;
  display: inline-block;
  margin: 0.125em 0.65em 0.125em 0.35em;
  width: 0.45em;
  height: 0.45em;
}
.logo-text,
.logo sup {
  display: inline-block;
  vertical-align: top;
}
.logo {
  line-height: 1;
}
.logo-text {
  box-shadow: 0 -0.1em 0;
  border-radius: 50% 50% 0 0 / 45% 45% 0 0;
  font-weight: 300;
  letter-spacing: 0.825em;
  margin-right: 0.1em;
  padding-top: 0.75em;
  width: 11em;
  transform: scaleY(1.5);
  transform-origin: 50% 100%;
}
.form-no {
  display: inline-block;
  text-align: center;
  width: 100%;
}
.pencil {
  background: linear-gradient(
    -20deg,
    transparent 0.65em,
    currentColor 0.65em,
    currentColor 0.8em,
    #fff 0.8em
  )
  0 0 / 2.2em 0.7em,
  linear-gradient(
    200deg,
    transparent 0.65em,
    currentColor 0.65em,
    currentColor 0.8em,
    #fff 0.8em
  )
  0 0.75em / 2.2em 0.7em,
  linear-gradient(
    currentColor 1px,
    transparent 1px,
    transparent 1.3em,
    currentColor 1.3em
  )
  1.8em 0,
  linear-gradient(
    -90deg,
    currentColor 1.4em,
    transparent 1.4em,
    transparent 2.2em,
    currentColor 2.2em,
    currentColor 2.3em,
    transparent 2.3em,
    transparent 16.2em,
    currentColor 16.2em,
    currentColor 16.3em,
    transparent 16.3em,
    transparent 17.1em,
    currentColor 17.1em
  );
  background-repeat: no-repeat;
  font: 0.54em Palatino, serif;
  font-weight: bold;
  line-height: 1;
  margin: 1.5em auto 1.5em 0.75em;
  padding: 0.3em 0;
  text-align: center;
  height: 1.4em;
  width: 18em;
}
/* Table in table */
.example-table {
  display: flex;
}
.example-table p {
  flex-basis: 55%;
  line-height: 1.4;
  text-align: left;
}
.example-table table {
  border-radius: 0.25em;
}
.example-table .bubble-group {
  grid-template-columns: repeat(5, 2.5em);
  -ms-grid-columns: 2.5em 2.5em 2.5em 2.5em 2.5em;
  grid-template-rows: repeat(4, 1.25em);
  -ms-grid-rows: 1.25em 1.25em 1.25em 1.25em;
  grid-gap: 0.1em 0.2em;
  font-size: 0.5em;
}
.example-table code {
  display: inline-block;
  font-size: 0.7em;
  letter-spacing: 0.45em;
  transform: rotate(90deg);
  width: 1em;
  height: 1em;
}

/* IE 11 fix for bubble grid inside parent grid */
@media all and (-ms-high-contrast: none), (-ms-high-contrast: active) {
  .bubble-group {
    display: flex;
    flex-wrap: wrap;
    width: 13em;
  }
  .col:nth-of-type(5) .bubble-group {
    width: calc(100% - 2em);
  }
  .col:nth-of-type(5) .bubble-group > span {
    width: 3em;
  }
  .col:nth-of-type(5) .bubble-group > span:nth-of-type(3) {
    width: 6em;
  }
  .col:nth-of-type(5) .bubble-group > span:nth-of-type(5) {
    width: 2em;
  }
  .col:nth-of-type(5) .bubble-group > span:nth-of-type(6) {
    width: 2.4em;
  }
  .col:nth-of-type(5)
  .bubble-group
  > span:nth-of-type(5n + 1):nth-of-type(-n + 5) {
    margin-left: 2.5em;
  }
  .col:nth-of-type(5) .bubble-group > strong {
    width: 1.75em;
  }
  .col:last-of-type aside > div {
    margin: 0 0.5em;
  }
  .col:last-of-type aside > div:first-of-type {
    margin-left: 0;
  }
  .col:last-of-type aside > div:nth-of-type(5) {
    margin-top: 0.75em;
  }
}
input[type=text], select {
  width: 200%;
  padding: 0;
  margin: 0;
  display: inline-block;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}
</style>
