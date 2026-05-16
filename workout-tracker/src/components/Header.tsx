import Button from "./Button";
interface HeaderProps {
  onLogout: () => void;
}

const Header = ({ onLogout }: HeaderProps) => (
  <header className="flex items-center justify-between bg-blue-600 text-white p-4 px-8 rounded-b-xl shadow-lg">
    <h2 className="text-2xl font-semibold m-0">My Workout Tracker</h2>
    <Button
      variant="secondary"
      onClick={onLogout}
      className="bg-white text-blue-600 hover:bg-blue-50 hover:text-blue-800"
    >
      Log out
    </Button>
  </header>
);

export default Header;
