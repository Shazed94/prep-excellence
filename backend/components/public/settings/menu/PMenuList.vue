<template>
<div>
<!--  <draggable-tree :data="data" draggable="draggable" crosstree="crossTree" @drag="ondrag">
    <div slot-scope="{data, store, vm}">
      <template v-if="!data.isDragPlaceHolder">
        <b v-if="data.children &amp;&amp; data.children.length" @click="store.toggleOpen(data)">
          {{data.open ? '&apos;-&apos;' : '&apos;+&apos;'}}&nbsp;
        </b>
        <span>{{data.text}}</span>
      </template>
    </div>
  </draggable-tree>-->
  <v-toolbar flat>
    <v-dialog v-model="dialog" persistent max-width="500">
      <v-card>
        <validation-observer ref="observer" v-slot="{ invalid }">
          <v-form ref="form" @submit.prevent="submitData()">
            <v-card-text>
              <v-container>
                <v-row dense align="baseline" justify="center">
                  <v-col cols="12" xs="12" sm="12">
                    <validation-provider
                      v-slot="{ errors }"
                      name="Name"
                      vid="name"
                      rules="required|max:191"
                    >
                      <v-text-field
                        v-model="form.name"
                        :error-messages="errors"
                        label="Name"
                        required
                        dense
                        hide-details="auto"
                        outlined
                      ></v-text-field>
                    </validation-provider>
                  </v-col>
                  <v-col cols="12" xs="12" sm="12">
                    <validation-provider
                      v-slot="{ errors }"
                      name="url"
                      vid="url"
                      rules="required|max:191"
                    >
                      <v-text-field
                        v-model="form.url"
                        :error-messages="errors"
                        label="URL"
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
                color="green darken-1"
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
  <v-row dense>
    <v-col cols="12" xs="12" sm="6">
      <validation-provider v-slot="{ errors }" name="menu id" vid="menu_id" rules="required">
        <v-select
          v-model="p_menu_id"
          :items="p_menus"
          :error-messages="errors"
          item-text="name"
          item-value="id"
          label="Select Menu"
          dense
          clearable
          hide-details="auto"
          outlined></v-select>
      </validation-provider>
    </v-col>
  </v-row>
  <draggable-tree :data="data" draggable="draggable" crosstree="crossTree">
    <div slot-scope="{data, store, vm}">
      <template v-if="!data.isDragPlaceHolder">
        <v-list-item-content class="pa-0 ma-0">
          <v-list-item-title>
            <b v-if="data.children &amp;&amp; data.children.length" @click="store.toggleOpen(data)">
              {{data.open ? '&apos;-&apos;' : '&apos;+&apos;'}}&nbsp;
            </b>
            {{  data.relation_with === 'custom_link' ? data.name : pageTitleById(data.relation_id) }}
            <template v-if="data.relation_with === 'custom_link'">
              <v-btn fab x-small color="orange darken-1" @click="createOrUpdate(data)" v-if="$can('edit',pageInfo.permission)">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
            </template>
            <v-btn fab x-small color="error" class="ml-1" @click="removeMenuItem(data)" v-if="$can('remove',pageInfo.permission)">
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
      :disabled="data.length<1"
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
const permission = 'Menu'
export default {
  mixins: [commonMixin],
  data() {
    return {
      pageInfo: {
        permission: permission
      },
      loader: {isLoading: false, isSubmitting: false, isDeleting: false},
      dialog: false,
      p_menu_id:null,
      selectedItem: {},
      data: [],
      test2:[],
      form:{
        name:'',
        url:'',
      }
    }
  },
  computed: {
    ...mapGetters('public/settings/menu',['p_menus']),
    ...mapGetters('public/settings/page',['pageTitleById']),
    editMode() {
      return this.editIndex > -1
    }
  },
  methods: {
    createOrUpdate(item) {
      this.selectedItem = item
      this.form = {
        name: item.name,
        url: item.url,
      }
      this.dialog = true
    },
    async submitData() {
      this.loader.isSubmitting = true
      const formData = this.$generateFormData(this.form, true)
      formData.append('p_menu_id',this.p_menu_id);
      formData.append('relation_with','custom_link');
      let url = '/menu-item/' + this.selectedItem.id

      await this.$axios.post(url, formData).then((response) => {
        this.$toaster.success('Update successfully');
        this.closeModal()
        this.findMenuItems();
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
    async removeMenuItem(item) {
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
          await this.$axios.delete(`/menu-item/ ${item.id}`).then((response) => {
            if (response.data.status === 'success') {
              this.$toaster.success(response.data.message)
              this.findMenuItems();
            }
            else this.$toaster.error(response.data.message)
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
      this.test(this.data);
      let data2 = new FormData();
      data2.append('menus',JSON.stringify(this.test2));

      await this.$axios.post(`menu-item/rearrange`,data2).then((response) => {
        //this.data=response.data;
      }).catch(() => {
        //this.data=[];
      }).finally(() => {
        this.loader.isSubmitting = false
      })
    },
    async findMenuItems(){
      this.loader.isSubmitting = true
      await this.$axios.get(`/menu-item/find/by/menu/${this.p_menu_id}`).then((response) => {
        this.data=response.data;
      }).catch(() => {
        this.data=[];
      }).finally(() => {
        this.loader.isSubmitting = false
      })
    }
  },
  watch:{
    p_menu_id(){
      this.data=[];
      if (this.p_menu_id) this.findMenuItems();
      else this.data=[];
    }
  }
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

