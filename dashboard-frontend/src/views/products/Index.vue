<template>
  <v-container fluid>
    <Alerts />
    <!-- <v-divider></v-divider>
    <v-toolbar color="#EEEEEE" dense>
      <v-toolbar-title>
        <v-icon class="black--text">view_list</v-icon>Products
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon to="/products/create">
        <v-icon>add_box</v-icon>
      </v-btn>
    </v-toolbar> -->
    <v-card>
      <v-card-title>
        <v-icon class="black--text">view_list</v-icon>Products
        <v-spacer></v-spacer>
        <v-btn icon to="/products/create">
          <v-icon>add_box</v-icon>
        </v-btn>
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
          <td class="text-xs-left">
            <router-link v-bind:to="'/products/view/' + props.item.id">{{
              props.item.name
            }}</router-link>
          </td>
          <td class="text-xs-left">{{ props.item.unit }}</td>
          <td class="text-xs-left">{{ props.item.price_amount }}</td>
          <td class="text-xs-left">{{ props.item.productBrands.name }}</td>
          <td class="text-xs-left">{{ props.item.productCategories.name }}</td>
          <td class="text-xs-left">{{ props.item.productSubCategories.name }}</td>
          <td class="text-xs-left">{{ props.item.productSubSubCategories.name }}</td>
          <td class="justify-center layout px-0">
            <v-icon small class="mr-2" @click="editItem(props.item.id)">edit</v-icon>
            <v-icon small @click="deleteItem(props.item.id)">delete</v-icon>
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
      { text: "Name", value: "name" },
      { text: "Unit", value: "unit" },
      { text: "Price", value: "price_amount" },
      { text: "Brand", value: "product_brand_id" },
      { text: "Category", value: "product_category_id" },
      { text: "Sub Category", value: "product_sub_category_id" },
      { text: "Sub-Sub Category", value: "product_sub_Sub_category_id" },
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
