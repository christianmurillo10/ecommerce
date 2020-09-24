import moment from "moment";
import {
  NO,
  YES,
  MALE,
  FEMALE,
  OTHER,
  CUSTOMER_STATUS_APPROVED,
  CUSTOMER_STATUS_DECLINED,
  CUSTOMER_STATUS_PENDING,
  RATE_TYPE_AMOUNT,
  RATE_TYPE_PERCENTAGE,
  CREDIT,
  DEBIT,
  PAYMENT_METHOD_CASH,
  PAYMENT_METHOD_DEPOSIT,
  PAYMENT_METHOD_CREDIT_CARD,
  PAYMENT_METHOD_BANK_TRANSFER,
  PAYMENT_METHOD_E_WALLET,
  PAYMENT_METHOD_CHEQUE,
  PAYMENT_METHOD_PDC,
  SALES_ORDER_STATUS_CLOSED,
  SALES_ORDER_STATUS_DELIVERED,
  SALES_ORDER_STATUS_ON_PROCESS,
  SALES_ORDER_STATUS_APPROVED,
  SALES_ORDER_STATUS_REVIEWED,
  SALES_ORDER_STATUS_OPEN,
  SALES_ORDER_STATUS_CANCELLED,
  SALES_ORDER_STATUS_FAILED,
  CLAIM_TYPE_DELIVERY,
  CLAIM_TYPE_PICK_UP,
} from "./Constant";

