import { FormControl, FormGroup, FormLabel, Switch, TextField } from '@mui/material';
import axios from 'axios';

const General = ({
  shopId,
  setDiscount,
  tax,
  setTax,
  taxStatus,
  service,
  setService,
  serviceStatus,
  includedTaxService,
  userDataRefetch,
}: {
  shopId: any;
  setShopId: any;
  discountStatus: any;
  setDiscountStatus: any;
  discount: any;
  setDiscount: any;
  tax: any;
  setTax: any;
  taxStatus: any;
  setTaxStatus: any;
  service: any;
  setService: any;
  serviceStatus: any;
  setServiceStatus: any;
  includedTaxService: any;
  setIncludedTaxService: any;
  userDataRefetch: any;
}) => {
  const updateTaxStatus = async (shopId: string, taxStatus: boolean, tax: number) => {
    try {
      await axios.patch(`http://localhost:3001/shops/${shopId}`, { tax_status: taxStatus, tax: Number(tax) });
      userDataRefetch();
    } catch (error) {
      console.log(error);
    }
  };

  const updateServiceStatus = async (shopId: string, serviceStatus: boolean, service: number) => {
    try {
      await axios.patch(`http://localhost:3001/shops/${shopId}`, { service_status: serviceStatus, service: Number(service) });
      userDataRefetch();
    } catch (error) {
      console.log(error);
    }
  };

  const updateIncludedTaxService = async (shopId: string, includedTaxService: boolean) => {
    try {
      await axios.patch(`http://localhost:3001/shops/${shopId}`, { included_tax_service: includedTaxService });
      userDataRefetch();
    } catch (error) {
      console.log(error);
    }
  };

  const handleChangeTax = (event: any) => {
    setTax(event.target.value);
  };

  const handleChangeService = (event: any) => {
    setService(event.target.value);
  };

  return (
    <div className="overflow-y-auto max-h-96">
      <div>
        <div className=" border-b border-gray-300 py-1">
          <p className=" text-gray-500">Orders</p>
        </div>
        <div>
          <div>
            <FormControl component="fieldset" sx={{ mt: 2, px: 3 }}>
              <FormLabel component="legend" color="success">
                Tax (%)
              </FormLabel>
              <FormGroup aria-label="position" row>
                <div className="flex items-center">
                  <div>
                    {taxStatus ? (
                      <Switch sx={{ my: 0 }} color="success" onClick={() => updateTaxStatus(shopId, !taxStatus, tax)} checked />
                    ) : (
                      <Switch sx={{ my: 0 }} color="success" onClick={() => updateTaxStatus(shopId, !taxStatus, tax)} />
                    )}
                  </div>
                  <div className="pb-0">
                    {taxStatus ? <TextField disabled id="standard-basic" variant="standard" value={tax} onChange={handleChangeTax} /> : <TextField id="standard-basic" variant="standard" value={tax} onChange={handleChangeTax} />}
                  </div>
                </div>
              </FormGroup>
            </FormControl>
          </div>
          <div>
            <FormControl component="fieldset" sx={{ mt: 2, px: 3 }}>
              <FormLabel component="legend" color="success">
                Service (%)
              </FormLabel>
              <FormGroup aria-label="position" row>
                <div className="flex items-center">
                  <div>
                    {serviceStatus ? (
                      <Switch sx={{ my: 0 }} color="success" onClick={() => updateServiceStatus(shopId, !serviceStatus, service)} checked />
                    ) : (
                      <Switch sx={{ my: 0 }} color="success" onClick={() => updateServiceStatus(shopId, !serviceStatus, service)} />
                    )}
                  </div>
                  <div className="pb-0">
                    {serviceStatus ? (
                      <TextField disabled id="standard-basic" variant="standard" value={service} onChange={handleChangeService} />
                    ) : (
                      <TextField id="standard-basic" variant="standard" value={service} onChange={handleChangeService} />
                    )}
                  </div>
                </div>
              </FormGroup>
            </FormControl>
          </div>
          <div className="mt-5">
            <FormControl component="fieldset" sx={{ mt: 2, px: 3 }}>
              <FormLabel component="legend" color="success">
                Include Tax and/or Service <br /> without additional payments
              </FormLabel>
              {includedTaxService ? (
                <Switch sx={{ my: 0 }} color="success" onClick={() => updateIncludedTaxService(shopId, !includedTaxService)} checked />
              ) : (
                <Switch sx={{ my: 0 }} color="success" onClick={() => updateIncludedTaxService(shopId, !includedTaxService)} />
              )}
            </FormControl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default General;
