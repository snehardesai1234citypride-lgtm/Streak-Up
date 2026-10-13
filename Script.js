/* =========================================================
   STREAKUP
   Productivity & Habit Tracking App
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  /* =======================================================
     1. STORAGE & DEFAULT DATA
     ======================================================= */

  const STORAGE_KEY = "streakupData";

  const DEFAULT_DATA = {
    profile: {
      name: "Streaker",
      birthday: "",
      photo: ""
    },

    settings: {
      theme: "dark"
    },

    xp: 0,

    streaks: [],

    tasks: [],

    goals: [],

    quote: {
      date: "",
      index: 0
    }
  };


  /* =======================================================
     2. STREAK MILESTONES
     ======================================================= */

  const MILESTONES = [
    {
      days: 7,
      label: "7 Days",
      xp: 50
    },
    {
      days: 21,
      label: "21 Days",
      xp: 100
    },
    {
      days: 30,
      label: "30 Days",
      xp: 150
    },
    {
      days: 60,
      label: "2 Months",
      xp: 250
    },
    {
      days: 90,
      label: "3 Months",
      xp: 350
    },
    {
      days: 180,
      label: "6 Months",
      xp: 500
    },
    {
      days: 365,
      label: "1 Year",
      xp: 1000
    }
  ];


  /* =======================================================
     3. MOTIVATIONAL QUOTES
     ======================================================= */

  const QUOTES = [
    {
      text: "Small progress is still progress.",
      author: "STREAKUP"
    },

    {
      text: "Success is built one day at a time.",
      author: "STREAKUP"
    },

    {
      text: "You do not need to be perfect. You just need to keep going.",
      author: "STREAKUP"
    },

    {
      text: "Discipline turns goals into results.",
      author: "STREAKUP"
    },

    {
      text: "Your future self will thank you for starting today.",
      author: "STREAKUP"
    },

    {
      text: "One good habit can change your entire routine.",
      author: "STREAKUP"
    },

    {
      text: "Keep showing up. That is where the magic happens.",
      author: "STREAKUP"
    },

    {
      text: "A little better every day adds up to something big.",
      author: "STREAKUP"
    },

    {
      text: "Do not stop because progress feels slow.",
      author: "STREAKUP"
    },

    {
      text: "Today's effort becomes tomorrow's confidence.",
      author: "STREAKUP"
    }
  ];


  /* =======================================================
     4. PAGE TITLES
     ======================================================= */

  const PAGE_TITLES = {
    home: "Dashboard",
    streaks: "My Streaks",
    tasks: "My Tasks",
    goals: "My Goals",
    achievements: "Achievements",
    profile: "My Profile",
    settings: "Settings"
  };


  /* =======================================================
     5. HELPERS
     ======================================================= */

  const $ = (selector) =>
    document.querySelector(selector);

  const $$ = (selector) =>
    document.querySelectorAll(selector);

  const getById = (id) =>
    document.getElementById(id);


  /* =======================================================
     6. LOAD DATA
     ======================================================= */

  let data = loadData();


  function clone(object) {
    return JSON.parse(
      JSON.stringify(object)
    );
  }


  function loadData() {
    try {
      const saved =
        localStorage.getItem(STORAGE_KEY);

      if (!saved) {
        return clone(DEFAULT_DATA);
      }

      const parsed = JSON.parse(saved);

      return {
        ...clone(DEFAULT_DATA),

        ...parsed,

        profile: {
          ...DEFAULT_DATA.profile,
          ...(parsed.profile || {})
        },

        settings: {
          ...DEFAULT_DATA.settings,
          ...(parsed.settings || {})
        },

        streaks:
          Array.isArray(parsed.streaks)
            ? parsed.streaks
            : [],

        tasks:
          Array.isArray(parsed.tasks)
            ? parsed.tasks
            : [],

        goals:
          Array.isArray(parsed.goals)
            ? parsed.goals
            : [],

        quote: {
          ...DEFAULT_DATA.quote,
          ...(parsed.quote || {})
        }
      };

    } catch (error) {
      console.error(
        "STREAKUP data could not be loaded:",
        error
      );

      return clone(DEFAULT_DATA);
    }
  }


  function saveData() {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(data)
    );
  }


  /* =======================================================
     7. DATE FUNCTIONS
     ======================================================= */

  function getToday() {
    const date = new Date();

    const year =
      date.getFullYear();

    const month =
      String(date.getMonth() + 1)
        .padStart(2, "0");

    const day =
      String(date.getDate())
        .padStart(2, "0");

    return `${year}-${month}-${day}`;
  }


  function parseDate(dateString) {
    if (!dateString) {
      return new Date();
    }

    const parts =
      dateString.split("-").map(Number);

    return new Date(
      parts[0],
      parts[1] - 1,
      parts[2]
    );
  }


  function dateToString(date) {
    const year =
      date.getFullYear();

    const month =
      String(date.getMonth() + 1)
        .padStart(2, "0");

    const day =
      String(date.getDate())
        .padStart(2, "0");

    return `${year}-${month}-${day}`;
  }


  function addDays(dateString, amount) {
    const date =
      parseDate(dateString);

    date.setDate(
      date.getDate() + amount
    );

    return dateToString(date);
  }


  function formatDate(dateString) {
    if (!dateString) {
      return "";
    }

    return parseDate(dateString)
      .toLocaleDateString(
        undefined,
        {
          day: "numeric",
          month: "short",
          year: "numeric"
        }
      );
  }


  function getHeaderDate() {
    return new Date()
      .toLocaleDateString(
        undefined,
        {
          weekday: "long",
          day: "numeric",
          month: "long"
        }
      );
  }


  /* =======================================================
     8. GENERAL UTILITIES
     ======================================================= */

  function createId(prefix) {
    return (
      prefix +
      "_" +
      Date.now() +
      "_" +
      Math.random()
        .toString(36)
        .substring(2, 9)
    );
  }


  function escapeHTML(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }


  function setText(id, value) {
    const element =
      getById(id);

    if (element) {
      element.textContent = value;
    }
  }


  /* =======================================================
     9. XP & LEVEL SYSTEM
     ======================================================= */

  function getLevel() {
    return Math.floor(
      data.xp / 100
    ) + 1;
  }


  function getCurrentLevelXP() {
    return data.xp % 100;
  }


  function addXP(amount, message) {
    data.xp += amount;

    saveData();

    renderEverything();

    if (message) {
      showToast(
        `+${amount} XP — ${message}`,
        "success"
      );
    }
  }


  /* =======================================================
     10. NAVIGATION
     ======================================================= */

  function navigateTo(pageName) {

    $$(".page").forEach((page) => {
      page.classList.toggle(
        "active",
        page.dataset.page === pageName
      );
    });


    $$(".nav-btn[data-page]")
      .forEach((button) => {
        button.classList.toggle(
          "active",
          button.dataset.page === pageName
        );
      });


    setText(
      "pageTitle",
      PAGE_TITLES[pageName] ||
        "STREAKUP"
    );


    closeMobileSidebar();
  }


  function setupNavigation() {

    $$(".nav-btn[data-page]")
      .forEach((button) => {

        button.addEventListener(
          "click",
          () => {
            navigateTo(
              button.dataset.page
            );
          }
        );

      });


    $$("[data-page-link]")
      .forEach((element) => {

        element.addEventListener(
          "click",
          () => {
            navigateTo(
              element.dataset.pageLink
            );
          }
        );

      });

  }


  /* =======================================================
     11. MOBILE SIDEBAR
     ======================================================= */

  function openMobileSidebar() {

    getById("sidebar")
      ?.classList.add(
        "mobile-open"
      );

    getById("sidebarOverlay")
      ?.classList.add("show");
  }


  function closeMobileSidebar() {

    getById("sidebar")
      ?.classList.remove(
        "mobile-open"
      );

    getById("sidebarOverlay")
      ?.classList.remove(
        "show"
      );
  }


  function setupMobileMenu() {

    getById("mobileMenuBtn")
      ?.addEventListener(
        "click",
        openMobileSidebar
      );


    getById("sidebarOverlay")
      ?.addEventListener(
        "click",
        closeMobileSidebar
      );

  }


  /* =======================================================
     12. THEME
     ======================================================= */

  function applyTheme() {

    const theme =
      data.settings.theme || "dark";

    document.body.classList.toggle(
      "light-theme",
      theme === "light"
    );


    const themeSelect =
      getById("themeSelect");

    if (themeSelect) {
      themeSelect.value = theme;
    }
  }


  function setupTheme() {

    const themeSelect =
      getById("themeSelect");

    themeSelect?.addEventListener(
      "change",
      () => {

        data.settings.theme =
          themeSelect.value;

        saveData();

        applyTheme();

        showToast(
          themeSelect.value === "light"
            ? "Light mode enabled ☀️"
            : "Dark mode enabled 🌙",
          "success"
        );

      }
    );

  }


  /* =======================================================
     13. PROFILE
     ======================================================= */

  function setupProfile() {

    getById("saveProfileBtn")
      ?.addEventListener(
        "click",
        saveProfile
      );


    getById("photoInput")
      ?.addEventListener(
        "change",
        handlePhotoUpload
      );

  }


  function saveProfile() {

    const nameInput =
      getById("nameInput");

    const birthdayInput =
      getById("birthdayInput");


    const name =
      nameInput?.value.trim() ||
      "Streaker";


    data.profile.name = name;

    data.profile.birthday =
      birthdayInput?.value || "";


    saveData();

    renderEverything();

    showToast(
      "Profile saved successfully! ✨",
      "success"
    );
  }


  function handlePhotoUpload(event) {

    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }


    if (!file.type.startsWith("image/")) {

      showToast(
        "Please select an image file.",
        "error"
      );

      return;
    }


    const reader =
      new FileReader();


    reader.onload = () => {

      data.profile.photo =
        reader.result;

      saveData();

      renderEverything();

      showToast(
        "Profile picture updated! 📸",
        "success"
      );

    };


    reader.readAsDataURL(file);
  }


  function updateAvatar(element) {

    if (!element) {
      return;
    }


    const placeholder =
      element.parentElement
        ?.querySelector(
          ".avatar-placeholder"
        );


    if (data.profile.photo) {

      element.src =
        data.profile.photo;

      element.style.display =
        "block";


      if (placeholder) {
        placeholder.style.display =
          "none";
      }

    } else {

      element.removeAttribute("src");

      element.style.display =
        "none";


      if (placeholder) {
        placeholder.style.display =
          "flex";
      }

    }
  }


  /* =======================================================
     14. GREETING
     ======================================================= */

  function getGreeting() {

    const hour =
      new Date().getHours();


    if (hour < 12) {
      return "Good morning";
    }

    if (hour < 17) {
      return "Good afternoon";
    }

    return "Good evening";
  }


  /* =======================================================
     15. BIRTHDAY
     ======================================================= */

  function isBirthdayToday() {

    if (!data.profile.birthday) {
      return false;
    }


    const birthday =
      parseDate(
        data.profile.birthday
      );

    const today =
      new Date();


    return (
      birthday.getMonth() ===
        today.getMonth() &&
      birthday.getDate() ===
        today.getDate()
    );
  }


  function renderBirthday() {

    const element =
      getById("birthdayWish");

    if (!element) {
      return;
    }


    if (isBirthdayToday()) {

      element.style.display =
        "block";


      element.innerHTML = `
        <div class="birthday-inner">

          <span class="birthday-icon">
            🎂
          </span>

          <div>

            <strong>
              Happy Birthday,
              ${escapeHTML(
                data.profile.name
              )}! 🎉
            </strong>

            <p>
              Wishing you an amazing year
              full of progress, goals and
              great streaks!
            </p>

          </div>

        </div>
      `;

    } else {

      element.style.display =
        "none";

    }
  }


  /* =======================================================
     16. DAILY QUOTE
     ======================================================= */

  function getDailyQuoteIndex() {

    const today =
      getToday();


    if (data.quote.date !== today) {

      const number =
        Number(
          today.replaceAll("-", "")
        );


      data.quote.index =
        number % QUOTES.length;

      data.quote.date =
        today;


      saveData();
    }


    return data.quote.index;
  }


  function renderQuote() {

    const text =
      getById("quoteText");

    const author =
      getById("quoteAuthor");


    if (!text || !author) {
      return;
    }


    const quote =
      QUOTES[
        getDailyQuoteIndex()
      ] || QUOTES[0];


    text.textContent =
      `"${quote.text}"`;

    author.textContent =
      `— ${quote.author}`;
  }


  function setupQuoteButton() {

    getById("newQuoteBtn")
      ?.addEventListener(
        "click",
        () => {

          let index;

          do {

            index =
              Math.floor(
                Math.random() *
                  QUOTES.length
              );

          } while (
            QUOTES.length > 1 &&
            index === data.quote.index
          );


          data.quote.index =
            index;

          data.quote.date =
            getToday();


          saveData();

          renderQuote();

          showToast(
            "Fresh motivation unlocked! 💜",
            "success"
          );

        }
      );

  }


  /* =======================================================
     17. STREAK CALCULATIONS
     ======================================================= */

  function getCurrentStreak(streak) {

    if (
      !streak ||
      !Array.isArray(streak.dates) ||
      !streak.dates.length
    ) {
      return 0;
    }


    const dates =
      [...new Set(streak.dates)];


    const today =
      getToday();


    if (!dates.includes(today)) {
      return 0;
    }


    let current = 1;

    let check = today;


    while (true) {

      check =
        addDays(check, -1);


      if (dates.includes(check)) {
        current++;
      } else {
        break;
      }

    }


    return current;
  }


  function getBestStreak(streak) {

    if (
      !streak ||
      !Array.isArray(streak.dates) ||
      !streak.dates.length
    ) {
      return 0;
    }


    const dates =
      [
        ...new Set(streak.dates)
      ].sort();


    let best = 1;

    let current = 1;


    for (
      let i = 1;
      i < dates.length;
      i++
    ) {

      if (
        addDays(
          dates[i - 1],
          1
        ) === dates[i]
      ) {

        current++;

      } else {

        current = 1;

      }


      best =
        Math.max(
          best,
          current
        );
    }


    return best;
  }


  function getNextMilestone(days) {

    return (
      MILESTONES.find(
        (milestone) =>
          days < milestone.days
      ) || null
    );
  }


  function getCompletedMilestones(streak) {

    const best =
      getBestStreak(streak);


    return MILESTONES.filter(
      (milestone) =>
        best >= milestone.days
    );
  }


  /* =======================================================
     18. STREAK MILESTONE REWARDS
     ======================================================= */

  function checkStreakMilestones(streak) {

    if (
      !Array.isArray(
        streak.milestonesClaimed
      )
    ) {

      streak.milestonesClaimed = [];

    }


    const best =
      getBestStreak(streak);


    let rewardGiven = false;


    MILESTONES.forEach(
      (milestone) => {

        if (
          best >= milestone.days &&
          !streak.milestonesClaimed.includes(
            milestone.days
          )
        ) {

          streak.milestonesClaimed.push(
            milestone.days
          );


          data.xp +=
            milestone.xp;


          rewardGiven = true;


          showToast(
            `🔥 ${milestone.label} milestone! +${milestone.xp} XP`,
            "success"
          );

        }

      }
    );


    return rewardGiven;
  }


  /* =======================================================
     19. STREAK MODAL
     ======================================================= */

  function setupStreakModal() {

    getById("addStreakBtn")
      ?.addEventListener(
        "click",
        openStreakModal
      );


    getById("emptyAddStreakBtn")
      ?.addEventListener(
        "click",
        openStreakModal
      );


    getById("streakForm")
      ?.addEventListener(
        "submit",
        handleStreakSubmit
      );

  }


  function openStreakModal() {

    const modal =
      getById("streakModal");

    if (!modal) {
      return;
    }


    modal.classList.add("open");


    getById("streakName")
      ?.focus();
  }


  function handleStreakSubmit(event) {

    event.preventDefault();


    const input =
      getById("streakName");


    const name =
      input?.value.trim();


    if (!name) {

      showToast(
        "Give your streak a name first.",
        "error"
      );

      return;
    }


    const streak = {

      id: createId("streak"),

      name,

      dates: [],

      createdAt: getToday(),

      bestStreak: 0,

      lastCompleted: "",

      milestonesClaimed: []

    };


    data.streaks.push(
      streak
    );


    saveData();

    closeModal(
      "streakModal"
    );


    event.target.reset();

    renderEverything();


    showToast(
      `"${name}" streak created! 🔥`,
      "success"
    );
  }


  /* =======================================================
     20. COMPLETE STREAK
     ======================================================= */

  function completeStreak(streakId) {

    const streak =
      data.streaks.find(
        (item) =>
          item.id === streakId
      );


    if (!streak) {
      return;
    }


    const today =
      getToday();


    if (
      !Array.isArray(
        streak.dates
      )
    ) {

      streak.dates = [];

    }


    /* Prevent duplicate completion */

    if (
      streak.dates.includes(today)
    ) {

      showToast(
        "You've already completed this streak today! 🔥",
        "info"
      );

      return;
    }


    streak.dates.push(today);

    streak.lastCompleted =
      today;


    streak.bestStreak =
      Math.max(
        streak.bestStreak || 0,
        getBestStreak(streak)
      );


    const milestoneRewarded =
      checkStreakMilestones(
        streak
      );


    if (!milestoneRewarded) {

      data.xp += 5;


      showToast(
        "Streak completed! +5 XP 🔥",
        "success"
      );
    }


    saveData();

    renderEverything();
  }


  /* =======================================================
     21. DELETE STREAK
     ======================================================= */

  function deleteStreak(streakId) {

    const streak =
      data.streaks.find(
        (item) =>
          item.id === streakId
      );


    if (!streak) {
      return;
    }


    const confirmed =
      window.confirm(
        `Delete "${streak.name}"? This cannot be undone.`
      );


    if (!confirmed) {
      return;
    }


    data.streaks =
      data.streaks.filter(
        (item) =>
          item.id !== streakId
      );


    saveData();

    renderEverything();


    showToast(
      "Streak deleted.",
      "info"
    );
  }


  /* =======================================================
     22. RENDER STREAKS
     ======================================================= */

  function renderStreaks() {

    const list =
      getById("streakList");

    const empty =
      getById("streakEmptyState");


    if (!list) {
      return;
    }


    if (!data.streaks.length) {

      list.innerHTML = "";

      if (empty) {
        empty.style.display =
          "block";
      }

      return;
    }


    if (empty) {
      empty.style.display =
        "none";
    }


    list.innerHTML =
      data.streaks
        .map((streak) => {

          const current =
            getCurrentStreak(
              streak
            );


          const best =
            getBestStreak(
              streak
            );


          const next =
            getNextMilestone(
              current
            );


          let progress = 100;


          if (next) {

            const index =
              MILESTONES.indexOf(
                next
              );


            const previous =
              MILESTONES[
                index - 1
              ];


            const start =
              previous
                ? previous.days
                : 0;


            progress =
              (
                (current - start) /
                (next.days - start)
              ) * 100;
          }


          progress =
            Math.max(
              0,
              Math.min(
                100,
                progress
              )
            );


          const completed =
            getCompletedMilestones(
              streak
            );


          const completedToday =
            streak.dates?.includes(
              getToday()
            );


          return `
            <article class="streak-card">

              <div class="streak-card-top">

                <div>

                  <div class="streak-icon">
                    🔥
                  </div>

                  <h3>
                    ${escapeHTML(
                      streak.name
                    )}
                  </h3>

                  <p>
                    Started
                    ${formatDate(
                      streak.createdAt
                    )}
                  </p>

                </div>

                <button
                  class="icon-button danger"
                  type="button"
                  data-delete-streak="${streak.id}"
                  title="Delete streak"
                >
                  🗑️
                </button>

              </div>


              <div class="streak-main-number">

                <strong>
                  ${current}
                </strong>

                <span>
                  day${current === 1 ? "" : "s"}
                  current streak
                </span>

              </div>


              <div class="streak-stats-row">

                <div>

                  <span>
                    Best
                  </span>

                  <strong>
                    ${best} days
                  </strong>

                </div>


                <div>

                  <span>
                    Completed
                  </span>

                  <strong>
                    ${streak.dates?.length || 0}
                  </strong>

                </div>

              </div>


              <div class="streak-progress-header">

                <span>
                  ${
                    next
                      ? `Next: ${next.label}`
                      : "All milestones completed! 🏆"
                  }
                </span>

                <strong>
                  ${
                    next
                      ? `${Math.min(
                          current,
                          next.days
                        )}/${next.days}`
                      : "MAX"
                  }
                </strong>

              </div>


              <div class="progress-bar">

                <div
                  class="progress-fill"
                  style="width:${progress}%"
                ></div>

              </div>


              <div class="milestone-chips">

                ${MILESTONES
                  .map(
                    (milestone) => {

                      const unlocked =
                        completed.some(
                          (item) =>
                            item.days ===
                            milestone.days
                        );


                      return `
                        <span
                          class="milestone-chip ${
                            unlocked
                              ? "completed"
                              : ""
                          }"
                        >
                          ${
                            unlocked
                              ? "✓"
                              : "○"
                          }
                          ${milestone.label}
                        </span>
                      `;
                    }
                  )
                  .join("")}

              </div>


              <button
                class="primary-button streak-complete-button"
                type="button"
                data-complete-streak="${streak.id}"
                ${
                  completedToday
                    ? "disabled"
                    : ""
                }
              >
                ${
                  completedToday
                    ? "✓ COMPLETED TODAY"
                    : "🔥 COMPLETE TODAY"
                }
              </button>

            </article>
          `;

        })
        .join("");


    $$("[data-complete-streak]")
      .forEach((button) => {

        button.addEventListener(
          "click",
          () => {

            completeStreak(
              button.dataset
                .completeStreak
            );

          }
        );

      });


    $$("[data-delete-streak]")
      .forEach((button) => {

        button.addEventListener(
          "click",
          () => {

            deleteStreak(
              button.dataset
                .deleteStreak
            );

          }
        );

      });

  }


  /* =======================================================
     23. TASKS
     ======================================================= */

  let currentTaskFilter = "all";


  function setupTasks() {

    getById("addTaskBtn")
      ?.addEventListener(
        "click",
        openTaskModal
      );


    getById("emptyAddTaskBtn")
      ?.addEventListener(
        "click",
        openTaskModal
      );


    getById("taskForm")
      ?.addEventListener(
        "submit",
        handleTaskSubmit
      );


    $$(".filter-btn[data-filter]")
      .forEach((button) => {

        button.addEventListener(
          "click",
          () => {

            currentTaskFilter =
              button.dataset.filter;


            $$(".filter-btn[data-filter]")
              .forEach((item) => {

                item.classList.toggle(
                  "active",
                  item === button
                );

              });


            renderTasks();
          }
        );

      });

  }


  function openTaskModal() {

    const modal =
      getById("taskModal");

    if (!modal) {
      return;
    }


    modal.classList.add("open");

    getById("taskTitle")
      ?.focus();
  }


  function handleTaskSubmit(event) {

    event.preventDefault();


    const title =
      getById("taskTitle")
        ?.value.trim();


    const priority =
      getById("taskPriority")
        ?.value ||
      "medium";


    const dueDate =
      getById("taskDueDate")
        ?.value ||
      "";


    if (!title) {

      showToast(
        "Enter a task title.",
        "error"
      );

      return;
    }


    data.tasks.push({

      id: createId("task"),

      title,

      priority,

      dueDate,

      completed: false,

      createdAt: getToday()

    });


    saveData();

    closeModal(
      "taskModal"
    );


    event.target.reset();

    renderEverything();


    showToast(
      "Task added! ✅",
      "success"
    );
  }


  function toggleTask(taskId) {

    const task =
      data.tasks.find(
        (item) =>
          item.id === taskId
      );


    if (!task) {
      return;
    }


    const wasCompleted =
      task.completed;


    task.completed =
      !task.completed;


    if (
      !wasCompleted &&
      task.completed
    ) {

      data.xp += 10;


      showToast(
        "Task completed! +10 XP 🎯",
        "success"
      );
    }


    saveData();

    renderEverything();
  }


  function deleteTask(taskId) {

    data.tasks =
      data.tasks.filter(
        (task) =>
          task.id !== taskId
      );


    saveData();

    renderEverything();


    showToast(
      "Task deleted.",
      "info"
    );
  }


  function getFilteredTasks() {

    if (
      currentTaskFilter ===
      "pending"
    ) {

      return data.tasks.filter(
        (task) =>
          !task.completed
      );
    }


    if (
      currentTaskFilter ===
      "completed"
    ) {

      return data.tasks.filter(
        (task) =>
          task.completed
      );
    }


    return data.tasks;
  }


  function renderTasks() {

    const list =
      getById("taskList");

    const empty =
      getById("taskEmptyState");


    if (!list) {
      return;
    }


    const tasks =
      getFilteredTasks();


    if (!tasks.length) {

      list.innerHTML = "";

      if (empty) {
        empty.style.display =
          "block";
      }

    } else {

      if (empty) {
        empty.style.display =
          "none";
      }


      list.innerHTML =
        tasks
          .map((task) => {

            const priority =
              task.priority ||
              "medium";


            const priorityLabel =
              priority
                .charAt(0)
                .toUpperCase() +
              priority.slice(1);


            return `
              <article
                class="task-item ${
                  task.completed
                    ? "completed"
                    : ""
                }"
              >

                <button
                  class="task-check"
                  type="button"
                  data-toggle-task="${task.id}"
                  aria-label="Complete task"
                >
                  ${
                    task.completed
                      ? "✓"
                      : ""
                  }
                </button>


                <div class="task-content">

                  <h3>
                    ${escapeHTML(
                      task.title
                    )}
                  </h3>


                  <div class="task-meta">

                    <span class="priority-${priority}">
                      ${priorityLabel}
                    </span>

                    ${
                      task.dueDate
                        ? `
                          <span>
                            📅
                            ${formatDate(
                              task.dueDate
                            )}
                          </span>
                        `
                        : ""
                    }

                  </div>

                </div>


                <button
                  class="icon-button danger"
                  type="button"
                  data-delete-task="${task.id}"
                  title="Delete task"
                >
                  🗑️
                </button>

              </article>
            `;

          })
          .join("");
    }


    const completed =
      data.tasks.filter(
        (task) =>
          task.completed
      ).length;


    const total =
      data.tasks.length;


    const percent =
      total === 0
        ? 0
        : Math.round(
            (completed / total) * 100
          );


    setText(
      "taskProgressText",
      `${completed}/${total} completed`
    );


    setText(
      "taskProgressPercent",
      `${percent}%`
    );


    const progress =
      getById("taskProgress");


    if (progress) {
      progress.style.width =
        `${percent}%`;
    }


    $$("[data-toggle-task]")
      .forEach((button) => {

        button.addEventListener(
          "click",
          () => {

            toggleTask(
              button.dataset
                .toggleTask
            );

          }
        );

      });


    $$("[data-delete-task]")
      .forEach((button) => {

        button.addEventListener(
          "click",
          () => {

            deleteTask(
              button.dataset
                .deleteTask
            );

          }
        );

      });

  }


  /* =======================================================
     24. GOALS
     ======================================================= */

  function setupGoals() {

    getById("addGoalBtn")
      ?.addEventListener(
        "click",
        openGoalModal
      );


    getById("emptyAddGoalBtn")
      ?.addEventListener(
        "click",
        openGoalModal
      );


    getById("goalForm")
      ?.addEventListener(
        "submit",
        handleGoalSubmit
      );

  }


  function openGoalModal() {

    const modal =
      getById("goalModal");

    if (!modal) {
      return;
    }


    modal.classList.add("open");

    getById("goalTitle")
      ?.focus();
  }


  function handleGoalSubmit(event) {

    event.preventDefault();


    const title =
      getById("goalTitle")
        ?.value.trim();


    const target =
      Number(
        getById("goalTarget")
          ?.value
      );


    const unit =
      getById("goalUnit")
        ?.value.trim() ||
      "units";


    const deadline =
      getById("goalDeadline")
        ?.value ||
      "";


    if (!title) {

      showToast(
        "Enter a goal title.",
        "error"
      );

      return;
    }


    if (
      !target ||
      target <= 0
    ) {

      showToast(
        "Enter a target greater than 0.",
        "error"
      );

      return;
    }


    data.goals.push({

      id: createId("goal"),

      title,

      target,

      unit,

      deadline,

      value: 0,

      createdAt: getToday(),

      rewarded: false

    });


    saveData();

    closeModal(
      "goalModal"
    );


    event.target.reset();

    renderEverything();


    showToast(
      "Goal created! 🎯",
      "success"
    );
  }


  function changeGoalValue(
    goalId,
    amount
  ) {

    const goal =
      data.goals.find(
        (item) =>
          item.id === goalId
      );


    if (!goal) {
      return;
    }


    const oldValue =
      Number(goal.value) ||
      0;


    const target =
      Number(goal.target) ||
      1;


    goal.value =
      Math.max(
        0,
        Math.min(
          target,
          oldValue + amount
        )
      );


    if (
      goal.value >= target &&
      !goal.rewarded
    ) {

      goal.rewarded = true;

      data.xp += 100;


      showToast(
        "Goal completed! +100 XP 🏆",
        "success"
      );
    }


    saveData();

    renderEverything();
  }


  function deleteGoal(goalId) {

    const goal =
      data.goals.find(
        (item) =>
          item.id === goalId
      );


    if (!goal) {
      return;
    }


    const confirmed =
      window.confirm(
        `Delete "${goal.title}"?`
      );


    if (!confirmed) {
      return;
    }


    data.goals =
      data.goals.filter(
        (item) =>
          item.id !== goalId
      );


    saveData();

    renderEverything();


    showToast(
      "Goal deleted.",
      "info"
    );
  }


  function renderGoals() {

    const list =
      getById("goalList");

    const empty =
      getById("goalEmptyState");


    if (!list) {
      return;
    }


    if (!data.goals.length) {

      list.innerHTML = "";

      if (empty) {
        empty.style.display =
          "block";
      }


      updateOverallGoalProgress();

      return;
    }


    if (empty) {
      empty.style.display =
        "none";
    }


    list.innerHTML =
      data.goals
        .map((goal) => {

          const target =
            Number(goal.target) ||
            1;


          const value =
            Number(goal.value) ||
            0;


          const percent =
            Math.max(
              0,
              Math.min(
                100,
                Math.round(
                  (value / target) *
                    100
                )
              )
            );


          return `
            <article class="goal-card">

              <div class="goal-card-top">

                <div>

                  <span class="goal-icon">
                    🎯
                  </span>

                  <h3>
                    ${escapeHTML(
                      goal.title
                    )}
                  </h3>

                </div>


                <button
                  class="icon-button danger"
                  type="button"
                  data-delete-goal="${goal.id}"
                  title="Delete goal"
                >
                  🗑️
                </button>

              </div>


              <div
                class="goal-circle"
                style="--goal-progress:${percent}%"
              >

                <span>
                  ${percent}%
                </span>

              </div>


              <div class="goal-number">
                ${value}
                /
                ${target}
                ${escapeHTML(
                  goal.unit
                )}
              </div>


              <div class="progress-bar">

                <div
                  class="progress-fill"
                  style="width:${percent}%"
                ></div>

              </div>


              ${
                goal.deadline
                  ? `
                    <p class="goal-deadline">
                      📅 Deadline:
                      ${formatDate(
                        goal.deadline
                      )}
                    </p>
                  `
                  : ""
              }


              <div class="goal-actions">

                <button
                  class="secondary-button"
                  type="button"
                  data-goal-change="${goal.id}"
                  data-amount="-1"
                  ${
                    value <= 0
                      ? "disabled"
                      : ""
                  }
                >
                  −
                </button>


                <button
                  class="primary-button"
                  type="button"
                  data-goal-change="${goal.id}"
                  data-amount="1"
                  ${
                    value >= target
                      ? "disabled"
                      : ""
                  }
                >
                  +1
                </button>

              </div>

            </article>
          `;

        })
        .join("");


    $$("[data-goal-change]")
      .forEach((button) => {

        button.addEventListener(
          "click",
          () => {

            changeGoalValue(
              button.dataset
                .goalChange,

              Number(
                button.dataset.amount
              )
            );

          }
        );

      });


    $$("[data-delete-goal]")
      .forEach((button) => {

        button.addEventListener(
          "click",
          () => {

            deleteGoal(
              button.dataset
                .deleteGoal
            );

          }
        );

      });


    updateOverallGoalProgress();
  }


  function updateOverallGoalProgress() {

    if (!data.goals.length) {

      setText(
        "overallGoalPercent",
        "0%"
      );

      setText(
        "overallGoalNumber",
        "0"
      );

      updateGoalOverviewCircle(0);

      return;
    }


    const total =
      data.goals.reduce(
        (sum, goal) => {

          const target =
            Number(goal.target) ||
            1;


          const value =
            Number(goal.value) ||
            0;


          return (
            sum +
            Math.min(
              100,
              (value / target) *
                100
            )
          );

        },
        0
      );


    const average =
      Math.round(
        total /
          data.goals.length
      );


    setText(
      "overallGoalPercent",
      `${average}%`
    );


    setText(
      "overallGoalNumber",
      data.goals.length
    );


    updateGoalOverviewCircle(
      average
    );
  }


  function updateGoalOverviewCircle(
    percent
  ) {

    const circle =
      document.querySelector(
        ".goal-overview-circle"
      );


    if (!circle) {
      return;
    }


    const degrees =
      Math.round(
        percent * 3.6
      );


    circle.style.background = `
      radial-gradient(
        circle at center,
        var(--surface-solid) 55%,
        transparent 56%
      ),
      conic-gradient(
        #8b5cf6 0deg,
        #f97316 ${degrees}deg,
        rgba(255,255,255,0.08) ${degrees}deg
      )
    `;
  }


  /* =======================================================
     25. ACHIEVEMENTS
     ======================================================= */

  function getAchievements() {

    const completedTasks =
      data.tasks.filter(
        (task) =>
          task.completed
      ).length;


    const completedGoals =
      data.goals.filter(
        (goal) =>
          Number(goal.value) >=
          Number(goal.target)
      ).length;


    const bestOverall =
      data.streaks.reduce(
        (best, streak) =>
          Math.max(
            best,
            getBestStreak(streak)
          ),
        0
      );


    return [

      {
        icon: "🌱",

        title: "First Step",

        description:
          "Create your first streak.",

        unlocked:
          data.streaks.length >= 1
      },


      {
        icon: "🔥",

        title: "7 Day Fire",

        description:
          "Reach a 7-day streak.",

        unlocked:
          bestOverall >= 7
      },


      {
        icon: "💪",

        title: "21 Day Builder",

        description:
          "Reach a 21-day streak.",

        unlocked:
          bestOverall >= 21
      },


      {
        icon: "🏆",

        title: "30 Day Legend",

        description:
          "Reach a 30-day streak.",

        unlocked:
          bestOverall >= 30
      },


      {
        icon: "💜",

        title: "XP Starter",

        description:
          "Earn 100 XP.",

        unlocked:
          data.xp >= 100
      },


      {
        icon: "🎯",

        title: "Task Master",

        description:
          "Complete 10 tasks.",

        unlocked:
          completedTasks >= 10
      },


      {
        icon: "🚀",

        title: "Goal Getter",

        description:
          "Complete your first goal.",

        unlocked:
          completedGoals >= 1
      },


      {
        icon: "👑",

        title: "Year Warrior",

        description:
          "Reach a 1-year streak.",

        unlocked:
          bestOverall >= 365
      }

    ];
  }


  function renderAchievements() {

    const list =
      getById(
        "achievementList"
      );


    if (!list) {
      return;
    }


    list.innerHTML =
      getAchievements()
        .map(
          (achievement) => `

            <article
              class="achievement-card ${
                achievement.unlocked
                  ? "unlocked"
                  : "locked"
              }"
            >

              <div class="achievement-icon">

                ${
                  achievement.unlocked
                    ? achievement.icon
                    : "🔒"
                }

              </div>


              <div>

                <h3>
                  ${escapeHTML(
                    achievement.title
                  )}
                </h3>

                <p>
                  ${escapeHTML(
                    achievement.description
                  )}
                </p>

                <span>
                  ${
                    achievement.unlocked
                      ? "Unlocked ✓"
                      : "Locked"
                  }
                </span>

              </div>

            </article>

          `
        )
        .join("");
  }


  /* =======================================================
     26. HOME DASHBOARD
     ======================================================= */

  function renderHome() {

    const name =
      data.profile.name ||
      "Streaker";


    const level =
      getLevel();


    const levelXP =
      getCurrentLevelXP();


    const currentStreaks =
      data.streaks.map(
        (streak) =>
          getCurrentStreak(streak)
      );


    const currentBest =
      currentStreaks.length
        ? Math.max(
            ...currentStreaks
          )
        : 0;


    const overallBest =
      data.streaks.reduce(
        (best, streak) =>
          Math.max(
            best,
            getBestStreak(streak)
          ),
        0
      );


    const completedTasks =
      data.tasks.filter(
        (task) =>
          task.completed
      ).length;


    const completedGoals =
      data.goals.filter(
        (goal) =>
          Number(goal.value) >=
          Number(goal.target)
      ).length;


    setText(
      "greeting",
      getGreeting()
    );


    setText(
      "homeName",
      name
    );


    setText(
      "homeLevel",
      `Level ${level}`
    );


    setText(
      "heroXP",
      `${data.xp} XP`
    );


    setText(
      "homeXP",
      `${levelXP}/100 XP`
    );


    setText(
      "homeStreak",
      currentBest
    );


    setText(
      "homeBestStreak",
      overallBest
    );


    setText(
      "homeTasks",
      completedTasks
    );


    setText(
      "homeGoals",
      completedGoals
    );


    const progress =
      getById(
        "homeXPProgress"
      );


    if (progress) {

      progress.style.width =
        `${levelXP}%`;

    }


    renderFeaturedStreak();

    renderHomeTasks();

    renderHomeGoals();
  }


  /* =======================================================
     27. FEATURED STREAK
     ======================================================= */

  function renderFeaturedStreak() {

    const nameElement =
      getById(
        "homeStreakName"
      );


    const streakElement =
      getById(
        "homeFeaturedStreak"
      );


    const progressElement =
      getById(
        "homeStreakProgress"
      );


    const milestoneElement =
      getById(
        "homeStreakMilestone"
      );


    if (!data.streaks.length) {

      if (nameElement) {
        nameElement.textContent =
          "No streak yet";
      }


      if (streakElement) {
        streakElement.textContent =
          "Create your first streak!";
      }


      if (progressElement) {
        progressElement.style.width =
          "0%";
      }


      if (milestoneElement) {
        milestoneElement.textContent =
          "Start today 🚀";
      }


      return;
    }


    const featured =
      [...data.streaks].sort(
        (a, b) =>
          getCurrentStreak(b) -
          getCurrentStreak(a)
      )[0];


    const current =
      getCurrentStreak(
        featured
      );


    const next =
      getNextMilestone(
        current
      );


    if (nameElement) {
      nameElement.textContent =
        featured.name;
    }


    if (streakElement) {

      streakElement.textContent =
        `${current} day${
          current === 1
            ? ""
            : "s"
        }`;

    }


    let progress = 100;


    if (next) {

      const index =
        MILESTONES.indexOf(
          next
        );


      const previous =
        MILESTONES[
          index - 1
        ];


      const start =
        previous
          ? previous.days
          : 0;


      progress =
        (
          (current - start) /
          (next.days - start)
        ) * 100;

    }


    progress =
      Math.max(
        0,
        Math.min(
          100,
          progress
        )
      );


    if (progressElement) {

      progressElement.style.width =
        `${progress}%`;

    }


    if (milestoneElement) {

      milestoneElement.textContent =
        next
          ? `${next.label} • ${
              next.days - current
            } days to go`
          : "All milestones complete! 🏆";

    }
  }


  /* =======================================================
     28. HOME TASKS
     ======================================================= */

  function renderHomeTasks() {

    const list =
      getById(
        "homeTaskList"
      );


    if (!list) {
      return;
    }


    const pending =
      data.tasks
        .filter(
          (task) =>
            !task.completed
        )
        .slice(0, 4);


    if (!pending.length) {

      list.innerHTML = `

        <div class="mini-empty">

          <span>✨</span>

          <p>
            No pending tasks.
            Nice work!
          </p>

        </div>

      `;

      return;
    }


    list.innerHTML =
      pending
        .map(
          (task) => `

            <div class="mini-task">

              <span class="mini-task-dot"></span>

              <div>

                <strong>
                  ${escapeHTML(
                    task.title
                  )}
                </strong>

                ${
                  task.dueDate
                    ? `
                      <small>
                        Due
                        ${formatDate(
                          task.dueDate
                        )}
                      </small>
                    `
                    : ""
                }

              </div>

            </div>

          `
        )
        .join("");
  }


  /* =======================================================
     29. HOME GOALS
     ======================================================= */

  function renderHomeGoals() {

    const list =
      getById(
        "homeGoalList"
      );


    if (!list) {
      return;
    }


    const goals =
      data.goals.slice(0, 3);


    if (!goals.length) {

      list.innerHTML = `

        <div class="mini-empty">

          <span>🎯</span>

          <p>
            Create a goal
            and start moving!
          </p>

        </div>

      `;

      return;
    }


    list.innerHTML =
      goals
        .map((goal) => {

          const target =
            Number(goal.target) ||
            1;


          const value =
            Number(goal.value) ||
            0;


          const percent =
            Math.min(
              100,
              Math.round(
                (value / target) *
                  100
              )
            );


          return `

            <div class="mini-goal">

              <div class="mini-goal-top">

                <strong>
                  ${escapeHTML(
                    goal.title
                  )}
                </strong>

                <span>
                  ${percent}%
                </span>

              </div>


              <div class="progress-bar">

                <div
                  class="progress-fill"
                  style="width:${percent}%"
                ></div>

              </div>

            </div>

          `;

        })
        .join("");
  }


  /* =======================================================
     30. GLOBAL PROFILE / HEADER
     ======================================================= */

  function renderGlobalProfile() {

    const name =
      data.profile.name ||
      "Streaker";


    const level =
      getLevel();


    setText(
      "headerDate",
      getHeaderDate()
    );


    setText(
      "headerXP",
      `${data.xp} XP`
    );


    setText(
      "headerLevel",
      `Level ${level}`
    );


    setText(
      "sidebarName",
      name
    );


    setText(
      "sidebarLevel",
      `Level ${level}`
    );


    setText(
      "profilePreviewName",
      name
    );


    setText(
      "profilePreviewLevel",
      `Level ${level}`
    );


    setText(
      "profileXPText",
      `${data.xp} XP`
    );


    const profileProgress =
      getById(
        "profileXPProgress"
      );


    if (profileProgress) {

      profileProgress.style.width =
        `${getCurrentLevelXP()}%`;

    }


    updateAvatar(
      getById(
        "headerAvatar"
      )
    );


    updateAvatar(
      getById(
        "sidebarAvatar"
      )
    );


    updateAvatar(
      getById(
        "profileAvatar"
      )
    );


    const nameInput =
      getById(
        "nameInput"
      );


    if (
      nameInput &&
      document.activeElement !==
        nameInput
    ) {

      nameInput.value =
        name;

    }


    const birthdayInput =
      getById(
        "birthdayInput"
      );


    if (
      birthdayInput &&
      document.activeElement !==
        birthdayInput
    ) {

      birthdayInput.value =
        data.profile.birthday ||
        "";

    }
  }


  /* =======================================================
     31. MODALS
     ======================================================= */

  function setupModals() {

    $$("[data-close-modal]")
      .forEach((button) => {

        button.addEventListener(
          "click",
          () => {

            const modal =
              button.closest(
                ".modal"
              );


            if (modal) {

              modal.classList.remove(
                "open"
              );

            }

          }
        );

      });


    $$(".modal")
      .forEach((modal) => {

        modal.addEventListener(
          "click",
          (event) => {

            if (
              event.target ===
              modal
            ) {

              modal.classList.remove(
                "open"
              );

            }

          }
        );

      });


    document.addEventListener(
      "keydown",
      (event) => {

        if (
          event.key !==
          "Escape"
        ) {
          return;
        }


        $$(".modal.open")
          .forEach((modal) => {

            modal.classList.remove(
              "open"
            );

          });

      }
    );

  }


  function closeModal(id) {

    getById(id)
      ?.classList.remove(
        "open"
      );
  }


  /* =======================================================
     32. RESET DATA
     ======================================================= */

  function setupReset() {

    getById("resetDataBtn")
      ?.addEventListener(
        "click",
        () => {

          const confirmed =
            window.confirm(
              "Reset all STREAKUP data? Your streaks, tasks, goals, XP and profile will be deleted."
            );


          if (!confirmed) {
            return;
          }


          localStorage.removeItem(
            STORAGE_KEY
          );


          data =
            clone(
              DEFAULT_DATA
            );


          applyTheme();

          renderEverything();

          navigateTo("home");


          showToast(
            "STREAKUP has been reset.",
            "info"
          );

        }
      );

  }


  /* =======================================================
     33. TOAST NOTIFICATIONS
     ======================================================= */

  function showToast(
    message,
    type = "info"
  ) {

    const container =
      getById(
        "toastContainer"
      );


    if (!container) {
      return;
    }


    const toast =
      document.createElement(
        "div"
      );


    toast.className =
      `toast toast-${type}`;


    toast.innerHTML = `

      <span class="toast-message">
        ${escapeHTML(
          message
        )}
      </span>


      <button
        class="toast-close"
        type="button"
        aria-label="Close notification"
      >
        ×
      </button>

    `;


    container.appendChild(
      toast
    );


    requestAnimationFrame(() => {

      toast.classList.add(
        "show"
      );

    });


    const removeToast =
      () => {

        toast.classList.remove(
          "show"
        );


        setTimeout(() => {

          toast.remove();

        }, 250);

      };


    toast
      .querySelector(
        ".toast-close"
      )
      ?.addEventListener(
        "click",
        removeToast
      );


    setTimeout(
      removeToast,
      3500
    );
  }


  /* =======================================================
     34. RENDER EVERYTHING
     ======================================================= */

  function renderEverything() {

    renderGlobalProfile();

    renderHome();

    renderStreaks();

    renderTasks();

    renderGoals();

    renderAchievements();

    renderQuote();

    renderBirthday();


    setText(
      "streakCount",
      data.streaks.length
    );


    const overallBest =
      data.streaks.reduce(
        (best, streak) =>
          Math.max(
            best,
            getBestStreak(streak)
          ),
        0
      );


    setText(
      "bestStreak",
      overallBest
    );


    const milestoneCount =
      data.streaks.reduce(
        (total, streak) =>
          total +
          getCompletedMilestones(
            streak
          ).length,
        0
      );


    setText(
      "milestoneCount",
      milestoneCount
    );
  }


  /* =======================================================
     35. START STREAKUP
     ======================================================= */

  applyTheme();

  setupNavigation();

  setupMobileMenu();

  setupTheme();

  setupProfile();

  setupQuoteButton();

  setupStreakModal();

  setupTasks();

  setupGoals();

  setupModals();

  setupReset();


  renderEverything();

  navigateTo("home");


  console.log(
    "🔥 STREAKUP is ready!"
  );

});