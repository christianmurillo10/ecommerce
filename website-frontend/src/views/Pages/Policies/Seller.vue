<template>
  <v-layout wrap>
    <v-container class="content" fluid>
      <v-flex xs12 sm12 md12 lg12>
        <v-card flat>
          <v-card-title class="justify-center">Seller Policy</v-card-title>
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
    this.getFrontendPolicyPageDataByType(5);
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
