import React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import General from './General';
import Account from './Account';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useCheckToken } from '../../hooks/useCheckToken';

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
  const { user } = useAuth();

  // useEffect
  useCheckToken(user);

  const [value, setValue] = React.useState(0);

  // User Data for General
  const [shopId, setShopId] = React.useState('');
  const [discount, setDiscount] = React.useState(0);
  const [discountStatus, setDiscountStatus] = React.useState(false);
  const [tax, setTax] = React.useState(0);
  const [, setTaxStatus] = React.useState(true);
  const [service, setService] = React.useState(0);
  const [, setServiceStatus] = React.useState(true);
  const [includedTaxService, setIncludedTaxService] = React.useState(false);

  const { refetch: userDataRefetch } = useQuery({
    queryKey: ['userData'],
    queryFn: () =>
      axios
        .get(`${process.env.REACT_APP_API_BASE_URL}/multiusers/configuration/${user?.username}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access-token')}`,
          },
        })
        .then((res) => {
          setShopId(res.data.data.shops[0].shop.id);
          setDiscountStatus(res.data.data.shops[0].shop.discount_status);
          setDiscount(res.data.data.shops[0].shop.discount);
          setTax(res.data.data.shops[0].shop.tax);
          setService(res.data.data.shops[0].shop.service);
          setIncludedTaxService(res.data.data.shops[0].shop.included_tax_service);
          return res.data.data;
        })
        .catch((err) => {
          return console.log(err);
        }),
  });

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <div className="bg-gray-200 max-h-screen pt-20 px-8 w-full">
      <div className="bg-white">
        <Box>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs textColor="inherit" TabIndicatorProps={{ sx: { backgroundColor: 'green' } }} value={value} onChange={handleChange} aria-label="basic tabs example">
              <Tab label="General" {...a11yProps(0)} />
              <Tab label="Account" {...a11yProps(1)} />
            </Tabs>
          </Box>

          <CustomTabPanel value={value} index={0}>
            <General
              shopId={shopId}
              setShopId={setShopId}
              discountStatus={discountStatus}
              setDiscountStatus={setDiscountStatus}
              discount={discount}
              tax={tax}
              setTax={setTax}
              setTaxStatus={setTaxStatus}
              service={service}
              setService={setService}
              setServiceStatus={setServiceStatus}
              includedTaxService={includedTaxService}
              setIncludedTaxService={setIncludedTaxService}
              userDataRefetch={userDataRefetch}
            />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            <Account />
          </CustomTabPanel>
        </Box>
      </div>
    </div>
  );
};

export default AccountSettings;
