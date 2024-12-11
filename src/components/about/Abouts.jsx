import React from "react";
import "./About.css";

const FinanceObjectives = () => {
  return (
    <div className="row mt-40">
      <div
        className="col-lg-4 col-sm-6 aos-init aos-animate"
        data-aos="fade-up"
        data-aos-delay="300"
        data-aos-duration="500"
        data-aos-once="true"
      >
        <div className="single-banner-boxes">
          <div className="icon">
            {/* Icon representing financial planning */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
          <h3>Financial Planning</h3>
          <p>
            Develop and implement comprehensive financial strategies to ensure
            the organization's long-term financial stability and growth.
          </p>
        </div>
      </div>

      <div
        className="col-lg-4 col-sm-6 aos-init aos-animate"
        data-aos="fade-up"
        data-aos-delay="400"
        data-aos-duration="500"
        data-aos-once="true"
      >
        <div className="single-banner-boxes">
          <div className="icon">
            {/* Icon representing budgeting */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M12 2v20"></path>
              <path d="M2 12h20"></path>
            </svg>
          </div>
          <h3>Budgeting</h3>
          <p>
            Allocate resources effectively by creating and managing budgets,
            ensuring optimal financial performance across departments.
          </p>
        </div>
      </div>

      <div
        className="col-lg-4 col-sm-6 aos-init aos-animate"
        data-aos="fade-up"
        data-aos-delay="500"
        data-aos-duration="500"
        data-aos-once="true"
      >
        <div className="single-banner-boxes">
          <div className="icon">
            {/* Icon representing auditing */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M9 18l6-6-6-6"></path>
              <path d="M15 12H3"></path>
            </svg>
          </div>
          <h3>Auditing</h3>
          <p>
            Ensure compliance and transparency by conducting regular financial
            audits, maintaining accuracy in reporting and accountability.
          </p>
        </div>
      </div>

      <div
        className="col-lg-4 col-sm-6 aos-init aos-animate"
        data-aos="fade-up"
        data-aos-delay="600"
        data-aos-duration="500"
        data-aos-once="true"
      >
        <div className="single-banner-boxes">
          <div className="icon">
            {/* Icon representing cash flow */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M12 8v8"></path>
              <path d="M16 12H8"></path>
            </svg>
          </div>
          <h3>Cash Flow Management</h3>
          <p>
            Monitor and optimize cash flow to ensure liquidity and the
            organization's ability to meet financial obligations.
          </p>
        </div>
      </div>

      <div
        className="col-lg-4 col-sm-6 aos-init aos-animate"
        data-aos="fade-up"
        data-aos-delay="700"
        data-aos-duration="500"
        data-aos-once="true"
      >
        <div className="single-banner-boxes">
          <div className="icon">
            {/* Icon representing risk management */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M14 2L9 12l3 5 3-5-3-10z"></path>
            </svg>
          </div>
          <h3>Risk Management</h3>
          <p>
            Identify and manage financial risks to safeguard the organization
            from uncertainties and ensure long-term financial security.
          </p>
        </div>
      </div>

      <div
        className="col-lg-4 col-sm-6 aos-init aos-animate"
        data-aos="fade-up"
        data-aos-delay="800"
        data-aos-duration="500"
        data-aos-once="true"
      >
        <div className="single-banner-boxes">
          <div className="icon">
            {/* Icon representing financial reporting */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M6 18L18 6"></path>
              <path d="M6 6h12v12H6z"></path>
            </svg>
          </div>
          <h3>Financial Reporting</h3>
          <p>
            Provide clear and accurate financial reports to stakeholders,
            ensuring transparency and informed decision-making.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FinanceObjectives;
