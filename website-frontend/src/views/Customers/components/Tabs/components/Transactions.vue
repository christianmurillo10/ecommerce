<template>
  <v-card flat>
    <v-card-title>
      <v-spacer></v-spacer>
      <v-flex xs12 sm12 md4 offset-md8>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
      </v-flex>
    </v-card-title>
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="salesOrderDataByCustomerIdList"
        :search="search"
        class="elevation-1"
      >
        <template v-slot:item.status="{ item }">
          {{ getSalesOrderStatus(item.status) }}
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
</template>

<script>
import Mixins from "@/helpers/Mixins.js";
import { mapState, mapActions } from "vuex";

export default {
  mixins: [Mixins],
  data: () => ({
    search: "",
    headers: [
      { text: "Order No.", value: "order_no" },
      { text: "Total Amount", value: "total_amount", filterable: false },
      { text: "Date Ordered", value: "date_ordered", filterable: false },
      { text: "Status", value: "status", filterable: false },
    ],
  }),

  mounted() {
    this.getSalesOrderDataByCustomerId(this.customerInfo.id);
  },

  computed: {
    ...mapState("customerAuthentication", ["customerInfo"]),
    ...mapState("salesOrders", ["salesOrderDataByCustomerIdList"]),
  },

  methods: {
    ...mapActions("salesOrders", {
      getSalesOrderDataByCustomerId: "getDataByCustomerId",
    }),
  },
};
</script>
