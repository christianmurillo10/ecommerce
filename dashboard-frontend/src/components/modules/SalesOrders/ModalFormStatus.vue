<template>
  <v-form ref="form" @submit.prevent="save" v-model="valid" lazy-validation>
    <v-card>
      <v-card-title>
        <v-icon class="black--text">{{ formIcon }}</v-icon>
        <span class="title">{{ formTitle }}</span>
      </v-card-title>
      <v-card-text>
        <v-container grid-list-md>
          <v-layout wrap>
            <v-flex xs12 sm12 md12>
              <v-autocomplete
                :items="statusList"
                item-text="name"
                item-value="id"
                v-model="formData.status"
                :rules="[rules.required]"
                label="Status"
                v-on:change="setDateDetails()"
              ></v-autocomplete>
            </v-flex>
            <v-flex xs12 sm12 md12 v-if="employee.display">
              <v-autocomplete
                :items="getEmployeeList"
                item-text="name"
                item-value="id"
                v-model="formData.employee_id"
                :rules="[rules.required]"
                :label="employee.label"
              ></v-autocomplete>
            </v-flex>
            <v-flex xs12 sm12 md12 v-if="date.display">
              <v-menu
                ref="date"
                v-model="date.model"
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
                    :label="date.label"
                    readonly
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker v-model="formData.date" no-title scrollable>
                  <v-spacer></v-spacer>
                  <v-btn flat color="primary" @click="date.model = false">
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
  SALES_ORDER_STATUS_CLOSED,
  SALES_ORDER_STATUS_DELIVERED,
  SALES_ORDER_STATUS_ON_PROCESS,
  SALES_ORDER_STATUS_APPROVED,
  SALES_ORDER_STATUS_REVIEWED,
  SALES_ORDER_STATUS_OPEN,
  SALES_ORDER_STATUS_CANCELLED,
  SALES_ORDER_STATUS_FAILED,
} from "@/helpers/Constant.js";
import { mapGetters, mapActions, mapMutations } from "vuex";

export default {
  mixins: [Mixins],

  data: () => ({
    statusList: [],
    date: {
      display: false,
      label: "",
      model: false,
    },
    employee: {
      display: false,
      label: "",
    },
    defaultFormData: {
      status: "",
      employee_id: "",
      date: new Date().toISOString().substr(0, 10),
    },
    formData: {
      status: "",
      employee_id: "",
      date: new Date().toISOString().substr(0, 10),
    },
    valid: true,
  }),

  computed: {
    ...mapGetters("salesOrders", ["getSalesOrderByStatusAndId"]),
    ...mapGetters("employees", ["getEmployeeList"]),
    formTitle() {
      return "Sales Order - Update Status";
    },
    formIcon() {
      return "edit";
    },
  },

  created() {
    this.getEmployeeData();
  },

  methods: {
    ...mapMutations("loading", { setLoading: "SET_LOADING" }),
    ...mapActions("alerts", ["setAlert"]),
    ...mapActions("employees", { getEmployeeData: "getData" }),
    ...mapActions("salesOrders", {
      updateSalesOrderStatusData: "updateStatusData",
    }),

    setDateDetails() {
      const status = this.formData.status;
      this.date.display = false;
      this.date.label = "";
      this.employee.display = false;
      this.employee.label = "";

      switch (status) {
        case SALES_ORDER_STATUS_DELIVERED:
          this.date.display = true;
          this.date.label = "Date Delivered";
          break;
        case SALES_ORDER_STATUS_ON_PROCESS:
          this.date.display = true;
          this.date.label = "Date Delivery";
          break;
        case SALES_ORDER_STATUS_APPROVED:
          this.date.display = true;
          this.date.label = "Date Approved";
          this.employee.display = true;
          this.employee.label = "Approved By";
          break;
        case SALES_ORDER_STATUS_REVIEWED:
          this.employee.display = true;
          this.employee.label = "Reviewed By";
          break;
      }
    },

    setStatusList(status) {
      let filteredStatus = [];

      switch (status) {
        case SALES_ORDER_STATUS_CLOSED:
          filteredStatus = [SALES_ORDER_STATUS_CLOSED];
          break;
        case SALES_ORDER_STATUS_DELIVERED:
          filteredStatus = [
            SALES_ORDER_STATUS_DELIVERED,
            SALES_ORDER_STATUS_FAILED,
          ];
          break;
        case SALES_ORDER_STATUS_ON_PROCESS:
          filteredStatus = [
            SALES_ORDER_STATUS_ON_PROCESS,
            SALES_ORDER_STATUS_CANCELLED,
            SALES_ORDER_STATUS_FAILED,
          ];
          break;
        case SALES_ORDER_STATUS_APPROVED:
          filteredStatus = [
            SALES_ORDER_STATUS_APPROVED,
            SALES_ORDER_STATUS_CANCELLED,
            SALES_ORDER_STATUS_FAILED,
          ];
          break;
        case SALES_ORDER_STATUS_REVIEWED:
          filteredStatus = [
            SALES_ORDER_STATUS_REVIEWED,
            SALES_ORDER_STATUS_CANCELLED,
            SALES_ORDER_STATUS_FAILED,
          ];
          break;
      }

      this.statusList = this.salesOrderStatusList.filter((item) =>
        filteredStatus.includes(item.id)
      );
    },

    editStatus(id, defaultStatus) {
      let data = this.getSalesOrderByStatusAndId(id);
      this.formData.id = data.id;
      this.formData.status = defaultStatus;
      this.setStatusList(defaultStatus);
      this.setDateDetails();
    },

    close() {
      this.$emit("setDialogStatus", false);
      setTimeout(() => {
        this.formData = Object.assign({}, this.defaultFormData);
      }, 300);
    },

    save() {
      if (this.$refs.form.validate()) {
        this.setLoading({ dialog: true, text: "Please wait" });
        this.updateSalesOrderStatusData(this.formData)
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
            this.setLoading({ dialog: false, text: "" });
          })
          .catch((err) => console.log(err));
        this.close();
      }
    },
  },
};
</script>
