<template>
  <v-container class="col-lg-10 offset-lg-1">
    <v-layout row wrap>
      <v-flex xs12 sm12 md12 lg12>
        <v-container>
          <v-layout row wrap>
            <v-flex xs12 sm12 md3 lg3>
              <v-container>
                <v-card>
                  <v-card-title>FILTERS</v-card-title>

                  <v-divider class="mx-4"></v-divider>
                  <v-card-title>Related Categories:</v-card-title>
                  <v-card-text>
                    <v-list rounded dense>
                      <v-list-item-group color="primary">
                        <template v-for="(productSubCategory, i) in productSubCategoryList">
                          <v-list-item
                            :key="i"
                            :to="`/category/${categoryId}/subCategory/${productSubCategory.id}/page/${pagination.page}`"
                            active-class="highlighted"
                            :class="productSubCategory.id === subCategoryId ? 'highlighted' : ''"
                          >
                            <v-list-item-content>
                              <v-list-item-title v-text="productSubCategory.name"></v-list-item-title>
                            </v-list-item-content>
                          </v-list-item>
                        </template>
                      </v-list-item-group>
                    </v-list>
                  </v-card-text>

                  <v-divider class="mx-4"></v-divider>
                  <v-card-title>Rating</v-card-title>
                  <v-card-text>
                    <v-container>
                      <v-row align="center" class="mx-0">
                        <v-rating :value="5" color="amber" dense half-increments readonly size="14"></v-rating>
                      </v-row>
                      <v-row align="center" class="mx-0">
                        <v-rating :value="4" color="amber" dense half-increments readonly size="14"></v-rating>
                        <div class="grey--text">&amp; Up</div>
                      </v-row>
                      <v-row align="center" class="mx-0">
                        <v-rating :value="3" color="amber" dense half-increments readonly size="14"></v-rating>
                        <div class="grey--text">&amp; Up</div>
                      </v-row>
                      <v-row align="center" class="mx-0">
                        <v-rating :value="2" color="amber" dense half-increments readonly size="14"></v-rating>
                        <div class="grey--text">&amp; Up</div>
                      </v-row>
                      <v-row align="center" class="mx-0">
                        <v-rating :value="1" color="amber" dense half-increments readonly size="14"></v-rating>
                        <div class="grey--text">&amp; Up</div>
                      </v-row>
                    </v-container>
                  </v-card-text>

                  <v-divider class="mx-4"></v-divider>
                  <v-card-title>Price Range</v-card-title>
                  <v-card-text>
                    <v-flex xs12>
                      <v-form @submit.prevent="login" ref="form" lazy-validation>
                        <v-container grid-list-md>
                          <v-layout wrap>
                            <v-flex xs12 sm12 md6 lg6>
                              <v-text-field
                                v-model="price_from"
                                label="Min"
                                required
                                type="number"
                                outlined
                                dense
                              ></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm12 md6 lg6>
                              <v-text-field
                                v-model="price_to"
                                label="Max"
                                required
                                type="number"
                                outlined
                                dense
                              ></v-text-field>
                            </v-flex>
                          </v-layout>
                        </v-container>
                      </v-form>
                    </v-flex>
                  </v-card-text>
                </v-card>
              </v-container>
            </v-flex>
            <v-flex xs12 sm12 md9 lg9>
              <v-container>
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
                <v-flex xs12 sm12 md12 lg12>
                  <v-container>
                    <v-layout row wrap>
                      <div class="headline">
                        Results for
                        <b>{{ itemResult }}</b>
                        ({{ productBySubCategoryTotalCount }})
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
                  </v-container>
                </v-flex>

                <v-flex xs12 sm12 md12 lg12>
                  <v-layout row wrap>
                    <template v-for="(productBySubCategory, i) in productBySubCategoryList">
                      <v-flex xs12 sm12 md3 lg3 :key="i">
                        <v-container>
                          <v-hover>
                            <v-card
                              slot-scope="{ hover }"
                              :class="`elevation-${hover ? 12 : 2}`"
                              :to="`/product/${productBySubCategory.id}`"
                            >
                              <v-container>
                                <v-img :src="productBySubCategory.file_path" height="250px" />
                              </v-container>

                              <v-card-text>
                                <v-tooltip bottom>
                                  <template v-slot:activator="{ on }">
                                    <div
                                      v-on="on"
                                      class="subtitle-1 black--text"
                                    >{{ truncateText(productBySubCategory.name, 29) }}</div>
                                  </template>
                                  <span>{{ productBySubCategory.name }}</span>
                                </v-tooltip>
                                <div
                                  class="subtitle-1 font-weight-bold black--text"
                                >{{ `&#8369 ${productBySubCategory.price}` }}</div>

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
                </v-flex>
                <v-flex xs12 sm12 md12 lg12>
                  <v-container>
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
                  </v-container>
                </v-flex>
              </v-container>
            </v-flex>
          </v-layout>
        </v-container>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapState, mapActions } from "vuex";
