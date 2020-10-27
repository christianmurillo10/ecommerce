<template>
  <v-form ref="form" @submit.prevent="save" v-model="valid" lazy-validation>
    <v-card>
      <v-card-title>
        <v-icon class="black--text">{{ formIcon }}</v-icon>
        <span class="title">{{ formTitle }}</span>
      </v-card-title>
      <v-card-text style="height: 850px;">
        <v-container grid-list-md>
          <v-layout wrap>
            <v-flex xs12 sm12 md12 lg12 v-if="formData.sales_order_id">
              <table class="custom-table">
                <tr>
                  <th class="text-xs-center" style="width: 30%">ORDER NO.</th>
                  <th class="text-xs-center">TOTAL AMOUNT</th>
                  <th class="text-xs-center">TOTAL BALANCE</th>
                  <th class="text-xs-center">PAID?</th>
                  <th class="text-xs-center">FULLY PAID?</th>
                </tr>

                <tr>
                  <td>{{ salesOrderDetails.order_no }}</td>
                  <td class="text-xs-right">
                    {{ salesOrderDetails.total_amount }}
                  </td>
                  <td class="text-xs-right">
                    {{ salesOrderDetails.total_balance_amount }}
                  </td>
                  <td class="text-xs-center">
                    {{ getYesNoStatus(salesOrderDetails.is_paid) }}
                  </td>
                  <td class="text-xs-center">
                    {{ getYesNoStatus(salesOrderDetails.is_fully_paid) }}
                  </td>
                </tr>
              </table>
            </v-flex>
            <v-flex xs12 sm12 md12>
              <v-layout wrap row>
                <v-flex xs12 sm12 md4>
                  <v-menu
                    ref="date"
                    v-model="date"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    :return-value.sync="formData.date"
                    lazy
                    transition="scale-transition"
                    offset-y
                    full-width
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        v-model="formData.date"
                        label="Date"
                        prepend-icon="event"
                        readonly
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker v-model="formData.date" no-title scrollable>
                      <v-spacer></v-spacer>
                      <v-btn flat color="primary" @click="date = false">
                        Cancel
                      </v-btn>
                      <v-btn
                        flat
                        color="primary"
                        @click="$refs.date.save(formData.date)"
                      >
                        OK
                      </v-btn>
                    </v-date-picker>
                  </v-menu>
                </v-flex>
                <v-flex xs12 sm12 md4 offset-md4 v-if="formType === 'update'">
                  <v-text-field
                    v-model="formData.reference_no"
                    :rules="[rules.max50Chars]"
                    label="Reference No."
                    readonly
                  ></v-text-field>
                </v-flex>
              </v-layout>
            </v-flex>
            <v-flex xs12 sm12 md8>
              <v-autocomplete
                :items="getCustomerList"
                item-text="name"
                item-value="id"
                v-model="formData.customer_id"
                :rules="[rules.required]"
                label="Customer"
                v-on:change="setDataByCustomerId()"
              ></v-autocomplete>
            </v-flex>
            <v-flex xs12 sm12 md4>
              <v-autocomplete
                :items="getSalesOrderByCustomerList"
                item-text="order_no"
                item-value="id"
                v-model="formData.sales_order_id"
                :rules="[rules.required]"
                label="Order No."
                :disabled="formData.customer_id === '' ? true : false"
                v-on:change="setDataBySalesOrderId()"
              ></v-autocomplete>
            </v-flex>
            <v-flex xs12 sm12 md12>
              <v-layout wrap row>
                <v-flex xs12 sm12 md8>
                  <v-layout wrap row>
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
                    <v-flex xs12 sm12 md6 v-if="displayBank">
                      <v-autocomplete
                        :items="getBankList"
                        item-text="name"
                        item-value="id"
                        v-model="formData.bank_id"
                        label="Bank"
                      ></v-autocomplete>
                    </v-flex>
                    <v-flex xs12 sm12 md6 v-if="displayOrNo">
                      <v-text-field
                        v-model="formData.or_no"
                        :rules="[rules.max50Chars]"
                        label="OR No."
                      ></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm12 md6>
                      <v-autocomplete
                        :items="yesOrNoList"
                        item-text="name"
                        item-value="id"
                        v-model="formData.is_with_vat"
                        label="Vat?"
                      ></v-autocomplete>
                    </v-flex>
                    <v-flex xs12 sm12 md6 v-if="formData.is_with_vat === 1">
                      <v-text-field
                        v-model="formData.vat_amount"
                        label="Vat Amount"
                        type="number"
                      ></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm12 md6>
                      <v-text-field
                        v-model="formData.amount"
                        :rules="[rules.required]"
                        label="Amount"
                        type="number"
                      ></v-text-field>
                    </v-flex>
                  </v-layout>
                </v-flex>
                <v-flex xs12 sm12 md4>
                  <v-textarea
                    v-model="formData.remarks"
                    :rules="[rules.max500Chars]"
                    label="Remarks"
                  ></v-textarea>
                </v-flex>
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
import {
  PAYMENT_METHOD_CASH,
  PAYMENT_METHOD_DEPOSIT,
  PAYMENT_METHOD_CREDIT_CARD,
  PAYMENT_METHOD_BANK_TRANSFER,
  PAYMENT_METHOD_E_WALLET,
  PAYMENT_METHOD_CHEQUE,
  PAYMENT_METHOD_PDC,
} from "@/helpers/Constant.js";
import { mapGetters, mapActions } from "vuex";

