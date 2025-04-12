from pinecone.grpc import PineconeGRPC as Pinecone
from pinecone import ServerlessSpec
from sentence_transformers import SentenceTransformer
import os
import json
from dotenv import load_dotenv
import sys
import time

#FIRST MAKE SURE YOU HAVE THE faqs.json FILE AND UPDATED, BEFORE RUNNING THIS CODE FILE.

# Load the .env file
load_dotenv()

# Load Pinecone API key and environment
my_api_key = os.getenv("PINECONE_API_KEY")
my_environment = os.getenv("PINECONE_ENVIRONMENT")  # Ensure this is set in your .env file
my_cloud = os.getenv("PINECONE_CLOUD")

# Check if the API key and environment are loaded successfully
if my_api_key is None:
    print("Error: Pinecone API key not found. Please include it in the .env file.")
    sys.exit(1)

if my_environment is None:
    print("Error: Pinecone environment not found. Please include it in the .env file.")
    sys.exit(1)

if my_cloud is None:
    print("Error: Pinecone cloud not found. Please include it in the .env file.")

# Initialize Pinecone
pc = Pinecone(api_key=my_api_key)

# Index name
index_name = "sarcathon-faq"

# Create or reset the index
available_indexes = pc.list_indexes()
index_names = [idx["name"] for idx in available_indexes]
if index_name in index_names:
    pc.delete_index(index_name)
    # Wait until the index is fully deleted
    available_indexes = pc.list_indexes()
    index_names = [idx["name"] for idx in available_indexes]
    while index_name in index_names:
        available_indexes = pc.list_indexes()
        index_names = [idx["name"] for idx in available_indexes]
        print("Waiting for index to be deleted...")
        time.sleep(2)  # wait for 2 seconds before checking again
    print(f"Index '{index_name}' has been successfully deleted.")

# Create a new index
pc.create_index(
    name=index_name,
    dimension=384,
    metric="cosine",
    spec=ServerlessSpec(
        cloud=my_cloud, 
        region=my_environment
        ) 
)
print(f"Index '{index_name}' has been successfully created.")

# Function to upload FAQ data to Pinecone with batching
def upload_faq_data(faq_data, batch_size=100):
    # Wait for the index to be ready
    print(f"Preparing '{index_name}' index for uploading faq data...")
    while not pc.describe_index(index_name).status['ready']:
        time.sleep(1)
    print(f"'{index_name}' index is ready to upload.")

    index = pc.Index(index_name)
    model = SentenceTransformer('all-MiniLM-L6-v2') 
    faq_embeddings = []

    # Prepare embeddings for each FAQ question
    for category, faqs in faq_data.items():
        for i, faq in enumerate(faqs):
            faq_id = f"{category}-{i}"  # Unique ID for each FAQ
            embedding = model.encode(faq["question"]).tolist()  # Embed the question
            faq_embeddings.append({
                "id": faq_id,
                "values": embedding,
                "metadata": {
                    "category": category,
                    "question": faq["question"],
                    "answer": faq["answer"]
                }
            })
    print("Successfully generated Sentence Embeddings for entire FAQ data.")

    # Upload embeddings to Pinecone in batches
    for i in range(0, len(faq_embeddings), batch_size):
        batch = faq_embeddings[i:i + batch_size]
        index.upsert(vectors=batch, namespace="sarc-namespace")
        print(f"Successfully uploaded {i+1} batches of FAQ data...")

# Load FAQ data from the JSON file
with open('./faqs.json') as f:
    faq_data = json.load(f)

# Upload the FAQ data with batching
upload_faq_data(faq_data, batch_size=100)

print("FAQ data uploaded successfully.")