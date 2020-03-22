<template>
  <v-container fluid>
    <Alerts />
    <v-card>
      <v-card-title>
        <v-icon class="black--text">list_alt</v-icon
        ><span class="title">Product - Option</span>
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
    </v-card>
  </v-container>
</template>

<script>
import Alerts from "@/components/utilities/Alerts";
import { mapState, mapActions } from "vuex";

export default {
  components: {
    Alerts
  },

  data: () => ({}),

  mounted() {},

  computed: {},

  methods: {}
};
</script>
