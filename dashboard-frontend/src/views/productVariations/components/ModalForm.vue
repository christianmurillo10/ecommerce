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
            <v-flex xs12 sm12 md6>
              <v-text-field
                v-model="formData.name"
                :rules="[rules.required, rules.max50Chars]"
                label="Name"
                required
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm12 md12>
              <span class="title py-3">Details</span>
            </v-flex>
            <v-flex
              xs12
              sm12
              md12
              mb-2
              v-for="(item, i) in formData.details"
              :key="i"
            >
              <v-card color="grey lighten-5">
                <v-card-text>
                  <v-layout wrap row>
                    <v-flex xs12 sm12 md12>
                      <v-layout wrap row>
                        <span class="subheading font-weight-bold py-3">
                          Item {{ i + 1 }}
                        </span>
                        <v-spacer></v-spacer>
                        <v-btn icon>
                          <v-icon color="error" @click="deleteRow(i)">
                            delete
                          </v-icon>
                        </v-btn>
                      </v-layout>
                    </v-flex>
                    <v-flex xs12 sm12 md4>
                      <v-text-field
                        v-model="formData.details[i].code"
                        :rules="[rules.required, rules.max50Chars]"
                        label="Code"
                        required
                      ></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm12 md8>
                      <v-text-field
                        v-model="formData.details[i].name"
                        :rules="[rules.required, rules.max50Chars]"
                        label="Name"
                        required
                      ></v-text-field>
                    </v-flex>
                  </v-layout>
                </v-card-text>
              </v-card>
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
import Index from "../Index";
import Mixins from "@/helpers/Mixins.js";
import { mapGetters, mapActions } from "vuex";

export default {
  mixins: [Mixins],
  components: {
    Index,
  },

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
      getProductVariationDataById: "getDataById"
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
      let data = response.data.result;

      // set details values
      let details = [];
      for(let i = 0; i < data.productVariationDetails.length; i++) {
          let obj = data.productVariationDetails[i];
          details.push({
            id: obj.id,
            code: obj.code,
            name: obj.name
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
                message: response.data.message,
              };

              if (!response.data.result) obj.type = "error";
              this.setAlert(obj);
            })
            .catch((err) => console.log(err));
        } else if (this.formType === "update") {
          this.updateProductVariationData(this.formData)
            .then((response) => {
              let obj = {
                alert: true,
                type: "success",
                message: response.data.message,
              };

              if (!response.data.result) obj.type = "error";
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
