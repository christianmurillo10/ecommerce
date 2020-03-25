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
            <td class="text-xs-left">{{ props.item.price_amount }}</td>
            <td class="text-xs-left">{{ props.item.is_today_deal }}</td>
            <td class="text-xs-left">{{ props.item.is_published }}</td>
            <td class="text-xs-left">{{ props.item.is_featured }}</td>
            <td class="justify-center">
              <v-tooltip left>
                <template v-slot:activator="{ on }">
                  <v-icon small class="mr-2" color="purple darken-2" @click="editOption(props.item.id)" v-on="on">list_alt</v-icon>
                </template>
                <span>Options</span>
              </v-tooltip>
              <v-tooltip left>
                <template v-slot:activator="{ on }">
                  <v-icon small class="mr-2" color="blue-grey darken-2" @click="editImage(props.item.id)" v-on="on">image</v-icon>
                </template>
                <span>Image</span>
              </v-tooltip>
              <v-tooltip left>
                <template v-slot:activator="{ on }">
                  <v-icon small class="mr-2" @click="editItem(props.item.id)" v-on="on">edit</v-icon>
                </template>
                <span>Update</span>
              </v-tooltip>
              <v-tooltip left>
                <template v-slot:activator="{ on }">
                  <v-icon small color="red" @click="deleteItem(props.item.id)" v-on="on">delete</v-icon>
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
  </v-container>
</template>

<script>
import Alerts from "../../components/utilities/Alerts";
import { mapState, mapActions } from "vuex";

export default {
  components: {
    Alerts
  },

  data: () => ({
    loading: true,
    // search: '',
    headers: [
      { text: "Image", value: "name", sortable: false },
      { text: "Name", value: "name", sortable: false },
      { text: "Unit", value: "name", sortable: false },
      { text: "Stock", value: "name", sortable: false },
      { text: "Price", value: "name", sortable: false },
      { text: "Todays Deal", value: "name", sortable: false },
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
      deleteProductData: "deleteData"
    }),

    setTableData() {
      const { sortBy, descending, page, rowsPerPage } = this.pagination;
      let limit = rowsPerPage;
      let offset = page === 1 ? 0 : (page - 1) * rowsPerPage;
      this.getProductDataWithLimitAndOffset({limit, offset});
      this.loading = false;
    },

    editItem(id) {
      this.$router.push(`/products/update/${id}`);
    },

    editImage(id) {
      this.$router.push(`/products/image/${id}`);
    },

    editOption(id) {
      this.$router.push(`/products/option/${id}`);
    },

    deleteItem(id) {
      this.deleteProductData(id)
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
  }
};
</script>
