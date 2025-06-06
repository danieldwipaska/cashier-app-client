import { FormControl, FormGroup, FormLabel, Switch, TextField } from '@mui/material';
import axios from 'axios';
import { useMessages } from 'context/MessageContext';

const General = ({
  shopId,
  tax,
  setTax,
  service,
  setService,
  includedTaxService,
  setIncludedTaxService,
  userDataRefetch,
}: {
  shopId: any;
  setShopId: any;
  discountStatus: any;
  setDiscountStatus: any;
  discount: any;
  tax: any;
  setTax: any;
  setTaxStatus: any;
  service: any;
  setService: any;
  setServiceStatus: any;
  includedTaxService: any;
  setIncludedTaxService: any;
  userDataRefetch: any;
}) => {
  // START HOOKS
  const { showMessage } = useMessages();
  // END HOOKS

  const handleIncludeTaxAndService = (event: any) => {
    setIncludedTaxService(!includedTaxService);
  }

  const handleChangeTax = (event: any) => {
    setTax(+event.target.value);
  };

  const handleChangeService = (event: any) => {
    setService(+event.target.value);
  };

  const handleUpdateGeneralSettings = async (event: any) => {
    try {
      await axios.patch(`${process.env.REACT_APP_API_BASE_URL}/shops/${shopId}`, {
        included_tax_service: includedTaxService,
        tax: tax,
        service: service,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access-token')}`,
        },
      });

      userDataRefetch();

      showMessage('General settings updated successfully', 'success');
    } catch (error) {
      showMessage('Failed to update general settings', 'error');
      console.log(error);
    }
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
                  <div className="pb-0">
                    <TextField id="standard-basic" variant="standard" value={tax} onChange={handleChangeTax} />
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
                  <div className="pb-0">
                    <TextField id="standard-basic" variant="standard" value={service} onChange={handleChangeService} />
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
                <Switch sx={{ my: 0 }} color="success" onClick={handleIncludeTaxAndService} checked />
              ) : (
                <Switch sx={{ my: 0 }} color="success" onClick={handleIncludeTaxAndService} />
              )}
            </FormControl>
          </div>
          <div className="mt-8">
            <button className="py-2 px-3 bg-green-400 rounded-md hover:opacity-80 duration-200" onClick={handleUpdateGeneralSettings}>
              Update
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default General;
