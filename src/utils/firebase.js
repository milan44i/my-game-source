import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyCY3CKjt9cbtAFBHFXdP8YT0u_H-OMJ18Q',
  authDomain: 'gamesource-afbee.firebaseapp.com',
  projectId: 'gamesource-afbee',
  storageBucket: 'gamesource-afbee.firebasestorage.app',
  messagingSenderId: '142718180269',
  appId: '1:142718180269:web:03afdb3a963f1b2fdb9f24',
  measurementId: 'G-8T3S1HS98R',
}

initializeApp(firebaseConfig)

const DB = getFirestore()
const AUTH = getAuth()

export { DB, AUTH }
