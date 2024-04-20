import React, { Component } from "react";
import "./Home.css";

class Home extends Component {
  render() {
    return (
      <div className="home-container">
        <div className="home-container-img">
          {/* <img   img src={RealEstate} alt="real-estate"></img> */}
          <div class="hero" id="home">
            <div class="content">
              <div class="content-division-left">
                <h1>
                    <span>MANZANAQUE </span>LTD.
                    </h1>
                    <p>
                    Thank you for joining us. Manzanaque is the big real estate company. Explore our Property and enjoy a wonderful experience.
                    </p>
                {/* <a href="donation" class="cta">
                  Donate
                </a> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
