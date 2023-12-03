<template>
<div>
  <v-toolbar flat>
    <v-dialog v-model="dialog" persistent max-width="500">
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
            <v-card-text>
              <v-container>
                <v-row dense align="baseline" justify="center">
                  <v-col cols="12">
                    <validation-provider
                      v-slot="{ errors }"
                      name="Name"
                      vid="name"
                      rules="required|max:191"
                    >
                      <v-text-field
                        v-model="form.title"
                        :error-messages="errors"
                        label="Name"
                        required
                        dense
                        hide-details="auto"
                        outlined
                      ></v-text-field>
                    </validation-provider>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="primary"
                class="mx-2 white--text"
                type="submit"
                :disabled="invalid"
                :loading="loader.isSubmitting"
                depressed
              >
                {{ 'Update' }}
              </v-btn>
              <v-btn class="mr-2 error darken-1 white--text" depressed @click="closeModal">Close</v-btn>
            </v-card-actions>
          </v-form>
        </validation-observer>
      </v-card>
    </v-dialog>
  </v-toolbar>
  <v-divider></v-divider>
  <draggable-tree :data="datas" draggable="draggable" crosstree="crossTree">
    <div slot-scope="{data, store, vm}">
      <template v-if="!data.isDragPlaceHolder">
        <v-list-item-content class="pa-0 ma-0">
          <v-list-item-title>
            <b v-if="data.children &amp;&amp; data.children.length" @click="store.toggleOpen(data)">
              {{data.open ? '&apos;-&apos;' : '&apos;+&apos;'}}&nbsp;
            </b>
            <span v-if="data.title.length > 9"> {{  data.title.substring(0,10)+'..' }} </span>
            <span v-else>{{ data.title }}</span>
            <template>
              <v-btn fab x-small color="orange darken-1" @click="createOrUpdate(data)" v-if="$can('edit',pageInfo.permission)">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
            </template>
            <v-btn fab x-small color="error" class="ml-1" @click="removeItem(data)" v-if="$can('remove',pageInfo.permission)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>

          </v-list-item-title>
        </v-list-item-content>
      </template>
    </div>
  </draggable-tree>
  <v-card-actions>
    <v-spacer></v-spacer>
    <v-btn
      @click="submitRearrange()"
      color="green darken-1"
      class="mx-2 white--text"
      type="submit"
      :disabled="datas.length<1"
      :loading="loader.isSubmitting"
      depressed
    >
      {{ 'Update' }}
    </v-btn>
  </v-card-actions>
</div>


</template>

<script>
import {common as commonMixin} from "@/mixins/common";
import {mapGetters} from 'vuex'
const permission = 'Tutorial Category'
export default {
  name:'CategoryItem',
  mixins: [commonMixin],
  data() {
    return {
      pageInfo: {
        permission,
        url:'/tutorial-category/',
      },
      loader: {isLoading: false, isSubmitting: false, isDeleting: false},
      dialog: false,
      p_menu_id:null,
      selectedItem: {},
      edit_mode:false,
      datas: [],
      test2:[],
      form:{
        title:null,
      }
    }
  },
  async mounted() {
    await this.init()
  },
  methods: {
    async init(){
      this.loader.isLoading = true
      await this.$axios.get(this.pageInfo.url+'arranged/list').then((response) => {
        this.datas = response.data.data;
      }).catch(() => {
        this.datas=[];
      }).finally(() => {
        this.loader.isLoading = false
      })
    },
    createOrUpdate(item=null) {
      this.edit_mode=false
      this.selectedItem = {}
      if (item){
        this.edit_mode=true
        this.selectedItem = item
        this.form = {
          title: item.title,
        }
      }else {
        this.form = {
          title: null,
        }
      }

      this.dialog = true
    },
    async submitData() {
      this.loader.isSubmitting = true
      const formData = this.$generateFormData(this.form, this.edit_mode)
      let url = this.pageInfo.url
      if(this.edit_mode)  url += this.selectedItem.id

      await this.$axios.post(url, formData).then((response) => {
        this.$toaster.success('Update successfully');
        this.closeModal()
        this.init();
      }).catch((error) => {
        this.$refs.observer.setErrors(error?.response?.data?.errors)
        if (error.response.status === 422) {
          Object.keys(error.response.data).map((field) => {
            this.$toaster.error(error.response.data[field][0]);
          });
        } else this.$toaster.error(error.response.data.message);
      }).finally(() => {
        this.loader.isSubmitting = false
      })
    },
    async removeItem(item) {
      this.$swal.fire({
        title: 'Are you sure?',
        icon: 'warning',
        text: `Do you want to delete this menu?`,
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes'
      }).then(async (result) => {
        if (result.isConfirmed) {
          this.loader.isDeleting = true
          await this.$axios.delete(this.pageInfo.url+`${item.id}`).then((response) => {
            this.$toaster.success('Removed successfully')
            this.init();
          }).catch(() => {
            this.$toaster.error('Something went wrong!!')
          }).finally(() => this.loader.isDeleting = 0)
        }
      })
    },
    closeModal() {
      this.dialog = false
      this.clear()
    },
    clear() {
      this.editIndex = -1
      this.$refs.form.reset()
      this.$refs.observer.reset()
    },
    test(dd){
      return dd.map((item,key)=>{
        if (item.parent.isRoot){
          this.test2.push({
            id:item.id,
            position:key,
            parent:item.parent.id??null,
          });
        }else{
          this.test2.push({
            id:item.id,
            position:key,
            parent:item.parent.id??null,
        });
        }
        if (item.children.length){
            this.test(item.children);
        }
      });
    },
    async submitRearrange(){
      this.loader.isSubmitting = true
      //make previous data empty
      this.test2=[];
      //make data rearrange
      this.test(this.datas);
      let data2 = new FormData();
      data2.append('items',JSON.stringify(this.test2));

      await this.$axios.post(`/tutorial-category/rearrange`,data2).then((response) => {
        this.$toaster.success(response.data.message)
        //this.data=response.data;
      }).catch(() => {
        //this.data=[];
      }).finally(() => {
        this.loader.isSubmitting = false
      })
    },
  },
}
</script>
<style>
.he-tree{
  border: 1px solid #ccc;
  padding: 20px;
  width: 300px;
}
.tree-node-inner{
  padding: 5px;
  border: 1px solid #ccc;
  cursor: pointer;
}
.draggable-placeholder-inner{
  border: 1px dashed #0088F8;
  box-sizing: border-box;
  background: rgba(0, 136, 249, 0.09);
  color: #0088f9;
  text-align: center;
  padding: 0;
  display: flex;
  align-items: center;
}
</style>

