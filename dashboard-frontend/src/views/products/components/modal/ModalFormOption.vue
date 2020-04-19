<template>
  <v-card>
    <v-card-title>
      <v-icon class="black--text">{{ formIcon }}</v-icon><span class="title">{{ formTitle }}</span>
    </v-card-title>
    <v-form ref="form" @submit.prevent="displayModalConfirmation" v-model="valid" lazy-validation>
      <v-card-text>
        <v-container grid-list-md>
          <v-layout wrap>
            <v-flex xs12 sm12 md12>
              <v-text-field
                v-model="formData.title"
                :rules="[rules.required, rules.max50Chars]"
                label="Title"
                required
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm12 md12>
              <v-combobox
                multiple
                v-model="formData.values"
                :rules="[rules.required]"
                label="Values"
                append-icon
                chips
                deletable-chips
                class="tag-input"
              >
              </v-combobox>
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
    <v-dialog v-model="dialogConfirmation" persistent max-width="350">
      <v-card>
        <v-card-title class="title">Confirmation</v-card-title>
        <v-card-text>
          <span>Are you sure you want to save?</span>
          <br/><br/>
          <span class="red--text font-weight-light font-italic">NOTE: Once you save, your variant list will be reset.</span>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn small outline color="error" @click="dialogConfirmation = false">Cancel</v-btn>
          <v-btn small outline color="success" @click="save()">Confirm</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
      values: "",
      product_id: ""
    },
    formType: "new",
    formData: {
      title: "",
      values: "",
      product_id: ""
    },
    valid: true
  }),

  computed: {
    ...mapGetters("productOptions", ["getProductOptionById"]),
    formTitle() {
      return this.formType === "new" ? "Product Option - Create" : "Product Option - Update";
    },
    formIcon() {
      return this.formType === "new" ? "add_box" : "edit";
    },
    ...mapState("inventories", ["inventoryList"])
  },

  methods: {
    ...mapActions("alerts", ["setAlert"]),
    ...mapActions("inventories", { 
      getInventoryDataByProductId: "getDataByProductId",
      deleteAllInventoryDataByProducyId: "deleteAllDataByProducyId"
    }),
    ...mapActions("productOptions", {
      saveProductOptionData: "saveData",
      updateProductOptionData: "updateData"
    }),

    editItem(id) {
      let data = this.getProductOptionById(id);
      this.formData.id = data.id;
      this.formData.title = data.title;
      this.formData.values = data.values.split(',');
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

    displayModalConfirmation() {
      if (this.$refs.form.validate()) {
        if (this.inventoryList.length === 0) this.save();
        else this.dialogConfirmation = true;
      }
    },

    async save() {
      let productId = this.$route.params.id;
      // bulk delete of variants
      if (this.inventoryList.length > 0) {
        let deleteResponse = await this.deleteAllInventoryDataByProducyId(productId);
        if (deleteResponse.data.result) this.getInventoryDataByProductId(productId);
      }
      // save options
      if (this.formType === "new") {
        this.formData.product_id = productId;
        this.saveProductOptionData(this.formData)
          .then(response => {
            let obj = {
              alert: true,
              type: "success",
              message: response.data.message
            };
            
            if (!response.data.result) obj.type = "error"
            this.setAlert(obj);
          })
          .catch(err => console.log(err));
      } else if (this.formType === "update") {
        this.updateProductOptionData(this.formData)
          .then(response => {
            let obj = {
              alert: true,
              type: "success",
              message: response.data.message
            };
            
            if (!response.data.result) obj.type = "error"
            this.setAlert(obj);
          })
          .catch(err => console.log(err));
      }
      this.close();
    }
  }
};
</script>