<template>
  <v-container fluid>
    <Alerts />
    <v-divider></v-divider>
    <v-toolbar color="#EEEEEE" dense>
      <v-toolbar-title>
        <v-icon class="black--text">view_list</v-icon>Products - View
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <router-link to="/products" tag="button">
        <v-icon>arrow_back</v-icon>
      </router-link>
      <v-dialog v-model="dialogImage" max-width="500px">
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on">
            <v-icon>camera_alt</v-icon>
          </v-btn>
        </template>
        <ModalImageForm ref="modalImageForm" @setDialog="setDialogImage" />
      </v-dialog>
      <v-dialog v-model="dialogAvailableSize" max-width="500px">
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on">
            <v-icon>format_line_spacing</v-icon>
          </v-btn>
        </template>
        <ModalProductAvailableSizeForm ref="modalProductAvailableSizeForm" @setDialog="setDialogAvailableSize" />
      </v-dialog>
      <v-dialog v-model="dialogDiscountedPriceRange" max-width="500px">
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on">
            <v-icon>money</v-icon>
          </v-btn>
        </template>
        <ModalProductDiscountedPriceRangeForm ref="modalProductDiscountedPriceRangeForm" @setDialog="setDialogDiscountedPriceRange" />
      </v-dialog>
    </v-toolbar>
    <v-card class="mx-auto my-12" :elevation="3" max-width="auto">
      <v-container>
        <v-flex xs12 sm12 md12 lg12>
          <v-list dense>
            <v-layout wrap>
              <v-flex xs12 sm12 md3 lg3>
                <v-list-tile>
                  <v-list-tile-title>
                    <h3>Product Details:</h3>
                  </v-list-tile-title>
                </v-list-tile>
                <v-list-tile>
                  <v-list-tile-content>Name:</v-list-tile-content>
                  <v-list-tile-content class="align-end">{{ productDetails.name }}</v-list-tile-content>
                </v-list-tile>
                <v-list-tile>
                  <v-list-tile-content>Description:</v-list-tile-content>
                  <v-list-tile-content class="align-end">{{ productDetails.description }}</v-list-tile-content>
                </v-list-tile>
                <!-- <v-list-tile>
                  <v-list-tile-content>Category:</v-list-tile-content>
                  <v-list-tile-content class="align-end">{{ productDetails.productCategories.name }}</v-list-tile-content>
                </v-list-tile>-->
                <v-list-tile>
                  <v-list-tile-content>Stock:</v-list-tile-content>
                  <v-list-tile-content class="align-end">{{ inventoryDetails.stock_available }}</v-list-tile-content>
                </v-list-tile>
                <v-list-tile>
                  <v-list-tile-content>Price:</v-list-tile-content>
                  <v-list-tile-content class="align-end">{{ productDetails.price }}</v-list-tile-content>
                </v-list-tile>
              </v-flex>
              <v-flex xs12 sm12 md8 lg8 offset-m1 offset-lg1>
                <v-tabs fixed-tabs show-arrows>
                  <v-tabs-slider color="yellow"></v-tabs-slider>
                  <v-tab
                    v-for="(header, i) in tabHeaders"
                    :key="i"
                    :href="'#tab-' + header.key"
                  >{{ header.title }}</v-tab>

                  <v-tabs-items>
                    <v-tab-item value="tab-images">
                      <v-list-tile>
                        <v-list-tile-title>
                          <h3>Images:</h3>
                        </v-list-tile-title>
                      </v-list-tile>

                      <v-data-table
                        :headers="headerImages"
                        :items="productImageList"
                        class="elevation-1"
                      >
                        <template v-slot:items="props">
                          <td class="text-xs-left">
                            <img :src="props.item.file_path" height="150" />
                          </td>
                          <td class="text-xs-left">{{ props.item.color }}</td>
                          <td class="text-xs-left">{{ props.item.order }}</td>
                          <td class="justify-center layout px-0">
                            <v-icon small class="mr-2" @click="editItemImage(props.item.id)">edit</v-icon>
                            <v-icon small @click="deleteItemImage(props.item.id)">delete</v-icon>
                          </td>
                        </template>
                        <template v-slot:no-data>
                          <p class="justify-center layout px-0">No data found!</p>
                        </template>
                      </v-data-table>
                    </v-tab-item>

                    <v-tab-item value="tab-sizes">
                      <v-list-tile>
                        <v-list-tile-title>
                          <h3>Sizes:</h3>
                        </v-list-tile-title>
                      </v-list-tile>

                      <v-data-table
                        :headers="headerAvailableSizes"
                        :items="productAvailableSizeList"
                        class="elevation-1"
                      >
                        <template v-slot:items="props">
                          <td class="text-xs-left">{{ props.item.name }}</td>
                          <td class="justify-center layout px-0">
                            <v-icon small class="mr-2" @click="editItemAvailableSize(props.item.id)">edit</v-icon>
                            <v-icon small @click="deleteItemAvailableSize(props.item.id)">delete</v-icon>
                          </td>
                        </template>
                        <template v-slot:no-data>
                          <p class="justify-center layout px-0">No data found!</p>
                        </template>
                      </v-data-table>
                    </v-tab-item>
                    
                    <v-tab-item value="tab-discounted-price-range">
                      <v-list-tile>
                        <v-list-tile-title>
                          <h3>Discounted Price Range:</h3>
                        </v-list-tile-title>
                      </v-list-tile>

                      <v-data-table
                        :headers="headerDiscountedPriceRanges"
                        :items="productDiscountedPriceRangeList"
                        class="elevation-1"
                      >
                        <template v-slot:items="props">
                          <td class="text-xs-left">{{ props.item.quantity_from }}</td>
                          <td class="text-xs-left">{{ props.item.quantity_to }}</td>
                          <td class="text-xs-left">{{ props.item.price }}</td>
                          <td class="justify-center layout px-0">
                            <v-icon small class="mr-2" @click="editItemDiscountedPriceRange(props.item.id)">edit</v-icon>
                            <v-icon small @click="deleteItemDiscountedPriceRange(props.item.id)">delete</v-icon>
                          </td>
                        </template>
                        <template v-slot:no-data>
                          <p class="justify-center layout px-0">No data found!</p>
                        </template>
                      </v-data-table>
                    </v-tab-item>
                  </v-tabs-items>
                </v-tabs>
              </v-flex>
            </v-layout>
          </v-list>
        </v-flex>
      </v-container>
    </v-card>
  </v-container>
