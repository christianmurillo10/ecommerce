<template>
  <v-container fluid grid-list-sm>
    <v-layout row wrap>
      <v-container class="col-lg-10 offset-lg-1">
        <v-layout row wrap>
          <v-flex xs12 sm3 md3 lg3 class="pr-5">
            <Filters :route-id="routeId" :item-list="productBySearchRelatedCategories" @onRelatedCategoriesChange="onRelatedCategoriesChange" />
          </v-flex>
          <v-flex xs12 sm9 md9 lg9>
            <ItemLists :header="keyword" :items="productBySearchList" :item-count="productBySearchTotalCount" @onPageChange="onPageChange" />
          </v-flex>
        </v-layout>
      </v-container>
    </v-layout>
  </v-container>
</template>

<script>
import Filters from "./components/Filters";
import ItemLists from "./components/ItemLists";
import { mapState, mapActions } from "vuex";

export default {
  components: {
    Filters,
    ItemLists
  },

  data: () => ({
    keyword: "",
    routeId: -1,
    routePage: 0,
    limit: 60,
    offset: 0
  }),

  created() {
    this.initialLoad();
  },

  computed: {
    ...mapState("products", ["productBySearchList", "productBySearchTotalCount", "productBySearchRelatedCategories"]),
  },

  watch: {
    "$route.params.relatedId": function(val) {
      if (!_.isUndefined(val)) this.initialLoad();
    },
    "$route.params.keyword": function(val) {
      if (!_.isUndefined(val)) this.initialLoad();
    },
    "$route.params.page": function(val) {
      if (!_.isUndefined(val) && parseInt(val) !== this.routePage) this.initialLoad();
    }
  },

  methods: {
    ...mapActions("products", { getProductDataBySearchWithRelatedCategories: "getDataBySearchWithRelatedCategories", getProductDataBySearchBySubCategoryIdWithRelatedCategories: "getDataBySearchBySubCategoryIdWithRelatedCategories" }),

    initialLoad() {
      this.keyword = this.$route.params.keyword;
      this.routeId = this.$route.params.relatedId === undefined ? -1 : parseInt(this.$route.params.relatedId);
      this.routePage = parseInt(this.$route.params.page);
      this.offset = this.routePage === 1 ? 0 : (this.routePage - 1) * this.limit;
      if (this.routeId === -1) this.getProductDataBySearchWithRelatedCategories({ keyword: this.keyword, limit: this.limit, offset: this.offset });
      else this.getProductDataBySearchBySubCategoryIdWithRelatedCategories({ sub_category_id: this.routeId, keyword: this.keyword, limit: this.limit, offset: this.offset })
    },

    onRelatedCategoriesChange(id) {
      if (parseInt(this.routeId) !== id) {
        this.$router.push(`/related/${id}/search/${this.keyword}/page/1`);
      }
    },

    onPageChange(page) {
      if (this.routeId === -1) this.$router.push(`/search/${this.keyword}/page/${page}`);
      else this.$router.push(`/related/${this.routeId}/search/${this.keyword}/page/${page}`);
    }
  }
}
</script>