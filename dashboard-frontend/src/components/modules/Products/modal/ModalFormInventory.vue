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
                v-model="formData.sku"
                :rules="[rules.required, rules.max50Chars]"
                label="SKU"
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
                v-model="formData.price_amount"
                :rules="[rules.required]"
                label="Price Amount"
                type="number"
                required
              ></v-text-field>
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
      sku: "",
      name: "",
      price_amount: null,
    },
    formData: {
      sku: "",
      name: "",
      price_amount: null,
    },
    valid: true,
  }),

  computed: {
    ...mapGetters("inventories", ["getInventoryById"]),
    formTitle() {
      return "Inventory - Update";
    },
    formIcon() {
      return "edit";
    },
  },

  methods: {
    ...mapActions("alerts", ["setAlert"]),
    ...mapActions("inventories", {
      updateInventoryData: "updateData",
    }),

    editItem(id) {
      let data = this.getInventoryById(id);
      this.formData.id = data.id;
      this.formData.sku = data.sku;
      this.formData.name = data.name;
      this.formData.price_amount = data.price_amount;
    },

    close() {
      this.$emit("setDialog", false);
      setTimeout(() => {
        this.formData = Object.assign({}, this.defaultFormData);
      }, 300);
    },

    save() {
      if (this.$refs.form.validate()) {
        this.updateInventoryData(this.formData)
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
        this.close();
      }
    },
  },
};
</script>
