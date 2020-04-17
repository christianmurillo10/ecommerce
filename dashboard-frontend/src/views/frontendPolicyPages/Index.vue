<template>
  <v-container fluid>
    <Alerts />
    <v-card>
      <v-card-title>
        <v-icon class="black--text">list_alt</v-icon>
        <span class="title">{{ formTitle }}</span>
      </v-card-title>
      <v-form ref="form" @submit.prevent="save" v-model="valid" lazy-validation>
        <v-card-text>
          <v-flex xs12 sm12 md12>
            <vue-editor v-model="description" :editorToolbar="customToolbar"></vue-editor>
          </v-flex>
        </v-card-text>
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
    VueEditor
  },

  data: () => ({
    customToolbar: [
      [{ 'header': [false, 1, 2, 3, 4, 5, 6, ] }],
      ['bold', 'italic', 'underline', 'strike'],
      // [{'align': ''}, {'align': 'center'}, {'align': 'right'}, {'align': 'justify'}],
      [{ 'header': 1 }, { 'header': 2 }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'list': 'check' }],
      [{ 'color': [] }, { 'background': [] }],
      ['clean'],
    ],
    description: "",
    valid: true,
  }),

  mounted() {},

  computed: {
    formTitle() {
      let title = "";
      let type = this.$route.params.type;

      switch(type) {
        case "1":
          title = "Terms and Conditions";
          break;
        case "2":
          title = "Privacy Policy";
          break;
        case "3":
          title = "Support Policy";
          break;
        case "4":
          title = "Return Policy";
          break;
        case "5":
          title = "Seller Policy";
          break;
      }
      return title;
    },
  },

  methods: {},
};
</script>
