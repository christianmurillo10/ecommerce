<template>
  <v-form ref="form" @submit.prevent="update" v-model="valid" lazy-validation>
    <v-card-text>
      <v-flex xs12 sm12 md12 class="text-center">
        <v-avatar size="120">
          <v-img :src="formData.file_path"></v-img>
        </v-avatar>
      </v-flex>
      <v-flex xs12 sm12 md12 class="text-center">
        <v-btn x-small outlined @click="pickFile">Upload Image</v-btn>
        <input
          type="file"
          style="display: none"
          ref="image"
          accept="image/*"
          @change="onFilePicked"
        />
      </v-flex>
      <v-flex xs12 sm12 md12>
        <v-text-field
          v-model="formData.firstname"
          :rules="[rules.required, rules.max50Chars]"
          label="Firstname"
          required
          dense
        ></v-text-field>
      </v-flex>
      <v-flex xs12 sm12 md12>
        <v-text-field
          v-model="formData.middlename"
          :rules="[rules.max50Chars]"
          label="Middlename"
          dense
        ></v-text-field>
      </v-flex>
      <v-flex xs12 sm12 md12>
        <v-text-field
          v-model="formData.lastname"
          :rules="[rules.required, rules.max50Chars]"
          label="Lastname"
          required
          dense
        ></v-text-field>
      </v-flex>
      <v-flex xs12 sm12 md12>
        <v-text-field
          v-model="formData.email"
          :rules="[rules.required, rules.email]"
          label="Email"
          required
          dense
        ></v-text-field>
      </v-flex>
      <v-flex xs12 sm12 md12>
        <v-text-field
          v-model="formData.primary_address"
          :rules="[rules.required, rules.max255Chars]"
          label="Primary Address"
          required
          dense
        ></v-text-field>
      </v-flex>
      <v-flex xs12 sm12 md12>
        <v-text-field
          v-model="formData.secondary_address"
          :rules="[rules.max255Chars]"
          label="Secondary Address"
          required
          dense
        ></v-text-field>
      </v-flex>
      <v-flex xs12 sm12 md12>
        <v-text-field
          v-model="formData.contact_no"
          :rules="[rules.max100Chars]"
          label="Contact No."
          dense
        ></v-text-field>
      </v-flex>
      <v-flex xs12 sm12 md12>
        <v-autocomplete
          :items="genderTypeList"
          item-text="name"
          item-value="id"
          v-model="formData.gender_type"
          label="Gender"
          dense
        ></v-autocomplete>
      </v-flex>
    </v-card-text>
    <v-divider></v-divider>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn small text color="blue darken-1" @click="reset">Reset</v-btn>
      <v-btn small text color="blue darken-1" type="submit" :disabled="!valid">
        Update
      </v-btn>
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
    defaultFormData: "",
    formData: {
      file: null,
      file_path: require("@/assets/images/no-image.png"),
      file_name: null,
      firstname: "",
      middlename: "",
      lastname: "",
      email: "",
      primary_address: "",
      secondary_address: "",
      contact_no: "",
      gender_type: "",
    },
  }),

  created() {
    this.initialLoad();
  },

  computed: {
    ...mapState("customerAuthentication", ["customerInfo"]),
  },

  methods: {
    ...mapMutations("snackbars", { setSnackbar: "SET_SNACKBAR" }),
    ...mapMutations("customerAuthentication", {
      setCustomerInfo: "SET_CUSTOMER_INFO",
    }),
    ...mapActions("customers", {
      getCustomerDataById: "getDataById",
      updateCustomerData: "updateData",
    }),

    initialLoad() {
      this.getCustomerDataById(this.customerInfo.id).then((response) => {
        let obj = response.result;
        if (obj) {
          this.defaultFormData = obj;
          this.setFormData(obj);
        }
      });
    },

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

    setFormData(obj) {
      this.formData.id = obj.id === null ? "" : obj.id;
      this.formData.firstname = obj.firstname === null ? "" : obj.firstname;
      this.formData.middlename = obj.middlename === null ? "" : obj.middlename;
      this.formData.lastname = obj.lastname === null ? "" : obj.lastname;
      this.formData.email = obj.email === null ? "" : obj.email;
      this.formData.primary_address =
        obj.primary_address === null ? "" : obj.primary_address;
      this.formData.secondary_address =
        obj.secondary_address === null ? "" : obj.secondary_address;
      this.formData.contact_no = obj.contact_no === null ? "" : obj.contact_no;
      this.formData.file_name = obj.contact_no === null ? "" : obj.file_name;
      this.formData.file_path = obj.contact_no === null ? "" : obj.file_path;
      this.formData.gender_type =
        obj.gender_type === null ? "" : parseInt(obj.gender_type);
    },

    reset() {
      this.setFormData(this.defaultFormData);
    },

    update() {
      if (this.$refs.form.validate()) {
        this.updateCustomerData(this.formData)
          .then((response) => {
            let obj = {
              color: "success",
              snackbar: true,
              text: response.message,
              timeout: 3000,
            };

            if (response.status === "success") {
              this.setFormData(response.result);
              this.setCustomerInfo(response.result);
            } else {
              obj.color = "error";
            }

            this.setSnackbar(obj);
          })
          .catch((err) => console.log(err));
      }
    },
  },
};
</script>
