<template>
  <v-container fluid>
    <Alerts />
    <v-divider></v-divider>
    <v-toolbar color="#EEEEEE" dense>
      <v-toolbar-title>
        <v-icon class="black--text">person</v-icon>Users
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-dialog v-model="dialog" max-width="500px">
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on">
            <v-icon>person_add</v-icon>
          </v-btn>
        </template>
        <ModalForm ref="modalForm" @setDialog="setDialog" />
      </v-dialog>
    </v-toolbar>
    <v-data-table :headers="headers" :items="userList" class="elevation-1">
      <template v-slot:items="props">
        <td class="text-xs-left">{{ props.item.username }}</td>
        <td class="text-xs-left">{{ props.item.email }}</td>
        <td class="text-xs-left">{{ getRoleNameById(props.item.role_id) }}</td>
        <td class="justify-center layout px-0">
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
import Alerts from "../../components/utilities/Alerts";
import ModalForm from "./ModalForm";
import { mapState, mapGetters, mapActions } from "vuex";

export default {
  components: {
    Alerts,
    ModalForm
  },

  data: () => ({
    dialog: false,
    headers: [
      { text: "Username", value: "username" },
      { text: "Email", value: "email" },
      { text: "Role", value: "role_id" },
      { text: "Actions", align: "center", value: "name", sortable: false }
    ]
  }),

  mounted() {
    this.getUserData();
  },

  computed: {
    ...mapState("users", ["userList"]),
    ...mapGetters("roles", ["getRoleNameById"])
  },

  watch: {
    dialog(val) {
      val || this.close();
    }
  },

  methods: {
    ...mapActions("users", {
      getUserData: "getData"
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