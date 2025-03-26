import React from 'react';
import splashImage from '/splash-image.jpg';

function LandingPage() {
  return (
    <>
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-8 text-center">
            <img src={splashImage} alt="Splash Image" className="img-fluid w-75" />
            <h1 className="mt-5">Your Honey-DO list</h1>
          </div>
        </div>
      </div>
    </>
  );
}

export default LandingPage;