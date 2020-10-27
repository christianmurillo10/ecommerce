<template>
  <v-card>
    <v-card-title>
      <v-icon class="black--text">{{ formIcon }}</v-icon>
      <span class="title">{{ formTitle }}</span>
    </v-card-title>
    <v-card-text style="height: 850px;">
      <v-container grid-list-md>
        <v-layout wrap>
          <v-flex xs12 sm12 md12 lg12 v-if="viewData.sales_order_id">
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
                <v-text-field
                  v-model="viewData.date"
                  label="Date"
                  prepend-icon="event"
                  readonly
                ></v-text-field>
              </v-flex>
              <v-flex xs12 sm12 md4 offset-md4>
                <v-text-field
                  v-model="viewData.reference_no"
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
              v-model="viewData.customer_id"
              label="Customer"
              readonly
            ></v-autocomplete>
          </v-flex>
          <v-flex xs12 sm12 md4>
            <v-autocomplete
              :items="getSalesOrderByCustomerList"
              item-text="order_no"
              item-value="id"
              v-model="viewData.sales_order_id"
              label="Order No."
              readonly
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
                      v-model="viewData.payment_method_type"
                      label="Payment Method"
                      readonly
                    ></v-autocomplete>
                  </v-flex>
                  <v-flex xs12 sm12 md6 v-if="displayBank">
                    <v-autocomplete
                      :items="getBankList"
                      item-text="name"
                      item-value="id"
                      v-model="viewData.bank_id"
                      label="Bank"
                      readonly
                    ></v-autocomplete>
                  </v-flex>
                  <v-flex xs12 sm12 md6 v-if="displayOrNo">
                    <v-text-field
                      v-model="viewData.or_no"
                      label="OR No."
                      readonly
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm12 md6>
                    <v-autocomplete
                      :items="yesOrNoList"
                      item-text="name"
                      item-value="id"
                      v-model="viewData.is_with_vat"
                      label="Vat?"
                      readonly
                    ></v-autocomplete>
                  </v-flex>
                  <v-flex xs12 sm12 md6 v-if="viewData.is_with_vat === 1">
                    <v-text-field
                      v-model="viewData.vat_amount"
                      label="Vat Amount"
                      type="number"
                      readonly
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm12 md6>
                    <v-text-field
                      v-model="viewData.amount"
                      label="Amount"
                      type="number"
                      readonly
                    ></v-text-field>
                  </v-flex>
                </v-layout>
              </v-flex>
              <v-flex xs12 sm12 md4>
                <v-textarea
                  v-model="viewData.remarks"
                  label="Remarks"
                  readonly
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
      <v-btn color="blue darken-1" flat @click="close">Close</v-btn>
    </v-card-actions>
  </v-card>
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
    defaultViewData: {
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
    viewData: {
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
    ...mapGetters("salesOrders", ["getSalesOrderByCustomerList"]),
    ...mapGetters("banks", ["getBankList"]),
    ...mapGetters("payments", ["getPaymentById"]),
    formTitle() {
      return "Payment - View";
    },
    formIcon() {
      return "pageview";
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
    "viewData.payment_method_type": function(val) {
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
    ...mapActions("salesOrders", {
      getSalesOrderDataByCustomerId: "getDataByCustomerId",
      getSalesOrderDataById: "getDataById",
    }),
    ...mapActions("banks", { getBanksData: "getData" }),

    setDataByCustomerId() {
      const customerId = this.viewData.customer_id;
      this.getSalesOrderDataByCustomerId(customerId);
    },

    async setDataBySalesOrderId() {
      const salesOrderId = this.viewData.sales_order_id;
      const response = await this.getSalesOrderDataById(salesOrderId);
      const data = response.result;

      // set sales order details
      this.salesOrderDetails.order_no = data.order_no;
      this.salesOrderDetails.total_amount = data.total_amount;
      this.salesOrderDetails.total_balance_amount = data.total_balance_amount;
      this.salesOrderDetails.is_fully_paid = data.is_fully_paid;
      this.salesOrderDetails.is_paid = data.is_paid;

      // set view data
      this.viewData.vat_amount = data.vat_amount;
      this.viewData.payment_method_type = data.payment_method_type;
      this.viewData.is_with_vat = data.is_with_vat;
    },

    async viewItem(id) {
      let data = await this.getPaymentById(id);
      this.viewData.id = data.id;
      this.viewData.reference_no = data.reference_no;
      this.viewData.or_no = data.or_no;
      this.viewData.remarks = data.remarks;
      this.viewData.vat_amount = data.vat_amount;
      this.viewData.amount = data.amount;
      this.viewData.customer_id = data.customer_id;
      this.viewData.sales_order_id = data.sales_order_id;
      this.viewData.bank_id = data.bank_id;
      this.viewData.customer_credit_debit_card_id =
        data.customer_credit_debit_card_id;
      this.viewData.date = data.date;
      this.viewData.payment_method_type = data.payment_method_type;
      this.viewData.is_with_vat = data.is_with_vat;
      await this.setDataByCustomerId();
      await this.setDataBySalesOrderId();
    },

    close() {
      this.$emit("setDialog", false);
      setTimeout(() => {
        this.viewData = Object.assign({}, this.defaultViewData);
      }, 300);
    },
  },
};
</script>

<style lang="css" scoped>
@import "../../../assets/css/table.css";
</style>
