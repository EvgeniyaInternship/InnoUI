import { useState } from 'react';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import Divider from '@mui/material/Divider';
import ListItemIcon from '@mui/material/ListItemIcon';
import MenuItem from '@mui/material/MenuItem';
import { formatAccountLabel } from '@/shared/session/signed-in-account';
import type { SignedInAccount } from '@/shared/session/signed-in-account';
import { AccountButton, AccountMenuCard } from './AccountMenu.styles';

type AccountMenuProps = {
  account: SignedInAccount;
  onLogout: () => void;
};

export function AccountMenu({ account, onLogout }: AccountMenuProps) {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const closeMenu = (): void => {
    setAnchor(null);
  };
  const logOut = (): void => {
    closeMenu();
    onLogout();
  };

  return (
    <>
      <AccountButton
        variant="outlined"
        aria-haspopup="true"
        aria-expanded={anchor !== null}
        onClick={(event) => setAnchor(event.currentTarget)}
      >
        {formatAccountLabel(account)}
      </AccountButton>
      <AccountMenuCard
        anchorEl={anchor}
        open={anchor !== null}
        onClose={closeMenu}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem onClick={closeMenu}>
          <ListItemIcon>
            <SettingsOutlinedIcon />
          </ListItemIcon>
          Settings
        </MenuItem>
        <MenuItem onClick={closeMenu}>
          <ListItemIcon>
            <PersonOutlinedIcon />
          </ListItemIcon>
          View account
        </MenuItem>
        <Divider />
        <MenuItem onClick={logOut}>
          <ListItemIcon>
            <LogoutOutlinedIcon />
          </ListItemIcon>
          Log out
        </MenuItem>
      </AccountMenuCard>
    </>
  );
}
