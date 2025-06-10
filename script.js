// Характеристики персонажа
let stats = {
    Здоровье: 100,
    Настроение: 0,
    Деньги: 0
  };
  
  // Объект сцены
  const scenes = {
  start: {
  title: "Начало приключения",
  text: "Вы оказались в темном лесу. Куда пойдете?",
  image: "images/start.jpg",
  options: [
    {
      text: "Налево",
      nextScene: "left",
      changes: null, // Не меняем через стандартный механизм
      resetHealth: true // Добавляем кастомное поле
    },
    {
      text: "Направо",
      nextScene: "right",
      changes: { Настроение: +50 }
    }
  ]
},
  right: {
    title: "Сундук с золотом",
    text: "Вы нашли сундук с золотом!",
    image: "images/coins.jpg",
    options: [{ text: "Забрать всё", nextScene: "end", changes: { Деньги: +100, Настроение: +50 } }]
  },
  left: {
    title: "Плохой конец",
    text: "Вас съела медведица ☠️.",
    image: "images/bear.jpg",
    options: [
      { text: "Попробовать снова", nextScene: "start", changes: null, reset: true }
    ]
  },
  end: {
    title: "Конец",
    text: "Спасибо за игру! 😘 ",
    image: "images/end.jpg",
    options: []
  }
};
  
  let choicesHistory = []; // История выборов (текст)
  let currentSceneId = "start";
  
  const storyTextEl = document.getElementById("story-text");
  const optionsEl = document.getElementById("options");
  const historyEl = document.getElementById("history");
  const statsListEl = document.getElementById("stats-list");
  
  // Функция отображения сцены
function showScene(sceneId) {
  const scene = scenes[sceneId];
  if (!scene) return;

  currentSceneId = sceneId;
  
  // Обновляем заголовок
  document.querySelector(".game-container h1").textContent = scene.title;
  
  storyTextEl.textContent = scene.text;
  optionsEl.innerHTML = "";

  // Отображаем картинку, если есть
  const imageEl = document.getElementById("scene-image");
  if (scene.image) {
    imageEl.src = scene.image;
    imageEl.style.display = "block";
  } else {
    imageEl.style.display = "none";
  }

  // Создание кнопок
  scene.options.forEach(option => {
    const button = document.createElement("button");
    button.textContent = option.text;
    button.addEventListener("click", () => {
  choicesHistory.push(option.text);

  // Сброс характеристик, если указано reset
  if (option.reset) {
    stats = {
      Здоровье: 100,
      Настроение: 0,
      Деньги: 0
    };
  } else {
    // Если есть custom-поле resetHealth — зануляем здоровье
    if (option.resetHealth) {
      stats["Здоровье"] = 0;
    }

    // Иначе применяем изменения как обычно
    if (option.changes) {
      for (let key in option.changes) {
        stats[key] += option.changes[key];
      }
    }
  }

  currentSceneId = option.nextScene;
  showScene(option.nextScene);
  updateStatsDisplay();
});
    optionsEl.appendChild(button);
  });
}
  
  // Обновление отображения истории
  function updateHistoryDisplay() {
    historyEl.innerHTML = "<h3>Ваши ходы:</h3>";
    choicesHistory.forEach((choice, index) => {
      const div = document.createElement("div");
      div.className = "history-item";
      div.textContent = `${index + 1}. ${choice}`;
      historyEl.appendChild(div);
    });
  
    historyEl.scrollTop = historyEl.scrollHeight;
  }
  
  // Обновление отображения характеристик
  function updateStatsDisplay() {
  statsListEl.innerHTML = "";
  for (let key in stats) {
    const value = stats[key];
    let iconHTML = "";

    // Иконка с цветом
    if (key === "Здоровье") {
      if (value >= 81) {
        iconHTML = '<span class="heart-icon">❤️</span>';
      } else if (value >= 41) {
        iconHTML = '<span class="heart-icon">💛</span>';
      } else if (value >= 1) {
        iconHTML = '<span class="heart-icon">💔</span>';
      } else {
        iconHTML = '<span class="death-icon">☠️</span>';
      }
    } else if (key === "Настроение") {
      if (value <= 30) {
        iconHTML = '<span class="mood-icon">😢</span>';
      } else if (value <= 69) {
        iconHTML = '<span class="mood-icon">😐</span>';
      } else {
        iconHTML = '<span class="mood-icon">😄</span>';
      }
    } else if (key === "Деньги") {
      iconHTML = "💰";
    }

    const li = document.createElement("li");
    li.innerHTML = `${iconHTML} ${key}: ${value}`;

    // Добавляем классы вместо инлайновых стилей
    if (key === "Здоровье") {
      li.classList.add(value > 0 ? "stat-health" : "stat-health-zero");
    } else if (key === "Настроение") {
      li.classList.add("stat-mood");
    } else if (key === "Деньги") {
      li.classList.add("stat-money");
    }

    statsListEl.appendChild(li);
  }
}

   

  const toggleHistoryBtn = document.getElementById("toggle-history-btn");

let historyShown = false;

toggleHistoryBtn.addEventListener("click", () => {
  historyShown = !historyShown;
  if (historyShown) {
    updateHistoryDisplay();
    historyEl.style.display = "block";
    toggleHistoryBtn.textContent = "Скрыть историю";
  } else {
    historyEl.style.display = "none";
    toggleHistoryBtn.textContent = "Показать историю";
  }
});
  
  // Запуск игры
  showScene(currentSceneId);
  
  updateStatsDisplay();
