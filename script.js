// Характеристики персонажа
let stats = {
    Здоровье: 100,
    Настроение: 0,
    Деньги: 0
  };
  
  // Объект сцены
  const scenes = {
  start: {
    text: "Вы оказались в темном лесу. Куда пойдете?",
    image: "images/start.jpg", // Путь к картинке
    options: [
      { text: "Налево", nextScene: "left", changes: { Здоровье: -100 } },
      { text: "Направо", nextScene: "right", changes: { Настроение: +50 } }
      
    ]
  },
  right: {
    text: "Вы нашли сундук с золотом!",
    image: "images/coins.jpg",
    options: [{ text: "Забрать всё", nextScene: "end", changes: { Деньги: +100, Настроение: +50 } }]
  },
 left: {
  text: "Вас съела медведица.",
  image: "images/bear.jpg",
  options: [
    {
      text: "Начать заново",
      nextScene: "start",
      resetGame: true // Специальный флаг для перезапуска игры
    }
  ]
},
  end: {
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

  if (option.resetGame) {
    // Сброс статов к начальным значениям
    stats = {
      Здоровье: 100,
      Настроение: 0,
      Деньги: 0
    };
  } else if (option.changes) {
    // Изменение статов как обычно
    for (let key in option.changes) {
      stats[key] += option.changes[key];
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
      const li = document.createElement("li");
      li.textContent = `${key}: ${stats[key]}`;
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
