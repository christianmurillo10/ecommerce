<template>
  <v-container fluid>
    <Alerts />
    <v-card>
      <v-card-title>
        <v-icon class="black--text">list_alt</v-icon>
        <span class="title">{{ title }}</span>
      </v-card-title>
      <v-form ref="form" @submit.prevent="save" v-model="valid" lazy-validation>
        <v-card-text>
          <v-flex xs12 sm12 md12>
            <vue-editor
              v-model="formData.description"
              :editorToolbar="customToolbar"
            ></vue-editor>
          </v-flex>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click="setFormType">Reset</v-btn>
          <v-btn color="blue darken-1" type="submit" flat :disabled="!valid">
            Save
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-container>
</template>

<script>
import Alerts from "@/components/utilities/Alerts";
import { mapState, mapActions } from "vuex";
import { VueEditor } from "vue2-editor";

export default {
  components: {
    Alerts,
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
    title: "",
    formType: "new",
    formData: {
      id: null,
      description: "",
      type: null,
    },
    valid: true,
  }),

  mounted() {
    this.setTypeValue();
    this.setFormType();
  },

  computed: {},

  watch: {
    "$route.params.type": function() {
      this.setTypeValue();
      this.setFormType();
    },
  },

  methods: {
    ...mapActions("alerts", ["setAlert"]),
    ...mapActions("frontendPolicyPages", {
      getFrontendPolicyPageDataByType: "getDataByType",
      saveFrontendPolicyPageData: "saveData",
      updateFrontendPolicyPageData: "updateData",
    }),

    setTypeValue() {
      let type = this.$route.params.type;

      switch (type) {
        case "terms":
          this.formData.type = "1";
          this.title = "Terms and Conditions";
          break;
        case "privacy":
          this.formData.type = "2";
          this.title = "Privacy Policy";
          break;
        case "support":
          this.formData.type = "3";
          this.title = "Support Policy";
          break;
        case "return":
          this.formData.type = "4";
          this.title = "Return Policy";
          break;
        case "seller":
          this.formData.type = "5";
          this.title = "Seller Policy";
          break;
      }
    },

    setFormType() {
      this.getFrontendPolicyPageDataByType(this.formData.type).then(
        (response) => {
          const result = response.result;
          if (!_.isEmpty(result)) {
            this.formType = "update";
            this.formData.id = result.id;
            this.formData.description = result.description;
          } else {
            this.formType = "new";
            this.formData.id = null;
            this.formData.description = "";
          }
        }
      );
    },

    save() {
      if (this.$refs.form.validate()) {
        if (this.formData.description !== "") {
          if (this.formType === "new") {
            this.saveFrontendPolicyPageData(this.formData)
              .then((response) => {
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
                  this.formType = "update";
                  this.formData.id = response.result.id;
                }

                this.setAlert(obj);
              })
              .catch((err) => console.log(err));
          } else if (this.formType === "update") {
            this.updateFrontendPolicyPageData(this.formData)
              .then((response) => {
                let obj = {
                  alert: true,
                  type: "success",
                  message: [response.message],
                  outline: true,
                };

                if (response.status === "error") {
                  obj.type = "error";
                  obj.message = response.errors;
                }

                this.setAlert(obj);
              })
              .catch((err) => console.log(err));
          }
        }
      }
    },
  },
};
</script>
