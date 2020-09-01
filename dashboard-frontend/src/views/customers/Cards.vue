<template>
  <v-container fluid>
    <Alerts />
    <v-divider></v-divider>
    <v-card>
      <v-card-title>
        <v-icon class="black--text">view_list</v-icon><span class="title">Customer Credit/Debit Cards</span>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" scrollable max-width="500px">
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
          <ModalFormCards ref="modalFormCards" @setDialog="setDialog" />
        </v-dialog>
        <v-tooltip left>
          <template v-slot:activator="{ on }">
            <v-btn icon to="/customers" v-on="on">
              <v-icon>arrow_back</v-icon>
            </v-btn>
          </template>
          <span>Back</span>
        </v-tooltip>
      </v-card-title>
      <v-card-text>
        <v-flex xs12 sm12 md12 lg12>
          <v-list dense>
            <v-layout wrap row>
              <v-flex xs12 sm12 md12 lg12>
                <v-list-tile>
                  <v-list-tile-action>
                    <v-list-tile-title class="body-2 font-weight-bold">Customer No.:&nbsp;</v-list-tile-title>
                  </v-list-tile-action>
                  <v-list-tile-content>
                    <v-list-tile-title class="body-2">{{ customerDataById.customer_no }}</v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>
                <v-list-tile>
                  <v-list-tile-action>
                    <v-list-tile-title class="body-2 font-weight-bold">Name:&nbsp;</v-list-tile-title>
                  </v-list-tile-action>
                  <v-list-tile-content>
                    <v-list-tile-title class="body-2">{{ setFullnameLastnameFirst(customerDataById.firstname, customerDataById.middlename, customerDataById.lastname) }}</v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>
                <v-list-tile>
                  <v-list-tile-action>
                    <v-list-tile-title class="body-2 font-weight-bold">Status:&nbsp;</v-list-tile-title>
                  </v-list-tile-action>
                  <v-list-tile-content>
                    <v-list-tile-title class="body-2">{{ getCustomerStatus(customerDataById.status) }}</v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>
              </v-flex>
            </v-layout>
          </v-list>
        </v-flex>
        <v-flex xs12 sm12 md4 offset-md8>
          <div class="pb-4">
            <v-text-field
              v-model="search"
              append-icon="search"
              label="Search"
              single-line
              hide-details
            ></v-text-field>
          </div>
        </v-flex>
        <v-flex xs12 sm12 md12 lg12>
          <v-data-table :headers="headers" :items="customerCreditDebitCardList" :search="search" class="elevation-1">
            <template v-slot:items="props">
              <td class="text-xs-left">{{ props.item.card_no }}</td>
              <td class="text-xs-left">{{ props.item.firstname }}</td>
              <td class="text-xs-left">{{ props.item.lastname }}</td>
              <td class="text-xs-left">{{ props.item.banks.name }}</td>
              <td class="justify-center">
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
        </v-flex>
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
import Mixins from "@/helpers/Mixins.js";
import ModalFormCards from "@/components/modules/Customers/ModalFormCards";
import { mapState, mapActions } from "vuex";

export default {
  mixins: [Mixins],
  components: {
    Alerts,
    ModalFormCards
  },

  data: () => ({
    dialog: false,
    modalDelete: {
      dialog: false,
      id: null
    },
    search: '',
    headers: [
      { text: "Card No.", value: "card_no" },
      { text: "Firstname", value: "firstname" },
      { text: "Lastname", value: "lastname" },
      { text: "Bank", value: "banks.name" },
      { text: "Actions", align: "left", value: "", sortable: false }
    ]
  }),

  mounted() {
    this.getCustomerDataById(this.$route.params.customerId)
    this.getCustomerCreditDebitCardDataByCustomerId(this.$route.params.customerId);
  },

  computed: {
    ...mapState("customers", ["customerDataById"]),
    ...mapState("customerCreditDebitCards", ["customerCreditDebitCardList"])
  },

  watch: {
    dialog(val) {
      val || this.close();
    }
  },

  methods: {
    ...mapActions("alerts", ["setAlert"]),
    ...mapActions("customers", {
      getCustomerDataById: "getDataById"
    }),
    ...mapActions("customerCreditDebitCards", {
      getCustomerCreditDebitCardDataByCustomerId: "getDataByCustomerId",
      deleteCustomerCreditDebitCardData: "deleteData"
    }),

    editItem(id) {
      this.setDialog(true);
      this.$refs.modalFormCards.editItem(id);
    },

    deleteModal(id) {
      this.modalDelete.id = id;
      this.modalDelete.dialog = true;
    },

    deleteItem() {
      this.deleteCustomerCreditDebitCardData(this.modalDelete.id)
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
      this.$refs.modalFormCards.close();
    },

    setDialog(value) {
      this.dialog = value;
    }
  }
};
</script>