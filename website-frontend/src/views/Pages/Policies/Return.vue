<template>
  <v-layout row wrap>
    <v-container fluid>
      <v-flex xs12 sm12 md12 lg12>
        <v-card outlined>
          <v-card-title class="justify-center">Return Policy</v-card-title>
          <v-card-text>
            <v-sheet class="d-flex" color="grey lighten-5">
              <v-container>
                <div
                  v-if="frontendPolicyPageDataByType.description === ''"
                  class="text-xs-center"
                >
                  There have been no description for this product yet.
                </div>
                <div
                  v-else
                  v-html="frontendPolicyPageDataByType.description"
                  style="white-space: pre-wrap;"
                ></div>
              </v-container>
            </v-sheet>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-container>
  </v-layout>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  created() {
    this.getFrontendPolicyPageDataByType(4);
  },

  computed: {
    ...mapState("frontendPolicyPages", ["frontendPolicyPageDataByType"]),
  },

  methods: {
    ...mapActions("frontendPolicyPages", {
      getFrontendPolicyPageDataByType: "getDataByType",
    }),
  },
};
</script>
