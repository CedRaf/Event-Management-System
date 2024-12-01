import React, { useState } from "react";

function Category({ category, editCategory, deleteCategory }) {
  const [descriptionToggle, setDescriptionToggle] = useState(false);
  const [editToggle, setEditToggle] = useState(false);
  const [editedCategory, setEditedCategory] = useState({
    category_name: category.category_name,
    category_description: category.category_description,
  });

  const toggleDescription = () => {
    setDescriptionToggle(!descriptionToggle);
  };

  return (
    <li key={category.categoryID}>
      {!editToggle ? (
        <div className="category-text-wrapper">
          <h4 onClick={toggleDescription}>{category.category_name}</h4>
          {descriptionToggle && (
            <p className="category-description">
              {category.category_description}
            </p>
          )}
        </div>
      ) : (
        <div className="category-edit-container">
          <input
            type="text"
            value={editedCategory.category_name}
            onChange={(e) =>
              setEditedCategory({
                ...editedCategory,
                category_name: e.target.value,
              })
            }
          />
          <input
            type="text"
            value={editedCategory.category_description}
            onChange={(e) =>
              setEditedCategory({
                ...editedCategory,
                category_description: e.target.value,
              })
            }
          />
          <button
            onClick={() => {
              editCategory(editedCategory, category.categoryID);
              setEditToggle(false); // Hide edit container
            }}
            className="category-save-button"
          >
            Save
          </button>
        </div>
      )}

      <button
        onClick={() => setEditToggle(!editToggle)}
        className="category-edit-button"
      >
        {editToggle ? "Cancel" : "Edit"}
      </button>
      <button onClick={() => deleteCategory(category.category_name)}>
        Delete
      </button>
    </li>
  );
}

export default Category;
