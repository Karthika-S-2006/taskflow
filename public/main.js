
import { auth, db } from './js/firebase-config.js';
import { login, logout, signup } from './js/auth.js';

const app = document.getElementById('app');

const routes = {
  '/': 'views/admin-login.html',
  '/staff-login': 'views/staff-login.html',
  '/admin-dashboard': 'views/admin-dashboard.html',
  '/staff-dashboard': 'views/staff-dashboard.html',
  '/change-password': 'views/change-password.html',
};

const navigateTo = (hash) => {
  window.location.hash = hash;
};

const router = async () => {
  const path = window.location.hash.slice(1) || '/';
  const route = routes[path];

  if (route) {
    const response = await fetch(route);
    const html = await response.text();
    app.innerHTML = html;
    addEventListeners(path);
  } else {
    app.innerHTML = '<h1>404 Not Found</h1>';
  }
};

const addEventListeners = (path) => {
  if (path === '/') {
    const adminLoginForm = document.getElementById('admin-login-form');
    if (adminLoginForm) {
      adminLoginForm.addEventListener('submit', handleAdminLogin);
    }
  } else if (path === '/staff-login') {
    const staffLoginForm = document.getElementById('staff-login-form');
    const staffSignupForm = document.getElementById('staff-signup-form');
    const showSignup = document.getElementById('staff-signup-link');
    const showLogin = document.getElementById('staff-login-link');

    if (staffLoginForm) {
      staffLoginForm.addEventListener('submit', handleStaffLogin);
    }
    if (staffSignupForm) {
      staffSignupForm.addEventListener('submit', handleStaffSignup);
    }
    if (showSignup) {
      showSignup.addEventListener('click', () => {
        document.getElementById('staff-login-container').style.display = 'none';
        document.getElementById('staff-signup-container').style.display = 'block';
      });
    }
    if (showLogin) {
      showLogin.addEventListener('click', () => {
        document.getElementById('staff-signup-container').style.display = 'none';
        document.getElementById('staff-login-container').style.display = 'block';
      });
    }
  } else if (path === '/admin-dashboard') {
    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
      logoutButton.addEventListener('click', () => {
        logout().then(() => navigateTo('/'));
      });
    }
    initAdminDashboard();
  } else if (path === '/staff-dashboard') {
    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
      logoutButton.addEventListener('click', () => {
        logout().then(() => navigateTo('/'));
      });
    }
    initStaffDashboard();
  } else if (path === '/change-password') {
    const changePasswordForm = document.getElementById('change-password-form');
    if (changePasswordForm) {
      changePasswordForm.addEventListener('submit', handleChangePassword);
    }
  }
};

const handleAdminLogin = async (e) => {
  e.preventDefault();
  const username = document.getElementById('admin-username').value;
  const password = document.getElementById('admin-password').value;

  try {
    const usernameDoc = await db.collection('usernames').doc(username).get();
    if (!usernameDoc.exists) {
      alert('Username not found');
      return;
    }
    const uid = usernameDoc.data().uid;
    const userDoc = await db.collection('users').doc(uid).get();
    const email = userDoc.data().email;
    await login(email, password);
    if (userDoc.data().isDefaultPassword) {
      navigateTo('/change-password');
    } else {
      navigateTo('/admin-dashboard');
    }
  } catch (error) {
    alert(error.message);
  }
};

const handleStaffLogin = async (e) => {
  e.preventDefault();
  const username = document.getElementById('staff-username').value;
  const password = document.getElementById('staff-password').value;

  try {
    const usernameDoc = await db.collection('usernames').doc(username).get();
    if (!usernameDoc.exists) {
      alert('Username not found');
      return;
    }
    const uid = usernameDoc.data().uid;
    const userDoc = await db.collection('users').doc(uid).get();
    const email = userDoc.data().email;
    await login(email, password);
    navigateTo('/staff-dashboard');
  } catch (error) {
    alert(error.message);
  }
};

const handleStaffSignup = async (e) => {
  e.preventDefault();
  const username = document.getElementById('signup-username').value;
  const password = document.getElementById('signup-password').value;

  try {
    const usernameDoc = await db.collection('usernames').doc(username).get();
    if (usernameDoc.exists) {
      alert('Username already taken');
      return;
    }

    const email = `${username.replace(/\s+/g, '').toLowerCase()}@taskflow.app`;
    const userCredential = await signup(email, password);
    const user = userCredential.user;

    await db.collection('users').doc(user.uid).set({
      username,
      email,
      role: 'staff',
    });

    await db.collection('usernames').doc(username).set({
      uid: user.uid,
    });

    navigateTo('/staff-dashboard');
  } catch (error) {
    alert(error.message);
  }
};

const handleChangePassword = async (e) => {
  e.preventDefault();
  const newPassword = document.getElementById('new-password').value;
  const confirmPassword = document.getElementById('confirm-password').value;

  if (newPassword !== confirmPassword) {
    alert('Passwords do not match');
    return;
  }

  try {
    const user = auth.currentUser;
    await user.updatePassword(newPassword);
    await db.collection('users').doc(user.uid).update({
      isDefaultPassword: false,
    });
    alert('Password updated successfully');
    navigateTo('/admin-dashboard');
  } catch (error) {
    alert(error.message);
  }
};

