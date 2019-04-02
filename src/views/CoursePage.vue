<template>
    <div class="coursePage">
        <v-toolbar app fixed>
            <v-icon @click="goBack()">arrow_back</v-icon>
            <v-toolbar-title class="headline text-uppercase">
                <span v-if="framework">{{framework.data.name}}</span>
                <span class="font-weight-light">Course</span>
            </v-toolbar-title>
             <v-spacer></v-spacer>
             <v-toolbar-items>
                <v-progress-circular
                    size="40"
                    width="5"
                    :value="percentageCompletion"
                    color="primary"
                    class="mt-2"
                    v-if="lessons && userProgress"
                    >
                    {{ percentageCompletion }}%
                </v-progress-circular>
             </v-toolbar-items>
        </v-toolbar>
        <v-content>
            <div v-if="!framework || !lessons" class="pt-5 mt-5 text-xs-center">
                <v-progress-circular
                    size="70"
                    width="7"
                    color="primary"
                    indeterminate
                ></v-progress-circular>
            </div>
            <div v-if="framework && lessons && userProgress">
                <v-sheet height="180" class="text-xs-center" dark>
                    <v-img :src="framework.data.thumbnail" height="120" contain="false"></v-img>
                    <v-btn v-if="!userProgress" color="primary" @click="enterLesson(lessons[0])">Start learning</v-btn>
                    <v-btn v-if="userProgress" color="primary" @click="enterLesson(lessons[userProgress.checkpoint.lesson - 1])">Continue learning</v-btn>
                </v-sheet>
                <v-list two-line subheader v-if="lessons">
                    <template>
                        <div class="blue-grey lighten-4">
                            <v-subheader>Lessons </v-subheader>
                        </div>
                        <v-list-tile
                            v-for="(lesson, i) in lessons"
                            v-bind:key="lesson.id"
                            avatar
                            @click="enterLesson(lesson)"
                        > 
                                <v-list-tile-avatar v-if="userProgress">
                                    <v-icon v-if="parseInt(lesson.id) < userProgress.checkpoint.lesson">check_circle</v-icon>
                                    <v-icon v-if="parseInt(lesson.id) === userProgress.checkpoint.lesson">lock_open</v-icon>
                                    <v-icon v-if="parseInt(lesson.id) > userProgress.checkpoint.lesson">lock</v-icon>
                                </v-list-tile-avatar>

                                <v-list-tile-content>
                                    <v-list-tile-title>{{ lesson.data.title }}</v-list-tile-title>
                                    <v-list-tile-sub-title>Estimated: {{ lesson.data.duration }} minutes</v-list-tile-sub-title>
                                </v-list-tile-content>

                                <v-list-tile-action>
                                    <v-btn icon ripple>
                                        <v-icon color="grey lighten-1">play_circle_filled</v-icon>
                                    </v-btn>
                                </v-list-tile-action>
                        </v-list-tile>
                        <v-divider></v-divider>
                    </template>
                </v-list>
            </div>
        </v-content>
    </div>    
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { fetchLessons, fetchUserProgress, fetchUserDetails } from '../services/api';

@Component({
  components: {
  },
})
export default class CoursePage extends Vue {

    framework: any = null;
    lessons: any[] = [];
    userProgress: any = null;
    user:any = null;

    async created() {
        this.framework = this.$route.params.framework;
    }

    async mounted() {
        if(this.framework && this.framework.id) {
            this.lessons = await fetchLessons(this.framework.id);
            this.userProgress = await fetchUserProgress(this.framework.id);
            this.user = await fetchUserDetails();
            console.log('this.userProgress', this.userProgress)
        }
    }

    enterLesson(lesson:any) {
        if(lesson.id > this.userProgress.checkpoint.lesson){
            Vue.swal('Ooops!', 'This lesson is currently locked', 'warning');
        } else {
            this.$router.push({ name: 'lesson', params: { lesson, framework: this.framework, user: this.user }});
        }
    }

    goBack() {
       this.$router.go(-1);
    }

    get percentageCompletion() {
        console.log('percentageCompletion')
        if(this.userProgress) {
            const userLessonCompleted = parseInt(this.userProgress.checkpoint.lesson) - 1;
            const totalLessons = this.lessons.length;
            return userLessonCompleted/totalLessons * 100;
        }
        return 0;
    }
}
</script>