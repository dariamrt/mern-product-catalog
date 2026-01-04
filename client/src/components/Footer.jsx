import '../styles/components/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <p>© {new Date().getFullYear()} Vibe & Byte Collective. Smart picks. One checkout.</p>
    </footer>
  );
};

export default Footer;
