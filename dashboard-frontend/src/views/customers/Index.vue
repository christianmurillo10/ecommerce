<template>
  <v-container fluid>
    <Alerts />
    <Loading />
    <v-divider></v-divider>
    <v-card>
      <v-card-title>
        <v-icon class="black--text">view_list</v-icon><span class="title">Customers</span>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="850px">
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
        <v-data-table :headers="headers" :items="customerList" :search="search" class="elevation-1">
          <template v-slot:items="props">
            <td class="text-xs-left pt-1">
              <img
                :src="props.item.file_path"
                height="90"
                width="90"
              />
            </td>
            <td class="text-xs-left">{{ props.item.customer_no }}</td>
            <td class="text-xs-left">{{ setFullnameLastnameFirst(props.item.firstname, props.item.middlename, props.item.lastname) }}</td>
            <td class="text-xs-left">{{ props.item.email }}</td>
            <td class="text-xs-left">{{ props.item.contact_no }}</td>
            <td class="text-xs-left">
              <v-chip :color='getCustomerStatusColor(props.item.status)' text-color='white' disabled>{{ getCustomerStatus(props.item.status) }}</v-chip>
            </td>
            <td class="text-xs-center px-0">
              <v-tooltip left>
                <template v-slot:activator="{ on }">
                  <v-icon small class="mr-2" color="purple darken-2" @click="editCards(props.item.id)" v-on="on">credit_card</v-icon>
                </template>
                <span>Cards</span>
              </v-tooltip>
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
import Loading from "@/components/utilities/Loading";
import ModalForm from "./components/ModalForm";
import Mixins from "@/helpers/Mixins.js";
import { mapState, mapActions } from "vuex";

export default {
  mixins: [Mixins],
  components: {
    Alerts,
    Loading,
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
      { text: "Image", value: "" },
      { text: "Customer No.", value: "customer_no" },
      { text: "Name", value: "lastname" },
      { text: "Email", value: "email" },
      { text: "Contact No.", value: "" },
      { text: "Status", value: "" },
      { text: "Actions", align: "center", value: "", sortable: false }
    ]
  }),

  mounted() {
    this.getCustomerData();
  },

  computed: {
    ...mapState("customers", ["customerList"])
  },

  watch: {
    dialog(val) {
      val || this.close();
    }
  },

  methods: {
    ...mapActions("alerts", ["setAlert"]),
    ...mapActions("customers", {
      getCustomerData: "getData",
      deleteCustomerData: "deleteData"
    }),

    editCards(id) {
      this.$router.push(`/customers/cards/${id}`);
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
      this.deleteCustomerData(this.modalDelete.id)
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