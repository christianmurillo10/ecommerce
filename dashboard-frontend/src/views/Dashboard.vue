<template>
  <v-container fluid grid-list-sm>
    <v-layout row wrap>
      <v-flex xs12 sm12 md3 lg3>
        <v-hover>
          <v-card
            slot-scope="{ hover }"
            :class="`elevation-${hover ? 12 : 2}`"
          >
            <v-card-title primary-title class="justify-center">
              <div>
                <h4 class="headline text-xs-center"><v-icon large>people</v-icon></h4>
                <h4 class="headline text-xs-center teal--text text--accent-4">Pending Customer</h4>
                <h4 class="headline text-xs-center">0</h4>
              </div>
            </v-card-title>
            <v-card-actions class="justify-center">
              <v-btn to="/customers/pending" flat color="orange text--darken-3">view</v-btn>
            </v-card-actions>
          </v-card>
        </v-hover>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapState, mapActions } from "vuex";


export default {
  data: () => ({}),

  mounted() {},

  computed: {},

  methods: {}
}
</script>