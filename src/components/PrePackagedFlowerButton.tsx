interface PrePackagedFlowerButtonProps {
  label?: string;
  onClick?: () => void;
  className?: string;
}

export default function PrePackagedFlowerButton({
  label = "PRE-PACKAGED FLOWER",
  onClick,
  className = "",
}: PrePackagedFlowerButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        relative
        h-16 px-12
        rounded-full
        text-white text-lg font-bold uppercase tracking-wide
        bg-gradient-to-r from-[#FFC93B] via-[#FF4B4B] via-[#00A3FF] to-[#3CC65A]
        shadow-[0_10px_30px_rgba(0,0,0,0.3)]
        hover:scale-105 hover:shadow-[0_15px_40px_rgba(255,201,59,0.6)]
        active:scale-95
        transition-all duration-300 ease-out
        cursor-pointer
        before:content-[''] before:absolute before:inset-0 before:rounded-full
        before:bg-gradient-to-b before:from-white/30 before:to-transparent
        before:pointer-events-none
        ${className}
      `}
    >
      {label}
    </button>
  );
}
