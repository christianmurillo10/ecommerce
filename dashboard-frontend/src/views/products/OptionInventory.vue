<template>
  <v-data-table :headers="headers" :items="inventoryList" class="elevation-1">
    <template v-slot:items="props">
      <td class="text-xs-left">{{ props.item.name }}</td>
      <td class="text-xs-left">{{ props.item.price_amount }}</td>
      <td class="text-xs-left">{{ props.item.sku }}</td>
      <td class="text-xs-left">{{ props.item.stock_available }}</td>
      <td class="justify-center layout px-0">
        <v-tooltip left>
          <template v-slot:activator="{ on }">
            <v-icon small class="mr-2" @click="editItem(props.item.id)" v-on="on">edit</v-icon>
          </template>
          <span>Update</span>
        </v-tooltip>
      </td>
    </template>
    <template v-slot:no-data>
      <p class="justify-center layout px-0"><v-btn block round color="primary" @click="generateVariants()">Generate</v-btn></p>
    </template>
  </v-data-table>
</template>

<script>
import Alerts from "../../components/utilities/Alerts";
// import ModalForm from "./ModalForm";
import { mapState, mapActions } from "vuex";

export default {
  components: {
    Alerts
  },

  data: () => ({
    // dialog: false,
    headers: [
      { text: "Name", value: "name" },
      { text: "Price", value: "price_amount" },
      { text: "SKU", value: "sku" },
      { text: "Stock", value: "stock_available" },
      { text: "Actions", align: "center", value: "name", sortable: false }
    ]
  }),

  mounted() {
    // this.getInventoryDataByProductId();
  },

  computed: {
    ...mapState("inventories", ["inventoryList"])
  },

  // watch: {
  //   dialog(val) {
  //     val || this.close();
  //   }
  // },

  methods: {
    ...mapActions("alerts", ["setAlert"]),
    ...mapActions("inventories", {
      saveBulkInventoryDataWithProductOptionsByProductId: "saveBulkDataWithProductOptionsByProductId",
      getInventoryDataByProductId: "getDataByProductId",
    }),

    generateVariants() {
      let productId = this.$route.params.id;
      this.saveBulkInventoryDataWithProductOptionsByProductId({ product_id: productId })
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
        })
        .catch(err => console.log(err));
    },

    // editItem(id) {
    //   this.setDialog(true);
    //   this.$refs.modalForm.editItem(id);
    // },

    // deleteModal(id) {
    //   this.modalDelete.id = id;
    //   this.modalDelete.dialog = true;
    // },

    // deleteItem(id) {
    //   this.deleteProductSubCategoryData(this.modalDelete.id)
    //     .then(response => {
    //       let obj = {
    //         alert: true,
    //         type: "success",
    //         message: response.data.message
    //       };

    //       if (!response.data.result) obj.type = "error";
    //       this.setAlert(obj);
    //       this.modalDelete.id = null;
    //       this.modalDelete.dialog = false;
    //     })
    //     .catch(err => console.log(err));
    // },

    // close() {
    //   this.setDialog(false);
    //   this.$refs.modalForm.close();
    // },

    // setDialog(value) {
    //   this.dialog = value;
    // }
  }
};
</script>