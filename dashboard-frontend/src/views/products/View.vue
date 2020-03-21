<template>
  <v-container fluid>
    <Alerts />
    <v-divider></v-divider>
    <v-toolbar color="#EEEEEE" dense>
      <v-toolbar-title>
        <v-icon class="black--text">pageview</v-icon>Products - View
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon to="/products">
        <v-icon>arrow_back</v-icon>
      </v-btn>
    </v-toolbar>
    <v-card class="mx-auto my-12" :elevation="3" max-width="auto">
      <v-flex xs12 sm12 md12 lg12>
        <v-list dense>
          <v-container>
            <v-layout wrap row>
              <v-flex xs12 sm12 md6 lg6>
                <v-list-tile>
                  <v-list-tile-action>
                    <v-list-tile-title class="font-weight-bold">Date Created:&nbsp;</v-list-tile-title>
                  </v-list-tile-action>
                  <v-list-tile-content>
                    <v-list-tile-title>{{ setDateTime(productDetails.created_at) }}</v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>
                <v-list-tile>
                  <v-list-tile-action>
                    <v-list-tile-title class="font-weight-bold">Date Modified:&nbsp;</v-list-tile-title>
                  </v-list-tile-action>
                  <v-list-tile-content>
                    <v-list-tile-title>{{ setDateTime(productDetails.updated_at) }}</v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>
                <v-list-tile>
                  <v-list-tile-action>
                    <v-list-tile-title class="font-weight-bold">Name:&nbsp;</v-list-tile-title>
                  </v-list-tile-action>
                  <v-list-tile-content>
                    <v-list-tile-title>{{ productDetails.name }}</v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>
                <v-list-tile>
                  <v-list-tile-action>
                    <v-list-tile-title class="font-weight-bold">Unit:&nbsp;</v-list-tile-title>
                  </v-list-tile-action>
                  <v-list-tile-content>
                    <v-list-tile-title>{{ productDetails.unit }}</v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>
                <v-list-tile>
                  <v-list-tile-action>
                    <v-list-tile-title class="font-weight-bold">Stock:&nbsp;</v-list-tile-title>
                  </v-list-tile-action>
                  <v-list-tile-content>
                    <v-list-tile-title>{{ inventoryDetails.stock_available }}</v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>
                <v-list-tile>
                  <v-list-tile-action>
                    <v-list-tile-title class="font-weight-bold">Price:&nbsp;</v-list-tile-title>
                  </v-list-tile-action>
                  <v-list-tile-content>
                    <v-list-tile-title>{{ `&#8369 ${productDetails.price_amount}` }}</v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>
                <v-list-tile>
                  <v-list-tile-action>
                    <v-list-tile-title class="font-weight-bold">VAT:&nbsp;</v-list-tile-title>
                  </v-list-tile-action>
                  <v-list-tile-content>
                    <v-list-tile-title>{{ vat }}</v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>
                <v-list-tile>
                  <v-list-tile-action>
                    <v-list-tile-title class="font-weight-bold">Discount:&nbsp;</v-list-tile-title>
                  </v-list-tile-action>
                  <v-list-tile-content>
                    <v-list-tile-title>{{ discount }}</v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>
              </v-flex>
              <v-flex xs12 sm12 md6 lg6>
                <v-list-tile>
                  <v-list-tile-action>
                    <v-list-tile-title class="font-weight-bold">Brand:&nbsp;</v-list-tile-title>
                  </v-list-tile-action>
                  <v-list-tile-content>
                    <v-list-tile-title>{{ productBrandDetails.name }}</v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>
                <v-list-tile>
                  <v-list-tile-action>
                    <v-list-tile-title class="font-weight-bold">Category:&nbsp;</v-list-tile-title>
                  </v-list-tile-action>
                  <v-list-tile-content>
                    <v-list-tile-title>{{ productCategoryDetails.name }}</v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>
                <v-list-tile>
                  <v-list-tile-action>
                    <v-list-tile-title class="font-weight-bold">Sub-Category:&nbsp;</v-list-tile-title>
                  </v-list-tile-action>
                  <v-list-tile-content>
                    <v-list-tile-title>{{ productSubCategoryDetails.name }}</v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>
                <v-list-tile>
                  <v-list-tile-action>
                    <v-list-tile-title class="font-weight-bold">Sub Sub-Category:&nbsp;</v-list-tile-title>
                  </v-list-tile-action>
                  <v-list-tile-content>
                    <v-list-tile-title>{{ productSubSubCategoryDetails.name }}</v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>
                <v-list-tile>
                  <v-list-tile-action>
                    <v-list-tile-title class="font-weight-bold">Tags:&nbsp;</v-list-tile-title>
                  </v-list-tile-action>
                  <v-list-tile-content>
                    <v-list-tile-title>{{ productDetails.tags }}</v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>
                <v-list-tile>
                  <v-list-tile-action>
                    <v-list-tile-title class="font-weight-bold">Published:&nbsp;</v-list-tile-title>
                  </v-list-tile-action>
                  <v-list-tile-content>
                    <v-list-tile-title>{{ getYesNoStatus(productDetails.is_published) }}</v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>
                <v-list-tile>
                  <v-list-tile-action>
                    <v-list-tile-title class="font-weight-bold">Featured:&nbsp;</v-list-tile-title>
                  </v-list-tile-action>
                  <v-list-tile-content>
                    <v-list-tile-title>{{ getYesNoStatus(productDetails.is_featured) }}</v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>
                <v-list-tile>
                  <v-list-tile-action>
                    <v-list-tile-title class="font-weight-bold">Today Deal:&nbsp;</v-list-tile-title>
                  </v-list-tile-action>
                  <v-list-tile-content>
                    <v-list-tile-title>{{ getYesNoStatus(productDetails.is_today_deal) }}</v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>
              </v-flex>
            </v-layout>
          </v-container>
        </v-list>
        <v-card-text>
          <v-tabs fixed-tabs show-arrows>
            <v-tabs-slider color="yellow"></v-tabs-slider>
            <v-tab
              v-for="(header, i) in tabHeaders"
              :key="i"
              :href="'#tab-' + header.key"
              >{{ header.title }}</v-tab
            >
            <v-tabs-items>
              <v-tab-item value="tab-description">
                <v-flex xs12 sm12 md12 lg12>
                  <v-sheet
                    class="d-flex"
                    color="grey lighten-5"
                  >
                    <v-container>
                      <p v-if="productDetails.description === ''" class="text-xs-center">There have been no description for this product yet.</p>
                      <p v-else>{{ productDetails.description }}</p>
                    </v-container>
                  </v-sheet>
                </v-flex>
              </v-tab-item>
              <v-tab-item value="tab-options"> </v-tab-item>
              <v-tab-item value="tab-images"> </v-tab-item>
            </v-tabs-items>
          </v-tabs>
        </v-card-text>
      </v-flex>
    </v-card>
  </v-container>
