
var STATE = {
  tableEditFlag: false,
  tableRowEditIndex: null,
  oldCellData: null, // объект для хранения бэкапа данных из строки таблицы, которая в режиме редактирования
  fieldsCellNames: ['id', 'userDisabled', 'userName', 'userCourse', 'userEmail', 'userRank'],
  editableTRID: 'editableTRID',
};


// document.addEventListener('DOMContentLoaded', handleAddStudentButtonClick);

document.getElementById('addUserButton').addEventListener('click', handleAddStudentButtonClick);
document.getElementById('userRank').addEventListener('change', handleRankChange);
// document.querySelector('body').addEventListener('click', handleBodyClick);


addHandlersToTableRows();

// функция-контейнер, которая будет вызываться сразу при после подгрузки таблицы и добавлять
// обработчики события для всех строк таблицы (на событие click)
// таким образом если кликнуть на строку, тогда у нас запустится механизм редактирования строки таблицы
function addHandlersToTableRows() {
  // получили доступ к таблице
  var table = document.getElementById('usersList');
  // получили доступ к телу таблице
  var tbody = table.querySelector('tbody');

  // получили список - коллекция всех детей из tbody (это будут все теги <tr>)
  var allTRs = tbody.children;



  for(var i = 0; i < allTRs.length; i++ ) {
    // получили доступ к конкретной строке из массива всех детей (строк <tr>)
    var oneTR = allTRs[ i ];
    // добавить для строки прослушиватель события cick - т.е. когда кликнут будет вызвана функция из второго параметра
    oneTR.addEventListener('click', handleTRClick);
  }

}

// обработчик события при клике на ячейку таблицы
function handleTRClick(e) {
  // получить доступ к TR, по которой кликнули
  var currentElement = e.currentTarget;

  insertSaveCancelControls(currentElement);

  // мы узнаем - может быть ранее уже был прописан данный css-класс для строки таблицы
  // если был прописан, значит поля для ввода уже имеются
  // и нам не нужно устанавливать эти поля заново
  // следовательно нам просто нужно выйти из этой функции
  //if (Array.from(currentElement.classList).includes('editable')) {
  if (STATE.tableEditFlag) {
    return null;
  }

  // устанавливаем флаг редактирвоания таблицы в значение TRUE
  STATE.tableEditFlag = true;

  // добавить css-класс, который отменяет желтый фон при onMouseOver
  currentElement.classList.add('editable');

  // получить массив всех детей строки, т.е это будут все ячейки <td> внутри строки
  var allTDs = currentElement.children;

  for(var i = 0; i < allTDs.length; i++ ) {
    // получить доступ к конкретной ячейке из массива всех ячеек строки
    var oneTD = allTDs[ i ];

    if (!i) {
      STATE.tableRowEditIndex = +oneTD.innerText - 1;
    }

    var textData = '';

    // получили доступ к иконке юзера (отчислен/не отчислен)
    var iconUserDisabled = oneTD.querySelector('i');

    // проверяем, если это ячейка содержит иконку (отчислен/не отчислен)
    if (iconUserDisabled) {
      var userDisabledValue = Array.from(iconUserDisabled.classList).includes('text-danger');
      createSelectForTableCell(oneTD, userDisabledValue);
      saveBackupData(i, userDisabledValue);
    } else {
      textData = oneTD.innerText;
      createInputForTableCell(oneTD, textData)
      saveBackupData(i, textData);
    }
  }
}

// функция, которая сохраняет данные из ячеек в глобальный объект STATE
// для того, чтобы сохранить бэкап данных строки таблицы, на случай отмены редактирования
function saveBackupData(index, cellData) { // индекс ячейки (порядковый номер столбца) и текст из ячейки

  var oldCellData = STATE.oldCellData || {};
  // альтернатива записи
  // if (STATE.oldCellData) { oldCellData = STATE.oldCellData; }
  // else { oldCellData = {}; }
  var field = STATE.fieldsCellNames[ index ];
  oldCellData[ field ] = cellData;
  // oldCellData.userName = cellData
  // oldCellData.userEmail = cellData
  STATE.oldCellData = oldCellData;
  // более короткая альтернатива
  // STATE.oldCellData = oldCellData[ (STATE.fieldsCellNames[ index ]) ] = cellData;
}

