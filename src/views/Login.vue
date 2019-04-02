<template>
    <div class="login">
        <v-container>
            <v-layout wrap>
                    <v-flex xs10 offset-xs1 pt-5>
                        <v-img src="img/logo.png"></v-img>
                    </v-flex>
                    <v-flex xs12 class="text-xs-center" id="login-button" pt-5>
                        <v-btn fab large color="white" @click="login">
                            <v-avatar size="32" >
                                <img src="img/google.svg"/>
                            </v-avatar>
                        </v-btn>
                    </v-flex>
            </v-layout>
        </v-container>
        <p></p>
    </div>
</template>

<script lang="ts">
import firebase from 'firebase';
import { Component, Vue } from "vue-property-decorator";
import { db } from '../main';

@Component({
  components: {}
})
export default class Login extends Vue {
    login() {
        var provider = new firebase.auth.GoogleAuthProvider();
            firebase.auth().signInWithPopup(provider).then(result => {
                // var token = result.credential!.accessToken!;
                var user = result.user;  

                db.collection('users').doc(user!.email!).get().then((doc: any) => {
                    if (doc.exists) {
                        this.updateUserDB(user);
                        this.$router.replace('home');

                    } else {
                        this.updateUserDB(user);
                        this.$router.replace('preferences');
                    }
                }).catch(function(error: any) {
                    console.log("Error getting document:", error);
                });

                
            }).catch(function(error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                var email = error.email;
                var credential = error.credential;
            });
    }

    updateUserDB(user: any) {
        const { displayName, email, metadata, photoURL, uid } = user;
        
        db.collection('users').doc(email)
            .set(
                { 
                    displayName, 
                    email, 
                    photoURL, 
                    uid, 
                    createdAt: metadata.creationTime, 
                    lastLogin: metadata.lastSignInTime 
                }, 
                { merge: true });

    }
}
</script>

