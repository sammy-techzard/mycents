import MenuItem from './MenuItem';
import { Home as HomeIcon } from '@mui/icons-material';
import CreditCardRoundedIcon from '@mui/icons-material/CreditCardRounded';
import CategoryRoundedIcon from '@mui/icons-material/CategoryRounded';
import SavingsRoundedIcon from '@mui/icons-material/SavingsRounded';
import CurrencyExchangeRoundedIcon from '@mui/icons-material/CurrencyExchangeRounded';


import mainapplogo from '../logo/logo512.png'
function Menu() {
  return (
    <nav className='native-card main-menu-nav'>
      <div className='main-menu-items-holder'>
        <div className='main-app-menu-logo'>
          <img src={mainapplogo} alt="Main Logo" />
        </div>
        <div className='main-menu-holder'>
          <MenuItem icon={HomeIcon} name="Home" page="/app/dashboard" />
          <MenuItem icon={CreditCardRoundedIcon} name="Accounts" page="/app/accounts" />
          <MenuItem icon={CurrencyExchangeRoundedIcon} name="Transactions" page="/app/transactions" />
          <MenuItem icon={CategoryRoundedIcon} name="Categories" page="/app/categories" />
          <MenuItem icon={SavingsRoundedIcon} name="Budget" page="/app/budget" />
        </div>
        
          
      </div>
    </nav>
  );
}

export default Menu;
