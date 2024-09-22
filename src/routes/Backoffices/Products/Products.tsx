import Layout from '../Layout/Layout';
import Header from '../../../components/Backoffices/Header';
import style from '../../../assets/css/style.module.css';
import cx from 'classnames';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { API_BASE_URL, PRODUCTS_QUERY_KEY } from 'configs/utils';
import deleteIcon from '../../../assets/img/icons/icon-delete.svg';
import editIcon from '../../../assets/img/icons/icon-edit.svg';
import { useForm } from 'react-hook-form';

const Products = () => {
  // START HOOKS
  const { register, handleSubmit } = useForm();
  // END HOOKS

  // START QUERIES
  const { data: products, refetch: productsRefetch } = useQuery({
    queryKey: PRODUCTS_QUERY_KEY,
    queryFn: () =>
      axios
        .get(`${API_BASE_URL}/fnbs`)
        .then((res) => {
          return res.data.data;
        })
        .catch((err) => {
          return console.log(err);
        }),
  });

  // END QUERIES

  // START CSS
  const tableClass = cx(style.table, style.mt20);
  // END CSS

  // START FUNC
  const handleAvaibilityClick = async (id: string, availability: boolean) => {
    try {
      await axios.patch(`${API_BASE_URL}/fnbs/${id}`, { availability });

      productsRefetch();
    } catch (error) {
      console.log(error);
    }
  };
  // END FUNC

  return (
    <Layout>
      <Header title="PRODUCTS" />
      <section>
        <div className={style.buttonWrapperLeft}>
          <a href={'/backoffices/products/add'} className={style.buttonGreen}>
            Add Product
          </a>
        </div>
        <table className={tableClass}>
          <tr className={style.tableRowHead}>
            <th className={style.alignLeft}>Product Name</th>
            <th className={style.alignLeft}>Availability</th>
            <th className={style.alignLeft}>Price</th>
            <th className={style.alignLeft}>Category</th>
            <th className={style.alignLeft}>Discount Status</th>
            <th className={style.alignLeft}>Discount Percent</th>
            <th className={style.alignLeft}>Action</th>
          </tr>
          {products?.map((product: any) => {
            return (
              <tr key={product.id} className={style.tableRow}>
                <td className={style.tableCellLink}>
                  <a href={`/backoffices/products/${product.id}`}>{product.name}</a>
                </td>
                <td className={style.tableCellAvailability}>
                  {product.availability ? <div className={style.tableCellAvailable}>Available</div> : <div className={style.tableCellEmpty}>Out of Stock</div>}
                  <div className={style.availabilityAction}>
                    {product.availability ? (
                      <button
                        className={style.emptyButton}
                        onClick={() => {
                          handleAvaibilityClick(product.id, !product.availability);
                        }}
                      >
                        set as empty
                      </button>
                    ) : (
                      <button
                        className={style.availableButton}
                        onClick={() => {
                          handleAvaibilityClick(product.id, !product.availability);
                        }}
                      >
                        set as available
                      </button>
                    )}
                  </div>
                </td>
                <td className={style.tableCell}>{Intl.NumberFormat('id-ID').format(product.price)}</td>
                <td className={style.tableCell}>{product.category.name}</td>
                <td className={style.tableCell}>{product.discount_status ? 'yes' : 'no'}</td>
                <td className={style.tableCell}>{product.discount_percent ? Intl.NumberFormat('id-ID').format(product.discount_percent) : '-'}</td>
                <td className={style.tableCellAction}>
                  <a href={`/backoffices/products/${product.id}/edit`}>
                    <img src={editIcon} alt="editIcon" width={20} />
                  </a>
                  <form
                    onSubmit={handleSubmit(() => {
                      axios
                        .delete(`${API_BASE_URL}/fnbs/${product.id}`)
                        .then((res) => {
                          return window.location.reload();
                        })
                        .catch((err) => {
                          return console.log(err);
                        });
                    })}
                  >
                    <input type="hidden" {...register('id')} value={`${product.id}`} readOnly />
                    <button type="submit">
                      <img src={deleteIcon} alt="deleteIcon" width={20} />
                    </button>
                  </form>
                </td>
              </tr>
            );
          })}
        </table>
      </section>
    </Layout>
  );
};

export default Products;
