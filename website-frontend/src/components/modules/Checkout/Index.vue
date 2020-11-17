<template>
  <v-form ref="form" @submit.prevent="save" v-model="valid" lazy-validation>
    <v-card flat>
      <v-card-title>Checkout</v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-stepper v-model="step" vertical>
          <v-stepper-step :complete="step > 1" step="1">
            Billing Details
          </v-stepper-step>

          <v-stepper-content step="1">
            <v-card flat class="mb-5">
              <div>
                <span class="font-weight-bold">
                  Firstname:
                </span>
                <span>{{ customerInfo.firstname }}</span>
              </div>
              <div>
                <span class="font-weight-bold">
                  Middlename:
                </span>
                <span>{{ customerInfo.middlename }}</span>
              </div>
              <div>
                <span class="font-weight-bold">
                  Lastname:
                </span>
                <span>{{ customerInfo.lastname }}</span>
              </div>
              <div>
                <span class="font-weight-bold">
                  Email:
                </span>
                <span>{{ customerInfo.email }}</span>
              </div>
              <div>
                <span class="font-weight-bold">
                  Contact No.:
                </span>
                <span>{{ customerInfo.contact_no }}</span>
              </div>
              <div>
                <span class="font-weight-bold">
                  Address:
                </span>
                <span>{{ customerInfo.primary_address }}</span>
              </div>
            </v-card>
            <v-btn color="primary" @click="step = 2">
              Continue
            </v-btn>
          </v-stepper-content>

          <v-stepper-step :complete="step > 2" step="2">
            Shipping Details
          </v-stepper-step>

          <v-stepper-content step="2">
            <v-card flat class="my-5">
              <v-flex xs12 sm12 md6>
                <v-autocomplete
                  :items="shippingMethodList"
                  item-text="name"
                  item-value="id"
                  v-model="formData.shippingDetails.shipping_method_id"
                  label="Shipping Method"
                  outlined
                  dense
                ></v-autocomplete>
              </v-flex>
              <v-flex xs12 sm12 md6>
                <v-textarea
                  v-model="formData.shippingDetails.address"
                  :rules="[rules.required, rules.max255Chars]"
                  label="Address"
                  auto-grow
                  rows="3"
                  outlined
                  dense
                  required
                ></v-textarea>
              </v-flex>
            </v-card>
            <v-btn color="primary" @click="step = 3">
              Continue
            </v-btn>
            <v-btn text @click="step = 1">
              Cancel
            </v-btn>
          </v-stepper-content>

          <v-stepper-step :complete="step > 3" step="3">
            Payment
          </v-stepper-step>

          <v-stepper-content step="3">
            <v-card flat class="my-5 mx-2">
              <v-radio-group v-model="formData.payment_method_type">
                <v-radio
                  v-for="(paymentMethod, i) in paymentMethodTypeList"
                  :key="i"
                  :value="paymentMethod.id"
                >
                  <template v-slot:label>
                    <v-card class="pa-5" width="200">
                      <div>{{ paymentMethod.name }}</div>
                    </v-card>
                  </template>
                </v-radio>
              </v-radio-group>
            </v-card>
            <v-btn
              color="primary"
              @click="step = 4"
              type="submit"
              :disabled="!valid"
            >
              Continue
            </v-btn>
            <v-btn text @click="step = 2">
              Cancel
            </v-btn>
          </v-stepper-content>
        </v-stepper>
      </v-card-text>
    </v-card>
  </v-form>
</template>

<script>
import Mixins from "@/helpers/Mixins.js";
import { mapState, mapActions, mapMutations } from "vuex";

export default {
  mixins: [Mixins],

  data: () => ({
    valid: true,
    step: 1,
    defaultFormData: "",
    formData: {
      date_ordered: new Date().toISOString().substr(0, 10),
      payment_method_type: null,
      shippingDetails: {
        address: "",
        shipping_method_id: "",
      },
    },
  }),

  created() {
    this.getShippingMethodData();
  },

  computed: {
    ...mapState("customerAuthentication", ["customerInfo"]),
    ...mapState("shippingMethods", ["shippingMethodList"]),
  },

  methods: {
    ...mapMutations("loading", { setLoading: "SET_LOADING" }),
    ...mapActions("shippingMethods", {
      getShippingMethodData: "getData",
    }),
    ...mapActions("salesOrders", {
      saveSalesOrderData: "saveData",
    }),

    save() {
      if (this.$refs.form.validate()) {
        this.setLoading({ dialog: true, text: "Please wait" });
        this.saveSalesOrderData(this.formData)
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
            this.setLoading({ dialog: false, text: "" });
          })
          .catch((err) => console.log(err));
      }
    },
  },
};
</script>
