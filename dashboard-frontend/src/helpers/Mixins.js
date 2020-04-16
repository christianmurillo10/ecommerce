import moment from "moment";

export default {
  data: () => ({
    rateTypeList: [
      { id: 1, name: "Amount" },
      { id: 2, name: "Percentage" }
    ],
  }),

  methods: {
    getYesNoStatus(value) {
      let response = null;
      if (value == 0) {
        response = "NO";
      } else if (value == 1) {
        response = "YES";
      }

      return response;
    },

    getGenderTypes(value) {
      let response = null;
      if (value == 1) {
        response = "Male";
      } else if (value == 2) {
        response = "Female";
      }

      return response;
    },

    getStatus(value) {
      let response = null;
      if (value == 1) {
        response = "Approved";
      } else if (value == 2) {
        response = "Denied";
      } else if (value == 3) {
        response = "Pending";
      } else if (value == 4) {
        response = "Processing";
      }

      return response;
    },

    setFullnameLastnameFirst(fname, mname, lname) {
      let firstname = fname ? fname.charAt(0).toUpperCase() + fname.slice(1) : "";
      let middlename = mname ? `${mname.charAt(0).toUpperCase()}.` : "";
      let lastname = lname ? `${lname.toUpperCase()},` : "";

      return `${lastname} ${firstname} ${middlename}`
    },

    setDateTime(dateTime) {
      let newDateTime = new Date(dateTime);
      return moment(newDateTime).format("YYYY-MM-DD HH:mm:ss");
    },

    setRateTypeValue(value, type) {
      let response = "";
      if (type === 1) response = `₱ ${value}`;
      else if  (type === 2) response = `${value}%`;
      return response;
    },

    camelCase(value) {
      return value.replace(/[$&+,:;=?@#_|'<>.^*()%!-]/g, '').replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
        return index == 0 ? word.toLowerCase() : word.toUpperCase();
      }).replace(/\s+/g, '');
    },

    truncateText(text, length) {
      if (text.length > length) {
        return text.substring(0, length) + "...";
      } else {
        return text;
      }
    }
  }
}