</template>

<script>
import Alerts from "@/components/utilities/Alerts";
import Mixins from "@/helpers/Mixins.js";
import { mapState, mapActions } from "vuex";

export default {
  mixins: [Mixins],
  components: {
    Alerts
  },

  data: () => ({
    tabHeaders: [
      {
        key: "description",
        title: "Description"
      },
      {
        key: "options",
        title: "Options"
      },
      {
        key: "images",
        title: "Images"
      }
    ],
    productDetails: "",
    productBrandDetails: "",
    productCategoryDetails: "",
    productSubCategoryDetails: "",
    productSubSubCategoryDetails: "",
    inventoryDetails: ""
  }),

  mounted() {
    this.getProductDataById(this.$route.params.id).then(response => {
      this.productDetails = response.data.result;
      this.productBrandDetails = response.data.result.productBrands;
      this.productCategoryDetails = response.data.result.productCategories;
      this.productSubCategoryDetails = response.data.result.productSubCategories;
      this.productSubSubCategoryDetails = response.data.result.productSubSubCategories;
    });
    this.getInventoryAvailableStockDataByProductId(this.$route.params.id).then(
      response => {
        this.inventoryDetails = response.data.result;
      }
    );
  },

  computed: {
    vat() {
      let value = 0;
      if (this.productDetails.vat_type === 1) {
        value = `₱ ${this.productDetails.vat_value}`;
      } else if (this.productDetails.vat_type === 2) {
        value = `${this.productDetails.vat_value} %`;
      }
      return value;
    },
    discount() {
      let value = 0;
      if (this.productDetails.discount_type === 1) {
        value = `₱ ${this.productDetails.discount_value}`;
      } else if (this.productDetails.discount_type === 2) {
        value = `${this.productDetails.discount_value} %`;
      }
      return value;
    }
  },

  methods: {
    ...mapActions("products", { getProductDataById: "getDataById" }),
    ...mapActions("inventories", {
      getInventoryAvailableStockDataByProductId:
        "getAvailableStockDataByProductId"
    })
  }
};
</script>
