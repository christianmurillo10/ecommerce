<template>
  <v-container fluid>
    <Alerts />
    <v-card>
      <v-card-title>
        <v-icon class="black--text">image</v-icon
        ><span class="title">Product - Image</span>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on: { click } }">
            <v-tooltip left>
              <template v-slot:activator="{ on }">
                <v-btn icon v-on:click="click" v-on="on">
                  <v-icon color="green">add_box</v-icon>
                </v-btn>
              </template>
              <span>Create</span>
            </v-tooltip>
          </template>
          <ModalFormImage ref="modalFormImage" @setDialog="setDialog" />
        </v-dialog>
        <v-tooltip left>
          <template v-slot:activator="{ on }">
            <v-btn icon to="/products" v-on="on">
              <v-icon>arrow_back</v-icon>
            </v-btn>
          </template>
          <span>Back</span>
        </v-tooltip>
      </v-card-title>
      <v-card-text>
        <v-container fluid grid-list-md>
          <v-layout wrap row>
            <v-flex xs12 sm12 md12 lg12>
              <span class="title font-weight-bold">Name: </span
              ><span class="title">{{ productDetails.name }}</span>
            </v-flex>
            <v-flex xs12 sm12 md6 lg6>
              <v-flex xs12 sm12 md12 lg12>
                <v-card>
                  <v-card-title>
                    <span class="body-2">Main</span>
                  </v-card-title>
                  <v-card-text>
                    <v-data-table
                      :headers="headers"
                      :items="productImageMainList"
                      hide-actions
                      class="elevation-1"
                    >
                      <template v-slot:items="props">
                        <td class="text-xs-left pt-1">
                          <img
                            :src="props.item.file_path"
                            height="80"
                            width="120"
                            class="product-image"
                            @click="viewImage({ filePath: props.item.file_path, heigth: '300', width: '290' })"
                          />
                        </td>
                        <td class="text-xs-left">{{ props.item.order }}</td>
                        <td class="text-xs-center">
                          <v-tooltip left>
                            <template v-slot:activator="{ on }">
                              <v-icon
                                small
                                class="mr-2"
                                @click="
                                  editItem(props.item.id, props.item.type)
                                "
                                v-on="on"
                                >edit</v-icon
                              >
                            </template>
                            <span>Update</span>
                          </v-tooltip>
                          <v-tooltip left>
                            <template v-slot:activator="{ on }">
                              <v-icon
                                small
                                color="red"
                                @click="
                                  deleteItem(props.item.id, props.item.type)
                                "
                                v-on="on"
                                >delete</v-icon
                              >
                            </template>
                            <span>Delete</span>
                          </v-tooltip>
                        </td>
                      </template>
                      <template v-slot:no-data>
                        <p class="justify-center layout px-0">No data found!</p>
                      </template>
                    </v-data-table>
                  </v-card-text>
                </v-card>
              </v-flex>
            </v-flex>
            <v-flex xs12 sm12 md6 lg6>
              <v-flex xs12 sm12 md12 lg12>
                <v-card>
                  <v-card-title>
                    <span class="body-2">Thumbnail (290x300)</span>
                  </v-card-title>
                  <v-card-text>
                    <v-data-table
                      :headers="headers"
                      :items="productImageThumbnailList"
                      hide-actions
                      class="elevation-1"
                    >
                      <template v-slot:items="props">
                        <td class="text-xs-left pt-1">
                          <img
                            :src="props.item.file_path"
                            height="80"
                            width="120"
                            class="product-image"
                            @click="viewImage({ filePath: props.item.file_path, heigth: '300', width: '290' })"
                          />
                        </td>
                        <td class="text-xs-left">{{ props.item.order }}</td>
                        <td class="text-xs-center">
                          <v-tooltip left>
                            <template v-slot:activator="{ on }">
                              <v-icon
                                small
                                class="mr-2"
                                @click="
                                  editItem(props.item.id, props.item.type)
                                "
                                v-on="on"
                                >edit</v-icon
                              >
                            </template>
                            <span>Update</span>
                          </v-tooltip>
                          <v-tooltip left>
                            <template v-slot:activator="{ on }">
                              <v-icon
                                small
                                color="red"
                                @click="
                                  deleteItem(props.item.id, props.item.type)
                                "
                                v-on="on"
                                >delete</v-icon
                              >
                            </template>
                            <span>Delete</span>
                          </v-tooltip>
                        </td>
                      </template>
                      <template v-slot:no-data>
                        <p class="justify-center layout px-0">No data found!</p>
                      </template>
                    </v-data-table>
                  </v-card-text>
                </v-card>
              </v-flex>
              <v-flex xs12 sm12 md12 lg12>
                <v-card>
                  <v-card-title>
                    <span class="body-2">Featured (290x300)</span>
                  </v-card-title>
                  <v-card-text>
                    <v-data-table
                      :headers="headers"
                      :items="productImageFeaturedList"
                      hide-actions
                      class="elevation-1"
                    >
                      <template v-slot:items="props">
                        <td class="text-xs-left pt-1">
                          <img
                            :src="props.item.file_path"
                            height="80"
                            width="120"
                            class="product-image"
                            @click="viewImage({ filePath: props.item.file_path, heigth: '300', width: '290' })"
                          />
                        </td>
                        <td class="text-xs-left">{{ props.item.order }}</td>
                        <td class="text-xs-center">
                          <v-tooltip left>
                            <template v-slot:activator="{ on }">
                              <v-icon
                                small
                                class="mr-2"
                                @click="
                                  editItem(props.item.id, props.item.type)
                                "
                                v-on="on"
                                >edit</v-icon
                              >
                            </template>
                            <span>Update</span>
                          </v-tooltip>
                          <v-tooltip left>
                            <template v-slot:activator="{ on }">
                              <v-icon
                                small
                                color="red"
                                @click="
                                  deleteItem(props.item.id, props.item.type)
                                "
                                v-on="on"
                                >delete</v-icon
                              >
                            </template>
                            <span>Delete</span>
                          </v-tooltip>
                        </td>
                      </template>
                      <template v-slot:no-data>
                        <p class="justify-center layout px-0">No data found!</p>
                      </template>
                    </v-data-table>
                  </v-card-text>
                </v-card>
              </v-flex>
              <v-flex xs12 sm12 md12 lg12>
                <v-card>
                  <v-card-title>
                    <span class="body-2">Flash Deal (290x300)</span>
                  </v-card-title>
                  <v-card-text>
                    <v-data-table
                      :headers="headers"
                      :items="productImageFlashDealList"
                      hide-actions
                      class="elevation-1"
                    >
                      <template v-slot:items="props">
                        <td class="text-xs-left pt-1">
                          <img
                            :src="props.item.file_path"
                            height="80"
                            width="120"
                            class="product-image"
                            @click="viewImage({ filePath: props.item.file_path, heigth: '300', width: '290' })"
                          />
                        </td>
                        <td class="text-xs-left">{{ props.item.order }}</td>
                        <td class="text-xs-center">
                          <v-tooltip left>
                            <template v-slot:activator="{ on }">
                              <v-icon
                                small
                                class="mr-2"
                                @click="
                                  editItem(props.item.id, props.item.type)
                                "
                                v-on="on"
                                >edit</v-icon
                              >
                            </template>
                            <span>Update</span>
                          </v-tooltip>
                          <v-tooltip left>
                            <template v-slot:activator="{ on }">
                              <v-icon
                                small
                                color="red"
                                @click="
                                  deleteItem(props.item.id, props.item.type)
                                "
                                v-on="on"
                                >delete</v-icon
                              >
                            </template>
                            <span>Delete</span>
                          </v-tooltip>
                        </td>
                      </template>
                      <template v-slot:no-data>
                        <p class="justify-center layout px-0">No data found!</p>
                      </template>
                    </v-data-table>
                  </v-card-text>
                </v-card>
              </v-flex>
            </v-flex>
            <v-dialog v-model="modalImage.dialog" :max-height="modalImage.height" :max-width="modalImage.width">
              <img
                :src="modalImage.filePath"
                :height="modalImage.height"
                :width="modalImage.width"
                contain
                class="product-modal-image"
              />
            </v-dialog>
          </v-layout>
        </v-container>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import Alerts from "@/components/utilities/Alerts";
