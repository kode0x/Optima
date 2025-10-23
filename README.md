# Optima

## Resource Map for Machine Learning, Data Science, and AI

This project provides an interactive web-based map for exploring a collection of resources related to **Machine Learning (ML)**, **Data Science (DS)**, and **Artificial Intelligence (AI)**. The resources are organized hierarchically using **JSON** and displayed dynamically as collapsible nodes, making it easy to explore categories and subcategories of tools, tutorials, datasets, and more.

## Project Overview

The website will load resources from a **JSON file**, which contains a hierarchical structure of categories and subcategories. Each category (node) represents a parent and can contain multiple children, such as specific resources, subcategories, or related tools.

When you click on a parent node, its children will expand, displaying the resources contained within. This makes it easy for users to navigate the network of AI/ML/DS tools and resources.

---

## Features

- **Hierarchical Resource Display**: Resources are displayed in a tree-like structure with expandable nodes for categories and subcategories.
- **Interactive Map**: Click on any parent node to reveal its children, which represent related resources.
- **Dynamic Rendering**: The JSON data will be dynamically rendered on the website without the need for reloading the page.
- **Expandable & Collapsible Nodes**: Each node can be expanded or collapsed for a better user experience.

---

## File Structure

The resources will be organized in a **JSON file** with the following structure:

```json
{
  "name": "AI Resource Map",
  "children": [
    {
      "name": "Machine Learning",
      "children": [
        {
          "name": "Supervised Learning",
          "resources": [
            {
              "title": "Linear Regression",
              "url": "https://example.com/linear-regression"
            },
            {
              "title": "Decision Trees",
              "url": "https://example.com/decision-trees"
            }
          ]
        },
        {
          "name": "Unsupervised Learning",
          "resources": [
            {
              "title": "K-means Clustering",
              "url": "https://example.com/k-means"
            },
            { "title": "PCA", "url": "https://example.com/pca" }
          ]
        }
      ]
    },
    {
      "name": "Data Science",
      "children": [
        {
          "name": "Data Visualization",
          "resources": [
            { "title": "Matplotlib", "url": "https://example.com/matplotlib" },
            { "title": "Seaborn", "url": "https://example.com/seaborn" }
          ]
        }
      ]
    }
  ]
}
```

### Explanation:

- **name**: The name of the category or resource.
- **children**: An array of subcategories or further divisions of resources.
- **resources**: A list of resources (tools, tutorials, courses, etc.) associated with a category.

---

## Project Setup

### Prerequisites

To run this project, you will need the following tools:

- **Node.js**: The project uses Node.js to serve the website.
- **npm or yarn**: To install dependencies.

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/resource-map.git
   cd resource-map
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm start
   ```

   The application should now be running at `http://localhost:3000/`.

---

## How It Works

### 1. **JSON Structure**:

The data structure is maintained in a `resources.json` file. This file contains all the categories, subcategories, and resources. The top-level categories (like "Machine Learning", "Data Science") are parents, and their children are resources or further categories.

### 2. **Frontend Rendering**:

- The website will read the `resources.json` file.
- Using JavaScript (or a frontend framework like React), the hierarchical structure will be rendered as nested clickable nodes.
- Each node represents a category or resource. Clicking on a parent node will expand it to show its children.
- Resources are displayed as clickable links that lead to external websites.

### 3. **Interactivity**:

- When you click on a parent node, it reveals the child nodes under it (representing resources or subcategories).
- The page doesn't reload—everything happens dynamically via JavaScript.

---

## Development Notes

### 1. **Frontend**:

- We use **React** to render the hierarchical structure, making it easy to manage and update the display of resources dynamically.
- Components such as `TreeNode` and `TreeView` will handle the hierarchical rendering.

### 2. **File System**:

- The **JSON file** (`resources.json`) will be placed in the `public` directory. This file will be fetched and rendered on the frontend.

### 3. **State Management**:

- The app will use **React state** to handle the expand/collapse behavior of the nodes.
- A parent node’s children will be hidden by default and revealed when clicked.

---

## Future Improvements

- **Search Functionality**: Implement a search bar to allow users to find resources by name or category.
- **Dynamic Data Updates**: Allow users to submit resources or categories, which will be dynamically added to the JSON data.
- **User Authentication**: Provide a login system for users to save their favorite resources or contribute to the project.
- **Responsive Design**: Ensure that the map is mobile-friendly and works well on all screen sizes.

---

## Example of Resources JSON

```json
{
  "name": "AI Resource Map",
  "children": [
    {
      "name": "Machine Learning",
      "children": [
        {
          "name": "Supervised Learning",
          "resources": [
            {
              "title": "Linear Regression",
              "url": "https://example.com/linear-regression"
            },
            {
              "title": "Logistic Regression",
              "url": "https://example.com/logistic-regression"
            }
          ]
        },
        {
          "name": "Unsupervised Learning",
          "resources": [
            {
              "title": "K-means Clustering",
              "url": "https://example.com/k-means"
            },
            {
              "title": "Principal Component Analysis",
              "url": "https://example.com/pca"
            }
          ]
        }
      ]
    }
  ]
}
```

---
