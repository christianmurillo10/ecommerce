<template>
  <v-container fluid grid-list-sm class="col-lg-10 offset-lg-1">
    <v-layout row wrap>
      <v-container>
        <v-layout row wrap>
          <v-flex xs12 sm12 md12 lg12>
            <v-card>
              <v-layout row wrap>
                <v-flex xs12 sm12 md3 lg3>
                  <v-card-title>CATEGORIES</v-card-title>
                  <v-card-text>
                    <v-list dense>
                      <v-list-item-group color="primary">
                        <template v-for="(productCategoryWithSub, i) in productCategoryWithSubList">
                          <v-menu open-on-hover offset-x :key="i">
                            <template v-slot:activator="{ on }">
                              <v-list-item
                                class="ml-n3"
                                :to="`category/${productCategoryWithSub.id}`"
                                v-on="on"
                              >
                                <v-list-item-icon>
                                  <v-icon>mdi-menu-right</v-icon>
                                </v-list-item-icon>
                                <v-list-item-content class="ml-n3">
                                  <v-list-item-title v-text="productCategoryWithSub.name"></v-list-item-title>
                                </v-list-item-content>
                              </v-list-item>
                            </template>
                            <v-card height="450" width="1000">
                              <v-container fluid grid-list-sm class="pa-5">
                                <v-layout row wrap>
                                  <v-flex
                                    xs12
                                    sm12
                                    md3
                                    lg3
                                    :key="i"
                                    v-for="(productSubCategory, i) in productCategoryWithSub.productSubCategories"
                                  >
                                    <v-btn
                                      text
                                      :to="`/product/category/${productCategoryWithSub.id}/subCategory/${productSubCategory.id}/page/1`"
                                    >{{ productSubCategory.name }}</v-btn>
                                  </v-flex>
                                </v-layout>
                              </v-container>
                            </v-card>
                          </v-menu>
                        </template>
                      </v-list-item-group>
                    </v-list>
                  </v-card-text>
                </v-flex>
                <v-flex xs12 sm12 md9 lg9>
                  <v-card-text>
                    <v-carousel cycle height="400" hide-delimiter-background show-arrows-on-hover>
                      <v-carousel-item
                        v-for="(productBannerImage, i) in productBannerImageList"
                        :key="i"
                        :src="productBannerImage.file_path"
                      ></v-carousel-item>
                    </v-carousel>
                  </v-card-text>
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
              <v-card>
                <v-card-title>FEATURED PRODUCTS</v-card-title>
                <v-card-text>
                  <v-flex xs12 sm12 md12 lg12>
                    <v-layout row wrap>
                      <template v-for="(productHome, i) in productHomeList">
                        <v-flex xs12 sm12 md2 lg2 :key="i">
                          <v-hover>
                            <v-card slot-scope="{ hover }" :class="`elevation-${hover ? 12 : 2}`">
                              <v-container>
                                <v-img :src="productHome.file_path" height="150px" />
                              </v-container>

                              <v-card-text>
                                <div class="subtitle-1 black--text">{{ productHome.name }}</div>
                                <div
                                  class="subtitle-1 font-weight-bold black--text"
                                >{{ `&#8369 ${productHome.price}` }}</div>
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
                        </v-flex>
                      </template>
                    </v-layout>
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
                <v-card-title>RECOMMENDED FOR YOU</v-card-title>
                <v-card-text>
                  <v-flex xs12 sm12 md12 lg12>
                    <v-layout row wrap>
                      <v-flex xs12 sm12 md2 lg2>
                        <v-hover v-slot:default="{ hover }">
                          <v-card class="mx-auto" color="grey lighten-4" max-width="600">
                            <v-img
                              :aspect-ratio="16 / 9"
                              src="https://cdn.vuetifyjs.com/images/cards/kitchen.png"
                            >
                              <v-expand-transition>
                                <div
                                  v-if="hover"
                                  class="d-flex transition-fast-in-fast-out grey darken-4 v-card--reveal display-1 white--text"
                                  style="height: 100%;"
                                >P14.99</div>
                              </v-expand-transition>
                            </v-img>
                            <v-card-text class="pt-6" style="position: relative;">
                              <h3
                                class="title font-weight-light orange--text mb-2"
                              >QW cooking utensils</h3>
                              <div
                                class="font-weight-light grey--text body-2 mb-2"
                              >For the perfect meal</div>
                            </v-card-text>
                          </v-card>
                        </v-hover>
                      </v-flex>
                      <v-flex xs12 sm12 md2 lg2>
                        <v-hover v-slot:default="{ hover }">
                          <v-card class="mx-auto" color="grey lighten-4" max-width="600">
                            <v-img
                              :aspect-ratio="16 / 9"
                              src="https://cdn.vuetifyjs.com/images/cards/kitchen.png"
                            >
                              <v-expand-transition>
                                <div
                                  v-if="hover"
                                  class="d-flex transition-fast-in-fast-out grey darken-4 v-card--reveal display-1 white--text"
                                  style="height: 100%;"
                                >P14.99</div>
                              </v-expand-transition>
                            </v-img>
                            <v-card-text class="pt-6" style="position: relative;">
                              <h3
                                class="title font-weight-light orange--text mb-2"
                              >QW cooking utensils</h3>
                              <div
                                class="font-weight-light grey--text body-2 mb-2"
                              >For the perfect meal</div>
                            </v-card-text>
                          </v-card>
                        </v-hover>
                      </v-flex>
                      <v-flex xs12 sm12 md2 lg2>
                        <v-hover v-slot:default="{ hover }">
                          <v-card class="mx-auto" color="grey lighten-4" max-width="600">
                            <v-img
                              :aspect-ratio="16 / 9"
                              src="https://cdn.vuetifyjs.com/images/cards/kitchen.png"
                            >
                              <v-expand-transition>
                                <div
                                  v-if="hover"
                                  class="d-flex transition-fast-in-fast-out grey darken-4 v-card--reveal display-1 white--text"
                                  style="height: 100%;"
                                >P14.99</div>
                              </v-expand-transition>
                            </v-img>
                            <v-card-text class="pt-6" style="position: relative;">
                              <h3
                                class="title font-weight-light orange--text mb-2"
                              >QW cooking utensils</h3>
                              <div
                                class="font-weight-light grey--text body-2 mb-2"
                              >For the perfect meal</div>
                            </v-card-text>
                          </v-card>
                        </v-hover>
                      </v-flex>
                      <v-flex xs12 sm12 md2 lg2>
                        <v-hover v-slot:default="{ hover }">
                          <v-card class="mx-auto" color="grey lighten-4" max-width="600">
                            <v-img
                              :aspect-ratio="16 / 9"
                              src="https://cdn.vuetifyjs.com/images/cards/kitchen.png"
                            >
                              <v-expand-transition>
                                <div
                                  v-if="hover"
                                  class="d-flex transition-fast-in-fast-out grey darken-4 v-card--reveal display-1 white--text"
                                  style="height: 100%;"
                                >P14.99</div>
                              </v-expand-transition>
                            </v-img>
                            <v-card-text class="pt-6" style="position: relative;">
                              <h3
                                class="title font-weight-light orange--text mb-2"
                              >QW cooking utensils</h3>
                              <div
                                class="font-weight-light grey--text body-2 mb-2"
                              >For the perfect meal</div>
                            </v-card-text>
                          </v-card>
                        </v-hover>
                      </v-flex>
                      <v-flex xs12 sm12 md2 lg2>
                        <v-hover v-slot:default="{ hover }">
                          <v-card class="mx-auto" color="grey lighten-4" max-width="600">
                            <v-img
                              :aspect-ratio="16 / 9"
                              src="https://cdn.vuetifyjs.com/images/cards/kitchen.png"
                            >
                              <v-expand-transition>
                                <div
                                  v-if="hover"
                                  class="d-flex transition-fast-in-fast-out grey darken-4 v-card--reveal display-1 white--text"
                                  style="height: 100%;"
                                >P14.99</div>
                              </v-expand-transition>
                            </v-img>
                            <v-card-text class="pt-6" style="position: relative;">
                              <h3
                                class="title font-weight-light orange--text mb-2"
                              >QW cooking utensils</h3>
                              <div
                                class="font-weight-light grey--text body-2 mb-2"
                              >For the perfect meal</div>
                            </v-card-text>
                          </v-card>
                        </v-hover>
                      </v-flex>
                      <v-flex xs12 sm12 md2 lg2>
                        <v-hover v-slot:default="{ hover }">
                          <v-card class="mx-auto" color="grey lighten-4" max-width="600">
                            <v-img
                              :aspect-ratio="16 / 9"
                              src="https://cdn.vuetifyjs.com/images/cards/kitchen.png"
                            >
                              <v-expand-transition>
                                <div
                                  v-if="hover"
                                  class="d-flex transition-fast-in-fast-out grey darken-4 v-card--reveal display-1 white--text"
                                  style="height: 100%;"
                                >P14.99</div>
                              </v-expand-transition>
                            </v-img>
                            <v-card-text class="pt-6" style="position: relative;">
                              <h3
                                class="title font-weight-light orange--text mb-2"
                              >QW cooking utensils</h3>
                              <div
                                class="font-weight-light grey--text body-2 mb-2"
                              >For the perfect meal</div>
                            </v-card-text>
                          </v-card>
                        </v-hover>
                      </v-flex>
                    </v-layout>
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
import { mapState, mapActions } from "vuex";

export default {
  data: () => ({}),

  mounted() {
    this.getProductBannerImageData();
    this.getProductCategoriesDataWithSubCategories();
    this.getProductDataWithLimitOffsetAndFileName({ limit: 6, offset: 0 });
  },

  computed: {
    ...mapState("productBannerImages", ["productBannerImageList"]),
    ...mapState("products", ["productHomeList"]),
    ...mapState("productCategories", ["productCategoryWithSubList"])
  },

  methods: {
    ...mapActions("productCategories", {
      getProductCategoriesDataWithSubCategories: "getDataWithSubCategories"
    }),
    ...mapActions("productBannerImages", {
      getProductBannerImageData: "getData"
    }),
    ...mapActions("products", {
      getProductDataWithLimitOffsetAndFileName:
        "getDataWithLimitOffsetAndFileName"
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
