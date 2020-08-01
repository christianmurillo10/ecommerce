<template>
  <v-container v-if="productFlashDealHeaderTodayFlashDeal.length !== 0">
    <v-layout row wrap>
      <v-flex xs12 sm12 md12 lg12>
        <v-layout row wrap>
          <v-flex xs12 sm12 md12 lg12>
            <v-layout row wrap>
              <v-container fill-height>
                <h1 class="blue--text">TODAY'S DEAL</h1>
                <v-divider></v-divider>
              </v-container>
            </v-layout>
          </v-flex>
          <v-flex xs12 sm12 md12 lg12>
            <swiper class="swiper" :options="swiperOption">
              <swiper-slide
                v-for="(productFlashDealDetail,
                i) in productFlashDealHeaderTodayFlashDeal.productFlashDealDetails"
                :key="i"
              >
                <v-container fluid>
                  <v-img
                    class="swiper-image"
                    :src="
                      productFlashDealDetail.products.productImages[0].file_path
                    "
                    lazy-src="@/assets/images/no-image.png"
                    @click="viewProduct(productFlashDealDetail.product_id)"
                  />
                  <v-container fluid>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <div v-on="on" class="caption black--text">
                          {{
                            truncateText(
                              productFlashDealDetail.products.name,
                              20
                            )
                          }}
                        </div>
                      </template>
                      <span>{{ productFlashDealDetail.products.name }}</span>
                    </v-tooltip>
                    <div class="subtitle-2 font-weight-bold blue--text">
                      {{
                        setRateTypeValue(
                          productFlashDealDetail.discount_value,
                          productFlashDealDetail.discount_type
                        )
                      }}
                      OFF
                    </div>
                    <div class="subtitle-2 font-weight-bold black--text">
                      {{
                        `&#8369; ${productFlashDealDetail.current_price_amount}`
                      }}
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
                  </v-container>
                </v-container>
              </swiper-slide>
              <div class="swiper-pagination" slot="pagination"></div>
            </swiper>
          </v-flex>
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
    this.getProductFlashDealHeaderDataTodayFlashDeal();
  },

  computed: {
    ...mapState("productFlashDealHeaders", [
      "productFlashDealHeaderTodayFlashDeal",
    ]),
  },

  methods: {
    ...mapActions("productFlashDealHeaders", {
      getProductFlashDealHeaderDataTodayFlashDeal: "getDataTodayFlashDeal",
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
