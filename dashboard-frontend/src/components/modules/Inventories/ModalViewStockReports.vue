<template>
  <v-card>
    <v-card-title>
      <v-icon class="black--text">{{ formIcon }}</v-icon>
      <span class="title">{{ formTitle }}</span>
    </v-card-title>
    <v-card-text style="height: auto;">
      <v-flex xs12 sm12 md12 lg12>
        <div>
          <span class="subheading font-weight-bold">Name: </span>
          <span class="subheading">{{ productDetails.name }}</span>
        </div>
      </v-flex>
      <v-flex xs12 sm12 md4 offset-md8 class="pb4">
        <v-text-field
          v-model="search"
          append-icon="search"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
      </v-flex>
      <v-data-table
        :headers="headers"
        :items="inventoryList"
        :search="search"
        class="elevation-1"
      >
        <template v-slot:items="props">
          <td class="text-xs-left">{{ props.item.sku }}</td>
          <td class="text-xs-left">{{ props.item.name }}</td>
          <td class="text-xs-left">{{ props.item.quantity_in }}</td>
          <td class="text-xs-left">{{ props.item.quantity_out }}</td>
          <td class="text-xs-left">{{ props.item.quantity_reserved }}</td>
          <td class="text-xs-left">{{ props.item.quantity_returned }}</td>
          <td class="text-xs-left">{{ props.item.quantity_available }}</td>
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
    <v-divider></v-divider>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="blue darken-1" flat @click="close">Close</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import Mixins from "@/helpers/Mixins.js";
import { mapState, mapActions } from "vuex";

export default {
  mixins: [Mixins],

  data: () => ({
    defaultProductDetails: {
      name: "",
    },
    productDetails: {
      name: "",
    },
    search: "",
    headers: [
      { text: "SKU", value: "sku" },
      { text: "Item", value: "name" },
      { text: "In", value: "", sortable: false },
      { text: "Out", value: "", sortable: false },
      { text: "Reserved", value: "", sortable: false },
      { text: "Returned", value: "", sortable: false },
      { text: "Available", value: "", sortable: false },
    ],
  }),

  computed: {
    ...mapState("inventories", ["inventoryList"]),
    formTitle() {
      return "Reports - Stock (View)";
    },
    formIcon() {
      return "pageview";
    },
  },

  methods: {
    ...mapActions("alerts", ["setAlert"]),
    ...mapActions("products", { getProductDataById: "getDataById" }),
    ...mapActions("inventories", {
      getInventoryDataByProductId: "getDataByProductId",
    }),

    async viewItemByProductId(id) {
      await this.getInventoryDataByProductId(id);
      const response = await this.getProductDataById(id);
      this.productDetails.name = response.name;
    },

    close() {
      this.$emit("setDialog", false);
      setTimeout(() => {
        this.productDetails = Object.assign({}, this.defaultProductDetails);
      }, 300);
    },
  },
};
</script>

<style lang="css" scoped>
@import "../../../assets/css/table.css";
</style>
