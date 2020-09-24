<template>
  <v-navigation-drawer
    id="app-drawer"
    v-model="primaryDrawer.model"
    :permanent="primaryDrawer.type === 'permanent'"
    :temporary="primaryDrawer.type === 'temporary'"
    :clipped="primaryDrawer.clipped"
    :floating="primaryDrawer.floating"
    :mini-variant="primaryDrawer.mini"
    absolute
    overflow
    app
    dark
    class="grey darken-4"
    mobile-break-point="991"
    width="270"
  >
    <v-list class="pt-0">
      <v-toolbar flat class="transparent">
        <v-list class="pa-0">
          <v-list-tile avatar>
            <v-list-tile-avatar>
              <img :src="logo" />
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>Hi! {{ userInfo.username }}</v-list-tile-title>
              <v-list-tile-sub-title>
                {{ userInfo.email }}
              </v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-toolbar>

      <v-list two-line subheader>
        <v-divider></v-divider>

        <v-list-tile v-if="responsive">
          <v-text-field
            class="blue-input search-input"
            label="Search..."
            color="blue"
          />
        </v-list-tile>
      </v-list>

      <!-- Parent navigation -->
      <v-list class="pt-0" dense v-for="(link, i) in links" :key="i">
        <template v-if="link.submenus">
          <v-list-group :prepend-icon="link.icon">
            <template v-slot:activator>
              <v-list-tile>
                <v-list-tile-title class="margin-left-n10">{{
                  link.text
                }}</v-list-tile-title>
              </v-list-tile>
            </template>
            <!-- Child navigation -->
            <v-list
              class="pt-0"
              dense
              v-for="(child, i) in link.childs"
              :key="i"
            >
              <template v-if="child.submenus">
                <v-list-group class="margin-left-n10" no-action sub-group>
                  <template v-slot:activator>
                    <v-list-tile>
                      <v-list-tile-title>{{ child.text }}</v-list-tile-title>
                    </v-list-tile>
                  </template>
                  <!-- Sub-child navigation -->
                  <v-list
                    class="pt-0"
                    dense
                    v-for="(subChild, i) in child.subChilds"
                    :key="i"
                  >
                    <v-list-tile :to="subChild.to">
                      <v-list-tile-content>
                        <v-list-tile-title>{{
                          subChild.text
                        }}</v-list-tile-title>
                      </v-list-tile-content>
                    </v-list-tile>
                  </v-list>
                  <!-- End of Sub-child navigation -->
                </v-list-group>
              </template>
              <template v-else>
                <v-list-tile :to="child.to">
                  <v-list-tile-action></v-list-tile-action>
                  <v-list-tile-content class="margin-left-n10">
                    <v-list-tile-title>{{ child.text }}</v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>
              </template>
            </v-list>
            <!-- End of Child navigation -->
          </v-list-group>
        </template>
        <template v-else>
          <v-list-tile :to="link.to">
            <v-list-tile-action>
              <v-icon>{{ link.icon }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content class="margin-left-n10">
              <v-list-tile-title>{{ link.text }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </template>
      </v-list>
      <!-- End of Parent navigation -->
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { mapState } from "vuex";

export default {
  data: () => ({
    logo: require("@/assets/images/no-image.png"),
    links: [
      {
        to: "/",
        icon: "dashboard",
        text: "Dashboard",
      },
      {
        icon: "shopping_basket",
        text: "Products",
        submenus: true,
        childs: [
          {
            to: "/productBrands",
            text: "Brands",
          },
          {
            to: "/productCategories",
            text: "Categories",
          },
          {
            to: "/productSubCategories",
            text: "Sub-Categories",
          },
          {
            to: "/productSubSubCategories",
            text: "Sub-Sub-Categories",
          },
          {
            to: "/productStores",
            text: "Stores"
          },
          {
            to: "/productVariations",
            text: "Variations"
          },
          {
            to: "/products",
            text: "Manage",
          },
        ],
      },
      {
        to: "/productFlashDeals",
        icon: "local_offer",
        text: "Flash Deals",
      },
      {
        to: "/customers",
        icon: "person",
        text: "Customers",
      },
      {
        to: "/employees",
        icon: "people",
        text: "Employees",
      },
      {
        icon: "list_alt",
        text: "Sales Orders",
        submenus: true,
        childs: [
          {
            to: "/salesOrders/open",
            text: "Open",
          },
          {
            to: "/salesOrders/reviewed",
            text: "Reviewed",
          },
          {
            to: "/salesOrders/approved",
            text: "Approved",
          },
          {
            to: "/salesOrders/onProcess",
            text: "On Process",
          },
          {
            to: "/salesOrders/delivered",
            text: "Delivered",
          },
          {
            to: "/salesOrders/index",
            text: "Manage",
          },
        ],
      },
      {
        to: "/payments",
        icon: "payment",
        text: "Payments",
      },
      {
        icon: "description",
        text: "Reports",
        submenus: true,
        childs: [
          {
            to: "/",
            text: "Stock Report",
          },
          {
            to: "/",
            text: "Sold Items Report",
          },
        ],
      },
      {
        icon: "desktop_mac",
        text: "Frontend Settings",
        submenus: true,
        childs: [
          {
            text: "Home",
            submenus: true,
            subChilds: [
              {
                to: "/frontendSliderImages",
                text: "Slider Images",
              },
            ],
          },
          {
            text: "Policy Pages",
            submenus: true,
            subChilds: [
              {
                to: "/frontendPolicyPages/terms",
                text: "Terms & Conditions",
              },
              {
                to: "/frontendPolicyPages/privacy",
                text: "Privacy Policy",
              },
              {
                to: "/frontendPolicyPages/support",
                text: "Support Policy",
              },
              {
                to: "/frontendPolicyPages/return",
                text: "Return Policy",
              },
              {
                to: "/frontendPolicyPages/seller",
                text: "Seller Policy",
              },
            ],
          },
          {
            to: "/frontendUsefulLinks",
            text: "Useful Links",
          },
          // {
          //   to: "/",
          //   text: "General Settings"
          // }
        ],
      },
      {
        icon: "build",
        text: "Parameter Settings",
        submenus: true,
        childs: [
          {
            to: "/banks",
            text: "Banks",
          },
          {
            to: "/shippingMethods",
            text: "Shipping Methods",
          },
        ],
      },
      {
        icon: "settings",
        text: "Settings",
        submenus: true,
        childs: [
          {
            to: "/users",
            text: "Users",
          },
        ],
      },
      // {
      //   icon: "account_tree",
      //   text: "Role Based Access",
      //   submenus: true,
      //   childs: [
      //     {
      //       to: "/roles",
      //       text: "Roles"
      //     }
      //   ]
      // }
    ],
    responsive: true,
  }),
  computed: {
    ...mapState("toolbar", ["primaryDrawer"]),
    ...mapState("userAuthentication", ["userInfo"]),
  },
};
</script>

<style lang="css" scoped>
.margin-left-n10 {
  margin-left: -10px !important;
}

.v-navigation-drawer {
  overflow-y: hidden !important;
}

.v-navigation-drawer:hover {
  overflow-y: visible !important;
}

::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #888;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
