<template>
  <v-menu
    open-on-click
    :nudge-width="200"
    offset-y
    right
    transition="slide-x-reverse-transition"
    max-width="300"
  >
    <template v-slot:activator="{ on: { click } }">
      <v-btn
        v-on:click="click"
        class="hidden-sm-and-down blue white--text"
        width="300"
      >
        Categories <v-icon right>mdi-view-list</v-icon>
      </v-btn>
    </template>

    <v-list dense height="500">
      <div v-for="(productCategory, i) in productCategoryWithSubList" :key="i">
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
                v-bind:to="`/category/${productCategory.id}/page/1`"
                v-on="on"
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
            </template>

            <v-card outlined height="492" width="600">
              <v-container fluid grid-list-sm class="pa-5">
                <v-layout row wrap>
                  <v-flex
                    xs12
                    sm12
                    md6
                    lg6
                    class="pb-3"
                    v-for="(productSubCategory,
                    i) in productCategory.productSubCategories"
                    :key="i"
                  >
                    <ul>
                      <li class="remove-bullet pb-1">
                        <router-link
                          class="text-decoration black--text"
                          v-bind:to="
                            `/category/${productCategory.id}/sub-category/${productSubCategory.id}/page/1`
                          "
                        >
                          <span class="subtitle-2 font-weight-bold">{{
                            productSubCategory.name
                          }}</span>
                          <v-divider class="blue"></v-divider>
                        </router-link>
                      </li>
                      <li
                        class="remove-bullet"
                        v-for="(productSubSubCategory,
                        i) in productSubCategory.productSubSubCategories"
                        :key="i"
                      >
                        <router-link
                          class="text-decoration black--text"
                          v-bind:to="
                            `/category/${productCategory.id}/sub-category/${productSubCategory.id}/sub-sub-category/${productSubSubCategory.id}/page/1`
                          "
                        >
                          <span class="caption">{{
                            productSubSubCategory.name
                          }}</span>
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
          <v-list-item v-bind:to="`/category/${productCategory.id}/page/1`">
            <v-list-item-title>{{ productCategory.name }}</v-list-item-title>
          </v-list-item>
        </div>
      </div>
    </v-list>
  </v-menu>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  mounted() {
    this.getProductCategoriesDataWithSubCategories();
  },

  computed: {
    ...mapState("productCategories", ["productCategoryWithSubList"]),
  },

  methods: {
    ...mapActions("productCategories", {
      getProductCategoriesDataWithSubCategories: "getDataWithSubCategories",
    }),
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

.sub-category-card {
  top: 114px !important;
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
