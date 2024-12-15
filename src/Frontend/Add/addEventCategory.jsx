import React, { useState, useEffect } from "react";

import "../../event-category.css";

function AddEventCategory({ createCategory, newCategory, toggleModal, setToggleModal,setNewCategory }) {
  const handleSubmit = async (e) => {
    e.preventDefault();

    createCategory(newCategory);
    setToggleModal(false);
  };

  return (
    <form onSubmit={handleSubmit} className="add-category-form">
      <input
        type="text"
        placeholder="Category Name"
        value={newCategory.category_name}
        onChange={(e) => {
          setNewCategory({ ...newCategory, category_name: e.target.value });
        }}
      />
      <input
        type="text"
        placeholder="Category Description"
        value={newCategory.category_description}
        onChange={(e) => {
          setNewCategory({
            ...newCategory,
            category_description: e.target.value,
          });
        }}
      />
      <div className="add-cancel-btn">
      <button onClick={() => setToggleModal(!toggleModal)}
          className="close-add-event-button">
          Cancel
        </button>
      <button type="submit">Add</button>
      </div>
    </form>
  );
}
export default AddEventCategory;
