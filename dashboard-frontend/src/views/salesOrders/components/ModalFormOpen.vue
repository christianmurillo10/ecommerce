<template>
  <v-form ref="form" @submit.prevent="save" v-model="valid" lazy-validation>
    <v-card>
      <v-card-title>
        <v-icon class="black--text">{{ formIcon }}</v-icon><span class="title">{{ formTitle }}</span>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text style="height: 999px;">
        <v-container grid-list-md>
          <v-layout wrap>
            <!-- <v-flex xs12 sm12 md12>
              <span class="title">Header</span>
            </v-flex> -->
            <v-flex xs12 sm12 md6>
              <v-layout wrap row>
                <v-flex xs12 sm12 md6>
                  <v-menu
                    ref="date_ordered"
                    v-model="date_ordered"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    :return-value.sync="formData.date_ordered"
                    lazy
                    transition="scale-transition"
                    offset-y
                    full-width
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        v-model="formData.date_ordered"
                        label="Date Ordered"
                        readonly
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker v-model="formData.date_ordered" no-title scrollable>
                      <v-spacer></v-spacer>
                      <v-btn flat color="primary" @click="date_ordered = false">Cancel</v-btn>
                      <v-btn flat color="primary" @click="$refs.date_ordered.save(formData.date_ordered)">OK</v-btn>
                    </v-date-picker>
                  </v-menu>
                </v-flex>
                <v-flex xs12 sm12 md6>
                  <v-autocomplete
                    :items="paymentMethodTypeList"
                    item-text="name"
                    item-value="id"
                    v-model="formData.payment_method_type"
                    :rules="[rules.required]"
                    label="Payment Method"
                  ></v-autocomplete>
                </v-flex>
                <v-flex xs12 sm12 md12>
                  <v-autocomplete
                    :items="getCustomerList"
                    item-text="name"
                    item-value="id"
                    v-model="formData.customer_id"
                    :rules="[rules.required]"
                    label="Customer"
                  ></v-autocomplete>
                </v-flex>
              </v-layout>
            </v-flex>
            <v-flex xs12 sm12 md6>
              <v-textarea
                v-model="formData.remarks"
                :rules="[rules.max500Chars]"
                label="Remarks"
              ></v-textarea>
            </v-flex>
            <v-flex xs12 sm12 md3>
              <v-text-field
                v-model="formData.sub_total_amount"
                label="Sub-Total Amount"
                type="number"
                readonly
                required
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm12 md3>
              <v-text-field
                v-model="formData.shipping_fee_amount"
                label="Shipping Fee Amount"
                type="number"
                readonly
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm12 md3>
              <v-text-field
                v-model="formData.total_discount_amount"
                label="Total Discount Amount"
                type="number"
                readonly
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm12 md3>
              <v-text-field
                v-model="formData.total_amount"
                label="Total Amount"
                type="number"
                readonly
                required
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm12 md12>
              <v-layout wrap row>
                <v-flex xs12 sm12 md3>
                  <v-autocomplete
                    :items="yesOrNoList"
                    item-text="name"
                    item-value="id"
                    v-model="formData.is_with_vat"
                    label="Vat?"
                  ></v-autocomplete>
                </v-flex>
                <v-flex xs12 sm12 md3 v-if="formData.is_with_vat === 1">
                  <v-text-field
                    v-model="formData.vat_amount"
                    label="VAT Amount"
                    type="number"
                    v-on:input="computeTotalAmount()"
                  ></v-text-field>
                </v-flex>
              </v-layout>
            </v-flex>
            <!-- <v-flex xs12 sm12 md12>
              <span class="title">Shipping Details</span>
            </v-flex> -->
            <!-- <v-flex xs12 sm12 md12>
              <v-layout wrap row>
                <v-flex xs12 sm12 md3>
                  <v-autocomplete
                    :items="getShippingMethodList"
                    item-text="name"
                    item-value="id"
                    v-model="formData.shippingDetails.shipping_method_id"
                    :rules="[rules.required]"
                    label="Shipping Method"
                  ></v-autocomplete>
                </v-flex>
                <v-flex xs12 sm12 md3>
                  <v-text-field
                    v-model="formData.shippingDetails.amount"
                    label="Amount"
                    readonly
                    required
                  ></v-text-field>
                </v-flex>
                <v-flex xs12 sm12 md6>
                  <v-text-field
                    v-model="formData.shippingDetails.address"
                    :rules="[rules.required, rules.max255Chars]"
                    label="Address"
                    required
                  ></v-text-field>
                </v-flex>
              </v-layout>
            </v-flex> -->
            <v-flex xs12 sm12 md12>
              <span class="title py-3">Details</span>
            </v-flex>
            <v-flex xs12 sm12 md12 mb-2 v-for="(item, i) in formData.details" :key="i">
              <v-card color="grey lighten-5">
                <v-card-text>
                  <v-layout wrap row>
                    <v-flex xs12 sm12 md12>
                      <v-layout wrap row>
                        <span class="subheading font-weight-bold py-3">Item {{ i + 1 }}</span>
                        <v-spacer></v-spacer>
                        <v-btn icon>
                          <v-icon color="error" @click="deleteRow(i)">delete</v-icon>
                        </v-btn>
                      </v-layout>
                    </v-flex>
                    <v-flex xs12 sm12 md3>
                      <v-autocomplete
                        :items="claimTypeList"
                        item-text="name"
                        item-value="id"
                        v-model="formData.details[i].claim_type"
                        :rules="[rules.required]"
                        label="Claim Type"
                      ></v-autocomplete>
                    </v-flex>
                    <v-flex xs12 sm12 md6>
                      <v-autocomplete
                        :items="getProductList"
                        item-text="name"
                        item-value="id"
                        v-model="formData.details[i].product_id"
                        :rules="[rules.required]"
                        label="Product"
                        v-on:change="setProductOptions(i)"
                      ></v-autocomplete>
                    </v-flex>
                    <v-flex xs12 sm12 md3></v-flex>
                    <v-flex xs12 sm12 md12>
                      <v-layout wrap row>
                        <v-flex xs12 sm12 md3 v-for="(options, x) in productOptions[i].data" :key="x">
                          <v-autocomplete
                            :items="options.values"
                            item-text="name"
                            item-value="name"
                            v-model="formData.details[i].option_details[x]"
                            :rules="[rules.required]"
                            :label="options.title"
                          ></v-autocomplete>
                        </v-flex>
                      </v-layout>
                    </v-flex>
                    <v-flex xs12 sm12 md6>
                      <v-layout wrap row>
                        <v-flex xs12 sm12 md6>
                          <v-text-field
                            v-model="formData.details[i].quantity"
                            :rules="[rules.required, rules.max50Chars]"
                            label="Quantity"
                            type="number"
                            required
                            v-on:input="computeProductAmountByIndex(i)"
                          ></v-text-field>
                        </v-flex>
                        <v-flex xs12 sm12 md6>
                          <v-text-field
                            v-model="formData.details[i].rate_amount"
                            label="Rate Amount"
                            type="number"
                            readonly
                            required
                          ></v-text-field>
                        </v-flex>
                        <v-flex xs12 sm12 md6>
                          <v-text-field
                            v-model="formData.details[i].discount_amount"
                            label="Discount Amount"
                            type="number"
                            v-on:input="computeProductAmountByIndex(i)"
                          ></v-text-field>
                        </v-flex>
                        <v-flex xs12 sm12 md6>
                          <v-text-field
                            v-model="formData.details[i].amount"
                            label="Amount"
                            type="number"
                            readonly
                            required
                          ></v-text-field>
                        </v-flex>
                      </v-layout>
                    </v-flex>
                    <v-flex xs12 sm12 md6>
                      <v-textarea
                        v-model="formData.details[i].remarks"
                        :rules="[rules.max500Chars]"
                        label="Remarks"
                      ></v-textarea>
                    </v-flex>
                  </v-layout>
                </v-card-text>
              </v-card>
            </v-flex>
            <v-flex xs12 sm12 md12>
              <v-layout wrap row>
                <v-spacer></v-spacer>
                <v-btn small outline color="success" @click="addRow()">Add row</v-btn>
              </v-layout>
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
import Open from "../Open";
import Mixins from "@/helpers/Mixins.js";
import { mapGetters, mapActions, mapMutations } from "vuex";

