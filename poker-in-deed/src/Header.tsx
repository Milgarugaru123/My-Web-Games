import Link from "next/link";

const Header = () => {
  return (
    <header className={`w-full py-3`}>
      <nav
        className={`text-2xl w-full max-w-[80lvw] mx-auto flex justify-between items-center`}
      >
        <div>
          <Link href={`/`}>Poker in Deed!</Link>
        </div>
        <div className={`flex gap-[3%] whitespace-nowrap`}>
          <Link href={`/fcd`}>Five Card Draw</Link>
          <Link href={`/scs`}>Seven Card Stud</Link>
          <Link href={`/th`}>Texas Hold'em</Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;
