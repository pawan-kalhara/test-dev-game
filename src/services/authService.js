/*
  Simulated User Service (Virtual Identity)
  Uses localStorage to simulate a database.
  WARNING: This is NOT secure and for prototype purposes only.
*/
const DB_USERS = 'monkey_game_users';
const DB_DATA = 'monkey_game_data';
const SESSION_KEY = 'monkey_game_session';

const getDb = (key) => JSON.parse(localStorage.getItem(key) || '{}');
const getSession = () => JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');

const commitUsers = (users) => localStorage.setItem(DB_USERS, JSON.stringify(users));
const commitData = (data) => localStorage.setItem(DB_DATA, JSON.stringify(data));
const commitSession = (user) => {
  if (user) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(SESSION_KEY);
  }
};

export const authService = {
  register(email, password) {
    return new Promise((resolve, reject) => {
      const users = getDb(DB_USERS);
      if (users[email]) {
        return reject(new Error("User already exists. Please login."));
      }
      
      // WARNING: Storing plaintext passwords. In a real app, you would hash this.
      users[email] = password;
      commitUsers(users);
      
      const data = getDb(DB_DATA);
      data[email] = { avatar: null, highScore: 0 };
      commitData(data);
      
      const newUser = { email, ...data[email] };
      commitSession(newUser);
      resolve(newUser);
    });
  },

  login(email, password) {
    return new Promise((resolve, reject) => {
      const users = getDb(DB_USERS);
      const storedPassword = users[email];
      
      if (!storedPassword || storedPassword !== password) {
        return reject(new Error("Invalid email or password."));
      }
      
      const data = getDb(DB_DATA);
      const userData = data[email] || { avatar: null, highScore: 0 };
      const user = { email, ...userData };
      commitSession(user);
      resolve(user);
    });
  },

  logout() {
    commitSession(null);
  },

  getCurrentUser() {
    return getSession();
  },

  saveUserData(email, data) {
    return new Promise((resolve) => {
      const allData = getDb(DB_DATA);
      allData[email] = data;
      commitData(allData);
      
      // Also update the active session
      const session = getSession();
      if (session && session.email === email) {
        commitSession({ email, ...data });
      }
      resolve(data);
    });
  }
};