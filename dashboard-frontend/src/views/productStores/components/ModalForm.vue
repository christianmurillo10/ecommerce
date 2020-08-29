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
              <v-layout wrap justify-center>
                <v-img :src="formData.file_path" lazy-src="@/assets/images/no-image.png" height="80" width="120" contain></v-img>
              </v-layout>
            </v-flex>
            <v-flex xs12 sm12 md12>
              <v-layout wrap justify-center>
                <v-btn small outline @click="pickFile">Upload Image</v-btn>
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
      file: null,
      file_path: require("@/assets/images/no-image.png"),
      file_name: null
    },
    formType: "new",
    formData: {
      name: "",
      description: "",
      file: null,
      file_path: require("@/assets/images/no-image.png"),
      file_name: null
    },
    valid: true
  }),

  computed: {
    ...mapGetters("productStores", ["getProductStoreById"]),
    formTitle() {
      return this.formType === "new" ? "Product Store - Create" : "Product Store - Update";
    },
    formIcon() {
      return this.formType === "new" ? "add_box" : "edit";
    }
  },

  methods: {
    ...mapActions("alerts", ["setAlert"]),
    ...mapActions("productStores", {
      saveProductStoreData: "saveData",
      updateProductStoreData: "updateData"
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
      let data = this.getProductStoreById(id);
      this.formData.id = data.id;
      this.formData.name = data.name;
      this.formData.description = data.description;
      this.formData.file_path = _.isNull(data.file_name) ? require("@/assets/images/no-image.png") : `${process.env.VUE_APP_API_BACKEND}/productStores/viewImage/${data.file_name}`;
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
          this.formData.product_id = this.$route.params.id;
          this.saveProductStoreData(this.formData)
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
          this.updateProductStoreData(this.formData)
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
