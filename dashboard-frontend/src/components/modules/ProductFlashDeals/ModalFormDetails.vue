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
              <v-autocomplete
                :items="getProductList"
                item-text="name"
                item-value="id"
                v-model="formData.product_id"
                label="Product"
                :rules="[rules.required]"
                v-on:change="setPriceAmount()"
                :readonly="formType === 'update' ? true : false"
                required
              ></v-autocomplete>
            </v-flex>
            <v-flex xs12 sm12 md12>
              <v-text-field
                v-model="formData.base_price_amount"
                label="Base Price Amount"
                readonly
                required
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm12 md12>
              <v-autocomplete
                :items="rateTypeList"
                item-text="name"
                item-value="id"
                v-model="formData.discount_type"
                label="Discount Type"
                :disabled="formData.product_id === '' ? true : false"
                v-on:change="computeCurrentPriceAmount()"
              ></v-autocomplete>
            </v-flex>
            <v-flex xs12 sm12 md6 v-if="formData.discount_type === 2">
              <v-text-field
                v-model="formData.discount_percentage"
                label="Discount Percentage"
                type="number"
                v-on:input="computeCurrentPriceAmount()"
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm12 md6 v-if="formData.discount_type">
              <v-text-field
                v-model="formData.discount_amount"
                label="Discount Amount"
                type="number"
                :readonly="formData.discount_type === 2 ? true : false"
                v-on:input="computeCurrentPriceAmount()"
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm12 md12>
              <v-text-field
                v-model="formData.current_price_amount"
                label="Current Price Amount"
                readonly
                required
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm12 md12>
              <v-text-field
                v-model="formData.quantity"
                :rules="[rules.required]"
                label="Quantity"
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
      discount_percentage: "",
      discount_amount: "",
      base_price_amount: "0.00",
      current_price_amount: "0.00",
      quantity: null,
      product_id: "",
      discount_type: "",
    },
    formType: "new",
    formData: {
      discount_percentage: "",
      discount_amount: "",
      base_price_amount: "0.00",
      current_price_amount: "0.00",
      quantity: null,
      product_id: "",
      discount_type: "",
    },
    valid: true,
  }),

  computed: {
    ...mapGetters("products", ["getProductById", "getProductList"]),
    ...mapGetters("productFlashDealDetails", ["getProductFlashDealDetailById"]),
    formTitle() {
      return this.formType === "new"
        ? "Flash Deal Details - Create"
        : "Flash Deal Details - Update";
    },
    formIcon() {
      return this.formType === "new" ? "add_box" : "edit";
    },
  },

  created() {
    this.getProductData();
  },

  methods: {
    ...mapActions("alerts", ["setAlert"]),
    ...mapActions("products", { getProductData: "getData" }),
    ...mapActions("productFlashDealDetails", {
      saveProductFlashDealDetailData: "saveData",
      updateProductFlashDealDetailData: "updateData",
    }),

    setPriceAmount() {
      let productId = this.formData.product_id;

      if (productId) {
        let productDetails = this.getProductById(productId);
        this.formData.base_price_amount = productDetails.price_amount;
        this.formData.current_price_amount = productDetails.price_amount;
        this.computeCurrentPriceAmount();
      }
    },

    computeDiscountAmount() {
      let discountAmount = 0;
      if (this.formData.discount_type !== null) {
        if (this.formData.discount_type === 2) {
          discountAmount = (
            (this.formData.base_price_amount *
              this.formData.discount_percentage) /
            100
          ).toFixed(2);
        } else {
          this.formData.discount_percentage = null;
          discountAmount = this.formData.discount_amount;
        }
      }

      this.formData.discount_amount = discountAmount;
    },

    async computeCurrentPriceAmount() {
      await this.computeDiscountAmount();
      let currentPriceAmount =
        this.formData.base_price_amount - this.formData.discount_amount;
      this.formData.current_price_amount = currentPriceAmount.toFixed(2);
    },

    editItem(id) {
      let data = this.getProductFlashDealDetailById(id);
      this.formData.id = data.id;
      this.formData.discount_percentage = data.discount_percentage;
      this.formData.discount_amount = data.discount_amount;
      this.formData.base_price_amount = data.base_price_amount;
      this.formData.current_price_amount = data.current_price_amount;
      this.formData.quantity = data.quantity;
      this.formData.product_id = data.product_id;
      this.formData.discount_type = data.discount_type;
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
          this.formData.product_flash_deal_id = this.$route.params.productFlashDealId;
          this.saveProductFlashDealDetailData(this.formData)
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
          this.updateProductFlashDealDetailData(this.formData)
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
