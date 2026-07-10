const mascot = "./assets/oria-mascot.svg";

const tabs = [
  { key: "quests", label: "Квесты", mark: "Q" },
  { key: "companion", label: "Компаньон", mark: "C" },
  { key: "progress", label: "Прогресс", mark: "P" },
  { key: "overview", label: "Обзор", mark: "O" }
];

const screens = {
  splash: {
    title: "Splash",
    section: "Онбординг",
    tabs: false,
    exits: ["onboarding", "quests"],
    render: () => `
      <section class="screen splash">
        <div>
          <img src="${mascot}" alt="">
          <h2>ORIA</h2>
          <p class="muted">Квесты из целей</p>
          <div class="pulse"><span></span></div>
        </div>
      </section>`
  },
  onboarding: {
    title: "Онбординг",
    section: "Онбординг",
    tabs: false,
    exits: ["auth"],
    render: () => `
      <section class="screen stack">
        <div class="spread">
          <span class="eyebrow">Первый запуск</span>
          <button class="ghost" type="button" data-go="auth">Пропустить</button>
        </div>
        <div class="onboarding-visual" aria-hidden="true">
          <div class="path-art">
            <div class="path-node">1</div>
            <div class="path-node">2</div>
            <div class="path-node">3</div>
          </div>
        </div>
        <div>
          <h2>Любая цель становится квестом</h2>
          <p class="muted">ИИ разбивает путь на арки, шаги и проверки. Компаньон держит контекст и помогает двигаться каждый день.</p>
        </div>
        <div class="dots" aria-hidden="true"><i></i><i class="active"></i><i></i></div>
        <button class="primary" type="button" data-go="auth">Продолжить</button>
      </section>`
  },
  auth: {
    title: "Регистрация / Вход",
    section: "Онбординг",
    tabs: false,
    exits: ["firstQuest", "quests"],
    render: () => `
      <section class="screen stack">
        <div class="app-head">
          <div>
            <h2>Войти в ORIA</h2>
            <p>Сохрани квесты, XP и прогресс.</p>
          </div>
        </div>
        <div class="segmented">
          <button class="active" type="button">Войти</button>
          <button type="button">Регистрация</button>
        </div>
        <input class="field" value="alex@oria.app" aria-label="Email">
        <input class="field" type="password" value="password" aria-label="Пароль">
        <button class="primary" type="button" data-go="quests">Войти</button>
        <button class="secondary" type="button" data-go="firstQuest">Создать аккаунт</button>
        <div class="stack">
          <button class="social" type="button">Войти через Google</button>
          <button class="social" type="button">Войти через Apple</button>
          <button class="social" type="button">Войти через Telegram</button>
        </div>
      </section>`
  },
  firstQuest: {
    title: "Первый квест",
    section: "Онбординг",
    tabs: false,
    exits: ["generating"],
    render: () => goalMarkup("Введи свою первую цель", "Начнем с понятного результата, который хочется получить в ближайшие недели.")
  },
  quests: {
    title: "Квесты",
    section: "Таб Квесты",
    tabs: true,
    exits: ["goal", "questMap", "companion", "progress", "overview"],
    render: () => `
      <section class="screen stack">
        <div class="app-head">
          <div>
            <h2>Квесты</h2>
            <p>2 активных, 4 завершенных</p>
          </div>
          <button class="icon-button" type="button" data-go="goal" aria-label="Новый квест"><span class="mini-icon">+</span></button>
        </div>
        <article class="quest-card featured" role="button" tabindex="0" data-go="questMap">
          <div class="spread">
            <h3>Python с нуля до pet-проекта</h3>
            <strong>42%</strong>
          </div>
          <div class="progress-line"><span style="width: 42%"></span></div>
          <div class="label-row"><span>Арка 2: функции и модули</span><span>12/28 шагов</span></div>
        </article>
        <article class="quest-card" role="button" tabindex="0" data-go="questMap">
          <div class="spread">
            <h3>Английский до B1</h3>
            <strong>18%</strong>
          </div>
          <div class="progress-line"><span style="width: 18%"></span></div>
          <div class="label-row"><span>Арка 1: базовая речь</span><span>5/30 шагов</span></div>
        </article>
        <div class="panel">
          <div class="spread">
            <h3>Завершенные</h3>
            <span class="muted">4</span>
          </div>
        </div>
      </section>`
  },
  goal: {
    title: "Ввод цели",
    section: "Таб Квесты",
    tabs: false,
    exits: ["generating", "subscription"],
    render: () => goalMarkup("Какую цель хочешь достичь?", "Опиши результат. ORIA соберет структуру из арок, шагов и проверок.")
  },
  generating: {
    title: "Генерация",
    section: "Таб Квесты",
    tabs: false,
    exits: ["review", "goal"],
    onEnter: () => {
      window.clearTimeout(window.oriaTimer);
      window.oriaTimer = window.setTimeout(() => navigate("review"), 1400);
    },
    render: () => `
      <section class="screen loading-wrap">
        <div>
          <img src="${mascot}" alt="">
          <h2>Собираю квест</h2>
          <div class="status-list">
            <span>Строю арки</span>
            <span>Расставляю шаги</span>
            <span>Готовлю мини-боссов</span>
          </div>
          <div class="pulse"><span></span></div>
          <button class="ghost" type="button" data-go="goal" style="margin-top: 18px;">Отменить</button>
        </div>
      </section>`
  },
  review: {
    title: "Проверка квеста",
    section: "Таб Квесты",
    tabs: false,
    exits: ["questMap", "generating"],
    render: () => `
      <section class="screen stack">
        <div class="app-head">
          <div>
            <h2>Python с нуля до pet-проекта</h2>
            <p>4 арки, 28 шагов, 4 теста.</p>
          </div>
        </div>
        <article class="arc">
          <h3>Арка 1. Основы синтаксиса</h3>
          <ol><li>Переменные и типы</li><li>Условия</li><li>Циклы</li></ol>
        </article>
        <article class="arc">
          <h3>Арка 2. Функции и модули</h3>
          <ol><li>Функции</li><li>Импорт</li><li>Мини-проект</li></ol>
        </article>
        <textarea class="textarea" aria-label="Комментарий к перегенерации">Больше практики, меньше теории</textarea>
        <button class="primary" type="button" data-go="questMap">Начать квест</button>
        <button class="secondary" type="button" data-go="generating">Перегенерировать</button>
      </section>`
  },
  questMap: {
    title: "Карта квеста",
    section: "Внутри квеста",
    tabs: false,
    exits: ["step", "test", "companion", "quests", "finish"],
    render: () => `
      <section class="screen stack">
        <div class="app-head">
          <div>
            <p class="eyebrow">Python с нуля</p>
            <h2>Карта квеста</h2>
            <p>42% пути пройдено</p>
          </div>
          <button class="icon-button" type="button" data-go="quests" aria-label="Назад"><span class="mini-icon">←</span></button>
        </div>
        <div class="progress-line"><span style="width: 42%"></span></div>
        <div class="map">
          ${mapArc("Арка 1", ["done", "done", "done"], true)}
          ${mapArc("Арка 2", ["done", "current", ""], false)}
          ${mapArc("Арка 3", ["", "", ""], false)}
        </div>
        <button class="secondary" type="button" data-go="companion">Обсудить с компаньоном</button>
        <button class="ghost" type="button" data-go="finish">Показать финал</button>
      </section>`
  },
  step: {
    title: "Экран шага",
    section: "Внутри квеста",
    tabs: false,
    exits: ["questMap", "companion"],
    render: () => `
      <section class="screen stack">
        <div class="app-head">
          <div>
            <p class="eyebrow">Арка 2, шаг 2</p>
            <h2>Напиши функцию расчета бюджета</h2>
          </div>
          <button class="icon-button" type="button" data-go="questMap" aria-label="Назад"><span class="mini-icon">←</span></button>
        </div>
        <article class="step-detail">
          <h3>Задача</h3>
          <p class="muted">Создай функцию, которая принимает доходы и расходы, возвращает остаток и процент сбережений.</p>
          <div class="check-list">
            <label><input type="checkbox" checked> Создан файл budget.py</label>
            <label><input type="checkbox"> Добавлены 3 тестовых примера</label>
            <label><input type="checkbox"> Результат выведен в консоль</label>
          </div>
        </article>
        <button class="primary" type="button" data-go="questMap">Отметить выполненным</button>
        <button class="secondary" type="button" data-go="companion">Спросить компаньона</button>
      </section>`
  },
  test: {
    title: "Тест по арке",
    section: "Внутри квеста",
    tabs: false,
    exits: ["results"],
    render: () => `
      <section class="screen stack">
        <div class="spread">
          <span class="eyebrow">Вопрос 3 из 8</span>
          <button class="ghost" type="button" data-go="questMap">Закрыть</button>
        </div>
        <div class="question">
          <h3>Что вернет функция без явного return?</h3>
          <p class="muted">Выбери один вариант.</p>
        </div>
        <button class="option" type="button">0</button>
        <button class="option selected" type="button">None</button>
        <button class="option" type="button">False</button>
        <button class="option" type="button">Пустую строку</button>
        <button class="primary" type="button" data-go="results">Завершить тест</button>
      </section>`
  },
  results: {
    title: "Результаты теста",
    section: "Внутри квеста",
    tabs: false,
    exits: ["levelup", "test"],
    render: () => `
      <section class="screen stack">
        <div class="score">7/8</div>
        <div class="app-head">
          <div>
            <h2>Арка закрыта</h2>
            <p>+180 XP и новый материал разблокирован.</p>
          </div>
        </div>
        <article class="panel">
          <h3>Разбор</h3>
          <ol class="result-list"><li>Повтори область видимости переменных.</li><li>Практикуй именованные аргументы.</li></ol>
        </article>
        <button class="primary" type="button" data-go="levelup">Получить награду</button>
        <button class="ghost" type="button" data-go="test">Попробовать снова</button>
      </section>`
  },
  levelup: {
    title: "Левел-ап",
    section: "Внутри квеста",
    tabs: false,
    exits: ["questMap"],
    render: () => `
      <section class="screen celebration">
        <div>
          <div class="badge-big">7</div>
          <h2>Новый уровень</h2>
          <p class="muted">Компаньон получил новый скин и открыл следующую арку.</p>
          <button class="primary" type="button" data-go="questMap">Продолжить</button>
        </div>
      </section>`
  },
  finish: {
    title: "Завершение квеста",
    section: "Внутри квеста",
    tabs: false,
    exits: ["quests"],
    render: () => `
      <section class="screen celebration">
        <div>
          <img class="mascot-large" src="${mascot}" alt="">
          <h2>Квест завершен</h2>
          <p class="muted">28 шагов, 4 теста, 21 день фокуса.</p>
          <div class="stats-grid" style="margin: 18px 0;">
            <div class="stat">XP<strong>1240</strong></div>
            <div class="stat">Стрик<strong>21</strong></div>
          </div>
          <button class="primary" type="button" data-go="quests">В квесты</button>
        </div>
      </section>`
  },
  companion: {
    title: "Компаньон",
    section: "Таб Компаньон",
    tabs: true,
    exits: ["subscription", "quests", "progress", "overview"],
    render: () => `
      <section class="screen stack">
        <div class="app-head">
          <div>
            <h2>Компаньон</h2>
            <p>Контекст: Python с нуля</p>
          </div>
        </div>
        <div class="segmented">
          <button class="active" type="button">Этот квест</button>
          <button type="button">Все квесты</button>
        </div>
        <div class="chat">
          <div class="message ai">Сегодня лучше закрыть шаг про функции и сразу закрепить его маленьким примером.</div>
          <div class="message me">Объясни, как не путаться с return.</div>
          <div class="message ai">Думай о return как о результате, который функция отдает наружу. print только показывает текст.</div>
        </div>
        <div class="chips">
          <button class="chip" type="button">Что делать сегодня?</button>
          <button class="chip" type="button">Объясни последний шаг</button>
        </div>
        <div class="composer">
          <input class="field" value="Спроси что-нибудь" aria-label="Сообщение">
          <button class="icon-button" type="button" data-go="subscription" aria-label="Отправить"><span class="mini-icon">→</span></button>
        </div>
      </section>`
  },
  progress: {
    title: "Прогресс",
    section: "Таб Прогресс",
    tabs: true,
    exits: ["settings", "mascot", "subscription", "quests", "companion", "overview"],
    render: () => `
      <section class="screen stack">
        <div class="app-head">
          <div>
            <h2>Прогресс</h2>
            <p>Уровень 7, стрик 21 день</p>
          </div>
          <button class="icon-button" type="button" data-go="settings" aria-label="Настройки"><span class="mini-icon">⚙</span></button>
        </div>
        <button class="panel spread" type="button" data-go="mascot">
          <img src="${mascot}" alt="" width="72" height="72">
          <span><strong>Компаньон</strong><br><span class="muted">Стадия: Практик</span></span>
        </button>
        <div class="progress-line"><span style="width: 64%"></span></div>
        <div class="stats-grid">
          <div class="stat">Квестов<strong>6</strong></div>
          <div class="stat">Шагов<strong>143</strong></div>
          <div class="stat">Тестов<strong>18</strong></div>
          <div class="stat">XP<strong>1240</strong></div>
        </div>
        <div class="badge-grid">
          <div class="badge">7 дней<strong>Стрик</strong></div>
          <div class="badge">Босс<strong>Победа</strong></div>
          <div class="badge locked">Pro<strong>Спринт</strong></div>
          <div class="badge locked">Pro<strong>Фокус</strong></div>
        </div>
        <button class="secondary" type="button" data-go="subscription">Апгрейд</button>
      </section>`
  },
  settings: {
    title: "Настройки",
    section: "Прогресс",
    tabs: false,
    exits: ["progress", "auth"],
    render: () => `
      <section class="screen stack">
        <div class="app-head">
          <div><h2>Настройки</h2><p>alex@oria.app</p></div>
          <button class="icon-button" type="button" data-go="progress" aria-label="Назад"><span class="mini-icon">←</span></button>
        </div>
        <div class="settings-list">
          <div class="setting-row"><span>Уведомления</span><span class="toggle"><i></i></span></div>
          <div class="setting-row"><span>Время</span><strong>19:30</strong></div>
          <div class="setting-row"><span>Тема</span><strong>Системная</strong></div>
          <div class="setting-row"><span>Язык</span><strong>RU</strong></div>
          <div class="setting-row"><span>Подписка</span><strong>Free</strong></div>
        </div>
        <button class="ghost" type="button" data-go="auth">Выйти</button>
      </section>`
  },
  mascot: {
    title: "Кастомизация маскота",
    section: "Прогресс",
    tabs: false,
    exits: ["progress", "subscription"],
    render: () => `
      <section class="screen stack">
        <div class="app-head">
          <div><h2>Маскот</h2><p>Выбери образ компаньона.</p></div>
          <button class="icon-button" type="button" data-go="progress" aria-label="Назад"><span class="mini-icon">←</span></button>
        </div>
        <div class="onboarding-visual">
          <img class="mascot-large" src="${mascot}" alt="">
        </div>
        <div class="skin-grid">
          <button class="skin" type="button">Практик</button>
          <button class="skin" type="button">Фокус</button>
          <button class="skin locked" type="button" data-go="subscription">Pro</button>
          <button class="skin locked" type="button" data-go="subscription">Pro</button>
        </div>
      </section>`
  },
  subscription: {
    title: "Подписка",
    section: "Модальное окно",
    tabs: false,
    exits: ["quests", "progress"],
    render: () => `
      <section class="screen stack">
        <div class="app-head">
          <div>
            <p class="eyebrow">ORIA Pro</p>
            <h2>Больше квестов и сообщений</h2>
          </div>
          <button class="icon-button" type="button" data-go="${state.previous || "quests"}" aria-label="Закрыть"><span class="mini-icon">×</span></button>
        </div>
        <div class="pay-grid">
          <article class="pay-card">
            <h3>Free</h3>
            <p class="price">0</p>
            <p class="muted">2 квеста, дневной лимит чата, базовые тесты.</p>
          </article>
          <article class="pay-card pro">
            <h3>Pro</h3>
            <p class="price">$7</p>
            <p class="muted">Безлимитные квесты, расширенный чат, продвинутые проверки.</p>
          </article>
        </div>
        <button class="primary" type="button" data-go="${state.previous || "quests"}">Оформить Pro</button>
        <button class="ghost" type="button" data-go="${state.previous || "quests"}">Закрыть</button>
      </section>`
  },
  overview: {
    title: "Обзор",
    section: "Таб Обзор",
    tabs: true,
    exits: ["template", "quests", "companion", "progress"],
    render: () => `
      <section class="screen stack">
        <div class="app-head">
          <div><h2>Обзор</h2><p>Готовые шаблоны от команды и сообщества.</p></div>
        </div>
        <input class="field" value="Python, английский, интервью" aria-label="Поиск">
        <div class="chips">
          <button class="chip active" type="button">Все</button>
          <button class="chip" type="button">Навыки</button>
          <button class="chip" type="button">Карьера</button>
          <button class="chip" type="button">Учеба</button>
        </div>
        <div class="templates-grid">
          ${templateCard("Python за 30 дней", "Команда ORIA", "12k")}
          ${templateCard("B1 Speaking", "Lena K.", "8k")}
          ${templateCard("Собеседование PM", "Denis", "5k")}
          ${templateCard("Фитнес привычка", "Nika", "4k")}
        </div>
      </section>`
  },
  template: {
    title: "Детали шаблона",
    section: "Обзор",
    tabs: false,
    exits: ["overview", "questMap"],
    render: () => `
      <section class="screen stack">
        <div class="app-head">
          <div><p class="eyebrow">Шаблон</p><h2>Python за 30 дней</h2><p>Автор: команда ORIA</p></div>
          <button class="icon-button" type="button" data-go="overview" aria-label="Назад"><span class="mini-icon">←</span></button>
        </div>
        <article class="arc"><h3>Арка 1. Синтаксис</h3><ol><li>Переменные</li><li>Условия</li><li>Циклы</li></ol></article>
        <article class="arc"><h3>Арка 2. Практика</h3><ol><li>Функции</li><li>Файлы</li><li>Мини-проект</li></ol></article>
        <article class="arc"><h3>Арка 3. Портфолио</h3><ol><li>README</li><li>GitHub</li><li>Демо</li></ol></article>
        <button class="primary" type="button" data-go="questMap">Начать этот квест</button>
      </section>`
  }
};

