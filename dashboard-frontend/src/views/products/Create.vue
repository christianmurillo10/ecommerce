<template>
  <v-container fluid>
    <Alerts />
    <v-divider></v-divider>
    <v-toolbar color="#EEEEEE" dense>
      <v-toolbar-title>
        <v-icon class="black--text">add_box</v-icon>Products - Create
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon to="/products">
        <v-icon>arrow_back</v-icon>
      </v-btn>
    </v-toolbar>
    <Form ref="form" />
  </v-container>
</template>

<script>
import Alerts from "@/components/utilities/Alerts";
import Form from "./Form";
import { mapState, mapActions } from "vuex";

export default {
  components: {
    Alerts,
    Form
  },

  data: () => ({}),

  mounted() {},

  computed: {},

  methods: {}
};
</script>