// создать поле для ввода данных и добавить его к родителю (в ячейку)
function createInputForTableCell(parent, text) {
  // создать тег <input>
  var input = document.createElement('input');

  // устанавливаем для тега <input> атрибут type и записываем в этот атрибут значение text
  input.setAttribute('type', 'text');

  // добавить css-класс для нашего поля для ввода
  input.className = 'form-control';

  // установить значение для поля для ввода, тот самый текст, который
  input.value = text;

  // сначала у родителя убиваем всех "детей" (html теги внутри родителя)
  parent.innerHTML = '';
  // добавляем в ячейку (к родителю) наш только что созданный инпут
  parent.appendChild(input);
}


// создать поле SELECT для того чтобы задавать значенеи студент отчислен или не отчислен
// и добавить его к родителю (в ячейку)
function createSelectForTableCell(parent, value) {
  // создать тег <select>
  var select = document.createElement('select');

  var option1 = document.createElement('option');
  var option2 = document.createElement('option');

  // добавить css-класс для нашего поля для ввода
  select.className = 'form-control';

  select.style.width = '130px';

  // сначала у родителя убиваем всех "детей" (html теги внутри родителя)
  parent.innerHTML = '';
  // добавляем в ячейку (к родителю) наш только что созданный инпут
  parent.appendChild(select);

  select.appendChild(option1);
  select.appendChild(option2);

  option1.innerText = 'отчислен';
  option2.innerText = 'учится';

  option1.setAttribute('value', 'отчислен');
  option2.setAttribute('value', 'учится');

  if (value === true) { // если студент отчислен
    option1.setAttribute('selected', 'true');
  } else  { // если студент учится
    option2.setAttribute('selected', 'true');
  }




}


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


  insertRowToTable(data);

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



function insertRowToTable(data) {
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
  var ms = STATE.fieldsCellNames;

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


function handleBodyClick(e) {

  var body = document.querySelector('body');

  var currentElement = e.target;

  console.log("handleBodyClick",currentElement, currentElement.parentElement, body );

  if (currentElement.parentElement === body) {
    console.log("Кликнули по container");
  }


  STATE.tableEditFlag = false;
  STATE.tableRowEditIndex = null;
}

// функция добавляет новую строку с контролами для Сохранить/Отмена редактирования
function insertSaveCancelControls(previousTR) {

  if (STATE.tableEditFlag) {
    return null;
  }

  // создать строку для таблицы - теш <tr>
  var newTR = document.createElement('tr');
  // прописать этому тегу css-класс editable, чтобы он не подкрашивался желтым фоном
  newTR.className = 'editable';
  // создать атрибут ID для тега, чтобы в дальнейшем мы его могли "разыскать" через getElementById
  newTR.setAttribute('id', STATE.editableTRID);

  // внутри создаем теги <td> - ячейка и внутри ячейки кнопку
  newTR.innerHTML = '<td colspan="6" align="center">' +
    '<button class="btn btn-outline-info btn-sm">сохранить</button>' +
    '<button onclick="cancelEdit()" class="btn btn-outline-secondary btn-sm btn-space">отмена</button>' +
    '<button class="btn btn-outline-danger btn-sm btn-space">удалить</button></td>';
  // parent - это контейнер-родитель для previousTR - т.е. для строки по которой кликнули "редактировать"
  // нужен он для того, чтобы через него вставить новую строку (тег <tr> выше созданный и хранящийся
  // в переменной newTR
  var parent = previousTR.parentElement;

  // insertBefore - вставляет новую строку (newTR) в таблицу, перед строкой previousTR.nextSibling
  parent.insertBefore(newTR, previousTR.nextSibling);
}

function cancelEdit() {

  // получили доступ к строке, в которой хранятся все кнопки (сохранить/отмена/удалить)
  var editControls = document.getElementById( STATE.editableTRID);
  var parent = editControls.parentElement;

  // удалить строку с кнопками (сохранить/отмена/удалить)
  parent.removeChild(editControls)

  var editableTR = parent.querySelector('.editable');

  insertInforToTr(STATE.oldCellData, editableTR);

}

// функция, вставляет информацию из объекта (1й параметр) в строку таблицы
function insertInforToTr(values, trToOperate) {

  var TRChilds = trToOperate.children;

  // fieldsCellNames

  for(var i = 0; i < TRChilds.length; i++ ) {
    var oneCell = TRChilds [ i ];
    oneCell.innerHTML = '';

    var field = STATE.fieldsCellNames[ i ];
    var textData = values[ field ];

    if (field === 'userDisabled') {
      var icon = document.createElement('i');
      icon.className = 'fas fa-user text-' + (textData ? 'danger' : 'success');
      oneCell.appendChild(icon);
    } else {
      oneCell.innerText = textData;
    }
  }

}
