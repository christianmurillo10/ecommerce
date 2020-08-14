<template>
  <div>
    <v-flex
      xs12
      sm12
      md12
      lg12
      v-if="productFlashDealHeaderTodayFlashDeal.length !== 0"
    >
      <v-layout wrap>
        <v-container>
          <v-flex xs12 sm12 md12 lg12>
            <v-layout wrap>
              <v-flex xs12 sm12 md12 lg12 text-end>
                <Countdown
                  class="countdown"
                  :endTime="productFlashDealHeaderTodayFlashDeal.date_to"
                />
              </v-flex>
              <v-flex xs12 sm12 md12 lg12>
                <span class="title blue--text">TODAY'S DEAL</span>
              </v-flex>
            </v-layout>
          </v-flex>
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
          <ProductCard
            :item="{
              id: productFlashDealDetail.product_id,
              name: productFlashDealDetail.products.name,
              file_path:
                productFlashDealDetail.products.productImages[0].file_path,
              price_amount: productFlashDealDetail.current_price_amount,
              base_price_amount: productFlashDealDetail.base_price_amount,
              discount_value: productFlashDealDetail.discount_value,
              discount_type: productFlashDealDetail.discount_type,
            }"
          />
        </swiper-slide>
        <div class="swiper-pagination" slot="pagination"></div>
      </swiper>
    </v-flex>
  </div>
</template>

<script>
import { Swiper, SwiperSlide } from "vue-awesome-swiper";
import "swiper/css/swiper.css";
import Countdown from "@/components/utilities/Countdown";
import ProductCard from "@/components/modules/products/Card";
import { mapState, mapActions } from "vuex";

export default {
  components: {
    Swiper,
    SwiperSlide,
    Countdown,
    ProductCard,
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
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/product-slider.scss";

.countdown {
  margin-top: -20px;
}
</style>
