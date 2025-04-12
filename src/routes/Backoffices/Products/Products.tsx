import Layout from '../Layout/Layout';
import Header from '../../../components/Backoffices/Header';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { PRODUCTS_QUERY_KEY } from 'configs/utils';
import deleteIcon from '../../../assets/img/icons/icon-delete.svg';
import editIcon from '../../../assets/img/icons/icon-edit.svg';
import { useEffect, useState } from 'react';
import Pagination from 'components/Pagination';
import { useMessages } from 'context/MessageContext';

const Products = () => {
  // START CONTEXTS
  const { showMessage } = useMessages();
  // END CONTEXTS

  // START STATES
  const [page, setPage] = useState(1);
  // END STATES

  // START QUERIES
  const { data: products, refetch: productsRefetch } = useQuery({
    queryKey: PRODUCTS_QUERY_KEY,
    queryFn: () =>
      axios
        .get(`${process.env.REACT_APP_API_BASE_URL}/fnbs?page=${page}`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          if (err.status === 404) return [];
          return console.log(err);
        }),
  });

  // END QUERIES

  // START FUNC
  const handleAvailabilityClick = async (id: string, availability: boolean) => {
    try {
      const response = await axios.patch(`${process.env.REACT_APP_API_BASE_URL}/fnbs/${id}`, { availability });

      const product = response.data.data;

      showMessage(`${product.name} is ${product.availability ? 'now available' : 'out of stock'}`, 'success');
      productsRefetch();
    } catch (error) {
      console.log(error);
    }
  };
  // END FUNC

  // START HOOKS
  useEffect(() => {
      productsRefetch();
      window.scrollTo(0, 0);
    }, [page, productsRefetch]);
  // END HOOKS

  return (
    <Layout>
      <Header title="PRODUCTS" />
      <section>
        <div className="mb-5">
          <a href={'/backoffices/products/add'} className="bg-green-300 py-3 px-5 rounded-lg">
            Add
          </a>
        </div>
        <table className="w-full">
          <tr className="bg-green-200">
            <th className="border-b-4 py-3 px-2 text-left">Product Name</th>
            <th className="border-b-4 py-3 px-2 text-left">Availability</th>
            <th className="border-b-4 py-3 px-2 text-left">Price</th>
            <th className="border-b-4 py-3 px-2 text-left">Category</th>
            <th className="border-b-4 py-3 px-2 text-left">Discount Status</th>
            <th className="border-b-4 py-3 px-2 text-left">Discount Percent</th>
            <th className="border-b-4 py-3 px-2 text-left">Action</th>
          </tr>
          {products?.data?.map((product: any) => {
            return (
              <tr key={product.id} className="border-b-2 hover:bg-gray-100 duration-200">
                <td className="py-3 px-2">
                  <a href={`/backoffices/products/${product.id}`} className='font-semibold hover:opacity-70 duration-100'>{product.name}</a>
                </td>
                <td className="py-3 px-2">
                  <div className='flex items-center gap-2'>
                    {product.availability ? <div className='text-green-700'>Available</div> : <div className='text-red-700'>Out of Stock</div>}
                    <button
                      className="rounded-full bg-gray-300 px-2 py-1"
                      onClick={() => {
                        handleAvailabilityClick(product.id, !product.availability);
                      }}
                    >
                      set as empty
                    </button>
                  </div>
                </td>
                <td className="py-3 px-2">{Intl.NumberFormat('id-ID').format(product.price)}</td>
                <td className="py-3 px-2">{product.category.name}</td>
                <td className="py-3 px-2">{product.discount_status ? 'yes' : 'no'}</td>
                <td className="py-3 px-2">{product.discount_percent ? Intl.NumberFormat('id-ID').format(product.discount_percent) : '-'}</td>
                <td className="py-3 px-2">
                  <div className='flex items-center gap-2'>
                    <a href={`/backoffices/products/${product.id}/edit`} className=''>
                      <img src={editIcon} alt="editIcon" width={20} />
                    </a>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        axios
                          .delete(`${process.env.REACT_APP_API_BASE_URL}/fnbs/${product.id}`)
                          .then((res) => {
                            productsRefetch();
                          })
                          .catch((err) => {
                            return console.log(err);
                          });
                      }} className='flex items-center'
                    >
                      <button type="submit" className=''>
                        <img src={deleteIcon} alt="deleteIcon" width={20} />
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            );
          })}
        </table>
        <Pagination setPage={setPage} pageMetaData={products?.pageMetaData} />
      </section>
    </Layout>
  );
};

export default Products;
