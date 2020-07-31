<template>
  <v-layout row wrap>
    <v-container>
      <v-layout row wrap>
        <v-flex xs12 sm3 md3 lg3 class="pr-5">
          <Filters
            :route-id="routeId"
            :item-list="productSubCategoryList"
            @onRelatedCategoriesChange="onRelatedCategoriesChange"
          />
        </v-flex>
        <v-flex xs12 sm9 md9 lg9>
          <ItemLists
            :header="productSubCategoryDataById.name"
            :items="productBySubCategoryList"
            :item-count="productBySubCategoryTotalCount"
            @onPageChange="onPageChange"
          />
        </v-flex>
      </v-layout>
    </v-container>
  </v-layout>
</template>

<script>
import Filters from "./components/Filters";
import ItemLists from "./components/ItemLists";
import { mapState, mapActions } from "vuex";

export default {
  components: {
    Filters,
    ItemLists,
  },

  data: () => ({
    routeId: 0,
    routePage: 0,
    limit: 60,
    offset: 0,
  }),

  mounted() {
    this.initialLoad();
  },

  computed: {
    ...mapState("products", [
      "productBySubCategoryList",
      "productBySubCategoryTotalCount",
    ]),
    ...mapState("productSubCategories", [
      "productSubCategoryList",
      "productSubCategoryDataById",
    ]),
  },

  watch: {
    "$route.params.id": function(val) {
      if (!_.isUndefined(val)) this.initialLoad();
    },
    "$route.params.page": function(val) {
      if (!_.isUndefined(val) && parseInt(val) !== this.routePage)
        this.initialLoad();
    },
  },

  methods: {
    ...mapActions("products", {
      getProductDataByProductSubCategoryIdWithLimitOffset:
        "getDataByProductSubCategoryIdWithLimitOffset",
    }),
    ...mapActions("productSubCategories", {
      getProductSubCategoryDataByProductCategoryId:
        "getDataByProductCategoryId",
      getProductSubCategoryDataById: "getDataById",
    }),

    initialLoad() {
      this.routeId = parseInt(this.$route.params.id);
      this.routePage = parseInt(this.$route.params.page);
      this.offset =
        this.routePage === 1 ? 0 : (this.routePage - 1) * this.limit;
      this.getProductDataByProductSubCategoryIdWithLimitOffset({
        sub_category_id: this.routeId,
        limit: this.limit,
        offset: this.offset,
      });
      this.getProductSubCategoryDataById(this.routeId);
      this.getProductSubCategoryDataByProductCategoryId(
        this.$route.params.categoryId
      );
    },

    onRelatedCategoriesChange(id) {
      if (parseInt(this.routeId) !== id) {
        this.$router.push(
          `/category/${this.$route.params.categoryId}/sub-category/${id}/page/1`
        );
      }
    },

    onPageChange(page) {
      this.$router.push(
        `/category/${this.$route.params.categoryId}/sub-category/${this.routeId}/page/${page}`
      );
    },
  },
};
</script>
