import Layout from '../Layout/Layout';
import Header from 'components/Backoffices/Header';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useMessages } from 'context/MessageContext';
import { useQuery } from '@tanstack/react-query';
import { MODIFIERS_QUERY_KEY } from 'configs/utils';
import { useEffect, useState } from 'react';

const ProductModifier = () => {
  // START HOOKS
  const { productId } = useParams();
  const { showMessage } = useMessages();

  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  // END HOOKS

  const [modifiers, setModifiers] = useState<any>([]);

  // START QUERIES
  const { data: product } = useQuery({
    queryKey: ['product', productId],
    queryFn: () =>
      axios
        .get(`${process.env.REACT_APP_API_BASE_URL}/fnbs/${productId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access-token')}`,
          },
        })
        .then((res) => {
          return res.data.data;
        })
        .catch((err) => {
          return console.log(err);
        }),
  });

  const { data: modifiersData } = useQuery({
    queryKey: MODIFIERS_QUERY_KEY,
    queryFn: () =>
      axios
        .get(`${process.env.REACT_APP_API_BASE_URL}/modifiers`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access-token')}`,
          },
        })
        .then((res) => {
          return res.data.data;
        })
        .catch((err) => {
          return console.log(err);
        }),
  });

  // END QUERIES

  useEffect(() => {
      if (modifiersData && product) {
        const modifierData = modifiersData.map((modifier: any) => {
          const isChecked = product?.FnbModifier?.find((modifierObj: any) => {
            return modifierObj.modifier.id === modifier.id;
          });
  
          return {
            modifier_id: modifier.id,
            modifier_name: modifier.name,
            checked: !!isChecked,
          };
        });
        setModifiers(modifierData);
      } else if (modifiersData && !product) {
        // If no backoffice settings exist yet, set all categories as unchecked
        const modifierData = modifiersData.map((modifier: any) => {
          return {
            modifier_id: modifier.id,
            modifier_name: modifier.name,
            checked: false,
          };
        });
        setModifiers(modifierData);
      }
    }, [modifiersData, product]);

  const onSubmit = (_: any) => {
    const payload = {
      fnbModifiers: modifiers
        .filter((modifier: any) => modifier.checked)
        .map((modifier: any) => {
          return {
            modifier_id: modifier.modifier_id,
          };
        }),
    };

    axios
      .patch(`${process.env.REACT_APP_API_BASE_URL}/fnbs/${productId}`, payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access-token')}`,
        },
      })
      .then((res) => {
        showMessage('Modifier added successfully', 'success');
        return navigate(`/backoffices/products/${productId}`, { replace: true });
      })
      .catch((err) => {
        return console.log(err);
      });
  };

  // START FUNCTIONS
  const updateModifier = (id: any, checked: any) => {
    const updatedModifiers = modifiers?.map((modifier: any) => {
      if (modifier.modifier_id === id) {
        return {
          ...modifier,
          checked,
        };
      } else {
        return modifier;
      }
    });

    if (updatedModifiers.length) setModifiers(updatedModifiers);
  };

  return (
    <Layout>
      <Header title={`ADD MODIFIER OF ${product?.name.toUpperCase()}`} />
      <section>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-2 max-w-[300px]">
              <label className="" htmlFor="modifierId">
                Modifier
              </label>
              <div className="flex flex-col gap-3">
              {modifiers?.map((modifier: any, index: number) => {
                return (
                  <label key={modifier.modifier_id} htmlFor={`modifier-${index}`} className="flex gap-1 flex-1 min-w-32">
                    <input
                      type="checkbox"
                      id={`modifier-${index}`}
                      {...register('modifiers')}
                      value={modifier.modifier_name}
                      onChange={(event) => {
                        updateModifier(modifier.modifier_id, event.target.checked);
                      }}
                      checked={modifier.checked}
                    />
                    {modifier.modifier_name}
                  </label>
                );
              })}
            </div>
            </div>
            <br />
            <br />
            <div>
              <button type="submit" className="bg-green-300 py-2 px-3 rounded-lg">
                Submit
              </button>
            </div>
          </div>
        </form>
      </section>
    </Layout>
  );
};

export default ProductModifier;
