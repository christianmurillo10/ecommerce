<template>
  <v-container fluid grid-list-sm>
    <v-layout row wrap>
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

      <v-container class="col-lg-10 offset-lg-1">
        <v-layout row wrap>
          <v-flex xs12 sm12 md12 lg12>
            <v-card>
              <v-card-title>{{ header }}</v-card-title>
              <v-card-text>
                <v-layout row wrap>
                  <template v-for="(productSubCategory, i) in productSubCategoryList">
                    <v-flex xs12 sm12 md2 lg2 :key="i">
                      <v-hover>
                        <v-card
                          slot-scope="{ hover }"
                          :class="`elevation-${hover ? 12 : 2}`"
                          :to="`/product/category/${categoryId}/subCategory/${productSubCategory.id}`"
                        >
                          <v-card-title primary-title class="justify-center">
                            <h4 class="headline text-xs-center">{{ productSubCategory.name }}</h4>
                          </v-card-title>
                        </v-card>
                      </v-hover>
                    </v-flex>
                  </template>
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

export default {
  data: () => ({
    header: null,
    categoryId: null
  }),

  mounted() {
    this.getProductBannerImageData();
    this.loadByRouteId();
  },

  computed: {
    ...mapState("productBannerImages", ["productBannerImageList"]),
    ...mapState("productCategories", ["productCategoryDataById"]),
    ...mapState("productSubCategories", ["productSubCategoryList"])
  },

  watch: {
    "$route.params.id": function() {
      this.loadByRouteId();
    },
    productCategoryDataById(val) {
      this.header = val.name;
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

    loadByRouteId() {
      this.categoryId = this.$route.params.id;
      this.getProductSubCategoryDataByProductCategoryId(this.categoryId);
      this.getProductCategoryDataById(this.categoryId);
    }
  }
};
</script>
