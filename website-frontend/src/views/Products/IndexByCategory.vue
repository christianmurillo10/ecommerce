<template>
  <v-container fluid grid-list-sm>
    <v-layout row wrap>
      <v-container class="col-lg-10 offset-lg-1">
        <v-flex xs12 sm12 md12 lg12>
          <v-carousel cycle height="200" hide-delimiter-background show-arrows-on-hover>
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
          <v-breadcrumbs :items="breadcrumbs">
            <template v-slot:item="{ item }">
              <v-breadcrumbs-item
                :to="item.to"
                :disabled="item.disabled"
              >{{ item.text.toUpperCase() }}</v-breadcrumbs-item>
            </template>
            <template v-slot:divider>
              <v-icon>mdi-forward</v-icon>
            </template>
          </v-breadcrumbs>
        </v-flex>
      </v-container>

      <v-container class="col-lg-10 offset-lg-1">
        <v-layout row wrap>
          <v-flex xs12 sm12 md12 lg12>
            <v-card>
              <v-layout row wrap justify-center>
                <v-card-title class="headline font-weight-bold">{{ header }}</v-card-title>
                <v-card-text>
                  <v-flex xs12 sm12 md12 lg12>
                    <v-layout row wrap justify-center>
                      <v-slide-group class="px-4" show-arrows>
                        <template v-for="(productSubCategory, i) in productSubCategoryList">
                          <v-flex xs12 sm12 md2 lg2 :key="i">
                            <v-slide-item>
                              <v-hover>
                                <v-card
                                  slot-scope="{ hover }"
                                  :class="`elevation-${hover ? 12 : 2}`"
                                  :to="`/category/${categoryId}/subCategory/${productSubCategory.id}/page/1`"
                                  class="grey lighten-4"
                                  width="340"
                                >
                                  <v-card-title primary-title class="justify-center">
                                    <h4
                                      class="headline text-xs-center"
                                    >{{ productSubCategory.name }}</h4>
                                  </v-card-title>
                                </v-card>
                              </v-hover>
                            </v-slide-item>
                          </v-flex>
                        </template>
                      </v-slide-group>
                    </v-layout>
                  </v-flex>
                </v-card-text>
              </v-layout>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>

      <v-container class="col-lg-10 offset-lg-1">
        <v-layout row wrap>
          <v-flex xs12 sm12 md12 lg12>
            <v-card>
              <v-card-text>
                <v-layout row wrap>
                  <div class="headline">
                    Results for
                    <b>{{ header }}</b>
                    ({{ productByCategoryTotalCount }})
                  </div>
                  <v-spacer></v-spacer>
                  <div class="text-center">
                    <v-pagination
                      v-model="pagination.page"
                      :length="pagination.length"
                      :total-visible="pagination.visible"
                      :disabled="pagination.length === 1 ? true : false"
                      @input="onPageChange"
                    ></v-pagination>
                  </div>
                </v-layout>

                <v-layout row wrap>
                  <template v-for="(productByCategory, i) in productByCategoryList">
                    <v-flex xs12 sm12 md3 lg3 :key="i">
                      <v-container>
                        <v-hover>
                          <v-card
                            slot-scope="{ hover }"
                            :class="`elevation-${hover ? 12 : 2}`"
                            :to="`/product/${productByCategory.id}`"
                          >
                            <v-container>
                              <v-img
                                :src="productByCategory.file_path"
                                height="250px"
                                max-height="250px"
                                contain
                              />
                            </v-container>

                            <v-card-text>
                              <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                  <div
                                    v-on="on"
                                    class="subtitle-1 black--text"
                                  >{{ truncateText(productByCategory.name, 35) }}</div>
                                </template>
                                <span>{{ productByCategory.name }}</span>
                              </v-tooltip>
                              <div
                                class="subtitle-1 font-weight-bold black--text"
                              >{{ `&#8369 ${productByCategory.price}` }}</div>

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
                      </v-container>
                    </v-flex>
                  </template>
                </v-layout>

                <v-layout row wrap>
                  <v-spacer></v-spacer>
                  <div class="text-center">
                    <v-pagination
                      v-model="pagination.page"
                      :length="pagination.length"
                      :total-visible="pagination.visible"
                      :disabled="pagination.length === 1 ? true : false"
                      @input="onPageChange"
                    ></v-pagination>
                  </div>
                </v-layout>
              </v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-layout>
  </v-container>
</template>

<script>
import { mapState, mapActions } from "vuex";
import Mixins from "@/helpers/Mixins.js";

export default {
  mixins: [Mixins],

  data: () => ({
    header: null,
    categoryId: null,
    breadcrumbs: [
      {
        text: "Home",
        disabled: false,
        to: "/"
      },
      {
        text: "Sub Category",
        disabled: true,
        to: "/subCategory/:subCategoryId/page/1"
      }
    ],
    pagination: {
      limit: 20,
      offset: 0,
      page: 1,
      length: 1,
      visible: 7
    }
  }),

  mounted() {
    this.getProductBannerImageData();
    this.loadByRouteId();
  },

  computed: {
    ...mapState("productBannerImages", ["productBannerImageList"]),
    ...mapState("productCategories", ["productCategoryDataById"]),
    ...mapState("productSubCategories", ["productSubCategoryList"]),
    ...mapState("products", [
      "productByCategoryList",
      "productByCategoryTotalCount"
    ])
  },

  watch: {
    "$route.params.id": function() {
      this.loadByRouteId();
    },
    productCategoryDataById(val) {
      this.header = val.name.toUpperCase();
      this.breadcrumbs[1].text = val.name;
    },
    productByCategoryTotalCount(val) {
      this.pagination.length =
        val <= this.pagination.limit ? 1 : this.computePaginationLength(val);
    }
  },

  methods: {
    ...mapActions("productBannerImages", {
      getProductBannerImageData: "getData"
    }),
    ...mapActions("productCategories", {
      getProductCategoryDataById: "getDataById"
    }),
    ...mapActions("productSubCategories", {
      getProductSubCategoryDataByProductCategoryId: "getDataByProductCategoryId"
    }),
    ...mapActions("products", {
      getProductDataByProductCategoryIdWithLimitOffsetAndFileName:
        "getDataByProductCategoryIdWithLimitOffsetAndFileName"
    }),

    loadByRouteId() {
      this.categoryId = this.$route.params.id;
      this.getProductSubCategoryDataByProductCategoryId(this.categoryId);
      this.getProductCategoryDataById(this.categoryId);
      this.getProductDataByProductCategoryIdWithLimitOffsetAndFileName({
        productCategoryId: this.categoryId,
        limit: this.pagination.limit,
        offset: this.pagination.offset
      });
    },

    onPageChange() {
      this.pagination.offset =
        this.pagination.page === 1
          ? 0
          : this.pagination.limit * this.pagination.page;
      this.getProductDataByProductCategoryIdWithLimitOffsetAndFileName({
        productCategoryId: this.categoryId,
        limit: this.pagination.limit,
        offset: this.pagination.offset
      });
    },

    computePaginationLength(totalCount) {
      let newPageLength = totalCount / this.pagination.limit;
      let finalPageLength =
        Number.isInteger(newPageLength) === true
          ? newPageLength
          : Math.trunc(newPageLength) + 1;
      return finalPageLength;
    }
  }
};
</script>
