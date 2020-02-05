<template>
  <v-card>
    <v-card-title class="headline grey darken-3 white--text">
      <span>
        <v-icon class="white--text">{{ formIcon }}</v-icon>
        {{ formTitle }}
      </span>
    </v-card-title>

    <v-form ref="form" @submit.prevent="save" v-model="valid" lazy-validation>
      <v-card-text>
        <v-container grid-list-md>
          <v-layout wrap>
            <v-flex xs12 sm12 md12>
              <v-text-field
                v-model="formData.quantity_from"
                :rules="validateItem.quantityFromRules"
                label="Quantity From"
                required
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm12 md12>
              <v-text-field
                v-model="formData.quantity_to"
                :rules="validateItem.quantityToRules"
                label="Quantity To"
                required
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm12 md12>
              <v-text-field
                v-model="formData.price"
                :rules="validateItem.priceRules"
                label="Price"
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
        <v-btn color="blue darken-1" type="submit" flat :disabled="!valid">Save</v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script>
import Index from "./Index";
import { mapGetters, mapActions } from "vuex";

export default {
  components: {
    Index
  },

  data: () => ({
    defaultFormData: {
      quantity_from: null,
      quantity_to: null,
      price: null,
      product_id: null
    },
    formType: "new",
    formData: {
      quantity_from: null,
      quantity_to: null,
      price: null,
      product_id: null
    },
    valid: true,
    validateItem: {
      quantityFromRules: [v => !!v || "Quantity From is required"],
      quantityToRules: [v => !!v || "Quantity To is required"],
      priceRules: [v => !!v || "Price is required"]
    }
  }),

  computed: {
    ...mapGetters("productDiscountedPriceRanges", ["getProductDiscountedPriceRangeById"]),
    formTitle() {
      return this.formType === "new"
        ? "New Product Discounted Price Range"
        : "Edit Product Discounted Price Range";
    },
    formIcon() {
      return this.formType === "new" ? "add_box" : "edit";
    }
  },

  methods: {
    ...mapActions("alerts", ["setAlert"]),
    ...mapActions("productDiscountedPriceRanges", {
      saveProductDiscountedPriceRangeData: "saveData",
      updateProductDiscountedPriceRangeData: "updateData",
      deleteProductDiscountedPriceRangeData: "deleteData"
    }),

    editItem(id) {
      let data = this.getProductDiscountedPriceRangeById(id);
      this.formData.id = data.id;
      this.formData.quantity_from = data.quantity_from;
      this.formData.quantity_to = data.quantity_to;
      this.formData.price = data.price;
      this.formData.product_id = data.product_id;
      this.formType = "update";
    },

    deleteItem(id) {
      this.deleteProductDiscountedPriceRangeData(id)
        .then(response => {
          let obj = {
            alert: true,
            type: "success",
            message: response.data.message
          };

          if (!response.data.result) obj.type = "error";
          this.setAlert(obj);
        })
        .catch(err => console.log(err));
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
          this.saveProductDiscountedPriceRangeData(this.formData)
            .then(response => {
              let obj = {
                alert: true,
                type: "success",
                message: response.data.message
              };

              if (!response.data.result) obj.type = "error";
              this.setAlert(obj);
            })
            .catch(err => console.log(err));
        } else if (this.formType === "update") {
          this.updateProductDiscountedPriceRangeData(this.formData)
            .then(response => {
              let obj = {
                alert: true,
                type: "success",
                message: response.data.message
              };

              if (!response.data.result) obj.type = "error";
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