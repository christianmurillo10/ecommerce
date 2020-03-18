<template>
  <v-card class="mx-auto my-12" :elevation="3" max-width="auto">
    <v-container>
      <v-flex xs12 sm12 md12 lg12>
        <v-form
          ref="form"
          @submit.prevent="save"
          v-model="valid"
          lazy-validation
        >
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
                <v-tab-item value="tab-details">
                  <v-container grid-list-md>
                    <v-layout wrap>
                      <v-flex xs12 sm12 md6 offset-md3>
                        <v-flex xs12 sm12 md12>
                          <v-text-field
                            v-model="formData.name"
                            :rules="validateItem.nameRules"
                            label="Name"
                            required
                          ></v-text-field>
                        </v-flex>
                        <v-flex xs12 sm12 md12>
                          <v-text-field
                            v-model="formData.unit"
                            :rules="validateItem.unitRules"
                            label="Unit"
                            required
                          ></v-text-field>
                        </v-flex>
                        <v-flex xs12 sm12 md12>
                          <v-text-field
                            v-model="formData.tags"
                            :rules="validateItem.tagsRules"
                            label="Tags"
                            required
                          ></v-text-field>
                        </v-flex>
                        <v-flex xs12 sm12 md12 v-if="this.formType === 'new'">
                          <v-text-field
                            v-model="formData.stock"
                            :rules="validateItem.stockRules"
                            label="Stock"
                            type="number"
                            required
                          ></v-text-field>
                        </v-flex>
                        <v-flex xs12 sm12 md12>
                          <v-text-field
                            v-model="formData.price_amount"
                            :rules="validateItem.priceAmountRules"
                            label="Price Amount"
                            type="number"
                            required
                          ></v-text-field>
                        </v-flex>
                        <v-flex xs12 sm12 md12>
                          <v-flex xs12 sm12 md8>
                            <v-text-field
                              v-model="formData.vat_amount"
                              label="VAT Amount"
                              type="number"
                            ></v-text-field>
                          </v-flex>
                          <v-flex xs12 sm12 md4>
                            <v-autocomplete
                              :items="getProductBrandList"
                              item-text="name"
                              item-value="id"
                              v-model="formData.product_brand_id"
                              label="Product Brand"
                              persistent-hint
                              :rules="validateItem.productBrandRules"
                              required
                            ></v-autocomplete>
                          </v-flex>
                        </v-flex>
                        <v-flex xs12 sm12 md12>
                          <v-flex xs12 sm12 md8>
                            <v-text-field
                              v-model="formData.discount_amount"
                              label="Discount Amount"
                              type="number"
                            ></v-text-field>
                          </v-flex>
                          <v-flex xs12 sm12 md4>
                            <v-autocomplete
                              :items="getProductBrandList"
                              item-text="name"
                              item-value="id"
                              v-model="formData.product_brand_id"
                              label="Product Brand"
                              persistent-hint
                              :rules="validateItem.productBrandRules"
                              required
                            ></v-autocomplete>
                          </v-flex>
                        </v-flex>
                        <v-flex xs12 sm12 md12>
                          <v-autocomplete
                            :items="getProductBrandList"
                            item-text="name"
                            item-value="id"
                            v-model="formData.product_brand_id"
                            label="Product Brand"
                            persistent-hint
                            :rules="validateItem.productBrandRules"
                            required
                          ></v-autocomplete>
                        </v-flex>
                        <v-flex xs12 sm12 md12>
                          <v-autocomplete
                            :items="getProductCategoryList"
                            item-text="name"
                            item-value="id"
                            v-model="formData.product_category_id"
                            label="Product Category"
                            persistent-hint
                            :rules="validateItem.productCategoryRules"
                            required
                            v-on:change="
                              setProductSubCategoryList(
                                formData.product_category_id
                              )
                            "
                          ></v-autocomplete>
                        </v-flex>
                        <v-flex xs12 sm12 md12>
                          <v-autocomplete
                            :items="getProductSubCategoryList"
                            item-text="name"
                            item-value="id"
                            v-model="formData.product_sub_category_id"
                            label="Product Sub-Category"
                            persistent-hint
                            :rules="validateItem.productSubCategoryRules"
                            required
                            v-on:change="
                              setProductSubSubCategoryList(
                                formData.product_category_id,
                                formData.product_sub_category_id
                              )
                            "
                          ></v-autocomplete>
                        </v-flex>
                        <v-flex xs12 sm12 md12>
                          <v-autocomplete
                            :items="getProductSubSubCategoryList"
                            item-text="name"
                            item-value="id"
                            v-model="formData.product_sub_sub_category_id"
                            label="Product Sub-Sub-Category"
                            persistent-hint
                            :rules="validateItem.productSubSubCategoryRules"
                            required
                          ></v-autocomplete>
                        </v-flex>
                      </v-flex>
                    </v-layout>
                  </v-container>
                </v-tab-item>
                <v-tab-item value="tab-description">
                  <v-list-tile>
                    <v-list-tile-title>
                      <h3>Description:</h3>
                    </v-list-tile-title>
                  </v-list-tile>
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
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click="close">Cancel</v-btn>
            <v-btn color="blue darken-1" type="submit" flat :disabled="!valid"
              >Save</v-btn
            >
          </v-card-actions>
        </v-form>
      </v-flex>
    </v-container>
  </v-card>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";

