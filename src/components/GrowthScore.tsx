import { motion } from "framer-motion";

interface GrowthScoreProps {
  score: number; // 0-100
  size?: number;
}

const GrowthScore = ({ score, size = 120 }: GrowthScoreProps) => {
  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: size, height: size }}>
        {/* Background circle */}
        <svg width={size} height={size} className="rotate-[-90deg]">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="hsl(var(--border))"
            strokeWidth={strokeWidth}
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth={strokeWidth}
            strokeLinecap="butt"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
          />
        </svg>
        {/* Score text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="font-display text-2xl font-bold text-foreground"
          >
            {score}
          </motion.span>
          <span className="text-[9px] uppercase tracking-[0.15em] text-muted-foreground font-medium">
            / 100
          </span>
        </div>
      </div>
      <div className="text-center">
        <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground font-medium">
          Growth Infrastructure Score
        </p>
        <p className="text-[10px] text-muted-foreground/60 mt-0.5">
          Powered by SUPPORT STUDIO
        </p>
      </div>
    </div>
  );
};

export default GrowthScore;
