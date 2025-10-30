import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useState } from "react";
import memeImage from "@/assets/meme-politician.jpg";

const PoliticianMeme = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed top-0 right-0 z-50 pointer-events-none"
      initial={{ x: "100%", y: "-50%" }}
      animate={{ x: "0%", y: "0%" }}
      transition={{ 
        delay: 2,
        duration: 0.6,
        type: "spring",
        bounce: 0.4
      }}
    >
      <div className="relative pointer-events-auto">
        {/* Close button */}
        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-2 right-2 z-10 w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-colors"
          aria-label="Close meme"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Meme container */}
        <div className="relative w-64 md:w-80">
          {/* Image */}
          <div className="relative rounded-bl-3xl overflow-hidden shadow-2xl border-4 border-white">
            <img 
              src={memeImage}
              alt="Political meme"
              className="w-full h-auto"
            />
            {/* Gradient overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          </div>

          {/* Speech bubble */}
          <motion.div
            className="absolute -left-4 top-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl p-4 border-4 border-destructive max-w-[200px]"
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 2.4, duration: 0.3, type: "spring" }}
          >
            {/* Speech bubble pointer */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full">
              <div className="w-0 h-0 border-t-[15px] border-t-transparent border-b-[15px] border-b-transparent border-l-[20px] border-l-destructive"></div>
              <div className="absolute top-1/2 -translate-y-1/2 right-[4px] w-0 h-0 border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent border-l-[16px] border-l-white"></div>
            </div>

            <p className="text-destructive font-bold text-lg leading-tight text-center">
              "I'm coming for your income!"
            </p>
          </motion.div>

          {/* Warning badge */}
          <motion.div
            className="absolute -bottom-2 -left-2 bg-destructive text-white px-3 py-1 rounded-full text-xs font-bold uppercase shadow-lg rotate-[-5deg]"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 2.6, type: "spring" }}
          >
            ⚠️ Run!
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default PoliticianMeme;
