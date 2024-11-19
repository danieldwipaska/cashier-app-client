import { CardAction } from 'configs/utils';

export default class CustomCardActionFormValidation {
  constructor(private data: any, private action: CardAction) {
    this.data = data;
    this.action = action;
  }

  validate() {
    if (this.action === CardAction.TOPUP) return this.topupData();
    if (this.action === CardAction.ADJUST) return this.adjustData();
    if (this.action === CardAction.CHECKOUT) return this.checkoutData();

    return { errors: null, isError: false };
  }

  topupData() {
    const errors = { addBalance: '', paymentMethod: '', note: '', customerName: '', customerId: '', crewCode: '' };
    let isError = false;

    if (!this.data.addBalance) {
      errors.addBalance = 'Amount cannot be empty';
      isError = true;
    }
    if (!this.data.paymentMethod) {
      errors.paymentMethod = 'Payment Method cannot be empty';
      isError = true;
    }

    if (this.data.status === 'inactive' && !this.data.customerName) {
      errors.customerName = 'Customer name cannot be empty';
      isError = true;
    }

    if (this.data.status === 'inactive' && !this.data.customerId) {
      errors.customerId = 'Customer Phone cannot be empty';
      isError = true;
    }

    return { errors, isError };
  }

  adjustData() {
    const errors = { adjustedBalance: '', note: '' };
    let isError = false;

    if (!this.data.adjustedBalance) {
      errors.adjustedBalance = 'Amount cannot be empty';
      isError = true;
    }

    return { errors, isError };
  }

  checkoutData() {
    const errors = { paymentMethod: '', note: '' };
    let isError = false;

    if (!this.data.paymentMethod) {
      errors.paymentMethod = 'Amount cannot be empty';
      isError = true;
    }

    return { errors, isError };
  }
}
