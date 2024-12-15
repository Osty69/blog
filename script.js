const form = document.getElementById('article-form')
const articlesDiv = document.getElementById('articles')
const titleInput = document.getElementById('title')
const contentInput = document.getElementById('content')
const imageInput = document.getElementById('image')
const articleIdInput = document.getElementById('article-id')
const fileNameDisplay = document.getElementById('file-name')

let articles = []

// Загрузка статей из LocalStorage
function loadArticles() {
	const savedArticles = localStorage.getItem('articles')
	if (savedArticles) {
		articles = JSON.parse(savedArticles)
	}
	renderArticles()
}

// Сохранение статей в LocalStorage
function saveArticles() {
	localStorage.setItem('articles', JSON.stringify(articles))
}

function renderArticles() {
	articlesDiv.innerHTML = ''
	articles.forEach((article, index) => {
		const articleDiv = document.createElement('div')
		articleDiv.className = 'article'

		// Создание элемента с временем
		const time = document.createElement('div')
		time.className = 'article-time'
		time.textContent = `Опубликовано: ${article.date}`

		const title = document.createElement('h3')
		title.textContent = article.title

		const content = document.createElement('p')
		content.innerHTML = article.content // Используем innerHTML для сохранения форматирования

		const image = document.createElement('img')
		if (article.image) {
			image.src = article.image
			image.alt = 'Изображение статьи'
		}

		const buttonsDiv = document.createElement('div')
		buttonsDiv.className = 'buttons'

		const editButton = document.createElement('button')
		editButton.textContent = 'Редактировать'
		editButton.onclick = () => editArticle(index)

		const deleteButton = document.createElement('button')
		deleteButton.textContent = 'Удалить'
		deleteButton.className = 'delete'
		deleteButton.onclick = () => deleteArticle(index)

		buttonsDiv.appendChild(editButton)
		buttonsDiv.appendChild(deleteButton)

		// Добавляем элементы в нужном порядке
		articleDiv.appendChild(time) // Добавляем время сверху
		articleDiv.appendChild(title)
		articleDiv.appendChild(content)
		if (article.image) {
			articleDiv.appendChild(image)
		}
		articleDiv.appendChild(buttonsDiv)

		articlesDiv.appendChild(articleDiv)
	})
}

// Добавление или обновление статьи
form.addEventListener('submit', e => {
	e.preventDefault()

	const title = titleInput.value.trim()
	const content = contentInput.value.trim()
	const articleId = articleIdInput.value

	const date = new Date()
	const formattedDate = `${date.getDate().toString().padStart(2, '0')}.${(
		date.getMonth() + 1
	)
		.toString()
		.padStart(2, '0')}.${date.getFullYear()} ${date
		.getHours()
		.toString()
		.padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`

	let imageUrl = null
	if (imageInput.files.length > 0) {
		const file = imageInput.files[0]
		imageUrl = URL.createObjectURL(file)
	}

	if (articleId) {
		// Обновить существующую статью
		articles[articleId] = {
			title,
			content,
			image: imageUrl,
			date: formattedDate,
		}
		articleIdInput.value = '' // Очистить скрытое поле
	} else {
		// Добавить новую статью
		articles.push({ title, content, image: imageUrl, date: formattedDate })
	}

	// Очистить форму
	form.reset()

	// Очистить отображение имени файла
	fileNameDisplay.textContent = 'Файл не выбран'

	saveArticles() // Сохранить статьи в LocalStorage
	renderArticles()
})

// Отображение названия выбранного файла
imageInput.addEventListener('change', () => {
	const fileName = imageInput.files[0]?.name || 'Файл не выбран'
	fileNameDisplay.textContent = fileName
})

// Редактирование статьи
function editArticle(index) {
	const article = articles[index]
	titleInput.value = article.title
	contentInput.value = article.content
	articleIdInput.value = index
}

// Удаление статьи с анимацией
function deleteArticle(index) {
	const articleDiv = articlesDiv.children[index]

	// Добавляем класс для анимации
	articleDiv.classList.add('deleting')

	// Ждем завершения анимации перед удалением
	setTimeout(() => {
		articles.splice(index, 1) // Удаляем статью из массива
		saveArticles() // Сохраняем изменения в LocalStorage
		renderArticles() // Перерисовываем статьи
	}, 500) // Тайм-аут соответствует времени анимации (0.5s)
}

// Первоначальная загрузка статей
loadArticles()
