<template>
  <v-container fluid>
    <Alerts />
    <v-card>
      <v-card-title>
        <v-icon class="black--text">list_alt</v-icon>
        <span class="title">Product - Variant</span>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on: { click } }">
            <v-tooltip left>
              <template v-slot:activator="{ on }">
                <v-btn icon v-on:click="click" v-on="on">
                  <v-icon color="green">add_box</v-icon>
                </v-btn>
              </template>
              <span>Create</span>
            </v-tooltip>
          </template>
          <ModalFormVariant ref="modalFormVariant" @setDialog="setDialog" />
        </v-dialog>
        <v-tooltip left>
          <template v-slot:activator="{ on }">
            <v-btn icon to="/products" v-on="on">
              <v-icon>arrow_back</v-icon>
            </v-btn>
          </template>
          <span>Back</span>
        </v-tooltip>
      </v-card-title>
      <v-card-text>
        <v-flex xs12 sm12 md12 lg12>
          <div>
            <span class="subheading font-weight-bold">Name: </span>
            <span class="subheading">{{ productDetails.name }}</span>
          </div>
        </v-flex>
        <v-flex xs12 sm12 md6 lg6>
          <div class="pt-4">
            <v-data-table
              :headers="headers"
              :items="productVariantList"
              class="elevation-1"
              hide-actions
            >
              <template v-slot:items="props">
                <td class="text-xs-left">{{ props.item.title }}</td>
                <td class="text-xs-left">
                  {{
                    JSON.parse(props.item.values)
                      .map((element) => element.name)
                      .toString()
                  }}
                </td>
                <td class="justify-center layout px-0">
                  <v-tooltip left>
                    <template v-slot:activator="{ on }">
                      <v-icon
                        small
                        class="mr-2"
                        @click="editItem(props.item.id)"
                        v-on="on"
                      >
                        edit
                      </v-icon>
                    </template>
                    <span>Update</span>
                  </v-tooltip>
                  <v-tooltip left>
                    <template v-slot:activator="{ on }">
                      <v-icon
                        small
                        color="red"
                        class="mr-2"
                        @click="deleteModal(props.item.id)"
                        v-on="on"
                      >
                        delete
                      </v-icon>
                    </template>
                    <span>Delete</span>
                  </v-tooltip>
                </td>
              </template>
              <template v-slot:no-data>
                <p class="justify-center layout px-0">No data found!</p>
              </template>
            </v-data-table>
          </div>
        </v-flex>
        <v-flex xs12 sm12 md12 lg12>
          <div class="pt-4">
            <span class="subheading">Inventories:</span>
          </div>
          <div>
            <Inventory />
          </div>
        </v-flex>
      </v-card-text>
    </v-card>
    <v-dialog v-model="modalDelete.dialog" persistent max-width="370">
      <v-card>
        <v-card-title class="title">Confirmation</v-card-title>
        <v-card-text>
          <span>Are you sure you want to delete this item?</span>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            small
            outline
            color="error"
            @click="modalDelete.dialog = false"
          >
            Cancel
          </v-btn>
          <v-btn small outline color="success" @click="deleteItem()">
            Confirm
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import Alerts from "@/components/utilities/Alerts";
import ModalFormVariant from "@/components/modules/Products/modal/ModalFormVariant";
import Inventory from "@/components/modules/Products/inventory/Index";
import { mapState, mapActions } from "vuex";

export default {
  components: {
    Alerts,
    ModalFormVariant,
    Inventory,
  },

  data: () => ({
    dialog: false,
    modalDelete: {
      dialog: false,
      id: null,
    },
    productDetails: "",
    headers: [
      { text: "Title", value: "title" },
      { text: "Values", value: "values" },
      { text: "Actions", align: "center", value: "title", sortable: false },
    ],
  }),

  mounted() {
    this.getProductDataById(this.$route.params.id).then((response) => {
      this.productDetails = response.data.result;
    });
    this.getProductVariantDataByProductId(this.$route.params.id);
  },

  computed: {
    ...mapState("productVariants", ["productVariantList"]),
    ...mapState("inventories", ["inventoryList"]),
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
  },

  methods: {
    ...mapActions("alerts", ["setAlert"]),
    ...mapActions("products", { getProductDataById: "getDataById" }),
    ...mapActions("productVariants", {
      getProductVariantDataByProductId: "getDataByProductId",
      deleteProductVariantData: "deleteData",
    }),
    ...mapActions("inventories", {
      getInventoryDataByProductId: "getDataByProductId",
    }),

    editItem(id) {
      this.setDialog(true);
      this.$refs.modalFormVariant.editItem(id);
    },

    deleteModal(id) {
      this.modalDelete.id = id;
      this.modalDelete.dialog = true;
    },

    deleteItem() {
      this.deleteProductVariantData(this.modalDelete.id)
        .then((response) => {
          let obj = {
            alert: true,
            type: "success",
            message: response.data.message,
          };

          if (!response.data.result) obj.type = "error";
          this.setAlert(obj);
          this.modalDelete.id = null;
          this.modalDelete.dialog = false;
        })
        .catch((err) => console.log(err));
    },

    close() {
      this.setDialog(false);
      this.$refs.modalFormVariant.close();
    },

    setDialog(value) {
      this.dialog = value;
    },
  },
};
</script>
