import { useState, useEffect, useRef } from "react";
import { NAV_LINKS } from "../../constants/navLinks";
import { STATS } from "../../constants/stats";

import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

import HeroSection from "../../components/sections/HeroSection";
import StatsSection from "../../components/sections/StatsSection";
import ServicesSection from "../../components/sections/ServicesSection";
import CTASection from "../../components/sections/CTASection";
import ReviewsSection from "../../components/sections/ReviewsSection";
import LiveTrackerSection from "../../components/sections/LiveTrackerSection";
import ProcessSection from "../../components/sections/ProcessSection";

import "../../styles/home.css";

export default function AutoGarageHome() {
  const [scrolled, setScrolled] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);
  const [heroVisible, setHeroVisible] = useState(false);

  const statsRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    setHeroVisible(true);

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) setStatsVisible(true);
    }, { threshold: 0.3 });

    if (statsRef.current) obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div className="home">
      <Navbar scrolled={scrolled} NAV_LINKS={NAV_LINKS} />

      <HeroSection heroVisible={heroVisible} />

      <StatsSection
        statsRef={statsRef}
        statsVisible={statsVisible}
        STATS={STATS}
      />

      <ServicesSection />
      <ProcessSection />
      <LiveTrackerSection />
      <ReviewsSection />
      <CTASection />

      <Footer />
    </div>
  );
}