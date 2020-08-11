<template>
  <v-footer dark padless>
    <v-container
      class="col-lg-10 offset-lg-1 mx-auto"
      style="max-width: 1280px;"
    >
      <v-layout row wrap>
        <v-flex xs12 sm12 md4 lg4>
          <v-container>
            <v-layout row wrap>
              <v-flex xs12 sm12 md12 lg12>
                <v-container>
                  <router-link to="/">
                    <v-img
                      :src="avatar"
                      max-height="40px"
                      max-width="250px"
                    ></v-img>
                  </router-link>
                </v-container>
              </v-flex>
              <v-flex xs12 sm12 md12 lg12>
                <v-container>
                  <p class="caption">{{ companyDescription }}</p>
                </v-container>
              </v-flex>
            </v-layout>
          </v-container>
        </v-flex>
        <v-flex xs1 sm1 md1 lg1></v-flex>
        <v-flex xs12 sm12 md3 lg3>
          <v-container>
            <v-layout row wrap>
              <v-flex xs12 sm12 md12 lg12>
                <v-container>
                  <h4>CONTACT INFO</h4>
                  <div>
                    <span class="caption grey--text">Address:</span>
                    <br />
                    <p class="caption">{{ contactInfo.address }}</p>
                  </div>
                  <div>
                    <span class="caption grey--text">Phone:</span>
                    <br />
                    <p class="caption">{{ contactInfo.phone }}</p>
                  </div>
                  <div>
                    <span class="caption grey--text">Email:</span>
                    <br />
                    <a class="caption" :href="`mailto:${contactInfo.email}`">
                      {{ contactInfo.email }}
                    </a>
                  </div>
                </v-container>
              </v-flex>
            </v-layout>
          </v-container>
        </v-flex>
        <v-flex xs1 sm1 md1 lg1></v-flex>
        <v-flex xs12 sm12 md3 lg3>
          <v-container>
            <v-layout row wrap>
              <v-flex xs12 sm12 md12 lg12>
                <v-container>
                  <h4>USEFUL LINKS</h4>
                  <v-container>
                    <v-row v-for="(link, i) in frontendUsefulLinkList" :key="i">
                      <v-hover>
                        <router-link
                          slot-scope="{ hover }"
                          :class="`${hover ? 'blue' : 'white'}--text`"
                          style="text-decoration: none;"
                          :to="link.url"
                        >
                          <span class="caption">{{ link.name }}</span>
                        </router-link>
                      </v-hover>
                    </v-row>
                  </v-container>
                </v-container>
              </v-flex>
            </v-layout>
          </v-container>
        </v-flex>
      </v-layout>
    </v-container>
    <v-card flat tile width="100%" class="black text-center">
      <v-card-title class="grey darken-3">
        <div class="col-lg-10 offset-lg-1 mx-auto" style="max-width: 1280px;">
          <v-layout row>
            <strong class="subheading"
              >Get connected with us on social networks!</strong
            >
            <v-spacer></v-spacer>
            <v-btn
              v-for="(social, i) in socials"
              :key="i"
              class="mx-4"
              dark
              icon
            >
              <v-icon size="24px">{{ social.icon }}</v-icon>
            </v-btn>
          </v-layout>
        </div>
      </v-card-title>

      <v-card-text class="py-2 white--text text-center">
        © {{ new Date().getFullYear() }} —
        <strong>E-Commerce</strong>
      </v-card-text>
    </v-card>
  </v-footer>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  data: () => ({
    companyDescription:
      "Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo. Quisque sit amet est et sapien ullamcorper pharetra. Vestibulum erat wisi, condimentum sed, commodo vitae, ornare sit amet, wisi. Aenean fermentum, elit eget tincidunt condimentum, eros ipsum rutrum orci, sagittis tempus lacus enim ac dui. Donec non enim in turpis pulvinar facilisis. Ut felis. Praesent dapibus, neque id cursus faucibus, tortor neque egestas augue, eu vulputate magna eros eu erat. Aliquam erat volutpat. Nam dui mi, tincidunt quis, accumsan porttitor, facilisis luctus, metus.",
    contactInfo: {
      address:
        "4th floor Visual Color Building, 101 Kalayaan Avenue Central Quezon City 2nd District, Philippines",
      phone: "09478850164 | 09451107821",
      email: "talktous.ecommerce@gmail.com",
    },
    socials: [
      { icon: "mdi-facebook", url: "/" },
      { icon: "mdi-twitter", url: "/" },
      { icon: "mdi-google-plus", url: "/" },
      { icon: "mdi-linkedin", url: "/" },
      { icon: "mdi-instagram", url: "/" },
    ],
  }),

  created() {
    this.getFrontendUsefulLinkData();
  },

  computed: {
    ...mapState("frontendUsefulLinks", ["frontendUsefulLinkList"]),
    avatar() {
      return "/img/logo-white.png";
    },
  },

  methods: {
    ...mapActions("frontendUsefulLinks", {
      getFrontendUsefulLinkData: "getData",
    }),
  },
};
</script>