export default {
  data: () => ({
    yesOrNoList: [{ id: NO, name: "No" }, { id: YES, name: "Yes" }],
    genderTypeList: [
      { id: MALE, name: "Male" },
      { id: FEMALE, name: "Female" },
      { id: OTHER, name: "Other" },
    ],
    customerStatusList: [
      { id: CUSTOMER_STATUS_APPROVED, name: "Approved" },
      { id: CUSTOMER_STATUS_DECLINED, name: "Declined" },
      { id: CUSTOMER_STATUS_PENDING, name: "Pending" },
    ],
    rateTypeList: [{ id: RATE_TYPE_AMOUNT, name: "Amount" }, { id: RATE_TYPE_PERCENTAGE, name: "Percentage" }],
    creditDebitTypeList: [{ id: CREDIT, name: "Credit" }, { id: DEBIT, name: "Debit" }],
    paymentMethodTypeList: [
      { id: PAYMENT_METHOD_CASH, name: "Cash" },
      { id: PAYMENT_METHOD_DEPOSIT, name: "Deposit" },
      { id: PAYMENT_METHOD_CREDIT_CARD, name: "Credit Card" },
      { id: PAYMENT_METHOD_BANK_TRANSFER, name: "Bank Transfer" },
      { id: PAYMENT_METHOD_E_WALLET, name: "E-Wallet" },
      { id: PAYMENT_METHOD_CHEQUE, name: "Cheque" },
      { id: PAYMENT_METHOD_PDC, name: "PDC" },
    ],
    salesOrderStatusList: [
      { id: SALES_ORDER_STATUS_CLOSED, name: "Closed" },
      { id: SALES_ORDER_STATUS_DELIVERED, name: "Delivered" },
      { id: SALES_ORDER_STATUS_ON_PROCESS, name: "On Process" },
      { id: SALES_ORDER_STATUS_APPROVED, name: "Approved" },
      { id: SALES_ORDER_STATUS_REVIEWED, name: "Reviewed" },
      { id: SALES_ORDER_STATUS_OPEN, name: "Open" },
      { id: SALES_ORDER_STATUS_CANCELLED, name: "Cancelled" },
      { id: SALES_ORDER_STATUS_FAILED, name: "Failed" },
    ],
    claimTypeList: [{ id: CLAIM_TYPE_DELIVERY, name: "Delivery" }, { id: CLAIM_TYPE_PICK_UP, name: "Pick up" }],
    rules: {
      required: (value) => !!value || "Required.",
      max50Chars: (value) => value.length <= 50 || "Max 50 characters",
      max100Chars: (value) => value.length <= 100 || "Max 100 characters",
      max255Chars: (value) => value.length <= 255 || "Max 255 characters",
      max500Chars: (value) => value.length <= 500 || "Max 500 characters",
      lessThanOrEqualTo10: (value) =>
        value <= 10 || "Must be less than or equal 10",
      email: (value) => {
        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return pattern.test(value) || "Invalid e-mail.";
      },
    },
  }),

  methods: {
    getYesNoStatus(value) {
      if (value == NO) return "NO";
      else if (value == YES) return "YES";
      else return "";
    },

    getYesNoStatusColor(value) {
      if (value == YES) return "green";
      else if (value == NO) return "red";
      else return "";
    },

    getGenderTypes(value) {
      if (value == MALE) return "Male";
      else if (value == FEMALE) return "Female";
      else if (value == OTHER) return "Other";
      else return "";
    },

    getCustomerStatus(value) {
      if (value == CUSTOMER_STATUS_APPROVED) return "Approved";
      else if (value == CUSTOMER_STATUS_DECLINED) return "Declined";
      else if (value == CUSTOMER_STATUS_PENDING) return "Pending";
      else return "";
    },

    getCustomerStatusColor(value) {
      if (value == CUSTOMER_STATUS_APPROVED) return "green";
      else if (value == CUSTOMER_STATUS_DECLINED) return "red";
      else if (value == CUSTOMER_STATUS_PENDING) return "primary";
      else return "";
    },

    getCreditDebitTypes(value) {
      if (value == CREDIT) return "Credit";
      else if (value == DEBIT) return "Debit";
      else return "";
    },

    getPaymentMethodTypes(value) {
      if (value == PAYMENT_METHOD_CASH) return "Cash";
      else if (value == PAYMENT_METHOD_DEPOSIT) return "Deposit";
      else if (value == PAYMENT_METHOD_CREDIT_CARD) return "Credit Card";
      else if (value == PAYMENT_METHOD_BANK_TRANSFER) return "Bank Transfer";
      else if (value == PAYMENT_METHOD_E_WALLET) return "E-Wallet";
      else if (value == PAYMENT_METHOD_CHEQUE) return "Cheque";
      else if (value == PAYMENT_METHOD_PDC) return "PDC";
      else return "";
    },

    getSalesOrderStatus(value) {
      if (value == SALES_ORDER_STATUS_CLOSED) return "Closed";
      else if (value == SALES_ORDER_STATUS_DELIVERED) return "Delivered";
      else if (value == SALES_ORDER_STATUS_ON_PROCESS) return "On Process";
      else if (value == SALES_ORDER_STATUS_APPROVED) return "Approved";
      else if (value == SALES_ORDER_STATUS_REVIEWED) return "Reviewed";
      else if (value == SALES_ORDER_STATUS_OPEN) return "Open";
      else if (value == SALES_ORDER_STATUS_CANCELLED) return "Cancelled";
      else if (value == SALES_ORDER_STATUS_FAILED) return "Failed";
      else return "";
    },

    getClaimTypes(value) {
      if (value == CLAIM_TYPE_DELIVERY) return "Delivery";
      else if (value == CLAIM_TYPE_PICK_UP) return "Pick up";
      else return "";
    },

    setRateTypeValue(value, type) {
      if (type === RATE_TYPE_AMOUNT) return `₱ ${value}`;
      else if (type === RATE_TYPE_PERCENTAGE) return `${value}%`;
      else return "";
    },

    setFullnameLastnameFirst(fname, mname, lname) {
      let firstname = fname
        ? fname.charAt(0).toUpperCase() + fname.slice(1)
        : "";
      let middlename = mname ? `${mname.charAt(0).toUpperCase()}.` : "";
      let lastname = lname ? `${lname.toUpperCase()},` : "";

      return `${lastname} ${firstname} ${middlename}`;
    },

    setDateTime(dateTime) {
      let newDateTime = new Date(dateTime);
      return moment(newDateTime).format("YYYY-MM-DD HH:mm:ss");
    },

    camelCase(value) {
      return value
        .replace(/[$&+,:;=?@#_|'<>.^*()%!-]/g, "")
        .replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
          return index == 0 ? word.toLowerCase() : word.toUpperCase();
        })
        .replace(/\s+/g, "");
    },

    truncateText(text, length) {
      if (text.length > length) return text.substring(0, length) + "...";
      else return text;
    },
  },
};
