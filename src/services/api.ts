import axios from 'axios';
import firebase from 'firebase';
import { db } from '../main';

export const getFbUser: () => any = () => {
    return firebase.auth().currentUser!;
}

export const fetchUserDetails = async () => {
    const dbUser = await db.collection('users').doc(getFbUser().email!).get();
    return dbUser.data();
}

export const attachGithubStarsToAllFrameworks = async (dbFrameworks:any) => {
    const allFrameworks:any[] = [];
    dbFrameworks.forEach(async (doc:any) => {
      const githubStars = await fetchGithubStars(doc.data().github);
      allFrameworks.push({ id: doc.id, data: doc.data(), githubStars});      
    })
    return allFrameworks;
}

// fetch github repo details with github API, and return the stars
export const fetchGithubStars = async (url: string) => {
    const githubRepoDetails = await axios.get(url);
    return githubRepoDetails.data.stargazers_count;
}

//add user email to framework's enrolledBy array field
export const updateFrameworkEnrolledBy = async (frameworkId: string) => {
    await db.collection('frameworks')
        .doc(frameworkId)
        .update({ enrolledBy: firebase.firestore.FieldValue.arrayUnion(getFbUser().email!) });
}

//add framework id to users' enrolledIn sub collection
export const updateUserEnrolledIn = async (frameworkId: string, enrolmentMotivation: string) => {
    const enrolledInRef = db.collection('users').doc(getFbUser().email!).collection('enrolledIn').doc(frameworkId);
    await enrolledInRef.set({
            startedAt: new Date(),
            checkpoint: {
                lesson: 1,
                achievedAt: new Date()
            },
            enrolmentMotivation
        });
}

// get lessons of a particular framwrok, given framework id 
export const fetchLessons = async (frameworkId:string) => {
    const lessonsRef = db.collection('frameworks').doc(frameworkId).collection('lessons');
    // get all lesson documents
    const dbLessons = await lessonsRef.get();
    console.log('fetchLessons dbLessons', dbLessons)
    const lessons: any[] = [];
    dbLessons.forEach(async lessonDoc => {
        console.log('dbLessons.forEach lessonDoc', lessonDoc )
        // get all pages in a single lesson
        const dbPages = await lessonsRef.doc(lessonDoc.id).collection('pages').get();
        console.log('dbLessons.forEach dbPages', dbPages )
        const dbQuiz = await lessonsRef.doc(lessonDoc.id).collection('quiz').get();


        const pages: any[] = [];
        const quiz: any[] = [];
        dbPages.forEach(pageDoc => pages.push({id: pageDoc.id, data: pageDoc.data(), type: 'page'}));
        dbQuiz.forEach(quizDoc => quiz.push({id: quizDoc.id, data: quizDoc.data(), type: 'quiz'}));

        lessons.push({ id: lessonDoc.id, data: lessonDoc.data(), pages, quiz })
    });

    return lessons;
}

// update user checkpoint after completing one lesson
export const updateCheckpoint = async (framework: any, lesson: any) => {
    const enrolledInRef = db.collection('users').doc(getFbUser().email!).collection('enrolledIn').doc(framework.id);
    await enrolledInRef.update({
        checkpoint: {
            lesson: parseInt(lesson.id) + 1,
            achievedAt: new Date()
        }
    })
}

// get user progress in a particular framework
export const fetchUserProgress = async (frameworkId:string) => {
    const enrolledInRef = db.collection('users').doc(getFbUser().email!).collection('enrolledIn').doc(frameworkId);
    const userProgress = await enrolledInRef.get();

    return userProgress.data();
}

export const setQuizPositionPreference = async (quizPositon:string) => {
    const userRef = db.collection('users').doc(getFbUser().email!);
    await userRef.update({ "preferences.quizPosition": quizPositon })
}


