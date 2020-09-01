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
              <v-text-field
                v-model="formData.username"
                :rules="[rules.required, rules.max50Chars]"
                label="Username"
                required
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm12 md12 v-if="this.formType === 'new'">
              <v-text-field
                v-model="formData.password"
                :append-icon="showPassword ? 'visibility' : 'visibility_off'"
                :type="showPassword ? 'text' : 'password'"
                :rules="[rules.required, rules.max50Chars]"
                label="Password"
                @click:append="showPassword = !showPassword"
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
            <v-flex xs12 sm12 md12>
              <v-select
                :items="getRoleList"
                item-text="name"
                item-value="id"
                v-model="formData.role_id"
                :rules="[rules.required]"
                label="Role"
                required
              ></v-select>
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
import Mixins from "@/helpers/Mixins.js";
import { mapState, mapGetters, mapActions } from "vuex";

export default {
  mixins: [Mixins],

  data: () => ({
    defaultFormData: {
      username: "",
      password: "",
      email: "",
      role_id: ""
    },
    formType: "new",
    formData: {
      username: "",
      password: "",
      email: "",
      role_id: ""
    },
    valid: true,
    showPassword: false
  }),

  computed: {
    ...mapGetters("users", ["getUserById"]),
    ...mapGetters("roles", ["getRoleList"]),
    formTitle() {
      return this.formType === "new" ? "User - Create" : "User - Update";
    },
    formIcon() {
      return this.formType === "new" ? "person_add" : "edit";
    }
  },

  created() {
    this.getRoleData();
  },

  methods: {
    ...mapActions("alerts", ["setAlert"]),
    ...mapActions("roles", {getRoleData: "getData"}),
    ...mapActions("users", {
      saveUserData: "saveData",
      updateUserData: "updateData"
    }),

    editItem(id) {
      let data = this.getUserById(id);
      this.formData.id = data.id;
      this.formData.username = data.username;
      this.formData.email = data.email;
      this.formData.role_id = data.role_id;
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
          this.saveUserData(this.formData)
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
          this.updateUserData(this.formData)
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