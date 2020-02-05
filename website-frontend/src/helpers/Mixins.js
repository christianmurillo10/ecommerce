export default {
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

    camelCase(value) {
      return value.replace(/[$&+,:;=?@#_|'<>.^*()%!-]/g, '').replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
        return index == 0 ? word.toLowerCase() : word.toUpperCase();
      }).replace(/\s+/g, '');
    }
  }
}
