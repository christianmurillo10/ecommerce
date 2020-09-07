<template>
  <v-form ref="form" @submit.prevent="save" v-model="valid" lazy-validation>
    <v-card>
      <v-card-title>
        <v-icon class="black--text">{{ formIcon }}</v-icon
        ><span class="title">{{ formTitle }}</span>
      </v-card-title>
      <v-card-text>
        <v-container grid-list-md>
          <v-layout wrap>
            <v-flex xs12 sm12 md12>
              <v-text-field
                v-model="formData.quantity"
                :rules="[rules.required]"
                label="Quantity"
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
        <v-btn color="blue darken-1" type="submit" flat :disabled="!valid">
          Save
        </v-btn>
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
      quantity: null
    },
    formData: {
      quantity: null
    },
    valid: true,
  }),

  computed: {
    ...mapGetters("inventories", ["getInventoryById"]),
    formTitle() {
      return "Inventory - Add Stock";
    },
    formIcon() {
      return "add_box";
    },
  },

  methods: {
    ...mapActions("alerts", ["setAlert"]),
    ...mapActions("inventories", {
      addStockInventoryData: "addStockData",
    }),

    editItem(id) {
      let data = this.getInventoryById(id);
      this.formData.id = data.id;
      this.formData.quantity = 1;
    },

    close() {
      this.$emit("setDialog", false);
      setTimeout(() => {
        this.formData = Object.assign({}, this.defaultFormData);
      }, 300);
    },

    save() {
      if (this.$refs.form.validate()) {
        this.addStockInventoryData(this.formData)
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
        this.close();
      }
    },
  },
};
</script>
