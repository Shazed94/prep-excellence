<template>
  <v-card
    elevation="16"
    max-width="400"
    class="mx-auto"
  >
    <v-card-title class="grey text--darken-1">
      <span class="text-h6">Pages</span>
      <v-spacer></v-spacer>
    </v-card-title>
    <v-row>
      <v-col cols="12" xs="12" sm="12">
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

    <v-virtual-scroll
      :bench="benched"
      :items="pages"
      height="300"
      item-height="64"
    >
      <template v-slot:default="{ item }">
        <v-list-item :key="item.id">
          <v-list-item-action>
            <v-checkbox
              v-model="selected"
              :value="item.id"
            ></v-checkbox>
          </v-list-item-action>

          <v-list-item-content>
            <v-list-item-title>
              {{ item.title }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-divider></v-divider>
      </template>
    </v-virtual-scroll>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn v-if="$can('create','Menu')"
        color="green darken-1"
        class="mx-2 white--text"
        type="submit"
        @click="submitData()"
        :disabled="!selected.length || !p_menu_id"
        :loading="loader.isSubmitting"
        depressed
      >
        {{ 'Add to menu' }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>

import {mapGetters} from "vuex";

export default {
  data: () => ({
    benched: 0,
    selected:[],
    p_menu_id:null,
    loader: {isLoading: false, isSubmitting: false, isDeleting: false},
  }),
  computed: {
    ...mapGetters('public/settings/page',['pages']),
    ...mapGetters('public/settings/menu',['p_menus']),
    length () {
      return 7000
    },
  },
  methods:{
    async submitData() {
      this.loader.isSubmitting = true
      const formData = new FormData();
      formData.append('p_menu_id',this.p_menu_id);
      formData.append('relation_with','page');
      for (let i = 0; i < this.selected.length; i++){
        formData.append('relation_id[]',this.selected[i]);
      }
      await this.$axios.post('/menu-item/', formData).then((response) => {
        this.$toaster.success('Menu item added successfully!!')
      }).catch((error) => {
        if (error.response.status === 422) {
          Object.keys(error.response.data).map((field) => {
            this.$toaster.error(error.response.data[field][0]);
          });
        } else this.$toaster.error(error.response.data.message);
      }).finally(() => {
        this.loader.isSubmitting = false
      })
    },
  }
}
</script>

