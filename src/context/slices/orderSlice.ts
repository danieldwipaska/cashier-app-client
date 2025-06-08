import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ReportStatus } from 'configs/utils';

export interface Order {
  id: string;
  card_id: string;
  card_number: string;
  customer_name: string;
  customer_id: string;
  method_id: string;
  crew_id: string;
  status?: ReportStatus;
  note: string;
  total_payment: number;
  total_payment_after_tax_service: number;
  items: Item[];
}

export interface ServiceAndTax {
  tax: number;
  service: number;
  included_tax_service: boolean;
}

export interface UpdateOrder extends Partial<Order> {}

export interface UpdateServiceAndTax extends Partial<ServiceAndTax> {}

export interface Item {
  id?: string;
  fnb_id: string;
  fnb_name?: string;
  fnb_category?: string;
  amount: number;
  refunded_amount?: number;
  price: number;
  discount_percent: number;
}

export interface OrderState {
  order: Order;
  serviceAndTax: ServiceAndTax;
}

const initialState: OrderState = {
  order: {
    id: '',
    card_id: '',
    card_number: '',
    customer_name: '',
    customer_id: '',
    method_id: '',
    crew_id: '',
    note: '',
    total_payment: 0,
    total_payment_after_tax_service: 0,
    items: [],
  },
  serviceAndTax: {
    tax: 0,
    service: 0,
    included_tax_service: true,
  },
};

export const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setOrder: (state, action: PayloadAction<Order>) => {
      state.order = action.payload;
    },
    setServiceAndTax: (state, action: PayloadAction<ServiceAndTax>) => {
      state.serviceAndTax = action.payload;
    },
    updateOrder: (state, action: PayloadAction<UpdateOrder>) => {
      const updates = action.payload;
      if (state.order) {
        state.order = { ...state.order, ...updates };
      }
    },
    updateServiceAndTax: (state, action: PayloadAction<UpdateServiceAndTax>) => {
      const updates = action.payload;
      if (state.serviceAndTax) {
        state.serviceAndTax = { ...state.serviceAndTax, ...updates };
      }
    },
    clearOrder: (state) => {
      state.order = {
        id: '',
        card_id: '',
        card_number: '',
        customer_name: '',
        customer_id: '',
        method_id: '',
        crew_id: '',
        note: '',
        total_payment: 0,
        total_payment_after_tax_service: 0,
        items: [],
      };
    },
    clearServiceAndTax: (state) => {
      state.serviceAndTax = {
        tax: 0,
        service: 0,
        included_tax_service: true,
      };
    },
    addOrUpdateItem: (state, action: PayloadAction<Item>) => {
      const item = action.payload;
      if (state.order) {
        const existingItemIndex = state.order.items.findIndex((i) => i.fnb_id === item.fnb_id);
        if (existingItemIndex > -1) {
          // Update existing item
          state.order.items[existingItemIndex].amount += item.amount;
          state.order.items[existingItemIndex].price = item.price;
          state.order.items[existingItemIndex].fnb_name = item.fnb_name;
          state.order.items[existingItemIndex].fnb_category = item.fnb_category;
          state.order.items[existingItemIndex].discount_percent = item.discount_percent;
        } else {
          // Add new item
          state.order.items.push(item);
        }
      }
    },
    increaseItemAmount: (state, action: PayloadAction<string>) => {
      const fnbId = action.payload;
      const item = state.order.items.find((i) => i.fnb_id === fnbId);
      if (item) {
        item.amount += 1;
      }
    },
    decreaseItemAmount: (state, action: PayloadAction<string>) => {
      const fnbId = action.payload;
      const item = state.order.items.find((i) => i.fnb_id === fnbId);
      if (item) {
        if (item.amount > 1) {
          item.amount -= 1;
        } else {
          // If amount is 1, remove the item from the order
          state.order.items = state.order.items.filter((i) => i.fnb_id !== fnbId);
        }
      }
    },
  },
});

export const { setOrder, setServiceAndTax, updateOrder, updateServiceAndTax, clearOrder, clearServiceAndTax, addOrUpdateItem, increaseItemAmount, decreaseItemAmount } = orderSlice.actions;

export default orderSlice.reducer;
