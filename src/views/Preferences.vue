<template>
  <v-stepper v-model="e6" vertical dark style="min-height: 100vh">
    <v-stepper-step :complete="e6 > 1" step="1">
      Before we begin! 
    </v-stepper-step>
    <v-stepper-content step="1">
      <v-card color="grey darken-1" class="mb-5 pa-4" height="200px">
          <p>Hey there, {{user.displayName}}!</p>
          <p>Let's set some goals and preferences first shall we? </p>
          <small>P.S. You can change these later on</small>
      </v-card>
      <v-btn color="primary" @click="e6 = 2">Okay</v-btn>
      <!-- <v-btn flat>No thanks</v-btn> -->
    </v-stepper-content>

    <v-stepper-step :complete="e6 > 2" step="2">Your Motivation</v-stepper-step>
    <v-stepper-content step="2">
      <v-card color="grey darken-1" class="mb-5 pa-4" height="200px">
          <p>What's your motivation in wanting to learn new frontend frameworks and concepts daily? </p>
          <v-text-field
            v-model="motivation"
            label="State your motivation"
            required
            ></v-text-field>
      </v-card>
      <v-btn color="primary" @click="validateAndContinue(2)">Continue</v-btn>
      <v-btn flat @click="e6 = 1">Back</v-btn>
    </v-stepper-content>

    <v-stepper-step :complete="e6 > 3" step="3">Learning Amount</v-stepper-step>

    <v-stepper-content step="3">
      <v-card color="grey darken-1" class="mb-5 pa-4" height="280px">
          <p>How many 5-minutes lessons would you like to learn daily? </p>
          <v-radio-group v-model="numOfLessons">
            <v-radio
                v-for="n in 5"
                :key="n"
                :label="`${n}`"
                :value="n"
            ></v-radio>
            </v-radio-group>
      </v-card>
      <v-btn color="primary" @click="validateAndContinue(3)">Continue</v-btn>
      <v-btn flat @click="e6 = 2">Back</v-btn>
    </v-stepper-content>

    <v-stepper-step :complete="e6 > 4" step="4">Learning Time</v-stepper-step>
    <v-stepper-content step="4">
      <v-card color="grey darken-1" class="mb-5 pa-4" height="200px">
        <p>At what time would you like us to prompt you to learn on a typical day? </p>
        <small>Recommended: during typically idle time. e.g. travel time, lunch break, etc.</small>
        <br/>
        <input type="time" id="appt" name="appt" v-model="learningTimePrompt" required>
      </v-card>
      <v-btn color="primary" @click="validateAndContinue(4)">Continue</v-btn>
      <v-btn flat @click="e6 = 3">Back</v-btn>
    </v-stepper-content>

    <v-stepper-step step="5">Reminder Time</v-stepper-step>
    <v-stepper-content step="5">
      <v-card color="grey darken-1" class="mb-5 pa-4" height="200px">
        <p>At what time would you like us to remind you to complete your goal? </p>
        <small>This should be after your typical learning time, and you will only be prompted if you have yet to complete your goal for the day.</small>
        <br/>
        <input type="time" id="appt" name="appt" v-model="reminderTimePrompt" required>
      </v-card>
      <v-btn color="primary" @click="submit" >Submit</v-btn>
      <v-btn flat @click="e6 = 4">Back</v-btn>
    </v-stepper-content>
  </v-stepper>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { db } from '../main';
import { getFbUser } from '../services/api';

@Component({
  components: {},
})
export default class Prefrences extends Vue {
    e6:number = 1;
    user:any = {};

    motivation = '';
    numOfLessons = 0;
    learningTimePrompt = null;
    reminderTimePrompt = null;

    mounted () {
        this.user = getFbUser();
    }

    validateMotivationAndContinue() {
      if (this.motivation) {
        this.e6 = 3;
      } else {
        Vue.swal('Hold up...', 'Please enter a valid answer first before contninuing', 'warning');
      }
    }

    validateAndContinue(step: number) {
      this.e6 = step + 1;
      // switch(step) {
      //   case 2:
      //     this.motivation ? this.e6 = step + 1 : this.swalInputError();
      //     break;
      //   case 3: 
      //     this.numOfLessons ? this.e6 = step + 1 : this.swalInputError();
      //     break;
      //   case 4:
      //     this.learningTimePrompt ? this.e6 = step + 1 : this.swalInputError();
      //     break;
      // }
    }

    swalInputError() {
       Vue.swal('Hold up...', 'Please enter a valid answer first before continuing', 'warning');
    }



    async submit() {
      // if(this.reminderTimePrompt && this.reminderTimePrompt! > this.learningTimePrompt!) {
          await db.collection('users').doc(this.user.email).update({
              preferences: {
                  motivation: this.motivation,
                  numOfLessons: this.numOfLessons,
                  learningTimePrompt: this.learningTimePrompt,
                  reminderTimePrompt: this.reminderTimePrompt
              }
          });
          this.$router.replace('profile');
      // } else {
      //     Vue.swal('Hold up...', 'Please enter a time that is after the previously set learning time', 'warning');
      // }

        
    }

}
</script>
