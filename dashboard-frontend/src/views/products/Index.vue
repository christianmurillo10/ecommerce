<template>
  <v-container fluid>
    <Alerts />
    <v-divider></v-divider>
    <v-toolbar color="#EEEEEE" dense>
      <v-toolbar-title>
        <v-icon class="black--text">view_list</v-icon>Products
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon to="/products/create">
        <v-icon>add_box</v-icon>
      </v-btn>
    </v-toolbar>
    <v-data-table :headers="headers" :items="productList" class="elevation-1">
      <template v-slot:items="props">
        <td class="text-xs-left">
          <router-link v-bind:to="'/products/view/' + props.item.id">{{
            props.item.name
          }}</router-link>
        </td>
        <td class="text-xs-left">{{ props.item.description }}</td>
        <td class="text-xs-left">{{ props.item.price }}</td>
        <td class="text-xs-left">{{ props.item.productCategories.name }}</td>
        <td class="text-xs-left">{{ props.item.productSubCategories.name }}</td>
        <td class="justify-center layout px-0">
          <v-icon small class="mr-2" @click="editItem(props.item.id)"
            >edit</v-icon
          >
          <v-icon small @click="deleteItem(props.item.id)">delete</v-icon>
        </td>
      </template>
      <template v-slot:no-data>
        <p class="justify-center layout px-0">No data found!</p>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import Alerts from "../../components/utilities/Alerts";
import ModalForm from "./ModalForm";
import { mapState, mapActions } from "vuex";

export default {
  components: {
    Alerts,
    ModalForm
  },

  data: () => ({
    dialog: false,
    headers: [
      { text: "Name", value: "name" },
      { text: "Description", value: "description" },
      { text: "Price", value: "price" },
      { text: "Product Category", value: "product_category_id" },
      { text: "Product Sub Category", value: "product_sub_category_id" },
      { text: "Actions", align: "center", value: "name", sortable: false }
    ]
  }),

  mounted() {
    this.getProductData();
  },

  computed: {
    ...mapState("products", ["productList"])
  },

  watch: {
    dialog(val) {
      val || this.close();
    }
  },

  methods: {
    ...mapActions("products", {
      getProductData: "getData"
    }),

    editItem(id) {
      this.setDialog(true);
      this.$refs.modalForm.editItem(id);
    },

    deleteItem(id) {
      this.$refs.modalForm.deleteItem(id);
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