</template>

<script>
import Alerts from "@/components/utilities/Alerts";
import ModalImageForm from "./ModalImageForm";
import ModalProductAvailableSizeForm from "./ModalProductAvailableSizeForm";
import ModalProductDiscountedPriceRangeForm from "./ModalProductDiscountedPriceRangeForm";
import { mapState, mapActions } from "vuex";

export default {
  components: {
    Alerts,
    ModalImageForm,
    ModalProductAvailableSizeForm,
    ModalProductDiscountedPriceRangeForm
  },

  data: () => ({
    tabHeaders: [
      {
        key: "images",
        title: "Images"
      },
      {
        key: "sizes",
        title: "Sizes"
      },
      {
        key: "discounted-price-range",
        title: "Discounted Price Range"
      }
    ],
    dialogImage: false,
    dialogAvailableSize: false,
    dialogDiscountedPriceRange: false,
    productDetails: "",
    inventoryDetails: "",
    headerImages: [
      { text: "Image", value: "file_name" },
      { text: "Color", value: "color" },
      { text: "Order", value: "order" },
      { text: "Actions", align: "center", value: "id", sortable: false }
    ],
    headerAvailableSizes: [
      { text: "Name", value: "name" },
      { text: "Actions", align: "center", value: "name", sortable: false }
    ],
    headerDiscountedPriceRanges: [
      { text: "Quantity From", value: "quantity_from" },
      { text: "Quantity To", value: "quantity_to" },
      { text: "Price", value: "price" },
      { text: "Actions", align: "center", value: "id", sortable: false }
    ]
  }),

  mounted() {
    this.getProductDataById(this.$route.params.id).then(response => {
      this.productDetails = response.data.result;
    });
    this.getProductImageDataByProductId(this.$route.params.id);
    this.getProductAvailableSizeDataByProductId(this.$route.params.id);
    this.getProductDiscountedPriceRangeDataByProductId(this.$route.params.id);
    this.getInventoryAvailableStockDataByProductId(this.$route.params.id).then(response => {
      this.inventoryDetails = response.data.result;
    });
  },

  computed: {
    ...mapState("productImages", ["productImageList"]),
    ...mapState("productAvailableSizes", ["productAvailableSizeList"]),
    ...mapState("productDiscountedPriceRanges", ["productDiscountedPriceRangeList"])
  },

  methods: {
    ...mapActions("products", { getProductDataById: "getDataById" }),
    ...mapActions("productImages", {
      getProductImageDataByProductId: "getDataByProductId"
    }),
    ...mapActions("productAvailableSizes", {
      getProductAvailableSizeDataByProductId: "getDataByProductId"
    }),
    ...mapActions("productDiscountedPriceRanges", {
      getProductDiscountedPriceRangeDataByProductId: "getDataByProductId"
    }),
    ...mapActions("inventories", {
      getInventoryAvailableStockDataByProductId: "getAvailableStockDataByProductId",
    }),

    editItemImage(id) {
      this.setDialogImage(true);
      this.$refs.modalImageForm.editItem(id);
    },

    editItemAvailableSize(id) {
      this.setDialogAvailableSize(true);
      this.$refs.modalProductAvailableSizeForm.editItem(id);
    },

    editItemDiscountedPriceRange(id) {
      this.setDialogDiscountedPriceRange(true);
      this.$refs.modalProductDiscountedPriceRangeForm.editItem(id);
    },

    deleteItemImage(id) {
      this.$refs.modalImageForm.deleteItem(id);
    },

    deleteItemAvailableSize(id) {
      this.$refs.modalProductAvailableSizeForm.deleteItem(id);
    },

    deleteItemDiscountedPriceRange(id) {
      this.$refs.modalProductDiscountedPriceRangeForm.deleteItem(id);
    },

    setDialogImage(value) {
      this.dialogImage = value;
    },

    setDialogAvailableSize(value) {
      this.dialogAvailableSize = value;
    },

    setDialogDiscountedPriceRange(value) {
      this.dialogDiscountedPriceRange = value;
    }
  }
};
</script>