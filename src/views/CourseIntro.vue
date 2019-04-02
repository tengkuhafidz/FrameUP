<template>
  <div class="course-intro">
    <v-toolbar app fixed>
      <v-icon @click="$router.go(-1)">arrow_back</v-icon>
      <v-toolbar-title class="headline text-uppercase">
        <span>{{ framework.data.name }}</span>
        <span class="font-weight-light">Intro</span>
      </v-toolbar-title>
    </v-toolbar>
    <v-content class="content" style="min-height: 100vh; padding-top: 20x; padding-bottom: 20px;">
      <v-img
        class="elevation-10"
        src="https://joanmira.com/static/92add4dc47e7ace48d915fb9de2dcbbc/73b7f/vuejs.jpg"
        height="200"
      ></v-img>
      <v-layout row>
        <v-flex xs6>
          <v-card dark tile flat color="gray">
            <v-card-text>Github Stars: {{framework.githubStars}}</v-card-text>
          </v-card>
        </v-flex>
        <v-flex xs6 v-if="framework.data.enrolledBy">
          <v-card dark tile flat color="gray">
            <v-card-text >Enrolment: {{framework.data.enrolledBy.length}}</v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
      <v-container>
        <br />
        <p class="subheading"> {{ framework.data.description }} </p>
        <br />
        <div>
          <h3 class="title heading">Benefits of using {{ framework.data.name }} </h3>
          <ul class="subheading">
            <li v-for="benefit in framework.data.benefits">{{ benefit }}</li>
          </ul>
        </div>
      </v-container>
    </v-content>
    <div class="bottom-action elevation-10">
      <v-container>
        <v-btn block v-if="framework.id !== 'vue'" disabled>Learn {{ framework.data.name }}</v-btn>
        <v-btn block color="primary" v-if="framework.id === 'vue'" @click="enrollPrompt = true">Learn {{ framework.data.name }}</v-btn>
      </router-link>
      </v-container>
    </div>

    <v-dialog v-model="enrollPrompt" scrollable max-width="300px">
      <v-card>
        <v-card-title>Why do you want to explore {{ framework.data.name }}? </v-card-title>
        <v-divider></v-divider>
        <v-card-text style="height: 300px;">
          <v-radio-group v-model="enrolmentMotivation" column>
            <v-radio label="It is useful to me for my profession" value="1"></v-radio>
            <v-radio label="It is necessary for my future work" value="2"></v-radio>
            <v-radio label="Just out of my curiosity" value="3"></v-radio>
            <v-radio label="It is available via a mobile app" value="4"></v-radio>
            <v-radio label="I want to master it" value="5"></v-radio>
            <v-radio label="I am confident of completing" value="6"></v-radio>
          </v-radio-group>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn color="blue darken-1" flat @click="enrollPrompt = false">Close</v-btn>
          <v-btn color="blue darken-1" flat @click="enroll">Submit</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Explore from "@/components/Home/Explore.vue"; // @ is an alias to /src
import Learn from "@/components/Home/Learn.vue";
import { db } from '../main';
import { getFbUser, updateUserEnrolledIn, updateFrameworkEnrolledBy } from '@/services/api';


@Component({
  components: {
    Explore,
    Learn
  }
})
export default class CourseIntro extends Vue {  
  framework: any;
  enrollPrompt: boolean = false;
  enrolmentMotivation: string = '1';
  
  created() {
    this.framework = this.$route.params.framework;
  }

  handleEnrollBtnClick() {
    this.enrollPrompt = true;
  }

  async enroll() {    
    await updateFrameworkEnrolledBy(this.framework.id);
    await updateUserEnrolledIn(this.framework.id, this.enrolmentMotivation);
    this.$router.replace({ name: 'home' });
  }
}
</script>

<style>
.heading {
  margin: 10px auto;
}
.subheading li {
  line-height: 1.8;
}
.bottom-action {
  position: fixed;
  bottom: 0;
  width: 100vw;
  height: 80px;
  background-color: #f5f5f5;
}
.course-intro .content {
  margin-bottom: 80px;
}
</style>

