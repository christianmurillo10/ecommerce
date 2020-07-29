<template>
  <v-form ref="form" @submit.prevent="save" v-model="valid" lazy-validation>
    <v-card>
      <v-card-title>
        <v-icon class="black--text">{{ formIcon }}</v-icon><span class="title">{{ formTitle }}</span>
      </v-card-title>
      <v-card-text>
        <v-container grid-list-md>
          <v-layout wrap>
            <v-flex xs12 sm12 md12>
              <v-text-field
                v-model="formData.name"
                :rules="[rules.required, rules.max50Chars]"
                label="Name"
                required
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm12 md12>
              <v-textarea
                v-model="formData.description"
                :rules="[rules.max500Chars]"
                label="Description"
              ></v-textarea>
            </v-flex>
            <v-flex xs12 sm12 md12>
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
            <v-flex xs12 sm12 md12>
              <v-autocomplete
                :items="getProductSubCategoryList"
                item-text="name"
                item-value="id"
                v-model="formData.product_sub_category_id"
                label="Sub Category"
                :rules="[rules.required]"
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
        <v-btn color="blue darken-1" type="submit" flat :disabled="!valid"
          >Save</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-form>
</template>

<script>
import Index from "../Index";
import Mixins from "@/helpers/Mixins.js";
import { mapGetters, mapActions } from "vuex";

export default {
  mixins: [Mixins],
  components: {
    Index
  },

  data: () => ({
    defaultFormData: {
      name: "",
      description: "",
      product_category_id: "",
      product_sub_category_id: ""
    },
    formType: "new",
    formData: {
      name: "",
      description: "",
      product_category_id: "",
      product_sub_category_id: ""
    },
    valid: true
  }),

  computed: {
    ...mapGetters("productSubSubCategories", ["getProductSubSubCategoryById"]),
    ...mapGetters("productCategories", ["getProductCategoryList"]),
    ...mapGetters("productSubCategories", ["getProductSubCategoryList"]),
    formTitle() {
      return this.formType === "new" ? "Product Sub Sub-Category - Create" : "Product Sub Sub-Category - Update";
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
    ...mapActions("productSubSubCategories", {
      saveProductSubSubCategoryData: "saveData",
      updateProductSubSubCategoryData: "updateData"
    }),

    setProductSubCategoryList() {
      let categoryId = this.formData.product_category_id;

      if (categoryId) {
        if (this.formType === "new") this.formData.product_sub_category_id = this.defaultFormData.product_sub_category_id;
        this.getProductSubCategoriesDataByProductCategoryId(categoryId);
      }
    },

    editItem(id) {
      let data = this.getProductSubSubCategoryById(id);
      this.formData.id = data.id;
      this.formData.name = data.name;
      this.formData.description = data.description;
      this.formData.product_category_id = data.product_category_id;
      this.formData.product_sub_category_id = data.product_sub_category_id;
      this.formType = "update";
      this.setProductSubCategoryList();
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
          this.saveProductSubSubCategoryData(this.formData)
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
          this.updateProductSubSubCategoryData(this.formData)
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
