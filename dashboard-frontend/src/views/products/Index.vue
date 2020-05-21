<template>
  <v-container fluid>
    <Alerts />
    <v-card>
      <v-card-title>
        <v-icon class="black--text">view_list</v-icon><span class="title">Products</span>
        <v-spacer></v-spacer>
        <v-tooltip left>
          <template v-slot:activator="{ on }">
            <v-btn icon to="/products/create" v-on="on">
              <v-icon color="green">add_box</v-icon>
            </v-btn>
          </template>
          <span>Create</span>
        </v-tooltip>
      </v-card-title>
      <!-- <v-card-title>
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="search"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
      </v-card-title> -->
      <v-card-text>
        <v-data-table
          must-sort
          :headers="headers"
          :pagination.sync="pagination"
          :rows-per-page-items="pagination.rowsPerPageItems"
          :total-items="productTotalCount"
          :loading="loading"
          :items="productList"
          class="elevation-1"
        >
          <!-- With Data -->
          <template v-slot:items="props">
            <td class="text-xs-left pt-1">
              <img
                :src="props.item.productImages[0].file_path"
                height="80"
                width="120"
              />
            </td>
            <td class="text-xs-left">
              <router-link v-bind:to="'/products/view/' + props.item.id">
                <v-tooltip left>
                  <template v-slot:activator="{ on }">
                    <span v-on="on">{{ props.item.name }}</span>
                  </template>
                  <span>View</span>
                </v-tooltip>
              </router-link>
            </td>
            <td class="text-xs-left">{{ props.item.unit }}</td>
            <td class="text-xs-left">{{ props.item.inventories === null ? 0 : props.item.inventories.stock_available }}</td>
            <td class="text-xs-left">&#8369; {{ props.item.price_amount }}</td>
            <td class="text-xs-left">
              <v-switch
                v-model="props.item.is_today_deal"
                color="success"
                @change="updateStatus({ id: props.item.id, fieldName: 'is_today_deal', value: $event })"
                hide-details
              ></v-switch>
            </td>
            <td class="text-xs-left">
              <v-switch
                v-model="props.item.is_published"
                color="success"
                @change="updateStatus({ id: props.item.id, fieldName: 'is_published', value: $event })"
                hide-details
              ></v-switch>
            </td>
            <td class="text-xs-left">
              <v-switch
                v-model="props.item.is_featured"
                color="success"
                @change="updateStatus({ id: props.item.id, fieldName: 'is_featured', value: $event })"
                hide-details
              ></v-switch>
            </td>
            <td class="justify-center" width="100">
              <v-tooltip left>
                <template v-slot:activator="{ on }">
                  <v-icon small class="mr-2" color="purple darken-2" @click="editVariantOption(props.item.id)" v-on="on">list_alt</v-icon>
                </template>
                <span>Variant Options</span>
              </v-tooltip>
              <v-tooltip left>
                <template v-slot:activator="{ on }">
                  <v-icon small class="mr-2" color="blue-grey darken-2" @click="editImage(props.item.id)" v-on="on">image</v-icon>
                </template>
                <span>Images</span>
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
          <!-- No Data -->
          <template v-slot:no-data>
            <p class="justify-center layout px-0">No data found!</p>
          </template>
          <!-- Search No Data -->
          <!-- <template v-slot:no-results>
            <v-alert :value="true" color="error" icon="warning">
              Your search for "{{ search }}" found no results.
            </v-alert>
          </template> -->
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
import { mapState, mapActions } from "vuex";

export default {
  components: {
    Alerts
  },

  data: () => ({
    modalDelete: {
      dialog: false,
      id: null
    },
    loading: true,
    // search: '',
    headers: [
      { text: "Image", value: "name", sortable: false },
      { text: "Name", value: "name", sortable: false },
      { text: "Unit", value: "name", sortable: false },
      { text: "Stock", value: "name", sortable: false },
      { text: "Price", value: "name", sortable: false },
      { text: "Today's Deal", value: "name", sortable: false },
      { text: "Published", value: "name", sortable: false },
      { text: "Featured", value: "name", sortable: false },
      { text: "Actions", align: "center", value: "name", sortable: false }
    ],
    pagination: {
      descending: true,
      page: 1,
      rowsPerPage: 5,
      sortBy: 'name',
      rowsPerPageItems: [5, 10, 25, 50, 100]
    },
  }),

  watch: {
    pagination: {
      handler() {
        this.setTableData();
      },
      deep: true
    },
  },

  computed: {
    ...mapState("products", ["productList", "productTotalCount"])
  },

  methods: {
    ...mapActions("alerts", ["setAlert"]),
    ...mapActions("products", {
      getProductDataWithLimitAndOffset: "getDataWithLimitAndOffset",
      updateStatusProductData: "updateStatusData",
      deleteProductData: "deleteData"
    }),

    setTableData() {
      const { sortBy, descending, page, rowsPerPage } = this.pagination;
      let limit = rowsPerPage;
      let offset = page === 1 ? 0 : (page - 1) * rowsPerPage;
      this.getProductDataWithLimitAndOffset({limit, offset});
      this.loading = false;
    },

    updateStatus(obj) {
      this.updateStatusProductData(obj)
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
      this.$router.push(`/products/update/${id}`);
    },

    editImage(id) {
      this.$router.push(`/products/image/${id}`);
    },

    editVariantOption(id) {
      this.$router.push(`/products/variantOption/${id}`);
    },

    deleteModal(id) {
      this.modalDelete.id = id;
      this.modalDelete.dialog = true;
    },

    deleteItem() {
      this.deleteProductData(this.modalDelete.id)
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
  }
};
</script>
