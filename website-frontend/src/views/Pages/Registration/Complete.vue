<template>
  <v-layout row wrap>
    <v-container>
      <v-layout row wrap>
        <Snackbars />
        <v-flex xs12 sm12 md6 lg6 offset-md3 offset-lg3>
          <v-card fluid>
            <v-card-title class="justify-center">
              <v-icon x-large color="success"
                >mdi-clipboard-check-outline</v-icon
              >
              <span>Registration Complete</span>
            </v-card-title>
            <v-card-text>
              <v-container fluid grid-list-lg class="text-center">
                <span class="subtitle-1 black--text"
                  >We will send you an email to validate your account!</span
                >
              </v-container>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-layout>
</template>

<script>
import Mixins from "@/helpers/Mixins.js";
import Snackbars from "@/components/utilities/Snackbars";
import { mapActions, mapMutations } from "vuex";

export default {
  mixins: [Mixins],
  components: {
    Snackbars,
  },

  data: () => ({
    formData: {
      firstname: "",
      middlename: "",
      lastname: "",
      email: "",
      password: "",
      primary_address: "",
      contact_no: "",
      gender_type: "",
    },
    showPassword: false,
  }),

  methods: {
    ...mapMutations("snackbars", { setSnackbar: "SET_SNACKBAR" }),
    ...mapActions("customers", { saveCustomerData: "saveData" }),

    register() {
      if (this.$refs.form.validate()) {
        this.saveCustomerData(this.formData)
          .then((response) => {
            if (!response.data.result) {
              let obj = {
                color: "error",
                snackbar: true,
                text: response.data.message,
                timeout: 3000,
              };
              this.setSnackbar(obj);
            } else {
              this.$router.push("/register/complete");
              this.formData = this.defaultFormData;
            }
          })
          .catch((err) => console.log(err));
      }
    },
  },
};
</script>
