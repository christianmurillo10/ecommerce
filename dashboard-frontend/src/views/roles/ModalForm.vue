<template>
  <v-card>
    <v-card-title>
      <v-icon class="black--text">{{ formIcon }}</v-icon><span class="title">{{ formTitle }}</span>
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
              <v-text-field
                v-model="formData.description"
                :rules="validateItem.descriptionRules"
                label="Description"
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
    ...mapGetters("roles", ["getRoleById"]),
    formTitle() {
      return this.formType === "new" ? "Role - Create" : "Role - Update";
    },
    formIcon() {
      return this.formType === "new" ? "add_box" : "edit";
    }
  },

  mounted() {
    this.getRoleData();
  },

  methods: {
    ...mapActions("alerts", ["setAlert"]),
    ...mapActions("roles", {
      getRoleData: "getData",
      saveRoleData: "saveData",
      updateRoleData: "updateData",
      deleteRoleData: "deleteData"
    }),

    editItem(id) {
      let data = this.getRoleById(id);
      this.formData.id = data.id;
      this.formData.name = data.name;
      this.formData.description = data.description;
      this.formType = "update";
    },

    deleteItem(id) {
      this.deleteRoleData(id)
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
          this.saveRoleData(this.formData)
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
          this.updateRoleData(this.formData)
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