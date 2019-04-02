<template>
    <div class="profile">
        <v-toolbar app fixed>
            <v-icon @click="$router.go(-1)">arrow_back</v-icon>
            <v-toolbar-title class="headline text-uppercase">
                <span>My</span>
                <span class="font-weight-light">Profile</span>
            </v-toolbar-title>
        </v-toolbar>
        <v-content v-if="user && userVueProgress">
            <!-- <v-layout> 
                <v-img :src="user.photoURL" aspect-ratio="1.7"></v-img>
            </v-layout> -->

            <v-layout row wrap class="text-xs-center">
                
                <v-card
                    class="mx-auto"
                    color="primary"
                    dark
                    style="width: 100vw"
                >


                    <v-card-text class="headline font-weight-bold">
                        <h1 class="title font-weight-light mb-3">Today</h1>
                        <v-progress-circular
                            size="100"
                            width="15"
                            :value="userLessonsCompletedPercentage"
                            color="white"
                            >
                            {{userLessonsCompleted}} 
                        </v-progress-circular>
                        <p class="caption mb-0 pb-0">Out of your goal of {{userDailyGoal}} daily lessons</p>

                        <p class="pt-0 mt-0">{{progressEncouragingText}}</p>
                        <v-btn flat dark outline @click="goToLearnTab">{{progressButtonText}}</v-btn>
                    </v-card-text>

                    <v-card-actions>
                    <v-list-tile class="grow">
                        <v-list-tile-avatar color="grey darken-3">
                            <v-img
                                class="elevation-6"
                                :src="user.photoURL"
                            ></v-img>
                        </v-list-tile-avatar>

                        <v-list-tile-content>
                            <v-list-tile-title>{{user.displayName}}</v-list-tile-title>
                        </v-list-tile-content>

                        <v-layout
                        align-center
                        justify-end
                        >

                        <v-icon class="mr-1">show_chart</v-icon>
                        <span class="subheading"> 4 Days Streak</span>
                        </v-layout>
                    </v-list-tile>
                    </v-card-actions>
                </v-card>
<!-- 
                <v-flex xs12 pa-2>
                    <p class="title">Completed Today</p>
                </v-flex>
                <v-flex xs12 pa-2>
                    <v-progress-circular
                        size="100"
                        width="15"
                        :value="lessonsCompletedToday"
                        color="primary"
                        >
                        0 
                    </v-progress-circular>
                </v-flex>
                <v-flex xs12 pa-2>
                    <p class="headline">2 more lessons to go!</p>
                </v-flex>
                <v-flex xs12 mr-5 ml-5 mb-4>
                    <v-btn block color="primary">Continue 5 days Streak</v-btn>
                </v-flex>            
 -->
            </v-layout>
            <v-layout row>
                <v-flex xs6>
                    <v-card dark tile flat color="gray">
                        <v-card-text> 
                            <span>Frameworks: {{frameworkCount}}</span><br/>
                            <small>{{frameworkProgressText}}</small>
                        </v-card-text> 
                    </v-card>
                </v-flex>
                <v-flex xs6>
                    <v-card dark tile flat color="gray">
                        <v-card-text>
                            <span>Best Streak: 15 days</span><br/>
                            <small>Higher than 60% of users</small>
                        </v-card-text>
                    </v-card>
                </v-flex>
            </v-layout>
<!-- 
            <v-layout row>
                <v-card style="width: 100%">
                    <v-card-text class="text-xs-center">
                        <p class="subheading" style="padding: 0; margin: 0"><b>1 more lesson to go for the day!</b></p>
                        <small>Out of my goal of lessons per day</small>
                        <br/>
                        <v-btn color="primary" @click="$router.replace('home')" small>Learn Now</v-btn>
                    </v-card-text>
                </v-card>
            </v-layout> -->

            <v-layout row class="mt-5 pl-5 pr-5" v-if="frameworkCount > 0">
                <v-btn block color="primary" @click="goToSurvey">Feedback</v-btn>
            </v-layout> 

            <v-layout row class="mt-5 pl-5 pr-5">
                <v-btn block color="dark" outline @click="setPreferences">Reset Goals &amp; Preferences</v-btn>
            </v-layout> 
            

            <v-layout row class="mt-2 text-align-center">
                <v-btn @click="logout" flat block class="">Logout</v-btn>
            </v-layout>  
        </v-content>
        
    </div>
</template>

<script lang="ts">
import firebase from 'firebase';
import { Component, Vue } from "vue-property-decorator";
import {db} from '../main';
import { getFbUser, fetchUserProgress } from '../services/api';

@Component({
  components: {},
})
export default class Profile extends Vue {
    user:any = {};
    userVueProgress:any = {
        checkpoint: {
            lesson: 1
        }
    };
    frameworkCount = 0;

    async mounted() {
        const dbUser = await db.collection('users').doc(getFbUser().email!).get();
        this.user = dbUser.data();
        const userProgress = await fetchUserProgress('vue');
        if(userProgress) {
            this.userVueProgress = userProgress;
            this.frameworkCount = 1;
        }
    }

    setPreferences() {
        this.$router.push('preferences');
    }

    goToSurvey() {
        window.open("https://form.jotform.me/90868758242470", "_blank");
    }

    goToLearnTab() {
        this.$router.replace('home');
    }
    
    get userDailyGoal() {
        return this.user.preferences.numOfLessons;
    }

    get userLessonsCompleted() {
        return this.userVueProgress.checkpoint.lesson - 1;
    }

    get userLessonsLeft() {
        return this.userDailyGoal - this.userLessonsCompleted;
    }

    get userLessonsCompletedPercentage() {
        return (this.userLessonsCompleted / this.userDailyGoal) * 100;
    }

    get progressEncouragingText() {
        if(this.userLessonsLeft === 1) return '1 lesson to go!'
        return (this.userLessonsLeft > 0) ? `${this.userLessonsLeft} more lessons to go!` : 'Well done!';
    }

    get progressButtonText() {
        return (this.userLessonsLeft > 0) ? `Learn Now` : 'Continue learning';
    }

    get frameworkProgressText() {
        return this.frameworkCount < 1 ? 'Join 10 others in learning!' : 'Same as the average user'
    }

    logout() {
        firebase.auth().signOut().then(() => {
            this.$router.replace('login');
        })
    }
}
</script>


<style>
    .profile{
        height: 100vh;
    }
</style>

