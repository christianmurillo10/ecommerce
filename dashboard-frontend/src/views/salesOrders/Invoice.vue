<template>
  <v-container fluid>
    <v-card>
      <v-card-title>
        <v-icon class="black--text">list_alt</v-icon>
        <span class="title">Sales Order - Invoice</span>
        <v-spacer></v-spacer>
        <v-tooltip left>
          <template v-slot:activator="{ on }">
            <v-btn icon v-on="on" v-on:click="download">
              <v-icon color="green">save_alt</v-icon>
            </v-btn>
          </template>
          <span>Download</span>
        </v-tooltip>
        <v-flex xs12 sm12 md12 lg12>
          <v-layout wrap row>
            <v-spacer></v-spacer>
            <v-flex xs12 sm12 md2 class="px-1">
              <v-autocomplete
                :items="formatList"
                item-text="name"
                item-value="id"
                v-model="options.format"
                :rules="[rules.required]"
                label="Format"
              ></v-autocomplete>
            </v-flex>
            <v-flex xs12 sm12 md2 lg2 class="px-1">
              <v-autocomplete
                :items="orientationList"
                item-text="name"
                item-value="id"
                v-model="options.orientation"
                :rules="[rules.required]"
                label="Orientation"
              ></v-autocomplete>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-card-title>
      <v-card-text ref="content">
        <v-flex xs12 sm12 md12 lg12>
          <v-layout wrap row>
            <v-flex xs12 sm12 md6 lg6>
              <h1 class="pb-1">E-Commerce</h1>
              <div class="pb-1">E-commerce Sample Address</div>
              <div class="pb-1">ecommerce@example.com</div>
              <div class="pb-1">123-45-67 / 09123456789</div>
            </v-flex>
            <v-flex xs12 sm12 md6 lg6 class="text-xs-right">
              <h1>INVOICE</h1>
              <img :src="logo" height="100px" width="100px" />
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex xs12 sm12 md12 lg12 class="pb-3">
          <v-layout wrap row>
            <v-flex xs12 sm12 md6 lg6>
              <div class="font-weight-bold pb-1">BILLED TO:</div>
              <div class="pb-1">
                {{
                  setFullnameLastnameFirst(
                    customers.firstname,
                    customers.middlename,
                    customers.lastname
                  )
                }}
              </div>
              <div class="pb-1">{{ customers.email }}</div>
              <div class="pb-1">{{ customers.primary_address }}</div>
              <div class="pb-1">{{ customers.contact_no }}</div>
            </v-flex>
            <v-flex xs12 sm12 md6 lg6>
              <v-flex xs12 sm12 md12 lg12 class="text-xs-right pb-1">
                <v-layout wrap row>
                  <v-flex xs12 sm12 md4 lg6>
                    <div class="font-weight-bold">Invoice No.:</div>
                  </v-flex>
                  <v-flex xs12 sm12 md8 lg6>
                    <div>{{ salesOrders.order_no }}</div>
                  </v-flex>
                </v-layout>
              </v-flex>
              <v-flex xs12 sm12 md12 lg12 class="text-xs-right pb-1">
                <v-layout wrap row>
                  <v-flex xs12 sm12 md4 lg6>
                    <div class="font-weight-bold">Invoice Date:</div>
                  </v-flex>
                  <v-flex xs12 sm12 md8 lg6>
                    <div>{{ salesOrders.date_ordered }}</div>
                  </v-flex>
                </v-layout>
              </v-flex>
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex xs12 sm12 md12 lg12>
          <table id="details">
            <tr>
              <th class="text-xs-center" style="width: 30%">ITEM</th>
              <th class="text-xs-center">QUANTITY</th>
              <th class="text-xs-center">PRICE</th>
              <th class="text-xs-center">DISCOUNT</th>
              <th class="text-xs-center">AMOUNT</th>
            </tr>

            <tr v-for="(details, i) in salesOrders.salesOrderDetails" :key="i">
              <td>{{ details.products.name }}</td>
              <td class="text-xs-center">{{ details.quantity }}</td>
              <td class="text-xs-right">{{ details.rate_amount }}</td>
              <td class="text-xs-right">{{ details.discount_amount }}</td>
              <td class="text-xs-right">{{ details.amount }}</td>
            </tr>
          </table>
        </v-flex>
        <v-flex xs12 sm12 md12 lg12 class="pt-3">
          <v-layout wrap row>
            <v-flex xs12 sm12 md6 lg6>
              <v-container fill-height justify-center>
                <div>Thank you for your business!</div>
              </v-container>
            </v-flex>
            <v-flex xs12 sm12 md6 lg6>
              <v-flex xs12 sm12 md12 lg12 class="text-xs-right pb-1">
                <v-layout wrap row>
                  <v-flex xs12 sm12 md4 lg6>
                    <div class="font-weight-bold">SUBTOTAL:</div>
                  </v-flex>
                  <v-flex xs12 sm12 md8 lg6>
                    <div>{{ salesOrders.sub_total_amount }}</div>
                  </v-flex>
                </v-layout>
              </v-flex>
              <v-flex xs12 sm12 md12 lg12 class="text-xs-right pb-1">
                <v-layout wrap row>
                  <v-flex xs12 sm12 md4 lg6>
                    <div class="font-weight-bold">VAT:</div>
                  </v-flex>
                  <v-flex xs12 sm12 md8 lg6>
                    <div>{{ salesOrders.vat_amount }}</div>
                  </v-flex>
                </v-layout>
              </v-flex>
              <v-flex xs12 sm12 md12 lg12 class="text-xs-right pb-1">
                <v-layout wrap row>
                  <v-flex xs12 sm12 md4 lg6>
                    <div class="font-weight-bold">TOTAL DISCOUNT:</div>
                  </v-flex>
                  <v-flex xs12 sm12 md8 lg6>
                    <div>{{ salesOrders.total_discount_amount }}</div>
                  </v-flex>
                </v-layout>
              </v-flex>
              <v-divider class="pb-1"></v-divider>
              <v-flex xs12 sm12 md12 lg12 class="text-xs-right pb-1">
                <v-layout wrap row>
                  <v-flex xs12 sm12 md4 lg6>
                    <div class="font-weight-bold">TOTAL AMOUNT:</div>
                  </v-flex>
                  <v-flex xs12 sm12 md8 lg6>
                    <div>{{ salesOrders.total_amount }}</div>
                  </v-flex>
                </v-layout>
              </v-flex>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import html2pdf from "html2pdf.js";
