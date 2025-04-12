# AI-Enabled Smart FAQ Module (with AutoTranslate)

<!-- > For our same application without the **AutoTranslate** feature $\rightarrow$ visit [this GitHub repository](https://github.com/ShashankRapolu07/SARCathon-AI.git).-->

## Overview
The Smart FAQ Module is a FAQ-retrieval system designed to improve the user experience on the SARAS AI Institute website. It helps users find the answers they need by intelligently understanding their questions and showing the most relevant FAQs by leveraging AI capabilities.

## Features
1. **Intelligent FAQ Matching:**
   - The module uses AI Embedding Model to grasp what the user is asking, rather than just matching keywords.
   - Uses Attention Mechanism to capture contextually similar FAQs ensuring users receive the most relevant answers.

2. **Real-Time Search with Fast Responses:**
   - Utilized [Pinecone Vector Database](https://www.pinecone.io/) for quick and efficient searches, ensuring minimal latency.
   - Capable of handling numerous concurrent requests without degradation in performance.

3. **Multilingual Support:**
   - Automatically detects the language of the user’s query using [Google Cloud Translation API](https://cloud.google.com/translate/docs/reference/rest/).
   - SARAS AI being a global institute, the inclusion of multi-lingual support broadens the reach to non-English speaking users, enhancing inclusivity and user satisfaction.

4. **Scalability:**
   - Code is organized in a way that makes it easy to add new features and functionality.
   - Leverages cloud services like **Pinecone** (vector database) and **Google Cloud** (translation API), making it robust to scaling as needed.

5. **Responsive User-Interface:**
   - UI is designed in such a way to make it compatible with different screen sizes (laptops/tables/mobiles, etc.).
  
## Tech Stack Used
- **Frontend:** React.js, HTML5, CSS3, Axios, Lodash (Debounce).
- **Backend:** Python 3.8+, FastAPI, SentenceTransformers, Pinecone, Google Cloud Translate API, uvicorn, pydantic, dotenv.
- **Other Tools and Services:** Node.js, npm.

## Installation and Setup
Before starting, make sure you have the following installed and set up:
1. **Node.js and npm Installation:** [click here](https://www.youtube.com/watch?v=EIzdQxMXcrc&pp=ygUcTm9kZS5qcyBhbmQgTlBNIGluc3RhbGxhdGlvbg%3D%3D)
2. **Python Installation:** [click here](https://www.youtube.com/watch?v=ExJHGEn6gt0&ab_channel=AmitThinks)
3. **Pinecone Account Setup:** [click here](https://docs.pinecone.io/guides/get-started/quickstart)
4. **Google Cloud Translate API Setup:** [click here](https://www.youtube.com/watch?v=l2TlFyXmiBQ&feature=youtu.be)

### Step 1: Clone this GitHub Repository
Follow [this link](https://www.youtube.com/watch?v=EhxPBMQFCaI&feature=youtu.be) for a general tutorial.

### Step 2: Setting Up the Frontend
1. From the root directory, navigate to the `/frontend` directory using: `cd frontend`
2. Install Frontend Dependencies: `npm install`
3. Configure Environment Variables:
   - Create a `.env` file inside the `frontend/` directory with the following variables:
     - `REACT_APP_API_URL=https://localhost:8000` (DO NOT put it as `str`)
4. Start the React development server (The application will typically run on `http://localhost:3000` by default) using: `npm start`

### Step 3: Setting Up the Backend
> **Note:** Make sure you are connected to the Internet before starting the backend server.
1. From the root directory, navigate to the `/backend` directory: `cd backend`
2. Install Backend Dependencies: `pip install -r requirements.txt`
   - **NOTE:** You might get a LongPath issue (in Windows) during the installation of the `sentence-transformers` library. If this is the case, [watch this tutorial](https://www.youtube.com/watch?v=JIBsJx7U0Xw&ab_channel=MDTechVideos) on how to solve this issue.
3. Configure Environment Variables:
   - Create a `.env` file inside the `backend/` directory with the following variables:
     - `PINECONE_API_KEY="your_pinecone_api_key"`
     - `PINECONE_ENVIRONMENT="your_pinecone_environment"` (e.g., "us-east-1")
     - `PINECONE_CLOUD="your_pinecone_cloud"` (e.g., "aws")
     - `GOOGLE_APPLICATION_CREDENTIALS="path/to/your/service-account-file.json"` (e.g., ".\sarcathon-translation-api-e028f675c335.json")
     - `FRONTEND_URL="http://localhost:3000"` (Put it as `str`)

### Step 4: 
- Update the `faqs.json` file in both `frontend/` and `backend/`, only if you want to change the FAQ data.

### Step 5:
- Upload the FAQ data to your Pinecone Vector Database using: `python upload_faq_data.py` (make sure you provide `PINECONE_API_KEY` first in the `.env` file)

### Step 6:
- Start the FastAPI server using uvicorn: `python -m uvicorn main:app --reload`

> **NOTE:** Until the hackathon deadline, we are giving you our Pinecone Vector DB API for quicker setup and ease of access. This is temporary and will be removed post-hoc. UPDATE: API key removed.

> **NOTE:** To use the **AutoTranslate** feature, you must generate your own **Google Cloud Translation API** key. Otherwise the application doesn't work.

## FAQ Matching Process (Step-by-Step)
The FAQ matching process ensures users receive relevant answers quickly. Here's how it works, step-by-step:

1. **User Input and Query Processing**
   - **User Input:** The user types a question into the search bar on the website.
   - **Front-End Handling:** The React.js front-end captures the user query and, using a debounce function, waits briefly before sending the query to the back-end, to prevent unnecessary requests.

2. **Language Detection Mechanism**
   - **Sending the Query:** The front-end sends the user’s query to the back-end via a `POST` request to the `/search` endpoint.
   - **Language Detection:** The FastAPI back-end uses the Google Cloud Translate API to detect the language of the query.
     - If the language is not English, it records the detected language for later translation.
     - Supports English, Hindi, Spanish, and German currently.

3. **Query Translation (\*if necessary)**
   - **Translation to English:** If the query is in a different language, the back-end translates it to English using the Google Cloud Translate API.
   - **Purpose:** The embedding model is optimized for English, so translation ensures accurate processing.

4. **Generating Embeddings with SentenceTransformer**
   - **Sentence Embedding Generation:** The back-end uses the `SentenceTransformer` model (`all-MiniLM-L6-cos-v1`) to convert the (possibly translated) query into a numerical vector (embedding).
   - **Semantic Representation:** The embedding captures the meaning of the query in a form that can be compared with stored FAQs.

5. **Searching the Pinecone Vector Database**
   - **Querying Pinecone:** The back-end sends the query embedding to the Pinecone vector database.
   - **Similarity Search:** Pinecone searches for embeddings of FAQs that are most similar to the user query embedding using an advanced and efficient technique: Approximate Nearest Neighbor Search (ANN).
     - Using ANN leads to faster search responses as we don’t need to compute similarity scores with respect to every FAQ embedding stored in the vector database, making the application robust to scaling.
   - **Retrieving Matches:** It retrieves the top 5 most relevant FAQs based on cosine similarity scores.
     - The number of FAQs retrieved is set to 5 for now. This can be changed by modifying the `top_k` argument value in the `./backend/main.py` file.

6. **Retrieving Most Similar FAQs**
   - **Fetching Results:** Pinecone returns the matching FAQs along with their metadata (question, answer, category).
   - The retrieved results are sorted based on the cosine-similarity score.

7. **Translating FAQs Back to User's Language (\*if necessary)**
   - **Check Detected Language:** If the original query was not in English, the back-end translates the retrieved FAQs back into the user's language, especially the questions/answers contained in the metadata.
   - **Batch Translation:** Questions and answers are translated in batches using the Google Cloud Translate API to improve efficiency.
     - This makes the translation process faster and efficient, reducing the I/O response time for the user query and also making the application robust to scaling in case of gigantic FAQ data.
   - **Original Text Preservation:** The original English FAQs are preserved for reference and potential future use.

8. **Presenting Results to the User**
   - **Sending Response:** The back-end sends the (translated) FAQs to the front-end in JSON format, including the detected language.
   - **Front-End Display:** The React.js front-end receives the FAQs and updates the user interface.
   - **Language Selection:** A language selector allows users to choose their preferred language. If the language is changed, the retrieved FAQ data is sent back to the backend which re-uses Google Cloud Translate API for translation before sending it back to the front-end again.

## Attention Mechanism for Intelligent FAQ Retrieval
The attention mechanism in the Smart FAQ Module helps the system better understand and match user questions. Instead of treating all words in a query the same, it focuses on the most important parts of the question.

- **Contextual Understanding:** The attention mechanism helps the system pay more attention to the important words in a question, making it easier to understand what the user is really asking.
- **Better Matching of Similar Questions:** The attention mechanism enables comparing two or more questions contextually rather than word-to-word, like in the case of Exact Match Keyword retrieval.

We used the `all-MiniLM-L6-v2` Transformer model from the `SentenceTransformer` library for this attention-enabled FAQ retrieval.

## AutoTranslate Feature (Multi-Lingual Support)
As SARAS AI is a global institute, their websie must be language agnostic. For this reason, we included an **AutoTranslate** feature where in the user can type their queries in any language and the system autmatically detects the language and shows relevant FAQs in that language. Currently, to not increase burden on the **Google Translation API**, we included four languages: **English**, **Hindi**, **Spanish** and **German**. By supporting multiple languages, the FAQ system makes it easier for non-English speakers to find information in their own preferred language. Our application can automatically detect the user-preferred language based on his search query, which means users don’t need to choose their language manually, making it easier for them to get the answers they need.

### Testing:
You can test the multi-lingual feature in our application by directly typing the following user queries in the search bar:
- **English:** “What is the admission process?”, “How to apply?”, “How are classes conducted?”, “I am poor”, “I don't have money and cannot afford the tuition fee.”, etc.
- **Spanish:** “Cuáles son los requisitos de admisión?”, “Quiénes son los miembros de la facultad?”, “Con qué empresas tienen alianzas?”, etc.
- **German:** “Wie lange dauert der Zulassungsprozess?”, “Haben Sie Networking-Programme für Studenten?”, “Kann ich verschiedene Arten von finanzieller Unterstützung kombinieren?”, etc.
- **Hindi:** “क्या बिना पूर्व डिग्री के आवेदन किया जा सकता है?”, “कार्यक्रम में कौन-कौन सी क्षमताएँ विकसित की जाती हैं?”, etc.

## Performance and Scalability

### Why Traditional NoSQL/SQL Databases are Slow and Inefficient?
Traditional NoSQL/SQL databases like MongoDB, Firebase, etc., rely upon **Exact Document Matching Search** for data retrieval. If the FAQ dataset is large (>1 million parameters), we need to fetch the entire data into the local machine and perform similarity search using Cosine-Similarity/Euclidean-Distance. This makes relevant FAQ retrieval extremely slow and inefficient.

### How Vector Databases are Faster and Efficient?
Instead of performing a similarity search with respect to all the FAQs in the database (like SQL/NoSQL databases), Vector Databases (like **Pinecone**) use ingenious techniques for comparing user queries only with closely-related FAQs. This is enabled by the usage of special data structures called **Hierarchical Navigable Small World (HNSW) graphs**, which store vector embeddings and metadata in an eccentric way. The search mechanism is called **Approximate Nearest Neighbor Search (ANN)**, where the user embedding is queried only with its nearest neighbors (stored vector embeddings).

#### Approximate Nearest Neighbor (ANN) Search:
Pinecone Vector Database has an efficient search mechanism that is robust to scaling. It uses a type of **Approximate Nearest Neighbor Search (ANN)** called **Hierarchical Navigable Small World (HNSW)** for faster and efficient retrieval of closest FAQ data. Even if the FAQ dataset is large (>1 million FAQs), this mechanism enables comparing the reference embedding only with its closest neighbors in the database, making it highly efficient and robust to scaling.
- In Pinecone, the `ef` argument inside the `index.query()` method controls the number of nearest neighbors to compute similarity scores with.

> **NOTE:** As the FAQ dataset (`faqs.json`) is small in our case, we compared the user query with all the FAQ embeddings to not compromise on retrieval accuracy.

## Our Application Snapshots

#### UI Design:

| At Scroll Position 0 | At Scroll Position X|
|---------------------------------|---------------------------------|
| ![UI Design at 0 Scroll Position](1-UI%20Design%201.png) | ![UI Design at X Scroll Position](1-UI%20Design%202.png) |

#### Intelligent FAQ Retrieval:

| User Query 1 | User Query 2 |
|---------------------------------|---------------------------------|
| ![UI Design at X Scroll Position](2-FAQ%20Retrieval%20Testing%202.png) | ![UI Design at 0 Scroll Position](2-FAQ%20Retrieval%20Testing%201.png) |

#### Responsive Design:

| At Scroll Position 0 | At Scroll Position X |
|---------------------------------|---------------------------------|
| ![UI Design at 0 Scroll Position](3-Responsive%20Design%201.png) | ![UI Design at X Scroll Position](3-Responsive%20Design%202.png) |

#### Multi-Lingual Support:

| Spanish | German |
|---------------------------------|---------------------------------|
| ![UI Design at 0 Scroll Position](4-AutoTranslate%201.png) | ![UI Design at X Scroll Position](4-AutoTranslate%202.png) |

#### AutoTranslate Feature:

| Spanish |
|---------------------------------|
| ![UI Design at 0 Scroll Position](4-AutoTranslate%203.gif) |
