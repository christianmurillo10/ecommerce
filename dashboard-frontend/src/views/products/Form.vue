<template>
  <v-card class="mx-auto my-12" :elevation="3" max-width="auto">
    <v-container>
      <v-flex xs12 sm12 md12 lg12>
        <v-list dense>
          <v-layout wrap>
            <v-flex xs12 sm12 md3 lg3>
              <v-list-tile>
                <v-list-tile-title>
                  <h3>Product Details:</h3>
                </v-list-tile-title>
              </v-list-tile>
            </v-flex>
          </v-layout>
        </v-list>
      </v-flex>
    </v-container>
  </v-card>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  data: () => ({}),

  mounted() {},

  computed: {},

  methods: {}
};
</script>
