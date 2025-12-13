const NavButton = ({ isNext = true, onClick, disabled = false }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`arrow-button relative ${isNext ? "" : "-scale-x-100"}
        disabled:pointer-events-none disabled:opacity-0
        text-white hover:text-primary active:text-primary/80 pointer-events-auto
        transition-transform duration-300 z-50`}
    aria-label={isNext ? "Next tournament" : "Previous tournament"}
  >
    <svg
      className="h-[36px] w-[36px] sm:h-[44px] sm:w-[44px] md:h-[54px] md:w-[54px] transition duration-150 ease-out"
      viewBox="0 0 54 54"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0 48V15.1119C0 13.1103 0.750283 11.1815 2.10277 9.70607L8.62198 2.5942C10.1373 0.941171 12.2768 0 14.5192 0H49C50.6569 0 52 1.34315 52 3V9.09167C52 9.68395 52.1753 10.263 52.5038 10.7558L53.4962 12.2442C53.8247 12.737 54 13.3161 54 13.9083V50.971C54 52.6265 52.659 53.9691 51.0035 53.971L27.2447 53.9986C26.4478 53.9995 25.6833 53.6833 25.1199 53.1199L23.8787 51.8787C23.3161 51.3161 22.553 51 21.7574 51H3C1.34315 51 0 49.6569 0 48Z"
        fill="currentColor"
      />
    </svg>
    <svg
      className="absolute left-1/2 top-1/2 h-[8px] w-[6px] sm:h-[10px] sm:w-[7px] md:h-[12px] md:w-[9px] -translate-x-1/2 -translate-y-1/2 transition duration-150 ease-out text-black"
      viewBox="0 0 9 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9 10.1315V1.86852C9 1.06982 8.10985 0.593431 7.4453 1.03647L1.24808 5.16795C0.654342 5.56377 0.654343 6.43623 1.24808 6.83205L7.4453 10.9635C8.10985 11.4066 9 10.9302 9 10.1315Z"
        fill="currentColor"
      />
    </svg>
  </button>
);

export default NavButton;
