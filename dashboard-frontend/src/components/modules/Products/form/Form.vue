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
              <v-container grid-list-md>
                <v-flex xs12 sm12 md12>
                  <v-layout wrap row>
                    <v-flex xs12 sm12 md3>
                      <v-text-field
                        v-model="formData.code"
                        :rules="[rules.required, rules.max50Chars]"
                        label="Code"
                        required
                      ></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm12 md6>
                      <v-text-field
                        v-model="formData.name"
                        :rules="[rules.required, rules.max50Chars]"
                        label="Name"
                        required
                      ></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm12 md3>
                      <v-text-field
                        v-model="formData.unit"
                        :rules="[rules.required, rules.max50Chars]"
                        label="Unit"
                        required
                      ></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm12 md6>
                      <v-text-field
                        v-model="formData.price_amount"
                        :rules="[rules.required]"
                        label="Price Amount"
                        type="number"
                        required
                      ></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm12 md6>
                      <v-autocomplete
                        :items="getProductStoreList"
                        item-text="name"
                        item-value="id"
                        v-model="formData.product_store_id"
                        label="Store"
                        persistent-hint
                        :rules="[rules.required]"
                        required
                      ></v-autocomplete>
                    </v-flex>
                    <v-flex xs12 sm12 md6>
                      <v-autocomplete
                        :items="getProductBrandList"
                        item-text="name"
                        item-value="id"
                        v-model="formData.product_brand_id"
                        label="Brand"
                        persistent-hint
                        :rules="[rules.required]"
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
                        :rules="[rules.required]"
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
                        :rules="[rules.required]"
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
                      >
                      </v-combobox>
                    </v-flex>
                  </v-layout>
                </v-flex>
              </v-container>
            </v-tab-item>
            <v-tab-item value="tab-description">
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs12 sm12 md12>
                    <vue-editor
                      v-model="formData.description"
                      :editorToolbar="customToolbar"
                    ></vue-editor>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-tab-item>
          </v-tabs-items>
        </v-tabs>
      </v-flex>
    </v-card-text>

    <v-divider></v-divider>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="blue darken-1" flat to="/products">Cancel</v-btn>
      <v-btn color="blue darken-1" type="submit" flat :disabled="!valid">
        Save
      </v-btn>
    </v-card-actions>
  </v-form>
</template>

<script>
import Mixins from "@/helpers/Mixins.js";
import { mapState, mapGetters, mapActions } from "vuex";
import { VueEditor } from "vue2-editor";

export default {
  props: {
    formType: String,
  },

  mixins: [Mixins],
  components: {
    VueEditor,
  },

  data: () => ({
    customToolbar: [
      [{ header: [false, 1, 2, 3, 4, 5, 6] }],
      ["bold", "italic", "underline", "strike"],
      // [{'align': ''}, {'align': 'center'}, {'align': 'right'}, {'align': 'justify'}],
      [{ header: 1 }, { header: 2 }],
      [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
      [{ color: [] }, { background: [] }],
      ["clean"],
    ],
    tabHeaders: [
      {
        key: "details",
        title: "Details",
      },
      {
        key: "description",
        title: "Description",
      },
    ],
    defaultFormData: {
      code: "",
      name: "",
      description: "",
      unit: "",
      tags: [],
      price_amount: "",
      product_store_id: "",
      product_brand_id: "",
      product_category_id: "",
      product_sub_category_id: "",
      product_sub_sub_category_id: "",
    },
    formData: {
      code: "",
      name: "",
      description: "",
      unit: "",
      tags: [],
      price_amount: "",
      product_store_id: "",
      product_brand_id: "",
      product_category_id: "",
      product_sub_category_id: "",
      product_sub_sub_category_id: "",
    },
    valid: true,
  }),

  computed: {
    ...mapGetters("products", ["getProductById"]),
    ...mapGetters("productStores", ["getProductStoreList"]),
    ...mapGetters("productBrands", ["getProductBrandList"]),
    ...mapGetters("productCategories", ["getProductCategoryList"]),
    ...mapGetters("productSubCategories", ["getProductSubCategoryList"]),
    ...mapGetters("productSubSubCategories", ["getProductSubSubCategoryList"]),
  },

  created() {
    this.getProductStoresData();
    this.getProductBrandsData();
    this.getProductCategoriesData();
    this.setFormType();
  },

  methods: {
    ...mapActions("alerts", ["setAlert"]),
    ...mapActions("productStores", { getProductStoresData: "getData" }),
    ...mapActions("productBrands", { getProductBrandsData: "getData" }),
    ...mapActions("productCategories", { getProductCategoriesData: "getData" }),
    ...mapActions("productSubCategories", {
      getProductSubCategoriesDataByProductCategoryId:
        "getDataByProductCategoryId",
    }),
    ...mapActions("productSubSubCategories", {
      getProductSubCategoriesDataByProductCategoryIdAndProductSubCategoryId:
        "getDataByProductCategoryIdAndProductSubCategoryId",
    }),
    ...mapActions("products", {
      getProductDataById: "getDataById",
      saveProductData: "saveData",
      updateProductData: "updateData",
    }),

    setProductSubCategoryList() {
      let obj = {
        categoryId: this.formData.product_category_id,
        subCategoryId: this.formData.product_sub_category_id,
      };

      if (obj.categoryId) {
        if (this.formType === "new") {
          this.formData.product_sub_category_id = this.defaultFormData.product_sub_category_id;
          this.formData.product_sub_sub_category_id = this.defaultFormData.product_sub_sub_category_id;
        }
        this.getProductSubCategoriesDataByProductCategoryId(obj.categoryId);
      }
      if (obj.subCategoryId) {
        this.getProductSubCategoriesDataByProductCategoryIdAndProductSubCategoryId(
          obj
        );
      }
    },

    setProductSubSubCategoryList() {
      let obj = {
        categoryId: this.formData.product_category_id,
        subCategoryId: this.formData.product_sub_category_id,
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
        let data = response;
        this.formData.id = data.id;
        this.formData.code = data.code;
        this.formData.name = data.name;
        this.formData.description = data.description;
        this.formData.unit = data.unit;
        this.formData.tags = data.tags.split(",");
        this.formData.price_amount = data.price_amount;
        this.formData.product_store_id = data.product_store_id;
        this.formData.product_brand_id = data.product_brand_id;
        this.formData.product_category_id = data.product_category_id;
        this.formData.product_sub_category_id = data.product_sub_category_id;
        this.formData.product_sub_sub_category_id =
          data.product_sub_sub_category_id;

        this.setProductSubCategoryList();
        this.setProductSubSubCategoryList();
      }
    },

    save() {
      if (this.$refs.form.validate()) {
        if (this.formType === "new") {
          this.saveProductData(this.formData)
            .then((response) => {
              this.callAlert(response, "/products");
            })
            .catch((err) => console.log(err));
        } else if (this.formType === "update") {
          this.updateProductData(this.formData)
            .then((response) => {
              this.callAlert(response, "/products");
            })
            .catch((err) => console.log(err));
        }
      }
    },

    callAlert(response, url) {
      let obj = {
        alert: true,
        type: "success",
        message: [response.message],
        outline: true,
      };

      if (response.status === "error") {
        obj.type = "error";
        obj.message = response.errors;
      } else {
        this.$router.push(url);
      }

      this.setAlert(obj);
    },
  },
};
</script>
