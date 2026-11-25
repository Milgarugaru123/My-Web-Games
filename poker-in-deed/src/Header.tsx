import Link from "next/link";

const Header = () => {
  return (
    <header
      className={`w-full py-3 border-b-10 border-[#5a3a27] bg-[#351500] sticky top-0 z-50`}
    >
      <nav
        className={`text-2xl w-full max-w-[80lvw] mx-auto flex justify-between items-center`}
      >
        <div className={`whitespace-nowrap`}>
          <Link href={`/`}>Poker in Deed!</Link>
        </div>
        <div className={`flex gap-[3%] whitespace-nowrap items-center`}>
          <Link href={`/Five_Draw`}>Five Card Draw</Link>
          <span>|</span>
          <Link href={`/Seven_Stud`}>Seven Card Stud</Link>
          <span>|</span>
          <Link href={`/Texas_Holdem`}>Texas Hold'em</Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;
