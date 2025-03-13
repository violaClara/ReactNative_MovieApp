# ReactNative_MovieApp
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>MoviePlus</title>
    <style>
      /* Global Styles */
      body {
        font-family: 'Poppins', sans-serif;
        margin: 0;
        padding: 0;
        background-color: #f4f4f4;
        line-height: 1.6;
      }
      .container {
        max-width: 900px;
        margin: 30px auto;
        background: #fff;
        padding: 20px 40px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      }
      header {
        background-color: #4c1d95;
        color: #fff;
        padding: 30px 0;
        text-align: center;
      }
      header h1 {
        margin: 0;
        font-size: 3em;
      }
      h2 {
        color: #4c1d95;
        border-bottom: 2px solid #4c1d95;
        padding-bottom: 5px;
      }
      ul {
        list-style: none;
        padding: 0;
      }
      ul li {
        background: #e2e2e2;
        margin: 8px 0;
        padding: 10px;
        border-radius: 4px;
      }
      pre {
        background: #333;
        color: #fff;
        padding: 10px;
        overflow-x: auto;
        border-radius: 4px;
      }
      a.btn {
        display: inline-block;
        background: linear-gradient(to right, #3b82f6, #8b5cf6);
        color: #fff;
        padding: 10px 20px;
        text-decoration: none;
        border-radius: 5px;
        margin-top: 15px;
      }
      .screenshot img {
        max-width: 100%;
        margin: 10px 0;
        border: 1px solid #ddd;
        border-radius: 4px;
      }
      footer {
        text-align: center;
        font-size: 0.9em;
        color: #777;
        margin-top: 40px;
      }
    </style>
  </head>
  <body>
    <header>
      <h1>MoviePlus</h1>
      <p>The Ultimate Movie App Experience</p>
    </header>

    <div class="container">
      <h2>Features</h2>
      <ul>
        <li>
          <strong>User Authentication:</strong> Login and Sign-Up screens with real-time validation powered by React Hook Form and Zod. Includes custom password toggle for enhanced usability.
        </li>
        <li>
          <strong>Movie Exploration:</strong> Browse trending movies with a full-screen carousel, detailed movie views complete with trailers (YouTube integration), ratings, cast info, and interactive dropdowns for crew details.
        </li>
        <li>
          <strong>Modern Design:</strong> Sleek UI using linear gradients, FontAwesome icons, and the elegant Poppins font for a consistent and visually appealing interface.
        </li>
      </ul>

      <h2>Screenshots</h2>
      <div class="screenshot">
        <img src="https://via.placeholder.com/300x600?text=Login+Screen" alt="Login Screen" />
        <img src="https://via.placeholder.com/300x600?text=Sign+Up+Screen" alt="Sign Up Screen" />
        <img src="https://via.placeholder.com/300x600?text=Home+Screen" alt="Home Screen" />
        <img src="https://via.placeholder.com/300x600?text=Movie+Details" alt="Movie Details" />
      </div>

      <h2>Getting Started</h2>
      <h3>Prerequisites</h3>
      <p>
        Ensure you have Node.js (v14 or later) and Expo CLI installed. A mobile device or emulator is required for testing.
      </p>

      <h3>Installation</h3>
      <p>Clone the repository and install dependencies:</p>
      <pre>
git clone https://github.com/yourusername/MoviePlus.git
cd MoviePlus
npm install
      </pre>

      <h3>Running the App</h3>
      <p>
        Start the Expo server and launch the app on your device or emulator:
      </p>
      <pre>
expo start
      </pre>

      <a class="btn" href="https://github.com/yourusername/MoviePlus">View Project on GitHub</a>

      <h2>Built With</h2>
      <ul>
        <li>React Native</li>
        <li>Expo</li>
        <li>React Navigation</li>
        <li>React Hook Form &amp; Zod</li>
        <li>Expo Linear Gradient</li>
        <li>FontAwesome</li>
      </ul>

      <h2>Contributing</h2>
      <p>
        Contributions are welcome! Fork the repository, create your feature branch, commit your changes, push, and open a pull request.
      </p>

      <h2>License</h2>
      <p>
        Distributed under the MIT License. See the <code>LICENSE</code> file for details.
      </p>

      <h2>Contact</h2>
      <p>
        Your Name – <a href="mailto:your.email@example.com">your.email@example.com</a> <br />
        Project Link: <a href="https://github.com/yourusername/MoviePlus">https://github.com/yourusername/MoviePlus</a>
      </p>

      <h2>Acknowledgements</h2>
      <p>
        Thanks to TMDB for movie data, Expo for the development platform, FontAwesome for icons, and all open-source contributors who made this project possible.
      </p>
    </div>

    <footer>
      <p>&copy; 2025 MoviePlus. All rights reserved.</p>
    </footer>
  </body>
</html>
