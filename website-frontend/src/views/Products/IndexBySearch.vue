<template>
  <v-layout row wrap>
    <v-flex xs12 sm12 md12 lg12>
      <v-container>
        <v-layout row wrap>
          <v-flex xs12 sm12 md3 lg3>
            <v-container>
              <v-card>
                <v-card-title>FILTERS</v-card-title>

                <v-divider class="mx-4"></v-divider>
                <v-card-title>Rating</v-card-title>
                <v-card-text>
                  <v-container>
                    <v-row align="center" class="mx-0">
                      <v-rating
                        :value="5"
                        color="amber"
                        dense
                        half-increments
                        readonly
                        size="14"
                      ></v-rating>
                    </v-row>
                    <v-row align="center" class="mx-0">
                      <v-rating
                        :value="4"
                        color="amber"
                        dense
                        half-increments
                        readonly
                        size="14"
                      ></v-rating>
                      <div class="grey--text">&amp; Up</div>
                    </v-row>
                    <v-row align="center" class="mx-0">
                      <v-rating
                        :value="3"
                        color="amber"
                        dense
                        half-increments
                        readonly
                        size="14"
                      ></v-rating>
                      <div class="grey--text">&amp; Up</div>
                    </v-row>
                    <v-row align="center" class="mx-0">
                      <v-rating
                        :value="2"
                        color="amber"
                        dense
                        half-increments
                        readonly
                        size="14"
                      ></v-rating>
                      <div class="grey--text">&amp; Up</div>
                    </v-row>
                    <v-row align="center" class="mx-0">
                      <v-rating
                        :value="1"
                        color="amber"
                        dense
                        half-increments
                        readonly
                        size="14"
                      ></v-rating>
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
                <v-container>
                  <v-layout row wrap>
                    <div class="headline">
                      Results for
                      <b>{{ keyword }}</b>
                      ({{ productBySearchTotalCount }})
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
                  <template v-for="(productBySearch, i) in productBySearchList">
                    <v-flex xs12 sm12 md3 lg3 :key="i">
                      <v-container>
                        <v-hover>
                          <v-card
                            slot-scope="{ hover }"
                            :class="`elevation-${hover ? 12 : 2}`"
                            :to="`/product/${productBySearch.id}`"
                          >
                            <v-container>
                              <v-img
                                :src="productBySearch.file_path"
                                height="250px"
                                max-height="250px"
                                contain
                              />
                            </v-container>

                            <v-card-text>
                              <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                  <div v-on="on" class="subtitle-1 black--text">
                                    {{ truncateText(productBySearch.name, 29) }}
                                  </div>
                                </template>
                                <span>{{ productBySearch.name }}</span>
                              </v-tooltip>
                              <div
                                class="subtitle-1 font-weight-bold black--text"
                              >
                                {{ `&#8369; ${productBySearch.price}` }}
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
</template>

<script>
import { mapState, mapActions } from "vuex";
import Mixins from "@/helpers/Mixins.js";

export default {
  mixins: [Mixins],

  data: () => ({
    keyword: null,
    pagination: {
      limit: 20,
      offset: 0,
      page: 1,
      length: 1,
      visible: 7,
    },

    price_from: "",
    price_to: "",
  }),

  mounted() {
    this.loadByRouteId();
  },

  computed: {
    ...mapState("products", [
      "productBySearchList",
      "productBySearchTotalCount",
    ]),
  },

  watch: {
    "$route.params.keyword": function() {
      this.loadByRouteId();
    },
    "$route.params.page": function() {
      this.loadByRouteId();
    },
    productBySearchTotalCount(val) {
      this.pagination.length =
        val <= this.pagination.limit ? 1 : this.computePaginationLength(val);
    },
  },

  methods: {
    ...mapActions("products", {
      getProductDataBySearchWithLimitOffsetAndFileName:
        "getDataBySearchWithLimitOffsetAndFileName",
    }),

    loadByRouteId() {
      this.keyword = this.$route.params.keyword;
      this.pagination.page = parseInt(this.$route.params.page);
      this.getProductDataBySearchWithLimitOffsetAndFileName({
        keyword: this.keyword,
        limit: this.pagination.limit,
        offset: this.pagination.offset,
      });
    },

    onPageChange() {
      this.pagination.offset =
        this.pagination.page === 1
          ? 0
          : this.pagination.limit * this.pagination.page;
      this.getProductDataBySearchWithLimitOffsetAndFileName({
        keyword: this.keyword,
        limit: this.pagination.limit,
        offset: this.pagination.offset,
      });
    },

    computePaginationLength(totalCount) {
      let newPageLength = totalCount / this.pagination.limit;
      let finalPageLength =
        Number.isInteger(newPageLength) === true
          ? newPageLength
          : Math.trunc(newPageLength) + 1;
      return finalPageLength;
    },
  },
};
</script>
