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
              <div class="text-xs-center"><v-icon large class="text-xs-center green--text text--accent-3">shopping_basket</v-icon></div>
              <h4 class="body-2 text-xs-center">Total Products</h4>
              <p class="headline font-weight-bold text-xs-center">0</p>
            </div>
          </v-card-title>
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
              <div class="text-xs-center"><v-icon large class="text-xs-center red--text text--accent-3">people</v-icon></div>
              <h4 class="body-2 text-xs-center">Total Customers</h4>
              <p class="headline font-weight-bold text-xs-center">0</p>
            </div>
          </v-card-title>
        </v-card>
      </v-hover>
    </v-flex>
    <v-flex xs12 sm12 md12 lg12>
      <v-hover>
        <v-card
          slot-scope="{ hover }"
          :class="`elevation-${hover ? 12 : 1}`"
        >
          <v-card-title primary-title class="justify-center">
            <div>
              <div class="text-xs-center"><v-icon large class="text-xs-center blue--text text--accent-3">shopping_cart</v-icon></div>
              <h4 class="body-2 text-xs-center">Total Orders</h4>
              <p class="headline font-weight-bold text-xs-center">0</p>
            </div>
          </v-card-title>
        </v-card>
      </v-hover>
    </v-flex>
  </v-layout>
</template>