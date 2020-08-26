<template>
  <v-card>
    <v-card-title>
      <v-icon class="black--text">{{ formIcon }}</v-icon>
      <span class="title">{{ formTitle }}</span>
    </v-card-title>
    <v-form ref="form" @submit.prevent="save" v-model="valid" lazy-validation>
      <v-card-text>
        <v-container grid-list-md>
          <v-layout wrap>
            <v-flex xs12 sm12 md12>
              <v-autocomplete
                :items="getProductVariationList"
                item-text="name"
                item-value="name"
                v-model="formData.title"
                label="Variation"
                persistent-hint
                :rules="[rules.required]"
                required
              ></v-autocomplete>
            </v-flex>
            <v-flex xs12 sm12 md12>
              <v-combobox
                v-model="formData.values"
                :items="getFilteredProductVariationDetailList"
                item-text="name"
                item-value="name"
                label="Details"
                multiple
                chips
                deletable-chips
                :rules="[rules.required]"
                :disabled="getFilteredProductVariationDetailList.length ? false : true"
              ></v-combobox>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" flat @click="close">Cancel</v-btn>
        <v-btn color="blue darken-1" type="submit" flat :disabled="!valid">
          Save
        </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script>
import Mixins from "@/helpers/Mixins.js";
import { mapState, mapGetters, mapActions } from "vuex";

export default {
  mixins: [Mixins],

  data: () => ({
    dialogConfirmation: false,
    defaultFormData: {
      title: "",
      values: [],
    },
    formType: "new",
    formData: {
      title: "",
      values: [],
    },
    valid: true,
  }),

  created() {
    this.getProductVariationData();
  },

  computed: {
    ...mapGetters("productVariations", ["getProductVariationList"]),
    ...mapGetters("productVariants", ["getProductVariantById"]),
    ...mapGetters("productVariationDetails", [
      "getFilteredProductVariationDetailList",
    ]),

    formTitle() {
      return this.formType === "new"
        ? "Product Variant - Create"
        : "Product Variant - Update";
    },
    formIcon() {
      return this.formType === "new" ? "add_box" : "edit";
    },
  },

  watch: {
    "formData.title": function(val) {
      const productVariation = this.getProductVariationList.find(element => element.name == val);
      const productVariationId = _.isUndefined(productVariation) ? null : productVariation.id;
      this.getProductVariationDetailsDataByProductVariationId(productVariationId);
    },
  },

  methods: {
    ...mapActions("alerts", ["setAlert"]),
    ...mapActions("productVariations", { getProductVariationData: "getData" }),
    ...mapActions("productVariationDetails", {
      getProductVariationDetailsDataByProductVariationId:
        "getDataByProductVariationId",
    }),
    ...mapActions("productVariants", {
      saveProductVariantData: "saveData",
      updateProductVariantData: "updateData"
    }),

    editItem(id) {
      let data = this.getProductVariantById(id);
      this.formData.id = data.id;
      this.formData.title = data.title;
      this.formData.values = JSON.parse(data.values);
      this.formData.product_id = data.product_id;
      this.formType = "update";
    },

    close() {
      this.$emit("setDialog", false);
      this.formType = "new";
      setTimeout(() => {
        this.formData = Object.assign({}, this.defaultFormData);
      }, 300);
    },

    async save() {
      let productId = this.$route.params.id;
      // save variant
      if (this.formType === "new") {
        this.formData.product_id = productId;
        this.saveProductVariantData(this.formData)
          .then((response) => {
            let obj = {
              alert: true,
              type: "success",
              message: response.data.message,
            };

            if (!response.data.result) obj.type = "error";
            this.setAlert(obj);
          })
          .catch((err) => console.log(err));
      } else if (this.formType === "update") {
        this.updateProductVariantData(this.formData)
          .then((response) => {
            let obj = {
              alert: true,
              type: "success",
              message: response.data.message,
            };

            if (!response.data.result) obj.type = "error";
            this.setAlert(obj);
          })
          .catch((err) => console.log(err));
      }
      this.close();
    },
  },
};
</script>
