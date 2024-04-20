import React from "react";
import ImageSlider from "./ImageSlider";
import "./aboutus.css";

class AboutUsComponent extends React.Component {
  constructor(props) {
    super(props);
    console.log(props);
  }

  render() {
    const slides = [
      { url: "http://localhost:3000/image-1.jpg", title: "beach" },
      { url: "http://localhost:3000/image-2.jpg", title: "boat" },
      { url: "http://localhost:3000/image-3.jpg", title: "forest" },
      { url: "http://localhost:3000/image-4.jpg", title: "city" },
      { url: "http://localhost:3000/image-5.jpg", title: "italy" },
    ];

    return (
      <div className="row">
        <h1 style={{ textAlign: "center" }}>ABOUT US</h1>
        <div className="aboutus-container">
          <ImageSlider slides={slides} />
          <div>
            <p
              style={{
                paddingTop: "20px",
                textAlign: "center",
                fontSize: "17px",
                fontFamily: "fantasy",
              }}
            >
              Manzanaque Helpdesk is your trusted support partner, <br />
              delivering top-notch assistance with a smile. With a dedicated
              team of experts, <br />
              we provide efficient solutions to your technical challenges,{" "}
              <br />
              ensuring seamless operations. Your satisfaction is our priority.{" "}
              <br />
              Welcome to a hassle-free helpdesk experience with Manzanaque!{" "}
              <br />
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default AboutUsComponent;
