// Course Search Application - Vanilla JavaScript
class CourseSearchApp {
    constructor() {
        this.courses = [];
        this.searchInput = document.getElementById('searchInput');
        this.searchResults = document.getElementById('searchResults');
        this.noResults = document.getElementById('noResults');
        this.initialMessage = document.getElementById('initialMessage');
        this.clearBtn = document.getElementById('clearBtn');
        
        this.init();
    }

    async init() {
        try {
            await this.loadCourses();
            this.loadCustomSubjects(); // Load custom subjects from localStorage
            this.setupEventListeners();
            this.showInitialMessage();
        } catch (error) {
            console.error('Error initializing app:', error);
            this.showError('حدث خطأ في تحميل البيانات');
        }
    }

    async loadCourses() {
        try {
            const response = await fetch('./course_data.json');
            if (!response.ok) {
                throw new Error('Failed to load course data');
            }
            this.courses = await response.json();
        } catch (error) {
            console.error('Error loading courses:', error);
            throw error;
        }
    }

    setupEventListeners() {
        // Search input event listener with debouncing
        let searchTimeout;
        this.searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            const searchTerm = e.target.value.trim();
            
            // Show/hide clear button
            this.clearBtn.style.display = searchTerm ? 'block' : 'none';
            
            // Debounce search
            searchTimeout = setTimeout(() => {
                this.handleSearch(searchTerm);
            }, 300);
        });

        // Clear button event listener
        this.clearBtn.addEventListener('click', () => {
            this.searchInput.value = '';
            this.clearBtn.style.display = 'none';
            this.showInitialMessage();
            this.searchInput.focus();
        });

        // Enter key event listener
        this.searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleSearch(this.searchInput.value.trim());
            }
        });
    }

    handleSearch(searchTerm) {
        if (!searchTerm) {
            this.showInitialMessage();
            return;
        }

        const results = this.searchCourses(searchTerm);
        this.displayResults(results);
    }

    searchCourses(searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        
        return this.courses.filter(course => {
            const subjectNameLower = course.subject_name.toLowerCase();
            
            // Check for subject name match
            if (subjectNameLower.includes(searchLower)) {
                return true;
            }

            // Check for specialization code match (e.g., DS230, CS240, IT351)
           const specializations = ['DS', 'CS', 'IT' , 'MATH' , 'SCI' , 'STAT' , 'ISLAM'];
           for (const spec of specializations) {
              if (course[spec]) {
                const fullCode = `${spec}${course[spec]}`.toLowerCase();
                if (fullCode.includes(searchLower)) {
                    return true;
        }
    }
}

            // Check for just the code match (e.g., 230, 240, 351)
            if (
                (course.DS && course.DS.includes(searchTerm)) ||
                (course.CS && course.CS.includes(searchTerm)) ||
                (course.IT && course.IT.includes(searchTerm))||
                (course.MATH && course.MATH.includes(searchTerm))||
                (course.SCI && course.SCI.includes(searchTerm))||
                (course.STAT && course.STAT.includes(searchTerm))||
                (course.ISLAM && course.ISLAM.includes(searchTerm))
            ) {
                return true;
            }

            return false;
        });
    }

    displayResults(results) {
        this.hideAllMessages();

        if (results.length === 0) {
            this.showNoResults();
            return;
        }

        this.searchResults.innerHTML = '';
        
        results.forEach((course, index) => {
            const courseCard = this.createCourseCard(course, index);
            this.searchResults.appendChild(courseCard);
        });

        this.searchResults.style.display = 'grid';
    }

    createCourseCard(course, index) {
        const card = document.createElement('div');
        card.className = 'course-card';
        card.style.animationDelay = `${index * 0.1}s`;

        const codes = [];
        if (course.DS) codes.push({ label: 'DS', code: course.DS });
        if (course.CS) codes.push({ label: 'CS', code: course.CS });
        if (course.IT) codes.push({ label: 'IT', code: course.IT });
        if (course.MATH) codes.push({ label: 'MATH', code: course.MATH });
        if (course.SCI) codes.push({ label: 'SCI', code: course.SCI });
        if (course.STAT) codes.push({ label: 'STAT', code: course.STAT });
        if (course.ISLAM) codes.push({ label: 'ISLAM', code: course.ISLAM });

        const codesHTML = codes.map(({ label, code }) => 
            `<span class="code-badge">${label}${code}</span>`
        ).join('');

        // Extract hashtag from telegram instruction
        const telegramSearchQuery = codes.length > 0 ? `#${codes[0].label}${codes[0].code}` : '';
        const telegramUrl = `https://t.me/computingg?text=${encodeURIComponent(telegramSearchQuery)}`;

        card.innerHTML =card.innerHTML = `
    <div class="course-header">
        <div class="course-title">
            <h3>${course.subject_name}</h3>
        </div>
    </div>
    ${course.description ? `
        <div class="course-description" style="margin: 0.5rem 0 1rem 0; font-size: 0.95rem; color: #444;">
            ${course.description}
        </div>` : ''}
    <div class="course-codes">
        ${codesHTML}
    </div>
    <a href="${telegramUrl}" target="_blank" class="telegram-link">
        <i class="fab fa-telegram-plane"></i>
        <span>البحث في التليجرام عن ملفات المادة وتجميعات الفاينلز</span>
        <i class="fas fa-external-link-alt"></i>
    </a>
    <div class="search-instruction" style="margin-top: 1rem; padding: 0.8rem; background: rgba(102, 126, 234, 0.1); border-radius: 8px; font-size: 0.9rem; color: #555;">
        <i class="fas fa-info-circle" style="margin-left: 0.5rem; color: #667eea;"></i>
        للبحث عن ملفات المادة وتجميعات الفاينلز السابقة، من بحث القناة اكتب: <b>${telegramSearchQuery}</b> في قناة التليجرام.
    </div>
`;


        return card;
    }

    extractHashtag(instruction) {
        const match = instruction.match(/#(\w+)/);
        return match ? match[1] : '';
    }

    showInitialMessage() {
        this.hideAllMessages();
        this.initialMessage.style.display = 'block';
    }

    showNoResults() {
        this.hideAllMessages();
        this.noResults.style.display = 'block';
    }

    showError(message) {
        this.hideAllMessages();
        this.searchResults.innerHTML = `
            <div class="error-message" style="text-align: center; padding: 2rem; color: #ff6b6b;">
                <i class="fas fa-exclamation-triangle" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                <h3>خطأ</h3>
                <p>${message}</p>
            </div>
        `;
        this.searchResults.style.display = 'block';
    }

    hideAllMessages() {
        this.searchResults.style.display = 'none';
        this.noResults.style.display = 'none';
        this.initialMessage.style.display = 'none';
    }

    // Method to add new subject to the course data
    addNewSubject(subjectData) {
        // Validate required fields
        if (!subjectData.subject_name || !subjectData.description) {
            throw new Error('اسم المادة والوصف مطلوبان');
        }

        // Add to courses array
        this.courses.push(subjectData);
        
        // Save to localStorage for persistence (optional)
        const customSubjects = JSON.parse(localStorage.getItem('customSubjects') || '[]');
        customSubjects.push(subjectData);
        localStorage.setItem('customSubjects', JSON.stringify(customSubjects));
        
        return true;
    }

    // Method to load custom subjects from localStorage
    loadCustomSubjects() {
        const customSubjects = JSON.parse(localStorage.getItem('customSubjects') || '[]');
        this.courses = [...this.courses, ...customSubjects];
    }

    // Method to export all subjects (including custom ones) as JSON
    exportSubjects() {
        const dataStr = JSON.stringify(this.courses, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = 'course_data_updated.json';
        link.click();
        
        URL.revokeObjectURL(url);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Make app globally accessible
    window.courseSearchApp = new CourseSearchApp();
});

// Add some utility functions for enhanced user experience
document.addEventListener('DOMContentLoaded', () => {
    // Add smooth scrolling for better UX
    const searchInput = document.getElementById('searchInput');
    
    // Focus on search input when page loads
    setTimeout(() => {
        searchInput.focus();
    }, 500);

    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + K to focus search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            searchInput.focus();
            searchInput.select();
        }
        
        // Escape to clear search
        if (e.key === 'Escape') {
            searchInput.value = '';
            searchInput.blur();
            document.getElementById('clearBtn').style.display = 'none';
            new CourseSearchApp().showInitialMessage();
        }
    });

    // Add loading animation for better perceived performance
    const originalFetch = window.fetch;
    window.fetch = function(...args) {
        const searchResults = document.getElementById('searchResults');
        if (args[0] && args[0].includes('course_data.json')) {
            searchResults.innerHTML = `
                <div class="loading">
                    <i class="fas fa-spinner"></i>
                    <span style="margin-right: 1rem;">جاري التحميل...</span>
                </div>
            `;
            searchResults.style.display = 'block';
        }
        return originalFetch.apply(this, args);
    };
});

