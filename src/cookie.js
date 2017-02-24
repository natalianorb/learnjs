/**
 * ДЗ 7.2 - Создать редактор cookie с возможностью фильтрации
 *
 * На странице должна быть таблица со списком имеющихся cookie:
 * - имя
 * - значение
 * - удалить (при нажатии на кнопку, выбранная cookie удаляется из браузера и таблицы)
 *
 * На странице должна быть форма для добавления новой cookie:
 * - имя
 * - значение
 * - добавить (при нажатии на кнопку, в браузер и таблицу добавляется новая cookie с указанным именем и значением)
 *
 * Если добавляется cookie с именем уже существующией cookie, то ее значение в браузере и таблице должно быть обновлено
 *
 * На странице должно быть текстовое поле для фильтрации cookie
 * В таблице должны быть только те cookie, в имени или значении которых есть введенное значение
 * Если в поле фильтра пусто, то должны выводиться все доступные cookie
 * Если дабавляемая cookie не соответсвуте фильтру, то она должна быть добавлена только в браузер, но не в таблицу
 * Если добавляется cookie, с именем уже существующией cookie и ее новое значение не соответствует фильтру,
 * то ее значение должно быть обновлено в браузере, а из таблицы cookie должна быть удалена
 *
 * Для более подробной информации можно изучить код тестов
 *
 * Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер
 */

/**
 * homeworkContainer - это контейнер для всех ваших домашних заданий
 * Если вы создаете новые html-элементы и добавляете их на страницу, то дабавляйте их только в этот контейнер
 *
 * @example
 * homeworkContainer.appendChild(...);
 */
let homeworkContainer = document.querySelector('#homework-container');
let filterNameInput = homeworkContainer.querySelector('#filter-name-input');
let addNameInput = homeworkContainer.querySelector('#add-name-input');
let addValueInput = homeworkContainer.querySelector('#add-value-input');
let addButton = homeworkContainer.querySelector('#add-button');
let listTable = homeworkContainer.querySelector('#list-table tbody');
const createCookie = require('./index').createCookie;
const deleteCookie = require('./index').deleteCookie;
function getCookies() {
    return document.cookie
        .split('; ')
        .filter(Boolean)
        .map(cookie => cookie.match(/^([^=]+)=(.+)/))
        .reduce((obj, [, name, value]) => {
            obj[name] = value;

            return obj;
        }, {});
}

/**
 * Функция должна проверять встречается ли подстрока chunk в строке full
 * Проверка должна происходить без учета регистра символов
 *
 * @example
 * isMatching('Moscow', 'moscow') // true
 * isMatching('Moscow', 'mosc') // true
 * isMatching('Moscow', 'cow') // true
 * isMatching('Moscow', 'SCO') // true
 * isMatching('Moscow', 'Moscov') // false
 *
 * @return {boolean}
 */
function isMatching(full, chunk) {
    full = full.toLowerCase();
    chunk = chunk.toLowerCase();

    return full.includes(chunk);
}

/**
 * Создает новый tr для таблицы со списком cookie
 *
 * @param name - имя cookie
 * @param value - значение cookie
 */
function createCookieTr(name, value) {
    let tr = document.createElement('tr');
    let nameTd = document.createElement('td');
    let tdValue = document.createElement('td');
    let tdButton = document.createElement('td');
    let removeButton  = document.createElement('button');


    nameTd.textContent = name;
    tdValue.textContent = value;
    removeButton.textContent = 'Удалить';
    removeButton.addEventListener('click', function (event) {
        let tr = event.target.closest('tr');
        let nameTd = tr.firstElementChild;

        deleteCookieTr(nameTd);
    });
    tdButton.appendChild(removeButton);

    tr.appendChild(nameTd);
    tr.appendChild(tdValue);
    tr.appendChild(tdButton);

    listTable.appendChild(tr);
}

function updateCookieTr(name, value) {
    let nameTd = findNametd(name);

    if (nameTd) {
        nameTd.nextElementSibling.textContent = value;
    } else {
        createCookieTr(name, value);
    }
}

function deleteCookieTr(nameTd) {
    let tr = nameTd.closest('tr');

    deleteCookie(nameTd.innerText);
    listTable.removeChild(tr);
}

function findNametd(name) {
    for (let tr of listTable.children) {
        if (tr.firstElementChild.innerText == name) {
            return tr.firstElementChild;
        }
    }

    return null;
}

function filter () {
    let value = filterNameInput.value.trim();
    let cookies = getCookies();

    listTable.innerHTML = null;
    if (value != '') {
        for (let key of Object.keys(cookies)) {
            if (isMatching(key, value) || isMatching(cookies[key], value)) {
                createCookieTr(key, cookies[key]);
            }
        }
    } else {
        for (let key of Object.keys(cookies)) {
            createCookieTr(key, cookies[key]);
        }
    }
}

filterNameInput.addEventListener('keyup', filter);

addButton.addEventListener('click', () => {
    let name = addNameInput.value.trim();
    let value = addValueInput.value.trim();
    let cookies = getCookies();

    createCookie(name, value);
    if (name in cookies) {
        updateCookieTr(name, value);
    } else {
        createCookieTr(name, value);
    }
    filter();

});


