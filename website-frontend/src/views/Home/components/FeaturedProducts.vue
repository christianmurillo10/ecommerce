<template>
  <v-card v-if="productIsFeaturedList.length !== 0">
    <v-card-title>
      FEATURED PRODUCTS
      <v-spacer></v-spacer>
      <v-btn small outlined color="red white--text">Shop Now</v-btn>
    </v-card-title>
    <v-card-text>
      <v-flex xs12 sm12 md12 lg12>
        <v-layout row wrap>
          <swiper class="swiper" :options="swiperOption">
            <swiper-slide v-for="(productIsFeatured, i) in productIsFeaturedList" :key="i">
              <v-container fluid>
                <v-img class="swiper-image" :src="productIsFeatured.productImages[0].file_path" lazy-src="@/assets/images/no-image.png" @click="viewProduct(productIsFeatured.id)" />
                <v-container fluid>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <div v-on="on" class="caption black--text">
                        {{ truncateText(productIsFeatured.name, 20) }}
                      </div>
                    </template>
                    <span>{{ productIsFeatured.name }}</span>
                  </v-tooltip>
                  <div class="subtitle-2 font-weight-bold black--text">
                    {{ `&#8369 ${productIsFeatured.price_amount}` }}
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
  <v-divider v-else></v-divider>
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
    this.getProductDataByIsFeatured(1);
  },

  computed: {
    ...mapState("products", ["productIsFeaturedList"]),
  },

  methods: {
    ...mapActions("products", { getProductDataByIsFeatured: "getDataByIsFeatured" }),
    
    viewProduct(id) {
      this.$router.push(`/products/${id}`);
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/product-slider.scss';
</style>