export default {
  mixins: [Mixins],
  components: {
    Open
  },

  data: () => ({
    date_ordered: false,
    defaultFormData: {
      order_no: "",
      remarks: "",
      sub_total_amount: "0.00",
      vat_amount: "0.00",
      shipping_fee_amount: "0.00",
      total_discount_amount: "0.00",
      total_amount: "0.00",
      customer_id: "",
      date_ordered: new Date().toISOString().substr(0, 10),
      payment_method_type: "",
      is_with_vat: 0,
      details: [
        {
          sku: "",
          option_details: [],
          remarks: "",
          quantity: "0",
          rate_amount: "0.00",
          discount_amount: "0.00",
          amount: "0.00",
          product_id: "",
          claim_type: ""
        }
      ],
      // shippingDetails: {
      //   shipping_no: "",
      //   address: "",
      //   amount: "0.00",
      //   shipping_method_id: "",
      //   shipping_method_rate_id: ""
      // },
      productOptions: [{
          data: []
      }],
      valid: true
    },
    formType: "new",
    formData: {
      order_no: "",
      remarks: "",
      sub_total_amount: "0.00",
      vat_amount: "0.00",
      shipping_fee_amount: "0.00",
      total_discount_amount: "0.00",
      total_amount: "0.00",
      customer_id: "",
      date_ordered: new Date().toISOString().substr(0, 10),
      payment_method_type: "",
      is_with_vat: 0,
      details: [
        {
          sku: "",
          option_details: [],
          remarks: "",
          quantity: "0",
          rate_amount: "0.00",
          discount_amount: "0.00",
          amount: "0.00",
          product_id: "",
          claim_type: ""
        }
      ],
      // shippingDetails: {
      //   shipping_no: "",
      //   address: "",
      //   amount: "0.00",
      //   shipping_method_id: "",
      //   shipping_method_rate_id: ""
      // }
    },
    productOptions: [{
        data: []
    }],
    valid: true
  }),

  computed: {
    ...mapGetters("customers", ["getCustomerList"]),
    // ...mapGetters("shippingMethods", ["getShippingMethodList"]),
    ...mapGetters("products", ["getProductList", "getProductNameById"]),
    ...mapGetters("productOptions", ["getProductOptionList"]),
    ...mapGetters("salesOrders", ["getSalesOrderById"]),
    formTitle() {
      return this.formType === "new" ? "Sales Order - Create" : "Sales Order - Update";
    },
    formIcon() {
      return this.formType === "new" ? "add_box" : "edit";
    }
  },

  created() {
    this.getCustomersData();
    // this.getShippingMethodData();
    this.getProductData();
  },

  methods: {
    ...mapMutations("loading", { setLoading: "SET_LOADING" }),
    ...mapActions("alerts", ["setAlert"]),
    ...mapActions("customers", { getCustomersData: "getData" }),
    // ...mapActions("shippingMethods", { getShippingMethodData: "getData" }),
    ...mapActions("productOptions", { getProductOptionDataByProductId: "getDataByProductId" }),
    ...mapActions("products", { getProductData: "getData" }),
    ...mapActions("inventories", { getInventoryDataBySku: "getDataBySku" }),
    ...mapActions("salesOrders", {
      saveSalesOrderData: "saveData",
      updateSalesOrderData: "updateData"
    }),

    async setProductOptions(index) {
      await this.getProductOptionDataByProductId(this.formData.details[index].product_id);
      await this.setProductOptionIndexData(index);
      await this.computeSubTotalAmount();
    },

    async setProductOptionIndexData(index) {
      try {
        let data = [];

        this.getProductOptionList.forEach(element => {
          let arrayValues = element.values.split(',');
          let arrayObjValue = [];
          arrayValues.map(value => arrayObjValue.push({ name: value }));
          data.push({ id: element.id, title: element.title, values: arrayObjValue });
        });

        if (this.productOptions[index]) {
          this.productOptions[index].data = data;
        } else {
          this.productOptions.push({ data: data });
        }
        
        await this.setProductOptionListDefaultDataByIndex(index);
      } catch (err) {
        console.log(err);
      }
    },

    async setProductOptionListDefaultDataByIndex(index) {
      try {
        const value = this.productOptions[index];

        if (!_.isUndefined(value)) {
          // reset value of option_details
          this.formData.details[index].option_details = [];
          // set new value for option_details
          for (let i=0; i < value.data.length; i++) {
            let obj = {
              id: value.data[i].id,
              title: value.data[i].title,
              name: value.data[i].values[0].name,
            }
            this.formData.details[index].option_details[i] = obj;
          }

          // set default value for sku
          const sku = await this.generateSkuByIndexAndProductOptions(index, this.formData.details[index].option_details);
          await this.setProductDetailsByIndexAndSku(index, sku);
          this.formData.details[index].sku = sku;
        }
      } catch (err) {
        console.log(err);
      }
    },

    async setProductDetailsByIndexAndSku(index, sku) {
      try {
        const response = await this.getInventoryDataBySku(sku);
        let productDetails = response.data.result;
        this.formData.details[index].quantity = _.isUndefined(productDetails.stock_available) ? "0" : productDetails.stock_available.toString();
        this.formData.details[index].rate_amount = _.isUndefined(productDetails.price_amount) ? "0.00" : productDetails.price_amount;
        await this.computeProductAmountByIndex(index);
      } catch (err) {
        console.log(err);
      }
    },

    generateSkuByIndexAndProductOptions(index, options) {
      return new Promise((resolve, reject) => {
        try {
          const productName = this.getProductNameById(this.formData.details[index].product_id);
          let sku = productName.match(/\b(\w)/g).join('').toUpperCase();

          options.forEach(element => {
            sku = `${sku}-${element.name.toUpperCase()}`;
          });

          resolve(sku);
        } catch (err) {
          reject(err);
        }
      });
    },

    computeProductAmountByIndex(index) {
      const amount = (this.formData.details[index].rate_amount * this.formData.details[index].quantity) - this.formData.details[index].discount_amount;
      this.formData.details[index].amount = amount.toFixed(2);
      this.computeSubTotalAmount();;
      this.computeTotalDiscountAmountAmount();
      this.computeTotalAmount();
    },

    computeSubTotalAmount() {
      const details = this.formData.details;
      let subTotalAmount = 0;
      details.forEach(element => {
        let amount = parseFloat(element.rate_amount) * parseInt(element.quantity);
        subTotalAmount = subTotalAmount + parseFloat(amount);
      });
      this.formData.sub_total_amount = subTotalAmount.toFixed(2);
    },

    computeTotalDiscountAmountAmount() {
      const details = this.formData.details;
      let totalDiscountAmount = 0;
      details.forEach(element => {
        totalDiscountAmount = totalDiscountAmount + parseFloat(element.discount_amount);
      });
      this.formData.total_discount_amount = totalDiscountAmount.toFixed(2);
    },

    computeTotalAmount() {
      const subTotalAmount = parseFloat(this.formData.sub_total_amount);
      const shippingFeeAmount = parseFloat(this.formData.shipping_fee_amount);
      const totalDiscountAmount = parseFloat(this.formData.total_discount_amount);
      const vatAmount = parseFloat(this.formData.vat_amount);
      let totalAmount = (subTotalAmount + shippingFeeAmount + vatAmount) - totalDiscountAmount;
      this.formData.total_amount = totalAmount.toFixed(2);
    },

    addRow() {
      this.formData.details.push({
        sku: "",
        option_details: [],
        remarks: "",
        quantity: "0",
        rate_amount: "0.00",
        discount_amount: "0.00",
        amount: "0.00",
        product_id: "",
        claim_type: ""
      });
      this.productOptions.push({
          data: []
      })
    },

    deleteRow(index) {
      if (this.formData.details.length > 1) {
        this.formData.details.splice(index, 1);
      }
    },

    editItem(id) {
      let data = this.getSalesOrderById(id);
      this.formData.id = data.id;
      this.formData.order_no = data.order_no;
      this.formData.remarks = data.remarks;
      this.formData.sub_total_amount = data.sub_total_amount;
      this.formData.vat_amount = data.vat_amount;
      this.formData.shipping_fee_amount = data.shipping_fee_amount;
      this.formData.total_discount_amount = data.total_discount_amount;
      this.formData.total_amount = data.total_amount;
      this.formData.contact_no = data.contact_no;
      this.formData.customer_id = data.customer_id;
      this.formData.date_ordered = data.date_ordered;
      this.formData.payment_method_type = data.payment_method_type;
      this.formData.is_paid = data.is_paid;
      this.formData.is_fully_paid = data.is_fully_paid;
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
        this.setLoading({ dialog: true, text: "Please wait" });

        if (this.formType === "new") {
          this.saveSalesOrderData(this.formData)
            .then(response => {
              let obj = {
                alert: true,
                type: "success",
                message: response.data.message
              };
              
              if (!response.data.result) obj.type = "error"
              this.setAlert(obj);
              this.setLoading({ dialog: false, text: "" });
            })
            .catch(err => console.log(err));
        } else if (this.formType === "update") {
          this.updateSalesOrderData(this.formData)
            .then(response => {
              let obj = {
                alert: true,
                type: "success",
                message: response.data.message
              };
              
              if (!response.data.result) obj.type = "error"
              this.setAlert(obj);
              this.setLoading({ dialog: false, text: "" });
            })
            .catch(err => console.log(err));
        }
        this.close();
      }
    }
  }
};
</script>