//display login page differently
const userBtn = document.getElementById('user-btn');
const adminBtn = document.getElementById('admin-btn');
const userForm = document.getElementById('user-login');
const adminForm = document.getElementById('admin-login');

userBtn.addEventListener('click', (e) => {
  userForm.classList.remove('hidden');
  adminForm.classList.add('hidden');
});

adminBtn.addEventListener('click', (e) => {
  adminForm.classList.remove('hidden');
  userForm.classList.add('hidden');
  
});
