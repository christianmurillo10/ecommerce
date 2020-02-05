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
                :rules="validateItem.descriptionRules"
                label="Description"
              ></v-textarea>
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
      description: ""
    },
    formType: "new",
    formData: {
      name: null,
      description: ""
    },
    valid: true,
    validateItem: {
      nameRules: [
        v => !!v || "Name is required",
        v => (v && v.length <= 50) || "Name must be less than 50 characters"
      ],
      descriptionRules: [
        v => (v && v.length <= 500) || "Description must be less than 500 characters"
      ]
    }
  }),

  computed: {
    ...mapGetters("productCategories", ["getProductCategoryById"]),
    formTitle() {
      return this.formType === "new" ? "New Product Category" : "Edit Product Category";
    },
    formIcon() {
      return this.formType === "new" ? "add_box" : "edit";
    }
  },

  methods: {
    ...mapActions("alerts", ["setAlert"]),
    ...mapActions("productCategories", {
      saveProductCategoryData: "saveData",
      updateProductCategoryData: "updateData",
      deleteProductCategoryData: "deleteData"
    }),

    editItem(id) {
      let data = this.getProductCategoryById(id);
      this.formData.id = data.id;
      this.formData.name = data.name;
      this.formData.description = data.description;
      this.formType = "update";
    },

    deleteItem(id) {
      this.deleteProductCategoryData(id)
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
          this.saveProductCategoryData(this.formData)
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
          this.updateProductCategoryData(this.formData)
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
  }
};
</script>