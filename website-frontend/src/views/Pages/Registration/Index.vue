<template>
  <v-layout wrap>
    <v-container class="content">
      <Snackbars />
      <Loading />
      <v-flex xs12 sm12 md8 lg8 offset-md2 offset-lg2>
        <v-card flat>
          <v-card-title>
            <span>
              Create your <span class="blue--text">E-Commerce</span> Account
            </span>
            <v-spacer></v-spacer>
            <span class="caption">
              Already member?
              <router-link v-bind:to="'/login'">Login</router-link>
              here.
            </span>
          </v-card-title>
          <v-card-text>
            <v-container fluid grid-list-lg>
              <v-form @submit.prevent="register" ref="form" lazy-validation>
                <v-layout row wrap>
                  <v-flex xs12 sm12 md6 lg6>
                    <v-text-field
                      v-model="formData.firstname"
                      :rules="[rules.required, rules.max50Chars]"
                      label="Firstname"
                      required
                      outlined
                      rounded
                      dense
                    ></v-text-field>
                    <v-text-field
                      v-model="formData.middlename"
                      :rules="[rules.max50Chars]"
                      label="Middlename"
                      outlined
                      rounded
                      dense
                    ></v-text-field>
                    <v-text-field
                      v-model="formData.lastname"
                      :rules="[rules.required, rules.max50Chars]"
                      label="Lastname"
                      required
                      outlined
                      rounded
                      dense
                    ></v-text-field>
                    <v-text-field
                      v-model="formData.email"
                      :rules="[rules.required, rules.email]"
                      label="Email"
                      required
                      outlined
                      rounded
                      dense
                    ></v-text-field>
                    <v-text-field
                      v-model="formData.password"
                      :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                      :type="showPassword ? 'text' : 'password'"
                      :rules="[rules.required, rules.max50Chars]"
                      label="Password"
                      @click:append="showPassword = !showPassword"
                      required
                      outlined
                      rounded
                      dense
                    ></v-text-field>
                    <v-text-field
                      v-model="formData.primary_address"
                      :rules="[rules.required, rules.max255Chars]"
                      label="Primary Address"
                      required
                      outlined
                      rounded
                      dense
                    ></v-text-field>
                    <v-text-field
                      v-model="formData.contact_no"
                      :rules="[rules.max100Chars]"
                      label="Contact No."
                      outlined
                      rounded
                      dense
                    ></v-text-field>
                    <v-autocomplete
                      v-model="formData.gender_type"
                      :items="genderTypeList"
                      item-text="name"
                      item-value="id"
                      label="Gender"
                      outlined
                      rounded
                      dense
                    ></v-autocomplete>
                  </v-flex>
                  <v-flex xs12 sm12 md6 lg6>
                    <v-layout wrap row>
                      <v-flex xs12 sm12 md12 lg12>
                        <v-btn block rounded dark color="blue" type="submit">
                          Sign up
                        </v-btn>
                      </v-flex>
                      <v-flex xs12 sm12 md12 lg12>
                        <span class="caption">
                          By clicking "SIGN UP", I agree to E-Commerce
                          <router-link v-bind:to="'/terms-and-conditions'">
                            Terms & Conditions
                          </router-link>
                          and
                          <router-link v-bind:to="'/privacy-policy'">
                            Privacy Policy
                          </router-link>
                        </span>
                      </v-flex>
                      <v-flex xs12 sm12 md12 lg12>
                        <v-layout wrap row>
                          <v-flex xs12 sm12 md12 lg12>
                            <span class="caption">Or, sign up with</span>
                          </v-flex>
                          <v-flex xs12 sm12 md6 lg6>
                            <v-btn block rounded outlined dark color="indigo">
                              <v-icon left>mdi-facebook</v-icon>Facebook
                            </v-btn>
                          </v-flex>
                          <v-flex xs12 sm12 md6 lg6>
                            <v-btn block rounded outlined dark color="red">
                              <v-icon left>mdi-google-plus</v-icon>Google
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
import Mixins from "@/helpers/Mixins.js";
import Snackbars from "@/components/utilities/Snackbars";
import Loading from "@/components/utilities/Loading";
import { mapActions, mapMutations } from "vuex";

export default {
  mixins: [Mixins],
  components: {
    Snackbars,
    Loading,
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
    ...mapMutations("loading", { setLoading: "SET_LOADING" }),
    ...mapActions("customers", { saveCustomerData: "saveData" }),

    register() {
      if (this.$refs.form.validate()) {
        this.setLoading({ dialog: true, text: "Please wait" });
        this.saveCustomerData(this.formData)
          .then((response) => {
            if (response.status === "error") {
              let obj = {
                color: "error",
                snackbar: true,
                text: response.errors[0],
                timeout: 3000,
              };
              this.setSnackbar(obj);
              this.setLoading({ dialog: false, text: "" });
            } else {
              this.setLoading({ dialog: false, text: "" });
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
