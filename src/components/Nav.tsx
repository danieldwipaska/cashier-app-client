import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Button, Menu, MenuItem } from '@mui/material';
import { ArrowDropDown } from '@mui/icons-material';
import bahariLogo from '../assets/img/bahari-logo.webp';

const Nav = () => {
  const { user, signOut } = useAuth();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = (): void => {
    signOut();
  };

  return (
    <nav className="bg-white h-16 w-full grid grid-cols-1 content-center fixed">
      <div className="flex my-auto justify-between">
        <div className="flex items-stretch min-w-24 justify-center">
          <div className="self-center">
            <img src={bahariLogo} alt="profile" className='w-14' />
          </div>
        </div>
        <div className="flex-col mx-12">
          <div className="text-xs text-gray-500">Cashier</div>
          {user.username ? (
            <div>
              <Button
                id="basic-button"
                color="inherit"
                sx={{ textTransform: 'lowercase', ':hover': { backgroundColor: 'grey.200' } }}
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
              >
                {user.username} <ArrowDropDown />
              </Button>
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  'aria-labelledby': 'basic-button',
                }}
              >
                <MenuItem sx={{ fontSize: '14px' }} onClick={handleLogout}>
                  Logout
                </MenuItem>
              </Menu>
            </div>
          ) : (
            <div className="">Login</div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Nav;
