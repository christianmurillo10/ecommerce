<template>
  <v-layout wrap>
    <v-container class="content">
      <Snackbars />
      <v-flex xs12 sm12 md8 lg8 offset-md2 offset-lg2>
        <v-card outlined>
          <v-card-title>
            <span>
              Welcome to <span class="blue--text">E-Commerce!</span>
              Please login.
            </span>
            <v-spacer></v-spacer>
            <span class="caption">
              New member?
              <router-link v-bind:to="'/register'">Register</router-link>
              here.
            </span>
          </v-card-title>
          <v-card-text>
            <v-container fluid grid-list-lg>
              <v-form @submit.prevent="login" ref="form" lazy-validation>
                <v-layout row wrap>
                  <v-flex xs12 sm12 md6 lg6>
                    <v-text-field
                      v-model="email"
                      :rules="emailRules"
                      label="Email"
                      required
                      outlined
                      rounded
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
                      rounded
                      dense
                    ></v-text-field>
                    <div class="text-right">
                      <span class="caption">
                        <router-link v-bind:to="'/forgot-password'">
                          Forgot Password?
                        </router-link>
                      </span>
                    </div>
                  </v-flex>
                  <v-flex xs12 sm12 md6 lg6>
                    <v-layout wrap row>
                      <v-flex xs12 sm12 md12 lg12>
                        <v-btn block rounded dark color="blue" type="submit">
                          Login
                        </v-btn>
                      </v-flex>
                      <v-flex xs12 sm12 md12 lg12>
                        <v-layout wrap row>
                          <v-flex xs12 sm12 md12 lg12>
                            <span class="caption">Or, sign up with</span>
                          </v-flex>
                          <v-flex xs12 sm12 md6 lg6>
                            <v-btn block rounded outlined dark color="indigo">
                              <v-icon left>mdi-facebook</v-icon>
                              Facebook
                            </v-btn>
                          </v-flex>
                          <v-flex xs12 sm12 md6 lg6>
                            <v-btn block rounded outlined dark color="red">
                              <v-icon left>mdi-google-plus</v-icon>
                              Google
                            </v-btn>
                          </v-flex>
                        </v-layout>
                      </v-flex>
                    </v-layout>
                  </v-flex>
                </v-layout>
              </v-form>
            </v-container>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-container>
  </v-layout>
</template>

<script>
import Snackbars from "@/components/utilities/Snackbars";
import { mapActions, mapMutations } from "vuex";

export default {
  components: {
    Snackbars,
  },

  data: () => ({
    email: "",
    password: "",
    emailRules: [(v) => !!v || "Email is required"],
    passwordRules: [(v) => !!v || "Password is required"],
    showPassword: false,
  }),

  methods: {
    ...mapMutations("snackbars", { setSnackbar: "SET_SNACKBAR" }),
    ...mapActions("customerAuthentication", ["setLogin"]),

    login() {
      if (this.$refs.form.validate()) {
        let obj = {
          email: this.email,
          password: this.password,
        };

        this.setLogin(obj)
          .then((response) => {
            if (!response.result) {
              let obj = {
                color: "error",
                snackbar: true,
                text: response.message,
                timeout: 3000,
              };
              this.setSnackbar(obj);
            } else {
              this.$router.push("/");
            }
          })
          .catch((err) => console.log(err));
      }
    },
  },
};
</script>
