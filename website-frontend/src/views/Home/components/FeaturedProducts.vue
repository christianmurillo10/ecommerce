<template>
  <v-container v-if="productIsFeaturedList.length !== 0" elevation="0">
    <v-layout row wrap>
      <v-flex xs12 sm12 md12 lg12>
        <v-layout row wrap>
          <v-container fill-height>
            <h1 class="blue--text">FEATURED PRODUCTS</h1>
            <v-divider></v-divider>
          </v-container>
        </v-layout>
      </v-flex>
      <v-flex xs12 sm12 md12 lg12>
        <v-layout row wrap>
          <swiper class="swiper" :options="swiperOption">
            <swiper-slide
              v-for="(productIsFeatured, i) in productIsFeaturedList"
              :key="i"
            >
              <v-hover v-slot:default="{ hover }">
                <v-card height="335" class="mx-auto">
                  <v-img
                    height="200"
                    width="218"
                    :src="productIsFeatured.productImages[0].file_path"
                    lazy-src="@/assets/images/no-image.png"
                  >
                    <v-row class="pa-2" v-if="hover">
                      <v-col>
                        <div>
                          <v-btn
                            icon
                            color="red"
                            class="white--text"
                            x-small
                            top
                          >
                            <v-icon>mdi-heart</v-icon>
                          </v-btn>
                        </div>
                        <div>
                          <v-btn
                            icon
                            color="blue"
                            class="white--text"
                            x-small
                            top
                          >
                            <v-icon>mdi-cart</v-icon>
                          </v-btn>
                        </div>
                      </v-col>
                    </v-row>
                  </v-img>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-card-title>
                        <v-hover v-slot:default="{ hover }">
                          <span
                            v-on="on"
                            :class="
                              `caption cursor-pointer ${
                                hover ? 'blue--text' : 'black--text'
                              }`
                            "
                            @click="viewProduct(productIsFeatured.id)"
                          >
                            {{ truncateText(productIsFeatured.name, 20) }}
                          </span>
                        </v-hover>
                      </v-card-title>
                    </template>
                    <span>{{ productIsFeatured.name }}</span>
                  </v-tooltip>
                  <v-card-text>
                    <div class="subtitle-2 font-weight-bold black--text">
                      {{ `&#8369; ${productIsFeatured.price_amount}` }}
                    </div>
                    <v-row align="center" class="mx-0">
                      <v-rating
                        :value="4.5"
                        color="amber"
                        dense
                        half-increments
                        readonly
                        size="14"
                      ></v-rating>
                      <div class="grey--text ml-4">4.5 (413)</div>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-hover>
            </swiper-slide>
            <div class="swiper-pagination" slot="pagination"></div>
          </swiper>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import Mixins from "@/helpers/Mixins.js";
import { Swiper, SwiperSlide } from "vue-awesome-swiper";
import "swiper/css/swiper.css";
import { mapState, mapActions } from "vuex";

export default {
  mixins: [Mixins],
  components: {
    Swiper,
    SwiperSlide,
  },

  data: () => ({
    swiperOption: {
      slidesPerView: "auto",
      spaceBetween: 15,
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
    },
  }),

  mounted() {
    this.getProductDataByIsFeatured(1);
  },

  computed: {
    ...mapState("products", ["productIsFeaturedList"]),
  },

  methods: {
    ...mapActions("products", {
      getProductDataByIsFeatured: "getDataByIsFeatured",
    }),

    viewProduct(id) {
      this.$router.push(`/products/${id}`);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/product-slider.scss";
</style>