export default {
  mixins: [Mixins],

  data: () => ({
    date: false,
    defaultFormData: {
      reference_no: "",
      or_no: "",
      remarks: "",
      vat_amount: "",
      amount: "",
      customer_id: null,
      sales_order_id: null,
      bank_id: null,
      customer_credit_debit_card_id: null,
      date: new Date().toISOString().substr(0, 10),
      payment_method_type: null,
      is_with_vat: null,
    },
    formType: "new",
    formData: {
      reference_no: "",
      or_no: "",
      remarks: "",
      vat_amount: "",
      amount: "",
      customer_id: null,
      sales_order_id: null,
      bank_id: null,
      customer_credit_debit_card_id: null,
      date: new Date().toISOString().substr(0, 10),
      payment_method_type: null,
      is_with_vat: null,
    },
    valid: true,
    salesOrderDetails: {
      order_no: "",
      total_amount: "0.00",
      total_balance_amount: "0.00",
      is_fully_paid: 0,
      is_paid: 0,
    },
    displayBank: false,
    displayOrNo: false,
  }),

  computed: {
    ...mapGetters("customers", ["getCustomerList"]),
    // ...mapGetters("customerCreditDebitCards", ["getCustomerCreditDebitCardList"]),
    ...mapGetters("salesOrders", ["getSalesOrderByCustomerList"]),
    ...mapGetters("banks", ["getBankList"]),
    ...mapGetters("payments", ["getPaymentById"]),
    formTitle() {
      return this.formType === "new" ? "Payment - Create" : "Payment - Update";
    },
    formIcon() {
      return this.formType === "new" ? "add_box" : "edit";
    },
  },

  created() {
    this.getCustomersData();
    this.getBanksData();
  },

  watch: {
    getCustomerList(val) {
      val.map(
        (element) =>
          (element.name = this.setFullnameLastnameFirst(
            element.firstname,
            element.middlename,
            element.lastname
          ))
      );
    },
    "formData.payment_method_type": function(val) {
      if (val === PAYMENT_METHOD_CASH) {
        this.displayBank = false;
        this.displayOrNo = false;
      } else if (
        val === PAYMENT_METHOD_DEPOSIT ||
        val === PAYMENT_METHOD_CREDIT_CARD ||
        val === PAYMENT_METHOD_BANK_TRANSFER ||
        val === PAYMENT_METHOD_CHEQUE ||
        val === PAYMENT_METHOD_PDC
      ) {
        this.displayBank = true;
        this.displayOrNo = true;
      } else {
        this.displayBank = false;
      }
    },
  },

  methods: {
    ...mapActions("alerts", ["setAlert"]),
    ...mapActions("customers", { getCustomersData: "getData" }),
    // ...mapActions("customerCreditDebitCards", { getCustomerCreditDebitCardDataByCustomerId: "getDataByCustomerId" }),
    ...mapActions("salesOrders", {
      getSalesOrderDataByCustomerId: "getDataByCustomerId",
      getSalesOrderDataById: "getDataById",
    }),
    ...mapActions("banks", { getBanksData: "getData" }),
    ...mapActions("payments", {
      savePaymentData: "saveData",
      updatePaymentData: "updateData",
    }),

    setDataByCustomerId() {
      const customerId = this.formData.customer_id;
      this.getSalesOrderDataByCustomerId(customerId);
      // this.getCustomerCreditDebitCardDataByCustomerId(customerId);
    },

    async setDataBySalesOrderId() {
      const salesOrderId = this.formData.sales_order_id;
      const response = await this.getSalesOrderDataById(salesOrderId);
      const data = response.result;

      // set sales order details
      this.salesOrderDetails.order_no = data.order_no;
      this.salesOrderDetails.total_amount = data.total_amount;
      this.salesOrderDetails.total_balance_amount = data.total_balance_amount;
      this.salesOrderDetails.is_fully_paid = data.is_fully_paid;
      this.salesOrderDetails.is_paid = data.is_paid;

      // set form data
      this.formData.vat_amount = data.vat_amount;
      this.formData.amount = data.total_balance_amount;
      this.formData.payment_method_type = data.payment_method_type;
      this.formData.is_with_vat = data.is_with_vat;
    },

    async editItem(id) {
      let data = await this.getPaymentById(id);
      this.formData.id = data.id;
      this.formData.reference_no = data.reference_no;
      this.formData.or_no = data.or_no;
      this.formData.remarks = data.remarks;
      this.formData.vat_amount = data.vat_amount;
      this.formData.amount = data.amount;
      this.formData.customer_id = data.customer_id;
      this.formData.sales_order_id = data.sales_order_id;
      this.formData.bank_id = data.bank_id;
      this.formData.customer_credit_debit_card_id =
        data.customer_credit_debit_card_id;
      this.formData.date = data.date;
      this.formData.payment_method_type = data.payment_method_type;
      this.formData.is_with_vat = data.is_with_vat;
      this.formType = "update";
      await this.setDataByCustomerId();
      await this.setDataBySalesOrderId();
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
          this.savePaymentData(this.formData)
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
          this.updatePaymentData(this.formData)
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

<style lang="css" scoped>
@import "../../../assets/css/table.css";
</style>
