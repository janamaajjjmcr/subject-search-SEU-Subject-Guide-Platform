// Account Page JavaScript Functions

class AccountManager {
    constructor() {
        this.authSystem = null;
        this.currentUser = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadTheme();
        // Initialize auth system after DOM is loaded
        if (typeof AuthSystem !== 'undefined') {
            this.authSystem = new AuthSystem();
            this.checkAuthState();
        }
    }

    setupEventListeners() {
        // Theme toggle
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', this.toggleTheme.bind(this));
        }

        // Form submissions
        const loginForm = document.getElementById('login-form');
        const registerForm = document.getElementById('register-form');
        
        if (loginForm) {
            loginForm.addEventListener('submit', this.handleLogin.bind(this));
        }
        
        if (registerForm) {
            registerForm.addEventListener('submit', this.handleRegister.bind(this));
        }

        // Tab switching
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('tab-button')) {
                const tabName = e.target.textContent.includes('تسجيل الدخول') ? 'login' : 'register';
                this.switchTab(tabName, e.target);
            }
        });
    }

    checkAuthState() {
        const currentUserData = localStorage.getItem('courseApp_currentUser');
        if (currentUserData) {
            this.currentUser = JSON.parse(currentUserData);
            this.showDashboard(this.currentUser);
        } else {
            this.showAuthSection();
        }
    }

    async handleLogin(e) {
        e.preventDefault();
        
        const username = document.getElementById('login-username').value.trim();
        const password = document.getElementById('login-password').value;
        
        console.log('Login attempt:', { username, password: '***' }); // Debug
        
        if (!username || !password) {
            this.showMessage('يرجى ملء جميع الحقول المطلوبة', 'error');
            return;
        }

        const submitBtn = e.target.querySelector('button[type="submit"]');
        this.setLoading(submitBtn, true);
        
        try {
            // Always use localStorage for reliability
            console.log('Using AuthSystem for login'); // Debug
            const result = this.authSystem.login({ username, password });
            console.log('Login successful:', result); // Debug
            
            this.showMessage('🎉 مرحباً بك! تم تسجيل الدخول بنجاح', 'success');
            setTimeout(() => {
                this.showDashboard(result.user);
                this.setLoading(submitBtn, false);
            }, 1500);
        } catch (error) {
            console.error('Login error:', error); // Debug
            this.showMessage(error.message || 'فشل في تسجيل الدخول', 'error');
            this.setLoading(submitBtn, false);
        }
    }

    async handleRegister(e) {
        e.preventDefault();
        
        const userData = {
            fullName: document.getElementById('register-fullname').value.trim(),
            username: document.getElementById('register-username').value.trim(),
            email: document.getElementById('register-email').value.trim(),
            password: document.getElementById('register-password').value
        };
        
        console.log('Registration data:', userData); // Debug
        
        // Validation
        if (!userData.fullName || !userData.username || !userData.email || !userData.password) {
            this.showMessage('يرجى ملء جميع الحقول المطلوبة', 'error');
            return;
        }

        if (!this.isValidEmail(userData.email)) {
            this.showMessage('يرجى إدخال بريد إلكتروني صحيح', 'error');
            return;
        }

        if (userData.password.length < 6) {
            this.showMessage('كلمة المرور يجب أن تحتوي على 6 أحرف على الأقل', 'error');
            return;
        }

        const submitBtn = e.target.querySelector('button[type="submit"]');
        this.setLoading(submitBtn, true);
        
        try {
            // Always try localStorage first for reliability
            if (this.authSystem) {
                console.log('Using AuthSystem for registration'); // Debug
                
                const result = this.authSystem.register(userData);
                console.log('Registration result:', result); // Debug
                
                this.showMessage('🎉 تم إنشاء حسابك بنجاح! مرحباً بك', 'success');
                
                // Find the newly created user
                const newUser = this.authSystem.users.find(u => u.username === userData.username);
                console.log('New user found:', newUser); // Debug
                
                if (newUser) {
                    this.authSystem.currentUser = newUser;
                    localStorage.setItem('courseApp_currentUser', JSON.stringify(newUser));
                    console.log('User saved to localStorage:', localStorage.getItem('courseApp_currentUser')); // Debug
                    
                    setTimeout(() => {
                        this.showDashboard(newUser);
                        this.setLoading(submitBtn, false);
                    }, 1500);
                } else {
                    throw new Error('فشل في حفظ بيانات المستخدم');
                }
            } else if (window.firebaseAuth) {
                // Try Firebase if available
                const result = await window.firebaseAuth.register(userData);
                if (result.success) {
                    this.showMessage('🎉 تم إنشاء حسابك بنجاح مع Firebase! مرحباً بك', 'success');
                    setTimeout(() => {
                        this.showDashboard(result.user);
                        this.setLoading(submitBtn, false);
                    }, 1500);
                }
            } else {
                throw new Error('نظام المصادقة غير متوفر');
            }
        } catch (error) {
            console.error('Registration error:', error); // Debug
            this.showMessage(error.message || 'حدث خطأ أثناء إنشاء الحساب', 'error');
            this.setLoading(submitBtn, false);
        }
    }

    showAuthSection() {
        const authSection = document.getElementById('auth-section');
        const dashboardSection = document.getElementById('dashboard-section');
        
        if (authSection) authSection.classList.remove('hidden');
        if (dashboardSection) dashboardSection.classList.add('hidden');
    }

    showDashboard(user) {
        const authSection = document.getElementById('auth-section');
        const dashboardSection = document.getElementById('dashboard-section');
        
        if (authSection) authSection.classList.add('hidden');
        if (dashboardSection) dashboardSection.classList.remove('hidden');
        
        this.currentUser = user;
        this.updateUserInfo(user);
        this.loadMyCourses(user.username);
    }

    updateUserInfo(user) {
        const elements = {
            'user-fullname': user.fullName,
            'user-email': user.email,
            'user-join-date': new Date(user.joinDate).toLocaleDateString('ar-EG', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })
        };

        Object.entries(elements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) element.textContent = value;
        });
    }

    loadMyCourses(username) {
        try {
            const allCourses = JSON.parse(localStorage.getItem('userAddedCourses') || '[]');
            const myCourses = allCourses.filter(course => course.addedBy === username);
            
            const totalCoursesElement = document.getElementById('total-courses');
            if (totalCoursesElement) {
                totalCoursesElement.textContent = myCourses.length;
            }
            
            const coursesGrid = document.getElementById('my-courses-grid');
            const emptyState = document.getElementById('empty-state');
            
            if (myCourses.length === 0) {
                if (emptyState) emptyState.classList.remove('hidden');
                if (coursesGrid) coursesGrid.classList.add('hidden');
            } else {
                if (emptyState) emptyState.classList.add('hidden');
                if (coursesGrid) {
                    coursesGrid.classList.remove('hidden');
                    coursesGrid.innerHTML = myCourses.map(course => this.createCourseCard(course)).join('');
                }
            }
        } catch (error) {
            console.error('Error loading courses:', error);
            this.showMessage('حدث خطأ أثناء تحميل المواد', 'error');
        }
    }

    createCourseCard(course) {
        const level = course.level || 'غير محدد';
        const formattedDate = new Date(course.dateAdded).toLocaleDateString('ar-EG', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
        
        return `
            <div class="my-course-card" data-course-id="${course.id}">
                <button class="delete-course-btn" onclick="accountManager.deleteCourse('${course.id}')" title="حذف المادة">
                    <i class="fas fa-trash text-red-400"></i>
                </button>
                
                <div class="mb-4">
                    <h3 class="text-xl font-bold text-white mb-2">${this.escapeHtml(course.code)}</h3>
                    <p class="text-lg text-stardust/90 mb-3">${this.escapeHtml(course.title)}</p>
                    <span class="inline-block px-3 py-1 bg-gradient-to-r from-plasma/20 to-aurora/20 text-aurora text-sm rounded-full border border-aurora/30">
                        المستوى ${this.escapeHtml(level)}
                    </span>
                </div>
                
                ${course.description ? `<p class="text-stardust/70 text-sm mb-4">${this.escapeHtml(course.description)}</p>` : ''}
                
                ${course.resources && course.resources.length > 0 ? `
                    <div class="mt-4">
                        <h4 class="font-semibold text-stardust mb-2">المصادر:</h4>
                        <div class="space-y-2">
                            ${course.resources.map(resource => `
                                <a href="${this.escapeHtml(resource.url)}" target="_blank" class="block text-aurora hover:text-plasma transition duration-300 text-sm">
                                    <i class="fas fa-external-link-alt mr-1"></i>
                                    ${this.escapeHtml(resource.title)}
                                </a>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
                
                <div class="mt-4 pt-4 border-t border-white/10 flex justify-between items-center text-xs text-stardust/60">
                    <span>أُضيفت في: ${formattedDate}</span>
                    <span>الكلية: ${this.escapeHtml(course.college || 'غير محدد')}</span>
                </div>
            </div>
        `;
    }

    deleteCourse(courseId) {
        if (!confirm('هل أنت متأكد من حذف هذه المادة؟ لا يمكن التراجع عن هذا الإجراء.')) {
            return;
        }
        
        try {
            const allCourses = JSON.parse(localStorage.getItem('userAddedCourses') || '[]');
            const updatedCourses = allCourses.filter(course => course.id !== courseId);
            
            localStorage.setItem('userAddedCourses', JSON.stringify(updatedCourses));
            
            // Add smooth removal animation
            const courseCard = document.querySelector(`[data-course-id="${courseId}"]`);
            if (courseCard) {
                courseCard.style.transition = 'all 0.3s ease';
                courseCard.style.transform = 'scale(0.8)';
                courseCard.style.opacity = '0';
                
                setTimeout(() => {
                    this.loadMyCourses(this.currentUser.username);
                }, 300);
            }
            
            this.showMessage('تم حذف المادة بنجاح', 'success');
        } catch (error) {
            console.error('Error deleting course:', error);
            this.showMessage('حدث خطأ أثناء حذف المادة', 'error');
        }
    }

    logout() {
        if (confirm('هل أنت متأكد من تسجيل الخروج؟')) {
            if (this.authSystem) {
                this.authSystem.logout();
            }
            this.currentUser = null;
            this.showAuthSection();
            this.showMessage('تم تسجيل الخروج بنجاح', 'success');
            
            // Clear forms
            const forms = ['login-form', 'register-form'];
            forms.forEach(formId => {
                const form = document.getElementById(formId);
                if (form) form.reset();
            });
        }
    }

    switchTab(tabName, buttonElement) {
        // Hide all tabs
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
        });
        
        // Remove active from all buttons
        document.querySelectorAll('.tab-button').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Show selected tab
        const selectedTab = document.getElementById(tabName + '-tab');
        if (selectedTab) selectedTab.classList.add('active');
        if (buttonElement) buttonElement.classList.add('active');
        
        // Clear forms
        const forms = document.querySelectorAll('form');
        forms.forEach(form => form.reset());
    }

    showMessage(text, type = 'info') {
        const container = document.getElementById('message-container');
        if (!container) return;
        
        const message = document.createElement('div');
        
        let bgColor, borderColor, textColor;
        switch(type) {
            case 'success':
                bgColor = 'bg-green-500/20';
                borderColor = 'border-green-500/30';
                textColor = 'text-green-400';
                break;
            case 'error':
                bgColor = 'bg-red-500/20';
                borderColor = 'border-red-500/30';
                textColor = 'text-red-400';
                break;
            default:
                bgColor = 'bg-blue-500/20';
                borderColor = 'border-blue-500/30';
                textColor = 'text-blue-400';
        }
        
        message.className = `p-4 rounded-lg border backdrop-blur-lg ${bgColor} ${borderColor} ${textColor} message animate-slide-in`;
        message.innerHTML = `
            <div class="flex items-center justify-between">
                <div class="flex items-center">
                    <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-triangle' : 'fa-info-circle'} mr-2"></i>
                    <span>${this.escapeHtml(text)}</span>
                </div>
                <button onclick="this.parentElement.parentElement.remove()" class="ml-2 hover:opacity-70 transition duration-200">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        container.appendChild(message);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (message.parentElement) {
                message.style.opacity = '0';
                message.style.transform = 'translateX(100%)';
                setTimeout(() => message.remove(), 300);
            }
        }, 5000);
    }

    setLoading(element, isLoading) {
        if (!element) return;
        
        if (isLoading) {
            element.classList.add('loading');
            element.disabled = true;
        } else {
            element.classList.remove('loading');
            element.disabled = false;
        }
    }

    toggleTheme() {
        document.body.classList.toggle('light-mode');
        const isLight = document.body.classList.contains('light-mode');
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
        
        const icon = document.querySelector('#theme-toggle i');
        if (icon) {
            icon.className = isLight ? 'fas fa-moon text-aurora' : 'fas fa-sun text-aurora';
        }
    }

    loadTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light') {
            document.body.classList.add('light-mode');
            const icon = document.querySelector('#theme-toggle i');
            if (icon) icon.className = 'fas fa-moon text-aurora';
        }
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Global functions for HTML onclick handlers
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const button = input.nextElementSibling?.querySelector('i');
    
    if (input.type === 'password') {
        input.type = 'text';
        if (button) button.className = 'fas fa-eye-slash';
    } else {
        input.type = 'password';
        if (button) button.className = 'fas fa-eye';
    }
}

function switchTab(tabName) {
    // Hide all tab contents
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => content.classList.add('hidden'));
    
    // Remove active class from all tab buttons
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => button.classList.remove('active'));
    
    // Show selected tab content
    const selectedTab = document.getElementById(`${tabName}-tab`);
    if (selectedTab) selectedTab.classList.remove('hidden');
    
    // Add active class to selected button
    const selectedButton = tabName === 'login' ? 
        document.querySelector('.tab-button:first-child') : 
        document.querySelector('.tab-button:last-child');
    if (selectedButton) selectedButton.classList.add('active');
}

function logout() {
    if (accountManager && accountManager.authSystem) {
        accountManager.authSystem.logout();
        window.location.href = 'index.html';
    }
}

// Global account manager instance
let accountManager;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    accountManager = new AccountManager();
});

// Make logout function global for HTML onclick
window.logout = function() {
    if (accountManager) {
        accountManager.logout();
    }
};

// Make switchTab function global for HTML onclick
window.switchTab = function(tabName) {
    if (accountManager) {
        const buttonElement = event.target;
        accountManager.switchTab(tabName, buttonElement);
    }
};
