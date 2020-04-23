<template>
  <v-container fluid grid-list-sm>
    <v-layout row wrap>
      <v-container class="col-lg-10 offset-lg-1">
        <v-layout row wrap>
          <v-flex xs12 sm12 md12 lg12>
            <h4>SUB SUB CATEGORIES</h4>
          </v-flex>
          <v-flex xs12 sm3 md3 lg3>
          </v-flex>
          <v-flex xs12 sm9 md9 lg9>
            <ItemLists :header="productSubSubCategoryDataById.name" :items="productBySubSubCategoryList" :item-count="productBySubSubCategoryTotalCount" component-type="sub-sub-category" />
          </v-flex>
        </v-layout>
      </v-container>
    </v-layout>
  </v-container>
</template>

<script>
import ItemLists from "./components/ItemLists";
import { mapState, mapActions } from "vuex";

export default {
  components: {
    ItemLists
  },

  data: () => ({
    limit: 60,
    offset: 0
  }),

  mounted() {
    this.getItemList();
    this.getProductSubSubCategoryDataById(this.$route.params.id);
  },

  computed: {
    ...mapState("products", ["productBySubSubCategoryList", "productBySubSubCategoryTotalCount"]),
    ...mapState("productSubSubCategories", ["productSubSubCategoryDataById"]),
  },

  watch: {
    "$route.params.page": function() {
      this.getItemList();
    }
  },

  methods: {
    ...mapActions("products", { getProductDataByProductSubSubCategoryIdWithLimitOffset: "getDataByProductSubSubCategoryIdWithLimitOffset" }),
    ...mapActions("productSubSubCategories", { getProductSubSubCategoryDataById: "getDataById" }),

    getItemList() {
      this.offset = this.$route.params.page === 1 ? 0 : (this.$route.params.page - 1) * this.limit;
      this.getProductDataByProductSubSubCategoryIdWithLimitOffset({ sub_sub_category_id: this.$route.params.id, limit: this.limit, offset: this.offset });
    }
  }
}
</script>