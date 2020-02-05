<template>
  <v-container fluid grid-list-sm>
    <v-layout row wrap>
      <v-flex xs12 sm12 md6 lg6 offset-md3 offset-lg3>
        <Snackbars />
        <v-card fluid>
          <v-card-title>Welcome to E-Commerce! Please login.</v-card-title>
          <v-card-text>
            <v-layout row wrap>
              <v-flex xs12 sm12 md8 lg8 offset-md2 offset-lg2>
                <v-form @submit.prevent="login" ref="form" lazy-validation>
                  <v-text-field
                    v-model="email"
                    :rules="emailRules"
                    label="Email"
                    required
                    outlined
                    dense
                  ></v-text-field>

                  <v-text-field
                    v-model="password"
                    :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="showPassword ? 'text' : 'password'"
                    :rules="passwordRules"
                    label="Password"
                    @click:append="showPassword = !showPassword"
                    required
                    outlined
                    dense
                  ></v-text-field>

                  <v-label>
                    New customer?
                    <router-link v-bind:to="'/register'">Register</router-link> here.
                  </v-label>
                  <br />
                  <br />

                  <v-btn color="success" class="mr-4" type="submit">Login</v-btn>
                </v-form>
              </v-flex>
            </v-layout>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import Snackbars from "../components/utilities/Snackbars";
import { mapActions, mapMutations } from "vuex";

export default {
  components: {
    Snackbars
  },

  data: () => ({
    email: "",
    password: "",
    emailRules: [v => !!v || "Email is required"],
    passwordRules: [v => !!v || "Password is required"],
    showPassword: false
  }),

  methods: {
    ...mapMutations("snackbars", { setSnackbar: "SET_SNACKBAR"}),

    login() {
      if (this.$refs.form.validate()) {
        let obj = {
          email: this.email,
          password: this.password
        };
        
        console.log("LOGIN", obj)
      }
    }
  }
};
</script>
