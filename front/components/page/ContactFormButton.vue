<template>
  <section>
    <div class="instructor-title our-instructor-bg">
      <h2 class=""></h2>
    </div>
    <v-container fluid>
      <v-row>
        <v-col cols="12">
          <div class="justify-content-center text-center">
            <v-btn color="primary" outlined depressed to="/page/contact-us">
              Contact Us <v-icon class="ml-1"> mdi-contacts </v-icon>
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<script>
export default {
  name: 'ContactFormButton',
  auth:false,
  data(){
    return{
      loader: {isLoading: false, isSubmitting: false, isDeleting: false},
    }
  },
}
</script>

