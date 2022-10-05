import { useEffect, useState } from 'react';

import { Header } from '../../components/Header';
import api from '../../services/api';
import { Food } from '../../components/Food';
import { ModalAddFood } from '../../components/ModalAddFood';
import { ModalEditFood } from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';

interface IFood {
  id: string;
  image: string;
  name: string;
  price: number;
  description: string;
  available: boolean;
}

export function Dashboard() {
  const [foods, setFoods] = useState<IFood[]>([])
  const [editingFood, setEditingFood] = useState<IFood >({} as IFood)
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false)
  const [modalOpen, setModalOpen] = useState<boolean>(false)
 
  useEffect(() => {
    async function loadFoods() {
      const response = await api.get("/foods")

      setFoods(response.data)
    }

    loadFoods()
  }, [])

  async function handleAddFood(food:IFood) {
    try {
      const response = await api.post('/foods', {
        ...food,
        available: true
      })

      setFoods([...foods, response.data])
    } catch (err) {
      console.log(err)
    }
  }

  async function handleUpdateFood(food:IFood) {
    try {
      const foodUpdated = await api.put(
        `/foods/${editingFood.id}`,
        { ...editingFood, ...food }
      )

      const foodsUpdated = foods.map(food => 
        food.id !== foodUpdated.data.id ? food : foodUpdated.data  
      )

      setFoods(foodsUpdated)
    } catch (err) {
      console.log(err)
    }
  }

  async function handleDeleteFood(id: string) {
    await api.delete(`/foods/${id}`);
    const foodsFiltered = foods.filter(food => food.id !== id)

    setFoods(foodsFiltered)
  }

  function handleEditFood(food: IFood) {
    setEditingFood(food)
    setEditModalOpen(true)
  }

  function toggleModal() {
    setModalOpen(!modalOpen)
  }

  function toggleEditModal() {
    setEditModalOpen(!editModalOpen)
  }


  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(food => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  )
}