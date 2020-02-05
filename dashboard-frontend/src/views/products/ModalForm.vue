<template>
  <v-card>
    <v-card-title class="headline grey darken-3 white--text">
      <span>
        <v-icon class="white--text">{{ formIcon }}</v-icon>
        {{ formTitle }}
      </span>
    </v-card-title>

    <v-form ref="form" @submit.prevent="save" v-model="valid" lazy-validation>
      <v-card-text>
        <v-container grid-list-md>
          <v-layout wrap>
            <v-flex xs12 sm12 md12>
              <v-text-field
                v-model="formData.name"
                :rules="validateItem.nameRules"
                label="Name"
                required
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm12 md12>
              <v-textarea
                v-model="formData.description"
                label="Description"
              ></v-textarea>
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
                v-model="formData.price"
                :rules="validateItem.priceRules"
                label="Price"
                type="number"
                required
              ></v-text-field>
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
                v-on:change="setProductSubCategoryList(formData.product_category_id)"
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
              ></v-autocomplete>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" flat @click="close">Cancel</v-btn>
        <v-btn color="blue darken-1" type="submit" flat :disabled="!valid">Save</v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script>
import Index from "./Index";
import { mapGetters, mapActions } from "vuex";

export default {
  components: {
    Index
  },

  data: () => ({
    defaultFormData: {
      name: null,
      description: "",
      stock: null,
      price: null,
      product_category_id: null,
      product_sub_category_id: null
    },
    formType: "new",
    formData: {
      name: null,
      description: "",
      stock: null,
      price: null,
      product_category_id: null,
      product_sub_category_id: null
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
    ...mapGetters("productCategories", ["getProductCategoryList"]),
    ...mapGetters("productSubCategories", ["getProductSubCategoryList"]),
    formTitle() {
      return this.formType === "new" ? "New Product" : "Edit Product";
    },
    formIcon() {
      return this.formType === "new" ? "add_box" : "edit";
    }
  },

  created() {
    this.getProductCategoriesData();
  },

  methods: {
    ...mapActions("alerts", ["setAlert"]),
    ...mapActions("productCategories", { getProductCategoriesData: "getData" }),
    ...mapActions("productSubCategories", {
      getProductSubCategoriesDataByProductCategoryId:
        "getDataByProductCategoryId"
    }),
    ...mapActions("products", {
      saveProductData: "saveData",
      updateProductData: "updateData",
      deleteProductData: "deleteData"
    }),

    setProductSubCategoryList(categoryId) {
      if (categoryId) {
        this.getProductSubCategoriesDataByProductCategoryId(
          categoryId
        );
      }
    },

    editItem(id) {
      let data = this.getProductById(id);
      this.setProductSubCategoryList(data.product_category_id);
      this.formData.id = data.id;
      this.formData.name = data.name;
      this.formData.description = data.description;
      this.formData.stock = data.stock;
      this.formData.price = data.price;
      this.formData.product_category_id = data.product_category_id;
      this.formData.product_sub_category_id = data.product_sub_category_id;
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