import React, { useState } from "react";
import styles from "./AuthForm.module.css";

function AuthForm({ onLogin, onSignup, onDismissError, authError }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoginMode, setIsLoginMode] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    onDismissError();
    if (isLoginMode) {
      await onLogin(email, password);
    } else {
      await onSignup(email, password);
    }
  };

  return (
    <div className={styles.authContainer}>
      <h2>{isLoginMode ? "Login" : "Sign Up"}</h2>
      <form onSubmit={handleSubmit} className={styles.authForm}>
        <div className={styles.formGroup}>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className={styles.inputField}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password (min 6 characters)"
            required
            minLength="6"
            className={styles.inputField}
          />
        </div>

        {authError && <p className={styles.errorMessage}>{authError}</p>}

        <div className={styles.buttonGroup}>
          <button type="submit" className={styles.authButton}>
            {isLoginMode ? "Login" : "Sign Up"}
          </button>
          <button
            type="button"
            onClick={() => {
              setIsLoginMode((prevMode) => !prevMode);
              setAuthError("");
              setEmail("");
              setPassword("");
            }}
            className={styles.toggleButton}
          >
            {isLoginMode
              ? "New user? Sign up!"
              : "Already have an account? Login!"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AuthForm;
