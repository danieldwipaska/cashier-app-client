import { useEffect, useState } from 'react';
import Nav from '../../components/Nav';
import SideNav from '../../components/SideNav';
import Menu from '../../components/Home/Menu';
import Cart from '../../components/Home/Cart';
import OrderSummary from '../../components/Home/OrderSummary';
import { Backdrop } from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { useCheckToken } from '../../hooks/useCheckToken';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { ReportStatus, SHOP_QUERY_KEY } from 'configs/utils';
import { useDispatch, useSelector } from 'react-redux';
import { setServiceAndTax, updateOrder } from 'context/slices/orderSlice';
import { calculateDiscountedPrice } from 'functions/tax-service';
import { ServiceTax } from 'lib/taxes/taxes.calculation';

const Home = () => {
  // Auth
  const { user } = useAuth();
  const dispatch = useDispatch();
  const orderState = useSelector((state: any) => state.order);
  // START STATES

  // Cart & Summary
  const [openSummary, setOpenSummary] = useState(false);
  const [openBackdrop, setOpenBackdrop] = useState(false);

  // Crew Auth
  const [crewCredential, setCrewCredential] = useState('');
  const [openCrewAuthAlertDialog, setOpenCrewAuthAlertDialog] = useState(false);
  const [errorCrewCredential, setErrorCrewCredential] = useState(false);
  const [errorUnauthorizedCrew, setErrorUnauthorizedCrew] = useState(false);

  // END STATES

  // START QUERIES
  const { data: reports, refetch: reportsRefetch } = useQuery({
    queryKey: ['unpaidReports'],
    queryFn: () =>
      axios
        .get(`${process.env.REACT_APP_API_BASE_URL}/reports?status=${ReportStatus.UNPAID}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access-token')}`,
          },
        })
        .then((res) => {
          const reportData = res.data.data.map((report: any) => {
            return { ...report, served_by: report.crew.name }
          });

          return reportData;
        })
        .catch((err) => {
          return console.log(err);
        }),
  });

  const { data: shop } = useQuery({
    queryKey: SHOP_QUERY_KEY,
    queryFn: async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/shops/shop`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access-token')}`,
          },
        });
        return res.data.data;
      } catch (err) {
        return console.log(err);
      }
    },
  });
  // END QUERIES

  // START HOOKS
  useCheckToken(user);
  useEffect(() => {
    if (shop) {
      const shopPayload = {
        service: shop.service,
        tax: shop.tax,
        included_tax_service: shop.included_tax_service,
      };

      dispatch(setServiceAndTax(shopPayload));
    }

    const totalDiscountedPrice = calculateDiscountedPrice(orderState.order.items);
    const totalPaymentAfterTaxService = new ServiceTax(totalDiscountedPrice, orderState.serviceAndTax.service, orderState.serviceAndTax.tax).calculateTax();

    if (!orderState.serviceAndTax.included_tax_service) {
      dispatch(updateOrder({ total_payment: totalDiscountedPrice }));
      dispatch(updateOrder({ total_payment_after_tax_service: totalPaymentAfterTaxService }));
    } else {
      dispatch(updateOrder({ total_payment: totalDiscountedPrice }));
      dispatch(updateOrder({ total_payment_after_tax_service: totalDiscountedPrice }));
    }
  }, [dispatch, orderState.order.items, orderState.serviceAndTax.included_tax_service, orderState.serviceAndTax.service, orderState.serviceAndTax.tax, shop]);
  // END HOOKS

  return (
    <div>
      <Nav />

      <div className="flex">
        <SideNav />

        <Menu openSummary={openSummary} setOpenSummary={setOpenSummary} />

        {openSummary ? (
          <OrderSummary
            states={{
              openSummary,
              setOpenSummary,
              openBackdrop,
              setOpenBackdrop,
            }}
            crewData={{
              crewCredential,
              setCrewCredential,
              openCrewAuthAlertDialog,
              setOpenCrewAuthAlertDialog,
              errorCrewCredential,
              setErrorCrewCredential,
              errorUnauthorizedCrew,
              setErrorUnauthorizedCrew,
            }}
            unpaidReports={{
              reports,
              reportsRefetch,
            }}
          />
        ) : (
          <Cart
            states={{
              openSummary,
              setOpenSummary,
              openBackdrop,
              setOpenBackdrop,
            }}
            crewData={{
              crewCredential,
              setCrewCredential,
              openCrewAuthAlertDialog,
              setOpenCrewAuthAlertDialog,
              errorCrewCredential,
              setErrorCrewCredential,
              errorUnauthorizedCrew,
              setErrorUnauthorizedCrew,
            }}
            unpaidReports={{
              reports,
              reportsRefetch,
            }}
          />
        )}
      </div>
      <Backdrop sx={{ color: '#fff', bgcolor: 'rgb(59,164,112,0.7)', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={openBackdrop} transitionDuration={300}>
        <CheckCircle color="inherit" fontSize="large" />
      </Backdrop>
    </div>
  );
};

export default Home;
