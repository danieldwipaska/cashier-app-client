import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React from 'react';
import { IoFastFoodOutline } from 'react-icons/io5';

const Menu = (props: any): JSX.Element => {
  const { orders, setOrders, openSummary, setOpenSummary } = props;

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () =>
      axios
        .get('http://localhost:3001/categories')
        .then((res) => {
          return res.data.data;
        })
        .catch((err) => {
          return console.log(err);
        }),
  });

  const { data: fnbs } = useQuery({
    queryKey: ['fnbs'],
    queryFn: () =>
      axios
        .get('http://localhost:3001/fnbs')
        .then((res) => {
          return res.data.data;
        })
        .catch((err) => {
          return console.log(err);
        }),
  });

  const addFnbToOrder = async (id: number) => {
    try {
      const response = await axios.get(`http://localhost:3001/fnbs/${id}`);
      if (response.data.status === 200) {
        // check if exist
        const check: any = [];

        orders.forEach((order: any) => {
          if (order.id === id) {
            check.push(id);
            order.amount++;
            setOrders([...orders]);
          }
        });

        if (!check.length)
          setOrders([
            ...orders,
            {
              id: response.data.data.id,
              name: response.data.data.name,
              category: response.data.data.category,
              price: response.data.data.price,
              amount: 1,
            },
          ]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-gray-200 max-h-screen pt-20 px-8 w-8/12">
      <div>
        <p>Order Here</p>
      </div>
      <div className="flex flex-row mt-3">
        {categories?.map((category: any, i: number) => {
          if (i === 0) {
            if (openSummary) {
              return (
                <button className="bg-white text-sm w-36 h-10 rounded-md mr-1" disabled>
                  {category.name}
                </button>
              );
            } else {
              return <button className="bg-white text-sm w-36 h-10 rounded-md hover:bg-green-300 duration-300 hover:border hover:border-green-500 mr-1">{category.name}</button>;
            }
          } else {
            if (openSummary) {
              return (
                <button className="bg-white text-sm w-36 h-10 rounded-md mx-1" disabled>
                  {category.name}
                </button>
              );
            } else {
              return <button className="bg-white text-sm w-36 h-10 rounded-md hover:bg-green-300 duration-300 hover:border hover:border-green-500 mx-1">{category.name}</button>;
            }
          }
        })}
      </div>
      <div className="bg-white mt-5 rounded-md px-5 py-3 h-4/5">
        <div>
          <p className="">Menu</p>
        </div>
        <div className="grid grid-cols-5 gap-4 mt-8 px-2 h-5/6 overflow-y-auto">
          {fnbs?.map((fnb: any) => (
            <div className="p-2 border border-black/40 rounded-lg grid grid-cols-1 content-between">
              <div>
                <div className="bg-slate-800 p-5 rounded-lg flex justify-center">
                  <IoFastFoodOutline size={80} color="#ffffff" />
                </div>
                <div className="mt-2 flex">
                  <p className="text-xs rounded-full bg-green-200 px-3 py-1">{fnb.category}</p>
                </div>
                <div className="mt-1 mx-1">
                  <p className="text-sm">{fnb.name}</p>
                </div>
                <div className="mt-1 mx-1">
                  <p className="text-sm text-end">{Intl.NumberFormat('en-us').format(fnb.price)}</p>
                </div>
              </div>
              <div className="mt-2">
                {openSummary ? (
                  <button
                    className="text-center text-xs bg-green-500 w-full rounded-md py-1"
                    onClick={() => {
                      addFnbToOrder(fnb.id);
                    }}
                    disabled
                  >
                    Add
                  </button>
                ) : (
                  <button
                    className="text-center text-xs bg-green-500 hover:opacity-70 duration-500 w-full rounded-md py-1"
                    onClick={() => {
                      addFnbToOrder(fnb.id);
                    }}
                  >
                    Add
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Menu;
