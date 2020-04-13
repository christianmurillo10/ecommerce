<template>
  <v-container fluid>
    <Alerts />
    <v-card>
      <v-card-title>
        <v-icon class="black--text">pageview</v-icon
        ><span class="title">Products - View</span>
        <v-spacer></v-spacer>
        <v-tooltip left>
          <template v-slot:activator="{ on }">
            <v-btn icon to="/products" v-on="on">
              <v-icon>arrow_back</v-icon>
            </v-btn>
          </template>
          <span>Back</span>
        </v-tooltip>
      </v-card-title>
      <v-card-text>
        <v-flex xs12 sm12 md12 lg12>
          <v-list dense>
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
                    <!-- <v-list-tile-title>{{ inventoryDetails.stock_available }}</v-list-tile-title> -->
                    <v-list-tile-title>0</v-list-tile-title>
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
          </v-list>
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
                      <div v-if="productDetails.description === ''" class="text-xs-center">There have been no description for this product yet.</div>
                      <div v-else v-html="productDetails.description" style="white-space: pre-wrap;"></div>
                    </v-container>
                  </v-sheet>
                </v-flex>
              </v-tab-item>
              <v-tab-item value="tab-images">
                <ViewImages ref="viewImages" :image-details="productImageDetails" />
              </v-tab-item>
              <v-tab-item value="tab-options">
                <ViewOptions ref="viewOptions" :option-details="productOptionDetails" />
              </v-tab-item>
              <v-tab-item value="tab-variants">
                <ViewVariants ref="viewVariants" :variant-details="productVariantDetails" />
              </v-tab-item>
            </v-tabs-items>
          </v-tabs>
        </v-flex>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import Alerts from "@/components/utilities/Alerts";
import Mixins from "@/helpers/Mixins.js";
import ViewOptions from "./ViewOptions";
import ViewImages from "./ViewImages";
import ViewVariants from "./ViewVariants";
import { mapState, mapActions } from "vuex";

export default {
  mixins: [Mixins],
  components: {
    Alerts,
    ViewOptions,
    ViewImages,
    ViewVariants
  },

  data: () => ({
    tabHeaders: [
      {
        key: "description",
        title: "Description"
      },
      {
        key: "images",
        title: "Images"
      },
      {
        key: "options",
        title: "Options"
      },
      {
        key: "variants",
        title: "Variants"
      }
    ],
    productDetails: "",
    productBrandDetails: "",
    productCategoryDetails: "",
    productSubCategoryDetails: "",
    productSubSubCategoryDetails: "",
    productImageDetails: [],
    productOptionDetails: [],
    productVariantDetails: []
  }),

  mounted() {
    this.getProductDataById(this.$route.params.id).then(response => {
      this.productDetails = response.data.result;
      this.productBrandDetails = response.data.result.productBrands === null ? "" : response.data.result.productBrands;
      this.productCategoryDetails = response.data.result.productCategories === null ? "" : response.data.result.productCategories;
      this.productSubCategoryDetails = response.data.result.productSubCategories === null ? "" : response.data.result.productSubCategories;
      this.productSubSubCategoryDetails = response.data.result.productSubSubCategories === null ? "" : response.data.result.productSubSubCategories;
      this.productImageDetails = response.data.result.productImages === null ? [] : response.data.result.productImages;
      this.productOptionDetails = response.data.result.productOptions === null ? [] : response.data.result.productOptions;
      this.productVariantDetails = response.data.result.inventories === null ? [] : response.data.result.inventories;
    });
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
    ...mapActions("products", { getProductDataById: "getDataById" })
  }
};
</script>