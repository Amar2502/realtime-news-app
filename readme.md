
# **Real-Time News Feed API Documentation**

## **Overview:**
This API powers a **Real-Time News Feed Application** that allows users to:
- Subscribe to different news categories (Tech, Business, Sports, etc.).
- Receive real-time updates on news via WebSockets.
- Fetch news from a MongoDB database using optimized aggregation queries.
- Manage the global state of the application with Redux.
- Be deployed using Docker and Kubernetes.

## **Tech Stack:**
- **Frontend:** React, Redux
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Real-Time Communication:** WebSockets (Socket.io)
- **State Management:** Redux
- **Deployment:** Docker, Kubernetes

---

## **API Endpoints:**

---

### **1. Get All News**

- **Endpoint:** `GET /getallnews/:category`
- **Method:** `GET`
- **Description:** Fetches all news articles from the specified category or all categories if `category` is "all".
- **Parameters:**
  - `category` (URL Param): The category of news (e.g., "Tech", "Business"). If "all", fetch all categories.
- **Response:**
  - **Success (200):** List of news articles.
  - **Error (500):** Internal server error.
- **Example Request:**
  ```http
  GET /getallnews/Tech
  ```
- **Example Response:**
  ```json
  [
    {
      "_id": "123",
      "title": "Tech Innovations of 2025",
      "content": "A deep dive into the latest Technological trends.",
      "category": "Tech",
      "createdAt": "2025-05-10T12:00:00Z"
    },
    ...
  ]
  ```

---

### **2. Get News By ID**

- **Endpoint:** `GET /getnews/:id`
- **Method:** `GET`
- **Description:** Fetches a specific news article by its ID.
- **Parameters:**
  - `id` (URL Param): The unique ID of the news article.
- **Response:**
  - **Success (200):** The requested news article.
  - **Error (404):** News article not found.
  - **Error (500):** Internal server error.
- **Example Request:**
  ```http
  GET /getnews/123
  ```
- **Example Response:**
  ```json
  {
    "_id": "123",
    "title": "Tech Innovations of 2025",
    "content": "A deep dive into the latest Technological trends.",
    "category": "Tech",
    "createdAt": "2025-05-10T12:00:00Z"
  }
  ```

---

### **3. Create News**

- **Endpoint:** `POST /createnews`
- **Method:** `POST`
- **Description:** Creates a new news article and emits a real-time update to all subscribers in the specified category.
- **Request Body:**
  - `title` (String): The title of the news article.
  - `content` (String): The content of the news article.
  - `category` (String): The category of the news article (e.g., "Tech", "business").
- **Response:**
  - **Success (201):** The newly created news article.
  - **Error (500):** Internal server error.
- **Example Request:**
  ```http
  POST /createnews
  Content-Type: application/json
  {
    "title": "New Trends in AI",
    "content": "Exploring the advancements in Artificial Intelligence.",
    "category": "Tech"
  }
  ```
- **Example Response:**
  ```json
  {
    "_id": "124",
    "title": "New Trends in AI",
    "content": "Exploring the advancements in Artificial Intelligence.",
    "category": "Tech",
    "createdAt": "2025-05-10T13:00:00Z"
  }
  ```

---

### **4. Delete News**

- **Endpoint:** `DELETE /deletenews`
- **Method:** `DELETE`
- **Description:** Deletes a news article by its ID.
- **Request Body:**
  - `id` (String): The ID of the news article to be deleted.
- **Response:**
  - **Success (200):** Confirmation message of successful deletion.
  - **Error (400):** ID is required.
  - **Error (404):** News article not found.
  - **Error (500):** Internal server error.
- **Example Request:**
  ```http
  DELETE /deletenews
  Content-Type: application/json
  {
    "id": "124"
  }
  ```
- **Example Response:**
  ```json
  {
    "message": "News deleted successfully"
  }
  ```

---

### **WebSocket Event:**

#### **Event: `new-news`**
- **Description:** This event is emitted when a new news article is created. It sends real-time updates to all subscribers in the respective category.
- **Payload:**
  - The newly created news article.
- **Usage:**
  - Clients who are subscribed to a specific category (via WebSocket) will receive this event and update their feed accordingly.

**Example WebSocket Payload:**
```json
{
  "_id": "124",
  "title": "New Trends in AI",
  "content": "Exploring the advancements in Artificial Intelligence.",
  "category": "Tech",
  "createdAt": "2025-05-10T13:00:00Z"
}
```

---

### **MongoDB Query Structure:**

#### **1. Get All News:**
- **Aggregation Pipeline:**
  - If a category is provided, filter by category.
  - Sort the results by creation date (descending).
- **Indexes:**
  - **Index on `category`** to speed up category-based queries.
  - **Index on `createdAt`** for faster sorting by creation date.

```javascript
const news = await News.find(query).sort({ createdAt: -1 });
```

#### **2. Create News:**
- **Insert the news document into the MongoDB collection.**

```javascript
const news = new News({ title, content, category });
await news.save();
```

---

### **Deployment:**

- **Dockerization:**
  - The application will be packaged into Docker containers for easy deployment and scaling.
  - A Dockerfile will be created for both the frontend and backend.
  
- **Kubernetes:**
  - Kubernetes will be used for orchestration, ensuring the application is highly available and scalable.
  - A deployment configuration and service definitions will be used to deploy the app in a Kubernetes cluster.

---

### **Notes:**
- **Real-time Updates:** The application uses WebSockets to push news updates to subscribed clients.
- **State Management:** Redux is used for managing the global state of the application, such as news articles and user subscriptions.
- **Performance Considerations:** MongoDB aggregation pipelines and proper indexing will ensure optimal performance for large datasets.

---

### **Testing & Postman:**
You can test this API using Postman or Swagger UI. Make sure to have MongoDB running locally or use a cloud service to test the endpoints. Each endpoint can be tested individually using Postman for GET, POST, and DELETE requests.

---
