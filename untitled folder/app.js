/* ═══════════════════════════════════════════
   ORIA 2.0 — Interactive Prototype
   All data hardcoded. No backend. No AI.
   ═══════════════════════════════════════════ */
(function () {
  'use strict';

  // ─── SVG ICONS ───────────────────────────
  const ICONS = {
    back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>',
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
    chevronDown: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>',
    send: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>',
    settings: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>',
    // Tab icons
    tabQuests: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
    tabCompanion: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>',
    tabProgress: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>',
    tabExplore: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>',
    flame: '🔥',
    google: '<svg viewBox="0 0 24 24" width="20" height="20"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>',
    apple: '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.52-3.23 0-1.44.62-2.2.44-3.06-.4C3.79 16.17 4.36 9.02 8.73 8.76c1.23.07 2.08.72 2.82.78.93-.18 1.82-.87 2.99-.8 1.43.1 2.5.58 3.21 1.72-2.95 1.77-2.25 5.68.46 6.78-.57 1.36-1.3 2.72-2.16 4.04zM12.03 8.67c-.14-2.48 1.84-4.57 4.17-4.67.31 2.75-2.42 4.83-4.17 4.67z"/></svg>',
  };

  // ─── MASCOT SVG ──────────────────────────
  function mascotSVG(size) {
    size = size || 100;
    return `<svg width="${size}" height="${size}" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Body -->
      <ellipse cx="50" cy="58" rx="28" ry="30" fill="var(--growth)" opacity="0.15"/>
      <ellipse cx="50" cy="58" rx="25" ry="27" fill="var(--surface)" stroke="var(--growth)" stroke-width="2"/>
      <!-- Face -->
      <ellipse cx="50" cy="48" rx="20" ry="18" fill="var(--surface)" stroke="var(--growth)" stroke-width="2"/>
      <!-- Ears -->
      <ellipse cx="35" cy="32" rx="7" ry="10" fill="var(--surface)" stroke="var(--growth)" stroke-width="2" transform="rotate(-15 35 32)"/>
      <ellipse cx="35" cy="33" rx="4" ry="6" fill="var(--growth)" opacity="0.2" transform="rotate(-15 35 33)"/>
      <ellipse cx="65" cy="32" rx="7" ry="10" fill="var(--surface)" stroke="var(--growth)" stroke-width="2" transform="rotate(15 65 32)"/>
      <ellipse cx="65" cy="33" rx="4" ry="6" fill="var(--growth)" opacity="0.2" transform="rotate(15 65 33)"/>
      <!-- Eyes -->
      <circle cx="42" cy="46" r="4" fill="var(--ink)"/>
      <circle cx="58" cy="46" r="4" fill="var(--ink)"/>
      <circle cx="43.5" cy="44.5" r="1.5" fill="white"/>
      <circle cx="59.5" cy="44.5" r="1.5" fill="white"/>
      <!-- Nose -->
      <ellipse cx="50" cy="52" rx="3" ry="2" fill="var(--growth)" opacity="0.6"/>
      <!-- Smile -->
      <path d="M45 55 Q50 59 55 55" stroke="var(--growth)" stroke-width="1.5" fill="none" stroke-linecap="round"/>
      <!-- Tail -->
      <path d="M75 65 Q85 50 78 38 Q72 30 76 22" stroke="var(--growth)" stroke-width="2.5" fill="none" stroke-linecap="round" opacity="0.6"/>
      <!-- Paws -->
      <ellipse cx="38" cy="80" rx="6" ry="4" fill="var(--surface)" stroke="var(--growth)" stroke-width="1.5"/>
      <ellipse cx="62" cy="80" rx="6" ry="4" fill="var(--surface)" stroke="var(--growth)" stroke-width="1.5"/>
    </svg>`;
  }

  function growthRingsSVG(level, size, isNew) {
    size = size || 160;
    const cx = size / 2, cy = size / 2;
    let rings = '';
    for (let i = 1; i <= level; i++) {
      const r = 30 + i * 12;
      const isNewRing = isNew && i === level;
      const circumference = 2 * Math.PI * r;
      rings += `<circle cx="${cx}" cy="${cy}" r="${r}" class="growth-ring${isNewRing ? ' growth-ring--new' : ''}" 
        style="${isNewRing ? `stroke-dasharray:${circumference};stroke-dashoffset:${circumference}` : ''}"
        opacity="${isNewRing ? '1' : 0.15 + (i * 0.15)}"/>`;
    }
    return `<svg class="growth-rings" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">${rings}</svg>`;
  }

  // ─── STATE ───────────────────────────────
  const state = {
    currentScreen: 'splash',
    previousScreen: null,
    activeTab: 'quests',
    theme: localStorage.getItem('oria-theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'),
    user: { name: 'Алекс', level: 3, xp: 340, xpToNext: 500, streak: 12 },
    activeQuestId: null,
    activeStepId: null,
    showLevelUp: false,
    levelUpLevel: 4,
    goalText: '',
    selectedLevel: 'beginner',
    generatedQuestAdded: false,
    companionContext: 'all',

    quests: [
      {
        id: 'python',
        title: 'Освоить Python',
        progress: 62,
        arcs: [
          {
            id: 'py-arc1', name: 'Основы синтаксиса', status: 'completed',
            steps: [
              { id: 'py-s1', name: 'Установка Python', status: 'completed', content: '<p>Python — один из самых популярных языков программирования. Для начала работы необходимо установить интерпретатор.</p><p>Перейдите на <code>python.org</code> и скачайте последнюю стабильную версию. При установке на Windows обязательно отметьте галочку «Add Python to PATH».</p><p>После установки откройте терминал и введите <code>python --version</code> — вы должны увидеть номер установленной версии.</p>' },
              { id: 'py-s2', name: 'Переменные и типы данных', status: 'completed', content: '<p>Переменные в Python создаются простым присваиванием: <code>name = "Алекс"</code>. Тип определяется автоматически.</p><p>Основные типы: <code>int</code> (целые числа), <code>float</code> (дробные), <code>str</code> (строки), <code>bool</code> (логические значения).</p><p>Функция <code>type()</code> покажет тип любого значения. Попробуйте: <code>type(42)</code>, <code>type(3.14)</code>, <code>type("hello")</code>.</p>' },
              { id: 'py-s3', name: 'Условия и циклы', status: 'completed', content: '<p>Условные конструкции <code>if/elif/else</code> позволяют выполнять код в зависимости от условий.</p><p>Цикл <code>for</code> перебирает элементы последовательности, а <code>while</code> повторяет код, пока условие истинно.</p><p>Отступы в Python — не украшение, а часть синтаксиса. Используйте 4 пробела для каждого уровня вложенности.</p>' },
              { id: 'py-s4', name: 'Функции', status: 'completed', content: '<p>Функции объявляются ключевым словом <code>def</code>. Они позволяют переиспользовать код и делать программу структурированной.</p><p>Параметры функции могут иметь значения по умолчанию: <code>def greet(name="мир")</code>.</p><p>Функция может возвращать значение с помощью <code>return</code>. Без return функция вернёт <code>None</code>.</p>' },
            ]
          },
          {
            id: 'py-arc2', name: 'Структуры данных', status: 'current',
            steps: [
              { id: 'py-s5', name: 'Списки и кортежи', status: 'completed', content: '<p>Списки (<code>list</code>) — упорядоченные изменяемые коллекции. Создаются через квадратные скобки: <code>nums = [1, 2, 3]</code>.</p><p>Кортежи (<code>tuple</code>) — неизменяемые списки. Используются для данных, которые не должны меняться.</p><p>Основные методы списков: <code>.append()</code>, <code>.remove()</code>, <code>.sort()</code>, срезы <code>[start:end]</code>.</p>' },
              { id: 'py-s6', name: 'Словари', status: 'completed', content: '<p>Словари (<code>dict</code>) хранят пары «ключ: значение». Это одна из самых используемых структур в Python.</p><p>Создание: <code>user = {"name": "Алекс", "age": 25}</code>. Доступ: <code>user["name"]</code> или безопасно через <code>user.get("name")</code>.</p><p>Методы <code>.keys()</code>, <code>.values()</code>, <code>.items()</code> позволяют перебирать содержимое словаря.</p>' },
              { id: 'py-s7', name: 'Множества', status: 'current', content: '<p>Множества (<code>set</code>) — неупорядоченные коллекции уникальных элементов. Дубликаты удаляются автоматически.</p><p>Создание: <code>colors = {"red", "green", "blue"}</code>. Добавление: <code>colors.add("yellow")</code>.</p><p>Множества поддерживают математические операции: объединение <code>|</code>, пересечение <code>&</code>, разность <code>-</code>.</p>' },
              { id: 'py-s8', name: 'Работа с файлами', status: 'locked', content: '<p>Python умеет читать и записывать файлы через конструкцию <code>with open()</code>.</p><p>Режимы открытия: <code>"r"</code> — чтение, <code>"w"</code> — запись (перезапись), <code>"a"</code> — добавление в конец.</p><p>Всегда используйте <code>with</code> — это гарантирует закрытие файла даже при ошибке.</p>' },
              { id: 'py-s9', name: 'Модули и пакеты', status: 'locked', content: '<p>Модули позволяют разбивать код на логические части. Импорт через <code>import math</code> или <code>from os import path</code>.</p><p>Установка внешних пакетов через <code>pip install package_name</code>. Популярные: <code>requests</code>, <code>numpy</code>, <code>pandas</code>.</p><p>Создайте файл <code>requirements.txt</code> для фиксации зависимостей проекта.</p>' },
            ]
          },
          {
            id: 'py-arc3', name: 'ООП и проекты', status: 'locked',
            steps: [
              { id: 'py-s10', name: 'Классы и объекты', status: 'locked', content: '<p>Классы — шаблоны для создания объектов. Объявление: <code>class Dog:</code>.</p>' },
              { id: 'py-s11', name: 'Наследование', status: 'locked', content: '<p>Наследование позволяет создавать новые классы на основе существующих.</p>' },
              { id: 'py-s12', name: 'Декораторы', status: 'locked', content: '<p>Декораторы — функции, которые модифицируют поведение других функций.</p>' },
              { id: 'py-s13', name: 'Финальный проект', status: 'locked', content: '<p>Примените все знания в практическом проекте.</p>' },
            ]
          }
        ]
      },
      {
        id: 'english',
        title: 'Английский до B1',
        progress: 30,
        arcs: [
          {
            id: 'en-arc1', name: 'Базовая грамматика', status: 'current',
            steps: [
              { id: 'en-s1', name: 'Present Simple vs Continuous', status: 'completed', content: '<p>Present Simple описывает привычки и факты: <code>I work every day</code>. Present Continuous — действия прямо сейчас: <code>I am working now</code>.</p><p>Маркеры Simple: always, usually, often, sometimes, never. Маркеры Continuous: now, right now, at the moment.</p><p>Глаголы состояния (know, like, want) обычно не используются в Continuous.</p>' },
              { id: 'en-s2', name: 'Past tenses', status: 'completed', content: '<p>Past Simple — завершённые действия: <code>I visited Paris last year</code>. Past Continuous — длительные действия в прошлом: <code>I was reading when she called</code>.</p><p>Неправильные глаголы нужно запоминать: go→went, see→saw, take→took.</p><p>Past Perfect (<code>had + V3</code>) показывает, что одно действие произошло раньше другого в прошлом.</p>' },
              { id: 'en-s3', name: 'Future forms', status: 'current', content: '<p>Will — спонтанные решения и предсказания: <code>I will help you</code>. Going to — запланированные действия: <code>I am going to study tonight</code>.</p><p>Present Continuous также используется для будущего, когда есть договорённость: <code>I am meeting John tomorrow</code>.</p><p>Present Simple для расписаний: <code>The train leaves at 9 AM</code>.</p>' },
              { id: 'en-s4', name: 'Modal verbs', status: 'locked', content: '<p>Модальные глаголы: can, could, must, should, may, might.</p>' },
              { id: 'en-s5', name: 'Conditionals', status: 'locked', content: '<p>Условные предложения: Zero, First, Second, Third Conditional.</p>' },
            ]
          },
          {
            id: 'en-arc2', name: 'Разговорная практика', status: 'locked',
            steps: [
              { id: 'en-s6', name: 'Повседневные фразы', status: 'locked', content: '' },
              { id: 'en-s7', name: 'Диалоги в магазине', status: 'locked', content: '' },
              { id: 'en-s8', name: 'Путешествия', status: 'locked', content: '' },
              { id: 'en-s9', name: 'Работа и карьера', status: 'locked', content: '' },
            ]
          },
          {
            id: 'en-arc3', name: 'Чтение и аудирование', status: 'locked',
            steps: [
              { id: 'en-s10', name: 'Адаптированные тексты', status: 'locked', content: '' },
              { id: 'en-s11', name: 'Подкасты для B1', status: 'locked', content: '' },
              { id: 'en-s12', name: 'Новостные статьи', status: 'locked', content: '' },
              { id: 'en-s13', name: 'Видео с субтитрами', status: 'locked', content: '' },
            ]
          }
        ]
      }
    ],

    generatedQuest: {
      id: 'design',
      title: 'Основы дизайна интерфейсов',
      description: 'Квест проведёт от визуальных принципов до создания собственного портфолио-проекта. Подойдёт новичкам без опыта в дизайне.',
      progress: 0,
      arcs: [
        {
          id: 'ds-arc1', name: 'Визуальные принципы', status: 'current',
          steps: [
            { id: 'ds-s1', name: 'Композиция и сетки', status: 'current', content: '<p>Композиция определяет, как элементы расположены на странице.</p>' },
            { id: 'ds-s2', name: 'Типографика', status: 'locked', content: '<p>Выбор шрифтов и правила работы с текстом.</p>' },
            { id: 'ds-s3', name: 'Цвет и контраст', status: 'locked', content: '<p>Цветовые палитры и правила контраста.</p>' },
            { id: 'ds-s4', name: 'Иконки и иллюстрации', status: 'locked', content: '<p>Работа с визуальными элементами интерфейса.</p>' },
          ]
        },
        {
          id: 'ds-arc2', name: 'Проектирование интерфейсов', status: 'locked',
          steps: [
            { id: 'ds-s5', name: 'Исследование пользователей', status: 'locked', content: '' },
            { id: 'ds-s6', name: 'Информационная архитектура', status: 'locked', content: '' },
            { id: 'ds-s7', name: 'Wireframes', status: 'locked', content: '' },
            { id: 'ds-s8', name: 'Прототипирование', status: 'locked', content: '' },
          ]
        },
        {
          id: 'ds-arc3', name: 'Инструменты и практика', status: 'locked',
          steps: [
            { id: 'ds-s9', name: 'Figma: основы', status: 'locked', content: '' },
            { id: 'ds-s10', name: 'Дизайн-система', status: 'locked', content: '' },
            { id: 'ds-s11', name: 'Адаптивный дизайн', status: 'locked', content: '' },
            { id: 'ds-s12', name: 'Портфолио-проект', status: 'locked', content: '' },
          ]
        }
      ]
    },

    companionMessages: [
      { from: 'companion', text: 'Привет! Смотрю на твои квесты\u2026 По английскому всё горит — ты уже на Future forms. А Python не трогали 4 дня. С чего начнём сегодня?', time: '10:30' },
      { from: 'user', text: 'Давай с Python, а то совсем забросил', time: '10:31' },
      { from: 'companion', text: 'Хороший план! Сейчас у тебя открыт шаг «Множества» — это минут на 20. Начнёшь прямо сейчас?', time: '10:31' },
    ],

    companionResponses: {
      'Что делать сегодня?': 'Сегодня стоит вернуться к Python — у тебя открыт шаг «Множества». Это быстрый шаг, минут на 15–20. После него можно переключиться на английский.',
      'Объясни последний шаг': 'Множества в Python — это коллекции уникальных элементов. Главное отличие от списков: множество автоматически убирает дубликаты. Операции пересечения и объединения часто используются для фильтрации данных.',
    },
  };

  // ─── HELPERS ─────────────────────────────
  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => [...(ctx || document).querySelectorAll(sel)];
  const app = () => document.getElementById('app');

  function applyTheme(theme) {
    state.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('oria-theme', theme);
  }

  function getQuestById(id) {
    return state.quests.find(q => q.id === id);
  }

  function getStepById(questId, stepId) {
    const quest = getQuestById(questId);
    if (!quest) return null;
    for (const arc of quest.arcs) {
      const step = arc.steps.find(s => s.id === stepId);
      if (step) return { step, arc, quest };
    }
    return null;
  }

  function calcQuestProgress(quest) {
    let total = 0, done = 0;
    for (const arc of quest.arcs) {
      for (const step of arc.steps) {
        total++;
        if (step.status === 'completed') done++;
      }
    }
    return Math.round((done / total) * 100);
  }

  function renderBuds(quest) {
    let buds = '';
    for (const arc of quest.arcs) {
      for (const step of arc.steps) {
        const cls = step.status === 'completed' ? 'bud--completed' : (step.status === 'current' ? 'bud--current' : '');
        buds += `<span class="bud ${cls}" aria-label="${step.name}"></span>`;
      }
    }
    return `<div class="buds">${buds}</div>`;
  }

  function renderXpBuds(xp, xpToNext) {
    const total = 10;
    const filled = Math.round((xp / xpToNext) * total);
    let buds = '';
    for (let i = 0; i < total; i++) {
      buds += `<span class="bud ${i < filled ? 'bud--completed' : ''}"></span>`;
    }
    return `<div class="buds">${buds}</div>`;
  }

  // ─── NAVIGATION ──────────────────────────
  function navigate(screen, opts) {
    state.previousScreen = state.currentScreen;
    state.currentScreen = screen;
    if (opts) Object.assign(state, opts);
    render();
  }

  // ─── TAB BAR ─────────────────────────────
  function renderTabBar() {
    const tabs = [
      { id: 'quests', icon: ICONS.tabQuests, label: 'Квесты', screen: 'quests' },
      { id: 'companion', icon: ICONS.tabCompanion, label: 'Компаньон', screen: 'companion' },
      { id: 'progress', icon: ICONS.tabProgress, label: 'Прогресс', screen: 'progress' },
      { id: 'explore', icon: ICONS.tabExplore, label: 'Обзор', screen: 'explore' },
    ];
    return `<nav class="tab-bar" role="tablist">
      ${tabs.map(t => `
        <button class="tab-bar__item ${state.activeTab === t.id ? 'tab-bar__item--active' : ''}" 
                data-action="tab" data-tab="${t.id}" data-screen="${t.screen}"
                role="tab" aria-selected="${state.activeTab === t.id}" id="tab-${t.id}">
          ${t.icon}
          <span>${t.label}</span>
        </button>
      `).join('')}
    </nav>`;
  }

  // ─── SIDEBAR ─────────────────────────────
  function renderSidebar() {
    const items = [
      { id: 'quests', icon: ICONS.tabQuests, label: 'Квесты', screen: 'quests' },
      { id: 'companion', icon: ICONS.tabCompanion, label: 'Компаньон', screen: 'companion' },
      { id: 'progress', icon: ICONS.tabProgress, label: 'Прогресс', screen: 'progress' },
      { id: 'explore', icon: ICONS.tabExplore, label: 'Обзор', screen: 'explore' },
    ];
    return `<aside class="sidebar">
      <div class="sidebar__brand">ORIA</div>
      <nav class="sidebar__nav">
        ${items.map(t => `
          <button class="sidebar__item ${state.activeTab === t.id ? 'sidebar__item--active' : ''}"
                  data-action="tab" data-tab="${t.id}" data-screen="${t.screen}">
            ${t.icon}
            <span>${t.label}</span>
          </button>
        `).join('')}
      </nav>
      <div class="sidebar__footer">
        <div class="sidebar__avatar">А</div>
        <div class="sidebar__user-info">
          <span class="sidebar__user-name">${state.user.name}</span>
          <span class="sidebar__user-level">Уровень ${state.user.level}</span>
        </div>
      </div>
    </aside>`;
  }

  function backNav(label, action) {
    return `<button class="back-nav" data-action="${action}" id="btn-back">
      ${ICONS.back}
      <span>${label}</span>
    </button>`;
  }

  // ═══════════════════════════════════════════
  //  SCREEN RENDERERS
  // ═══════════════════════════════════════════

  // 1. SPLASH
  function renderSplash() {
    return `<div class="splash screen screen--no-tab-padding" id="screen-splash">
      <div class="splash__mascot">${mascotSVG(120)}</div>
      <div class="splash__logo">ORIA</div>
    </div>`;
  }

  // 2. LOGIN
  function renderLogin() {
    return `<div class="login screen screen--no-tab-padding" id="screen-login">
      <div class="login__card">
        <div class="login__brand">
          <div class="splash__mascot" style="width:60px;height:60px;margin:0 auto var(--sp-12)">${mascotSVG(60)}</div>
          <div class="login__brand-name">ORIA</div>
        </div>
        <div class="login__tabs">
          <button class="login__tab login__tab--active" data-action="login-tab" data-tab="login" id="login-tab-login">Войти</button>
          <button class="login__tab" data-action="login-tab" data-tab="register" id="login-tab-register">Зарегистрироваться</button>
        </div>
        <form class="login__form" onsubmit="return false">
          <input class="input" type="email" placeholder="Email" id="login-email" autocomplete="email">
          <input class="input" type="password" placeholder="Пароль" id="login-password" autocomplete="current-password">
          <button class="btn btn--primary btn--full btn--lg" data-action="do-login" id="btn-login">Войти</button>
        </form>
        <div class="login__divider">или</div>
        <div class="login__socials">
          <button class="login__social-btn" data-action="do-login" id="btn-google">${ICONS.google} Войти через Google</button>
          <button class="login__social-btn" data-action="do-login" id="btn-apple">${ICONS.apple} Войти через Apple</button>
        </div>
      </div>
    </div>`;
  }

  // 3. QUESTS (MAIN)
  function renderQuests() {
    const questCards = state.quests.map(q => {
      q.progress = calcQuestProgress(q);
      const currentArc = q.arcs.find(a => a.status === 'current') || q.arcs[q.arcs.length - 1];
      return `<article class="quest-card" data-action="open-quest" data-quest-id="${q.id}" id="quest-${q.id}" tabindex="0" role="button">
        <div class="quest-card__title">${q.title}</div>
        <div class="quest-card__arc">Сейчас: ${currentArc.name}</div>
        ${renderBuds(q)}
        <div class="quest-card__footer">
          <span class="quest-card__percent">${q.progress}%</span>
        </div>
      </article>`;
    }).join('');

    const emptyState = state.quests.length === 0 ? `
      <div class="empty-state">
        <div class="splash__mascot" style="width:80px;height:80px;margin:0 auto var(--sp-16)">${mascotSVG(80)}</div>
        <div class="empty-state__title">Пока нет активных квестов</div>
        <p>Поставь первую цель — путь появится за секунды.</p>
      </div>` : '';

    return `<div class="screen quests-screen" id="screen-quests">
      <header class="screen-header">
        <h1 class="screen-header__title">Активные квесты</h1>
        <div class="screen-header__right">
          <span class="streak" title="Стрик: ${state.user.streak} дней"><span class="streak__icon">${ICONS.flame}</span> ${state.user.streak}</span>
          <span class="user-badge">Ур. ${state.user.level}</span>
        </div>
      </header>
      ${emptyState}
      <div class="quests-grid">${questCards}</div>
      <button class="fab" data-action="new-quest" id="fab-new-quest" aria-label="Новый квест">
        ${ICONS.plus}
      </button>
      ${renderTabBar()}
      ${renderSidebar()}
    </div>`;
  }

  // 4. GOAL INPUT
  function renderGoalInput() {
    const chips = ['Выучить Python', 'Английский до B1', 'Подготовиться к собеседованию', 'Основы дизайна'];
    const levels = [
      { id: 'beginner', label: 'Новичок' },
      { id: 'medium', label: 'Средний' },
      { id: 'advanced', label: 'Продвинутый' },
    ];

    return `<div class="screen goal-screen" id="screen-goal-input">
      ${backNav('Назад', 'go-quests')}
      <h1 class="goal-screen__title">Какую цель хочешь достичь?</h1>
      <textarea class="textarea" placeholder="Опиши свою цель\u2026" id="goal-textarea" rows="3">${state.goalText}</textarea>
      <div class="chips">
        ${chips.map(c => `<button class="chip" data-action="fill-goal" data-goal="${c}" id="chip-${c.replace(/\s/g, '-')}">${c}</button>`).join('')}
      </div>
      <label class="field-label">Уровень подготовки</label>
      <div class="level-selector">
        ${levels.map(l => `<button class="level-option ${state.selectedLevel === l.id ? 'level-option--active' : ''}" 
          data-action="select-level" data-level="${l.id}" id="level-${l.id}">${l.label}</button>`).join('')}
      </div>
      <button class="btn btn--primary btn--full btn--lg mt-24" data-action="build-quest" id="btn-build-quest">Построить квест</button>
      ${renderTabBar()}
      ${renderSidebar()}
    </div>`;
  }

  // 5. GENERATION LOADING
  function renderGeneration() {
    return `<div class="generation screen screen--no-tab-padding" id="screen-generation">
      <div class="generation__mascot">${mascotSVG(140)}</div>
      <div class="generation__spinner"></div>
      <div class="generation__status" id="gen-status">Строим арки\u2026</div>
    </div>`;
  }

  // 6. QUEST REVIEW
  function renderQuestReview() {
    const q = state.generatedQuest;
    return `<div class="screen review-screen" id="screen-quest-review">
      ${backNav('Назад', 'go-goal-input')}
      <h1 class="review__title">${q.title}</h1>
      <p class="review__desc">${q.description}</p>
      <div class="arc-list">
        ${q.arcs.map((arc, i) => `
          <div class="arc-item ${i === 0 ? 'arc-item--open' : ''}" id="review-arc-${arc.id}">
            <div class="arc-item__header" data-action="toggle-arc" data-arc-id="${arc.id}" tabindex="0" role="button">
              <span class="arc-item__name">${arc.name}</span>
              <span class="arc-item__chevron">${ICONS.chevronDown}</span>
            </div>
            <div class="arc-item__steps">
              ${arc.steps.map(s => `
                <div class="arc-step">
                  <span class="arc-step__dot"></span>
                  <span>${s.name}</span>
                </div>
              `).join('')}
            </div>
          </div>
        `).join('')}
      </div>
      <div class="review__actions">
        <button class="btn btn--secondary" data-action="regenerate" id="btn-regenerate">Перегенерировать</button>
        <button class="btn btn--primary" data-action="start-quest" id="btn-start-quest">Начать квест</button>
      </div>
    </div>`;
  }

  // 7. QUEST MAP
  function renderQuestMap() {
    const quest = getQuestById(state.activeQuestId);
    if (!quest) return renderQuests();
    quest.progress = calcQuestProgress(quest);

    let totalSteps = 0, completedSteps = 0;
    quest.arcs.forEach(a => a.steps.forEach(s => { totalSteps++; if (s.status === 'completed') completedSteps++; }));
    const stemPercent = Math.round((completedSteps / totalSteps) * 100);

    return `<div class="screen quest-map" id="screen-quest-map">
      ${backNav('Квесты', 'go-quests')}
      <div class="quest-map__header">
        <h1 class="quest-map__title">${quest.title}</h1>
        <span class="quest-map__progress">${quest.progress}%</span>
      </div>
      <div class="branch-tree">
        <div class="stem">
          <div class="stem__filled" style="height: ${stemPercent}%"></div>
        </div>
        ${quest.arcs.map((arc, arcIdx) => {
          const arcStatus = arc.status;
          return `<div class="branch branch--${arcStatus}" id="branch-${arc.id}">
            <div class="branch__label">${arc.name}</div>
            <div class="branch__steps">
              ${arc.steps.map(step => {
                const isClickable = step.status === 'completed' || step.status === 'current';
                return `<div class="step-node step-node--${step.status} ${step._justBloomed ? 'step-node--just-bloomed' : ''}" 
                     data-action="${isClickable ? 'open-step' : ''}" 
                     data-quest-id="${quest.id}" data-step-id="${step.id}"
                     ${isClickable ? 'tabindex="0" role="button"' : 'aria-disabled="true"'}
                     id="step-${step.id}">
                  <span class="step-node__bud"></span>
                  <span class="step-node__name">${step.name}</span>
                  <span class="step-node__check">${ICONS.check}</span>
                </div>`;
              }).join('')}
            </div>
          </div>`;
        }).join('')}
      </div>
      <div class="quest-map__footer">
        <button class="btn btn--secondary" data-action="go-companion" id="btn-discuss">Обсудить с компаньоном</button>
      </div>
      ${renderTabBar()}
      ${renderSidebar()}
    </div>`;
  }

  // 8. STEP SCREEN
  function renderStep() {
    const data = getStepById(state.activeQuestId, state.activeStepId);
    if (!data) return renderQuestMap();
    const { step, arc, quest } = data;

    return `<div class="screen step-screen" id="screen-step">
      ${backNav('Карта квеста', 'go-quest-map')}
      <div class="step-screen__breadcrumb">${quest.title} → ${arc.name}</div>
      <h1 class="step-screen__title">${step.name}</h1>
      <div class="step-screen__content">${step.content || '<p>Содержание шага будет доступно после запуска квеста.</p>'}</div>
      <div class="step-screen__actions">
        ${step.status === 'current'
          ? `<button class="btn btn--primary btn--full btn--lg" data-action="complete-step" 
               data-quest-id="${quest.id}" data-step-id="${step.id}" id="btn-complete-step">Отметить выполненным</button>`
          : `<div class="flex items-center gap-8 text-growth">${ICONS.check} <span class="fw-500">Шаг выполнен</span></div>`
        }
      </div>
    </div>`;
  }

  // 9. LEVEL-UP OVERLAY
  function renderLevelUpOverlay() {
    if (!state.showLevelUp) return '';
    const level = state.levelUpLevel;
    // Generate random particles
    let particles = '';
    for (let i = 0; i < 12; i++) {
      const x = 30 + Math.random() * 280;
      const delay = Math.random() * 0.8;
      particles += `<div class="particle" style="left:${x}px;top:${150 + Math.random() * 60}px;animation-delay:${delay}s;width:${4 + Math.random() * 6}px;height:${4 + Math.random() * 6}px"></div>`;
    }

    return `<div class="level-up-overlay" id="level-up-overlay" data-action="noop">
      <div class="level-up__card">
        ${particles}
        <div class="level-up__mascot">
          ${growthRingsSVG(level, 160, true)}
          <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%)">${mascotSVG(70)}</div>
        </div>
        <div class="level-up__level">Уровень ${level}</div>
        <div class="level-up__subtitle">Арка завершена!</div>
        <button class="btn btn--bloom btn--lg" data-action="close-level-up" id="btn-continue-level-up">Продолжить</button>
      </div>
    </div>`;
  }

  // 10. COMPANION
  function renderCompanion() {
    const contexts = [
      { id: 'all', label: 'Все квесты' },
      ...state.quests.map(q => ({ id: q.id, label: q.title }))
    ];

    return `<div class="screen companion-screen" id="screen-companion">
      <header class="screen-header" style="padding: var(--sp-8) var(--sp-16) 0">
        <h1 class="screen-header__title">Компаньон</h1>
      </header>
      <div class="companion__context-bar">
        ${contexts.map(c => `<button class="context-chip ${state.companionContext === c.id ? 'context-chip--active' : ''}"
          data-action="companion-context" data-context="${c.id}" id="ctx-${c.id}">${c.label}</button>`).join('')}
      </div>
      <div class="companion__messages" id="companion-messages">
        ${state.companionMessages.map(m => `
          <div class="message message--${m.from}">
            <div class="message__avatar">${m.from === 'companion' ? '🐾' : 'А'}</div>
            <div>
              <div class="message__bubble">${m.text}</div>
              <div class="message__time">${m.time}</div>
            </div>
          </div>
        `).join('')}
      </div>
      <div class="companion__quick-chips">
        <button class="quick-chip" data-action="quick-chat" data-msg="Что делать сегодня?" id="qc-today">Что делать сегодня?</button>
        <button class="quick-chip" data-action="quick-chat" data-msg="Объясни последний шаг" id="qc-explain">Объясни последний шаг</button>
      </div>
      <div class="companion__input-bar">
        <input class="companion__input" placeholder="Написать\u2026" id="companion-input">
        <button class="companion__send" id="btn-send-msg" data-action="send-companion">${ICONS.send}</button>
      </div>
      ${renderTabBar()}
      ${renderSidebar()}
    </div>`;
  }

  // 11. PROGRESS
  function renderProgress() {
    const u = state.user;
    return `<div class="screen progress-screen" id="screen-progress">
      <header class="screen-header" style="padding: var(--sp-8) 0 0">
        <h1 class="screen-header__title">Прогресс</h1>
        <button class="btn btn--icon btn--ghost" data-action="go-settings" id="btn-settings" aria-label="Настройки">
          ${ICONS.settings}
        </button>
      </header>
      <div class="progress__mascot-area">
        ${growthRingsSVG(u.level, 160, false)}
        <div class="progress__mascot">${mascotSVG(80)}</div>
      </div>
      <div class="progress__level">Уровень ${u.level}</div>
      <div class="progress__level-label">${u.xp} / ${u.xpToNext} опыта</div>
      <div class="progress__xp">
        <span class="progress__xp-label">Опыт</span>
        ${renderXpBuds(u.xp, u.xpToNext)}
      </div>
      <div class="progress__streak-card">
        <span>${ICONS.flame}</span>
        <span>${u.streak} дней подряд</span>
      </div>
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-card__value">1</div>
          <div class="stat-card__label">Квестов завершено</div>
        </div>
        <div class="stat-card">
          <div class="stat-card__value">14</div>
          <div class="stat-card__label">Шагов сделано</div>
        </div>
        <div class="stat-card">
          <div class="stat-card__value">${u.streak}</div>
          <div class="stat-card__label">Дней подряд</div>
        </div>
        <div class="stat-card">
          <div class="stat-card__value">2</div>
          <div class="stat-card__label">Тестов пройдено</div>
        </div>
      </div>
      ${renderTabBar()}
      ${renderSidebar()}
    </div>`;
  }

  // 12. SETTINGS — STUB
  function renderSettings() {
    const isDark = state.theme === 'dark';
    return `<div class="screen settings-screen" id="screen-settings">
      ${backNav('Прогресс', 'go-progress')}
      <h1 class="screen-header__title" style="margin-bottom:var(--sp-24)">Настройки</h1>
      <!-- STUB: Settings screen is simplified for demo -->
      <div class="settings-group">
        <div class="settings-group__title">Внешний вид</div>
        <div class="settings-item" data-action="toggle-theme" id="setting-theme">
          <span class="settings-item__label">Тёмная тема</span>
          <div class="toggle ${isDark ? 'toggle--on' : ''}" id="theme-toggle">
            <div class="toggle__knob"></div>
          </div>
        </div>
      </div>
      <div class="settings-group">
        <div class="settings-group__title">Аккаунт</div>
        <div class="settings-item">
          <span class="settings-item__label">Email</span>
          <span class="settings-item__value">alex@example.com</span>
        </div>
        <div class="settings-item">
          <span class="settings-item__label">Язык</span>
          <span class="settings-item__value">Русский</span>
        </div>
        <div class="settings-item">
          <span class="settings-item__label">Уведомления</span>
          <span class="settings-item__value">Включены</span>
        </div>
      </div>
      <button class="btn btn--secondary btn--full mt-24" data-action="logout" id="btn-logout">Выйти</button>
    </div>`;
  }

  // 13. EXPLORE — STUB
  function renderExplore() {
    // STUB: Explore screen is simplified for demo
    const templates = [
      { title: 'Основы JavaScript', author: 'ORIA', tag: 'Программирование', desc: '3 арки · 12 шагов' },
      { title: 'Продуктовый дизайн', author: 'Сообщество', tag: 'Дизайн', desc: '4 арки · 16 шагов' },
      { title: 'Подготовка к IELTS', author: 'ORIA', tag: 'Языки', desc: '5 арок · 20 шагов' },
      { title: 'Data Science с нуля', author: 'Сообщество', tag: 'Аналитика', desc: '4 арки · 14 шагов' },
    ];

    return `<div class="screen explore-screen" id="screen-explore">
      <!-- STUB: Explore screen is simplified for demo -->
      <header class="screen-header">
        <h1 class="screen-header__title">Обзор</h1>
      </header>
      <div class="explore-grid">
        ${templates.map((t, i) => `
          <div class="template-card" id="template-${i}" tabindex="0">
            <div class="template-card__title">${t.title}</div>
            <div class="template-card__meta">${t.author} · ${t.desc}</div>
            <span class="template-card__tag">${t.tag}</span>
          </div>
        `).join('')}
      </div>
      ${renderTabBar()}
      ${renderSidebar()}
    </div>`;
  }

  // ─── MAIN RENDER ─────────────────────────
  function render() {
    let html = '';
    switch (state.currentScreen) {
      case 'splash': html = renderSplash(); break;
      case 'login': html = renderLogin(); break;
      case 'quests': html = renderQuests(); break;
      case 'goal-input': html = renderGoalInput(); break;
      case 'generation': html = renderGeneration(); break;
      case 'quest-review': html = renderQuestReview(); break;
      case 'quest-map': html = renderQuestMap(); break;
      case 'step': html = renderStep(); break;
      case 'companion': html = renderCompanion(); break;
      case 'progress': html = renderProgress(); break;
      case 'settings': html = renderSettings(); break;
      case 'explore': html = renderExplore(); break;
      default: html = renderQuests();
    }

    html += renderLevelUpOverlay();
    app().innerHTML = html;

    // Post-render hooks
    if (state.currentScreen === 'companion') {
      const msgs = document.getElementById('companion-messages');
      if (msgs) msgs.scrollTop = msgs.scrollHeight;
    }
  }

  // ─── EVENT HANDLING (Delegation) ─────────
  document.addEventListener('click', function (e) {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const action = btn.dataset.action;

    switch (action) {
      case 'tab': {
        const tab = btn.dataset.tab;
        const screen = btn.dataset.screen;
        state.activeTab = tab;
        navigate(screen);
        break;
      }

      case 'do-login':
        navigate('quests');
        state.activeTab = 'quests';
        break;

      case 'login-tab': {
        const loginTabs = $$('.login__tab');
        loginTabs.forEach(t => t.classList.remove('login__tab--active'));
        btn.classList.add('login__tab--active');
        break;
      }

      case 'new-quest':
        navigate('goal-input');
        break;

      case 'go-quests':
        state.activeTab = 'quests';
        navigate('quests');
        break;

      case 'go-quest-map':
        navigate('quest-map');
        break;

      case 'go-companion':
        state.activeTab = 'companion';
        navigate('companion');
        break;

      case 'go-progress':
        state.activeTab = 'progress';
        navigate('progress');
        break;

      case 'go-settings':
        navigate('settings');
        break;

      case 'go-goal-input':
        navigate('goal-input');
        break;

      case 'fill-goal': {
        state.goalText = btn.dataset.goal;
        const textarea = document.getElementById('goal-textarea');
        if (textarea) textarea.value = state.goalText;
        break;
      }

      case 'select-level': {
        state.selectedLevel = btn.dataset.level;
        $$('.level-option').forEach(l => l.classList.remove('level-option--active'));
        btn.classList.add('level-option--active');
        break;
      }

      case 'build-quest':
        navigate('generation');
        startGenerationSequence();
        break;

      case 'toggle-arc': {
        const arcId = btn.dataset.arcId;
        const arcItem = document.getElementById('review-arc-' + arcId);
        if (arcItem) arcItem.classList.toggle('arc-item--open');
        break;
      }

      case 'regenerate':
        navigate('generation');
        startGenerationSequence();
        break;

      case 'start-quest': {
        if (!state.generatedQuestAdded) {
          const newQuest = JSON.parse(JSON.stringify(state.generatedQuest));
          state.quests.push(newQuest);
          state.generatedQuestAdded = true;
        }
        state.activeQuestId = state.generatedQuest.id;
        state.activeTab = 'quests';
        navigate('quest-map');
        break;
      }

      case 'open-quest': {
        state.activeQuestId = btn.dataset.questId;
        navigate('quest-map');
        break;
      }

      case 'open-step': {
        const questId = btn.dataset.questId;
        const stepId = btn.dataset.stepId;
        if (!questId || !stepId) break;
        state.activeQuestId = questId;
        state.activeStepId = stepId;
        navigate('step');
        break;
      }

      case 'complete-step': {
        completeStep(btn.dataset.questId, btn.dataset.stepId);
        break;
      }

      case 'close-level-up':
        state.showLevelUp = false;
        render();
        break;

      case 'companion-context': {
        state.companionContext = btn.dataset.context;
        render();
        break;
      }

      case 'quick-chat': {
        const msg = btn.dataset.msg;
        addCompanionMessage('user', msg);
        setTimeout(() => {
          const response = state.companionResponses[msg] || 'Дай мне секунду, загляну в твои квесты\u2026';
          addCompanionMessage('companion', response);
        }, 1000);
        break;
      }

      case 'send-companion': {
        const input = document.getElementById('companion-input');
        if (input && input.value.trim()) {
          addCompanionMessage('user', input.value.trim());
          input.value = '';
          setTimeout(() => {
            addCompanionMessage('companion', 'Хороший вопрос! Давай разберём это подробнее после того, как закончишь текущий шаг.');
          }, 1000);
        }
        break;
      }

      case 'toggle-theme': {
        applyTheme(state.theme === 'dark' ? 'light' : 'dark');
        render();
        break;
      }

      case 'logout':
        navigate('login');
        break;

      case 'noop':
        break;
    }
  });

  // Keyboard: Enter activates buttons and cards
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') {
      const el = e.target.closest('[data-action]');
      if (el && el.tagName !== 'BUTTON' && el.tagName !== 'A') {
        e.preventDefault();
        el.click();
      }
    }
  });

  // ─── GENERATION SEQUENCE ─────────────────
  function startGenerationSequence() {
    const messages = ['Строим арки\u2026', 'Расставляем шаги\u2026', 'Проверяем маршрут\u2026'];
    let i = 0;
    const interval = setInterval(() => {
      i++;
      if (i >= messages.length) {
        clearInterval(interval);
        return;
      }
      const el = document.getElementById('gen-status');
      if (el) {
        el.textContent = messages[i];
        el.style.animation = 'none';
        // Force reflow
        void el.offsetWidth;
        el.style.animation = '';
      }
    }, 700);

    setTimeout(() => {
      clearInterval(interval);
      navigate('quest-review');
    }, 2200);
  }

  // ─── STEP COMPLETION ─────────────────────
  function completeStep(questId, stepId) {
    const data = getStepById(questId, stepId);
    if (!data || data.step.status !== 'current') return;

    const { step, arc, quest } = data;

    // Mark step completed
    step.status = 'completed';
    step._justBloomed = true;

    // Unlock next step in same arc
    const stepIdx = arc.steps.indexOf(step);
    if (stepIdx < arc.steps.length - 1) {
      arc.steps[stepIdx + 1].status = 'current';
    }

    // Check if arc is complete
    const arcComplete = arc.steps.every(s => s.status === 'completed');
    if (arcComplete) {
      arc.status = 'completed';
      // Unlock next arc
      const arcIdx = quest.arcs.indexOf(arc);
      if (arcIdx < quest.arcs.length - 1) {
        const nextArc = quest.arcs[arcIdx + 1];
        nextArc.status = 'current';
        nextArc.steps[0].status = 'current';
      }
      // Level up!
      state.user.level++;
      state.user.xp += 80;
      state.levelUpLevel = state.user.level;
      state.showLevelUp = true;
    }

    // Update progress
    quest.progress = calcQuestProgress(quest);

    // Show completion burst then navigate back
    showCompletionBurst();
    setTimeout(() => {
      navigate('quest-map');
      // Clear bloom flag after render
      setTimeout(() => { step._justBloomed = false; }, 500);
    }, 600);
  }

  function showCompletionBurst() {
    const burst = document.createElement('div');
    burst.className = 'completion-burst';
    burst.innerHTML = '<div class="completion-burst__ring"></div>';
    document.body.appendChild(burst);
    setTimeout(() => burst.remove(), 700);
  }

  // ─── COMPANION MESSAGES ──────────────────
  function addCompanionMessage(from, text) {
    const now = new Date();
    const time = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
    state.companionMessages.push({ from, text, time });
    render();
  }

  // ─── SPLASH AUTO-TRANSITION ──────────────
  function initApp() {
    applyTheme(state.theme);
    render();

    if (state.currentScreen === 'splash') {
      setTimeout(() => {
        const splash = document.querySelector('.splash');
        if (splash) splash.classList.add('splash--fade-out');
        setTimeout(() => navigate('login'), 400);
      }, 1500);
    }
  }

  // ─── BOOT ────────────────────────────────
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }

})();
