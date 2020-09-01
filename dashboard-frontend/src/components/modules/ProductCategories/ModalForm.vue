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
              <v-layout wrap justify-center>
                <v-img :src="formData.icon_file_path" lazy-src="@/assets/images/no-image.png" height="32" width="32" contain></v-img>
              </v-layout>
            </v-flex>
            <v-flex xs12 sm12 md12>
              <v-layout wrap justify-center>
                <v-btn small outline @click="pickFileIcon">Upload Icon Image</v-btn>
                <input
                  type="file"
                  style="display: none"
                  ref="imageIcon"
                  accept="image/*"
                  @change="onFilePickedIcon"
                />
              </v-layout>
            </v-flex>
            <v-flex xs12 sm12 md12>
              <v-layout wrap justify-center>
                <v-img :src="formData.banner_file_path" lazy-src="@/assets/images/no-image.png" height="100" width="620" contain></v-img>
              </v-layout>
            </v-flex>
            <v-flex xs12 sm12 md12>
              <v-layout wrap justify-center>
                <v-btn small outline @click="pickFileBanner">Upload Banner Image</v-btn>
                <input
                  type="file"
                  style="display: none"
                  ref="imageBanner"
                  accept="image/*"
                  @change="onFilePickedBanner"
                />
              </v-layout>
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
    </v-card>
  </v-form>
</template>

<script>
import Mixins from "@/helpers/Mixins.js";
import { mapGetters, mapActions } from "vuex";

export default {
  mixins: [Mixins],

  data: () => ({
    defaultFormData: {
      name: "",
      description: "",
      icon_file: null,
      icon_file_path: require("@/assets/images/no-image.png"),
      icon_file_name: null,
      banner_file: null,
      banner_file_path: require("@/assets/images/no-image.png"),
      banner_file_name: null
    },
    formType: "new",
    formData: {
      name: "",
      description: "",
      icon_file: null,
      icon_file_path: require("@/assets/images/no-image.png"),
      icon_file_name: null,
      banner_file: null,
      banner_file_path: require("@/assets/images/no-image.png"),
      banner_file_name: null
    },
    valid: true
  }),

  computed: {
    ...mapGetters("productCategories", ["getProductCategoryById"]),
    formTitle() {
      return this.formType === "new" ? "Product Category - Create" : "Product Category - Update";
    },
    formIcon() {
      return this.formType === "new" ? "add_box" : "edit";
    }
  },

  methods: {
    ...mapActions("alerts", ["setAlert"]),
    ...mapActions("productCategories", {
      saveProductCategoryData: "saveData",
      updateProductCategoryData: "updateData"
    }),

    pickFileIcon() {
      this.$refs.imageIcon.click();
    },

    onFilePickedIcon(e) {
      const files = e.target.files;
      if (files[0] !== undefined) {
        this.formData.icon_file_name = files[0].name;
        if (this.formData.icon_file_name.lastIndexOf(".") <= 0) {
          return;
        }
        const fr = new FileReader();
        fr.readAsDataURL(files[0]);
        fr.addEventListener("load", () => {
          this.formData.icon_file_path = fr.result;
          this.formData.icon_file = files[0]; // this is an image file that can be sent to server...
        });
      } else {
        this.formData.icon_file = this.defaultFormData.icon_file;
        this.formData.icon_file_path = this.defaultFormData.icon_file_path;
        this.formData.icon_file_name = this.defaultFormData.icon_file_name;
      }
    },

    pickFileBanner() {
      this.$refs.imageBanner.click();
    },

    onFilePickedBanner(e) {
      const files = e.target.files;
      if (files[0] !== undefined) {
        this.formData.banner_file_name = files[0].name;
        if (this.formData.banner_file_name.lastIndexOf(".") <= 0) {
          return;
        }
        const fr = new FileReader();
        fr.readAsDataURL(files[0]);
        fr.addEventListener("load", () => {
          this.formData.banner_file_path = fr.result;
          this.formData.banner_file = files[0]; // this is an image file that can be sent to server...
        });
      } else {
        this.formData.banner_file = this.defaultFormData.banner_file;
        this.formData.banner_file_path = this.defaultFormData.banner_file_path;
        this.formData.banner_file_name = this.defaultFormData.banner_file_name;
      }
    },

    editItem(id) {
      let data = this.getProductCategoryById(id);
      this.formData.id = data.id;
      this.formData.name = data.name;
      this.formData.description = data.description;
      this.formData.icon_file_path = _.isNull(data.icon_file_name) ? require("@/assets/images/no-image.png") : `${process.env.VUE_APP_API_BACKEND}/productCategories/viewImage/${data.icon_file_name}`;
      this.formData.banner_file_path = _.isNull(data.banner_file_name) ? require("@/assets/images/no-image.png") : `${process.env.VUE_APP_API_BACKEND}/productCategories/viewImage/${data.banner_file_name}`;
      this.formType = "update";
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