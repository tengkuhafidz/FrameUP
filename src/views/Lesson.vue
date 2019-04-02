<template>
<div class="lesson">
  <v-stepper v-model="currPage" v-if="lessonCards && lessonCards.length > 0">
    <v-stepper-header>
      <v-layout v-for="(lessonCard, i) in lessonCards" :key="lessonCard.id">
        <v-stepper-step :complete="currPage > i+1" :step="i+1"></v-stepper-step>
        <v-divider v-if="i < lessonCards.length"></v-divider>    
      </v-layout> 
    </v-stepper-header>
    <v-stepper-items class="stepper-content">
      <v-stepper-content v-for="(lessonCard, i) in lessonCards" :key="lessonCard.id" :step="i+1">
        <!-- if it's a learning card -->
        <v-card
          class="mb-4 content pa-4"
          color="grey lighten-4"
          v-if="lessonCard.type === 'page'"
        >
          <h1 class="title" v-html="lessonCard.data.title"></h1>
          <br />
          <div v-for="content in lessonCard.data.contents">
            <p v-if="content.type === 'paragraph'" v-html="content.content"></p>
            <img v-if="content.type === 'code'" :src="content.img" class="mb-4" width="280"/>
          </div>
        </v-card>
        <v-layout row wrap justify-space-between v-if="lessonCard.type === 'page'">
          <v-flex xs2>
            <v-btn v-if="currPage === 1" color="primary" @click="$router.replace({ name: 'course-page', params: { framework }})" fab small dark>
              <v-icon>close</v-icon>
            </v-btn>
            <v-btn v-if="currPage > 1" color="primary" @click="currPage--" fab small dark>
              <v-icon>keyboard_arrow_left</v-icon>
            </v-btn>
          </v-flex>
          <v-flex xs2>
            <v-btn color="primary" @click="handleNext" fab small dark>
              <v-icon>keyboard_arrow_right</v-icon>
            </v-btn>
          </v-flex>
        </v-layout>
        <!-- if it's a quiz card -->
        <v-card
          dark
          class="mb-4 content pa-4"
          v-if="lessonCard.type === 'quiz'"
        >
          <h1 class="title">{{lessonCard.data.question}}</h1>
          <br />
          <v-radio-group v-model="selectedAnswer">
            <v-radio
              v-for="(option, i) in lessonCard.data.options"
              :key="i"
              :label="option.text"
              :value="i"
            ></v-radio>
          </v-radio-group>
        </v-card>
        <v-layout row wrap v-if="lessonCard.type === 'quiz'">
          <v-flex xs2>
            <v-btn v-if="currPage > 1" color="primary" @click="currPage--" fab small dark>
              <v-icon>keyboard_arrow_left</v-icon>
            </v-btn>
          </v-flex>
          <v-flex xs9>
            <div class="text-xs-center ml-3">
              <v-btn round block color="primary" dark @click="checkAnswer(lessonCard.data.options)">Check Answer</v-btn>
            </div>
          </v-flex>
        </v-layout>
      </v-stepper-content>
    </v-stepper-items>
  </v-stepper>

  <!-- DIALOG: first prompt -->
  <v-dialog v-model="firstPromptDialog" max-width="500px">
      <v-card>
        <v-card-title>
          <h1 class="title">Sweet! You're done with your first card.</h1>
        </v-card-title>
        <v-card-text>
          <p class="subheadline">Each card in a lesson is focused on teaching you a single micro-content. </p>
          <p class="subheadline">Knowing how short one card is, would you prefer to be quized after each card, or at the end of the lesson?</p>
          <v-radio-group v-model="quizPosition">
            <v-radio
              label="After each card"
              value="between"
            ></v-radio>
            <v-radio
              label="At the end of the lesson"
              value="end"
            ></v-radio>
          </v-radio-group>
        </v-card-text>
        <v-card-actions>
          <v-btn flat @click="firstPromptDialog=false">Close</v-btn>
          <v-btn color="primary" flat @click="submitQuizPosition">Submit</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</div>      
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
// You have to extract the component from the module
import { updateCheckpoint, setQuizPositionPreference } from '../services/api';


@Component({
  components: {
  },
})
export default class Lesson extends Vue {
  currPage:number = 1;
  lesson:any;
  selectedAnswer:number = 0;
  framework: any = '';
  user: any;
  quizPosition: string = 'between';
  firstPromptDialog:boolean = false;
  loadingFirstPromptDialog: boolean = false;
  hasQuizPositionPreference:boolean = false;
  lessonCards: any[] = [];

  created() {
    this.framework = this.$route.params.framework;
    this.lesson = this.$route.params.lesson;
    this.user = this.$route.params.user;
    this.hasQuizPositionPreference = this.user.preferences.quizPosition ? true : false;
  }
  
  mounted() {
    this.lessonCards = [...this.lesson.pages, ...this.lesson.quiz];
    console.log('this.lessonCards', this.lessonCards);
    if(this.hasQuizPositionPreference && this.user.preferences.quizPosition === 'between') this.sortQnBetweenPages();
  }

  sortQnBetweenPages() {

    this.lessonCards = [];

    for(let i = 0; i < this.lesson.pages.length; i++) {
      this.lessonCards.push(this.lesson.pages[i]);
      this.lessonCards.push(this.lesson.quiz[i]);
    }
  }

  handleNext() {
    if(this.hasQuizPositionPreference) {
      this.currPage++;
    } else {
      this.firstPromptDialog = true;
    }
  }

  async submitQuizPosition() {
    // send preference to firebase
    await setQuizPositionPreference(this.quizPosition);
    if(this.quizPosition === 'between') this.sortQnBetweenPages();
    this.hasQuizPositionPreference = true;
    this.firstPromptDialog = false
    this.currPage++;
  }

  async checkAnswer(options:any[]) {
    // IF CORRECT ANSWER
    if (options[this.selectedAnswer].isCorrect) {
      // IF NOT FINAL QUESTION IN THE LESSON
      if(this.currPage < this.lessonCards.length) {
        Vue.swal('Good job!',
        'You answer is correct.',
        'success').then(() => this.currPage++);
      } else {
        // IF FINAL QUESTION OF THE LESSON
        Vue.swal('Well Done!',
          'Lesson completed. 1 more lesson to go for the day!',
          'success').then(async () => {
            await updateCheckpoint(this.framework, this.lesson);
            this.$router.replace({ name: 'course-page', params: { framework: this.framework }});
        });
      }
    } else {
      Vue.swal('Ooops!', 'Please try again.', 'error');
    }
  }
}
</script>

<style>
  .content {
    height: 70vh;
    overflow-y: auto;
  }

  .navigation-buttons {
    position: absolute;
    bottom: 20px;
  }

  .stepper-content {
    height: 90vh;
  }
</style>
