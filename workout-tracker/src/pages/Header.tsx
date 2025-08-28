
interface HeaderProps {
  onLogout: () => void;
}

const Header = ({ onLogout }: HeaderProps) => (
  <header className="flex items-center justify-between bg-blue-600 text-white p-4 px-8 rounded-b-xl shadow-lg">
    <h2 className="text-2xl font-semibold m-0">Nikos Workout App</h2>
    <button 
      className="bg-white text-blue-600 border-none rounded-md px-5 py-2 text-base font-medium cursor-pointer transition-colors duration-200 hover:bg-blue-50 hover:text-blue-800"
      onClick={onLogout}
    >
      Log out
    </button>
  </header>
);

export default Header;
