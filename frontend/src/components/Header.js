
import headerLogo from '../images/logo.svg'
import NavBar from './NavBar';

function Header({ email, onLogOut }) {
  // console.log(email)
  return (
    <header className="header">
      <img className="header__logo" src={headerLogo} alt="Логотип страницы Mesto" />
            <NavBar
        email={email}
        onLogOut={onLogOut} />
    </header>
  );
}

export default Header;