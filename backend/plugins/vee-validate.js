import Vue from 'vue'
// VeeValidate
import { ValidationObserver } from "vee-validate";
import { ValidationProvider } from 'vee-validate/dist/vee-validate.full.esm';
Vue.component("ValidationObserver", ValidationObserver);
Vue.component("ValidationProvider", ValidationProvider);
