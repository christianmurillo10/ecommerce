<template>
  <v-container fluid>
    <Alerts />
    <v-card>
      <v-card-title>
        <v-icon class="black--text">list_alt</v-icon
        ><span class="title">Product - Variant Options</span>
        <v-spacer></v-spacer>
        <v-tooltip left>
          <template v-slot:activator="{ on }">
            <v-btn icon v-on="on" @click="displayModalWarning(null)">
              <v-icon color="green">add_box</v-icon>
            </v-btn>
          </template>
          <span>Create</span>
        </v-tooltip>
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
        <v-flex xs12 sm12 md6 lg6>
          <v-container>
            <span class="title">Options</span>
          </v-container>
          <v-container>
            <v-data-table 
              :headers="headers" 
              :items="productOptionList" 
              class="elevation-1"
              hide-actions
            >
              <template v-slot:items="props">
                <td class="text-xs-left">{{ props.item.title }}</td>
                <td class="text-xs-left">{{ props.item.values }}</td>
                <td class="justify-center layout px-0">
                  <v-tooltip left>
                    <template v-slot:activator="{ on }">
                      <v-icon small class="mr-2" @click="displayModalWarning(props.item.id)" v-on="on">edit</v-icon>
                    </template>
                    <span>Update</span>
                  </v-tooltip>
                  <v-tooltip left>
                    <template v-slot:activator="{ on }">
                      <v-icon small color="red" class="mr-2" @click="deleteModal(props.item.id)" v-on="on">delete</v-icon>
                    </template>
                    <span>Delete</span>
                  </v-tooltip>
                </td>
              </template>
              <template v-slot:no-data>
                <p class="justify-center layout px-0">No data found!</p>
              </template>
            </v-data-table>
          </v-container>
        </v-flex>
        <v-flex xs12 sm12 md12 lg12 v-if="productOptionList.length !== 0">
          <v-container>
            <span class="title">Variants</span>
          </v-container>
          <v-container>
            <OptionInventory />
          </v-container>
        </v-flex>
      </v-card-text>
    </v-card>
    <v-dialog v-model="dialog" max-width="500px">
      <ModalFormOption ref="modalFormOption" @setDialog="setDialog" />
    </v-dialog>
    <v-dialog v-model="modalWarning.dialog" persistent max-width="350">
      <v-card>
        <v-card-title class="title">Confirmation</v-card-title>
        <v-card-text>
          <span v-if="modalWarning.id === null">Are you sure you want to add new item?</span>
          <span v-else>Are you sure you want to update this item?</span>
          <br/><br/>
          <span class="red--text font-weight-light font-italic">NOTE: Once you save your variant list will be reset.</span>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn small outline color="error" @click="modalWarning.dialog = false">Cancel</v-btn>
          <v-btn small outline color="success" @click="displayModal()">Confirm</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="modalDelete.dialog" persistent max-width="300">
      <v-card>
        <v-card-title class="title">Confirmation</v-card-title>
        <v-card-text>Are you sure you want to delete this item?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn small outline color="error" @click="modalDelete.dialog = false">Cancel</v-btn>
          <v-btn small outline color="success" @click="deleteItem()">Confirm</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import Alerts from "@/components/utilities/Alerts";
import ModalFormOption from "./ModalFormOption";
import OptionInventory from "./OptionInventory";
import { mapState, mapActions } from "vuex";

export default {
  components: {
    Alerts,
    ModalFormOption,
    OptionInventory
  },

  data: () => ({
    dialog: false,
    modalWarning: {
      dialog: false,
      id: null
    },
    modalDelete: {
      dialog: false,
      id: null
    },
    headers: [
      { text: "Title", value: "title" },
      { text: "Values", value: "values" },
      { text: "Actions", align: "center", value: "title", sortable: false }
    ]
  }),

  mounted() {
    this.getProductOptionDataByProductId(this.$route.params.id);
    this.getInventoryDataByProductId(this.$route.params.id);
  },

  computed: {
    ...mapState("productOptions", ["productOptionList"]),
    ...mapState("inventories", ["inventoryList"])
  },

  watch: {
    dialog(val) {
      val || this.close();
    }
  },

  methods: {
    ...mapActions("alerts", ["setAlert"]),
    ...mapActions("productOptions", {
      getProductOptionDataByProductId: "getDataByProductId",
      deleteProductOptionData: "deleteData"
    }),
    ...mapActions("inventories", {
      getInventoryDataByProductId: "getDataByProductId",
    }),

    displayModalWarning(id) {
      if (id !== null) this.modalWarning.id = id;
      console.log("ASD", this.inventoryList.length)
      if (this.inventoryList.length === 0) {
        this.displayModal();
      } else {
        this.modalWarning.dialog = true;
      }
    },

    displayModal() {
      this.modalWarning.dialog = false;
      this.setDialog(true);
      if (this.modalWarning.id !== null) this.$refs.modalFormOption.editItem(this.modalWarning.id);
    },

    editItem(id) {
      this.setDialog(true);
      this.$refs.modalFormOption.editItem(id);
    },

    deleteModal(id) {
      this.modalDelete.id = id;
      this.modalDelete.dialog = true;
    },

    deleteItem() {
      this.deleteProductOptionData(this.modalDelete.id)
        .then(response => {
          let obj = {
            alert: true,
            type: "success",
            message: response.data.message
          };

          if (!response.data.result) obj.type = "error";
          this.setAlert(obj);
          this.modalDelete.id = null;
          this.modalDelete.dialog = false;
        })
        .catch(err => console.log(err));
    },

    close() {
      this.setDialog(false);
      this.$refs.modalFormOption.close();
      this.modalWarning.id = null;
    },

    setDialog(value) {
      this.dialog = value;
    }
  }
};
</script>