const initAdminDashboard = () => {
  const addRoomForm = document.getElementById('add-room-form');
  const addTaskTypeForm = document.getElementById('add-task-type-form');
  const assignTaskForm = document.getElementById('assign-task-form');

  addRoomForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const newRoomNumber = document.getElementById('new-room-number').value;
    await db.collection('rooms').add({ number: newRoomNumber });
    addRoomForm.reset();
  });

  addTaskTypeForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const newTaskType = document.getElementById('new-task-type').value;
    await db.collection('taskTypes').add({ name: newTaskType });
    addTaskTypeForm.reset();
  });

  assignTaskForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const roomNumber = document.getElementById('task-room-number').value;
    const taskName = document.getElementById('task-name').value;
    const assignedTo = document.getElementById('task-assign-to').value;
    const description = document.getElementById('task-description').value;

    await db.collection('tasks').add({
      roomNumber,
      taskName,
      assignedTo,
      description,
      status: 'pending',
      createdBy: auth.currentUser.uid,
      timeCreated: firebase.firestore.FieldValue.serverTimestamp(),
    });
    assignTaskForm.reset();
  });

  // Populate dropdowns
  populateSelect('rooms', 'task-room-number', 'number');
  populateSelect('taskTypes', 'task-name', 'name');
  populateSelect('users', 'task-assign-to', 'username', (ref) => ref.where('role', '==', 'staff'));

  // Real-time task lists
  createTaskList('pending-task-list', (ref) => ref.where('status', '==', 'pending'));
  createTaskList('ongoing-task-list', (ref) => ref.where('status', '==', 'in_progress'));
  createTaskList('completed-task-list', (ref) => ref.where('status', '==', 'completed'));

    // Populate lists
    populateList('room-list', 'rooms', 'number');
    populateList('task-type-list', 'taskTypes', 'name');
};

const initStaffDashboard = () => {
  const user = auth.currentUser;
  if (user) {
    db.collection('users').doc(user.uid).get().then(doc => {
      document.getElementById('staff-username-display').textContent = doc.data().username;
    });

    createStaffTaskList('new-task-list', 'pending', user.uid, 'Start Task', 'in_progress');
    createStaffTaskList('my-ongoing-task-list', 'in_progress', user.uid, 'Complete Task', 'completed');
  }
};

const createStaffTaskList = (elementId, status, userId, buttonText, newStatus) => {
  const list = document.getElementById(elementId);
  db.collection('tasks')
    .where('assignedTo', '==', userId)
    .where('status', '==', status)
    .onSnapshot((snapshot) => {
      list.innerHTML = '';
      snapshot.forEach((doc) => {
        const item = document.createElement('li');
        const task = doc.data();
        item.textContent = `${task.taskName} - Room ${task.roomNumber}`;

        const actionButton = document.createElement('button');
        actionButton.textContent = buttonText;
        actionButton.onclick = () => {
          db.collection('tasks').doc(doc.id).update({ status: newStatus });
        };

        item.appendChild(actionButton);
        list.appendChild(item);
      });
    });
};

const populateSelect = (collection, elementId, field, queryFn) => {
  const select = document.getElementById(elementId);
  let ref = db.collection(collection);
  if (queryFn) {
    ref = queryFn(ref);
  }
  ref.onSnapshot((snapshot) => {
    select.innerHTML = '';
    snapshot.forEach((doc) => {
      const option = document.createElement('option');
      option.value = doc.id;
      option.textContent = doc.data()[field];
      select.appendChild(option);
    });
  });
};

const createTaskList = (elementId, queryFn) => {
  const list = document.getElementById(elementId);
  let ref = db.collection('tasks');
  if (queryFn) {
    ref = queryFn(ref);
  }
  ref.onSnapshot((snapshot) => {
    list.innerHTML = '';
    snapshot.forEach((doc) => {
      const item = document.createElement('li');
      const task = doc.data();
      item.textContent = `${task.taskName} - Room ${task.roomNumber}`;

      const cancelButton = document.createElement('button');
      cancelButton.textContent = 'Cancel';
      cancelButton.onclick = () => {
        db.collection('tasks').doc(doc.id).update({ status: 'cancelled' });
      };

      item.appendChild(cancelButton);
      list.appendChild(item);
    });
  });
};

const populateList = (elementId, collection, field) => {
    const list = document.getElementById(elementId);
    db.collection(collection).onSnapshot(snapshot => {
        list.innerHTML = '';
        snapshot.forEach(doc => {
            const item = document.createElement('li');
            item.textContent = doc.data()[field];
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.onclick = () => {
                db.collection(collection).doc(doc.id).delete();
            };
            item.appendChild(deleteButton);
            list.appendChild(item);
        });
    });
};


window.addEventListener('hashchange', router);
window.addEventListener('load', router);
