<template>
  <v-layout row wrap>
    <v-flex xs12 sm3 md3 lg3>
      <v-container>
        <Filters
          :related-id="relatedId"
          :item-list="filterItemList"
          @onRelatedCategoriesChange="onRelatedCategoriesChange"
        />
      </v-container>
    </v-flex>
    <v-flex xs12 sm9 md9 lg9>
      <v-container>
        <ItemLists
          :header="itemHeader"
          :items="itemList"
          :item-count="itemTotalCount"
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
    categoryId: null,
    subCategoryId: null,
    subSubCategoryId: null,
    relatedId: 0,
    routePage: 0,
    limit: 60,
    offset: 0,
    productFilterItemList: [],
    productItemData: "",
    productItemList: [],
    productItemTotalCount: 0,
  }),

  mounted() {
    this.initialLoad();
  },

  computed: {
    ...mapState("products", [
      "productList",
      "productTotalCount",
      "productByCategoryList",
      "productByCategoryTotalCount",
      "productBySubCategoryList",
      "productBySubCategoryTotalCount",
      "productBySubSubCategoryList",
      "productBySubSubCategoryTotalCount",
    ]),
    ...mapState("productCategories", [
      "productCategoryList",
      "productCategoryDataById",
    ]),
    ...mapState("productSubCategories", [
      "productSubCategoryList",
      "productSubCategoryDataById",
    ]),
    ...mapState("productSubSubCategories", [
      "productSubSubCategoryList",
      "productSubSubCategoryDataById",
    ]),
    filterItemList() {
      this.setItemsByRouteQuery();
      return this.productFilterItemList;
    },
    itemHeader() {
      this.setItemsByRouteQuery();
      return this.productItemData.name;
    },
    itemList() {
      this.setItemsByRouteQuery();
      return this.productItemList;
    },
    itemTotalCount() {
      this.setItemsByRouteQuery();
      return this.productItemTotalCount;
    },
  },

  watch: {
    "$route.query.category": function(val) {
      if (!_.isUndefined(val)) this.initialLoad();
    },
    "$route.query.subCategory": function(val) {
      if (!_.isUndefined(val)) this.initialLoad();
    },
    "$route.query.subSubCategory": function(val) {
      if (!_.isUndefined(val)) this.initialLoad();
    },
    "$route.query.page": function(val) {
      if (!_.isUndefined(val) && parseInt(val) !== this.routePage)
        this.initialLoad();
    },
  },

  methods: {
    ...mapActions("products", {
      getProductDataWithLimitOffset: "getDataWithLimitOffset",
      getProductDataByProductCategoryIdWithLimitOffset:
        "getDataByProductCategoryIdWithLimitOffset",
      getProductDataByProductSubCategoryIdWithLimitOffset:
        "getDataByProductSubCategoryIdWithLimitOffset",
      getProductDataByProductSubSubCategoryIdWithLimitOffset:
        "getDataByProductSubSubCategoryIdWithLimitOffset",
    }),
    ...mapActions("productCategories", {
      getProductCategoryData: "getData",
      getProductCategoryDataById: "getDataById",
    }),
    ...mapActions("productSubCategories", {
      getProductSubCategoryDataByProductCategoryId:
        "getDataByProductCategoryId",
      getProductSubCategoryDataById: "getDataById",
    }),
    ...mapActions("productSubSubCategories", {
      getProductSubSubCategoryDataByProductSubCategoryId:
        "getDataByProductSubCategoryId",
      getProductSubSubCategoryDataById: "getDataById",
    }),

    initialLoad() {
      this.routePage = _.isUndefined(this.$route.query.page)
        ? 1
        : parseInt(this.$route.query.page);
      this.offset =
        this.routePage === 1 ? 0 : (this.routePage - 1) * this.limit;

      if (
        !_.isUndefined(this.$route.query.category) &&
        !_.isUndefined(this.$route.query.subCategory) &&
        !_.isUndefined(this.$route.query.subSubCategory)
      ) {
        this.categoryId = parseInt(this.$route.query.category);
        this.subCategoryId = parseInt(this.$route.query.subCategory);
        this.subSubCategoryId = parseInt(this.$route.query.subSubCategory);
        this.relatedId = this.subSubCategoryId;
        this.getProductDataByProductSubSubCategoryIdWithLimitOffset({
          sub_sub_category_id: this.relatedId,
          limit: this.limit,
          offset: this.offset,
        });
        this.getProductSubSubCategoryDataById(this.relatedId);
        this.getProductSubSubCategoryDataByProductSubCategoryId(
          this.$route.query.subCategory
        );
      } else if (
        !_.isUndefined(this.$route.query.category) &&
        !_.isUndefined(this.$route.query.subCategory)
      ) {
        this.categoryId = parseInt(this.$route.query.category);
        this.subCategoryId = parseInt(this.$route.query.subCategory);
        this.relatedId = this.subCategoryId;
        this.getProductDataByProductSubCategoryIdWithLimitOffset({
          sub_category_id: this.relatedId,
          limit: this.limit,
          offset: this.offset,
        });
        this.getProductSubCategoryDataById(this.relatedId);
        this.getProductSubCategoryDataByProductCategoryId(
          this.$route.query.category
        );
      } else if (!_.isUndefined(this.$route.query.category)) {
        this.categoryId = parseInt(this.$route.query.category);
        this.relatedId = this.categoryId;
        this.getProductDataByProductCategoryIdWithLimitOffset({
          category_id: this.relatedId,
          limit: this.limit,
          offset: this.offset,
        });
        this.getProductCategoryDataById(this.relatedId);
        this.getProductCategoryData();
      } else {
        this.getProductDataWithLimitOffset({
          limit: this.limit,
          offset: this.offset,
        });
        this.getProductCategoryData();
      }
    },

    setItemsByRouteQuery() {
      if (
        !_.isUndefined(this.$route.query.category) &&
        !_.isUndefined(this.$route.query.subCategory) &&
        !_.isUndefined(this.$route.query.subSubCategory)
      ) {
        this.productFilterItemList = this.productSubSubCategoryList;
        this.productItemData = this.productSubSubCategoryDataById;
        this.productItemList = this.productBySubSubCategoryList;
        this.productItemTotalCount = this.productBySubSubCategoryTotalCount;
      } else if (
        !_.isUndefined(this.$route.query.category) &&
        !_.isUndefined(this.$route.query.subCategory)
      ) {
        this.productFilterItemList = this.productSubCategoryList;
        this.productItemData = this.productSubCategoryDataById;
        this.productItemList = this.productBySubCategoryList;
        this.productItemTotalCount = this.productBySubCategoryTotalCount;
      } else if (!_.isUndefined(this.$route.query.category)) {
        this.productFilterItemList = this.productCategoryList;
        this.productItemData = this.productCategoryDataById;
        this.productItemList = this.productByCategoryList;
        this.productItemTotalCount = this.productByCategoryTotalCount;
      } else {
        this.productFilterItemList = this.productCategoryList;
        this.productItemData = { name: "All" };
        this.productItemList = this.productList;
        this.productItemTotalCount = this.productTotalCount;
      }
    },

    onRelatedCategoriesChange(id) {
      if (parseInt(this.relatedId) !== id) {
        let query;

        if (
          !_.isNull(this.categoryId) &&
          !_.isNull(this.subCategoryId) &&
          !_.isNull(this.subSubCategoryId)
        ) {
          query = {
            category: this.categoryId,
            subCategory: this.subCategoryId,
            subSubCategory: id,
          };
        } else if (
          !_.isNull(this.categoryId) &&
          !_.isNull(this.subCategoryId)
        ) {
          query = { category: this.categoryId, subCategory: id };
        } else if (!_.isNull(this.categoryId)) {
          query = { category: id };
        } else {
          query = { category: id };
        }

        this.$router.push({ path: `/products`, query: query });
      }
    },

    onPageChange(page) {
      let query;

      if (
        !_.isNull(this.categoryId) &&
        !_.isNull(this.subCategoryId) &&
        !_.isNull(this.subSubCategoryId)
      ) {
        query = {
          category: this.categoryId,
          subCategory: this.subCategoryId,
          subSubCategory: this.subSubCategoryId,
          page: page,
        };
      } else if (!_.isNull(this.categoryId) && !_.isNull(this.subCategoryId)) {
        query = {
          category: this.categoryId,
          subCategory: this.subCategoryId,
          page: page,
        };
      } else if (!_.isNull(this.categoryId)) {
        query = { category: this.categoryId, page: page };
      } else {
        query = { page: page };
      }

      this.$router.push({ path: `/products`, query: query });
    },
  },
};
</script>
