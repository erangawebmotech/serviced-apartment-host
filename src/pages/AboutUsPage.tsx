import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import NavBar from "../components/NavBar";
import "../styles/propertyListingStyles.scss";

import banner from "../assets/images/about/about-us-banner.png";
import banner2 from "../assets/images/about/about-us-banner-2.png";
import img1 from "../assets/images/about/about-us-image-1.png";
import img2 from "../assets/images/about/about-us-image-2.png";
import img3 from "../assets/images/about/about-us-image-3.png";
import img4 from "../assets/images/about/about-us-image-4.png";
import maskBanner from "../assets/images/about/mask-face.jpg";
import Footer from "../components/Footer";

const features = [
  {
    title: "Better Returns & Unique Experiences",
    description:
      "Property owners enjoy higher earning potential through short-term rentals, while guests benefit from affordable, comfortable, and authentic stays unlike conventional hotels.",
  },
  {
    title: "Seamless Management & Guest Services",
    description:
      "We take care of everything, from guest inquiries and bookings to cleaning, maintenance, and beyond.",
  },
  {
    title: "Professional Marketing & Wide Exposure",
    description:
      "Our team promotes properties with high-quality photography, smart pricing, and listings across leading travel platforms.",
  },
  {
    title: "Social Impact",
    description:
      "Every property supports job creation, empowers local suppliers, and contributes to vibrant communities.",
  },
  {
    title: "Trusted Experience",
    description:
      "With expertise in real estate, tourism, and hospitality, we bring confidence to owners and peace of mind to guests.",
  },
  {
    title: "All-in-One Mobile App",
    description:
      "Hosts and guests can manage and enjoy their stay via our user-friendly, fully integrated mobile app.",
  },
];

const AboutUsPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return (
    <>
      <NavBar pageName="whitePage" />
      <div
        className="AboutUsPageContainer py-5"
        style={{ marginTop: "60px", minHeight: "100vh" }}
      >
        <div className="container d-flex flex-column align-items-center text-center">
          <h1 className="display-5 fw-semibold mb-5 mt-5  ">
            The <span className="primary-color">Pioneering</span> Sri Lankan Platform Turning Apartments into{" "}
            <span className="primary-color">High-Performance</span> Serviced Stays for Locals and Global{" "}
            <span className="primary-color">Travelers</span> Alike
          </h1>
          <img src={banner} alt="About Us Banner" className="img-fluid mb-5" />

          {/* Main Description */}
          <div className="text-center text-md-start w-100 mb-5 row flex-column ">
            <p className="col-12">
              Serviced Apartments LK is Sri Lanka’s First dedicated website for short-term rental listing management, built to transform residential spaces into high-performing serviced accommodation including Apartments, Villas, boutique hotels and Home Stays. Founded in 2017 by a young entrepreneur, the establishment was born from a clear vision: to meet the future demand of Sri Lanka’s growing tourism sector and to harness the untapped potential of apartment living. Since then, we offer full range of serviced accommodation management services to the property owners to host their properties to both local and international travellers.
            </p>
            <p className="col-12 ">
              Recognizing early the surge in apartment developments across the country and the limited capacity in traditional hotel infrastructure, our founder saw a powerful opportunity. Since 2023, we registered the trading name Serviced Apartments LK and built the First Sri Lankan short term accommodation listing platform. By converting modern apartments into serviced accommodation, Serviced Apartments LK set out to offer a flexible, scalable solution that meets the evolving needs of both travelers and property owners.
            </p>
            <p className="col-12">
              Today, we operate as a fully local Online Travel Agency (OTA), empowering property owners while helping bridge the accommodation gap in Sri Lanka’s hospitality industry, while overcoming the practical issues faced when hosting with international OTAs — with added features like a fully integrated mobile app, verified listings, secured payment gateway, and ongoing platform improvements that make serviced accommodation management easier than ever.
            </p>
          </div>

          {/* Image Grid */}
          <div className="row g-0 mb-5" style={{ width: "100vw" }}>
            {[img1, img2, img3].map((src, i) => (
              <div key={i} className="col-12 col-md-4">
                <img src={src} alt={`Gallery ${i + 1}`} className="img-fluid w-100" style={{ display: "block" }} />
              </div>
            ))}
          </div>



          {/* Why Choose Us Section */}
          <div className="position-relative text-start mb-5 py-3">
            <h2 className="mb-4 ms-3">Why Choose Us?</h2>
            <div className="row ">
              <div className="col-md-6">
                <ul className="space-y-3 pl-5 list-disc">
                  <li className="my-3">
                    <strong>100% Sri Lankan</strong> — By partnering with us or choosing to stay at our properties,
                    you directly support the local economy, create job opportunities, and ensure your investment and
                    spending benefits Sri Lanka.
                  </li>
                  <li className="my-3">
                    <strong>Higher Returns</strong> — Earn more with short-term rentals compared to traditional
                    long-term leases.
                  </li>
                  <li className="my-3">
                    <strong>Hassle-Free Management</strong> — We handle everything from guest inquiries and bookings
                    to cleaning and maintenance.
                  </li>
                  <li className="my-3">
                    <strong>Professional Marketing</strong> — High-quality photography, strategic pricing, and exposure
                    across top travel platforms.
                  </li>
                </ul>
              </div>
              <div className="col-md-6">
                <ul className="space-y-3 pl-5 list-disc">
                  <li className="my-3">
                    <strong>Social Impact</strong> — Every property supports job creation, empowers local suppliers, and
                    contributes to vibrant communities, making every stay meaningful for both hosts and guests.
                  </li>
                  <li className="my-3">
                    <strong>Trusted Experience</strong> — With deep expertise in real estate, tourism, and hospitality, we
                    offer confidence to property owners and peace of mind to guests.
                  </li>
                  <li className="my-3">
                    <strong>All-in-One Mobile App</strong> — Our fully integrated mobile app makes managing properties and
                    booking stays easier than ever. Hosts can monitor bookings, earnings, and property performance on the go.
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div
            className="position-relative text-white p-5 mb-5 "
            style={{ backgroundColor: "#082942", width: "100vw" }}
          >
            <img
              src={maskBanner}
              alt="Mask Banner"
              className="position-absolute top-0 start-0 w-100 h-100"
              style={{ opacity: 0.2, objectFit: "cover" }}
            />

            {/* Vision & Mission */}
            <div className="row g-5 text-center text-md-start px-0 mx-0 px-md-5 mx-md-3">
              <div className="col-md-6">
                <h3 className="mb-3">Our Vision</h3>
                <p>
                  To be the driving force in reshaping Sri Lanka’s tourism accommodation landscape by delivering smart, scalable, and locally powered alternatives to traditional hotels—creating long-term value for both travelers and property investors.
                </p>
              </div>
              <div className="col-md-6">
                <h3 className="mb-3">Our Mission</h3>
                <p>
                  To empower property owners and enrich traveler experiences by providing innovative, seamless short-term rental solutions that unlock the true value of residential spaces. As a fully local establishment, we are committed to ensuring that 100% of our revenue remains in Sri Lanka, directly supporting the nation’s economy. We strive for operational excellence, local expertise, and sustainable growth—delivering reliable service, fostering community well-being, and setting new benchmarks for hospitality in Sri Lanka.
                </p>
              </div>
            </div>

          </div>

          {/* Features */}
          <h2 className="mb-4">Why Choose Serviced Apartments LK?</h2>
          <div className="row g-4 my-5 justify-content-center">
            {features.map((item, idx) => (
              <div key={idx} className="col-12 col-sm-6 col-lg-3 px-4 mb-3">
                <h5 className="secondary-color">{item.title}</h5>
                <p className="font-size-6 text-gray-secondary">{item.description}</p>
              </div>
            ))}
          </div>

          <img src={banner2} alt="About Us Banner 2" className="img-fluid mb-5" />

          <div className="w-100 mb-5 text-start">
            <h3 className="mb-4 mx-4 mx-md-0">For Hosts & Homeowners</h3>
            <div className="row mx-2 mx-md-0">
              <div className="col-12 col-md-6">
                <ul className=" ps-3">
                  <li className="mb-3 font-size-4">
                    Flexible Solutions for Every Homeowner – Whether you want to simply list your property or need complete, hands-off serviced accommodation management, we provide tailored options to suit your needs.
                  </li>
                  <li className="mb-3 font-size-4">
                    100% Sri Lankan – Partnering with us ensures your investment supports the local economy, creates jobs, and keeps revenue within Sri Lanka.
                  </li>
                  <li className="mb-3 font-size-4">
                    Higher Earnings – Unlock greater returns with short-term rentals compared to traditional long-term leases.
                  </li>
                  <li className="mb-3 font-size-4">
                    Hassle-Free Management – We handle guest inquiries, bookings, cleaning, and property maintenance, so you can enjoy peace of mind.
                  </li>
                </ul>
              </div>

              <div className="col-12 col-md-6">
                <ul className="ps-3">
                  <li className="mb-3 font-size-4">
                    Professional Marketing – Benefit from high-quality photography, dynamic pricing strategies, and exposure on leading travel platforms.
                  </li>
                  <li className="mb-3 font-size-4">
                    All-in-One Mobile App – Monitor bookings, earnings, and property performance on the go, all from your phone.
                  </li>
                  <li className="mb-3 font-size-4">
                    Social Impact – Every property listed contributes to job creation, supports local suppliers, and strengthens communities.
                  </li>
                  <li className="mb-3 font-size-4">
                    Trusted Experience – Rely on our expertise in real estate, tourism, and hospitality for reliable results.
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Our Commitment */}
          <div className="row mb-5 text-start g-6 mx-2">

            <div className="col-12 col-md-6 d-flex flex-column justify-content-end text-white p-4 p-md-5 rounded-4 secondary-bg-color text-center text-md-start  ">
              <h3 className="h3 mb-4">Our Commitment</h3>
              <p className="mb-3">
                At Serviced Apartments LK, we believe in growing together—with our property partners, our communities, and Sri Lanka’s tourism industry. Our platform is more than just a service; it’s a movement to optimize underutilized assets, generate sustainable income for property owners, and provide travelers with unique, comfortable stays.
              </p>
              <p>
                Whether you own a single apartment or manage a portfolio, we provide a customized and caring approach that delivers results.
              </p>
            </div>

            <div className="col-12 col-md-6">
              <img src={img4} alt="temple" className="img-fluid rounded-4 mt-4 mt-md-0" style={{ height: "100%", width: "100%", objectFit: "cover" }} />
            </div>
          </div>

          {/* Join Us */}
          <div className="text-center mb-5">
            <h3 className="h3 mb-3">Join Us!</h3>
            <p className="mx-auto" style={{ maxWidth: "70ch" }}>
              Be part of a future-forward solution that’s redefining accommodation in Sri Lanka. With Serviced Apartments LK, your property becomes more than a space—it becomes a part of a growing success story.
            </p>
            <p className="fw-semibold">Serviced Apartments LK — Turning Vision into Value.</p>
          </div>

          {/* Our Story */}
          <div className="text-center">
            <h3 className="h3 mb-3">Our Story</h3>
            <p className="fw-semibold">From Local Roots to Global Connections</p>
            <div className="mt-3">
              <p>
                Serviced Apartments LK was born from a simple conviction: that Sri Lanka’s abundant hospitality and unique living spaces deserve a global stage. We set out to bridge the gap between property owners yearning for sustainable income and travelers searching for comfort, convenience, and meaningful experiences.
              </p>
              <p>
                Guided by a passion for innovation and community empowerment, we created a platform where every property tells a story, every stay sparks a connection, and every stakeholder benefits. Our team blends deep expertise in real estate, tourism, and hospitality with a forward-thinking approach—transforming underutilized spaces into thriving destinations.
              </p>
              <p>
                From the beginning, we have championed quality, trust, and social impact. Our commitment is evident in every detail—from photography and pricing to guest experiences and support for local suppliers.
              </p>
              <p>
                But our story is about more than properties and platforms. It’s about helping partners achieve their goals, nurturing vibrant communities, and contributing to Sri Lanka’s tourism renaissance.
              </p>
              <p>
                Together, we’re rewriting the narrative of accommodation in Sri Lanka, one stay at a time.
              </p>
            </div>
          </div>
        </div>
      </div >
      <Footer />
    </>
  );
};

export default AboutUsPage;
