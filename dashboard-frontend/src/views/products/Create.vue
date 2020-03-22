<template>
  <v-container fluid>
    <Alerts />
    <v-card>
      <v-card-title>
        <v-icon class="black--text">add_box</v-icon
        ><span class="title">Product - Create</span>
        <v-spacer></v-spacer>
        <v-tooltip left>
          <template v-slot:activator="{ on }">
            <v-btn icon to="/products" v-on="on">
              <v-icon>arrow_back</v-icon>
            </v-btn>
          </template>
          <span>Back</span>
        </v-tooltip>
      </v-card-title>
      <Form ref="form" form-type="new" />
    </v-card>
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
