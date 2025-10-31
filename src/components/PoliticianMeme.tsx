import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useState } from "react";
import memeImage from "@/assets/meme-politician.jpg";
const PoliticianMeme = () => {
  const [isVisible, setIsVisible] = useState(true);
  if (!isVisible) return null;
  return <motion.div className="fixed top-24 right-0 z-[100] pointer-events-none" initial={{
    x: "100%",
    y: "0%"
  }} animate={{
    x: "0%",
    y: "0%"
  }} transition={{
    delay: 3,
    duration: 2.5,
    ease: [0.22, 0.61, 0.36, 1]
  }}>
      <div className="relative pointer-events-auto">
        {/* Close button */}
        <button onClick={() => setIsVisible(false)} className="absolute top-2 right-2 z-10 w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-colors" aria-label="Close meme">
          <X className="w-4 h-4" />
        </button>

        {/* Meme container */}
        <div className="relative w-48 md:w-64">
          {/* Circular Image */}
          <div className="relative rounded-full overflow-hidden shadow-2xl">
            <img src={memeImage} alt="Zohran Mamdani - NYC Politician" className="w-full h-full aspect-square object-cover" />
          </div>

          {/* Name badge */}
          

          {/* Speech bubble */}
          <motion.div className="absolute -left-20 md:-left-24 top-1/3 bg-white rounded-xl shadow-2xl p-3 border-3 border-destructive max-w-[140px]" initial={{
          scale: 0,
          rotate: -10
        }} animate={{
          scale: 1,
          rotate: 0
        }} transition={{
          delay: 5.5,
          duration: 0.4,
          ease: "easeOut"
        }}>
            {/* Speech bubble pointer - pointing right to his mouth */}
            <div className="absolute left-full top-1/2 -translate-y-1/2">
              <div className="w-0 h-0 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent border-r-[15px] border-r-destructive rotate-180"></div>
              <div className="absolute top-1/2 -translate-y-1/2 left-[3px] w-0 h-0 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent border-r-[12px] border-r-white rotate-180"></div>
            </div>

            <p className="text-destructive font-bold text-sm leading-tight text-center">
              "Tax the rich!"
            </p>
          </motion.div>

          {/* Warning badge */}
          
        </div>
      </div>
    </motion.div>;
};
export default PoliticianMeme;