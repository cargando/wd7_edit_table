
// document.addEventListener('DOMContentLoaded', handleAddStudentButtonClick);

document.getElementById('addUserButton').addEventListener('click', handleAddStudentButtonClick);
document.getElementById('userRank').addEventListener('change', handleRankChange);


function handleAddStudentButtonClick(e) {
  e.preventDefault();

  var data = {
    userName: document.getElementById('userName').value,
    userEmail: document.getElementById('userEmail').value,
    userCourse: document.getElementById('userCourse').value,
    userRank: transformToRank(document.getElementById('userRank').value),
    userDisabled: document.getElementById('userDisabled').checked,
  }

  if(!data.userName.length || !data.userName.trim().length) { // мы тут спрашиваем - если ничего не ввели, или ввели что-то но там сплошные пробелы или таб
    var name = document.getElementById('userName');
    name.classList.add('is-invalid');
    name.parentElement.querySelector('small').removeAttribute('hidden');
  }

  if(!data.userEmail.trim().length) { // мы тут спрашиваем - если ничего не ввели, или ввели что-то но там сплошные пробелы или таб
    var mail = document.getElementById('userEmail');
    mail.classList.add('is-invalid');
    mail.parentElement.querySelector('small').removeAttribute('hidden');
  }
  

  inserRowToTable(data);

  var formElement = e.target.closest('form')

  formElement.reset();

}

function createActiveUserIcon(parent, status) {
  // создать тег <i> - так прописываются иконки из fontawesome
  var icon = document.createElement('i');

  // вычислили css классы для иконки, а именно это либо text-success - для зеленой икони юзера
  // либо text-danger - для красной икони юзера
  var cssClasses = 'fas fa-user text-' + (status === true ? 'danger' : 'success');

  // установить классы для теги <i>
  icon.className = cssClasses;
  // icon.setAttribute('class', cssClasses); // альтернативный вариант добавления css-класса через атрибут тега

  // прикрепить иконку к родителю - ячейка из таблицы
  parent.appendChild(icon);
}



function inserRowToTable(data) {
  // получаем доступ к таблице
  var table = document.getElementById('usersList');
  // далле получаем доступ к телу таблицы - тег tbody
  var tbody = table.querySelector('tbody');

  // создаем новый тег <tr>
  var newTR = document.createElement('tr');

  // узнаем сколько всего на данный момент строк в таблице (именно внутри tbody)
  var totalRows = tbody.childElementCount;

  // добавляем новую строку (тег <tr>) внутрь нашей таблицы
  tbody.appendChild(newTR);

  // массив для обхода объекта с данными
  var ms = ['id', 'userDisabled', 'userName', 'userCourse', 'userEmail', 'userRank'];

  ms.forEach(function (val){
    var newTD = document.createElement('td');
    if (val === 'id') {
      newTD.innerText = totalRows + 1;
    } else if (val === 'userDisabled') {
      createActiveUserIcon(newTD, data[val]);
    } else {
      newTD.innerText = data[val];
    }

    newTR.appendChild(newTD);
  });

}

function transformToRank(val) {
  var onePercent = 5 / 100;
  var res = val * onePercent;
  return res.toFixed(2);
}

function handleRankChange(e) {
  var val = e.target.value;
  e.target.parentElement.querySelector('strong').innerText = transformToRank(val);

}
