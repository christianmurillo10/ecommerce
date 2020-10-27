<template>
  <v-container fluid>
    <Alerts />
    <v-divider></v-divider>
    <v-card>
      <v-card-title>
        <v-icon class="black--text">view_list</v-icon>
        <span class="title">Reports - Stock</span>
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
          :items="inventoryAllTotalQuantityList"
          :search="search"
          class="elevation-1"
        >
          <template v-slot:items="props">
            <td class="text-xs-left">{{ props.item.products.name }}</td>
            <td class="text-xs-left">{{ props.item.total_quantity_in }}</td>
            <td class="text-xs-left">{{ props.item.total_quantity_out }}</td>
            <td class="text-xs-left">
              {{ props.item.total_quantity_reserved }}
            </td>
            <td class="text-xs-left">
              {{ props.item.total_quantity_returned }}
            </td>
            <td class="text-xs-left">
              {{ props.item.total_quantity_available }}
            </td>
            <td class="justify-center layout px-0">
              <v-tooltip left>
                <template v-slot:activator="{ on }">
                  <v-icon
                    small
                    class="mr-2"
                    @click="viewItemByProductId(props.item.product_id)"
                    v-on="on"
                  >
                    pageview
                  </v-icon>
                </template>
                <span>View</span>
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
    <v-dialog v-model="dialogView" scrollable persistent max-width="850px">
      <ModalViewStockReports
        ref="modalViewStockReports"
        @setDialog="setDialogView"
      />
    </v-dialog>
  </v-container>
</template>

<script>
import Alerts from "@/components/utilities/Alerts";
import ModalViewStockReports from "@/components/modules/Inventories/ModalViewStockReports";
import { mapState, mapActions } from "vuex";

export default {
  components: {
    Alerts,
    ModalViewStockReports,
  },

  data: () => ({
    dialogView: false,
    search: "",
    headers: [
      { text: "Products", value: "products.name" },
      { text: "Total In", value: "", sortable: false },
      { text: "Total Out", value: "", sortable: false },
      { text: "Total Reserved", value: "", sortable: false },
      { text: "Total Returned", value: "", sortable: false },
      { text: "Total Available", value: "", sortable: false },
      { text: "Actions", align: "center", value: "name", sortable: false },
    ],
  }),

  mounted() {
    this.getInventoryAllTotalQuantityData();
  },

  computed: {
    ...mapState("inventories", ["inventoryAllTotalQuantityList"]),
  },

  watch: {
    dialogView(val) {
      val || this.closeView();
    },
  },

  methods: {
    ...mapActions("alerts", ["setAlert"]),
    ...mapActions("inventories", {
      getInventoryAllTotalQuantityData: "getAllTotalQuantityData",
    }),

    viewItemByProductId(id) {
      this.setDialogView(true);
      this.$refs.modalViewStockReports.viewItemByProductId(id);
    },

    closeView() {
      this.setDialogView(false);
      this.$refs.modalViewStockReports.close();
    },

    setDialogView(value) {
      this.dialogView = value;
    },
  },
};
</script>
