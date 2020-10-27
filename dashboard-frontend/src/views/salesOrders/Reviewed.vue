<template>
  <v-container fluid>
    <Alerts />
    <Loading />
    <v-divider></v-divider>
    <v-card>
      <v-card-title>
        <v-icon class="black--text">view_list</v-icon>
        <span class="title">Sales Orders - Reviewed</span>
        <v-spacer></v-spacer>
        <v-flex xs12 sm12 md4 offset-md8>
          <v-text-field
            v-model="search"
            append-icon="search"
            label="Search"
            single-line
            hide-details
          ></v-text-field>
        </v-flex>
      </v-card-title>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="salesOrderByStatusList"
          :search="search"
          class="elevation-1"
        >
          <template v-slot:items="props">
            <td class="text-xs-left">{{ props.item.order_no }}</td>
            <td class="text-xs-left">
              {{
                setFullnameLastnameFirst(
                  props.item.customers.firstname,
                  props.item.customers.middlename,
                  props.item.customers.lastname
                )
              }}
            </td>
            <td class="text-xs-left">{{ props.item.total_amount }}</td>
            <td class="text-xs-left">{{ props.item.date_ordered }}</td>
            <td class="text-xs-center">
              <v-tooltip left>
                <template v-slot:activator="{ on }">
                  <v-icon
                    small
                    class="mr-2"
                    color="purple darken-2"
                    @click="viewInvoice(props.item.id)"
                    v-on="on"
                  >
                    list_alt
                  </v-icon>
                </template>
                <span>Invoice</span>
              </v-tooltip>
              <v-tooltip left>
                <template v-slot:activator="{ on }">
                  <v-icon
                    small
                    class="mr-2"
                    color="blue-grey darken-2"
                    @click="editStatus(props.item.id)"
                    v-on="on"
                  >
                    assignment
                  </v-icon>
                </template>
                <span>Update Status</span>
              </v-tooltip>
            </td>
          </template>
          <template v-slot:no-data>
            <p class="justify-center layout px-0">No data found!</p>
          </template>
          <template v-slot:no-results>
            <p class="justify-center layout px-0">
              Your search for "{{ search }}" found no results.
            </p>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
    <v-dialog v-model="dialogStatus" max-width="500px">
      <ModalFormStatus
        ref="modalFormStatus"
        @setDialogStatus="setDialogStatus"
      />
    </v-dialog>
  </v-container>
</template>

<script>
import Alerts from "@/components/utilities/Alerts";
import Loading from "@/components/utilities/Loading";
import ModalFormStatus from "@/components/modules/SalesOrders/ModalFormStatus";
import Mixins from "@/helpers/Mixins.js";
import {
  SALES_ORDER_STATUS_REVIEWED,
  SALES_ORDER_STATUS_APPROVED,
} from "@/helpers/Constant.js";
import { mapState, mapActions } from "vuex";

export default {
  mixins: [Mixins],
  components: {
    Alerts,
    Loading,
    ModalFormStatus,
  },

  data: () => ({
    dialogStatus: false,
    search: "",
    headers: [
      { text: "Order No.", value: "order_no" },
      { text: "Customer", value: "" },
      { text: "Total Amount", value: "" },
      { text: "Date Ordered", value: "" },
      { text: "Actions", align: "center", value: "", sortable: false },
    ],
  }),

  mounted() {
    this.getSalesOrderDataByStatus(SALES_ORDER_STATUS_REVIEWED);
  },

  computed: {
    ...mapState("salesOrders", ["salesOrderByStatusList"]),
  },

  watch: {
    dialogStatus(val) {
      val || this.closeStatus();
    },
  },

  methods: {
    ...mapActions("alerts", ["setAlert"]),
    ...mapActions("salesOrders", {
      getSalesOrderDataByStatus: "getDataByStatus",
    }),

    viewInvoice(id) {
      this.$router.push(`/salesOrders/invoice/${id}`);
    },

    editStatus(id) {
      this.setDialogStatus(true);
      this.$refs.modalFormStatus.editStatus(id, SALES_ORDER_STATUS_APPROVED);
    },

    closeStatus() {
      this.setDialogStatus(false);
      this.$refs.modalFormStatus.close();
    },

    setDialogStatus(value) {
      this.dialogStatus = value;
    },
  },
};
</script>
