<template>
  <v-layout row wrap>
    <v-container fluid>
      <v-flex xs12 sm12 md12 lg12>
        <Slider />
      </v-flex>
    </v-container>
    <TodayFlashDeals />
    <v-container fluid>
      <v-flex xs12 sm12 md12 lg12>
        <v-card flat class="grey lighten-1" height="150" width="1280">
          <v-container fill-height justify-center>
            <span class="display-3">150 x 1280</span>
          </v-container>
        </v-card>
      </v-flex>
    </v-container>
    <FeaturedProducts />
    <v-container fluid>
      <v-flex xs12 sm12 md12 lg12>
        <v-container fluid>
          <v-layout row wrap>
            <v-flex xs12 sm12 md6 lg6>
              <v-card flat class="grey lighten-1" height="250" width="620">
                <v-container fill-height justify-center>
                  <span class="display-3">250 x 620</span>
                </v-container>
              </v-card>
            </v-flex>
            <v-flex xs12 sm12 md6 lg6>
              <v-card flat class="grey lighten-1" height="250" width="620">
                <v-container fill-height justify-center>
                  <span class="display-3">250 x 620</span>
                </v-container>
              </v-card>
            </v-flex>
          </v-layout>
        </v-container>
      </v-flex>
    </v-container>
  </v-layout>
</template>

<script>
import Categories from "./components/Categories";
import Slider from "./components/Slider";
import TodayFlashDeals from "./components/TodayFlashDeals";
import FeaturedProducts from "./components/FeaturedProducts";
import { mapState, mapActions } from "vuex";

export default {
  components: {
    Categories,
    Slider,
    TodayFlashDeals,
    FeaturedProducts,
  },

  data: () => ({}),

  mounted() {},

  computed: {},

  methods: {},
};
</script>
