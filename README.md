    Kids Word Builder App

Welcome to the Kids Word Builder app! This fun and interactive application is designed to help first graders build and learn new words. It provides a simple and engaging way for children to practice their vocabulary.

    Features

Add New Words: Easily add new words to the list.

Mark as Learned: Toggle words as "learned" to track progress.

Edit Words: Correct or update existing words.

Delete Words: Remove words from the list.

Search Functionality: Find specific words quickly.

Sorting Options: Sort words by their name or the time they were added.

Pagination: Navigate through long lists of words with ease.

Kid-Friendly UI: Bright, colorful, and intuitive interface.

      Installation

To get this app up and running on your local machine, follow these simple steps:

    Prerequisites

A Firebase project configured for Firestore and Authentication.

     Steps

Clone the Repository:

git clone <your-repository-url>
cd kids-word-builder

Install Dependencies:

npm install

Set up Environment Variables:
Create a .env file in the root directory of your project

VITE_FIREBASE_API_KEY="YOUR_FIREBASE_API_KEY"
VITE_FIREBASE_AUTH_DOMAIN="YOUR_FIREBASE_AUTH_DOMAIN"
VITE_FIREBASE_PROJECT_ID="YOUR_FIREBASE_PROJECT_ID"
VITE_FIREBASE_STORAGE_BUCKET="YOUR_FIREBASE_STORAGE_BUCKET"
VITE_FIREBASE_MESSAGING_SENDER_ID="YOUR_FIREBASE_MESSAGING_SENDER_ID"
VITE_FIREBASE_APP_ID="YOUR_FIREBASE_APP_ID"
VITE_MERRIAM_WEBSTER_API_KEY="YOUR_MERRIAM_WEBSTER_API_KEY"

Replace the placeholder values with your actual Firebase project configuration values.

Run the Application:

npm run dev

This will start the development server, and the app will usually open in your default browser at http://localhost:5173 (or another available port).

     User Guide (How to Use)

Once the app is running, you'll see the main Word List page.

Adding a Word:

At the top, you'll find an input field labeled "Word".

Type the new word you want to add.

Click the "Add Word" button. The word will appear in your list.

Marking a Word as Learned/Not Learned:

Each word in the list has a checkbox next to it.

Click on the checkbox to toggle whether the word is marked as "learned" (it will show a strikethrough).

Editing a Word:

Click on the word text itself. An input field will appear, allowing you to edit the word.

Type your changes.

Click the "Update" button to save, or "Cancel" to discard changes.

Deleting a Word:

Each word has a "Delete" button. Click it to remove the word permanently from your list.

Searching Words:

Use the "Search words" input field to filter the list. As you type, the list will automatically update to show only matching words.

Click the "Clear" button next to the search bar to remove the search filter.

Sorting Words:

Use the "Sort by" dropdown to choose how you want to sort the words (e.g., "Word" for alphabetical order, or "Time added").

Use the "Direction" dropdown to choose "Ascending" (A-Z, oldest first) or "Descending" (Z-A, newest first).

Navigating Pages:

If you have many words, they will be split into pages.

Use the "Previous" and "Next" buttons to move between pages. The current page number and total pages are displayed.

About Page:
Welcome to the WordWonder app! I designed this special tool to make learning new words fun and easy for first graders. It helps children practice reading, spelling, and remembering new vocabulary in an exciting way!

How Does This App Help Kids Learn?
I made the app to allow kids to build their own collection of words. They can add new words they want to learn, mark words they've mastered, and even practice spelling. It's like having a personalized word notebook, but on a computer!

Behind the Scenes: How I Built This Fun App!
I built this app using some clever tools that help me create interactive and friendly experiences:

1. React: The Building Blocks!
   I use something called React to put all the pieces of the app together, like building with LEGOs! Each part of the app, like the word list or the "add word" box, is a small building block called a "component."

2. Firebase Authentication: Your Secret Key!
   To keep your words safe and private, I use Firebase Authentication. This is like a special key that lets only you see and manage your words. You can sign up with your email and password, and the app remembers you! It makes sure your words are just for you.

3. Firestore: Our Magic Word Notebook!
   To remember all the wonderful words kids add, I use Firestore. Think of it as a super-smart, cloud-based notebook where all the words are safely stored and linked to your secret key (your account)! This means words won't disappear, and you can even access them from different devices once you log in!

4. Routing: Finding Our Way Around!
   Just like finding different rooms in a house, routing helps me move between the "Word List" page and the "About" page seamlessly. I made sure kids can easily navigate without getting lost.

5. Smart Styling!
   I use special styling techniques to make the app colorful, with rounded corners, and easy-to-read text. This makes the app inviting and simple for young learners to use.

I hope your child enjoys building their vocabulary with the WordWonder app! It's a great example of how technology can make learning an adventure.

Technologies Used
React: A JavaScript library for building user interfaces.

React Router DOM: For declarative routing in React applications.

Firebase: A Google platform providing backend services, including Firestore (NoSQL database) and Authentication.

CSS Modules: For component-scoped styling.

styled-components: For writing CSS-in-JS.

Merriam-Webster Collegiate Dictionary API: Used for real-time spell-checking during word creation.
