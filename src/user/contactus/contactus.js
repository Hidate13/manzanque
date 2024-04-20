import React from "react";
import "../contactus/contuctus.css";

class ContactUsComponent extends React.Component {
  render() {
    return (
      <div className="row">
        <h2 style={{ textAlign: "center" }}> CONTACT US</h2>
        <div className="contactus-container">
          <div className="contactus-containe-left">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.7597106110584!2d103.88980307442712!3d1.3198926616725368!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31da19149fe4a925%3A0x82606eb494fd093c!2sLithan%20Academy!5e0!3m2!1sen!2sid!4v1702272370970!5m2!1sen!2sid"
              width="400"
              height="450"
              style={{ border:'solid' }}
              allowfullscreen=""
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
          <div className="contactus-containe-right">
            <form action={""}>
              <label for="fname">First Name</label>
              <input
                type="text"
                id="fname"
                name="firstname"
                placeholder="Your name.."
              />

              <label for="lname">Last Name</label>
              <input
                type="text"
                id="lname"
                name="lastname"
                placeholder="Your last name.."
              />

              <label for="country">Country</label>
              <select id="country" name="country">
                <option value="australia">Australia</option>
                <option value="canada">Canada</option>
                <option value="usa">USA</option>
              </select>

              <label for="subject">Subject</label>
              <textarea
                id="subject"
                name="subject"
                placeholder="Write something.."
                style={{ height: "10rem" }}
              ></textarea>

              <input type="submit" value="Submit" />
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default ContactUsComponent;
