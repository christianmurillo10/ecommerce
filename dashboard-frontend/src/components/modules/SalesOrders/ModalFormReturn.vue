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
            <v-flex xs12 sm12 md6>
              <v-layout wrap row>
                <v-flex xs12 sm12 md6>
                    <v-text-field
                      v-model="formData.date_ordered"
                      label="Date Ordered"
                      readonly
                    ></v-text-field>
                </v-flex>
                <v-flex xs12 sm12 md6>
                  <v-autocomplete
                    :items="paymentMethodTypeList"
                    item-text="name"
                    item-value="id"
                    v-model="formData.payment_method_type"
                    :rules="[rules.required]"
                    label="Payment Method"
                    readonly
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
                    readonly
                  ></v-autocomplete>
                </v-flex>
              </v-layout>
            </v-flex>
            <v-flex xs12 sm12 md6>
              <v-textarea
                v-model="formData.remarks"
                :rules="[rules.max500Chars]"
                label="Remarks"
                readonly
              ></v-textarea>
            </v-flex>
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
                        readonly
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
                        readonly
                      ></v-autocomplete>
                    </v-flex>
                    <v-flex xs12 sm12 md3 v-if="formData.details[i].product_id">
                      <v-autocomplete
                        :items="yesOrNoList"
                        item-text="name"
                        item-value="id"
                        v-model="formData.details[i].is_flash_deal"
                        label="Flash Deal?"
                        readonly
                      ></v-autocomplete>
                    </v-flex>
                    <v-flex xs12 sm12 md12>
                      <v-layout wrap row>
                        <v-flex xs12 sm12 md3 v-for="(variant, x) in productVariants[i].data" :key="x">
                          <v-autocomplete
                            :items="variant.values"
                            item-text="name"
                            return-object
                            v-model="formData.details[i].variant_details[x]"
                            :rules="[rules.required]"
                            :label="variant.title"
                            readonly
                          ></v-autocomplete>
                        </v-flex>
                      </v-layout>
                    </v-flex>
                    <v-flex xs12 sm12 md12>
                      <v-layout wrap row>
                        <v-flex xs12 sm12 md3>
                          <v-layout wrap row>
                            <v-flex xs12 sm12 md12>
                              <v-text-field
                                v-model="formData.details[i].quantity"
                                :rules="[rules.required, rules.max50Chars]"
                                label="Quantity"
                                type="number"
                                readonly
                                required
                              ></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm12 md12>
                              <v-text-field
                                v-model="formData.details[i].quantity_returned"
                                :rules="[rules.required, rules.max50Chars]"
                                label="Quantity Returned"
                                type="number"
                                required
                              ></v-text-field>
                            </v-flex>
                          </v-layout>
                        </v-flex>
                        <v-flex xs12 sm12 md6>
                          <v-layout wrap row>
                            <v-flex xs12 sm12 md12>
                              <v-textarea
                                v-model="formData.details[i].return_remarks"
                                :rules="[rules.max500Chars]"
                                label="Return Remarks"
                                required
                              ></v-textarea>
                            </v-flex>
                          </v-layout>
                        </v-flex>
                      </v-layout>
                    </v-flex>
                  </v-layout>
                </v-card-text>
              </v-card>
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
import { mapGetters, mapActions, mapMutations } from "vuex";