import Mixins from "@/helpers/Mixins.js";
import { mapGetters, mapActions, mapMutations } from "vuex";

export default {
  mixins: [Mixins],

  data: () => ({
    logo: "/img/logo.png",
    salesOrders: "",
    customers: "",
    options: {
      filename: "",
      format: "a4",
      orientation: "portrait",
    },
    formatList: [
      {
        id: "a4",
        name: "A4",
      },
      {
        id: "legal",
        name: "Legal",
      },
      {
        id: "letter",
        name: "Letter",
      },
    ],
    orientationList: [
      {
        id: "portrait",
        name: "Portrait",
      },
      {
        id: "landscape",
        name: "Landscape",
      },
    ],
  }),

  created() {
    this.getSalesOrderDataById(this.$route.params.salesOrderId).then(
      (response) => {
        this.salesOrders = response.data.result;
        this.customers = this.salesOrders.customers;
        this.options.filename = this.salesOrders.order_no;
      }
    );
  },

  methods: {
    ...mapActions("salesOrders", {
      getSalesOrderDataById: "getDataById",
    }),

    download() {
      html2pdf(this.$refs.content, {
        margin: [0.8, 0.5],
        filename: this.options.filename,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { dpi: 192, letterRendering: true },
        jsPDF: {
          unit: "in",
          format: this.options.format,
          orientation: this.options.orientation,
        },
      });
    },
  },
};
</script>

<style lang="css" scoped>
#details {
  border-collapse: collapse;
  width: 100%;
}

#details td, #details th {
  border: 1px solid #ddd;
  padding: 5px;
}

#details tr:nth-child(even){background-color: #f2f2f2;}

#details tr:hover {background-color: #ddd; color: #000;}

#details th {
  text-align: left;
}
</style>
