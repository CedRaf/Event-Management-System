import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar.jsx";
import AddEventCategory from "../Add/AddEventCategory.jsx";

import "../../event-category.css";
import Category from "../components/Category.jsx";

//import getByCategoryAPI from '../components/EventAPI.jsx'

function EventCategory() {
  const [newCategory, setNewCategory] = useState({
    category_name: "",
    category_description: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);
  const [addtoggle, setAddToggle] = useState(false);
  const [editedCategory, setEditedCategory] = useState("");
  const [token, setToken] = useState("");
  const [user, setUser] = useState("");
  const [error, setError] = useState(null);
  const [filteredCategories, setFilteredCategories] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    const parsedUser = JSON.parse(storedUser);
    if (parsedUser && storedToken) {
      setToken(storedToken);
      setUser(parsedUser);
    }
  }, []);

  useEffect(() => {
    const getCategories = async () => {
      if (!token && !user) {
        //because these arent initialized right away
        return;
      }
      try {
        const response = await axios.get(
          `http://localhost:3000/eventCategory/findAll/${user.userID}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response) {
          setCategories(response.data);
          setFilteredCategories(response.data);
        }
      } catch (error) {
        console.error("Error retrieving categories:", error);
      }
    };
    getCategories();
  }, [token, user]);

  const searchCategory = (searchTerm) => {
    if (searchTerm) {
      const results = categories.filter(
        (category) =>
          category.category_name
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) // Case-insensitive search
      );
      setFilteredCategories(results);
      
    } else {
      setFilteredCategories(categories);
    }
  };

  const createCategory = async (newCategory) => {
    //category_name, category_description, userID body
    //returns newCategory

    try {
      // you can't set the userID in this function because we need to actually have the userID before we can create a category, setting something only gets called after the function is done no matter how early we put the function
      // so we need to set the userID in the createCategory function
      const categoryData = {
        category_name: newCategory.category_name,
        category_description: newCategory.category_description,
        userID: user.userID,
      };

      const response = await axios.post(
        `http://localhost:3000/eventCategory/create`,
        categoryData,
        {
          headers: {
            Authorization: `Bearer: ${token}`,
          },
        }
      );
      if (response && response.data.newCategory) {
        setCategories((prevCategories) => {
          const updatedCategories = [...prevCategories, response.data.newCategory];
          setFilteredCategories(updatedCategories); // Update another dependent state
          return updatedCategories; // This becomes the new categories state
        });
        
        setNewCategory({
          category_name: "",
          category_description: "",
        });
      }
    } catch (e) {
      setError("Could not register category. Please try again later.");
    }
  };

  const deleteCategory = async (category_name) => {
    //category_name, userID body
    //returns deletedCategory
    try {
      const response = await axios.delete(
        `http://localhost:3000/eventCategory/delete`,
        {
          headers: {
            Authorization: `Bearer: ${token}`,
          },
          data: {
            category_name: category_name,
            userID: user.userID,
          },
        }
      );
      if (response && response.data) {
        setFilteredCategories((prevCategories) =>
          prevCategories.filter(
            (category) =>
              category.categoryID !== response.data.deletedCategory.categoryID
          )
        );
        
      }
    } catch (e) {
      setError("Could not delete category. Please try again later.");
    }
  };

  const editCategory = async (editedCategory, categoryID) => {
    try {
      const response = await axios.patch(
        `http://localhost:3000/eventCategory/edit/${categoryID}`,
        editedCategory,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response && response.data.updatedCategory) {
        setCategories((prevCategories) => {
          const updatedCategories = prevCategories.map((cat) =>
            cat.categoryID === response.data.updatedCategory.categoryID
              ? response.data.updatedCategory
              : cat
          );
        
          // Use the updated categories to immediately update filteredCategories
          setFilteredCategories(updatedCategories);
        
          return updatedCategories; // Return the updated state for `setCategories`
        });
      }
    } catch (e) {
      setError("Could not update category. Please try again later.");
    }
  };

  return (
    <div className="eventCategory">
      <Sidebar />
      <div className="cat-list-container">
        <div className="category-top-container">
          <h1>Categories</h1>
          <div className="category-input-container">
            <input
              type="text"
              placeholder="search keywords, categories, etc.."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
              }}
              className="category-input"
            />
            <button
              onClick={() => searchCategory(searchTerm)}
              className="category-search-button"
            >
              {" "}
              Search{" "}
            </button>
          </div>
       
        <div className="category-list-box">
        <ul className="category-list">
          {filteredCategories.map((category) => {
            <li key={category.categoryID} ></li>
            return (
              <Category
                category={category}
                editCategory={editCategory}
                deleteCategory={deleteCategory}
              >
                {" "}
              </Category>
              
            );
          })}
        </ul>
        </div>
        <div className="create-category-container">
          <button
            onClick={() => setAddToggle((prevState) => !prevState)}
            className="toggle-create-category"
          >
            {" "}
            Create a New Category{" "}
          </button>
          {addtoggle && (
            <div>
              <AddEventCategory
                createCategory={createCategory}
                newCategory={newCategory}
                setNewCategory={setNewCategory}
              />
            </div>
          )}
        </div>
        </div>
      </div>
    </div>
  );
}
export default EventCategory;
