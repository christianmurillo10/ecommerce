<template>
  <v-container fluid grid-list-sm>
    <v-layout row wrap>
      <v-flex xs12 sm12 md12 lg12>
        <v-carousel cycle height="400" hide-delimiter-background show-arrows-on-hover>
          <v-carousel-item
            v-for="(productBannerImage, i) in productBannerImageList"
            :key="i"
            :src="productBannerImage.file_path"
            reverse-transition="fade-transition"
            transition="fade-transition"
          ></v-carousel-item>
        </v-carousel>
      </v-flex>
      <v-flex xs12 sm12 md12 lg12>
        <v-card>
          <v-card-title>CATEGORIES</v-card-title>
          <v-card-text>
            <v-layout row wrap>
              <template v-for="(productCategory, i) in productCategoryList">
                <v-flex xs12 sm12 md3 lg3 :key="i">
                  <v-hover>
                    <v-card
                      slot-scope="{ hover }"
                      :class="`elevation-${hover ? 12 : 2}`"
                      :to="`category/${productCategory.id}`"
                    >
                      <v-card-title primary-title class="justify-center">
                        <h4 class="headline text-xs-center">{{ productCategory.name }}</h4>
                      </v-card-title>
                    </v-card>
                  </v-hover>
                </v-flex>
              </template>
            </v-layout>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex xs12 sm12 md12 lg12>
        <v-card>
          <v-card-title>HOT SALE</v-card-title>
          <v-card-text>
            <v-flex xs12 sm12 md12 lg12>
              <v-layout row wrap>
                <v-flex xs12 sm12 md3 lg3>
                  <v-hover v-slot:default="{ hover }">
                    <v-card class="mx-auto" color="grey lighten-4" max-width="600">
                      <v-img
                        :aspect-ratio="16 / 9"
                        src="https://cdn.vuetifyjs.com/images/cards/kitchen.png"
                      >
                        <v-expand-transition>
                          <div
                            v-if="hover"
                            class="d-flex transition-fast-in-fast-out orange darken-2 v-card--reveal display-1 white--text"
                            style="height: 100%;"
                          >P14.99</div>
                        </v-expand-transition>
                      </v-img>
                      <v-card-text class="pt-6" style="position: relative;">
                        <h3 class="title font-weight-light orange--text mb-2">QW cooking utensils</h3>
                        <div class="font-weight-light grey--text body-2 mb-2">For the perfect meal</div>
                      </v-card-text>
                    </v-card>
                  </v-hover>
                </v-flex>
                <v-flex xs12 sm12 md3 lg3>
                  <v-hover v-slot:default="{ hover }">
                    <v-card class="mx-auto" color="grey lighten-4" max-width="600">
                      <v-img
                        :aspect-ratio="16 / 9"
                        src="https://cdn.vuetifyjs.com/images/cards/kitchen.png"
                      >
                        <v-expand-transition>
                          <div
                            v-if="hover"
                            class="d-flex transition-fast-in-fast-out orange darken-2 v-card--reveal display-1 white--text"
                            style="height: 100%;"
                          >P14.99</div>
                        </v-expand-transition>
                      </v-img>
                      <v-card-text class="pt-6" style="position: relative;">
                        <h3 class="title font-weight-light orange--text mb-2">QW cooking utensils</h3>
                        <div class="font-weight-light grey--text body-2 mb-2">For the perfect meal</div>
                      </v-card-text>
                    </v-card>
                  </v-hover>
                </v-flex>
                <v-flex xs12 sm12 md3 lg3>
                  <v-hover v-slot:default="{ hover }">
                    <v-card class="mx-auto" color="grey lighten-4" max-width="600">
                      <v-img
                        :aspect-ratio="16 / 9"
                        src="https://cdn.vuetifyjs.com/images/cards/kitchen.png"
                      >
                        <v-expand-transition>
                          <div
                            v-if="hover"
                            class="d-flex transition-fast-in-fast-out orange darken-2 v-card--reveal display-1 white--text"
                            style="height: 100%;"
                          >P14.99</div>
                        </v-expand-transition>
                      </v-img>
                      <v-card-text class="pt-6" style="position: relative;">
                        <h3 class="title font-weight-light orange--text mb-2">QW cooking utensils</h3>
                        <div class="font-weight-light grey--text body-2 mb-2">For the perfect meal</div>
                      </v-card-text>
                    </v-card>
                  </v-hover>
                </v-flex>
                <v-flex xs12 sm12 md3 lg3>
                  <v-hover v-slot:default="{ hover }">
                    <v-card class="mx-auto" color="grey lighten-4" max-width="600">
                      <v-img
                        :aspect-ratio="16 / 9"
                        src="https://cdn.vuetifyjs.com/images/cards/kitchen.png"
                      >
                        <v-expand-transition>
                          <div
                            v-if="hover"
                            class="d-flex transition-fast-in-fast-out orange darken-2 v-card--reveal display-1 white--text"
                            style="height: 100%;"
                          >P14.99</div>
                        </v-expand-transition>
                      </v-img>
                      <v-card-text class="pt-6" style="position: relative;">
                        <h3 class="title font-weight-light orange--text mb-2">QW cooking utensils</h3>
                        <div class="font-weight-light grey--text body-2 mb-2">For the perfect meal</div>
                      </v-card-text>
                    </v-card>
                  </v-hover>
                </v-flex>
              </v-layout>
            </v-flex>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex xs12 sm12 md12 lg12>
        <v-card>
          <v-card-title>PRODUCTS</v-card-title>
          <v-card-text>
            <v-flex xs12 sm12 md12 lg12>
              <v-layout row wrap>
                <template v-for="(productHomeImage, i) in productHomeImageList">
                  <v-flex xs12 sm12 md2 lg2 :key="i">
                    <v-hover v-slot:default="{ hover }">
                      <v-card class="mx-auto" color="grey lighten-4" max-width="600">
                        <v-img :aspect-ratio="16 / 9" :src="productHomeImage.file_path">
                          <v-expand-transition>
                            <div
                              v-if="hover"
                              class="d-flex transition-fast-in-fast-out orange darken-2 v-card--reveal display-1 white--text"
                              style="height: 100%;"
                            >{{ `P${productHomeImage.products.price}` }}</div>
                          </v-expand-transition>
                        </v-img>
                        <v-card-text class="pt-6" style="position: relative;">
                          <h3
                            class="title font-weight-light orange--text mb-2"
                          >{{ productHomeImage.products.name }}</h3>
                          <div
                            class="font-weight-light grey--text body-2 mb-2"
                          >{{ productHomeImage.products.description }}</div>
                        </v-card-text>
                      </v-card>
                    </v-hover>
                  </v-flex>
                </template>
              </v-layout>
            </v-flex>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  data: () => ({}),

  mounted() {
    this.getProductBannerImageData();
    this.getProductImageDataGroupByProductIdAsc(6);
  },

  computed: {
    ...mapState("productBannerImages", ["productBannerImageList"]),
    ...mapState("productImages", ["productHomeImageList"]),
    ...mapState("productCategories", ["productCategoryList"])
  },

  methods: {
    ...mapActions("productBannerImages", {
      getProductBannerImageData: "getData"
    }),
    ...mapActions("productImages", {
      getProductImageDataGroupByProductIdAsc: "getDataGroupByProductIdAsc"
    })
  }
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
