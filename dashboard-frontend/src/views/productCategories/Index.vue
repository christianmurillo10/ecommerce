<template>
  <v-container fluid>
    <Alerts />
    <v-card>
      <v-card-title>
        <v-icon class="black--text">view_list</v-icon><span class="title">Products Categories</span>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" scrollable persistent max-width="999px">
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
          <ModalForm ref="modalForm" @setDialog="setDialog" />
        </v-dialog>
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
        <v-data-table :headers="headers" :items="productCategoryList" :search="search" class="elevation-1">
          <template v-slot:items="props">
            <td class="text-xs-left">{{ props.item.name }}</td>
            <td class="text-xs-left">{{ props.item.description }}</td>
            <td class="text-xs-left">
              <v-switch
                v-model="props.item.is_featured"
                color="success"
                @change="updateStatus({ id: props.item.id, value: $event })"
                hide-details
              ></v-switch>
            </td>
            <td class="justify-center layout px-0">
              <v-tooltip left>
                <template v-slot:activator="{ on }">
                  <v-icon small class="mr-2" @click="editItem(props.item.id)" v-on="on">edit</v-icon>
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
          <template v-slot:no-results>
            <p class="justify-center layout px-0">Your search for "{{ search }}" found no results.</p>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
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
import ModalForm from "./components/ModalForm";
import { mapState, mapActions } from "vuex";

export default {
  components: {
    Alerts,
    ModalForm
  },

  data: () => ({
    dialog: false,
    modalDelete: {
      dialog: false,
      id: null
    },
    search: '',
    headers: [
      { text: "Name", value: "name" },
      { text: "Description", value: "description" },
      { text: "Featured", value: "" },
      { text: "Actions", align: "center", value: "", sortable: false }
    ]
  }),

  mounted() {
    this.getProductCategoryData();
  },

  computed: {
    ...mapState("productCategories", ["productCategoryList"])
  },

  watch: {
    dialog(val) {
      val || this.close();
    }
  },

  methods: {
    ...mapActions("alerts", ["setAlert"]),
    ...mapActions("productCategories", {
      getProductCategoryData: "getData",
      updateProductCategoryFeaturedData: "updateFeaturedData",
      deleteProductCategoryData: "deleteData"
    }),

    updateStatus(obj) {
      this.updateProductCategoryFeaturedData(obj)
        .then(response => {
          let obj = {
            alert: true,
            type: "success",
            message: response.data.message
          };

          if (!response.data.result) obj.type = "error";
          this.setAlert(obj);
        })
        .catch(err => console.log(err));
    },

    editItem(id) {
      this.setDialog(true);
      this.$refs.modalForm.editItem(id);
    },

    deleteModal(id) {
      this.modalDelete.id = id;
      this.modalDelete.dialog = true;
    },

    deleteItem(id) {
      this.deleteProductCategoryData(this.modalDelete.id)
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
      this.$refs.modalForm.close();
    },

    setDialog(value) {
      this.dialog = value;
    }
  }
};
</script>