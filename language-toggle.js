/*
 * Language Toggle Script (Enhanced)
 *
 * Site-wide Arabic/English translation with automatic element scanning.
 * - Defaults to English (LTR) unless user previously chose Arabic
 * - Applies dir/language attributes and body class
 * - Translates textContent, placeholders, titles, aria-labels via data-i18n
 *   and best-effort heuristics for elements without data-i18n
 * - Works on all pages that include this script
 */

(() => {
  // Inject dir-aware CSS to ensure layout direction matches selected language
  try {
    const style = document.createElement('style');
    style.setAttribute('data-i18n-dir-style', '');
    style.textContent = `
      html[dir="ltr"] body { direction: ltr !important; text-align: left !important; }
      html[dir="ltr"] input, html[dir="ltr"] textarea { direction: ltr !important; text-align: left !important; }
      html[dir="rtl"] body { direction: rtl !important; text-align: right !important; }
      html[dir="rtl"] input, html[dir="rtl"] textarea { direction: rtl !important; text-align: right !important; }
    `;
    document.head.appendChild(style);
  } catch(_) {}
  const translations = {
    ar: {
      siteTitle: 'كلية الحوسبة | الجامعة السعودية الإلكترونية - بحث المواد والمقررات الدراسية',
      searchPlaceholder: 'ابحث عن مادة أو رقم مقرر...',
      // Common placeholders/labels used across pages (Arabic originals)
      searchCourseCodeExample: 'ابحث عن المقررات بالكود (مثل CS 230)...',
      searchByCodeOrName: 'ابحث عن المقررات بالكود أو الاسم...',
      exampleCodes: 'مثال: CS123, DS456, IT789',
      exampleCodesHealth: 'مثال: PH101, HI240, MED350',
      exampleCodesBusiness: 'مثال: BUS101, ACC240, MKT350',
      exampleCourseName: 'مثال: البرمجة الشيئية',
      exampleCourseNameBusiness: 'مثال: مبادئ الإدارة',
      courseDescriptionLongPlaceholder: 'وصف مختصر عن محتوى المادة وأهدافها ومواضيعها الأساسية...',
      courseDescriptionPlaceholder: 'وصف مختصر عن محتوى المادة وأهدافها',
      courseDescriptionShort: 'وصف مختصر للمادة',
      exampleCourseCodeSimple: 'CS101',
      resourceTitle: 'عنوان المصدر',
      urlPlaceholder: 'https://...',
  backAllColleges: 'العودة لجميع الكليات',
  addNewCourse: 'إضافة مادة جديدة',
  searchResults: 'نتائج البحث:',
  clearSearch: 'مسح البحث',
  darkLightMode: 'الوضع المظلم/الفاتح',
  businessAdmin: 'إدارة الأعمال',
  accounting: 'المحاسبة',
  financialManagement: 'الإدارة المالية',
  eCommerce: 'التجارة الإلكترونية',
  businessTagline: 'استكشف مواد تخصصات إدارة الأعمال، المحاسبة، الإدارة المالية، والتجارة الإلكترونية',
  itDescription: 'تركز على إدارة واستخدام تكنولوجيا المعلومات في الشركات والمؤسسات. تشمل مجالات مثل الشبكات، إدارة الأنظمة، أمن المعلومات، ودعم تكنولوجيا المعلومات.',
      enterEmail: 'أدخل بريدك الإلكتروني',
      enterPassword: 'أدخل كلمة المرور',
      enterPasswordMin: 'أدخل كلمة المرور (6 أحرف على الأقل)',
      enterName: 'أدخل اسمك',
      enterFullName: 'أدخل اسمك الكامل',
      enterFullName3: 'أدخل اسمك الثلاثي كاملاً',
  courseNamePlaceholder: 'اسم المادة',
  emailLabel: 'البريد الإلكتروني',
  passwordLabel: 'كلمة المرور',
  usernameLabel: 'اسم المستخدم',
      enterEmailOrUsername: 'أدخل بريدك الإلكتروني أو اسم المستخدم',
      chooseUniqueUsername: 'اختر اسم مستخدم مميز وفريد',
      chooseStrongPassword: 'اختر كلمة مرور قوية وآمنة',
      retypePassword: 'أعد كتابة كلمة المرور',
      mobileToggleToEnglish: 'التبديل للإنجليزية',
      toggleShortAr: 'ع',
      toggleShortEn: 'EN',
      myAccount: 'حسابي',
      login: 'تسجيل الدخول',
      register: 'إنشاء حساب',
      backToMain: 'العودة للرئيسية',
      mainPage: 'الرئيسية',
      home: 'الرئيسية',
      allColleges: 'جميع الكليات',
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
  blogs: 'المدونة',
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
      courseNotFound: 'المادة غير موجودة في النظام',
      languageText: 'العربية',
      mobileLanguageText: 'العربية / English',
      shareCourse: 'مشاركة المادة',
      courseDetails: 'تفاصيل المادة',
      courseMaterials: 'مواد المقرر',
      downloadCurriculum: 'تحميل المنهج',
      educationalResources: 'الموارد التعليمية',
      additionalMaterials: 'مواد إضافية',
      recommendedBook: 'كتاب مقرر موصى به',
      interactiveLearning: 'منصة التعلم التفاعلية',
      shareWith: 'مشاركة المادة',
      qrCodeAccess: 'كود QR للوصول السريع',
      scanCode: 'امسح الكود للوصول المباشر للمادة',
      directLink: 'الرابط المباشر للمادة',
      websiteLink: 'رابط الموقع مع تحديد المادة',
      copy: 'نسخ',
      copied: 'تم النسخ!',
      shareSocial: 'مشاركة عبر وسائل التواصل',
      whatsapp: 'واتساب',
      telegram: 'تيليجرام',
      twitter: 'تويتر',
      facebook: 'فيسبوك',
      watchOnYouTube: 'مشاهدة على يوتيوب',
      openChat: 'فتح المحادثة',
      enterCourse: 'دخول المقرر',
      openFiles: 'فتح الملفات',
      download: 'تحميل',
      educationalContent: 'محتوى تعليمي',
      recordedLectures: 'محاضرات مسجلة',
      educationalFiles: 'ملفات تعليمية',
      compressedFiles: 'ملفات مضغوطة',
      educationalResource: 'مورد تعليمي',
      blackBoard: 'بلاك بورد',
      googleDrive: 'جوجل درايف',
      mega: 'ميجا',
      viewAllCourses: 'عرض جميع المواد',
      exploreCourse: 'استكشاف المادة',
      bachelor: 'بكالوريوس',
      bestCollege: 'أفضل كلية',
  bestCollegeDesc: 'كلية الحوسبة توفر مزيجًا من التعليم الأكاديمي المتخصص والخبرة العملية التي تؤهل الطلاب لمواكبة التطورات السريعة في صناعة التكنولوجيا.',
  whyUs: 'لماذا تختارنا',
  learnMore: 'تعرف أكثر',
      dsDescription: 'مجال يركز على تحليل البيانات واستخلاص الأنماط والمعلومات المفيدة منها باستخدام تقنيات مثل التعلم الآلي والإحصاء، بهدف دعم اتخاذ القرارات وتحقيق رؤى استراتيجية.'
    },
    en: {
      siteTitle: 'SEU Computing College – Course & Subject Search',
      searchPlaceholder: 'Search for a course or subject code…',
      // Common placeholders/labels used across pages (English equivalents)
      searchCourseCodeExample: 'Search courses by code (e.g., CS 230)…',
      searchByCodeOrName: 'Search courses by code or name…',
      exampleCodes: 'Example: CS123, DS456, IT789',
      exampleCodesHealth: 'Example: PH101, HI240, MED350',
      exampleCodesBusiness: 'Example: BUS101, ACC240, MKT350',
      exampleCourseName: 'Example: Object-Oriented Programming',
      exampleCourseNameBusiness: 'Example: Principles of Management',
      courseDescriptionLongPlaceholder: 'A short description of the course content, objectives, and main topics…',
      courseDescriptionPlaceholder: 'Brief description of course content and objectives',
      courseDescriptionShort: 'Short course description',
      exampleCourseCodeSimple: 'CS101',
      resourceTitle: 'Resource Title',
  urlPlaceholder: 'https://...',
  backAllColleges: 'Back to All Colleges',
  addNewCourse: 'Add New Course',
  searchResults: 'Search Results:',
  clearSearch: 'Clear Search',
  darkLightMode: 'Dark/Light Mode',
  businessAdmin: 'Business Administration',
  accounting: 'Accounting',
  financialManagement: 'Financial Management',
  eCommerce: 'E-Commerce',
  businessTagline: 'Explore courses in Business Administration, Accounting, Financial Management, and E-Commerce',
  itDescription: 'Focuses on managing and using information technology in companies and organizations. Includes areas such as networking, systems administration, information security, and IT support.',
      enterEmail: 'Enter your email',
      enterPassword: 'Enter your password',
      enterPasswordMin: 'Enter password (at least 6 characters)',
      enterName: 'Enter your name',
      enterFullName: 'Enter your full name',
      enterFullName3: 'Enter your full name (3 parts)',
  courseNamePlaceholder: 'Course name',
  emailLabel: 'Email',
  passwordLabel: 'Password',
  usernameLabel: 'Username',
      enterEmailOrUsername: 'Enter your email or username',
      chooseUniqueUsername: 'Choose a unique username',
      chooseStrongPassword: 'Choose a strong and secure password',
      retypePassword: 'Re-type your password',
      mobileToggleToEnglish: 'Switch to English',
      toggleShortAr: 'AR',
      toggleShortEn: 'EN',
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
  blogs: 'Blogs',
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
      courseNotFound: 'Course not found in the system',
      languageText: 'English',
      mobileLanguageText: 'English / العربية',
      shareCourse: 'Share Course',
      courseDetails: 'Course Details',
      courseMaterials: 'Course Materials',
      downloadCurriculum: 'Download Curriculum',
      educationalResources: 'Educational Resources',
      additionalMaterials: 'Additional Materials',
      recommendedBook: 'Recommended Course Book',
      interactiveLearning: 'Interactive Learning Platform',
      shareWith: 'Share Course',
      qrCodeAccess: 'QR Code for Quick Access',
      scanCode: 'Scan code for direct access to course',
      directLink: 'Direct Course Link',
      websiteLink: 'Website Link with Course Selection',
      copy: 'Copy',
      copied: 'Copied!',
      shareSocial: 'Share via Social Media',
      whatsapp: 'WhatsApp',
      telegram: 'Telegram',
      twitter: 'Twitter',
      facebook: 'Facebook',
      watchOnYouTube: 'Watch on YouTube',
      openChat: 'Open Chat',
      enterCourse: 'Enter Course',
      openFiles: 'Open Files',
      download: 'Download',
      educationalContent: 'Educational Content',
      recordedLectures: 'Recorded Lectures',
      educationalFiles: 'Educational Files',
      compressedFiles: 'Compressed Files',
      educationalResource: 'Educational Resource',
      blackBoard: 'BlackBoard',
      googleDrive: 'Google Drive',
      mega: 'Mega',
      viewAllCourses: 'View All Courses',
      exploreCourse: 'Explore Course',
      bachelor: 'Bachelor',
      bestCollege: 'Best College',
  bestCollegeDesc: 'The Computing College offers a blend of specialized academic education and practical experience that prepares students to keep pace with rapid developments in the tech industry.',
  whyUs: 'Why choose us',
  learnMore: 'Learn more',
      dsDescription: 'A field focused on analyzing data and extracting useful patterns and insights using techniques like machine learning and statistics, aiming to support decision-making and achieve strategic insights.'
    }
  };

  // Build reverse index for best-effort auto-translation
  const reverseIndex = {
    ar: {},
    en: {}
  };
  for (const [lang, dict] of Object.entries(translations)) {
    for (const [key, val] of Object.entries(dict)) {
      reverseIndex[lang][val] = key;
    }
  }

  function setDirAndLang(lang) {
    document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', lang);
    document.body.className = document.body.className.replace(/\b(lang-ar|lang-en)\b/g, '');
    document.body.classList.add(`lang-${lang}`);
  }

  // Helper: apply replacements only to text nodes (preserve icons/markup)
  function replaceTextNodes(root, replacer) {
    let changed = false;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    for (const tn of nodes) {
      const before = tn.nodeValue;
      const after = replacer(before);
      if (after !== before) {
        tn.nodeValue = after;
        changed = true;
      }
    }
    return changed;
  }

  function mapCommonTokens(str, targetLang) {
    let out = str;
    if (targetLang === 'en') {
      out = out
        .replace(/\bالمستوى\s*(\d+)\b/g, (m, n) => `Level ${n}`)
        .replace(/(\d+)\s*(?:ساعة|ساعات)\b/g, (m, n) => `${n} ${Number(n) === 1 ? 'hour' : 'hours'}`)
        .replace(/\bمبتدئ\b/g, 'Beginner')
        .replace(/\bمتوسط\b/g, 'Intermediate')
        .replace(/\bمتقدم\b/g, 'Advanced')
        .replace(/\b(استكشاف|اكتشف|اكتشاف|استكشافات)\s*المادة\b/g, 'Explore Course')
        .replace(/\bعرض\s*جميع\s*المواد\b/g, 'View All Courses')
        .replace(/\bبكالوريوس\b/g, 'Bachelor');
    } else {
      out = out
        .replace(/\bLevel\s*(\d+)\b/g, (m, n) => `المستوى ${n}`)
        .replace(/(\d+)\s*hours?\b/gi, (m, n) => `${n} ساعات`)
        .replace(/\bBeginner\b/g, 'مبتدئ')
        .replace(/\bIntermediate\b/g, 'متوسط')
        .replace(/\bAdvanced\b/g, 'متقدم')
        .replace(/\bView\s*All\s*Courses\b/g, 'عرض جميع المواد')
        .replace(/\bExplore\s*Course\b/g, 'استكشاف المادة')
        .replace(/\bBachelor\b/g, 'بكالوريوس');
    }
    return out;
  }

  function translateNodeText(node, dict) {
    // data-i18n handling
    const key = node.getAttribute && node.getAttribute('data-i18n');
    if (key && dict[key]) {
      if (node.tagName && node.tagName.toLowerCase() === 'input' && (node.type === 'text' || node.type === 'search')) {
        node.setAttribute('placeholder', dict[key]);
      } else {
        // Replace only text nodes to preserve child elements/icons
        replaceTextNodes(node, (txt) => {
          const t = txt.trim();
          if (t && (reverseIndex.ar[t] === key || reverseIndex.en[t] === key)) return dict[key];
          // If text node equals the original dictionary value, replace directly
          if (t === translations.ar[key] || t === translations.en[key]) return dict[key];
          return txt;
        });
      }
      return true;
    }

    // Best-effort: try matching whole text to reverse index of the opposite language
    const text = (node.textContent || '').trim();
    if (!text) return false;

    // Determine if text is one of known entries in either language
    const arKey = reverseIndex.ar[text];
    const enKey = reverseIndex.en[text];

    const replacementKey = arKey || enKey;
    if (replacementKey && dict[replacementKey]) {
      // Replace only text nodes equal to the matched phrase
      const replaced = replaceTextNodes(node, (txt) => {
        const t = txt.trim();
        return (t === text) ? dict[replacementKey] : txt;
      });
      if (replaced) return true;
    }

    // Phrase-level best-effort replacements for common UI tokens on text nodes
    const targetLang = document.documentElement.getAttribute('lang') === 'en' ? 'en' : 'ar';
    const didReplace = replaceTextNodes(node, (txt) => mapCommonTokens(txt, targetLang));
    if (didReplace) return true;
    return false;
  }

  function translateAttributes(el, dict) {
    const attrMap = [
      { attr: 'placeholder', dataKey: 'i18nPlaceholder' },
      { attr: 'title', dataKey: 'i18nTitle' },
      { attr: 'aria-label', dataKey: 'i18nAriaLabel' }
    ];

    for (const { attr, dataKey } of attrMap) {
      // Explicit data-i18n-<attr>
      const explicitKey = el.dataset && el.dataset[dataKey];
      if (explicitKey && dict[explicitKey]) {
        el.setAttribute(attr, dict[explicitKey]);
        continue;
      }

      // Best-effort via reverse index
      const val = el.getAttribute && el.getAttribute(attr);
      if (!val) continue;
      const key = reverseIndex.ar[val] || reverseIndex.en[val];
      if (key && dict[key]) {
        el.setAttribute(attr, dict[key]);
        continue;
      }
      // Fallback: apply phrase-level replacements on attributes too
      let replaced = val;
      if (document.documentElement.getAttribute('lang') === 'en') {
        replaced = replaced
          .replace(/\bالمستوى\s*(\d+)\b/g, (m, n) => `Level ${n}`)
          .replace(/(\d+)\s*(?:ساعة|ساعات)\b/g, (m, n) => `${n} ${Number(n) === 1 ? 'hour' : 'hours'}`)
          .replace(/\bمبتدئ\b/g, 'Beginner')
          .replace(/\bمتوسط\b/g, 'Intermediate')
          .replace(/\bمتقدم\b/g, 'Advanced')
          .replace(/\b(استكشاف|اكتشف|اكتشاف|استكشافات)\s*المادة\b/g, 'Explore Course')
          .replace(/\bعرض\s*جميع\s*المواد\b/g, 'View All Courses');
      } else {
        replaced = replaced
          .replace(/\bLevel\s*(\d+)\b/g, (m, n) => `المستوى ${n}`)
          .replace(/(\d+)\s*hours?\b/gi, (m, n) => `${n} ساعات`)
          .replace(/\bBeginner\b/g, 'مبتدئ')
          .replace(/\bIntermediate\b/g, 'متوسط')
          .replace(/\bAdvanced\b/g, 'متقدم')
          .replace(/\bView\s*All\s*Courses\b/g, 'عرض جميع المواد')
          .replace(/\bExplore\s*Course\b/g, 'استكشاف المادة');
      }
      if (replaced !== val) el.setAttribute(attr, replaced);
    }
  }

  function applyLanguage(lang) {
    const dict = translations[lang] || translations.en;
    setDirAndLang(lang);

    // Page title: preserve per-page titles; translate when possible
    const titleEl = document.querySelector('title');
    if (titleEl) {
      const titleKey = titleEl.getAttribute('data-i18n');
      if (titleKey && dict[titleKey]) {
        titleEl.textContent = dict[titleKey];
      } else {
        const cur = (titleEl.textContent || '').trim();
        const key = reverseIndex.ar[cur] || reverseIndex.en[cur];
        if (key && dict[key]) titleEl.textContent = dict[key];
      }
    }

    // Translate all elements with data-i18n first (authoritative)
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (!key) return;
      if (el.tagName.toLowerCase() === 'input' && (el.type === 'text' || el.type === 'search')) {
        el.setAttribute('placeholder', dict[key] || el.getAttribute('placeholder'));
      } else {
        el.textContent = dict[key] || el.textContent;
      }
      translateAttributes(el, dict);
    });

    // Best-effort translate common controls without data-i18n
    const candidates = document.querySelectorAll('button, a, span, h1, h2, h3, h4, h5, h6, label, p, li');
    candidates.forEach(node => {
      translateNodeText(node, dict);
      translateAttributes(node, dict);
    });

    // Inputs placeholders without data-i18n
    document.querySelectorAll('input[placeholder], textarea[placeholder]').forEach(el => translateAttributes(el, dict));

    // Update visible language indicator if present
    const languageText = document.getElementById('language-text');
    if (languageText && dict.languageText) languageText.textContent = dict.languageText;
    const mobileLanguageText = document.getElementById('mobile-language-text');
    if (mobileLanguageText && dict.mobileLanguageText) mobileLanguageText.textContent = dict.mobileLanguageText;

    // Update toggle buttons if they carry data-en / data-ar labels
    const btn = document.getElementById('language-toggle');
    if (btn) {
      const label = lang === 'ar' ? (btn.getAttribute('data-ar') || dict.toggleShortAr) : (btn.getAttribute('data-en') || dict.toggleShortEn);
      const span = btn.querySelector('span');
      if (span && label) span.textContent = label;
      else if (label) btn.textContent = label; // fallback if no span exists
      translateAttributes(btn, dict);
    }
    const mobileBtn = document.getElementById('mobile-language-toggle');
    if (mobileBtn) {
      const label = lang === 'ar' ? (mobileBtn.getAttribute('data-ar') || dict.mobileToggleToEnglish) : (mobileBtn.getAttribute('data-en') || dict.mobileToggleToEnglish);
      const span = mobileBtn.querySelector('span');
      if (span && label) span.textContent = label;
      else if (label) mobileBtn.textContent = label; // fallback
      translateAttributes(mobileBtn, dict);
    }

    // Custom known text spots
    const headerTitle = document.querySelector('.gradient-text');
    if (headerTitle) {
      const key = reverseIndex.ar[headerTitle.textContent.trim()] || reverseIndex.en[headerTitle.textContent.trim()];
      if (key && dict[key]) headerTitle.textContent = dict[key];
    }

    console.log(`Language switched to: ${lang}`);
  }

  function toggleLanguage() {
    const current = localStorage.getItem('siteLanguage') || 'en';
    const next = current === 'ar' ? 'en' : 'ar';
    localStorage.setItem('siteLanguage', next);
    applyLanguage(next);
  }

  document.addEventListener('DOMContentLoaded', () => {
    // Default to Arabic site-wide if nothing saved (site primary language)
    const savedLang = localStorage.getItem('siteLanguage') || 'ar';
    applyLanguage(savedLang);

    const btn = document.getElementById('language-toggle');
    if (btn) btn.addEventListener('click', toggleLanguage);

    const mobileBtn = document.getElementById('mobile-language-toggle');
    if (mobileBtn) mobileBtn.addEventListener('click', toggleLanguage);

    // Observe dynamic DOM changes to re-translate newly added nodes
    try {
      let pending = null;
      const retranslate = () => {
        pending = null;
        const lang = localStorage.getItem('siteLanguage') || 'ar';
        applyLanguage(lang);
      };
      const observer = new MutationObserver(() => {
        if (pending) return; // debounce to next tick
        pending = setTimeout(retranslate, 50);
      });
      observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['placeholder', 'title', 'aria-label'] });
    } catch (_) {}
  });
})();
