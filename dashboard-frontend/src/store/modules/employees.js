import axios from "axios";
const apiUrl = process.env.VUE_APP_API_BACKEND;

const state = {
  employeeList: [],
  employeeTotalCountByIsActive: 0,
};

const getters = {
  getEmployeeById: (state) => (id) => {
    return state.employeeList.find((employee) => employee.id === id);
  },
  getEmployeeEmployeeNoById: (state) => (id) => {
    return state.employeeList.find((employee) => employee.id === id)
      .employee_no;
  },
  getEmployeeList: (state) => {
    return state.employeeList;
  },
};

const actions = {
  getData({ dispatch, commit, state, rootState, getters, rootGetters }) {
    const url = `${apiUrl}/employees/`;
    const header = {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    };
    return new Promise((resolve, reject) => {
      try {
        axios
          .get(url, header)
          .then((response) => {
            const data = response.data;
            let obj = data.result;
            if (obj) {
              obj.forEach((element) => {
                // set fullname lastname first
                const firstname = element.firstname
                  ? element.firstname.charAt(0).toUpperCase() +
                    element.firstname.slice(1)
                  : "";
                const middlename = element.middlename
                  ? `${element.middlename.charAt(0).toUpperCase()}.`
                  : "";
                const lastname = element.lastname
                  ? `${element.lastname.toUpperCase()},`
                  : "";
                element.name = `${lastname} ${firstname} ${middlename}`;
              });
            }
            commit("SET_DATA", obj);
            resolve(data);
          })
          .catch((err) => {
            commit("SET_DATA", []);
            resolve(err.response.data);
          });
      } catch (err) {
        reject(err);
      }
    });
  },
  getTotalCountByStatusAndIsActive(
    { dispatch, commit, state, rootState, getters, rootGetters },
    payload
  ) {
    const url = `${apiUrl}/employees/countAllByIsActive/${payload.is_active}`;
    const header = {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    };
    return new Promise((resolve, reject) => {
      try {
        axios
          .get(url, header)
          .then((response) => {
            const data = response.data;
            commit("SET_TOTAL_COUNT_BY_IS_ACTIVE", data.result);
            resolve(data);
          })
          .catch((err) => {
            commit("SET_TOTAL_COUNT_BY_IS_ACTIVE", 0);
            resolve(err.response.data);
          });
      } catch (err) {
        reject(err);
      }
    });
  },
  saveData(
    { dispatch, commit, state, rootState, getters, rootGetters },
    payload
  ) {
    const url = `${apiUrl}/employees/create`;
    const header = {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    };
    return new Promise((resolve, reject) => {
      try {
        let obj = {
          firstname: payload.firstname,
          middlename: payload.middlename,
          lastname: payload.lastname,
          email: payload.email,
          primary_address: payload.primary_address,
          secondary_address: payload.secondary_address,
          contact_no: payload.contact_no,
          date_hired: payload.date_hired,
          gender_type: payload.gender_type,
        };

        axios
          .post(url, obj, header)
          .then((response) => {
            const data = response.data;
            let obj = data.result;
            if (obj) {
              obj.gender_type = parseInt(obj.gender_type);
              obj.is_active = parseInt(obj.is_active);
              commit("ADD_DATA", obj);
            }
            resolve(data);
          })
          .catch((err) => {
            resolve(err.response.data);
          });
      } catch (err) {
        reject(err);
      }
    });
  },
  updateData(
    { dispatch, commit, state, rootState, getters, rootGetters },
    payload
  ) {
    const url = `${apiUrl}/employees/update/${payload.id}`;
    const header = {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    };
    return new Promise((resolve, reject) => {
      try {
        let obj = {
          firstname: payload.firstname,
          middlename: payload.middlename,
          lastname: payload.lastname,
          email: payload.email,
          primary_address: payload.primary_address,
          secondary_address: payload.secondary_address,
          contact_no: payload.contact_no,
          date_hired: payload.date_hired,
          date_endo: payload.date_endo,
          gender_type: payload.gender_type,
          is_active: payload.is_active,
        };

        axios
          .put(url, obj, header)
          .then((response) => {
            const data = response.data;
            let obj = data.result;
            if (obj) {
              obj.gender_type = parseInt(obj.gender_type);
              obj.is_active = parseInt(obj.is_active);
              commit("UPDATE_DATA", response.data.result);
            }
            resolve(data);
          })
          .catch((err) => {
            resolve(err.response.data);
          });
      } catch (err) {
        reject(err);
      }
    });
  },
  deleteData(
    { dispatch, commit, state, rootState, getters, rootGetters },
    payload
  ) {
    const url = `${apiUrl}/employees/delete/${payload}`;
    const header = {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    };
    return new Promise((resolve, reject) => {
      try {
        axios
          .put(url, "", header)
          .then((response) => {
            const data = response.data;
            commit("DELETE_DATA", payload);
            resolve(data);
          })
          .catch((err) => {
            resolve(err.response.data);
          });
      } catch (err) {
        reject(err);
      }
    });
  },
};

const mutations = {
  SET_DATA(state, payload) {
    if (payload) {
      state.employeeList = payload;
    } else {
      state.employeeList = [];
    }
  },
  SET_TOTAL_COUNT_BY_IS_ACTIVE(state, payload) {
    if (payload) {
      state.employeeTotalCountByIsActive = payload;
    } else {
      state.employeeTotalCountByIsActive = 0;
    }
  },
  ADD_DATA(state, payload) {
    state.employeeList.push(payload);
  },
  UPDATE_DATA(state, payload) {
    const index = state.employeeList
      .map((employee) => employee.id)
      .indexOf(payload.id);

    Object.assign(state.employeeList[index], {
      employee_no: payload.employee_no,
      firstname: payload.firstname,
      middlename: payload.middlename,
      lastname: payload.lastname,
      email: payload.email,
      primary_address: payload.primary_address,
      secondary_address: payload.secondary_address,
      contact_no: payload.contact_no,
      date_hired: payload.date_hired,
      date_endo: payload.date_endo,
      gender_type: payload.gender_type,
      is_active: payload.is_active,
    });
  },
  DELETE_DATA(state, payload) {
    const index = state.employeeList
      .map((employee) => employee.id)
      .indexOf(payload);
    state.employeeList.splice(index, 1);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
