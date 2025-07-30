// Firebase Configuration
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile 
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc 
} from 'firebase/firestore';

// Firebase configuration object
const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Firebase Authentication System
class FirebaseAuthSystem {
  constructor() {
    this.currentUser = null;
    this.auth = auth;
    this.db = db;
    
    // Listen for authentication state changes
    onAuthStateChanged(auth, (user) => {
      this.currentUser = user;
      this.updateUI();
      if (user) {
        console.log('✅ المستخدم مسجل الدخول:', user.email);
        this.loadUserData();
      } else {
        console.log('❌ لا يوجد مستخدم مسجل');
      }
    });
  }

  // Register new user
  async register(email, password, fullName, username) {
    try {
      console.log('🔄 بدء عملية التسجيل...');
      
      // Create user account
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      console.log('✅ تم إنشاء الحساب بنجاح');
      
      // Update user profile
      await updateProfile(user, {
        displayName: fullName
      });
      
      // Save additional user data to Firestore
      await setDoc(doc(db, 'users', user.uid), {
        fullName: fullName,
        username: username,
        email: email,
        createdAt: new Date(),
        isActive: true
      });
      
      console.log('✅ تم حفظ بيانات المستخدم بنجاح');
      
      this.showMessage('✅ تم إنشاء الحساب بنجاح!', 'success');
      return { success: true, user: user };
      
    } catch (error) {
      console.error('❌ خطأ في التسجيل:', error);
      let errorMessage = 'حدث خطأ في التسجيل';
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'هذا الإيميل مستخدم بالفعل';
          break;
        case 'auth/weak-password':
          errorMessage = 'كلمة المرور ضعيفة (يجب أن تكون 6 أحرف على الأقل)';
          break;
        case 'auth/invalid-email':
          errorMessage = 'الإيميل غير صحيح';
          break;
      }
      
      this.showMessage('❌ ' + errorMessage, 'error');
      return { success: false, error: errorMessage };
    }
  }

  // Login user
  async login(email, password) {
    try {
      console.log('🔄 بدء عملية تسجيل الدخول...');
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      console.log('✅ تم تسجيل الدخول بنجاح');
      
      this.showMessage('✅ مرحباً بك!', 'success');
      return { success: true, user: user };
      
    } catch (error) {
      console.error('❌ خطأ في تسجيل الدخول:', error);
      let errorMessage = 'حدث خطأ في تسجيل الدخول';
      
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'هذا الحساب غير موجود';
          break;
        case 'auth/wrong-password':
          errorMessage = 'كلمة المرور غير صحيحة';
          break;
        case 'auth/invalid-email':
          errorMessage = 'الإيميل غير صحيح';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'محاولات كثيرة، حاول لاحقاً';
          break;
      }
      
      this.showMessage('❌ ' + errorMessage, 'error');
      return { success: false, error: errorMessage };
    }
  }

  // Logout user
  async logout() {
    try {
      await signOut(auth);
      console.log('✅ تم تسجيل الخروج بنجاح');
      this.showMessage('تم تسجيل الخروج بنجاح', 'info');
      return { success: true };
    } catch (error) {
      console.error('❌ خطأ في تسجيل الخروج:', error);
      return { success: false, error: error.message };
    }
  }

  // Load user data from Firestore
  async loadUserData() {
    if (!this.currentUser) return null;
    
    try {
      const userDoc = await getDoc(doc(db, 'users', this.currentUser.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        console.log('✅ تم تحميل بيانات المستخدم:', userData);
        return userData;
      } else {
        console.log('❌ لا توجد بيانات إضافية للمستخدم');
        return null;
      }
    } catch (error) {
      console.error('❌ خطأ في تحميل بيانات المستخدم:', error);
      return null;
    }
  }

  // Update UI based on authentication state
  updateUI() {
    const authButtons = document.querySelectorAll('.auth-buttons, .auth-buttons-mobile');
    const userProfile = document.querySelectorAll('.user-profile, .user-profile-mobile');
    const addCourseButtons = document.querySelectorAll('.add-course-btn, .add-course-btn-mobile');
    
    if (this.currentUser) {
      // User is logged in
      authButtons.forEach(btn => btn.style.display = 'none');
      userProfile.forEach(profile => {
        profile.style.display = 'flex';
        const nameElements = profile.querySelectorAll('.user-name, .user-name-mobile');
        nameElements.forEach(nameEl => {
          nameEl.textContent = this.currentUser.displayName || 'مستخدم';
        });
      });
      addCourseButtons.forEach(btn => btn.style.display = 'block');
    } else {
      // User is not logged in
      authButtons.forEach(btn => btn.style.display = 'flex');
      userProfile.forEach(profile => profile.style.display = 'none');
      addCourseButtons.forEach(btn => btn.style.display = 'none');
    }
  }

  // Show message to user
  showMessage(message, type = 'info') {
    // Remove existing messages
    const existingMessage = document.querySelector('.firebase-message');
    if (existingMessage) {
      existingMessage.remove();
    }
    
    // Create new message
    const messageDiv = document.createElement('div');
    messageDiv.className = `firebase-message fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 ${
      type === 'success' ? 'bg-green-500 text-white' :
      type === 'error' ? 'bg-red-500 text-white' :
      'bg-blue-500 text-white'
    }`;
    messageDiv.textContent = message;
    
    document.body.appendChild(messageDiv);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      if (messageDiv.parentNode) {
        messageDiv.remove();
      }
    }, 5000);
  }

  // Check if user is logged in
  isLoggedIn() {
    return !!this.currentUser;
  }

  // Get current user data
  getCurrentUser() {
    return this.currentUser;
  }
}

// Export the Firebase auth system
export default FirebaseAuthSystem;
