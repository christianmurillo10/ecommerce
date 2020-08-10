<template>
  <v-navigation-drawer
    v-model="primaryDrawer.model"
    :temporary="primaryDrawer.type"
    overflow
    app
    mobile-break-point="991"
    width="80%"
  >
    <v-card outlined tile color="blue">
      <v-list dark>
        <v-list-item>
          <v-list-item-avatar>
            <v-img :src="avatar" />
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>{{ title }}</v-list-item-title>
            <v-list-item-subtitle>{{ subtitle }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-card>
    <v-divider></v-divider>
    <v-list dense nav>
      <template v-if="isLoggedIn">
        <v-list-item to="/profile">
          <v-list-item-action>
            <v-icon>mdi-account-circle</v-icon>
          </v-list-item-action>
          <v-list-item-content class="ml-n6">
            <v-list-item-title>Profile</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item v-on:click="logout">
          <v-list-item-action>
            <v-icon>mdi-logout</v-icon>
          </v-list-item-action>
          <v-list-item-content class="ml-n6">
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </template>
      <v-list-item v-else to="/login">
        <v-list-item-action>
          <v-icon>mdi-login</v-icon>
        </v-list-item-action>
        <v-list-item-content class="ml-n6">
          <v-list-item-title>Login</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <v-divider></v-divider>
    <v-list dense nav subheader>
      <v-subheader>Navigation</v-subheader>
      <v-list-item-group v-model="model">
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :value="item.id"
          @click="setLinks(item.id)"
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>

          <v-list-item-content class="ml-n6">
            <v-list-item-title>{{ item.text }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
    <v-divider></v-divider>
    <v-list dense nav subheader class="grow">
      <v-subheader>
        {{ subheader }}
        <v-spacer></v-spacer>
        <v-btn v-if="parentLink" small text rounded v-on:click="backCategory">
          <v-icon>mdi-menu-left</v-icon>
          Back
        </v-btn>
      </v-subheader>
      <v-list-item-group v-model="modelLink">
        <v-list-item
          v-if="parentLink"
          :key="`parent-${parentLink.value}`"
          :value="parentLink.value"
          :to="parentLink.to"
          v-on:click="setModelLinks(parentLink.value)"
          exact
        >
          <v-list-item-content>
            <v-list-item-title>{{ parentLink.text }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-divider v-if="parentLink"></v-divider>
        <v-list-item
          v-for="(link, i) in links"
          :key="link.value"
          :value="link.value"
          :to="link.submenus ? undefined : link.to"
          v-on:click="
            link.submenus ? setSubLinks(link, i) : '',
              link.submenus ? '' : setModelLinks(link.value)
          "
          exact
        >
          <template v-if="link.submenus">
            <v-list-item-content>
              <v-list-item-title>{{ link.text }}</v-list-item-title>
            </v-list-item-content>
            <v-list-item-action>
              <v-icon>mdi-menu-right</v-icon>
            </v-list-item-action>
          </template>
          <template v-else>
            <v-list-item-content>
              <v-list-item-title>{{ link.text }}</v-list-item-title>
            </v-list-item-content>
          </template>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import Mixins from "@/helpers/Mixins.js";
import { mapState, mapActions, mapGetters } from "vuex";

export default {
  mixins: [Mixins],

  data: () => ({
    subheader: "",
    model: null,
    modelLink: null,
    items: [
      { id: 1, text: "Menu", icon: "mdi-home" },
      { id: 2, text: "Categories", icon: "mdi-view-list" },
    ],
    menuLinks: [
      { id: 1, text: "Home", to: "/" },
      { id: 2, text: "About Us", to: "/about-us" },
      { id: 3, text: "Contact Us", to: "/contact-us" },
    ],
    oldParentLink: null,
    parentLink: null,
    oldLinks: [],
    links: [],
  }),

  mounted() {},

  watch: {
    "primaryDrawer.model": function(val) {
      if (val) {
        this.setModelLinks(null);
        this.setLinks(1);
      }
    },
  },

  computed: {
    ...mapState("appbar", ["primaryDrawer"]),
    ...mapGetters("customerAuthentication", ["isLoggedIn"]),
    ...mapState("customerAuthentication", ["customerInfo"]),
    ...mapState("productCategories", ["productCategoryWithSubList"]),

    avatar() {
      return this.isLoggedIn
        ? this.customerInfo.file_path
        : require("@/assets/images/no-image.png");
    },

    title() {
      return this.isLoggedIn ? this.customerInfo.firstname : "E-Commerce";
    },

    subtitle() {
      return this.isLoggedIn ? this.customerInfo.email : "Please login";
    },
  },

  methods: {
    ...mapActions("customerAuthentication", ["setLogout"]),

    logout() {
      this.setLogout().then(() => {
        this.$router.push("/login");
      });
    },

    setModel(value) {
      const model = _.isUndefined(value) ? null : parseInt(value);
      this.model = model;
    },

    setModelLinks(value) {
      if (_.isNull(value)) {
        if (
          !_.isUndefined(this.$route.query.category) &&
          !_.isUndefined(this.$route.query.subCategory) &&
          !_.isUndefined(this.$route.query.subSubCategory)
        ) {
          this.modelLink = `subSubCategory${this.$route.query.subSubCategory}`;
        } else if (
          !_.isUndefined(this.$route.query.category) &&
          !_.isUndefined(this.$route.query.subCategory)
        ) {
          this.modelLink = `subCategory${this.$route.query.subCategory}`;
        } else if (!_.isUndefined(this.$route.query.category)) {
          this.modelLink = `category${this.$route.query.category}`;
        } else {
          this.modelLink = null;
        }
      } else {
        this.modelLink = value;
      }
    },

    setLinks(id) {
      this.subheader = this.items.find((element) => element.id === id).text;
      this.setModel(id);
      switch (id) {
        case 1:
          this.oldParentLink = null;
          this.parentLink = null;
          this.oldLinks = [];
          this.links = this.menuLinks;
          break;
        case 2:
          this.setModelLinks(null);
          (this.parentLink = null), (this.links = this.setCategories());
          break;
      }
    },

    setCategories() {
      let array = [];
      this.productCategoryWithSubList.forEach((element) => {
        const subCategories = element.productSubCategories;
        const subMenus = subCategories.length <= 0 ? false : true;
        const childs =
          subCategories.length <= 0
            ? []
            : this.setSubCategories(element.id, subCategories);
        const link = {
          id: element.id,
          text: element.name,
          type: "category",
          value: `category${element.id}`,
          to: `/products?category=${element.id}`,
          submenus: subMenus,
          childs: childs,
        };
        array.push(link);
      });
      return array;
    },

    setSubCategories(categoryId, obj) {
      let array = [];
      obj.forEach((element) => {
        const subSubCategories = element.productSubSubCategories;
        const subMenus = subSubCategories.length <= 0 ? false : true;
        const childs =
          subSubCategories.length <= 0
            ? []
            : this.setSubSubCategories(
                categoryId,
                element.id,
                subSubCategories
              );
        const link = {
          id: element.id,
          text: element.name,
          type: "sub-category",
          value: `subCategory${element.id}`,
          to: `/products?category=${categoryId}&subCategory=${element.id}`,
          submenus: subMenus,
          childs: childs,
        };
        array.push(link);
      });
      return array;
    },

    setSubSubCategories(categoryId, subCategory, obj) {
      let array = [];
      obj.forEach((element) => {
        const link = {
          id: element.id,
          text: element.name,
          type: "sub-sub-category",
          value: `subSubCategory${element.id}`,
          to: `/products?category=${categoryId}&subCategory=${subCategory}&subSubCategory=${element.id}`,
          submenus: false,
          childs: [],
        };
        array.push(link);
      });
      return array;
    },

    setSubLinks(obj, key) {
      this.oldParentLink = this.parentLink;
      this.parentLink = {
        id: obj.id,
        text: obj.text,
        type: obj.type,
        to: obj.to,
        value: obj.value,
      };
      this.oldLinks = this.links;
      this.links = this.links[key].childs;
    },

    backCategory() {
      const type = this.parentLink.type;

      switch (type) {
        case "category":
          this.parentLink = null;
          this.oldLinks = [];
          this.links = this.setCategories();
          break;
        case "sub-category":
          this.parentLink = this.oldParentLink;
          this.links = this.oldLinks;
          break;
        case "sub-sub-category":
          this.links = this.oldLinks;
          break;
      }
    },
  },
};
</script>
