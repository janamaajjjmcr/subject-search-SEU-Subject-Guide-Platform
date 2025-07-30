// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCen8J6HuLOj3d1tpEA8aF13XVmGxiG9BY",
    authDomain: "seu-subjects.firebaseapp.com",
    projectId: "seu-subjects",
    storageBucket: "seu-subjects.firebasestorage.app",
    messagingSenderId: "552315681734",
    appId: "1:552315681734:web:d7ae70e54e7e2bf7b290c7",
    measurementId: "G-Y2FL6V8X3L"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Register form
if (document.getElementById('register-form')) {
    const registerForm = document.getElementById('register-form');
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        auth.createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                user.updateProfile({
                    displayName: name
                }).then(() => {
                    // Add user to firestore
                    db.collection('users').doc(user.uid).set({
                        name: name,
                        email: email
                    }).then(() => {
                        window.location.href = 'login.html';
                    });
                });
            })
            .catch((error) => {
                alert(error.message);
            });
    });
}

// Login form
if (document.getElementById('login-form')) {
    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        auth.signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                // Signed in
                window.location.href = 'index.html';
            })
            .catch((error) => {
                alert(error.message);
            });
    });
}

// Logout button
if (document.getElementById('logout-btn')) {
    const logoutBtn = document.getElementById('logout-btn');
    logoutBtn.addEventListener('click', () => {
        auth.signOut().then(() => {
            window.location.href = 'index.html';
        });
    });
}

// Profile page
if (document.getElementById('user-info')) {
    auth.onAuthStateChanged((user) => {
        if (user) {
            db.collection('users').doc(user.uid).get().then((doc) => {
                if (doc.exists) {
                    document.getElementById('user-name').textContent = doc.data().name;
                    document.getElementById('user-email').textContent = doc.data().email;
                }
            });

            // Load user's courses
            const userCourses = document.getElementById('user-courses');
            db.collection('courses').where('userId', '==', user.uid).get().then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    const course = doc.data();
                    const courseCard = document.createElement('div');
                    courseCard.className = 'course-card p-4 rounded-lg shadow-md';
                    courseCard.innerHTML = `
                        <h3 class="text-xl font-bold">${course.subject_name}</h3>
                        <p class="text-gray-700">${course.description}</p>
                    `;
                    userCourses.appendChild(courseCard);
                });
            });
        } else {
            window.location.href = 'login.html';
        }
    });
}
