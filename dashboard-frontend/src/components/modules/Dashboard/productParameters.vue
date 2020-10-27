<template>
  <v-layout row wrap>
    <v-flex xs12 sm12 md6 lg6>
      <v-hover>
        <v-card slot-scope="{ hover }" :class="`elevation-${hover ? 12 : 1}`">
          <v-card-title primary-title class="justify-center">
            <div>
              <h4 class="body-2 text-xs-center">Total Brands</h4>
              <h1 class="text-xs-center">{{ productBrandTotalCount }}</h1>
            </div>
          </v-card-title>
          <v-card-actions class="justify-center">
            <v-btn to="/productBrands" block small color="primary">
              Manage
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-hover>
    </v-flex>
    <v-flex xs12 sm12 md6 lg6>
      <v-hover>
        <v-card slot-scope="{ hover }" :class="`elevation-${hover ? 12 : 1}`">
          <v-card-title primary-title class="justify-center">
            <div>
              <h4 class="body-2 text-xs-center">Total Categories</h4>
              <h1 class="text-xs-center">{{ productCategoryTotalCount }}</h1>
            </div>
          </v-card-title>
          <v-card-actions class="justify-center">
            <v-btn to="/productCategories" block small color="primary">
              Manage
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-hover>
    </v-flex>
    <v-flex xs12 sm12 md6 lg6>
      <v-hover>
        <v-card slot-scope="{ hover }" :class="`elevation-${hover ? 12 : 1}`">
          <v-card-title primary-title class="justify-center">
            <div>
              <h4 class="body-2 text-xs-center">Total Sub-Categories</h4>
              <h1 class="text-xs-center">{{ productSubCategoryTotalCount }}</h1>
            </div>
          </v-card-title>
          <v-card-actions class="justify-center">
            <v-btn to="/productSubCategories" block small color="primary">
              Manage
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-hover>
    </v-flex>
    <v-flex xs12 sm12 md6 lg6>
      <v-hover>
        <v-card slot-scope="{ hover }" :class="`elevation-${hover ? 12 : 1}`">
          <v-card-title primary-title class="justify-center">
            <div>
              <h4 class="body-2 text-xs-center">Total Sub Sub-Categories</h4>
              <h1 class="text-xs-center">
                {{ productSubSubCategoryTotalCount }}
              </h1>
            </div>
          </v-card-title>
          <v-card-actions class="justify-center">
            <v-btn to="/productSubSubCategories" block small color="primary">
              Manage
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-hover>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  data: () => ({}),

  mounted() {
    this.getProductBrandTotalCount();
    this.getProductCategoryTotalCount();
    this.getProductSubCategoryTotalCount();
    this.getProductSubSubCategoryTotalCount();
  },

  computed: {
    ...mapState("productBrands", ["productBrandTotalCount"]),
    ...mapState("productCategories", ["productCategoryTotalCount"]),
    ...mapState("productSubCategories", ["productSubCategoryTotalCount"]),
    ...mapState("productSubSubCategories", ["productSubSubCategoryTotalCount"]),
  },

  methods: {
    ...mapActions("productBrands", {
      getProductBrandTotalCount: "getTotalCount",
    }),
    ...mapActions("productCategories", {
      getProductCategoryTotalCount: "getTotalCount",
    }),
    ...mapActions("productSubCategories", {
      getProductSubCategoryTotalCount: "getTotalCount",
    }),
    ...mapActions("productSubSubCategories", {
      getProductSubSubCategoryTotalCount: "getTotalCount",
    }),
  },
};
</script>
