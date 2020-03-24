<template>
  <v-container fluid>
    <Alerts />
    <v-card>
      <v-card-title>
        <v-icon class="black--text">list_alt</v-icon
        ><span class="title">Product - Option</span>
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
          <ModalFormOption ref="modalFormOption" @setDialog="setDialog" />
        </v-dialog>
        <v-tooltip left>
          <template v-slot:activator="{ on }">
            <v-btn icon to="/products" v-on="on">
              <v-icon>arrow_back</v-icon>
            </v-btn>
          </template>
          <span>Back</span>
        </v-tooltip>
      </v-card-title>
      <v-card-text>
        <v-data-table :headers="headers" :items="productOptionList" :search="search" class="elevation-1">
          <template v-slot:items="props">
            <td class="text-xs-left">{{ props.item.title }}</td>
            <td class="text-xs-left">{{ props.item.values }}</td>
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
import Alerts from "@/components/utilities/Alerts";
import ModalFormOption from "./ModalFormOption";
import { mapState, mapActions } from "vuex";

export default {
  components: {
    Alerts,
    ModalFormOption
  },

  data: () => ({
    dialog: false,
    search: '',
    headers: [
      { text: "Title", value: "title" },
      { text: "values", value: "values" },
      { text: "Actions", align: "center", value: "title", sortable: false }
    ]
  }),

  mounted() {
    this.getProductOptionDataByProductId(this.$route.params.id);
  },

  computed: {
    ...mapState("productOptions", ["productOptionList"])
  },

  watch: {
    dialog(val) {
      val || this.close();
    }
  },

  methods: {
    ...mapActions("productOptions", {
      getProductOptionDataByProductId: "getDataByProductId"
    }),

    editItem(id) {
      this.setDialog(true);
      this.$refs.modalFormOption.editItem(id);
    },

    deleteItem(id) {
      this.$refs.modalFormOption.deleteItem(id);
    },

    close() {
      this.setDialog(false);
      this.$refs.modalFormOption.close();
    },

    setDialog(value) {
      this.dialog = value;
    }
  }
};
</script>