export default {
  data: () => ({
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
      tags: null,
      stock: null,
      price_amount: null,
      vat_amount: null,
      discount_amount: null,
      product_brand_id: null,
      product_category_id: null,
      product_sub_category_id: null,
      product_sub_sub_category_id: null,
      vat_type: null,
      discount_type: null
    },
    formType: "new",
    formData: {
      name: null,
      description: "",
      unit: null,
      tags: null,
      stock: null,
      price_amount: null,
      vat_amount: null,
      discount_amount: null,
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
      stockRules: [v => !!v || "Stock is required"],
      priceRules: [v => !!v || "Price is required"],
      productCategoryRules: [v => !!v || "Product Category is required"],
      productSubCategoryRules: [v => !!v || "Product Sub Category is required"]
    }
  }),

  computed: {
    ...mapGetters("products", ["getProductById"]),
    ...mapGetters("productBrands", ["getProductBrandList"]),
    ...mapGetters("productCategories", ["getProductCategoryList"]),
    ...mapGetters("productSubCategories", ["getProductSubCategoryList"]),
    ...mapGetters("productSubSubCategories", ["getProductSubSubCategoryList"]),
    formTitle() {
      return this.formType === "new" ? "New Product" : "Edit Product";
    },
    formIcon() {
      return this.formType === "new" ? "add_box" : "edit";
    }
  },

  created() {
    this.getProductBrandsData();
    this.getProductCategoriesData();
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
      saveProductData: "saveData",
      updateProductData: "updateData",
      deleteProductData: "deleteData"
    }),

    setProductSubCategoryList(categoryId) {
      if (categoryId) {
        this.getProductSubCategoriesDataByProductCategoryId(categoryId);
      }
    },

    setProductSubSubCategoryList(categoryId, subCategoryId) {
      if (categoryId !== null && subCategoryId !== null) {
        let obj = {
          categoryId: categoryId,
          subCategoryId: subCategoryId
        }
        this.getProductSubCategoriesDataByProductCategoryIdAndProductSubCategoryId(obj);
      }
    },

    editItem(id) {
      let data = this.getProductById(id);
      this.setProductSubCategoryList(data.product_category_id);
      this.setProductSubSubCategoryList(data.product_category_id, data.product_sub_category_id);
      this.formData.id = data.id;
      this.formData.name = data.name;
      this.formData.description = data.description;
      this.formData.unit = data.unit;
      this.formData.tags = data.tags;
      this.formData.stock = data.stock;
      this.formData.price_amount = data.price_amount;
      this.formData.vat_amount = data.vat_amount;
      this.formData.discount_amount = data.discount_amount;
      this.formData.product_brand_id = data.product_brand_id;
      this.formData.product_category_id = data.product_category_id;
      this.formData.product_sub_category_id = data.product_sub_category_id;
      this.formData.product_sub_sub_category_id = data.product_sub_sub_category_id;
      this.formData.vat_type = data.vat_type;
      this.formData.discount_type = data.discount_type;
      this.formType = "update";
    },

    deleteItem(id) {
      this.deleteProductData(id)
        .then(response => {
          let obj = {
            alert: true,
            type: "success",
            message: response.data.message
          };

          if (!response.data.result) obj.type = "error";
          this.setAlert(obj);
        })
        .catch(err => console.log(err));
    },

    close() {
      this.$emit("setDialog", false);
      this.formType = "new";
      setTimeout(() => {
        this.formData = Object.assign({}, this.defaultFormData);
      }, 300);
    },

    save() {
      if (this.$refs.form.validate()) {
        if (this.formType === "new") {
          this.saveProductData(this.formData)
            .then(response => {
              let obj = {
                alert: true,
                type: "success",
                message: response.data.message
              };

              if (!response.data.result) obj.type = "error";
              this.setAlert(obj);
            })
            .catch(err => console.log(err));
        } else if (this.formType === "update") {
          this.updateProductData(this.formData)
            .then(response => {
              let obj = {
                alert: true,
                type: "success",
                message: response.data.message
              };

              if (!response.data.result) obj.type = "error";
              this.setAlert(obj);
            })
            .catch(err => console.log(err));
        }
        this.close();
      }
    }
  }
};
</script>
