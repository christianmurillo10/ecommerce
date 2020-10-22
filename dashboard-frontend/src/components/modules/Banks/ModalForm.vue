<template>
  <v-form ref="form" @submit.prevent="save" v-model="valid" lazy-validation>
    <v-card>
      <v-card-title>
        <v-icon class="black--text">{{ formIcon }}</v-icon
        ><span class="title">{{ formTitle }}</span>
      </v-card-title>
      <v-card-text>
        <v-container grid-list-md>
          <v-layout wrap>
            <v-flex xs12 sm12 md12>
              <v-text-field
                v-model="formData.code"
                :rules="[rules.required, rules.max50Chars]"
                label="Code"
                required
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm12 md12>
              <v-text-field
                v-model="formData.name"
                :rules="[rules.required, rules.max50Chars]"
                label="Name"
                required
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm12 md12>
              <v-text-field
                v-model="formData.description"
                :rules="[rules.max500Chars]"
                label="Description"
              ></v-text-field>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" flat @click="close">Cancel</v-btn>
        <v-btn color="blue darken-1" type="submit" flat :disabled="!valid"
          >Save</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-form>
</template>

<script>
import Mixins from "@/helpers/Mixins.js";
import { mapGetters, mapActions } from "vuex";

export default {
  mixins: [Mixins],

  data: () => ({
    defaultFormData: {
      code: "",
      name: "",
      description: "",
    },
    formType: "new",
    formData: {
      code: "",
      name: "",
      description: "",
    },
    valid: true,
  }),

  computed: {
    ...mapGetters("banks", ["getBankById"]),
    formTitle() {
      return this.formType === "new" ? "Bank - Create" : "Bank - Update";
    },
    formIcon() {
      return this.formType === "new" ? "add_box" : "edit";
    },
  },

  methods: {
    ...mapActions("alerts", ["setAlert"]),
    ...mapActions("banks", {
      saveBankData: "saveData",
      updateBankData: "updateData",
    }),

    editItem(id) {
      let data = this.getBankById(id);
      this.formData.id = data.id;
      this.formData.code = data.code;
      this.formData.name = data.name;
      this.formData.description = data.description;
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
          this.saveBankData(this.formData)
            .then((response) => {
              let obj = {
                alert: true,
                type: "success",
                message: [response.message],
                outline: true,
              };

              if (response.status === "error") {
                obj.type = "error";
                obj.message = response.errors;
              }

              this.setAlert(obj);
            })
            .catch((err) => console.log(err));
        } else if (this.formType === "update") {
          this.updateBankData(this.formData)
            .then((response) => {
              let obj = {
                alert: true,
                type: "success",
                message: [response.message],
                outline: true,
              };

              if (response.status === "error") {
                obj.type = "error";
                obj.message = response.errors;
              }

              this.setAlert(obj);
            })
            .catch((err) => console.log(err));
        }
        this.close();
      }
    },
  },
};
</script>
