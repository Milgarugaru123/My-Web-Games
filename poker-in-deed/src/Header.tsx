import Link from "next/link";

const Header = () => {
  return (
    <header className={`w-full py-3 border-b-10 border-[#5a3a27] sticky top-0`}>
      <nav
        className={`text-2xl w-full max-w-[80lvw] mx-auto flex justify-between items-center`}
      >
        <div className={`whitespace-nowrap`}>
          <Link href={`/`}>Poker in Deed!</Link>
        </div>
        <div className={`flex gap-[3%] whitespace-nowrap`}>
          <Link href={`/Five_Draw`}>Five Card Draw</Link>
          <Link href={`/Seven_Stud`}>Seven Card Stud</Link>
          <Link href={`/Texas_Holdem`}>Texas Hold'em</Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;
