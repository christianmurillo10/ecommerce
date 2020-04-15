<template>
  <v-container fluid>
    <Alerts />
    <v-divider></v-divider>
    <v-toolbar color="#EEEEEE" dense>
      <v-toolbar-title>
        <v-icon class="black--text">view_list</v-icon>Product Banner Images
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-dialog v-model="dialog" max-width="500px">
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on">
            <v-icon>add_box</v-icon>
          </v-btn>
        </template>
        <ModalForm ref="modalForm" @setDialog="setDialog" />
      </v-dialog>
    </v-toolbar>
    <v-data-table :headers="headers" :items="productBannerImageList" class="elevation-1">
      <template v-slot:items="props">
        <td class="text-xs-left"><img :src="props.item.file_path" height="150" /></td>
        <td class="text-xs-left">{{ props.item.order }}</td>
        <td class="justify-center text-xs-center px-0">
          <v-icon small class="mr-2" @click="editItem(props.item.id)">edit</v-icon>
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
import Alerts from "@/components/utilities/Alerts";
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
      { text: "Image", value: "file_name" },
      { text: "Order", value: "order" },
      { text: "Actions", align: "center", value: "id", sortable: false }
    ]
  }),

  mounted() {
    this.getProductBannerImageData();
  },

  computed: {
    ...mapState("productBannerImages", ["productBannerImageList"])
  },

  watch: {
    dialog(val) {
      val || this.close();
    }
  },

  methods: {
    ...mapActions("productBannerImages", {
      getProductBannerImageData: "getData"
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