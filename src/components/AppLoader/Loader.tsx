import { motion } from "framer-motion";

const Loader = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      background: "#f8f9fa",
    }}
  >
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      style={{
        width: 60,
        height: 60,
        border: "6px solid #e0e0e0",
        borderTop: "6px solid #c30ce8",
        borderRadius: "50%",
        boxSizing: "border-box",
      }}
    />
  </div>
);

export default Loader;
