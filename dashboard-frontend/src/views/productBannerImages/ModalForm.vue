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
              <v-layout wrap justify-center>
                <img :src="formData.file_path" height="200" />
              </v-layout>
            </v-flex>
            <v-flex xs12 sm12 md12>
              <v-layout wrap justify-center>
                <v-btn small @click="pickFile">Upload Image</v-btn>
                <input
                  type="file"
                  style="display: none"
                  ref="image"
                  accept="image/*"
                  @change="onFilePicked"
                />
              </v-layout>
            </v-flex>
            <v-flex xs12 sm12 md12>
              <v-text-field
                v-model="formData.order"
                :rules="validateItem.orderRules"
                label="Order"
                type="number"
                required
              ></v-text-field>
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
      file: null,
      file_path: require("../../assets/images/no-image.png"),
      file_name: null,
      order: null,
      product_id: null
    },
    formType: "new",
    formData: {
      file: null,
      file_path: require("../../assets/images/no-image.png"),
      file_name: null,
      order: null,
      product_id: null
    },
    valid: true,
    validateItem: {
      orderRules: [
        v => !!v || "Order is required",
      ]
    }
  }),

  computed: {
    ...mapGetters("productBannerImages", ["getProductBannerImageById"]),
    formTitle() {
      return this.formType === "new" ? "New Product Banner Image" : "Edit Product Banner Image";
    },
    formIcon() {
      return this.formType === "new" ? "add_box" : "edit";
    }
  },

  methods: {
    ...mapActions("alerts", ["setAlert"]),
    ...mapActions("productBannerImages", {
      saveProductBannerImageData: "saveData",
      updateProductBannerImageData: "updateData",
      deleteProductBannerImageData: "deleteData"
    }),

    pickFile() {
      this.$refs.image.click();
    },

    onFilePicked(e) {
      const files = e.target.files;
      if (files[0] !== undefined) {
        this.formData.file_name = files[0].name;
        if (this.formData.file_name.lastIndexOf(".") <= 0) {
          return;
        }
        const fr = new FileReader();
        fr.readAsDataURL(files[0]);
        fr.addEventListener("load", () => {
          this.formData.file_path = fr.result;
          this.formData.file = files[0]; // this is an image file that can be sent to server...
        });
      } else {
        this.formData.file = this.defaultFormData.file;
        this.formData.file_path = this.defaultFormData.file_path;
        this.formData.file_name = this.defaultFormData.file_name;
      }
    },

    editItem(id) {
      let data = this.getProductBannerImageById(id);
      this.formData.id = data.id;
      this.formData.order = data.order;
      this.formData.file_path = process.env.VUE_APP_API_BACKEND+ '/productBannerImage/viewImage/' + data.file_name;
      this.formType = "update";
    },

    deleteItem(id) {
      this.deleteProductBannerImageData(id)
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
          this.formData.product_id = this.$route.params.id;
          this.saveProductBannerImageData(this.formData)
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
          this.updateProductBannerImageData(this.formData)
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