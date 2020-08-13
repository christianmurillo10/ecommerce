<template>
  <v-layout row wrap>
    <v-flex xs12 sm3 md3 lg3>
      <v-container>
        <Filters
          :related-id="relatedId"
          :item-list="productBySearchRelatedCategories"
          @onRelatedCategoriesChange="onRelatedCategoriesChange"
        />
      </v-container>
    </v-flex>
    <v-flex xs12 sm9 md9 lg9>
      <v-container>
        <ItemLists
          :header="keyword"
          :items="productBySearchList"
          :item-count="productBySearchTotalCount"
          @onPageChange="onPageChange"
        />
      </v-container>
    </v-flex>
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
    keyword: "",
    relatedId: -1,
    routePage: 0,
    limit: 60,
    offset: 0,
  }),

  created() {
    this.initialLoad();
  },

  computed: {
    ...mapState("products", [
      "productBySearchList",
      "productBySearchTotalCount",
      "productBySearchRelatedCategories",
    ]),
  },

  watch: {
    "$route.query.related": function(val) {
      if (!_.isUndefined(val)) this.initialLoad();
    },
    "$route.query.keyword": function(val) {
      if (!_.isUndefined(val)) this.initialLoad();
    },
    "$route.query.page": function(val) {
      if (!_.isUndefined(val) && parseInt(val) !== this.routePage)
        this.initialLoad();
    },
  },

  methods: {
    ...mapActions("products", {
      getProductDataBySearchWithRelatedCategories:
        "getDataBySearchWithRelatedCategories",
      getProductDataBySearchBySubCategoryIdWithRelatedCategories:
        "getDataBySearchBySubCategoryIdWithRelatedCategories",
    }),

    initialLoad() {
      this.keyword = _.isUndefined(this.$route.query.keyword)
        ? ""
        : this.$route.query.keyword;
      this.relatedId = _.isUndefined(this.$route.query.related)
        ? -1
        : parseInt(this.$route.query.related);
      this.routePage = _.isUndefined(this.$route.query.page)
        ? 1
        : parseInt(this.$route.query.page);
      this.offset =
        this.routePage === 1 ? 0 : (this.routePage - 1) * this.limit;
      if (this.relatedId === -1)
        this.getProductDataBySearchWithRelatedCategories({
          keyword: this.keyword,
          limit: this.limit,
          offset: this.offset,
        });
      else
        this.getProductDataBySearchBySubCategoryIdWithRelatedCategories({
          sub_category_id: this.relatedId,
          keyword: this.keyword,
          limit: this.limit,
          offset: this.offset,
        });
    },

    onRelatedCategoriesChange(id) {
      if (parseInt(this.relatedId) !== id) {
        this.$router.push({
          path: `/search`,
          query: { keyword: this.keyword, related: id },
        });
      }
    },

    onPageChange(page) {
      if (this.relatedId === -1)
        this.$router.push({
          path: `/search`,
          query: { keyword: this.keyword, page: page },
        });
      else
        this.$router.push({
          path: `/search`,
          query: { keyword: this.keyword, related: this.relatedId, page: page },
        });
    },
  },
};
</script>
