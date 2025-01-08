import "../styles.css";

function HomePage() {
  return (
    <div className="home-page">
      {/* Centered Text at the Top */}
      <div className="centered-text">
        <p className="welcome-text">Welcome to the Book App For Kids!</p>
        <p className="explore-text">Explore and save books.</p>
      </div>

      {/* Quote in the Clear Space */}
      <p className="quote-text">
        "The more that you read, the more things you will know. The more you learn, the more places you’ll go." — Dr. Seuss
      </p>
    </div>
  );
}

export default HomePage;



