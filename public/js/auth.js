
import { auth, db } from "./firebase-config.js";

const navigateTo = (hash) => {
  window.location.hash = hash;
};

const setupUI = (user) => {
  if (user) {
    db.collection("users")
      .doc(user.uid)
      .get()
      .then((doc) => {
        if (doc.exists) {
          const userRole = doc.data().role;
          if (userRole === "admin") {
            navigateTo("admin-dashboard");
          } else {
            navigateTo("staff-dashboard");
          }
        }
      });
  } else {
    navigateTo("");
  }
};

auth.onAuthStateChanged((user) => {
  setupUI(user);
});

const login = (email, password) => {
  return auth.signInWithEmailAndPassword(email, password);
};

const logout = () => {
  return auth.signOut();
};

const signup = (email, password) => {
    return auth.createUserWithEmailAndPassword(email, password)
}

export { login, logout, signup, setupUI };
