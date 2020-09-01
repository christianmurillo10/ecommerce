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
            <v-flex xs12 sm12 md8>
              <v-text-field
                v-model="formData.discount_value"
                label="Discount Value"
                type="number"
                :disabled="formData.product_id === '' ? true : false"
                v-on:input="computeCurrentPriceAmount()"
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm12 md4>
              <v-autocomplete
                :items="rateTypeList"
                item-text="name"
                item-value="id"
                v-model="formData.discount_type"
                label="Type"
                :disabled="formData.product_id === '' ? true : false"
                v-on:change="computeCurrentPriceAmount()"
              ></v-autocomplete>
            </v-flex>
            <v-flex xs12 sm12 md12>
              <v-text-field
                v-model="formData.current_price_amount"
                label="Current Price Amount"
                readonly
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
      discount_value: "",
      base_price_amount: "0.00",
      current_price_amount: "0.00",
      product_id: "",
      discount_type: ""
    },
    formType: "new",
    formData: {
      discount_value: "",
      base_price_amount: "0.00",
      current_price_amount: "0.00",
      product_id: "",
      discount_type: ""
    },
    valid: true
  }),

  computed: {
    ...mapGetters("products", ["getProductById", "getProductList"]),
    ...mapGetters("productFlashDealDetails", ["getProductFlashDealDetailById"]),
    formTitle() {
      return this.formType === "new" ? "Flash Deal Details - Create" : "Flash Deal Details - Update";
    },
    formIcon() {
      return this.formType === "new" ? "add_box" : "edit";
    }
  },

  created() {
    this.getProductData();
  },

  methods: {
    ...mapActions("alerts", ["setAlert"]),
    ...mapActions("products", { getProductData: "getData" }),
    ...mapActions("productFlashDealDetails", {
      saveProductFlashDealDetailData: "saveData",
      updateProductFlashDealDetailData: "updateData"
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
        if (this.formData.discount_type === 2) discountAmount = this.formData.base_price_amount * this.formData.discount_value / 100;
        else discountAmount = this.formData.discount_value;
      }
      return discountAmount;
    },

    computeCurrentPriceAmount() {
      let discountAmount = this.computeDiscountAmount();
      let currentPriceAmount = this.formData.base_price_amount - discountAmount;
      this.formData.current_price_amount = currentPriceAmount.toFixed(2);
    },

    editItem(id) {
      let data = this.getProductFlashDealDetailById(id);
      this.formData.id = data.id;
      this.formData.discount_value = data.discount_value;
      this.formData.base_price_amount = data.base_price_amount;
      this.formData.current_price_amount = data.current_price_amount;
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
          this.updateProductFlashDealDetailData(this.formData)
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