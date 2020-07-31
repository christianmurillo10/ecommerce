<template>
  <v-layout row wrap>
    <v-container>
      <v-layout row wrap>
        <v-flex xs12 sm12 md12 lg12>
          <h4>CATEGORIES</h4>
        </v-flex>
        <v-flex xs12 sm3 md3 lg3> </v-flex>
        <v-flex xs12 sm9 md9 lg9>
          <ItemLists
            header="All"
            :items="productList"
            :item-count="productTotalCount"
            component-type="category"
          />
        </v-flex>
      </v-layout>
    </v-container>
  </v-layout>
</template>

<script>
import ItemLists from "./components/ItemLists";
import { mapState, mapActions } from "vuex";

export default {
  components: {
    ItemLists,
  },

  data: () => ({
    limit: 60,
    offset: 0,
  }),

  mounted() {
    this.getItemList();
  },

  computed: {
    ...mapState("products", ["productList", "productTotalCount"]),
  },

  watch: {
    "$route.params.page": function() {
      this.getItemList();
    },
  },

  methods: {
    ...mapActions("products", {
      getProductDataWithLimitOffset: "getDataWithLimitOffset",
    }),

    getItemList() {
      this.offset =
        this.$route.params.page === 1
          ? 0
          : (this.$route.params.page - 1) * this.limit;
      this.getProductDataWithLimitOffset({
        limit: this.limit,
        offset: this.offset,
      });
    },
  },
};
</script>
