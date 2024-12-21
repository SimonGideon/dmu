import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="text-center p-4 text-secondary">
      By using this tool, you agree to our{" "}
      <a href="#" className="underline">
        Terms
      </a>{" "}
      and have read our{" "}
      <a href="#" className="underline">
        Privacy Policy
      </a>.
    </footer>
  );
};

export default Footer;