const navOrder = [
  "splash", "onboarding", "auth", "firstQuest", "quests", "goal", "generating", "review",
  "questMap", "step", "test", "results", "levelup", "finish", "companion", "progress",
  "settings", "mascot", "subscription", "overview", "template"
];

const state = {
  current: "quests",
  previous: null
};

const navRoot = document.querySelector("#screenNav");
const appRoot = document.querySelector("#appRoot");
const tabbar = document.querySelector("#tabbar");
const titleRoot = document.querySelector("#screenTitle");
const sectionRoot = document.querySelector("#screenSection");
const flowRoot = document.querySelector("#flowList");

function goalMarkup(title, subtitle) {
  return `
    <section class="screen stack">
      <div class="app-head">
        <div>
          <h2>${title}</h2>
          <p>${subtitle}</p>
        </div>
      </div>
      <textarea class="textarea" aria-label="Цель">Хочу выучить Python и собрать первый pet-проект</textarea>
      <div class="chips">
        <button class="chip" type="button">Выучить Python</button>
        <button class="chip" type="button">Английский до B1</button>
        <button class="chip" type="button">Собеседование</button>
      </div>
      <div class="segmented">
        <button type="button">Новичок</button>
        <button class="active" type="button">Средний</button>
      </div>
      <button class="primary" type="button" data-go="generating">Построить квест</button>
      <button class="ghost" type="button" data-go="subscription">Лимит free</button>
    </section>`;
}

