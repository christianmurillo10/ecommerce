import moment from "moment";

export default {
  data: () => ({
    yesOrNoList: [
      { id: 0, name: "No" },
      { id: 1, name: "Yes" },
    ],
    genderTypeList: [
      { id: 1, name: "Male" },
      { id: 2, name: "Female" },
      { id: 3, name: "Other" },
    ],
    customerStatusList: [
      { id: 1, name: "Approved" },
      { id: 2, name: "Declined" },
      { id: 3, name: "Pending" },
    ],
    rateTypeList: [
      { id: 1, name: "Amount" },
      { id: 2, name: "Percentage" },
    ],
    creditDebitTypeList: [
      { id: 1, name: "Credit" },
      { id: 2, name: "Debit" },
    ],
    paymentMethodTypeList: [
      { id: 1, name: "Cash" },
      { id: 2, name: "Deposit" },
      { id: 3, name: "Credit Card" },
      { id: 4, name: "Bank Transfer" },
      { id: 5, name: "E-Wallet" },
      { id: 6, name: "Cheque" },
      { id: 7, name: "PDC" },
    ],
    salesOrderStatusList: [
      { id: 1, name: "Closed" },
      { id: 2, name: "Delivered" },
      { id: 3, name: "On Process" },
      { id: 4, name: "Approved" },
      { id: 5, name: "Reviewed" },
      { id: 6, name: "Open" },
      { id: 7, name: "Cancelled" },
      { id: 8, name: "Failed" },
    ],
    claimTypeList: [
      { id: 1, name: "Delivery" },
      { id: 2, name: "Pick up" },
    ],
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
      if (value == 0) return "NO";
      else if (value == 1) return "YES";
      else return "";
    },

    getYesNoStatusColor(value) {
      if (value == 1) return "green";
      else if (value == 0) return "red";
      else return "";
    },

    getGenderTypes(value) {
      if (value == 1) return "Male";
      else if (value == 2) return "Female";
      else if (value == 3) return "Other";
      else return "";
    },

    getCustomerStatus(value) {
      if (value == 1) return "Approved";
      else if (value == 2) return "Declined";
      else if (value == 3) return "Pending";
      else return "";
    },

    getCustomerStatusColor(value) {
      if (value == 1) return "green";
      else if (value == 2) return "red";
      else if (value == 3) return "primary";
      else return "";
    },

    getCreditDebitTypes(value) {
      if (value == 1) return "Credit";
      else if (value == 2) return "Debit";
      else return "";
    },

    getPaymentMethodTypes(value) {
      if (value == 1) return "Cash";
      else if (value == 2) return "Deposit";
      else if (value == 3) return "Credit Card";
      else if (value == 4) return "Bank Transfer";
      else if (value == 5) return "E-Wallet";
      else if (value == 6) return "Cheque";
      else if (value == 7) return "PDC";
      else return "";
    },

    getSalesOrderStatus(value) {
      if (value == 1) return "Closed";
      else if (value == 2) return "Delivered";
      else if (value == 3) return "On Process";
      else if (value == 4) return "Approved";
      else if (value == 5) return "Reviewed";
      else if (value == 6) return "Open";
      else if (value == 7) return "Cancelled";
      else if (value == 8) return "Failed";
      else return "";
    },

    getClaimTypes(value) {
      if (value == 1) return "Delivery";
      else if (value == 2) return "Pick up";
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

    setDate(date) {
      let newDateTime = new Date(date);
      return moment(newDateTime).format("YYYY-MM-DD");
    },

    setTime(time) {
      let newDateTime = new Date(time);
      return moment(newDateTime).format("HH:mm:ss");
    },

    setRateTypeValue(value, type) {
      if (type === 1) return `₱ ${value}`;
      else if (type === 2) return `${value}%`;
      else return "";
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
