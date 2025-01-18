const form = document.getElementById('article-form')
const articlesDiv = document.getElementById('articles')
const titleInput = document.getElementById('title')
const contentInput = document.getElementById('content')
const imageInput = document.getElementById('image')
const articleIdInput = document.getElementById('article-id')
const fileNameDisplay = document.getElementById('file-name')

let articles = []

//загрузка статей из LocalStorage
function loadArticles() {
	const savedArticles = localStorage.getItem('articles')
	if (savedArticles) {
		articles = JSON.parse(savedArticles)
	}
	renderArticles()
}

//сохранение статей в LocalStorage
function saveArticles() {
	localStorage.setItem('articles', JSON.stringify(articles))
}

function convertToBase64(file) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => resolve(reader.result);
		reader.onerror = () => reject(new Error('Ошибка чтения файла'));
		reader.readAsDataURL(file); // читает файл и конвертирует в Base64
	});
}


function renderArticles() {
	articlesDiv.innerHTML = '';
	articles.forEach((article, index) => {
		const articleDiv = document.createElement('div');
		articleDiv.className = 'article';

		const time = document.createElement('div');
		time.className = 'article-time';
		time.textContent = `Опубликовано: ${article.date}`;

		const title = document.createElement('h3');
		title.textContent = article.title;

		const content = document.createElement('p');
		content.innerHTML = article.content;

		const image = document.createElement('img');
		if (article.image) {
			image.src = article.image; // строка Base64 
			image.alt = 'Изображение статьи';
		}

		const buttonsDiv = document.createElement('div');
		buttonsDiv.className = 'buttons';

		const editButton = document.createElement('button');
		editButton.textContent = 'Редактировать';
		editButton.onclick = () => editArticle(index);

		const deleteButton = document.createElement('button');
		deleteButton.textContent = 'Удалить';
		deleteButton.className = 'delete';
		deleteButton.onclick = () => deleteArticle(index);

		buttonsDiv.appendChild(editButton);
		buttonsDiv.appendChild(deleteButton);

		articleDiv.appendChild(time);
		articleDiv.appendChild(title);
		articleDiv.appendChild(content);
		if (article.image) {
			articleDiv.appendChild(image);
		}
		articleDiv.appendChild(buttonsDiv);

		articlesDiv.appendChild(articleDiv);
	});
}


//добавление или обновление статьи
form.addEventListener('submit', async e => {
	e.preventDefault();

	const title = titleInput.value.trim();
	const content = contentInput.value.trim();
	const articleId = articleIdInput.value;

	const date = new Date();
	const formattedDate = `${date.getDate().toString().padStart(2, '0')}.${(
		date.getMonth() + 1
	).toString().padStart(2, '0')}.${date.getFullYear()} ${date
		.getHours()
		.toString()
		.padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;

	let imageUrl = null;
	if (imageInput.files.length > 0) {
		const file = imageInput.files[0];
		imageUrl = await convertToBase64(file); // конвертируем в Base64
	}

	if (articleId) {
		//обновить существующую статью
		articles[articleId] = {
			title,
			content,
			image: imageUrl,
			date: formattedDate,
		};
		articleIdInput.value = ''; //очистить скрытое поле
	} else {
		// добавить новую статью
		articles.push({ title, content, image: imageUrl, date: formattedDate });
	}

	// очистить форму
	form.reset();

	//очистить отображение имени файла
	fileNameDisplay.textContent = 'Файл не выбран';

	saveArticles(); //сохранить статьи в LocalStorage
	renderArticles();
});


//отображение названия выбранного файла
imageInput.addEventListener('change', () => {
	const fileName = imageInput.files[0]?.name || 'Файл не выбран'
	fileNameDisplay.textContent = fileName
})

//редактирование статьи
function editArticle(index) {
	const article = articles[index]
	titleInput.value = article.title
	contentInput.value = article.content
	articleIdInput.value = index
}

//удаление статьи с анимацией
function deleteArticle(index) {
	const articleDiv = articlesDiv.children[index]

	//добавляем класс для анимации
	articleDiv.classList.add('deleting')

	//ждем завершения анимации перед удалением
	setTimeout(() => {
		articles.splice(index, 1) // удаляем статью из массива
		saveArticles() // сохраняем изменения в LocalStorage
		renderArticles() // перерисовываем статьи
	}, 500)
}

//первоначальная загрузка статей
loadArticles()
