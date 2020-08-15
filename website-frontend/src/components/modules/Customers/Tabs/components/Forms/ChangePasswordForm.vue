<template>
  <v-form ref="form" @submit.prevent="update" v-model="valid" lazy-validation>
    <v-card-text>
      <v-flex xs12 sm12 md12>
        <v-text-field
          v-model="formData.old_password"
          :rules="[rules.required, rules.max50Chars]"
          :append-icon="showOldPassword ? 'mdi-eye' : 'mdi-eye-off'"
          :type="showOldPassword ? 'text' : 'password'"
          @click:append="showOldPassword = !showOldPassword"
          label="Old Password"
          required
          dense
        ></v-text-field>
      </v-flex>
      <v-flex xs12 sm12 md12>
        <v-text-field
          v-model="formData.new_password"
          :rules="[rules.required, rules.max50Chars]"
          :append-icon="showNewPassword ? 'mdi-eye' : 'mdi-eye-off'"
          :type="showNewPassword ? 'text' : 'password'"
          @click:append="showNewPassword = !showNewPassword"
          label="New Password"
          required
          dense
        ></v-text-field>
      </v-flex>
      <v-flex xs12 sm12 md12>
        <v-text-field
          v-model="formData.confirm_password"
          :rules="[rules.required, rules.max50Chars]"
          :append-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
          :type="showConfirmPassword ? 'text' : 'password'"
          @click:append="showConfirmPassword = !showConfirmPassword"
          label="Confirm Password"
          required
          dense
        ></v-text-field>
      </v-flex>
    </v-card-text>
    <v-divider></v-divider>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn small text color="blue darken-1" @click="reset">Reset</v-btn>
      <v-btn small text color="blue darken-1" type="submit" :disabled="!valid">Update</v-btn>
    </v-card-actions>
  </v-form>
</template>

<script>
import Mixins from "@/helpers/Mixins.js";
import { mapState, mapActions, mapMutations } from "vuex";

export default {
  mixins: [Mixins],

  data: () => ({
    valid: true,
    showOldPassword: false,
    showNewPassword: false,
    showConfirmPassword: false,
    defaultFormData: {
      old_password: "",
      new_password: "",
      confirm_password: ""
    },
    formData: {
      old_password: "",
      new_password: "",
      confirm_password: ""
    },
  }),

  computed: {
    ...mapState("customerAuthentication", ["customerInfo"]),
  },

  methods: {
    ...mapMutations("snackbars", { setSnackbar: "SET_SNACKBAR"}),
    ...mapActions("customers", { changeCustomerPassword: "changePassword" }),

    reset() {
      this.formData = Object.assign({}, this.defaultFormData);
    },

    update() {
      if (this.$refs.form.validate()) {
        if (this.formData.new_password === this.formData.confirm_password) {
          this.formData.id = this.customerInfo.id;
          this.changeCustomerPassword(this.formData)
            .then(response => {
              let obj = {
                color: "success",
                snackbar: true,
                text: response.data.message,
                timeout: 3000
              };
              
              if (response.data.result) this.reset();
              else obj.color = "error";
              this.setSnackbar(obj);
            })
            .catch(err => console.log(err));
        } else {
          this.setSnackbar({
            color: "error",
            snackbar: true,
            text: "New password and confirm password must be the same.",
            timeout: 3000
          });
        }
      }
    },
  },
};
</script>
