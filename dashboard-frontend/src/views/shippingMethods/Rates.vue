<template>
  <v-container fluid>
    <Alerts />
    <v-divider></v-divider>
    <v-card>
      <v-card-title>
        <v-icon class="black--text">view_list</v-icon>
        <span class="title">Shipping Method Rates</span>
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
          <ModalFormRates ref="modalFormRates" @setDialog="setDialog" />
        </v-dialog>
        <v-tooltip left>
          <template v-slot:activator="{ on }">
            <v-btn icon to="/shippingMethods" v-on="on">
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
                    <v-list-tile-title class="body-2 font-weight-bold">
                      Name:&nbsp;
                    </v-list-tile-title>
                  </v-list-tile-action>
                  <v-list-tile-content>
                    <v-list-tile-title class="body-2">
                      {{ shippingMethodDataById.name }}
                    </v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>
                <v-list-tile>
                  <v-list-tile-action>
                    <v-list-tile-title class="body-2 font-weight-bold">
                      Description:&nbsp;
                    </v-list-tile-title>
                  </v-list-tile-action>
                  <v-list-tile-content>
                    <v-list-tile-title class="body-2">
                      {{ shippingMethodDataById.description }}
                    </v-list-tile-title>
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
          <v-data-table
            :headers="headers"
            :items="shippingMethodRateList"
            :search="search"
            class="elevation-1"
          >
            <template v-slot:items="props">
              <td class="text-xs-left">&#8369; {{ props.item.rate_amount }}</td>
              <td class="text-xs-left">
                &#8369; {{ props.item.subtotal_amount_from }}
              </td>
              <td class="text-xs-left">
                &#8369; {{ props.item.subtotal_amount_to }}
              </td>
              <td class="text-xs-left">{{ props.item.quantity_from }}</td>
              <td class="text-xs-left">{{ props.item.quantity_to }}</td>
              <td class="justify-center">
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
            <template v-slot:no-results>
              <p class="justify-center layout px-0">
                Your search for "{{ search }}" found no results.
              </p>
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
import Mixins from "@/helpers/Mixins.js";
import ModalFormRates from "@/components/modules/ShippingMethods/ModalFormRates";
import { mapState, mapActions } from "vuex";

export default {
  mixins: [Mixins],
  components: {
    Alerts,
    ModalFormRates,
  },

  data: () => ({
    dialog: false,
    modalDelete: {
      dialog: false,
      id: null,
    },
    search: "",
    headers: [
      { text: "Rate Amount", value: "rate_amount" },
      { text: "Subtotal From", value: "subtotal_amount_from" },
      { text: "Subtotal To", value: "subtotal_amount_to" },
      { text: "Quantity From", value: "quantity_from" },
      { text: "Quantity To", value: "quantity_to" },
      { text: "Actions", align: "left", value: "", sortable: false },
    ],
  }),

  mounted() {
    this.getShippingMethodDataById(this.$route.params.shippingMethodId);
    this.getShippingMethodRateDataByShippingMethodId(
      this.$route.params.shippingMethodId
    );
  },

  computed: {
    ...mapState("shippingMethods", ["shippingMethodDataById"]),
    ...mapState("shippingMethodRates", ["shippingMethodRateList"]),
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
  },

  methods: {
    ...mapActions("alerts", ["setAlert"]),
    ...mapActions("shippingMethods", {
      getShippingMethodDataById: "getDataById",
    }),
    ...mapActions("shippingMethodRates", {
      getShippingMethodRateDataByShippingMethodId: "getDataByShippingMethodId",
      deleteShippingMethodRateData: "deleteData",
    }),

    editItem(id) {
      this.setDialog(true);
      this.$refs.modalFormRates.editItem(id);
    },

    deleteModal(id) {
      this.modalDelete.id = id;
      this.modalDelete.dialog = true;
    },

    deleteItem() {
      this.deleteShippingMethodRateData(this.modalDelete.id)
        .then((response) => {
          let obj = {
            alert: true,
            type: "success",
            message: [response.message],
            outline: true,
          };

          if (response.status === "error") {
            obj.type = "error";
            obj.message = response.errors;
          }

          this.setAlert(obj);
          this.modalDelete.id = null;
          this.modalDelete.dialog = false;
        })
        .catch((err) => console.log(err));
    },

    close() {
      this.setDialog(false);
      this.$refs.modalFormRates.close();
    },

    setDialog(value) {
      this.dialog = value;
    },
  },
};
</script>
