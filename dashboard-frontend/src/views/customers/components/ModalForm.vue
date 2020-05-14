<template>
  <v-card>
    <v-card-title>
      <v-icon class="black--text">{{ formIcon }}</v-icon><span class="title">{{ formTitle }}</span>
    </v-card-title>
    <v-form ref="form" @submit.prevent="save" v-model="valid" lazy-validation>
      <v-card-text>
        <v-container grid-list-md>
          <v-layout wrap>
            <v-flex xs12 sm12 md12>
              <v-layout wrap justify-center>
                <img :src="formData.file_path" height="180" width="180" />
              </v-layout>
            </v-flex>
            <v-flex xs12 sm12 md12>
              <v-layout wrap justify-center>
                <v-btn small outline @click="pickFile">Upload Image</v-btn>
                <input
                  type="file"
                  style="display: none"
                  ref="image"
                  accept="image/*"
                  @change="onFilePicked"
                />
              </v-layout>
            </v-flex>
            <v-flex xs12 sm12 md12>
              <v-text-field
                v-model="formData.firstname"
                :rules="[rules.required, rules.max50Chars]"
                label="Firstname"
                required
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm12 md12>
              <v-text-field
                v-model="formData.middlename"
                :rules="[rules.max50Chars]"
                label="Middlename"
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm12 md12>
              <v-text-field
                v-model="formData.lastname"
                :rules="[rules.required, rules.max50Chars]"
                label="Lastname"
                required
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm12 md12>
              <v-text-field
                v-model="formData.email"
                :rules="[rules.required, rules.email]"
                label="Email"
                required
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm12 md12 v-if="formType === 'new'">
              <v-text-field
                v-model="formData.password"
                :rules="[rules.required, rules.max50Chars]"
                label="Password"
                type="password"
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm12 md12>
              <v-text-field
                v-model="formData.primary_address"
                :rules="[rules.required, rules.max255Chars]"
                label="Primary Address"
                required
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm12 md12>
              <v-text-field
                v-model="formData.secondary_address"
                :rules="[rules.max255Chars]"
                label="Secondary Address"
                required
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm12 md12>
              <v-text-field
                v-model="formData.contact_no"
                :rules="[rules.max100Chars]"
                label="Contact No."
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm12 md12>
              <v-autocomplete
                :items="genderTypeList"
                item-text="name"
                item-value="id"
                v-model="formData.gender_type"
                label="Gender"
              ></v-autocomplete>
            </v-flex>
            <v-flex xs12 sm12 md12>
              <v-autocomplete
                :items="customerStatusList"
                item-text="name"
                item-value="id"
                v-model="formData.status"
                :rules="[rules.required]"
                label="Status"
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
    </v-form>
  </v-card>
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
    defaultFormData: {
      file: "",
      file_path: require("@/assets/images/no-image.png"),
      file_name: "",
      firstname: "",
      middlename: "",
      lastname: "",
      email: "",
      password: "",
      primary_address: "",
      secondary_address: "",
      contact_no: "",
      gender_type: "",
      status: ""
    },
    formType: "new",
    formData: {
      file: "",
      file_path: require("@/assets/images/no-image.png"),
      file_name: "",
      firstname: "",
      middlename: "",
      lastname: "",
      email: "",
      password: "",
      primary_address: "",
      secondary_address: "",
      contact_no: "",
      gender_type: "",
      status: ""
    },
    valid: true
  }),

  computed: {
    ...mapGetters("customers", ["getCustomerById"]),
    formTitle() {
      return this.formType === "new" ? "Customer - Create" : "Customer - Update";
    },
    formIcon() {
      return this.formType === "new" ? "add_box" : "edit";
    }
  },

  methods: {
    ...mapActions("alerts", ["setAlert"]),
    ...mapActions("customers", {
      saveCustomerData: "saveData",
      updateCustomerData: "updateData"
    }),

    pickFile() {
      this.$refs.image.click();
    },

    onFilePicked(e) {
      const files = e.target.files;
      if (files[0] !== undefined) {
        this.formData.file_name = files[0].name;
        if (this.formData.file_name.lastIndexOf(".") <= 0) {
          return;
        }
        const fr = new FileReader();
        fr.readAsDataURL(files[0]);
        fr.addEventListener("load", () => {
          this.formData.file_path = fr.result;
          this.formData.file = files[0]; // this is an image file that can be sent to server...
        });
      } else {
        this.formData.file = this.defaultFormData.file;
        this.formData.file_path = this.defaultFormData.file_path;
        this.formData.file_name = this.defaultFormData.file_name;
      }
    },

    editItem(id) {
      let data = this.getCustomerById(id);
      this.formData.id = data.id;
      this.formData.firstname = data.firstname;
      this.formData.middlename = data.middlename;
      this.formData.lastname = data.lastname;
      this.formData.email = data.email;
      this.formData.primary_address = data.primary_address;
      this.formData.secondary_address = data.secondary_address;
      this.formData.contact_no = data.contact_no;
      this.formData.file_name = data.file_name;
      this.formData.gender_type = data.gender_type;
      this.formData.status = data.status;
      this.formData.file_path = process.env.VUE_APP_API_BACKEND+ '/customers/viewImage/' + data.file_name;
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
          this.formData.product_id = this.$route.params.id;
          this.saveCustomerData(this.formData)
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
          this.updateCustomerData(this.formData)
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