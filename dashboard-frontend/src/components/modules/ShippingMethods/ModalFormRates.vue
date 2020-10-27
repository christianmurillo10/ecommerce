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
                v-model="formData.rate_amount"
                :rules="[rules.required]"
                label="Rate Amount"
                type="number"
                required
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm12 md12>
              <v-text-field
                v-model="formData.subtotal_amount_from"
                label="Subtotal Amount From"
                type="number"
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm12 md12>
              <v-text-field
                v-model="formData.subtotal_amount_to"
                label="Subtotal Amount To"
                type="number"
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm12 md12>
              <v-text-field
                v-model="formData.quantity_from"
                label="Quantity From"
                type="number"
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm12 md12>
              <v-text-field
                v-model="formData.quantity_to"
                label="Quantity To"
                type="number"
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
      rate_amount: "0.00",
      subtotal_amount_from: "0.00",
      subtotal_amount_to: "0.00",
      quantity_from: "0",
      quantity_to: "0",
    },
    formType: "new",
    formData: {
      rate_amount: "0.00",
      subtotal_amount_from: "0.00",
      subtotal_amount_to: "0.00",
      quantity_from: "0",
      quantity_to: "0",
    },
    valid: true,
  }),

  computed: {
    ...mapGetters("shippingMethodRates", ["getShippingMethodRateById"]),
    formTitle() {
      return this.formType === "new"
        ? "Shipping Method Rates - Create"
        : "Shipping Method Rates - Update";
    },
    formIcon() {
      return this.formType === "new" ? "add_box" : "edit";
    },
  },

  methods: {
    ...mapActions("alerts", ["setAlert"]),
    ...mapActions("shippingMethodRates", {
      saveShippingMethodRateData: "saveData",
      updateShippingMethodRateData: "updateData",
    }),

    editItem(id) {
      let data = this.getShippingMethodRateById(id);
      this.formData.id = data.id;
      this.formData.rate_amount = data.rate_amount;
      this.formData.subtotal_amount_from = data.subtotal_amount_from;
      this.formData.subtotal_amount_to = data.subtotal_amount_to;
      this.formData.quantity_from = data.quantity_from;
      this.formData.quantity_to = data.quantity_to;
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
          this.formData.shipping_method_id = this.$route.params.shippingMethodId;
          this.saveShippingMethodRateData(this.formData)
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
          this.updateShippingMethodRateData(this.formData)
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
