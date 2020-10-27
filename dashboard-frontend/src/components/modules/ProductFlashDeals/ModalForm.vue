<template>
  <v-form ref="form" @submit.prevent="save" v-model="valid" lazy-validation>
    <v-card>
      <v-card-title>
        <v-icon class="black--text">{{ formIcon }}</v-icon>
        <span class="title">{{ formTitle }}</span>
      </v-card-title>
      <v-card-text>
        <v-container grid-list-md>
          <v-layout wrap>
            <v-flex xs12 sm12 md12>
              <v-text-field
                v-model="formData.title"
                :rules="[rules.required, rules.max50Chars]"
                label="Title"
                required
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm12 md6>
              <v-menu
                ref="date_from"
                v-model="date_from"
                :close-on-content-click="false"
                :nudge-right="40"
                :return-value.sync="formData.date_from"
                lazy
                transition="scale-transition"
                offset-y
                full-width
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="formData.date_from"
                    label="Date From"
                    prepend-icon="event"
                    readonly
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker v-model="formData.date_from" no-title scrollable>
                  <v-spacer></v-spacer>
                  <v-btn flat color="primary" @click="date_from = false">
                    Cancel
                  </v-btn>
                  <v-btn
                    flat
                    color="primary"
                    @click="$refs.date_from.save(formData.date_from)"
                  >
                    OK
                  </v-btn>
                </v-date-picker>
              </v-menu>
            </v-flex>
            <v-flex xs12 sm12 md6>
              <v-menu
                ref="date_to"
                v-model="date_to"
                :close-on-content-click="false"
                :nudge-right="40"
                :return-value.sync="formData.date_to"
                lazy
                transition="scale-transition"
                offset-y
                full-width
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="formData.date_to"
                    label="Date To"
                    prepend-icon="event"
                    readonly
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker v-model="formData.date_to" no-title scrollable>
                  <v-spacer></v-spacer>
                  <v-btn flat color="primary" @click="date_to = false">
                    Cancel
                  </v-btn>
                  <v-btn
                    flat
                    color="primary"
                    @click="$refs.date_to.save(formData.date_to)"
                  >
                    OK
                  </v-btn>
                </v-date-picker>
              </v-menu>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" flat @click="close">Cancel</v-btn>
        <v-btn color="blue darken-1" type="submit" flat :disabled="!valid">
          Save
        </v-btn>
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
    date_from: false,
    date_to: false,
    defaultFormData: {
      title: "",
      date_from: new Date().toISOString().substr(0, 10),
      date_to: new Date().toISOString().substr(0, 10),
    },
    formType: "new",
    formData: {
      title: "",
      date_from: new Date().toISOString().substr(0, 10),
      date_to: new Date().toISOString().substr(0, 10),
    },
    valid: true,
  }),

  computed: {
    ...mapGetters("productFlashDeals", ["getProductFlashDealById"]),
    formTitle() {
      return this.formType === "new"
        ? "Flash Deal - Create"
        : "Flash Deal - Update";
    },
    formIcon() {
      return this.formType === "new" ? "add_box" : "edit";
    },
  },

  methods: {
    ...mapActions("alerts", ["setAlert"]),
    ...mapActions("productFlashDeals", {
      saveProductFlashDealData: "saveData",
      updateProductFlashDealData: "updateData",
    }),

    editItem(id) {
      let data = this.getProductFlashDealById(id);
      this.formData.id = data.id;
      this.formData.title = data.title;
      this.formData.date_from = data.date_from;
      this.formData.date_to = data.date_to;
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
          this.saveProductFlashDealData(this.formData)
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
          this.updateProductFlashDealData(this.formData)
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