export default {
  mixins: [Mixins],

  data: () => ({
    defaultFormData: {
      order_no: "",
      remarks: "",
      customer_id: "",
      date_ordered: new Date().toISOString().substr(0, 10),
      payment_method_type: "",
      details: [
        {
          variant_details: [],
          return_remarks: "",
          quantity: "0",
          quantity_returned: "1",
          product_id: "",
          claim_type: "",
          is_flash_deal: 0
        }
      ],
    },
    formType: "new",
    formData: {
      order_no: "",
      remarks: "",
      customer_id: "",
      date_ordered: new Date().toISOString().substr(0, 10),
      payment_method_type: "",
      details: [
        {
          variant_details: [],
          return_remarks: "",
          quantity: "0",
          quantity_returned: "1",
          product_id: "",
          discount_type: null,
          claim_type: "",
          is_flash_deal: 0
        }
      ],
    },
    productVariants: [{
        data: []
    }],
    valid: true
  }),

  computed: {
    ...mapGetters("customers", ["getCustomerList"]),
    ...mapGetters("products", ["getProductList"]),
    ...mapGetters("productFlashDeals", ["getProductFlashDealTodayFlashDeal"]),
    ...mapGetters("productVariants", ["getProductVariantList"]),
    formTitle() {
      return "Sales Order - Return";
    },
    formIcon() {
      return "edit";
    }
  },

  created() {
    this.getCustomersData();
    this.getProductData();
    this.getProductFlashDealDataTodayFlashDeal();
  },

  watch: {
    getCustomerList(val) {
      val.map(element => element.name = this.setFullnameLastnameFirst(element.firstname, element.middlename, element.lastname));
    }
  },

  methods: {
    ...mapMutations("loading", { setLoading: "SET_LOADING" }),
    ...mapActions("alerts", ["setAlert"]),
    ...mapActions("customers", { getCustomersData: "getData" }),
    ...mapActions("products", { getProductData: "getData" }),
    ...mapActions("productFlashDeals", { getProductFlashDealDataTodayFlashDeal: "getDataTodayFlashDeal" }),
    ...mapActions("productVariants", { getProductVariantDataByProductId: "getDataByProductId" }),
    ...mapActions("salesOrders", {
      updateSalesOrderReturnData: "updateReturnData",
      getSalesOrderDataById: "getDataById"
    }),

    async setProductVariants(index, productId, type) {
      await this.getProductVariantDataByProductId(productId);
      await this.setProductVariantIndexData(index);
    },

    async setProductVariantIndexData(index) {
      try {
        let data = [];

        this.getProductVariantList.forEach(element => {
          let arrayValues = JSON.parse(element.values);
          let arrayObjValue = [];
          arrayValues.map(value => arrayObjValue.push({ code: value.code, name: value.name }));
          data.push({ id: element.id, title: element.title, values: arrayObjValue });
        });

        if (this.productVariants[index]) {
          this.productVariants[index].data = data;
        } else {
          this.productVariants.push({ data: data });
        }
      } catch (err) {
        console.log(err);
      }
    },

    async editReturn(id) {
      const response = await this.getSalesOrderDataById(id);
      let data = response.data.result;

      // set details values
      let details = [];
      for(let i = 0; i < data.salesOrderDetails.length; i++) {
          let obj = data.salesOrderDetails[i];
          details.push({
            id: obj.id,
            variant_details: JSON.parse(obj.variant_details),
            return_remarks: _.isNull(obj.return_remarks) ? "" : obj.return_remarks,
            quantity: obj.quantity.toString(),
            quantity_returned: obj.quantity_returned.toString(),
            product_id: obj.product_id,
            claim_type: obj.claim_type,
            is_flash_deal: obj.is_flash_deal
          });

          await this.setProductVariants(i, obj.product_id);
      }

      this.formData.id = data.id;
      this.formData.order_no = data.order_no;
      this.formData.remarks = data.remarks;
      this.formData.customer_id = data.customer_id;
      this.formData.date_ordered = data.date_ordered;
      this.formData.payment_method_type = data.payment_method_type;
      this.formData.details = details;
    },

    close() {
      this.$emit("setDialogReturn", false);
      setTimeout(() => {
        this.formData = Object.assign({}, this.defaultFormData);
      }, 300);
    },

    save() {
      if (this.$refs.form.validate()) {
        this.setLoading({ dialog: true, text: "Please wait" });
        this.updateSalesOrderReturnData(this.formData)
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
        this.close();
      }
    }
  }
};
</script>