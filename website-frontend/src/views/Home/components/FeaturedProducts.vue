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
              <ProductCard
                :item="{
                  id: productIsFeatured.id,
                  name: productIsFeatured.name,
                  file_path: productIsFeatured.productImages[0].file_path,
                  price_amount: productIsFeatured.price_amount,
                }"
              />
            </swiper-slide>
            <div class="swiper-pagination" slot="pagination"></div>
          </swiper>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { Swiper, SwiperSlide } from "vue-awesome-swiper";
import "swiper/css/swiper.css";
import ProductCard from "@/components/modules/products/Card";
import { mapState, mapActions } from "vuex";

export default {
  components: {
    Swiper,
    SwiperSlide,
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
    this.getProductDataByIsFeatured(1);
  },

  computed: {
    ...mapState("products", ["productIsFeaturedList"]),
  },

  methods: {
    ...mapActions("products", {
      getProductDataByIsFeatured: "getDataByIsFeatured",
    }),
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/product-slider.scss";
</style>
