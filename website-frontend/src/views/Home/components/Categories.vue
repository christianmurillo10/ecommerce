<template>
  <div>
    <v-card-title>CATEGORIES</v-card-title>
    <v-card-text>
      <v-list dense>
        <v-list-item-group color="primary">
          <template v-for="(productCategory, i) in productCategoryWithSubList">
            <v-menu open-on-hover close-delay="200" :close-on-content-click="false" offset-x :key="i">
              <template v-slot:activator="{ on }">
                <v-list-item
                class="ml-n3"
                :to="`category/${productCategory.id}/page/1`"
                v-on="on"
                >
                  <v-list-item-icon>
                    <v-icon>mdi-menu-right</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content class="ml-n3">
                    <v-list-item-title v-text="productCategory.name"></v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </template>
              <v-card height="325" width="825">
                <v-container fluid grid-list-sm class="pa-5">
                  <v-layout row wrap>
                    <v-flex xs12 sm12 md3 lg3 v-for="(productSubCategory, i) in productCategory.productSubCategories" :key="i">
                      <ul>
                        <li class="remove-bullet pb-1">
                          <router-link class="text-decoration black--text" v-bind:to="`/category/${productCategory.id}/page/1`">
                            <span class="subtitle-2 font-weight-bold">{{ productSubCategory.name }}</span>
                          </router-link>
                        </li>
                        <li class="remove-bullet" v-for="(productSubSubCategory, i) in productSubCategory.productSubSubCategories" :key="i">
                          <router-link class="text-decoration black--text" v-bind:to="`/category/${productCategory.id}/page/1`">
                            <span class="caption">{{ productSubSubCategory.name }}</span>
                          </router-link>
                        </li>
                      </ul>
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-card>
            </v-menu>
          </template>
        </v-list-item-group>
      </v-list>
    </v-card-text>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  mounted() {
    this.getProductCategoriesDataWithSubCategories();
  },

  computed: {
    ...mapState("productCategories", ["productCategoryWithSubList"])
  },

  methods: {
    ...mapActions("productCategories", {
      getProductCategoriesDataWithSubCategories: "getDataWithSubCategories"
    })
  }
}
</script>

<style scoped lang="scss">
.v-menu__content {
  top: 22% !important;
  left: 28% !important;
  box-shadow: none;
}

.remove-bullet {
  list-style-type: none;
}

.text-decoration {
  text-decoration:none;
}
</style>