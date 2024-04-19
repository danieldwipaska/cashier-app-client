import React, { useState } from 'react';
import { BsArrowRightSquareFill, BsBoxArrowUpRight } from 'react-icons/bs';
import { FaArrowTrendUp } from 'react-icons/fa6';
import { HiOutlineAdjustments } from 'react-icons/hi';
import { MdCancel } from 'react-icons/md';
import { IoIosArrowBack } from 'react-icons/io';

const CardAction = () => {
  const [openCardDetails, setOpenCardDetails] = useState(false);
  const [action, setAction] = useState('');

  const handleOpenCardDetails = () => {
    setOpenCardDetails(!openCardDetails);
  };

  const data: {
    id: string;
    card_number: string;
    customer_id: string;
    customer_name: string;
    balance: number;
    deposit: number;
    status: 'active' | 'inactive' | 'blocked';
    is_member: boolean;
    created_at: Date;
    updated_at: Date;
  } = {
    id: 'ksbri-akhbeia-hjkbcvw-hreb',
    card_number: '0000032127345',
    customer_id: 'John Doe',
    customer_name: '0896725719873',
    balance: 0,
    deposit: 0,
    status: 'inactive',
    is_member: false,
    created_at: new Date(),
    updated_at: new Date(),
  };

  const handleTopupAction = () => {
    setAction('topup');
  };

  const handleBack = () => {
    setAction('');
  };

  return (
    <div className="bg-gray-200 max-h-screen pt-20 px-8 w-11/12">
      <div className="bg-white mt-2 py-5 px-6 rounded-md">
        <div className="grid grid-cols-2 gap-8">
          <div>
            <div className="flex justify-between items-center">
              <div>
                <h3>Gift Card</h3>
              </div>
              <div className="flex items-center">
                <div>
                  <input type="text" className="border border-black/40 py-1 px-2 rounded-md" placeholder="Enter Card Number" />
                </div>
                <button className="ml-1" onClick={handleOpenCardDetails}>
                  <BsArrowRightSquareFill size={32} />
                </button>
              </div>
            </div>
            {openCardDetails ? (
              <div>
                <div className="flex justify-center mt-7">
                  <div className="bg-black/80 shadow-2xl h-48 w-80 text-white p-6 rounded-xl">
                    <div>
                      <h4>Basic Card</h4>
                    </div>
                    <div className="mt-2">
                      <p className="font-serif text-sm">{data ? data.customer_name : 'New Card'}</p>
                    </div>
                    <div>
                      <p className="font-serif text-sm">{data ? data.customer_id : 'New Card'}</p>
                    </div>
                    <div className=" mt-10">
                      <p className="text-end mr-3">{data ? data.card_number : '0000000000'}</p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 mt-7">
                  {data?.status === 'active' ? (
                    <button className=" w-full bg-gray-600 rounded-lg px-5 pt-3 pb-4 hover:opacity-80 duration-300" onClick={handleTopupAction}>
                      <div className="flex">
                        <div className="bg-gray-500 rounded-full mt-2 shadow-lg p-2">
                          <FaArrowTrendUp color="#ffffff" size={20} />
                        </div>
                      </div>
                      <div className="flex mt-2">
                        <div>
                          <h4 className="text-white">Top-Up Card</h4>
                        </div>
                      </div>
                    </button>
                  ) : (
                    <button className=" w-full bg-gray-600 rounded-lg px-5 pt-3 pb-4 hover:opacity-80 duration-300" onClick={handleTopupAction}>
                      <div className="flex">
                        <div className="bg-gray-500 rounded-full mt-2 shadow-lg p-2">
                          <FaArrowTrendUp color="#ffffff" size={20} />
                        </div>
                      </div>
                      <div className="flex mt-2">
                        <div>
                          <h4 className="text-white">Top-Up & Activate</h4>
                        </div>
                      </div>
                    </button>
                  )}
                  {data?.status === 'active' ? (
                    <button className=" w-full bg-black/50 rounded-lg px-5 pt-3 pb-4">
                      <div className="flex">
                        <div className="bg-gray-600 rounded-full mt-2 shadow-lg p-2">
                          <BsBoxArrowUpRight color="#ffffff" size={20} />
                        </div>
                      </div>
                      <div className="flex mt-2">
                        <div>
                          <h4 className="text-white">Transfer Card</h4>
                        </div>
                      </div>
                    </button>
                  ) : (
                    <button className=" w-full bg-black/50 rounded-lg px-5 pt-3 pb-4 opacity-30" disabled>
                      <div className="flex">
                        <div className="bg-gray-600 rounded-full mt-2 shadow-lg p-2">
                          <BsBoxArrowUpRight color="#ffffff" size={20} />
                        </div>
                      </div>
                      <div className="flex mt-2">
                        <div>
                          <h4 className="text-white">Transfer Card</h4>
                        </div>
                      </div>
                    </button>
                  )}
                  {data?.status === 'active' ? (
                    <button className=" w-full bg-black/60 rounded-lg px-5 pt-3 pb-4">
                      <div className="flex">
                        <div className="bg-gray-500 rounded-full mt-2 shadow-lg p-2">
                          <HiOutlineAdjustments color="#ffffff" size={20} />
                        </div>
                      </div>
                      <div className="flex mt-1">
                        <div>
                          <h4 className="text-white">Adjust Balance</h4>
                        </div>
                      </div>
                    </button>
                  ) : (
                    <button className=" w-full bg-black/60 rounded-lg px-5 pt-3 pb-4 opacity-30" disabled>
                      <div className="flex">
                        <div className="bg-gray-500 rounded-full mt-2 shadow-lg p-2">
                          <HiOutlineAdjustments color="#ffffff" size={20} />
                        </div>
                      </div>
                      <div className="flex mt-1">
                        <div>
                          <h4 className="text-white">Adjust Balance</h4>
                        </div>
                      </div>
                    </button>
                  )}
                  {data?.status === 'active' ? (
                    <button className=" w-full bg-red-600/80 rounded-lg px-5 pt-3 pb-4">
                      <div className="flex">
                        <div className="bg-red-600 rounded-full mt-2 shadow-lg p-2">
                          <MdCancel color="#ffffff" size={20} />
                        </div>
                      </div>
                      <div className="flex mt-1">
                        <div>
                          <h4 className="text-white">Checkout Card</h4>
                        </div>
                      </div>
                    </button>
                  ) : (
                    <button className=" w-full bg-red-600/80 rounded-lg px-5 pt-3 pb-4 opacity-30" disabled>
                      <div className="flex">
                        <div className="bg-red-600 rounded-full mt-2 shadow-lg p-2">
                          <MdCancel color="#ffffff" size={20} />
                        </div>
                      </div>
                      <div className="flex mt-1">
                        <div>
                          <h4 className="text-white">Checkout Card</h4>
                        </div>
                      </div>
                    </button>
                  )}
                </div>
              </div>
            ) : null}
          </div>
          {openCardDetails && !action ? (
            <div>
              <div className="flex justify-end items-center mt-1">
                <div>
                  <h3>IDR {Intl.NumberFormat('en-us').format(1000000)}</h3>
                </div>
              </div>
              <div className="flex mt-2">
                <div>
                  <h4>Transactions</h4>
                </div>
              </div>
              <div className="flex mt-2 border-b-2 py-3">
                <div className="flex-initial w-36 px-3 text-black/40 font-serif">
                  <div>04-12-2024</div>
                  <div>20.00</div>
                </div>
                <div className="flex justify-between w-full px-3">
                  <div>
                    <div>Payment</div>
                    <div className="text-black/40 font-serif">17926002663982</div>
                  </div>
                  <div>- IDR {Intl.NumberFormat('en-us').format(260000)}</div>
                </div>
              </div>
              <div className="flex mt-2 border-b-2 py-3">
                <div className="flex-initial w-36 px-3 text-black/40 font-serif">
                  <div>04-12-2024</div>
                  <div>20.00</div>
                </div>
                <div className="flex justify-between w-full px-3">
                  <div>
                    <div>Payment</div>
                    <div className="text-black/40 font-serif">17926002663982</div>
                  </div>
                  <div>- IDR {Intl.NumberFormat('en-us').format(260000)}</div>
                </div>
              </div>
              <div className="flex mt-2 border-b-2 py-3">
                <div className="flex-initial w-36 px-3 text-black/40 font-serif">
                  <div>04-12-2024</div>
                  <div>20.00</div>
                </div>
                <div className="flex justify-between w-full px-3">
                  <div>
                    <div>Payment</div>
                    <div className="text-black/40 font-serif">17926002663982</div>
                  </div>
                  <div>- IDR {Intl.NumberFormat('en-us').format(260000)}</div>
                </div>
              </div>
              <div className="flex mt-2 border-b-2 py-3">
                <div className="flex-initial w-36 px-3 text-black/40 font-serif">
                  <div>04-12-2024</div>
                  <div>20.00</div>
                </div>
                <div className="flex justify-between w-full px-3">
                  <div>
                    <div>Payment</div>
                    <div className="text-black/40 font-serif">17926002663982</div>
                  </div>
                  <div>- IDR {Intl.NumberFormat('en-us').format(260000)}</div>
                </div>
              </div>
              <div className="flex mt-2 border-b-2 py-3">
                <div className="flex-initial w-36 px-3 text-black/40 font-serif">
                  <div>04-12-2024</div>
                  <div>20.00</div>
                </div>
                <div className="flex justify-between w-full px-3">
                  <div>
                    <div>Payment</div>
                    <div className="text-black/40 font-serif">17926002663982</div>
                  </div>
                  <div>- IDR {Intl.NumberFormat('en-us').format(260000)}</div>
                </div>
              </div>
            </div>
          ) : null}
          {action === 'topup' ? (
            <div>
              <div className="flex justify-end items-center mt-1">
                <div>
                  <h3>IDR {Intl.NumberFormat('en-us').format(1000000)}</h3>
                </div>
              </div>
              <div className="mt-2">
                <div className="flex">
                  <div>
                    <button onClick={handleBack}>
                      <IoIosArrowBack size={30} />
                    </button>
                  </div>
                  <div className="mx-2">
                    <h4>Top-Up Card</h4>
                  </div>
                </div>
                <div className="mt-4 mx-10">
                  {data?.status === 'active' ? null : (
                    <div className="flex">
                      <div>
                        <input type="text" className="border border-black/40 py-1 px-2 rounded-md w-40" placeholder="Customer Name" />
                      </div>
                      <div>
                        <input type="text" className="border border-black/40 py-1 px-2 rounded-md w-44 mx-3" placeholder="Phone Number" />
                      </div>
                    </div>
                  )}
                  <div className="mt-2">
                    <input type="number" className="border border-black/40 py-1 px-2 rounded-md w-56" placeholder="Amount of Top-Up" />
                  </div>
                  {data?.status === 'active' ? null : (
                    <div className="flex items-center mt-2">
                      <div>
                        <p className="text-xs text-black/60">This transaction will reduce Top-Up value by</p>
                      </div>
                      <div className="mx-1">
                        <input type="number" className="border border-black/40 py-1 px-2 text-sm rounded-md w-24" placeholder="Enter Deposit" value="5000" />
                      </div>
                      <div>
                        <p className="text-xs text-black/60">as a deposit.</p>
                      </div>
                    </div>
                  )}
                  {data?.status === 'active' ? (
                    <div className="mt-5">
                      <button className="py-2 px-3 bg-gray-500 text-white rounded-md hover:opacity-60 duration-300">Add Balance</button>
                    </div>
                  ) : (
                    <div className="mt-5">
                      <button className="py-2 px-3 bg-gray-500 text-white rounded-md hover:opacity-60 duration-300">Top-Up & Activate</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default CardAction;
