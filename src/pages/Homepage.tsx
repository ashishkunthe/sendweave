import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white flex flex-col relative overflow-hidden">
      {/* Navbar */}
      <header className="flex items-center justify-between px-8 py-4 border-b border-white/10 backdrop-blur-md">
        <motion.h1
          className="text-2xl font-extrabold tracking-wide text-white"
          whileHover={{ scale: 1.05 }}
        >
          SendWeave
        </motion.h1>
        <div className="space-x-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/login")}
            className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition"
          >
            Login
          </motion.button>
          <motion.button
            whileHover={{
              scale: 1.05,
              boxShadow: "0 0 15px rgba(255,255,255,0.4)",
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/dashboard")}
            className="px-5 py-2 bg-white text-black font-bold rounded-full text-sm shadow-lg hover:bg-gray-200 transition"
          >
            Get Started
          </motion.button>
        </div>
      </header>

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center flex-grow px-6 py-20 text-center">
        <motion.h1
          className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Professional Email Automation
          <br />
          <span className="text-gray-400">Simplified for Everyone</span>
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl text-gray-400 max-w-3xl mb-8 leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          SendWeave enables businesses to design, schedule, and monitor{" "}
          <span className="text-white font-semibold">
            automated email workflows
          </span>{" "}
          with an intuitive, drag-and-drop interface.
        </motion.p>

        {/* Trust Badge */}
        <motion.div
          className="mb-10 px-5 py-2 bg-gray-800 text-gray-300 font-medium rounded-full text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
        >
          Free to use – No credit card required
        </motion.div>

        <motion.div
          className="space-x-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
        >
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-white text-black font-bold px-8 py-3 rounded-full text-lg shadow-md hover:bg-gray-200 transition"
          >
            Get Started
          </button>
          <button
            onClick={() => navigate("/login")}
            className="px-8 py-3 border border-white/30 rounded-full text-lg font-medium hover:bg-white/10 transition"
          >
            Explore Demo
          </button>
        </motion.div>
      </div>

      {/* Key Benefits */}
      <section className="py-20 bg-black/40 backdrop-blur-lg">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-8 text-center">
          {[
            {
              title: "Time Efficiency",
              desc: "Automate recurring email tasks and free up your team to focus on growth.",
            },
            {
              title: "Higher Engagement",
              desc: "Personalized workflows lead to stronger customer connections and improved open rates.",
            },
            {
              title: "Simple Interface",
              desc: "Visual builder designed for all users — no technical expertise required.",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              className="bg-gray-900/70 border border-gray-700 p-6 rounded-xl shadow-md hover:shadow-xl hover:scale-105 transition"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2, duration: 0.6 }}
            >
              <h3 className="text-xl font-semibold mb-3 text-white">
                {item.title}
              </h3>
              <p className="text-gray-400">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 max-w-5xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold mb-12 text-white">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              step: "1. Build Workflows",
              desc: "Create flows visually using email and delay nodes to map your campaigns.",
            },
            {
              step: "2. Schedule & Automate",
              desc: "Define timings and automate delivery with precision and control.",
            },
            {
              step: "3. Monitor Results",
              desc: "Track campaign performance from a single dashboard with actionable insights.",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              className="bg-gray-900/70 border border-gray-700 p-6 rounded-xl shadow-md hover:scale-105 transition"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.3, duration: 0.6 }}
            >
              <h3 className="text-lg font-semibold mb-2 text-white">
                {item.step}
              </h3>
              <p className="text-gray-400 text-sm">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-black/40 backdrop-blur-lg text-center">
        <h2 className="text-3xl font-bold mb-12 text-white">
          Trusted by Teams and Startups
        </h2>
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          {[
            {
              text: "SendWeave streamlined our entire outreach process. Our engagement rates improved significantly.",
              author: "– Growth Lead, SaaS Startup",
            },
            {
              text: "The visual builder is intuitive and reliable. It’s become an essential tool for our marketing team.",
              author: "– Marketing Manager",
            },
          ].map((t, i) => (
            <motion.div
              key={i}
              className="bg-gray-900/70 border border-gray-700 p-6 rounded-xl shadow-md hover:scale-105 transition"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.3, duration: 0.6 }}
            >
              <p className="italic text-gray-400">“{t.text}”</p>
              <h4 className="mt-4 font-semibold text-white">{t.author}</h4>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-gray-500 text-sm text-center border-t border-gray-800">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between px-6 gap-4">
          <p>© {new Date().getFullYear()} SendWeave. All rights reserved.</p>
          <div className="space-x-4">
            <a href="#" className="hover:text-white transition">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-white transition">
              Terms
            </a>
            <a href="#" className="hover:text-white transition">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
