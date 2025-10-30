import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useState } from "react";
import memeImage from "@/assets/meme-politician.jpg";

const PoliticianMeme = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed top-0 right-0 z-[100] pointer-events-none"
      initial={{ x: "100%", y: "-100%" }}
      animate={{ x: "0%", y: "0%" }}
      transition={{ 
        delay: 3,
        duration: 2.5,
        ease: [0.22, 0.61, 0.36, 1]
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
        <div className="relative w-32 md:w-40">
          {/* Circular Image */}
          <div className="relative rounded-full overflow-hidden shadow-2xl border-4 border-white">
            <img 
              src={memeImage}
              alt="Zohran Mamdani - NYC Politician"
              className="w-full h-full aspect-square object-cover"
            />
          </div>

          {/* Name badge */}
          <motion.div
            className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-[10px] md:text-xs font-bold uppercase shadow-lg whitespace-nowrap border-2 border-white"
            initial={{ scale: 0, y: -10 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ delay: 5.2, duration: 0.3 }}
          >
            Zohran Mamdani
          </motion.div>

          {/* Speech bubble */}
          <motion.div
            className="absolute -left-2 top-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl p-3 border-3 border-destructive max-w-[140px]"
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 5.5, duration: 0.4, ease: "easeOut" }}
          >
            {/* Speech bubble pointer */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full">
              <div className="w-0 h-0 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent border-l-[15px] border-l-destructive"></div>
              <div className="absolute top-1/2 -translate-y-1/2 right-[3px] w-0 h-0 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent border-l-[12px] border-l-white"></div>
            </div>

            <p className="text-destructive font-bold text-sm leading-tight text-center">
              "Tax the rich!"
            </p>
          </motion.div>

          {/* Warning badge */}
          <motion.div
            className="absolute -bottom-1 -left-1 bg-destructive text-white px-2 py-0.5 rounded-full text-[10px] font-bold uppercase shadow-lg rotate-[-5deg]"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 5.8, duration: 0.3 }}
          >
            ⚠️ Run!
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default PoliticianMeme;
