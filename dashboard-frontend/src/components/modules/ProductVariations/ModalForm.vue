<template>
  <v-form ref="form" @submit.prevent="save" v-model="valid" lazy-validation>
    <v-card>
      <v-card-title>
        <v-icon class="black--text">{{ formIcon }}</v-icon>
        <span class="title">{{ formTitle }}</span>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-container grid-list-md>
          <v-layout wrap>
            <v-flex xs12 sm12 md12>
              <v-text-field
                v-model="formData.name"
                :rules="[rules.required, rules.max50Chars]"
                label="Name"
                required
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm12 md12>
              <span class="subheading font-weight-bold">Details</span>
            </v-flex>
            <v-flex xs12 sm12 md12>
              <table>
                <tr v-for="(item, i) in formData.details" :key="i">
                  <td style="width: 5%">
                    {{ `${i + 1}.` }}
                  </td>
                  <td style="width: 20%">
                    <v-text-field
                      v-model="formData.details[i].code"
                      :rules="[rules.required, rules.max50Chars]"
                      label="Code"
                      required
                    ></v-text-field>
                  </td>
                  <td style="width: 70%">
                    <v-text-field
                      v-model="formData.details[i].name"
                      :rules="[rules.required, rules.max50Chars]"
                      label="Name"
                      required
                    ></v-text-field>
                  </td>
                  <td style="width: 5%">
                    <v-btn icon>
                      <v-icon color="error" @click="deleteRow(i)">
                        delete
                      </v-icon>
                    </v-btn>
                  </td>
                </tr>
              </table>
            </v-flex>
            <v-flex xs12 sm12 md12>
              <v-layout wrap row>
                <v-spacer></v-spacer>
                <v-btn small outline color="success" @click="addRow()">
                  Add row
                </v-btn>
              </v-layout>
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
    defaultFormData: {
      name: "",
      details: [
        {
          code: "",
          name: "",
        },
      ],
    },
    formType: "new",
    formData: {
      name: "",
      details: [
        {
          code: "",
          name: "",
        },
      ],
    },
    valid: true,
  }),

  computed: {
    formTitle() {
      return this.formType === "new"
        ? "Product Variation - Create"
        : "Product Variation - Update";
    },
    formIcon() {
      return this.formType === "new" ? "add_box" : "edit";
    },
  },

  methods: {
    ...mapActions("alerts", ["setAlert"]),
    ...mapActions("productVariations", {
      saveProductVariationData: "saveData",
      updateProductVariationData: "updateData",
      getProductVariationDataById: "getDataById",
    }),

    addRow() {
      this.formData.details.push({
        code: "",
        name: "",
      });
    },

    deleteRow(index) {
      if (this.formData.details.length > 1) {
        this.formData.details.splice(index, 1);
      }
    },

    async editItem(id) {
      const response = await this.getProductVariationDataById(id);
      let data = response.result;

      // set details values
      let details = [];
      for (let i = 0; i < data.productVariationDetails.length; i++) {
        let obj = data.productVariationDetails[i];
        details.push({
          id: obj.id,
          code: obj.code,
          name: obj.name,
        });
      }

      this.formData.id = data.id;
      this.formData.name = data.name;
      this.formData.details = details;
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
          this.saveProductVariationData(this.formData)
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
          this.updateProductVariationData(this.formData)
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
