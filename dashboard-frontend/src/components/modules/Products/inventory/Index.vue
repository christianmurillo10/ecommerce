<template>
  <v-layout wrap row>
    <v-flex xs12 sm12 md3 class="pb-2">
      <v-btn block outline color="blue" @click="generateModal()">Generate</v-btn>
    </v-flex>
    <v-flex xs12 sm12 md4 offset-md5 class="pb-4">
      <v-text-field
        v-model="search"
        append-icon="search"
        label="Search"
        single-line
        hide-details
      ></v-text-field>
    </v-flex>
    <v-flex xs12 sm12 md12>
      <v-data-table :headers="headers" :items="inventoryList" :search="search" class="elevation-1">
        <template v-slot:items="props">
          <td class="text-xs-left">{{ props.item.sku }}</td>
          <td class="text-xs-left">{{ props.item.name }}</td>
          <td class="text-xs-left">&#8369; {{ props.item.price_amount }}</td>
          <td class="text-xs-left">{{ props.item.quantity_available }}</td>
          <td class="justify-center layout px-0">
            <v-tooltip left>
              <template v-slot:activator="{ on }">
                <v-icon small class="mr-2" @click="editItem(props.item.id)" v-on="on">edit</v-icon>
              </template>
              <span>Update</span>
            </v-tooltip>
            <v-tooltip left>
              <template v-slot:activator="{ on }">
                <v-icon small class="mr-2" color="green darken-2" @click="addStock(props.item.id)" v-on="on">add_box</v-icon>
              </template>
              <span>Add Stock</span>
            </v-tooltip>
          </td>
        </template>
        <template v-slot:no-results>
          <p class="justify-center layout px-0">Your search for "{{ search }}" found no results.</p>
        </template>
      </v-data-table>
    </v-flex>
    <v-dialog v-model="dialog" max-width="500px">
      <ModalFormInventory ref="modalFormInventory" @setDialog="setDialog" />
    </v-dialog>
    <v-dialog v-model="dialogAddStock" max-width="500px">
      <ModalFormInventoryAddStock ref="modalFormInventoryAddStock" @setDialog="setDialogAddStock" />
    </v-dialog>
    <v-dialog v-model="dialogGenerate" persistent max-width="370">
      <v-card>
        <v-card-title class="title">Confirmation</v-card-title>
        <v-card-text>
          <span>Are you sure you want to generate new data?</span>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            small
            outline
            color="error"
            @click="dialogGenerate = false"
          >
            Cancel
          </v-btn>
          <v-btn small outline color="success" @click="generateVariants()">
            Confirm
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import Alerts from "@/components/utilities/Alerts";
import ModalFormInventory from "../modal/ModalFormInventory";
import ModalFormInventoryAddStock from "../modal/ModalFormInventoryAddStock";
import { mapState, mapActions } from "vuex";

export default {
  components: {
    Alerts,
    ModalFormInventory,
    ModalFormInventoryAddStock
  },

  data: () => ({
    dialogGenerate: false,
    dialog: false,
    dialogAddStock: false,
    search: '',
    headers: [
      { text: "SKU", value: "sku" },
      { text: "Name", value: "name" },
      { text: "Price Amount", value: "" },
      { text: "Quantity", value: "" },
      { text: "Actions", align: "center", value: "name", sortable: false }
    ]
  }),

  created() {
    this.getInventoryDataByProductId(this.$route.params.id);
  },

  computed: {
    ...mapState("inventories", ["inventoryList"])
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogAddStock(val) {
      val || this.closeAddStock();
    }
  },

  methods: {
    ...mapActions("alerts", ["setAlert"]),
    ...mapActions("inventories", {
      generateBulkInventoryDataWithProductVariantsByProductId: "generateBulkDataWithProductVariantsByProductId",
      getInventoryDataByProductId: "getDataByProductId",
    }),

    generateModal() {
      this.dialogGenerate = true;
    },

    generateVariants() {
      let productId = this.$route.params.id;
      this.generateBulkInventoryDataWithProductVariantsByProductId({ product_id: productId })
        .then(response => {
          let obj = {
            alert: true,
            type: "success",
            message: response.data.message
          };

          if (response.data.result) {
            this.getInventoryDataByProductId(productId);
          } else {
            obj.type = "error";
          }
          this.setAlert(obj);
          this.dialogGenerate = false;
        })
        .catch(err => console.log(err));
    },

    addStock(id) {
      this.setDialogAddStock(true);
      this.$refs.modalFormInventoryAddStock.editItem(id);
    },

    editItem(id) {
      this.setDialog(true);
      this.$refs.modalFormInventory.editItem(id);
    },

    close() {
      this.setDialog(false);
      this.$refs.modalFormInventory.close();
    },

    closeAddStock() {
      this.setDialogAddStock(false);
      this.$refs.modalFormInventoryAddStock.close();
    },

    setDialog(value) {
      this.dialog = value;
    },

    setDialogAddStock(value) {
      this.dialogAddStock = value;
    }
  }
};
</script>