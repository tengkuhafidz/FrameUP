import Vue from 'vue';
import Router from 'vue-router';

import Home from './views/Home.vue';
import CourseIntro from './views/CourseIntro.vue';
import CoursePage from './views/CoursePage.vue';
import Lesson from './views/Lesson.vue';
import Quiz from './views/Quiz.vue';
import Login from './views/Login.vue';
import Profile from './views/Profile.vue';
import Preferences from './views/Preferences.vue';
import { getFbUser } from './services/api';


Vue.use(Router);

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '*',
      name: 'login',
      component: Login,
    },
    {
      path: '/',
      name: 'login',
      component: Login,
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/home',
      name: 'home',
      component: Home,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/course-intro',
      name: 'course-intro',
      component: CourseIntro,
      props: true,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/course-page',
      name: 'course-page',
      component: CoursePage,
      props: true,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/lesson',
      name: 'lesson',
      component: Lesson,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/quiz',
      name: 'quiz',
      component: Quiz,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/profile',
      name: 'profile',
      component: Profile,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/preferences',
      name: 'preferences',
      component: Preferences,
      meta: {
        requiresAuth: true
      }
    }
  ],
});

router.beforeEach((to, from, next) => {
  const currentUser = getFbUser();
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  if(requiresAuth && !currentUser) next('login');
  else if(!requiresAuth && currentUser) next('home');
  else next();
})

export default router;
