<template>
  <v-container class="col-lg-10 offset-lg-1">
    <v-layout row wrap>
      <v-flex xs12 sm12 md12 lg12>
        <v-container>
          <v-layout row wrap>
            <v-flex xs12 sm12 md3 lg3>
              <v-container>
                <v-card>
                  <v-card-title>FILTERS</v-card-title>

                  <v-divider class="mx-4"></v-divider>
                  <v-card-title>Related Categories</v-card-title>
                  <v-card-text>
                    <v-list rounded dense>
                      <v-list-item-group color="primary">
                        <v-list-item>
                          <v-list-item-content>
                            <v-list-item-title v-text="'Category 1'"></v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                        <v-list-item>
                          <v-list-item-content>
                            <v-list-item-title v-text="'Category 1'"></v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                      </v-list-item-group>
                    </v-list>
                  </v-card-text>

                  <v-divider class="mx-4"></v-divider>
                  <v-card-title>Rating</v-card-title>
                  <v-card-text>
                    <v-container>
                      <v-row align="center" class="mx-0">
                        <v-rating :value="5" color="amber" dense half-increments readonly size="14"></v-rating>
                      </v-row>
                      <v-row align="center" class="mx-0">
                        <v-rating :value="4" color="amber" dense half-increments readonly size="14"></v-rating>
                        <div class="grey--text">&amp; Up</div>
                      </v-row>
                      <v-row align="center" class="mx-0">
                        <v-rating :value="3" color="amber" dense half-increments readonly size="14"></v-rating>
                        <div class="grey--text">&amp; Up</div>
                      </v-row>
                      <v-row align="center" class="mx-0">
                        <v-rating :value="2" color="amber" dense half-increments readonly size="14"></v-rating>
                        <div class="grey--text">&amp; Up</div>
                      </v-row>
                      <v-row align="center" class="mx-0">
                        <v-rating :value="1" color="amber" dense half-increments readonly size="14"></v-rating>
                        <div class="grey--text">&amp; Up</div>
                      </v-row>
                    </v-container>
                  </v-card-text>

                  <v-divider class="mx-4"></v-divider>
                  <v-card-title>Price Range</v-card-title>
                  <v-card-text>
                    <v-flex xs12>
                      <v-form @submit.prevent="login" ref="form" lazy-validation>
                        <v-container grid-list-md>
                          <v-layout wrap>
                            <v-flex xs12 sm12 md6 lg6>
                              <v-text-field
                                v-model="price_from"
                                label="Min"
                                required
                                type="number"
                                outlined
                                dense
                              ></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm12 md6 lg6>
                              <v-text-field
                                v-model="price_to"
                                label="Max"
                                required
                                type="number"
                                outlined
                                dense
                              ></v-text-field>
                            </v-flex>
                          </v-layout>
                        </v-container>
                      </v-form>
                    </v-flex>
                  </v-card-text>
                </v-card>
              </v-container>
            </v-flex>
            <v-flex xs12 sm12 md9 lg9>
              <v-container>
                <v-flex xs12 sm12 md12 lg12>
                  <v-breadcrumbs :items="items">
                    <template v-slot:divider>
                      <v-icon>mdi-forward</v-icon>
                    </template>
                  </v-breadcrumbs>
                </v-flex>
                <v-flex xs12 sm12 md12 lg12>
                  <v-container>
                    <v-layout row wrap>
                      <div class="headline">
                        Results for
                        <b>Item Name</b> (0)
                      </div>
                      <v-spacer></v-spacer>
                      <div class="text-center">
                        <v-pagination v-model="page" :length="15" :total-visible="7"></v-pagination>
                      </div>
                    </v-layout>
                  </v-container>
                </v-flex>

                <v-flex xs12 sm12 md12 lg12>
                  <v-layout row wrap>
                    <template v-for="(card, i) in cards">
                      <v-flex xs12 sm12 md3 lg3 :key="i">
                        <v-container>
                          <v-hover>
                            <v-card slot-scope="{ hover }" :class="`elevation-${hover ? 12 : 2}`">
                              <v-container>
                                <v-img
                                  :src="`https://picsum.photos/200/300?image=${getImage()}`"
                                  height="250px"
                                />
                              </v-container>

                              <v-card-text>
                                <div class="subtitle-1 black--text">Product Long Title For Long Example {{ card }}</div>
                                <div class="subtitle-1 font-weight-bold black--text">&#8369 0.00</div>

                                <v-row align="center" class="mx-0">
                                  <v-rating
                                    :value="4.5"
                                    color="amber"
                                    dense
                                    half-increments
                                    readonly
                                    size="14"
                                  ></v-rating>

                                  <div class="grey--text ml-4">4.5 (413)</div>
                                </v-row>
                              </v-card-text>
                            </v-card>
                          </v-hover>
                        </v-container>
                      </v-flex>
                    </template>
                  </v-layout>
                </v-flex>
                <v-flex xs12 sm12 md12 lg12>
                  <v-container>
                    <v-layout row wrap>
                      <v-spacer></v-spacer>
                      <div class="text-center">
                        <v-pagination v-model="page" :length="15" :total-visible="7"></v-pagination>
                      </div>
                    </v-layout>
                  </v-container>
                </v-flex>
              </v-container>
            </v-flex>
          </v-layout>
        </v-container>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  data: () => ({
    page: 1,
    price_from: "",
    price_to: "",
    items: [
      {
        text: "Dashboard",
        disabled: false,
        href: "breadcrumbs_dashboard"
      },
      {
        text: "Link 1",
        disabled: false,
        href: "breadcrumbs_link_1"
      },
      {
        text: "Link 2",
        disabled: true,
        href: "breadcrumbs_link_2"
      }
    ],
    cards: ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
    socials: [
      {
        icon: "mdi-facebook",
        color: "indigo"
      },
      {
        icon: "mdi-linkedin",
        color: "cyan darken-1"
      },
      {
        icon: "mdi-instagram",
        color: "red lighten-3"
      }
    ]
  }),

  mounted() {},

  computed: {},

  methods: {
    getImage() {
      const min = 550;
      const max = 560;

      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
  }
};
</script>
