import React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import General from './settings/General';
import MultiUserAndCrew from './settings/MultiUserAndCrew';
import PaymentMethod from './settings/PaymentMethod';
import Account from './settings/Account';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const AccountSettings = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <div className="bg-gray-200 max-h-screen pt-20 px-8 w-11/12">
      <div className="bg-white h-4/5">
        <Box>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs textColor="inherit" TabIndicatorProps={{ sx: { backgroundColor: 'green' } }} value={value} onChange={handleChange} aria-label="basic tabs example">
              <Tab label="General" {...a11yProps(0)} />
              <Tab label="Multi-User and Crew" {...a11yProps(1)} />
              <Tab label="Payment Method" {...a11yProps(2)} />
              <Tab label="Account" {...a11yProps(3)} />
            </Tabs>
          </Box>

          <CustomTabPanel value={value} index={0}>
            <General />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            <MultiUserAndCrew />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={2}>
            <PaymentMethod />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={3}>
            <Account />
          </CustomTabPanel>
        </Box>
      </div>
    </div>
  );
};

export default AccountSettings;
