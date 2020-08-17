<template>
  <v-layout row wrap>
    <v-combobox
      v-model="keyword"
      :items="items"
      :search-input.sync="keyword"
      rounded
      outlined
      dense
      no-filter
      hide-details
      clearable
      placeholder='Search ("/" to recent)'
      prepend-inner-icon="mdi-magnify"
      append-icon=""
      color="blue"
      v-on:keyup.enter="search"
    >
      <template v-slot:no-data>
        <v-list dense v-if="keyword === '/'">
          <v-subheader>Recent Searches</v-subheader>
          <v-list-item-group color="blue">
            <v-list-item
              v-for="(item, i) in recentSearchList"
              :key="i"
              @click="searchByRecent(item)"
            >
              <v-list-item-content>
                <v-list-item-title>
                  <v-icon small>mdi-history</v-icon>
                  {{ item }}
                </v-list-item-title>
              </v-list-item-content>
              <v-list-item-action>
                <v-btn small icon @click="deleteSearchData(i)">
                  <v-icon small>mdi-close</v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </template>
      <template v-slot:item="{ index, item }">
        <v-list-item :key="index" @click="viewProduct(item.id)">
          <v-list-item-avatar>
            <v-img
              :src="item.productImages[0].file_path"
              lazy-src="@/assets/images/no-image.png"
            ></v-img>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title v-text="item.name"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-combobox>
  </v-layout>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";

export default {
  data: () => ({
    items: [],
    keyword: "",
    limit: 10,
    offset: 0,
  }),

  mounted() {
    this.initialLoad();
  },

  computed: {
    ...mapState("search", ["recentSearchList"]),
    ...mapState("products", ["productBySearchBarList"]),
  },

  watch: {
    keyword(val) {
      if (_.isEmpty(val) || val === '/') {
        this.items = [];
      } else {
        this.getProductDataBySearchBar({
          keyword: val,
          limit: this.limit,
          offset: this.offset,
        });
      }
    },

    productBySearchBarList(val) {
      this.items = val;
    },
  },

  methods: {
    ...mapMutations("search", {
      addSearchData: "ADD_DATA",
      deleteSearchData: "DELETE_DATA",
      setSearchData: "SET_DATA",
    }),

    ...mapActions("products", {
      getProductDataBySearchBar: "getDataBySearchBar",
    }),

    initialLoad() {
      this.setSearchData();
      this.keyword = "";
    },

    viewProduct(id) {
      this.keyword = "";
      this.$router.push(`/products/${id}`);
    },

    searchByRecent(val) {
      if (!_.isEmpty(val)) {
        this.keyword = "";
        this.$router.push({
          path: `/search`,
          query: { keyword: val },
        });
      }
    },

    search() {
      if (
        !_.isEmpty(this.keyword) &&
        this.$route.query.keyword !== this.keyword &&
        this.keyword !== "/"
      ) {
        let value = this.keyword;
        this.keyword = "";
        this.addSearchData(value);
        this.$router.push({
          path: `/search`,
          query: { keyword: value },
        });
      }
    },
  },
};
</script>
