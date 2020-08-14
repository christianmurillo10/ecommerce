<template>
  <div>
    <v-layout wrap>
      <v-container class="content">
        <v-flex xs12 sm12 md12 lg12>
          <Slider />
        </v-flex>
      </v-container>
    </v-layout>
    <v-layout wrap>
      <v-container class="content">
        <v-flex xs12 sm12 md12 lg12>
          <v-layout row wrap>
            <v-flex xs12 sm12 md3 lg3>
              <v-container>
                <v-hover v-slot:default="{ hover }">
                  <v-card
                    height="100"
                    :class="`elevation-${hover ? 3 : 1}`"
                  >
                    <v-container fill-height justify-center>
                      <v-icon large left color="blue">
                        mdi-truck-fast-outline
                      </v-icon>
                      <span class="title">Free Delivery</span>
                    </v-container>
                  </v-card>
                </v-hover>
              </v-container>
            </v-flex>
            <v-flex xs12 sm12 md3 lg3>
              <v-container>
                <v-hover v-slot:default="{ hover }">
                  <v-card
                    height="100"
                    :class="`elevation-${hover ? 3 : 1}`"
                  >
                    <v-container fill-height justify-center>
                      <v-icon large left color="blue">
                        mdi-basket-outline
                      </v-icon>
                      <span class="title">Easy to Order</span>
                    </v-container>
                  </v-card>
                </v-hover>
              </v-container>
            </v-flex>
            <v-flex xs12 sm12 md3 lg3>
              <v-container>
                <v-hover v-slot:default="{ hover }">
                  <v-card
                    height="100"
                    :class="`elevation-${hover ? 3 : 1}`"
                  >
                    <v-container fill-height justify-center>
                      <v-icon large left color="blue">
                        mdi-cash
                      </v-icon>
                      <span class="title">Affordable Products</span>
                    </v-container>
                  </v-card>
                </v-hover>
              </v-container>
            </v-flex>
            <v-flex xs12 sm12 md3 lg3>
              <v-container>
                <v-hover v-slot:default="{ hover }">
                  <v-card
                    height="100"
                    :class="`elevation-${hover ? 3 : 1}`"
                  >
                    <v-container fill-height justify-center>
                      <v-icon large left color="blue">
                        mdi-chat-outline
                      </v-icon>
                      <span class="title">27/4 Online Support</span>
                    </v-container>
                  </v-card>
                </v-hover>
              </v-container>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-container>
    </v-layout>
    <v-card flat tile>
      <v-layout wrap>
        <v-container class="content">
          <v-flex xs12 sm12 md12 lg12>
            <v-layout row wrap>
              <v-flex xs12 sm12 md5 lg5>
                <v-container>
                  <v-card shaped class="blue-border elevation-5" height="475" width="480">
                    <v-container>
                      <TodayFlashDeals />
                    </v-container>
                  </v-card>
                </v-container>
              </v-flex>
              <v-flex xs12 sm12 md7 lg7>
                <v-container>
                  <LatestProduct />
                </v-container>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-container>
      </v-layout>
    </v-card>
    <v-layout wrap>
      <v-container class="content">
        <v-flex xs12 sm12 md12 lg12>
          <v-card
            flat
            class="grey white--text"
            height="150"
            width="1280"
          >
            <v-container fill-height justify-center>
              <span class="display-3">150 x 1280</span>
            </v-container>
          </v-card>
        </v-flex>
      </v-container>
    </v-layout>
    <v-card flat tile class="light-blue lighten-5">
      <v-layout wrap>
        <v-container class="content">
          <v-flex xs12 sm12 md12 lg12>
            <FeaturedProducts />
          </v-flex>
        </v-container>
      </v-layout>
    </v-card>
    <v-layout wrap>
      <v-container class="content">
        <v-flex xs12 sm12 md12 lg12>
          <v-layout row wrap>
            <v-flex xs12 sm12 md6 lg6>
              <v-container>
                <v-card flat class="blue white--text" height="250" width="620">
                  <v-container fill-height justify-center>
                    <span class="display-3">250 x 620</span>
                  </v-container>
                </v-card>
              </v-container>
            </v-flex>
            <v-flex xs12 sm12 md6 lg6>
              <v-container>
                <v-card
                  flat
                  class="blue-grey lighten-3"
                  height="250"
                  width="620"
                >
                  <v-container fill-height justify-center>
                    <span class="display-3">250 x 620</span>
                  </v-container>
                </v-card>
              </v-container>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-container>
    </v-layout>
  </div>
</template>

<script>
import Categories from "./components/Categories";
import Slider from "./components/Slider";
import TodayFlashDeals from "./components/TodayFlashDeals";
import LatestProduct from "./components/LatestProduct";
import FeaturedProducts from "./components/FeaturedProducts";
import { mapState, mapActions } from "vuex";

export default {
  components: {
    Categories,
    Slider,
    TodayFlashDeals,
    LatestProduct,
    FeaturedProducts,
  },

  data: () => ({}),

  mounted() {},

  computed: {},

  methods: {},
};
</script>
