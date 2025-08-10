/*
 * Language Toggle Script
 *
 * This script enables switching between Arabic and English language on the
 * subject-search website. It defines simple translation mappings for
 * commonly visible UI elements such as the site title, search placeholder,
 * and labels on the account page. When the user clicks the language
 * toggle button, the script updates the document direction (rtl for
 * Arabic, ltr for English) and swaps the innerText or placeholders of
 * targeted elements. The selected language is persisted in localStorage
 * so it can be restored on subsequent visits.
 *
 * Note: Only a handful of strings are translated here for demonstration.
 * To fully internationalize the site you should extend the `translations`
 * object with all static text from your HTML pages.
 */

(() => {
  // Define translation tables for Arabic (ar) and English (en).
  const translations = {
    ar: {
      siteTitle: 'كلية الحوسبة | جامعة SEU - بحث المواد والمقررات الدراسية',
      searchPlaceholder: 'ابحث عن مادة أو رقم مقرر...',
      myAccount: 'حسابي',
      login: 'تسجيل الدخول',
      register: 'إنشاء حساب',
      backToMain: 'العودة للرئيسية',
      mainPage: 'الرئيسية',
      home: 'الرئيسية',
      allColleges: 'كل الكليات',
      computerScience: 'علوم الحاسب',
      informationTechnology: 'تقنية المعلومات',
      dataScience: 'علوم البيانات',
      addCourse: 'إضافة مادة',
      courses: 'المواد',
      resources: 'الموارد',
      description: 'الوصف',
      major: 'التخصص',
      level: 'المستوى',
      credits: 'الساعات',
      seeAll: 'عرض الكل',
      localCourses: 'المواد المحلية',
      firebaseCourses: 'مواد قاعدة البيانات',
      totalContributions: 'إجمالي المساهمات',
      academicMaterials: 'نظام المواد الأكاديمية',
      collegeComputing: 'كلية الحوسبة',
      universityPlatform: 'منصة شاملة لجميع كليات الجامعة',
      businessCollege: 'كلية العلوم الإدارية والمالية',
      healthCollege: 'كلية الصحة',
      computing: 'الحوسبة',
      business: 'الأعمال',
      health: 'الصحة',
      searchCourses: 'البحث عن المواد',
      noResourcesAvailable: 'لا تتوفر موارد لهذه المادة حالياً',
      courseNotFound: 'المادة غير موجودة في النظام'
    },
    en: {
      siteTitle: 'SEU Computing College – Course & Subject Search',
      searchPlaceholder: 'Search for a course or subject code…',
      myAccount: 'My Account',
      login: 'Login',
      register: 'Register',
      backToMain: 'Back to Main',
      mainPage: 'Home',
      home: 'Home',
      allColleges: 'All Colleges',
      computerScience: 'Computer Science',
      informationTechnology: 'Information Technology',
      dataScience: 'Data Science',
      addCourse: 'Add Course',
      courses: 'Courses',
      resources: 'Resources',
      description: 'Description',
      major: 'Major',
      level: 'Level',
      credits: 'Credits',
      seeAll: 'See All',
      localCourses: 'Local Courses',
      firebaseCourses: 'Database Courses',
      totalContributions: 'Total Contributions',
      academicMaterials: 'Academic Materials System',
      collegeComputing: 'Computing College',
      universityPlatform: 'Comprehensive platform for all university colleges',
      businessCollege: 'Business & Finance College',
      healthCollege: 'Health College',
      computing: 'Computing',
      business: 'Business',
      health: 'Health',
      searchCourses: 'Search Courses',
      noResourcesAvailable: 'No resources available for this course currently',
      courseNotFound: 'Course not found in the system'
    }
  };

  /**
   * Apply the selected language to the page by updating the direction and
   * replacing text in target elements.
   *
   * @param {string} lang - Language code ('ar' or 'en').
   */
  function applyLanguage(lang) {
    const dict = translations[lang] || translations.ar;
    
    // Set document direction for proper layout
    document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', lang);
    
    // Update page title
    const titleEl = document.querySelector('title');
    if (titleEl) titleEl.textContent = dict.siteTitle;
    
    // Update search input placeholder
    const searchInput = document.getElementById('searchInput');
    if (searchInput) searchInput.setAttribute('placeholder', dict.searchPlaceholder);
    
    // Update navigation links
    const accountLink = document.getElementById('nav-account');
    if (accountLink) accountLink.textContent = dict.myAccount;
    
    // Update auth tabs with data-i18n attributes
    const loginTab = document.querySelector('[data-i18n="login"]');
    if (loginTab) loginTab.textContent = dict.login;
    const registerTab = document.querySelector('[data-i18n="register"]');
    if (registerTab) registerTab.textContent = dict.register;
    
    // Update navigation menu items
    const navItems = document.querySelectorAll('.nav-item[data-i18n]');
    navItems.forEach(item => {
      const key = item.getAttribute('data-i18n');
      if (dict[key]) {
        item.textContent = dict[key];
      }
    });
    
    // Update buttons and common elements
    const elementsToTranslate = document.querySelectorAll('[data-i18n]');
    elementsToTranslate.forEach(element => {
      const key = element.getAttribute('data-i18n');
      if (dict[key]) {
        if (element.tagName.toLowerCase() === 'input' && element.type === 'text') {
          element.setAttribute('placeholder', dict[key]);
        } else {
          element.textContent = dict[key];
        }
      }
    });
    
    // Update body class for styling purposes
    document.body.className = document.body.className.replace(/\b(lang-ar|lang-en)\b/g, '');
    document.body.classList.add(`lang-${lang}`);
    
    console.log(`Language switched to: ${lang}`);
  }

  /**
   * Toggle the current language between Arabic and English. Saves the
   * preference to localStorage and re-applies the language.
   */
  function toggleLanguage() {
    const current = localStorage.getItem('siteLanguage') || 'ar';
    const next = current === 'ar' ? 'en' : 'ar';
    localStorage.setItem('siteLanguage', next);
    applyLanguage(next);
  }

  // Initialize language on page load
  document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('siteLanguage') || 'ar';
    applyLanguage(savedLang);
    const btn = document.getElementById('language-toggle');
    if (btn) {
      btn.addEventListener('click', toggleLanguage);
    }
  });
})();
