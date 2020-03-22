<template>
  <v-form ref="form" @submit.prevent="save" v-model="valid" lazy-validation>
    <v-card-text>
      <v-flex xs12 sm12 md12 lg12>
        <v-tabs fixed-tabs show-arrows>
          <v-tabs-slider color="yellow"></v-tabs-slider>
          <v-tab
            v-for="(header, i) in tabHeaders"
            :key="i"
            :href="'#tab-' + header.key"
            >{{ header.title }}</v-tab
          >
          <v-tabs-items>
            <v-tab-item value="tab-details">
              <v-flex xs12 sm12 md12>
                <v-container grid-list-md>
                  <v-layout wrap row>
                    <v-flex xs12 sm12 md6>
                      <v-text-field
                        v-model="formData.name"
                        :rules="validateItem.nameRules"
                        label="Name"
                        required
                      ></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm12 md3>
                      <v-text-field
                        v-model="formData.unit"
                        :rules="validateItem.unitRules"
                        label="Unit"
                        required
                      ></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm12 md3 v-if="this.formType === 'new'">
                      <v-text-field
                        v-model="formData.stock"
                        :rules="validateItem.stockRules"
                        label="Stock"
                        type="number"
                        required
                      ></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm12 md4>
                      <v-text-field
                        v-model="formData.price_amount"
                        :rules="validateItem.priceAmountRules"
                        label="Price Amount"
                        type="number"
                        required
                      ></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm12 md4>
                      <v-layout wrap row>
                        <v-flex xs12 sm12 md8>
                          <v-text-field
                            v-model="formData.vat_value"
                            label="VAT"
                            type="number"
                          ></v-text-field>
                        </v-flex>
                        <v-flex xs12 sm12 md4>
                          <v-autocomplete
                            :items="rateTypeList"
                            item-text="name"
                            item-value="id"
                            v-model="formData.vat_type"
                            label="Type"
                          ></v-autocomplete>
                        </v-flex>
                      </v-layout>
                    </v-flex>
                    <v-flex xs12 sm12 md4>
                      <v-layout wrap row>
                        <v-flex xs12 sm12 md8>
                          <v-text-field
                            v-model="formData.discount_value"
                            label="Discount"
                            type="number"
                          ></v-text-field>
                        </v-flex>
                        <v-flex xs12 sm12 md4>
                          <v-autocomplete
                            :items="rateTypeList"
                            item-text="name"
                            item-value="id"
                            v-model="formData.discount_type"
                            label="Type"
                          ></v-autocomplete>
                        </v-flex>
                      </v-layout>
                    </v-flex>
                    <v-flex xs12 sm12 md6>
                      <v-autocomplete
                        :items="getProductBrandList"
                        item-text="name"
                        item-value="id"
                        v-model="formData.product_brand_id"
                        label="Brand"
                        persistent-hint
                        :rules="validateItem.productBrandRules"
                        required
                      ></v-autocomplete>
                    </v-flex>
                    <v-flex xs12 sm12 md6>
                      <v-autocomplete
                        :items="getProductCategoryList"
                        item-text="name"
                        item-value="id"
                        v-model="formData.product_category_id"
                        label="Category"
                        persistent-hint
                        :rules="validateItem.productCategoryRules"
                        required
                        v-on:change="setProductSubCategoryList()"
                      ></v-autocomplete>
                    </v-flex>
                    <v-flex xs12 sm12 md6>
                      <v-autocomplete
                        :items="getProductSubCategoryList"
                        item-text="name"
                        item-value="id"
                        v-model="formData.product_sub_category_id"
                        label="Sub-Category"
                        persistent-hint
                        :rules="validateItem.productSubCategoryRules"
                        required
                        v-on:change="setProductSubSubCategoryList()"
                      ></v-autocomplete>
                    </v-flex>
                    <v-flex xs12 sm12 md6>
                      <v-autocomplete
                        :items="getProductSubSubCategoryList"
                        item-text="name"
                        item-value="id"
                        v-model="formData.product_sub_sub_category_id"
                        label="Sub-Sub-Category"
                      ></v-autocomplete>
                    </v-flex>
                    <v-flex xs12 sm12 md6>
                      <v-combobox
                        multiple
                        v-model="formData.tags"
                        label="Tags"
                        append-icon
                        chips
                        deletable-chips
                        class="tag-input"
                        :search-input.sync="tagSearchInput"
                        @keyup.tab="updateTags"
                        @paste="updateTags"
                      >
                      </v-combobox>
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-flex>
            </v-tab-item>
            <v-tab-item value="tab-description">
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs12 sm12 md12>
                    <v-textarea
                      v-model="formData.description"
                      auto-grow
                      label="Description"
                      rows="10"
                    ></v-textarea>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-tab-item>
            <v-tab-item value="tab-options">
              <v-list-tile>
                <v-list-tile-title>
                  <h3>Options:</h3>
                </v-list-tile-title>
              </v-list-tile>
            </v-tab-item>
            <v-tab-item value="tab-images">
              <v-list-tile>
                <v-list-tile-title>
                  <h3>Images:</h3>
                </v-list-tile-title>
              </v-list-tile>
            </v-tab-item>
          </v-tabs-items>
        </v-tabs>
      </v-flex>
    </v-card-text>

    <v-divider></v-divider>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="blue darken-1" flat to="/products">Cancel</v-btn>
      <v-btn color="blue darken-1" type="submit" flat :disabled="!valid"
        >Save</v-btn
      >
    </v-card-actions>
  </v-form>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";

