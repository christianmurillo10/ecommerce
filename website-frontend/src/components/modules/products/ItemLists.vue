<template>
  <v-data-iterator
    :items="items"
    :items-per-page.sync="pagination.limit"
    hide-default-footer
  >
    <template v-slot:header>
      <div class="title">
        Results for
        <b>"{{ header }}"</b>
        ({{ itemCount }})
      </div>
      <v-row>
        <v-spacer></v-spacer>
        <div>
          <v-pagination
            v-model="pagination.page"
            :key="`${pagination.length}${pagination.page}`"
            :length="pagination.length"
            :total-visible="pagination.visible"
            :disabled="pagination.length === 1 ? true : false"
            @input="onPageChange"
          ></v-pagination>
        </div>
      </v-row>
    </template>
    <template v-slot:default="props">
      <v-row dense>
        <v-col
          v-for="item in props.items"
          :key="item.name"
          cols="6"
          sm="4"
          md="3"
          lg="3"
        >
          <ProductCard
            :item="{
              id: item.id,
              name: item.name,
              file_path: item.productImages[0].file_path,
              price_amount: item.price_amount,
            }"
          />
        </v-col>
      </v-row>
    </template>
    <template v-slot:footer>
      <v-row>
        <v-spacer></v-spacer>
        <div>
          <v-pagination
            v-model="pagination.page"
            :key="`${pagination.length}${pagination.page}`"
            :length="pagination.length"
            :total-visible="pagination.visible"
            :disabled="pagination.length === 1 ? true : false"
            @input="onPageChange"
          ></v-pagination>
        </div>
      </v-row>
    </template>
    <template v-slot:no-data>
      <p class="justify-center layout px-0">No data found!</p>
    </template>
  </v-data-iterator>
</template>

<script>
import ProductCard from "./Card";

export default {
  props: {
    header: String,
    items: Array,
    itemCount: Number,
  },
  components: {
    ProductCard,
  },

  data: () => ({
    pagination: {
      limit: 60,
      page: 1,
      length: 1,
      visible: 7,
    },
  }),

  mounted() {
    this.setDefault();
  },

  watch: {
    itemCount: function(val) {
      if (!_.isUndefined(val)) this.setDefault();
    },
    "$route.query.page": function(val) {
      if (!_.isUndefined(val) && parseInt(this.$route.query.page) !== 1)
        this.setDefault();
    },
  },

  methods: {
    setDefault() {
      this.pagination.page = _.isUndefined(this.$route.query.page)
        ? 1
        : parseInt(this.$route.query.page);
      this.computePaginationLength();
    },

    computePaginationLength() {
      this.pagination.length = Math.ceil(
        this.itemCount / this.pagination.limit
      );
    },

    onPageChange() {
      this.$emit("onPageChange", this.pagination.page);
    },
  },
};
</script>
