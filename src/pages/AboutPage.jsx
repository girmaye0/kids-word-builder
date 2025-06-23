import React from "react";
import styles from "../App.module.css";

function AboutPage() {
  return (
    <div className={styles.aboutPage}>
      <h2>About "WordWonder" App!</h2>
      <p>
        Welcome to the **WordWonder** app! This special tool is designed to make
        learning new words fun and easy for first graders. It helps children
        practice reading, spelling, and remembering new vocabulary in an
        exciting way!
      </p>

      <h3>How Does This App Help Kids Learn?</h3>
      <p>
        The app allows kids to build their own collection of words. They can add
        new words they want to learn, mark words they've mastered, and even
        practice spelling. It's like having a personalized word notebook, but on
        a computer!
      </p>

      <h3>Behind the Scenes: How I Built This Fun App!</h3>
      <p>
        This app is built using some clever tools that help me create
        interactive and friendly experiences:
      </p>

      <h4>1. React: The Building Blocks!</h4>
      <p>
        I use something called **React** to put all the pieces of the app
        together, like building with LEGOs! Each part of the app, like the word
        list or the "add word" box, is a small building block called a
        "component."
      </p>

      <h4>2. Firebase Authentication: Your Secret Key!</h4>
      <p>
        To keep your words safe and private, I use **Firebase Authentication**.
        This is like a special key that lets only you see and manage your words.
        You can sign up with your email and password, and the app remembers you!
        It makes sure your words are just for you.
      </p>

      <h4>3. Firestore: Our Magic Word Notebook!</h4>
      <p>
        To remember all the wonderful words kids add, I use **Firestore**. Think
        of it as a super-smart, cloud-based notebook where all the words are
        safely stored and linked to your secret key (your account)! This means
        words won't disappear, and you can even access them from different
        devices once you log in!
      </p>

      <h4>4. Routing: Finding Our Way Around!</h4>
      <p>
        Just like finding different rooms in a house, **routing** helps me move
        between the "Word List" page and the "About" page seamlessly. It makes
        sure kids can easily navigate without getting lost.
      </p>

      <h4>5. Smart Styling!</h4>
      <p>
        I use special styling techniques to make the app colorful, with rounded
        corners, and easy-to-read text. This makes the app inviting and simple
        for young learners to use.
      </p>

      <p>
        I hope your child enjoys building their vocabulary with the
        **WordWonder** app! It's a great example of how technology can make
        learning an adventure.
      </p>
    </div>
  );
}

export default AboutPage;
