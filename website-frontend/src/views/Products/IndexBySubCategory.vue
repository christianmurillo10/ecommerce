<template>
  <v-container class="col-lg-10 offset-lg-1">
    <v-layout row wrap>
      <v-flex xs12 sm12 md12 lg12>
        <v-container>
          <v-card>
            <v-card-title>PRODUCTS</v-card-title>
            <v-card-text>
              <v-container>
                <v-layout row wrap>
                  <v-flex xs12 sm12 md3 lg3></v-flex>
                  <v-flex xs12 sm12 md9 lg9>
                    <v-layout row wrap>
                      <template v-for="(card, i) in cards">
                        <v-flex xs12 sm12 md3 lg3 :key="i">
                          <v-container>
                            <v-card>
                              <v-img
                                :src="`https://picsum.photos/200/300?image=${getImage()}`"
                                height="300px"
                              >
                                <span class="headline white--text pl-4 pt-4" v-text="card.title"></span>
                              </v-img>

                              <v-card-actions class="white justify-center">
                                <v-btn
                                  v-for="(social, i) in socials"
                                  :key="i"
                                  :color="social.color"
                                  class="white--text"
                                  fab
                                  icon
                                  small
                                >
                                  <v-icon>{{ social.icon }}</v-icon>
                                </v-btn>
                              </v-card-actions>
                            </v-card>
                          </v-container>
                        </v-flex>
                      </template>
                    </v-layout>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-text>
          </v-card>
        </v-container>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  data: () => ({
    cards: ["Good", "Best", "Finest"],
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
