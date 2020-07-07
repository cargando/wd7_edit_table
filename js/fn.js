
// document.addEventListener('DOMContentLoaded', handleAddStudentButtonClick);

document.getElementById('addUserButton').addEventListener('click', handleAddStudentButtonClick);


function handleAddStudentButtonClick(e) {
  e.preventDefault();

  var data = {
    userName: document.getElementById('userName').value,
    userEmail: document.getElementById('userEmail').value,
    userCourse: document.getElementById('userCourse').value,
    userRank: document.getElementById('userRank').value,
    userDisabled: document.getElementById('userDisabled').checked,
  }

  if(!data.userName.length || data.userName.trim().length) { // мы тут спрашиваем - если ничего не ввели, или ввели что-то но там сплошные пробелы или таб
    var name = document.getElementById('userName');

    name.classList.add('is-invalid');
    // name.parentElement.querySelector('small').style.display = 'block';

    name.parentElement.querySelector('small').removeAttribute('hidden');
  }

  console.log("User Data", data);
  // userName userEmail userCourse userRank userDisabled

}
