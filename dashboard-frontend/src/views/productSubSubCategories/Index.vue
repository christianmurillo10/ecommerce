<template>
  <v-container fluid>
    <Alerts />
    <v-card>
      <v-card-title>
        <v-icon class="black--text">view_list</v-icon><span class="title">Products Sub Sub-Categories</span>
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
        <v-data-table :headers="headers" :items="productSubSubCategoryList" :search="search" class="elevation-1">
          <template v-slot:items="props">
            <td class="text-xs-left">{{ props.item.name }}</td>
            <td class="text-xs-left">{{ props.item.description }}</td>
            <td class="text-xs-left">{{ props.item.productCategories.name }}</td>
            <td class="text-xs-left">{{ props.item.productSubCategories.name }}</td>
            <td class="justify-center layout px-0">
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
          <template v-slot:no-data>
            <p class="justify-center layout px-0">No data found!</p>
          </template>
          <template v-slot:no-results>
            <p class="justify-center layout px-0">Your search for "{{ search }}" found no results.</p>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
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
    search: '',
    headers: [
      { text: "Name", value: "name" },
      { text: "Description", value: "description" },
      { text: "Product Category", value: "productCategories.name" },
      { text: "Product Sub Category", value: "productSubCategories.name" },
      { text: "Actions", align: "center", value: "name", sortable: false }
    ]
  }),

  mounted() {
    this.getProductSubSubCategoryData();
  },

  computed: {
    ...mapState("productSubSubCategories", ["productSubSubCategoryList"])
  },

  watch: {
    dialog(val) {
      val || this.close();
    }
  },

  methods: {
    ...mapActions("productSubSubCategories", {
      getProductSubSubCategoryData: "getData"
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