function mapArc(title, classes, bossReady) {
  return `
    <div class="map-arc">
      <div class="map-title"><span>${title}</span><span>${bossReady ? "босс открыт" : "в работе"}</span></div>
      <div class="steps">
        ${classes.map((name, index) => `<button class="step-dot ${name}" type="button" data-go="step">${index + 1}</button>`).join("")}
        <button class="boss-dot" type="button" data-go="test">B</button>
      </div>
    </div>`;
}

function templateCard(title, author, popularity) {
  return `
    <article class="template-card" role="button" tabindex="0" data-go="template">
      <h3>${title}</h3>
      <div class="template-meta"><span>${author}</span><span>${popularity}</span></div>
    </article>`;
}

function renderNav() {
  navRoot.innerHTML = navOrder.map((key) => {
    const screen = screens[key];
    return `
      <button class="nav-item ${key === state.current ? "active" : ""}" type="button" data-go="${key}">
        <span class="nav-dot" aria-hidden="true"></span>
        <span>${screen.title}</span>
      </button>`;
  }).join("");
}

function renderTabs(activeKey) {
  const visible = screens[state.current].tabs;
  tabbar.classList.toggle("visible", visible);
  tabbar.innerHTML = tabs.map((tab) => `
    <button class="tab ${tab.key === activeKey ? "active" : ""}" type="button" data-go="${tab.key}">
      <span class="tab-mark">${tab.mark}</span>
      <span>${tab.label}</span>
    </button>
  `).join("");
}

