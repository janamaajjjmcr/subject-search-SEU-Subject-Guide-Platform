// Authentication System for Course Search App
class AuthSystem {
    constructor() {
        this.currentUser = null;
        this.users = this.loadUsers();
        this.init();
    }

    init() {
        this.checkLoginStatus();
        this.setupAuthEventListeners();
    }

    // Load users from localStorage
    loadUsers() {
        return JSON.parse(localStorage.getItem('courseApp_users') || '[]');
    }

    // Save users to localStorage
    saveUsers() {
        localStorage.setItem('courseApp_users', JSON.stringify(this.users));
    }

    // Check if user is logged in
    checkLoginStatus() {
        const loggedInUser = localStorage.getItem('courseApp_currentUser');
        if (loggedInUser) {
            this.currentUser = JSON.parse(loggedInUser);
            this.updateUI();
        }
    }

    // Register new user
    register(userData) {
        const { username, email, password, fullName } = userData;
        
        console.log('🔐 Attempting registration for:', username);

        // Validate input
        if (!username || !email || !password || !fullName) {
            throw new Error('جميع الحقول مطلوبة');
        }

        if (password.length < 6) {
            throw new Error('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
        }

        // Check if user already exists
        if (this.users.find(user => user.username === username)) {
            throw new Error('اسم المستخدم موجود بالفعل');
        }

        if (this.users.find(user => user.email === email)) {
            throw new Error('البريد الإلكتروني مسجل مسبقاً');
        }

        // Create new user
        const newUser = {
            id: Date.now().toString(),
            username,
            email,
            fullName,
            password: btoa(password), // Simple encoding (in real app, use proper hashing)
            joinDate: new Date().toISOString(),
            addedCourses: []
        };

        this.users.push(newUser);
        this.saveUsers();
        
        console.log('✅ User registered successfully:', newUser.username);
        console.log('📊 Total users now:', this.users.length);

        return { success: true, message: 'تم إنشاء الحساب بنجاح' };
    }

    // Login user
    login(credentials) {
        const { username, password } = credentials;
        
        console.log('🔑 Attempting login for:', username);

        if (!username || !password) {
            throw new Error('اسم المستخدم وكلمة المرور مطلوبان');
        }

        const user = this.users.find(u => 
            (u.username === username || u.email === username) && 
            u.password === btoa(password)
        );

        if (!user) {
            console.log('❌ Login failed - user not found or wrong password');
            throw new Error('اسم المستخدم أو كلمة المرور غير صحيحة');
        }

        this.currentUser = user;
        localStorage.setItem('courseApp_currentUser', JSON.stringify(user));
        this.updateUI();
        
        console.log('✅ Login successful for:', user.fullName);

        return { success: true, message: 'تم تسجيل الدخول بنجاح', user };
    }

    // Logout user
    logout() {
        this.currentUser = null;
        localStorage.removeItem('courseApp_currentUser');
        this.updateUI();
        this.closeAllModals();
    }

    // Check if user is logged in
    isLoggedIn() {
        return this.currentUser !== null;
    }

    // Get current user
    getCurrentUser() {
        return this.currentUser;
    }

    // Add course to user's added courses
    addCourseToUser(courseId) {
        if (!this.isLoggedIn()) return;

        if (!this.currentUser.addedCourses.includes(courseId)) {
            this.currentUser.addedCourses.push(courseId);
            this.updateUserData();
        }
    }

    // Remove course from user's added courses
    removeCourseFromUser(courseId) {
        if (!this.isLoggedIn()) return;

        this.currentUser.addedCourses = this.currentUser.addedCourses.filter(id => id !== courseId);
        this.updateUserData();
    }

    // Update user data in storage
    updateUserData() {
        const userIndex = this.users.findIndex(u => u.id === this.currentUser.id);
        if (userIndex !== -1) {
            this.users[userIndex] = this.currentUser;
            this.saveUsers();
            localStorage.setItem('courseApp_currentUser', JSON.stringify(this.currentUser));
        }
    }

    // Update UI based on login status
    updateUI() {
        const authButtons = document.querySelector('.auth-buttons');
        const userProfile = document.querySelector('.user-profile');
        const addCourseBtn = document.querySelector('.add-course-btn');

        if (this.isLoggedIn()) {
            // Hide auth buttons, show user profile
            if (authButtons) authButtons.style.display = 'none';
            if (userProfile) {
                userProfile.style.display = 'flex';
                userProfile.querySelector('.user-name').textContent = this.currentUser.fullName;
            }
            if (addCourseBtn) addCourseBtn.style.display = 'inline-flex';
        } else {
            // Show auth buttons, hide user profile
            if (authButtons) authButtons.style.display = 'flex';
            if (userProfile) userProfile.style.display = 'none';
            if (addCourseBtn) addCourseBtn.style.display = 'none';
        }

        // Update any course cards that show user info
        this.updateCourseCards();
    }

    // Update course cards to show/hide user-specific actions
    updateCourseCards() {
        const courseCards = document.querySelectorAll('.course-card');
        courseCards.forEach(card => {
            const actionButtons = card.querySelector('.course-actions');
            const userCreated = card.dataset.createdBy;

            if (actionButtons && userCreated) {
                if (this.isLoggedIn() && userCreated === this.currentUser.id) {
                    actionButtons.style.display = 'flex';
                } else {
                    actionButtons.style.display = 'none';
                }
            }
        });
    }

    // Setup event listeners for auth system
    setupAuthEventListeners() {
        // Login form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin(e);
            });
        }

        // Register form
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleRegister(e);
            });
        }

        // Logout button
        document.addEventListener('click', (e) => {
            if (e.target.matches('.logout-btn') || e.target.closest('.logout-btn')) {
                this.logout();
            }
        });
    }

    // Handle login form submission
    handleLogin(e) {
        const formData = new FormData(e.target);
        const credentials = {
            username: formData.get('username'),
            password: formData.get('password')
        };

        try {
            const result = this.login(credentials);
            this.showMessage(result.message, 'success');
            this.closeModal('loginModal');
        } catch (error) {
            this.showMessage(error.message, 'error');
        }
    }

    // Handle register form submission
    handleRegister(e) {
        const formData = new FormData(e.target);
        const userData = {
            fullName: formData.get('fullName'),
            username: formData.get('username'),
            email: formData.get('email'),
            password: formData.get('password')
        };

        try {
            const result = this.register(userData);
            this.showMessage(result.message, 'success');
            this.closeModal('registerModal');
        } catch (error) {
            this.showMessage(error.message, 'error');
        }
    }

    // Show message to user
    showMessage(message, type = 'info') {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.innerHTML = `
            <div class="message-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
                <span>${message}</span>
            </div>
        `;

        document.body.appendChild(messageDiv);

        // Auto remove after 3 seconds
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.parentNode.removeChild(messageDiv);
            }
        }, 3000);
    }

    // Close modal
    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    // Close all modals
    closeAllModals() {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => modal.classList.add('hidden'));
    }

    // Check if user can perform action (for course management)
    canPerformAction() {
        if (!this.isLoggedIn()) {
            this.showMessage('يجب تسجيل الدخول أولاً لإضافة أو تعديل المواد', 'error');
            return false;
        }
        return true;
    }

    // Get user's added courses
    getUserCourses() {
        if (!this.isLoggedIn()) return [];
        
        // Get custom courses from localStorage
        const customSubjects = JSON.parse(localStorage.getItem('customSubjects') || '[]');
        return customSubjects.filter(course => course.createdBy === this.currentUser.id);
    }
}

// Initialize auth system
window.authSystem = new AuthSystem();
