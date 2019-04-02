<template>
    <v-container fluid grid-list-lg>   
        <div>
            <v-layout row wrap>
                <v-flex shrink>
                    <h3>JS Frameworks</h3>
                </v-flex>
                <v-flex>
                    <hr style="margin-top: 10px; border: solid 0.5px #aaa"/>
                </v-flex>
            </v-layout>
            <v-layout row wrap mb-4>
                <v-flex xs6 v-for="(framework, i) in jsFrameworks" v-bind:key="framework.id">
                    <v-card @click="clickCard(framework)">
                        <v-img :src="framework.data.thumbnail" height="100" v-bind:class="{ 'inactive-logo': !isActive(framework) }"/>
                        <v-card-text class="card-text blue-grey lighten-4 blue-grey--text text--darken-4">
                            <span class="framework-name">{{framework.data.name}}</span>
                            <span class="framework-enrollments">
                                <i class="fab fa-github"></i>
                                {{kFormatter(framework.githubStars)}}
                            </span>
                        </v-card-text>
                    </v-card>
                </v-flex>
            </v-layout>

            <v-layout row wrap>
                <v-flex shrink>
                    <h3>UI Frameworks</h3>
                </v-flex>
                <v-flex>
                    <hr style="margin-top: 10px; border: solid 0.5px #aaa"/>
                </v-flex>
            </v-layout>
            <v-layout row wrap mb-4>
                <v-flex xs6 v-for="(framework, i) in uiFrameworks" v-bind:key="framework.id">
                    <v-card @click="clickCard(framework)">
                        <v-img :src="framework.data.thumbnail" height="100" v-bind:class="{ 'inactive-logo': !isActive(framework) }"/>
                        <v-card-text class="card-text blue-grey lighten-4 blue-grey--text text--darken-4">
                            <span class="framework-name">{{framework.data.name}}</span>
                            <span class="framework-enrollments">
                                <i class="fab fa-github"></i>
                                {{kFormatter(framework.githubStars)}}
                            </span>
                        </v-card-text>
                    </v-card>
                </v-flex>
            </v-layout>

            <v-layout row wrap>
                <v-flex shrink>
                    <h3>CSS Frameworks</h3>
                </v-flex>
                <v-flex>
                    <hr style="margin-top: 10px; border: solid 0.5px #aaa"/>
                </v-flex>
            </v-layout>
            <v-layout row wrap mb-4>
                <v-flex xs6 v-for="(framework, i) in cssFrameworks" v-bind:key="framework.id">
                    <v-card @click="clickCard(framework)">
                        <v-img :src="framework.data.thumbnail" height="100" v-bind:class="{ 'inactive-logo': !isActive(framework) }"/>
                        <v-card-text class="card-text blue-grey lighten-4 blue-grey--text text--darken-4">
                            <span class="framework-name">{{framework.data.name}}</span>
                            <span class="framework-enrollments">
                                <i class="fab fa-github"></i>
                                {{kFormatter(framework.githubStars)}}
                            </span>
                        </v-card-text>
                    </v-card>
                </v-flex>
            </v-layout>
        </div>
    </v-container>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { getFbUser } from '../../services/api'

@Component({
  components: {
  },
})
export default class Explore extends Vue {
    @Prop({ type: Array, required: true })
    frameworks: any[];
    @Prop({ type: Object, required: true })
    user: any;

    get jsFrameworks() {
        return this.frameworks.filter(framework => framework.data.type === 'js');
    }

    get cssFrameworks() {
        return this.frameworks.filter(framework => framework.data.type === 'css');
    }

    get uiFrameworks() {
        return this.frameworks.filter(framework => framework.data.type === 'ui');
    }

    clickCard(framework: any) {
        this.isActive(framework) ? 
            this.$router.push({ name: 'course-page', params: { framework }}) : 
            this.$router.push({ name: 'course-intro', params: { framework }});
    }

    isActive(framework: any) {
        return framework.data.enrolledBy ? framework.data.enrolledBy.includes(getFbUser().email!) : false;
    }
      
    kFormatter (num: number):string {
        return num >= 1000 ? (num/1000).toFixed(0) + 'k' : num.toString();
    }
}
</script>


<style>
    .card-text {
        padding: 1px;
    }

    .category-heading {
        margin-top: 150px;
    }

    span.framework-name {
        padding: 3px 5px;
        font-weight: 500;
        font-size: 1.2em;
    }
    span.framework-enrollments {
        padding: 5px 5px;
        font-weight: 300;
        font-size: 0.9em;
        float: right;
    }
    span .enrolled-icon {
        padding: 1px;
        margin: 0;
        font-size: 1em;
    }

    .inactive-logo {
        -webkit-filter: grayscale(100%);
        filter: grayscale(100%);

    }
</style>
