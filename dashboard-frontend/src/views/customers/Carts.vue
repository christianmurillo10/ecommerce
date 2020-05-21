<template>
  <v-container fluid>
    <Alerts />
    <v-divider></v-divider>
    <v-card>
      <v-card-title>
        <v-icon class="black--text">view_list</v-icon><span class="title">Customer Carts</span>
        <v-spacer></v-spacer>
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
          <v-data-table :headers="headers" :items="customerCartList" :search="search" class="elevation-1">
            <template v-slot:items="props">
              <td class="text-xs-left">{{ props.item.products.name }}</td>
              <td class="text-xs-left">{{ props.item.sku }}</td>
              <td class="text-xs-left">{{ props.item.quantity }}</td>
              <td class="text-xs-left">{{ props.item.price_amount }}</td>
              <td class="text-xs-left">{{ props.item.discount_amount }}</td>
              <td class="text-xs-left">{{ props.item.total_price_amount }}</td>
              <td class="justify-center">
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
import { mapState, mapActions } from "vuex";

export default {
  mixins: [Mixins],
  components: {
    Alerts
  },

  data: () => ({
    dialog: false,
    modalDelete: {
      dialog: false,
      id: null
    },
    search: '',
    headers: [
      { text: "Product", value: "products.name" },
      { text: "SKU", value: "sku" },
      { text: "Quantity", value: "" },
      { text: "Price Amount", value: "" },
      { text: "Discount Amount", value: "" },
      { text: "Total Price Amount", value: "" },
      { text: "Actions", align: "left", value: "", sortable: false }
    ]
  }),

  mounted() {
    this.getCustomerDataById(this.$route.params.customerId)
    this.getCustomerCartDataByCustomerId(this.$route.params.customerId);
  },

  computed: {
    ...mapState("customers", ["customerDataById"]),
    ...mapState("customerCarts", ["customerCartList"])
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
    ...mapActions("customerCarts", {
      getCustomerCartDataByCustomerId: "getDataByCustomerId",
      deleteCustomerCartData: "deleteData"
    }),

    deleteModal(id) {
      this.modalDelete.id = id;
      this.modalDelete.dialog = true;
    },

    deleteItem() {
      this.deleteCustomerCartData(this.modalDelete.id)
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
    }
  }
};
</script>