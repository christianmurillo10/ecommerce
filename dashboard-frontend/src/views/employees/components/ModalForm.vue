<template>
  <v-form ref="form" @submit.prevent="save" v-model="valid" lazy-validation>
    <v-card>
      <v-card-title>
        <v-icon class="black--text">{{ formIcon }}</v-icon><span class="title">{{ formTitle }}</span>
      </v-card-title>
      <v-card-text>
        <v-container grid-list-md>
          <v-layout wrap>
            <v-flex xs12 sm12 md12>
              <v-layout wrap row>
                <v-flex xs12 sm12 md6>
                  <v-menu
                    ref="date_hired"
                    v-model="date_hired"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    :return-value.sync="formData.date_hired"
                    lazy
                    transition="scale-transition"
                    offset-y
                    full-width
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        v-model="formData.date_hired"
                        label="Date Hired"
                        prepend-icon="event"
                        readonly
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker v-model="formData.date_hired" no-title scrollable>
                      <v-spacer></v-spacer>
                      <v-btn flat color="primary" @click="date_hired = false">Cancel</v-btn>
                      <v-btn flat color="primary" @click="$refs.date_hired.save(formData.date_hired)">OK</v-btn>
                    </v-date-picker>
                  </v-menu>
                </v-flex>
                <v-flex xs12 sm12 md6 v-if="formType === 'update' && formData.is_active === 0">
                  <v-menu
                    ref="date_endo"
                    v-model="date_endo"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    :return-value.sync="formData.date_endo"
                    lazy
                    transition="scale-transition"
                    offset-y
                    full-width
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        v-model="formData.date_endo"
                        label="Date Endo"
                        prepend-icon="event"
                        readonly
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker v-model="formData.date_endo" no-title scrollable>
                      <v-spacer></v-spacer>
                      <v-btn flat color="primary" @click="date_endo = false">Cancel</v-btn>
                      <v-btn flat color="primary" @click="$refs.date_endo.save(formData.date_endo)">OK</v-btn>
                    </v-date-picker>
                  </v-menu>
                </v-flex>
              </v-layout>
            </v-flex>
            <v-flex xs12 sm12 md4>
              <v-text-field
                v-model="formData.firstname"
                :rules="[rules.required, rules.max50Chars]"
                label="Firstname"
                required
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm12 md4>
              <v-text-field
                v-model="formData.middlename"
                :rules="[rules.max50Chars]"
                label="Middlename"
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm12 md4>
              <v-text-field
                v-model="formData.lastname"
                :rules="[rules.required, rules.max50Chars]"
                label="Lastname"
                required
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm12 md6>
              <v-text-field
                v-model="formData.primary_address"
                :rules="[rules.required, rules.max255Chars]"
                label="Primary Address"
                required
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm12 md6>
              <v-text-field
                v-model="formData.secondary_address"
                :rules="[rules.max255Chars]"
                label="Secondary Address"
                required
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm12 md4>
              <v-text-field
                v-model="formData.email"
                :rules="[rules.required, rules.email]"
                label="Email"
                required
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm12 md4>
              <v-text-field
                v-model="formData.contact_no"
                :rules="[rules.max100Chars]"
                label="Contact No."
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm12 md4>
              <v-autocomplete
                :items="genderTypeList"
                item-text="name"
                item-value="id"
                v-model="formData.gender_type"
                label="Gender"
              ></v-autocomplete>
            </v-flex>
            <v-flex xs12 sm12 md4 v-if="formType === 'update'">
              <v-autocomplete
                :items="yesOrNoList"
                item-text="name"
                item-value="id"
                v-model="formData.is_active"
                label="Active?"
              ></v-autocomplete>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" flat @click="close">Cancel</v-btn>
        <v-btn color="blue darken-1" type="submit" flat :disabled="!valid">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-form>
</template>

<script>
import Index from "../Index";
import Mixins from "@/helpers/Mixins.js";
import { mapGetters, mapActions } from "vuex";

export default {
  mixins: [Mixins],
  components: {
    Index
  },

  data: () => ({
    date_hired: false,
    date_endo: false,
    defaultFormData: {
      firstname: "",
      middlename: "",
      lastname: "",
      email: "",
      primary_address: "",
      secondary_address: "",
      contact_no: "",
      gender_type: "",
      date_hired: new Date().toISOString().substr(0, 10),
      date_endo: new Date().toISOString().substr(0, 10),
      is_active: ""
    },
    formType: "new",
    formData: {
      firstname: "",
      middlename: "",
      lastname: "",
      email: "",
      primary_address: "",
      secondary_address: "",
      contact_no: "",
      gender_type: "",
      date_hired: new Date().toISOString().substr(0, 10),
      date_endo: new Date().toISOString().substr(0, 10),
      is_active: ""
    },
    valid: true
  }),

  computed: {
    ...mapGetters("employees", ["getEmployeeById"]),
    formTitle() {
      return this.formType === "new" ? "Employee - Create" : "Employee - Update";
    },
    formIcon() {
      return this.formType === "new" ? "add_box" : "edit";
    }
  },

  methods: {
    ...mapActions("alerts", ["setAlert"]),
    ...mapActions("employees", {
      saveEmployeeData: "saveData",
      updateEmployeeData: "updateData"
    }),

    editItem(id) {
      let data = this.getEmployeeById(id);
      this.formData.id = data.id;
      this.formData.firstname = data.firstname;
      this.formData.middlename = data.middlename;
      this.formData.lastname = data.lastname;
      this.formData.email = data.email;
      this.formData.primary_address = data.primary_address;
      this.formData.secondary_address = data.secondary_address;
      this.formData.contact_no = data.contact_no;
      this.formData.gender_type = data.gender_type;
      this.formData.date_hired = data.date_hired;
      this.formData.date_endo = data.date_endo;
      this.formData.is_active = data.is_active;
      this.formType = "update";
    },

    close() {
      this.$emit("setDialog", false);
      this.formType = "new";
      setTimeout(() => {
        this.formData = Object.assign({}, this.defaultFormData);
      }, 300);
    },

    save() {
      if (this.$refs.form.validate()) {
        if (this.formType === "new") {
          this.saveEmployeeData(this.formData)
            .then(response => {
              let obj = {
                alert: true,
                type: "success",
                message: response.data.message
              };
              
              if (!response.data.result) obj.type = "error"
              this.setAlert(obj);
            })
            .catch(err => console.log(err));
        } else if (this.formType === "update") {
          this.updateEmployeeData(this.formData)
            .then(response => {
              let obj = {
                alert: true,
                type: "success",
                message: response.data.message
              };
              
              if (!response.data.result) obj.type = "error"
              this.setAlert(obj);
            })
            .catch(err => console.log(err));
        }
        this.close();
      }
    }
  }
};
</script>