import React from "react";
import { useNavigate } from "react-router-dom";
import "./About.css";

function About() {
  const navigate = useNavigate(); // Hook to navigate

  const handleBookAppointment = () => {
    navigate("/login"); // Navigate to the login page
  };

  return (
    <div className="about-container">
      <div className="about-content">
        {/* About Section */}
        <section className="about-section">
          <h1 className="section-title">About Us</h1>
          <p className="section-description">
            Welcome to DoctorApp, your trusted partner in healthcare. We are
            committed to delivering high-quality medical services with a
            personalized approach. With a dedicated team of professionals and
            advanced technology, we ensure that your health is in the best
            hands.
          </p>
        </section>

        {/* Call-to-Action Section */}
        <div className="cta-section">
          <h2 style={{ color: "white" }}>Ready to take care of your health?</h2>
          <button onClick={handleBookAppointment}>Book an Appointment</button>
        </div>

        {/* FAQ Section */}
        <div className="faq-section">
          <h2 className="section-title">Frequently Asked Questions</h2>
          <details>
            <summary>How do I book an appointment?</summary>
            <p>
              You can book an appointment online or by calling us at (123)
              456-7890.
            </p>
          </details>
          <details>
            <summary>What insurance plans do you accept?</summary>
            <p>
              We accept most major insurance providers. Contact us for details.
            </p>
          </details>
        </div>

        {/* Vision Section */}
        <section className="vision-section">
          <h1 className="section-title">Our Vision</h1>
          <p className="section-description">
            Our vision is to revolutionize healthcare by integrating
            cutting-edge technology with compassionate care. We strive to create
            a seamless healthcare experience where your well-being is our
            priority.
          </p>
        </section>

        {/* Services Section */}
        <section className="services-section">
          <h1 className="section-title">Our Services</h1>
          <ul className="services-list">
            <li className="service-item">
              <strong>24/7 Online Consultations:</strong> Access our experts
              anytime, anywhere.
            </li>
            <li className="service-item">
              <strong>Advanced Diagnostics:</strong> Benefit from
              state-of-the-art diagnostic services.
            </li>
            <li className="service-item">
              <strong>Specialist Care:</strong> Consult with leading experts in
              various fields.
            </li>
            <li className="service-item">
              <strong>Health Monitoring:</strong> Stay on top of your health
              with regular check-ups and tracking.
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}

export default About;
