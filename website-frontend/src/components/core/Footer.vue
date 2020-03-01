<template>
  <!-- <v-footer color="orange lighten-1" dark> -->
  <v-footer dark>
    <v-container class="col-lg-10 offset-lg-1">
      <v-layout row wrap>
        <v-flex xs12 sm12 md4 lg4>
          <v-container>
            <v-layout row wrap>
              <v-flex xs2 sm2 md2 lg2>
                <v-container>
                  <router-link to="/">
                    <v-img
                      :src="avatar"
                      max-height="50px"
                      max-width="50px"
                    ></v-img>
                  </router-link>
                </v-container>
              </v-flex>
              <v-flex xs10 sm10 md10 lg10>
                <v-container>
                  <h2>E-Commerce</h2>
                </v-container>
              </v-flex>
              <v-flex xs12 sm12 md12 lg12>
                <p class="caption">{{ companyDescription }}</p>
              </v-flex>
            </v-layout>
          </v-container>
        </v-flex>
        <v-flex xs12 sm12 md3 lg3>
          <v-container>
            <v-layout row wrap>
              <v-flex xs12 sm12 md12 lg12>
                <h4>CONTACT INFO</h4>
              </v-flex>
              <v-flex xs12 sm12 md12 lg12>
                <div>
                  <span class="caption grey--text">Address: </span> <br />
                  <p class="caption">{{ contactInfo.address }}</p>
                </div>
                <div>
                  <span class="caption grey--text">Phone: </span> <br />
                  <p class="caption">{{ contactInfo.phone }}</p>
                </div>
                <div>
                  <span class="caption grey--text">Email: </span> <br />
                  <a class="caption" :href="`mailto:${contactInfo.email}`">{{
                    contactInfo.email
                  }}</a>
                </div>
              </v-flex>
            </v-layout>
          </v-container>
        </v-flex>
        <v-flex xs12 sm12 md2 lg2>
          <v-container>
            <v-layout row wrap>
              <h4>QUICK LINKS</h4>
            </v-layout>
          </v-container>
        </v-flex>
      </v-layout>
    </v-container>
    <v-row justify="center" no-gutters>
      <v-btn
        v-for="link in links"
        :key="link"
        color="white"
        text
        rounded
        class="my-2"
        >{{ link }}</v-btn
      >
      <v-col class="black lighten-1 py-4 text-center white--text" cols="12">
        <p>
          {{ new Date().getFullYear() }} —
          <strong>ARK</strong>
        </p>
      </v-col>
    </v-row>
  </v-footer>
</template>

<script>
export default {
  data: () => ({
    companyDescription:
      "ARK (Accessible Revenue Kiosk) is an online membership shopping destination that offers direct access to a wide selection of quality products at discounted prices and at the same time offers the opportunity for its members an accessible and sustainable income via the e-commerce industry.",
    contactInfo: {
      address:
        "4th floor Visual Color Building, 101 Kalayaan Avenue Central Quezon City 2nd District, Philippines",
      phone: "09478850164 | 09451107821",
      email: "talktous.ark@gmail.com"
    },
    links: [
      "Home",
      "Categories",
      "Products",
      "Terms and Conditions",
      "About Us",
      "Contact Us"
    ]
  }),
  computed: {
    avatar() {
      return "/img/logo.png";
    }
  }
};
</script>
