<template>
  <div class="home">
    <v-toolbar app fixed>
      <v-toolbar-title class="headline text-uppercase">
        <span>Frame</span>
        <span class="font-weight-light">UP</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="goProfile">
        <v-avatar size="32" >
          <img :src="user.photoURL"/>
        </v-avatar>
      </v-btn>
    </v-toolbar>

    <v-content>
      <div v-if="isFetching" class="pt-5 mt-5 text-xs-center">
        <v-progress-circular
            size="70"
            width="7"
            color="primary"
            indeterminate
          ></v-progress-circular>
      </div>
      <div v-if="!isFetching">
          <!-- Screens according to selected Bottom Nav option -->
          <Explore :frameworks="allFrameworks" :user="user" v-if="bottomNav=='explore'"/>
          <Learn :frameworks="enrolledFrameworks" v-if="bottomNav=='learn'" @change-tab="changeTab"/>
      </div>
    </v-content>

    <!-- Bottom Nav -->
    <v-bottom-nav :active.sync="bottomNav" :value="true" app fixed>
      <v-btn color="primary" flat value="explore">
        <span>Explore</span>
        <v-icon>explore</v-icon>
      </v-btn>
      <v-btn color="primary" flat value="learn">
        <span>Learn</span>
        <v-icon>code</v-icon>
      </v-btn>
    </v-bottom-nav>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Explore from '@/components/Home/Explore.vue'; // @ is an alias to /src
import Learn from '@/components/Home/Learn.vue';
import { getFbUser, attachGithubStarsToAllFrameworks, fetchUserDetails } from '../services/api';
import { db } from '../main';

@Component({
  components: {
    Explore,
    Learn
  },
})
export default class Home extends Vue {
  bottomNav = 'learn';
  isFetching = true;
  user:any = {};
  allFrameworks: any[] = [];
  userFrameworksProgress: any[] = [];
  
  async mounted() {
    this.isFetching=true;
    await this.fetchUser();
    await this.fetchFrameworks();
    this.isFetching = false;

    // if user have not taken up any frameworks yet, show explore tab as default
    // if(!this.isFetching && this.enrolledFrameworks.length < 1) {
    //   this.bottomNav = 'explore';
    // }
  }

  async fetchUser() {
    this.user = await fetchUserDetails();
  }

  async fetchFrameworks() {
    const dbFrameworks = await db.collection('frameworks').get();
    this.allFrameworks = await attachGithubStarsToAllFrameworks(dbFrameworks);
  }

  get enrolledFrameworks() {
    return this.allFrameworks.filter(framework => 
      framework.data.enrolledBy && framework.data.enrolledBy.includes(getFbUser().email!)
    );
  }

  changeTab(tabName: string) {
    this.bottomNav = tabName;
  }

  goProfile() {
   this.$router.push('profile');
  }
}
</script>

<style>
  a {
    text-decoration: none;
  }
</style>

