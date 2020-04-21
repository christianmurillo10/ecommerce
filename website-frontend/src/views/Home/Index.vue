<template>
  <v-container fluid grid-list-sm class="col-lg-10 offset-lg-1">
    <v-layout row wrap>
      <v-container>
        <v-layout row wrap>
          <v-flex xs12 sm12 md12 lg12>
            <v-card>
              <v-layout row wrap>
                <v-flex xs12 sm12 md3 lg3>
                  <Categories />
                </v-flex>
                <v-flex xs12 sm12 md9 lg9>
                  <Slider />
                </v-flex>
              </v-layout>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>

      <v-layout row wrap>
        <v-container>
          <v-layout row wrap>
            <v-flex xs12 sm12 md12 lg12>
              <TodayFlashDeals />
            </v-flex>
          </v-layout>
        </v-container>
        <v-container>
          <v-layout row wrap>
            <v-flex xs12 sm12 md12 lg12>
              <FeaturedProducts />
            </v-flex>
          </v-layout>
        </v-container>
        <v-container>
          <v-layout row wrap>
            <v-flex xs12 sm12 md12 lg12>
              <v-card>
                <v-card-title>(PROMO BANNERS HERE)</v-card-title>
                <v-card-text>
                  <v-flex xs12 sm12 md12 lg12>
                    <v-layout row wrap></v-layout>
                  </v-flex>
                </v-card-text>
              </v-card>
            </v-flex>
          </v-layout>
        </v-container>
        <v-container>
          <v-layout row wrap>
            <v-flex xs12 sm12 md12 lg12>
              <v-card>
                <v-card-title>TOP PRODUCTS (VIA STAR)</v-card-title>
                <v-card-text>
                  <v-flex xs12 sm12 md12 lg12>
                    <v-layout row wrap></v-layout>
                  </v-flex>
                </v-card-text>
              </v-card>
            </v-flex>
          </v-layout>
        </v-container>
      </v-layout>
    </v-layout>
  </v-container>
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
    FeaturedProducts
  },

  data: () => ({}),

  mounted() { },

  computed: { },

  methods: { }
};
</script>

<style>
.v-card--reveal {
  align-items: center;
  bottom: 0;
  justify-content: center;
  opacity: 0.5;
  position: absolute;
  width: 100%;
}
</style>