export default {
  props: {
    formType: String
  },

  data: () => ({
    tagSearchInput: "",
    rateTypeList: [
      { id: 1, name: "Amount" },
      { id: 2, name: "Percentage" }
    ],
    tabHeaders: [
      {
        key: "details",
        title: "Details"
      },
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
    defaultFormData: {
      name: null,
      description: "",
      unit: null,
      tags: [],
      stock: null,
      price_amount: null,
      vat_value: null,
      discount_value: null,
      product_brand_id: null,
      product_category_id: null,
      product_sub_category_id: null,
      product_sub_sub_category_id: null,
      vat_type: null,
      discount_type: null
    },
    formData: {
      name: null,
      description: "",
      unit: null,
      tags: [],
      stock: null,
      price_amount: null,
      vat_value: null,
      discount_value: null,
      product_brand_id: null,
      product_category_id: null,
      product_sub_category_id: null,
      product_sub_sub_category_id: null,
      vat_type: null,
      discount_type: null
    },
    valid: true,
    validateItem: {
      nameRules: [
        v => !!v || "Name is required",
        v => (v && v.length <= 50) || "Name must be less than 50 characters"
      ],
      unitRules: [
        v => !!v || "Unit is required",
        v => (v && v.length <= 50) || "Unit must be less than 50 characters"
      ],
      stockRules: [v => !!v || "Stock is required"],
      priceAmountRules: [v => !!v || "Price Amount is required"],
      productBrandRules: [v => !!v || "Product Brand is required"],
      productCategoryRules: [v => !!v || "Product Category is required"],
      productSubCategoryRules: [v => !!v || "Product Sub Category is required"]
    }
  }),

  computed: {
    ...mapGetters("products", ["getProductById"]),
    ...mapGetters("productBrands", ["getProductBrandList"]),
    ...mapGetters("productCategories", ["getProductCategoryList"]),
    ...mapGetters("productSubCategories", ["getProductSubCategoryList"]),
    ...mapGetters("productSubSubCategories", ["getProductSubSubCategoryList"])
  },

  created() {
    this.getProductBrandsData();
    this.getProductCategoriesData();
    this.setFormType();
  },

  methods: {
    ...mapActions("alerts", ["setAlert"]),
    ...mapActions("productBrands", { getProductBrandsData: "getData" }),
    ...mapActions("productCategories", { getProductCategoriesData: "getData" }),
    ...mapActions("productSubCategories", {
      getProductSubCategoriesDataByProductCategoryId:
        "getDataByProductCategoryId"
    }),
    ...mapActions("productSubSubCategories", {
      getProductSubCategoriesDataByProductCategoryIdAndProductSubCategoryId:
        "getDataByProductCategoryIdAndProductSubCategoryId"
    }),
    ...mapActions("products", {
      getProductDataById: "getDataById",
      saveProductData: "saveData",
      updateProductData: "updateData"
    }),

    updateTags() {
      this.$nextTick(() => {
        this.select.push(this.tagSearchInput.split(","));
        this.$nextTick(() => {
          this.tagSearchInput = "";
        });
      });
    },

    setProductSubCategoryList() {
      let obj = {
        categoryId: this.formData.product_category_id,
        subCategoryId: this.formData.product_sub_category_id
      };

      if (obj.categoryId) {
        if (this.formType === "new") {
          this.formData.product_sub_category_id = this.defaultFormData.product_sub_category_id;
          this.formData.product_sub_sub_category_id = this.defaultFormData.product_sub_sub_category_id;
        }
        this.getProductSubCategoriesDataByProductCategoryId(obj.categoryId);
        this.getProductSubCategoriesDataByProductCategoryIdAndProductSubCategoryId(
          obj
        );
      }
    },

    setProductSubSubCategoryList() {
      let obj = {
        categoryId: this.formData.product_category_id,
        subCategoryId: this.formData.product_sub_category_id
      };

      if (obj.categoryId !== null && obj.subCategoryId !== null) {
        if (this.formType === "new")
          this.formData.product_sub_sub_category_id = this.defaultFormData.product_sub_sub_category_id;
        this.getProductSubCategoriesDataByProductCategoryIdAndProductSubCategoryId(
          obj
        );
      }
    },

    async setFormType() {
      if (this.formType === "update") {
        let response = await this.getProductDataById(this.$route.params.id);
        let data = response.data.result;
        this.formData.id = data.id;
        this.formData.name = data.name;
        this.formData.description = data.description;
        this.formData.unit = data.unit;
        this.formData.tags = data.tags.split(",");
        this.formData.stock = data.stock;
        this.formData.price_amount = data.price_amount;
        this.formData.vat_value = data.vat_value;
        this.formData.discount_value = data.discount_value;
        this.formData.product_brand_id = data.product_brand_id;
        this.formData.product_category_id = data.product_category_id;
        this.formData.product_sub_category_id = data.product_sub_category_id;
        this.formData.product_sub_sub_category_id =
          data.product_sub_sub_category_id;
        this.formData.vat_type = data.vat_type;
        this.formData.discount_type = data.discount_type;

        this.setProductSubCategoryList();
        this.setProductSubSubCategoryList();
      }
    },

    save() {
      if (this.$refs.form.validate()) {
        if (this.formType === "new") {
          this.saveProductData(this.formData)
            .then(response => {
              this.callAlert(response, "/products");
            })
            .catch(err => console.log(err));
        } else if (this.formType === "update") {
          this.updateProductData(this.formData)
            .then(response => {
              this.callAlert(response, "/products");
            })
            .catch(err => console.log(err));
        }
      }
    },

    callAlert(response, url) {
      let obj = {
        alert: true,
        type: "success",
        message: response.data.message
      };

      if (!response.data.result) {
        obj.type = "error";
      } else {
        this.$router.push(url);
      }
      this.setAlert(obj);
    }
  }
};
</script>