import ModalFormImage from "./ModalFormImage";
import { mapState, mapActions } from "vuex";

export default {
  components: {
    Alerts,
    ModalFormImage
  },

  data: () => ({
    dialog: false,
    modalImage: {
      dialog: false,
      filePath: require("../../assets/images/no-image.png"),
      height: 300,
      width: 290
    },
    productDetails: "",
    mainImage: 1,
    thumbnailImage: 2,
    featuredImage: 3,
    flasDealImage: 4,
    headers: [
      { text: "Image", value: "file_name" },
      { text: "Order", value: "order" },
      { text: "Actions", align: "center", value: "id", sortable: false }
    ],
    defaultFormData: {
      file: null,
      file_path: require("../../assets/images/no-image.png"),
      file_name: null,
      order: null,
      type: null
    },
    formType: "new",
    formData: {
      file: null,
      file_path: require("../../assets/images/no-image.png"),
      file_name: null,
      order: null,
      type: null
    }
  }),

  mounted() {
    this.getProductDataById(this.$route.params.id).then(response => {
      this.productDetails = response.data.result;
    });
    this.getProductImageDataByProductIdAndType({
      productId: this.$route.params.id,
      type: this.mainImage
    });
    this.getProductImageDataByProductIdAndType({
      productId: this.$route.params.id,
      type: this.thumbnailImage
    });
    this.getProductImageDataByProductIdAndType({
      productId: this.$route.params.id,
      type: this.featuredImage
    });
    this.getProductImageDataByProductIdAndType({
      productId: this.$route.params.id,
      type: this.flasDealImage
    });
  },

  computed: {
    ...mapState("productImages", [
      "productImageMainList",
      "productImageThumbnailList",
      "productImageFeaturedList",
      "productImageFlashDealList"
    ])
  },

  methods: {
    ...mapActions("products", { getProductDataById: "getDataById" }),
    ...mapActions("productImages", {
      getProductImageDataByProductIdAndType: "getDataByProductIdAndType"
    }),

    editItem(id, type) {
      this.setDialog(true);
      this.$refs.modalFormImage.editItem(id, type);
    },

    deleteItem(id, type) {
      this.$refs.modalFormImage.deleteItem(id, type);
    },

    close() {
      this.setDialog(false);
      this.$refs.modalFormImage.close();
    },

    setDialog(value) {
      this.dialog = value;
    },

    viewImage(obj) {
      this.modalImage.filePath = obj.filePath;
      this.modalImage.height = obj.height;
      this.modalImage.width = obj.width;
      this.modalImage.dialog = true;
    }
  }
};
</script>
<style>
.product-image {
  cursor: pointer !important;
}

.product-modal-image {
  margin-bottom: -5px !important;
}
</style>