<template>
  <v-form ref="form" @submit.prevent="save" v-model="valid" lazy-validation>
    <v-card>
      <v-card-title>
        <v-icon class="black--text">{{ formIcon }}</v-icon><span class="title">{{ formTitle }}</span>
      </v-card-title>
      <v-card-text>
        <v-container grid-list-md>
          <v-layout wrap>
            <v-flex xs12 sm12 md12>
              <v-autocomplete
                :items="salesOrderStatusList"
                item-text="name"
                item-value="id"
                v-model="formData.status"
                :rules="[rules.required]"
                label="Status"
                v-on:change="setDateDetails()"
                readonly
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
                  <v-btn flat color="primary" @click="date.model = false">Cancel</v-btn>
                  <v-btn flat color="primary" @click="$refs.date.save(formData.date)">OK</v-btn>
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
        <v-btn color="blue darken-1" type="submit" flat :disabled="!valid">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-form>
</template>

<script>
import Open from "../Open";
import Mixins from "@/helpers/Mixins.js";
import { STATUS_DELIVERED, STATUS_ON_PROCESS, STATUS_APPROVED } from "@/helpers/Constant.js";
import { mapGetters, mapActions, mapMutations } from "vuex";

export default {
  mixins: [Mixins],
  components: {
    Open,
  },

  data: () => ({
    date: {
      display: false,
      label: "",
      model: false
    },
    defaultFormData: {
      status: "",
      date: new Date().toISOString().substr(0, 10)
    },
    formData: {
      status: "",
      date: new Date().toISOString().substr(0, 10)
    },
    valid: true,
  }),

  computed: {
    ...mapGetters("salesOrders", ["getSalesOrderByStatusAndId"]),
    formTitle() {
      return "Sales Order - Update Status";
    },
    formIcon() {
      return "edit";
    },
  },

  methods: {
    ...mapMutations("loading", { setLoading: "SET_LOADING" }),
    ...mapActions("alerts", ["setAlert"]),
    ...mapActions("salesOrders", {
      updateSalesOrderStatusData: "updateStatusData"
    }),

    setDateDetails() {
      const status = this.formData.status;
      switch (status) {
        case STATUS_DELIVERED:
          this.date.display = true;
          this.date.label = "Date Delivered";
          break;
        case STATUS_ON_PROCESS:
          this.date.display = true;
          this.date.label = "Date Delivery";
          break;
        case STATUS_APPROVED:
          this.date.display = true;
          this.date.label = "Date Approved";
          break;
        default:
          this.date.display = false;
          this.date.label = "";
      }
    },

    editStatus(id, defaultStatus) {
      let data = this.getSalesOrderByStatusAndId(id);
      this.formData.id = data.id;
      this.formData.status = defaultStatus;
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
              message: response.data.message,
            };

            if (!response.data.result) obj.type = "error";
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
