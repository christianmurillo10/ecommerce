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
                v-model="formData.card_no"
                :rules="[rules.required, rules.max50Chars]"
                label="Card No."
                required
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm12 md12>
              <v-text-field
                v-model="formData.security_code"
                :rules="[rules.required, rules.max50Chars]"
                label="Security Code"
                required
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm12 md12>
              <v-text-field
                v-model="formData.date_expired"
                :rules="[rules.required, rules.max50Chars]"
                label="Date Expired (MM/YY)"
                required
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm12 md12>
              <v-text-field
                v-model="formData.firstname"
                :rules="[rules.required, rules.max50Chars]"
                label="Firstname"
                required
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm12 md12>
              <v-text-field
                v-model="formData.lastname"
                :rules="[rules.required, rules.max50Chars]"
                label="Lastname"
                required
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm12 md12>
              <v-autocomplete
                v-model="formData.bank_id"
                :items="getBankList"
                item-text="name"
                item-value="id"
                :rules="[rules.required]"
                label="Bank"
                required
              ></v-autocomplete>
            </v-flex>
            <v-flex xs12 sm12 md12>
              <v-autocomplete
                v-model="formData.type"
                :items="creditDebitTypeList"
                item-text="name"
                item-value="id"
                :rules="[rules.required]"
                label="Type"
                required
              ></v-autocomplete>
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
import { mapGetters, mapActions, mapMutations } from "vuex";

export default {
  mixins: [Mixins],

  data: () => ({
    defaultFormData: {
      card_no: "",
      security_code: "",
      firstname: "",
      lastname: "",
      bank_id: "",
      date_expired: "",
      type: ""
    },
    formType: "new",
    formData: {
      card_no: "",
      security_code: "",
      firstname: "",
      lastname: "",
      bank_id: "",
      date_expired: "",
      type: ""
    },
    valid: true
  }),

  computed: {
    ...mapGetters("customerCreditDebitCards", ["getCustomerCreditDebitCardById"]),
    ...mapGetters("banks", ["getBankList"]),
    formTitle() {
      return this.formType === "new" ? "Customer Credit/Debit Card - Create" : "Customer Credit/Debit Card - Update";
    },
    formIcon() {
      return this.formType === "new" ? "add_box" : "edit";
    }
  },

  created() {
    this.getBankData();
  },

  methods: {
    ...mapActions("alerts", ["setAlert"]),
    ...mapActions("banks", { getBankData: "getData" }),
    ...mapActions("customerCreditDebitCards", {
      saveCustomerCreditDebitCardData: "saveData",
      updateCustomerCreditDebitCardData: "updateData"
    }),

    editItem(id) {
      let data = this.getCustomerCreditDebitCardById(id);
      this.formData.id = data.id;
      this.formData.card_no = data.card_no;
      this.formData.security_code = data.security_code;
      this.formData.firstname = data.firstname;
      this.formData.lastname = data.lastname;
      this.formData.bank_id = data.bank_id;
      this.formData.date_expired = data.date_expired;
      this.formData.type = data.type;
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
          this.formData.customer_id = this.$route.params.customerId;
          this.saveCustomerCreditDebitCardData(this.formData)
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
          this.updateCustomerCreditDebitCardData(this.formData)
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