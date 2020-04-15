<template>
  <v-container fluid>
    <Alerts />
    <v-divider></v-divider>
    <v-card>
      <v-card-title>
        <v-icon class="black--text">view_list</v-icon><span class="title">Product Flash Deals</span>
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
        <v-data-table :headers="headers" :items="productFlashDealList" :search="search" class="elevation-1">
          <template v-slot:items="props">
            <td class="text-xs-left">{{ props.item.title }}</td>
            <td class="text-xs-left">{{ props.item.date_from }}</td>
            <td class="text-xs-left">{{ props.item.date_to }}</td>
            <td class="text-xs-left">
              <v-switch
                v-model="props.item.is_active"
                color="success"
                @change="updateStatus({ id: props.item.id, value: $event })"
                hide-details
              ></v-switch>
            </td>
            <!-- <td class="text-xs-left">{{ props.item.is_active }}</td> -->
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
      { text: "Name", value: "title" },
      { text: "From Date", value: "date_from" },
      { text: "To Date", value: "date_to" },
      { text: "Active", value: "" },
      { text: "Actions", align: "center", value: "title", sortable: false }
    ]
  }),

  mounted() {
    this.getProductFlashDealHeaderData();
  },

  computed: {
    ...mapState("productFlashDealHeaders", ["productFlashDealList"])
  },

  watch: {
    dialog(val) {
      val || this.close();
    }
  },

  methods: {
    ...mapActions("alerts", ["setAlert"]),
    ...mapActions("productFlashDealHeaders", {
      getProductFlashDealHeaderData: "getData",
      updateProductFlashDealHeaderStatusData: "updateStatusData",
      deleteProductFlashDealHeaderData: "deleteData"
    }),

    updateStatus(obj) {
      this.updateProductFlashDealHeaderStatusData(obj)
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

    deleteItem() {
      this.deleteProductFlashDealHeaderData(this.modalDelete.id)
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