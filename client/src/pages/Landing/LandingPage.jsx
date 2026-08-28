import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Navbar from '../../components/navbar/Navbar';

export default function LandingPage() {
  return (
    <div className="landing-page">
      <Navbar />
      <div className="hero">
        <h1 className="hero-title">Turn civic problems into<br />community solutions</h1>
        <p className="hero-subtitle">
          SANKALP connects citizens, universities, industries, and government
          to collaborate on real-world societal challenges — from report to deployment.
        </p>
        <div className="hero-actions">
          <Link to="/register" className="btn btn-primary btn-lg">Get Started <ArrowRight size={18} /></Link>
          <Link to="/login" className="btn btn-outline btn-lg">Sign In</Link>
        </div>
      </div>
      <div className="lifecycle-strip">
        {['Report', 'AI Analysis', 'Challenge', 'Solution', 'Evaluation', 'Partnership', 'Pilot', 'Deployment'].map((step, i) => (
          <div key={step} className="lifecycle-step">
            <span className="lifecycle-num">{i + 1}</span>
            <span className="lifecycle-label">{step}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