import Mixins from "@/helpers/Mixins.js";

export default {
  mixins: [Mixins],

  data: () => ({
    categoryHeader: null,
    categoryId: null,
    subCategoryId: null,
    itemResult: null,
    itemCount: 0,
    breadcrumbs: [
      {
        text: "Home",
        disabled: false,
        to: "/"
      },
      {
        text: "Category",
        disabled: false,
        to: "/category/:categoryId/page/1"
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
    },

    price_from: "",
    price_to: ""
  }),

  mounted() {
    this.loadByRouteId();
  },

  computed: {
    ...mapState("productCategories", ["productCategoryDataById"]),
    ...mapState("productSubCategories", [
      "productSubCategoryList",
      "productSubCategoryDataById"
    ]),
    ...mapState("products", [
      "productBySubCategoryList",
      "productBySubCategoryTotalCount"
    ])
  },

  watch: {
    "$route.params.categoryId": function() {
      this.loadByRouteId();
    },
    "$route.params.subCategoryId": function() {
      this.loadByRouteId();
    },
    "$route.params.page": function() {
      this.loadByRouteId();
    },
    productCategoryDataById(val) {
      this.categoryHeader = val.name;
      this.breadcrumbs[1].text = val.name;
      this.breadcrumbs[1].to = `/category/${val.id}/page/1`;
    },
    productSubCategoryDataById(val) {
      this.breadcrumbs[2].text = val.name;
      this.itemResult = val.name;
    },
    productBySubCategoryTotalCount(val) {
      this.pagination.length =
        val <= this.pagination.limit ? 1 : this.computePaginationLength(val);
    }
  },

  methods: {
    ...mapActions("productCategories", {
      getProductCategoryDataById: "getDataById"
    }),
    ...mapActions("productSubCategories", {
      getProductSubCategoryDataByProductCategoryId:
        "getDataByProductCategoryId",
      getProductSubCategoryDataById: "getDataById"
    }),
    ...mapActions("products", {
      getProductDataByProductSubCategoryIdWithLimitOffsetAndFileName:
        "getDataByProductSubCategoryIdWithLimitOffsetAndFileName"
    }),

    loadByRouteId() {
      this.categoryId = this.$route.params.categoryId;
      this.subCategoryId = this.$route.params.subCategoryId;
      this.pagination.page = parseInt(this.$route.params.page);
      this.getProductSubCategoryDataByProductCategoryId(this.categoryId);
      this.getProductCategoryDataById(this.categoryId);
      this.getProductSubCategoryDataById(this.subCategoryId);
      this.getProductDataByProductSubCategoryIdWithLimitOffsetAndFileName({
        productSubCategoryId: this.subCategoryId,
        limit: this.pagination.limit,
        offset: this.pagination.offset
      });
    },

    onPageChange() {
      this.pagination.offset =
        this.pagination.page === 1
          ? 0
          : this.pagination.limit * this.pagination.page;
      this.getProductDataByProductSubCategoryIdWithLimitOffsetAndFileName({
        productSubCategoryId: this.subCategoryId,
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
