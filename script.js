// Характеристики персонажа
let stats = {
    Здоровье: 100,
    Удача: 50,
    Деньги: 0
  };
  
  // Объект сцены
  const scenes = {
  start: {
    text: "Вы оказались в темном лесу. Куда пойдете?",
    image: "images/start.jpg", // Путь к картинке
    options: [
      { text: "Направо", nextScene: "right", changes: { Удача: +10 } },
      { text: "Налево", nextScene: "left", changes: { Здоровье: -20 } }
    ]
  },
  right: {
    text: "Вы нашли сундук с золотом!",
    image: "images/right.jpg",
    options: [{ text: "Забрать всё", nextScene: "end", changes: { Деньги: +100 } }]
  },
  left: {
    text: "Вас съела медведица.",
    image: "images/bear.jpg",
    options: []
  },
  end: {
    text: "Спасибо за игру!",
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

      if (option.changes) {
        for (let key in option.changes) {
          stats[key] += option.changes[key];
        }
      }

      currentSceneId = option.nextScene;
      showScene(option.nextScene);
      updateHistoryDisplay();
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
  
  // Запуск игры
  showScene(currentSceneId);
  updateHistoryDisplay();
  updateStatsDisplay();