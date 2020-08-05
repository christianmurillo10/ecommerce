<template>
  <v-menu
    content-class="category-card"
    :close-on-content-click="false"
    open-on-click
    :nudge-width="200"
    offset-y
    right
    transition="scale-transition"
    max-width="300"
  >
    <template v-slot:activator="{ on: { click } }">
      <v-btn
        v-on:click="click"
        class="hidden-sm-and-down blue white--text"
        width="300"
      >
        <v-icon left>mdi-view-list</v-icon> Categories
      </v-btn>
    </template>

    <v-list dense>
      <v-list-item-group v-model="model" color="blue">
        <v-list-item
          v-on:click="redirectTo('products')"
          :value="0"
        >
          <v-list-item-content>
            <v-list-item-title>All</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>
        <div
          v-for="(productCategory, i) in productCategoryWithSubList"
          :key="i"
        >
          <div v-if="productCategory.productSubCategories.length !== 0">
            <v-menu
              content-class="sub-category-card"
              :close-on-content-click="false"
              open-on-hover
              close-delay="200"
              offset-x
              right
            >
              <template v-slot:activator="{ on }">
                <v-list-item
                  v-on="on"
                  v-on:click="redirectTo('products', { category: productCategory.id })"
                  :value="productCategory.id"
                >
                  <v-list-item-content>
                    <v-list-item-title
                      v-text="productCategory.name"
                    ></v-list-item-title>
                  </v-list-item-content>
                  <v-list-item-icon>
                    <v-icon>mdi-menu-right</v-icon>
                  </v-list-item-icon>
                </v-list-item>
                <v-divider></v-divider>
              </template>
              <v-card outlined width="850">
                <v-container fluid grid-list-sm class="pa-5">
                  <v-layout row wrap>
                    <v-flex
                      xs12
                      sm12
                      md4
                      lg4
                      class="pb-3"
                      v-for="(productSubCategory, i) in productCategory.productSubCategories"
                      :key="i"
                    >
                      <ul>
                        <li class="remove-bullet pb-1">
                          <router-link
                            class="text-decoration black--text"
                            :to="{
                              path: 'products',
                              query: {
                                category: productCategory.id,
                                subCategory: productSubCategory.id,
                              },
                            }"
                            @click.native="setModel()"
                          >
                            <span class="subtitle-2 font-weight-bold">
                              {{ productSubCategory.name }}
                            </span>
                            <v-divider class="blue"></v-divider>
                          </router-link>
                        </li>
                        <li
                          class="remove-bullet"
                          v-for="(productSubSubCategory, i) in productSubCategory.productSubSubCategories"
                          :key="i"
                        >
                          <router-link
                            class="text-decoration black--text"
                            :to="{
                              path: 'products',
                              query: {
                                category: productCategory.id,
                                subCategory: productSubCategory.id,
                                subSubCategory: productSubSubCategory.id,
                              },
                            }"
                            @click.native="setModel()"
                          >
                            <span class="caption">
                              {{ productSubSubCategory.name }}
                            </span>
                          </router-link>
                        </li>
                      </ul>
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-card>
            </v-menu>
          </div>
          <div v-else>
            <v-list-item v-on:click="redirectTo('products', { category: productCategory.id })">
              <v-list-item-title>{{ productCategory.name }}</v-list-item-title>
            </v-list-item>
          </div>
        </div>
      </v-list-item-group>
    </v-list>
  </v-menu>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  data: () => ({
    model: null,
  }),

  mounted() {
    this.setModel();
    this.getProductCategoriesDataWithSubCategories();
  },

  computed: {
    ...mapState("productCategories", ["productCategoryWithSubList"]),
  },

  methods: {
    ...mapActions("productCategories", {
      getProductCategoriesDataWithSubCategories: "getDataWithSubCategories",
    }),

    setModel() {
      this.model = _.isUndefined(this.$route.query.category) ? null : parseInt(this.$route.query.category);
    },

    redirectTo(path, query) {
      this.setModel();
      this.$router.push({ path: path, query: query });
    },
  },
};
</script>

<style scoped lang="scss">
.v-menu__content {
  -webkit-box-shadow: 0px 5px 5px -3px rgba(0, 0, 0, 0.2),
    0px 0px 0px 0px rgba(0, 0, 0, 0.14), 0px 0px 14px 0px rgba(0, 0, 0, 0.12) !important;
  box-shadow: 0px 5px 5px -3px rgba(0, 0, 0, 0.2),
    0px 0px 0px 0px rgba(0, 0, 0, 0.14), 0px 0px 14px 0px rgba(0, 0, 0, 0.12) !important;
}

.category-card {
  border: 1px solid #2196F3;
}

.sub-category-card {
  top: 114px !important;
  border: 1px solid #2196F3;
}

.v-application .black--text span:hover {
  color: #2196f3;
}

.remove-bullet {
  list-style-type: none;
}

.text-decoration {
  text-decoration: none;
}
</style>
