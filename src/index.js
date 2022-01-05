import { initializeApp } from 'firebase/app'
import {
    getFirestore, collection, onSnapshot,
    addDoc, deleteDoc, doc,
    query,
    orderBy, serverTimestamp,
    getDoc, updateDoc,
} from 'firebase/firestore'
import {
    getAuth,
    createUserWithEmailAndPassword,
    signOut, signInWithEmailAndPassword,
    onAuthStateChanged
} from 'firebase/auth'

const firebaseConfig = {
    apiKey: "AIzaSyDIHKkSoxMJlNWJO95-XRyS_ARC68103nc",
    authDomain: "fir-9-tutorial-5a5ff.firebaseapp.com",
    projectId: "fir-9-tutorial-5a5ff",
    storageBucket: "fir-9-tutorial-5a5ff.appspot.com",
    messagingSenderId: "461349212535",
    appId: "1:461349212535:web:8e70f4e3a47f94680e9172"
};

// init firebase app
initializeApp(firebaseConfig);

// init services
const db = getFirestore();
const auth = getAuth();

// collection ref'
const colRef = collection(db, 'books');

// queries
const q = query(colRef, orderBy('createdAt'));

// real time collection data (as opposed to getting it once on refresh with getDoc)
const unsubCol = onSnapshot(q, (snapshot) => {
    let books = [];
    snapshot.docs.forEach((doc) => {
        books.push({ ...doc.data(), id: doc.id })
    })
    console.log(books);

})

// addding documents
const addBookForm = document.querySelector(".add");
addBookForm.addEventListener("submit", e => {
    e.preventDefault()

    addDoc(colRef, {
        title: addBookForm.title.value,
        author: addBookForm.author.value,
        createdAt: serverTimestamp()
    })
        .then(() => {
            addBookForm.reset()
        })
})

// deleting documents
const deleteBookForm = document.querySelector(".delete")
deleteBookForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const docRef = doc(db, 'books', deleteBookForm.id.value);

    deleteDoc(docRef)
        .then(() => {
            deleteBookForm.reset();
        })

})

// get a single document (real-time listener)
const docRef = doc(db, 'books', 'RaQ3ErifRjeqHu9IF8Co')


const unsubDoc = onSnapshot(docRef, (doc) => {
    console.log(doc.data(), doc.id)
})

// updating a single document
const updateForm = document.querySelector(".update")
updateForm.addEventListener("submit", e => {
    e.preventDefault();

    const docRef = doc(db, 'books', updateForm.id.value);

    updateDoc(docRef, {
        title: "updated title"

    })
        .then(() => {
            updateForm.reset();
        })
})

//signing users up
const signupForm = document.querySelector('.signup')

signupForm.addEventListener("submit", e => {
    e.preventDefault()

    const email = signupForm.email.value;
    const password = signupForm.password.value;

    createUserWithEmailAndPassword(auth, email, password)
        .then((cred) => {
            console.log('user created: ', cred.user)
            signupForm.reset();
        })
        .catch((err) => {
            console.log(err.message);
        })
})

//logging in and out
const logoutButton = document.querySelector('.logout')
logoutButton.addEventListener("click", () => {

    signOut(auth)
        .then(() => {
            console.log('the user logged out')
        })
        .catch((err) => {
            console.log(err.message)
        })
});

const loginForm = document.querySelector('.login')
loginForm.addEventListener("submit", e => {
    e.preventDefault()

    const email = loginForm.email.value;
    const password = loginForm.password.value;

    signInWithEmailAndPassword(auth, email, password)
        .then((cred) => {
            console.log('user logged in: ', cred.user)
            loginForm.reset()
        })
        .catch(err => {
            console.log(err.message)
        })
});

// subscribing to auth changes

const unsubAuth = onAuthStateChanged(auth, (user) => {
    console.log('user status changed: ', user)
})

// unsubscribing to auth changes
const unsubButton = document.querySelector('.unsub')
unsubButton.addEventListener('click', () => {
    console.log('unsubscribing');
    // the onSnapshot function return af function we've stored in these const
    // simply calling the function unsibribes from changes
    unsubCol()
    unsubDoc()
    unsubAuth()
})
