<template>
  <v-card>
    <v-card-title>TODAY'S DEAL</v-card-title>
    <v-card-text>
      <v-flex xs12 sm12 md12 lg12>
        <v-layout row wrap>
          <swiper class="swiper" :options="swiperOption">
            <swiper-slide v-for="(productFlashDealDetail, i) in productFlashDealHeaderTodayFlashDeal.productFlashDealDetails" :key="i">
              <v-container fluid>
                <v-img class="swiper-image" :src="productFlashDealDetail.products.productImages[0].file_path" @click="viewProduct(productFlashDealDetail.product_id)" />
                <v-container fluid>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <div v-on="on" class="caption black--text">
                        {{ truncateText(productFlashDealDetail.products.name, 20) }}
                      </div>
                    </template>
                    <span>{{ productFlashDealDetail.products.name }}</span>
                  </v-tooltip>
                  <div class="subtitle-2 font-weight-bold red--text">
                    {{ setRateTypeValue(productFlashDealDetail.discount_value, productFlashDealDetail.discount_type) }} OFF
                  </div>
                  <div class="subtitle-2 font-weight-bold black--text">
                    {{ `&#8369 ${productFlashDealDetail.current_price_amount}` }}
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
            <div class="swiper-button-prev" slot="button-prev"></div>
            <div class="swiper-button-next" slot="button-next"></div>
          </swiper>
        </v-layout>
      </v-flex>
    </v-card-text>
  </v-card>
</template>

<script>
import Mixins from "@/helpers/Mixins.js";
import { Swiper, SwiperSlide } from 'vue-awesome-swiper';
import 'swiper/css/swiper.css';
import { mapState, mapActions } from "vuex";

export default {
  mixins: [Mixins],
  components: {
    Swiper,
    SwiperSlide
  },

  data: () => ({
    swiperOption: {
      slidesPerView: "auto",
      spaceBetween: 10,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
      }
    }
  }),
  
  mounted() {
    this.getProductFlashDealHeaderDataTodayFlashDeal();
  },

  computed: {
    ...mapState("productFlashDealHeaders", ["productFlashDealHeaderTodayFlashDeal"]),
  },

  methods: {
    ...mapActions("productFlashDealHeaders", { getProductFlashDealHeaderDataTodayFlashDeal: "getDataTodayFlashDeal" }),
    
    viewProduct(id) {
      this.$router.push(`/products/${id}`);
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/product-slider.scss';
</style>