function activeTab() {
  if (["quests", "goal", "generating", "review", "questMap", "step", "test", "results", "levelup", "finish"].includes(state.current)) return "quests";
  if (["settings", "mascot", "subscription"].includes(state.current)) return state.previous === "companion" ? "companion" : "progress";
  return state.current;
}

function renderFlow(screen) {
  const exits = screen.exits || [];
  flowRoot.innerHTML = exits.length ? exits.map((key) => `
    <div class="flow-item">
      <span class="flow-arrow">→</span>
      <button type="button" data-go="${key}">${screens[key].title}</button>
    </div>
  `).join("") : `<p class="muted">Автоматический переход</p>`;
}

function navigate(key) {
  if (!screens[key]) return;
  window.clearTimeout(window.oriaTimer);
  if (key === "subscription") {
    state.previous = state.current;
  }
  state.current = key;
  const screen = screens[key];
  titleRoot.textContent = screen.title;
  sectionRoot.textContent = screen.section;
  appRoot.innerHTML = screen.render();
  renderNav();
  renderTabs(activeTab());
  renderFlow(screen);
  if (typeof screen.onEnter === "function") {
    screen.onEnter();
  }
}

document.addEventListener("click", (event) => {
  const trigger = event.target.closest("[data-go]");
  if (!trigger) return;
  event.preventDefault();
  navigate(trigger.dataset.go);
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Enter" && event.key !== " ") return;
  const trigger = event.target.closest('[role="button"][data-go]');
  if (!trigger) return;
  event.preventDefault();
  navigate(trigger.dataset.go);
});

navigate(state.current);
