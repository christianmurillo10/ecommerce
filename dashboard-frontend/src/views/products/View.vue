<template>
  <v-container fluid>
    <Alerts />
    <v-divider></v-divider>
    <v-toolbar color="#EEEEEE" dense>
      <v-toolbar-title>
        <v-icon class="black--text">view_list</v-icon>Products - View
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <router-link to="/products" tag="button">
        <v-icon>arrow_back</v-icon>
      </router-link>
    </v-toolbar>
    <v-card class="mx-auto my-12" :elevation="3" max-width="auto">
      <v-container>
        <v-flex xs12 sm12 md12 lg12>
          <v-list dense>
            <v-layout wrap>
              <v-flex xs12 sm12 md3 lg3>
                <v-list-tile>
                  <v-list-tile-title>
                    <h3>Product Details:</h3>
                  </v-list-tile-title>
                </v-list-tile>
                <v-list-tile>
                  <v-list-tile-content>Name:</v-list-tile-content>
                  <v-list-tile-content class="align-end">{{
                    productDetails.name
                  }}</v-list-tile-content>
                </v-list-tile>
                <v-list-tile>
                  <v-list-tile-content>Description:</v-list-tile-content>
                  <v-list-tile-content class="align-end">{{
                    productDetails.description
                  }}</v-list-tile-content>
                </v-list-tile>
                <!-- <v-list-tile>
                  <v-list-tile-content>Stock:</v-list-tile-content>
                  <v-list-tile-content class="align-end">{{
                    inventoryDetails.stock_available
                  }}</v-list-tile-content>
                </v-list-tile> -->
                <v-list-tile>
                  <v-list-tile-content>Price:</v-list-tile-content>
                  <v-list-tile-content class="align-end">{{
                    productDetails.price_amount
                  }}</v-list-tile-content>
                </v-list-tile>
              </v-flex>
            </v-layout>
          </v-list>
        </v-flex>
      </v-container>
    </v-card>
  </v-container>
</template>

<script>
import Alerts from "@/components/utilities/Alerts";
import { mapState, mapActions } from "vuex";

export default {
  components: {
    Alerts
  },

  data: () => ({
    productDetails: "",
    inventoryDetails: ""
  }),

  mounted() {
    this.getProductDataById(this.$route.params.id).then(response => {
      this.productDetails = response.data.result;
    });
    // this.getInventoryAvailableStockDataByProductId(this.$route.params.id).then(
    //   response => {
    //     this.inventoryDetails = response.data.result;
    //   }
    // );
  },

  computed: {},

  methods: {
    ...mapActions("products", { getProductDataById: "getDataById" }),
    ...mapActions("inventories", {
      getInventoryAvailableStockDataByProductId:
        "getAvailableStockDataByProductId"
    })
  }
};
</script>
