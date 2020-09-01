<template>
  <v-container fluid grid-list-md>
    <v-flex xs12 sm12 md12 lg12>
      <v-layout wrap row>
        <v-flex xs12 sm12 md3 lg3 v-for="(header, key) in imageType" :key="key">
          <v-card>
            <v-card-title
              ><h4>{{ header.name }}</h4></v-card-title
            >
            <v-divider></v-divider>
            <v-list three-line>
              <template v-for="(details, key) in imageDetails" >
                <v-list-tile v-if="header.id === details.type" :key="key">
                  <v-list-tile-content class="align-start">{{ details.order }}</v-list-tile-content>
                  <v-list-tile-content>
                    <v-img
                      :src="details.file_path"
                      lazy-src="@/assets/images/no-image.png"
                      height="80"
                      width="120"
                      class="product-image"
                      @click="viewImage({ filePath: details.file_path, heigth: '600', width: '590' })"
                      contain
                    ></v-img>
                  </v-list-tile-content>
                </v-list-tile>
              </template>
            </v-list>
          </v-card>
        </v-flex>
        <v-dialog v-model="modalImage.dialog" :max-height="modalImage.height" :max-width="modalImage.width">
          <v-img
            :src="modalImage.filePath"
            lazy-src="@/assets/images/no-image.png"
            :height="modalImage.height"
            :width="modalImage.width"
            class="product-modal-image"
            @click="viewImage({ filePath: details.file_path, heigth: '600', width: '590' })"
            contain
          ></v-img>
        </v-dialog>
      </v-layout>
    </v-flex>
  </v-container>
</template>

<script>
export default {
  props: {
    imageDetails: Array
  },

  data: () => ({
    dialog: false,
    modalImage: {
      dialog: false,
      filePath: require("@/assets/images/no-image.png"),
      height: 300,
      width: 290
    },
    imageType: [
      {id: 1, name: "Main"},
      {id: 2, name: "Thumbnail (290x300)"},
      {id: 3, name: "Featured (290x300)"},
      {id: 4, name: "Flash Deal (290x300)"},
    ],
    rowsPerPageItems: [4, 8, 12],
    pagination: {
      rowsPerPage: 4
    }
  }),
  
  methods: {
    viewImage(obj) {
      this.modalImage.filePath = obj.filePath;
      this.modalImage.height = obj.height;
      this.modalImage.width = obj.width;
      this.modalImage.dialog = true;
    }
  }
};
</script>
