<template>
  <v-layout row wrap>
    <v-flex xs12 sm12 md6 lg6>
      <v-hover>
        <v-card
          slot-scope="{ hover }"
          :class="`elevation-${hover ? 12 : 1}`"
        >
          <v-card-title primary-title class="justify-center">
            <div>
              <h4 class="body-2 text-xs-center">Total Brands</h4>
              <h1 class="text-xs-center">0</h1>
            </div>
          </v-card-title>
          <v-card-actions class="justify-center">
            <v-btn to="/productBrands" block small color="primary">Manage</v-btn>
          </v-card-actions>
        </v-card>
      </v-hover>
    </v-flex>
    <v-flex xs12 sm12 md6 lg6>
      <v-hover>
        <v-card
          slot-scope="{ hover }"
          :class="`elevation-${hover ? 12 : 1}`"
        >
          <v-card-title primary-title class="justify-center">
            <div>
              <h4 class="body-2 text-xs-center">Total Categories</h4>
              <h1 class="text-xs-center">0</h1>
            </div>
          </v-card-title>
          <v-card-actions class="justify-center">
            <v-btn to="/productCategories" block small color="primary">Manage</v-btn>
          </v-card-actions>
        </v-card>
      </v-hover>
    </v-flex>
    <v-flex xs12 sm12 md6 lg6>
      <v-hover>
        <v-card
          slot-scope="{ hover }"
          :class="`elevation-${hover ? 12 : 1}`"
        >
          <v-card-title primary-title class="justify-center">
            <div>
              <h4 class="body-2 text-xs-center">Total Sub-Categories</h4>
              <h1 class="text-xs-center">0</h1>
            </div>
          </v-card-title>
          <v-card-actions class="justify-center">
            <v-btn to="/productSubCategories" block small color="primary">Manage</v-btn>
          </v-card-actions>
        </v-card>
      </v-hover>
    </v-flex>
    <v-flex xs12 sm12 md6 lg6>
      <v-hover>
        <v-card
          slot-scope="{ hover }"
          :class="`elevation-${hover ? 12 : 1}`"
        >
          <v-card-title primary-title class="justify-center">
            <div>
              <h4 class="body-2 text-xs-center">Total Sub Sub-Categories</h4>
              <h1 class="text-xs-center">0</h1>
            </div>
          </v-card-title>
          <v-card-actions class="justify-center">
            <v-btn to="/productSubSubCategories" block small color="primary">Manage</v-btn>
          </v-card-actions>
        </v-card>
      </v-hover>
    </v-flex>
  </v-layout>
</template>