<template>
    <v-container fluid grid-list-lg>
        <v-layout row wrap v-if="!frameworks || frameworks.length < 1" class="text-xs-center mt-5 pt-5">
            <v-flex>
                <img src="img/empty.png" style="width: 40%"/>
            </v-flex>
            <v-flex>
                <h4 class="display-1">No Courses</h4>
                <p class="subheading">It looks like you've not taken up any frameworks to learn yet</p>
                <v-btn large color="primary" @click="explore">Explore now</v-btn>
            </v-flex>
        </v-layout>
        <!-- if user is learning a particular tech -->
        <v-layout row wrap v-if="frameworks && frameworks.length > 0">
            <v-flex xs12 v-for="framework in frameworks" :key="framework.id" mb4>
                <v-card color="primary" class="white--text">
                    <v-layout>
                    <v-flex xs5>
                        <v-img
                            :src="framework.data.thumbnail"
                            height="125px"
                            contain
                        ></v-img>
                    </v-flex>
                    <v-flex xs7>
                        <v-card-title primary-title>
                        <div>
                            <div class="headline">{{framework.data.name}}</div>
                            <div>The Progressive JavaScript Framework</div>
                        </div>
                        </v-card-title>
                    </v-flex>
                    </v-layout>
                    <v-divider light></v-divider>
                    <v-card-actions class="pa-3" >
                        <router-link :to="{ name: 'course-page', params: { framework }}">
                            <v-btn flat dark >Continue Learning</v-btn>
                        </router-link>
                        <v-spacer></v-spacer>
                        <v-progress-linear :value="vuePercentageCompleted" color="white" v-if="userVueProgress && vueLessons "></v-progress-linear>
                    </v-card-actions>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { fetchLessons, fetchUserProgress } from '../../services/api';

@Component({
  components: {
  },
})
export default class Learn extends Vue {
    @Prop({ type: Array, required: true })
    frameworks: any[];
    userVueProgress: any = {};
    vueLessons:any[] = [];
    
    async mounted() {
        this.userVueProgress = await fetchUserProgress('vue');
        this.vueLessons = await fetchLessons('vue');
    }

    explore() {
        this.$emit('change-tab', 'explore');
    }

    get vuePercentageCompleted() {
        if(this.userVueProgress && this.vueLessons) {
            const lessonsCompleted = this.userVueProgress.checkpoint.lesson - 1;
            const totalLessons = this.vueLessons.length;
            return (lessonsCompleted / totalLessons) *  100;
        }
        return 0;
    }
}
</script>
